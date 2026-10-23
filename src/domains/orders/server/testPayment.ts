import 'server-only';

import type { PreparedTestPayment } from '@/domains/orders/types/order.types';
import {
    PaymentError,
    objectValue,
    validateCheckoutItems,
    validateShipping,
} from './testPaymentValidation';
import { paymentRpc } from './paymentDatabase';
import { confirmStoredPayment } from './paymentWorkflow';

export function testPaymentConfig() {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() ?? '';
    const secretKey = process.env.TOSS_SECRET_KEY?.trim() ?? '';
    const window =
        clientKey.startsWith('test_gck_') && secretKey.startsWith('test_gsk_');
    const legacy =
        clientKey.startsWith('test_ck_') && secretKey.startsWith('test_sk_');
    if (!window && !legacy)
        throw new PaymentError(
            'TEST_KEYS_REQUIRED',
            '토스 테스트 결제 키가 설정되지 않았습니다. 관리자에게 문의해 주세요.',
            503,
        );
    return {
        clientKey,
        secretKey,
        integration: window ? ('window' as const) : ('legacy' as const),
    };
}

export async function prepareTestPayment(
    body: unknown,
    userId: string,
    origin: string,
): Promise<PreparedTestPayment> {
    const config = testPaymentConfig();
    const data = objectValue(body);
    const shipping = validateShipping(data.shipping);
    const items = validateCheckoutItems(data.items);
    if (
        typeof data.idempotencyKey !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            data.idempotencyKey,
        ) ||
        !Number.isSafeInteger(data.expectedAmount) ||
        (data.expectedAmount as number) <= 0
    ) {
        throw new PaymentError(
            'INVALID_REQUEST',
            '주문 요청 정보를 확인해 주세요.',
        );
    }
    const order = await paymentRpc('prepare_my_test_checkout', {
        p_idempotency_key: data.idempotencyKey,
        p_items: items,
        p_shipping: shipping,
        p_expected_amount: data.expectedAmount,
    });
    return {
        orderId: order.orderId,
        orderName: order.orderName,
        amount: order.amount,
        customerKey: userId,
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
                '토스에서 결제를 승인하지 못했습니다. 승인 상태를 다시 확인해 주세요.',
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

export async function confirmTestPayment(body: unknown, userId: string) {
    const { secretKey } = testPaymentConfig();
    return confirmStoredPayment(
        body,
        userId,
        {
            // 회원은 DB 함수가 로그인 세션의 auth.uid()로 확인합니다.
            bind: (_userId, input) =>
                paymentRpc('bind_my_test_payment', {
                    p_toss_order_id: input.orderId,
                    p_payment_key: input.paymentKey,
                    p_amount: input.amount,
                }),
            complete: (_userId, input, approval) =>
                paymentRpc('complete_my_test_payment', {
                    p_toss_order_id: input.orderId,
                    p_payment_key: input.paymentKey,
                    p_amount: input.amount,
                    p_approval: approval,
                }),
        },
        {
            confirm: (input, key) =>
                tossRequest(secretKey, '/confirm', {
                    method: 'POST',
                    headers: { 'Idempotency-Key': key },
                    body: JSON.stringify(input),
                }),
            get: (key) => tossRequest(secretKey, `/${encodeURIComponent(key)}`),
        },
    );
}
