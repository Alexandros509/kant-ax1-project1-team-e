import 'server-only';

import {
    createHash,
    randomBytes,
    randomUUID,
    timingSafeEqual,
} from 'node:crypto';
import {
    mkdir,
    open,
    readFile,
    rename,
    stat,
    unlink,
    writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import type {
    PreparedTestPayment,
    ShippingDetails,
    TestPaymentItem,
    TestPaymentReceipt,
} from '@/domains/orders/types/order.types';
import {
    PaymentError,
    objectValue,
    quoteTestItems,
    validateConfirmation,
    validateShipping,
    verifyApprovedPayment,
} from './testPaymentValidation';

export const SESSION_COOKIE = 'onepiece_test_checkout';
const directory = path.join(process.cwd(), '.local', 'test-payments');
const digest = (value: string) =>
    createHash('sha256').update(value).digest('hex');

interface TestOrder {
    orderId: string;
    orderName: string;
    amount: number;
    items: TestPaymentItem[];
    shipping: ShippingDetails;
    ownerHash: string;
    createdAt: number;
    paymentKey?: string;
    receipt?: TestPaymentReceipt;
}

export function testPaymentConfig() {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() ?? '';
    const secretKey = process.env.TOSS_SECRET_KEY?.trim() ?? '';
    const window =
        clientKey.startsWith('test_gck_') && secretKey.startsWith('test_gsk_');
    const legacy =
        clientKey.startsWith('test_ck_') && secretKey.startsWith('test_sk_');
    if (!window && !legacy) {
        throw new PaymentError(
            'TEST_KEYS_REQUIRED',
            '토스 테스트 결제 키가 설정되지 않았습니다. 관리자에게 문의해 주세요.',
            503,
        );
    }
    return {
        clientKey,
        secretKey,
        integration: window ? ('window' as const) : ('legacy' as const),
    };
}

export function checkoutSession(existing?: string) {
    return existing && /^[a-f0-9]{64}$/.test(existing)
        ? existing
        : randomBytes(32).toString('hex');
}

async function saveOrder(order: TestOrder) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const temporary = path.join(
        directory,
        `${order.orderId}.${randomUUID()}.tmp`,
    );
    await writeFile(temporary, JSON.stringify(order), { mode: 0o600 });
    await rename(temporary, path.join(directory, `${order.orderId}.json`));
}

async function ownedOrder(
    orderId: string,
    session?: string,
): Promise<TestOrder> {
    if (!session || !/^[a-f0-9]{64}$/.test(session)) {
        throw new PaymentError(
            'CHECKOUT_SESSION_REQUIRED',
            '결제를 시작한 브라우저에서 다시 확인해 주세요.',
            403,
        );
    }
    let order: TestOrder;
    try {
        order = JSON.parse(
            await readFile(path.join(directory, `${orderId}.json`), 'utf8'),
        );
    } catch {
        throw new PaymentError(
            'ORDER_NOT_FOUND',
            '테스트 주문을 찾을 수 없습니다. 주문을 다시 시작해 주세요.',
            404,
        );
    }
    if (
        !timingSafeEqual(
            Buffer.from(order.ownerHash, 'hex'),
            Buffer.from(digest(session), 'hex'),
        )
    ) {
        throw new PaymentError(
            'ORDER_NOT_FOUND',
            '테스트 주문을 찾을 수 없습니다.',
            404,
        );
    }
    return order;
}

export async function prepareTestPayment(
    body: unknown,
    session: string,
    origin: string,
): Promise<PreparedTestPayment> {
    const config = testPaymentConfig();
    const data = objectValue(body);
    const shipping = validateShipping(data.shipping);
    const quote = quoteTestItems(data.items);
    if (data.expectedAmount !== quote.amount) {
        throw new PaymentError(
            'AMOUNT_CHANGED',
            '상품 금액이 변경되었습니다. 장바구니를 확인한 후 다시 시도해 주세요.',
            409,
        );
    }
    const orderId = `test_${randomUUID()}`;
    await saveOrder({
        ...quote,
        orderId,
        shipping,
        ownerHash: digest(session),
        createdAt: Date.now(),
    });
    return {
        orderId,
        orderName: quote.orderName,
        amount: quote.amount,
        customerKey: digest(session).slice(0, 40),
        customerName: shipping.recipientName,
        clientKey: config.clientKey,
        integration: config.integration,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
    };
}

async function tossRequest(
    secretKey: string,
    endpoint: string,
    init: RequestInit = {},
) {
    try {
        const response = await fetch(
            `https://api.tosspayments.com/v1/payments${endpoint}`,
            {
                ...init,
                cache: 'no-store',
                signal: AbortSignal.timeout(15000),
                headers: {
                    Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                    ...init.headers,
                },
            },
        );
        const data: unknown = await response.json();
        if (!response.ok)
            throw new PaymentError(
                'TOSS_APPROVAL_FAILED',
                '토스에서 결제를 승인하지 못했습니다. 다시 확인하거나 결제를 다시 시도해 주세요.',
                502,
            );
        return data;
    } catch (error) {
        if (error instanceof PaymentError) throw error;
        throw new PaymentError(
            'TOSS_UNAVAILABLE',
            '결제 결과를 확인하지 못했습니다. 잠시 후 승인 상태를 다시 확인해 주세요.',
            502,
        );
    }
}

// 동일 주문의 중복 요청은 같은 토스 멱등키를 사용한다. 재시작 후에도 키가 유지된다.
export async function confirmTestPayment(
    body: unknown,
    session?: string,
): Promise<TestPaymentReceipt> {
    const { secretKey } = testPaymentConfig();
    const input = validateConfirmation(body);
    await ownedOrder(input.orderId, session);
    const lockPath = path.join(directory, `${input.orderId}.lock`);
    const lockInfo = await stat(lockPath).catch(() => null);
    // 승인·복구 요청의 최대 대기 시간(30초)보다 길게 두고, 중단된 서버의 잠금만 복구한다.
    if (lockInfo && Date.now() - lockInfo.mtimeMs > 120000)
        await unlink(lockPath).catch(() => {});
    const lock = await open(lockPath, 'wx', 0o600).catch(() => {
        throw new PaymentError(
            'PAYMENT_PROCESSING',
            '이미 승인 처리 중입니다. 잠시 후 승인 상태를 다시 확인해 주세요.',
            409,
        );
    });
    try {
        return await confirmOwnedOrder(input, session, secretKey);
    } finally {
        await lock.close();
        await unlink(lockPath).catch(() => {});
    }
}

async function confirmOwnedOrder(
    input: ReturnType<typeof validateConfirmation>,
    session: string | undefined,
    secretKey: string,
): Promise<TestPaymentReceipt> {
    const order = await ownedOrder(input.orderId, session);
    if (input.amount !== order.amount)
        throw new PaymentError(
            'AMOUNT_MISMATCH',
            '주문 금액과 결제 금액이 일치하지 않습니다.',
            409,
        );
    if (order.paymentKey && order.paymentKey !== input.paymentKey)
        throw new PaymentError(
            'PAYMENT_KEY_MISMATCH',
            '주문의 결제 정보가 일치하지 않습니다.',
            409,
        );
    if (order.receipt) return order.receipt;
    if (Date.now() - order.createdAt > 30 * 60 * 1000)
        throw new PaymentError(
            'ORDER_EXPIRED',
            '테스트 주문이 만료되었습니다. 주문을 다시 시작해 주세요.',
            409,
        );

    order.paymentKey = input.paymentKey;
    await saveOrder(order);
    let payment: unknown;
    try {
        payment = await tossRequest(secretKey, '/confirm', {
            method: 'POST',
            headers: { 'Idempotency-Key': `${order.orderId}-confirm` },
            body: JSON.stringify(input),
        });
    } catch (approvalError) {
        // 응답 유실 또는 이미 승인된 결제는 조회 API의 실제 상태로 복구한다.
        try {
            payment = await tossRequest(
                secretKey,
                `/${encodeURIComponent(input.paymentKey)}`,
            );
        } catch {
            throw approvalError;
        }
    }
    const approved = verifyApprovedPayment(payment, input);
    const receipt: TestPaymentReceipt = {
        orderId: order.orderId,
        orderName: order.orderName,
        amount: order.amount,
        items: order.items,
        ...approved,
        testMode: true,
    };
    await saveOrder({ ...order, receipt });
    return receipt;
}
