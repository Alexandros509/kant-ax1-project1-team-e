import { mockCartItems } from '@/domains/cart/mocks/cart.mock';
import type {
    ShippingDetails,
    TestPaymentItem,
} from '@/domains/orders/types/order.types';

export class PaymentError extends Error {
    constructor(
        public code: string,
        message: string,
        public status = 400,
    ) {
        super(message);
    }
}

export function objectValue(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new PaymentError('INVALID_REQUEST', '요청 정보를 확인해 주세요.');
    }
    return value as Record<string, unknown>;
}

function text(value: unknown, max: number, required = true) {
    if (
        typeof value !== 'string' ||
        value.trim().length > max ||
        (required && !value.trim())
    ) {
        throw new PaymentError(
            'INVALID_SHIPPING',
            '배송지 정보를 확인해 주세요.',
        );
    }
    return value.trim();
}

export function validateShipping(value: unknown): ShippingDetails {
    const data = objectValue(value);
    const shipping = {
        recipientName: text(data.recipientName, 100),
        recipientPhone: text(data.recipientPhone, 20),
        postalCode: text(data.postalCode, 5),
        addressLine1: text(data.addressLine1, 200),
        addressLine2: text(data.addressLine2 ?? '', 200, false),
        shippingMessage: text(data.shippingMessage ?? '', 200, false),
    };
    if (
        !/^\+?[0-9][0-9\s-]{8,19}$/.test(shipping.recipientPhone) ||
        !/^\d{5}$/.test(shipping.postalCode)
    ) {
        throw new PaymentError(
            'INVALID_SHIPPING',
            '연락처와 우편번호를 확인해 주세요.',
        );
    }
    return shipping;
}

export function quoteTestItems(value: unknown): {
    items: TestPaymentItem[];
    amount: number;
    orderName: string;
} {
    if (!Array.isArray(value) || value.length < 1 || value.length > 30) {
        throw new PaymentError('INVALID_CART', '주문할 상품을 확인해 주세요.');
    }
    const seen = new Set<number>();
    const items = value.map((entry) => {
        const item = objectValue(entry);
        const catalog = mockCartItems.find(
            (candidate) => candidate.productVariantId === item.productVariantId,
        );
        if (
            !catalog ||
            item.cartItemId !== catalog.id ||
            seen.has(catalog.productVariantId) ||
            !Number.isSafeInteger(item.quantity) ||
            (item.quantity as number) < 1 ||
            (item.quantity as number) > 99
        ) {
            throw new PaymentError(
                'INVALID_CART',
                '테스트 상품과 수량을 확인해 주세요.',
            );
        }
        seen.add(catalog.productVariantId);
        // 브라우저가 보낸 가격·상품명은 사용하지 않고 서버의 테스트 상품 기준으로 계산한다.
        return {
            cartItemId: catalog.id,
            productVariantId: catalog.productVariantId,
            quantity: item.quantity as number,
            name: catalog.productNameAtAdded,
            option: catalog.optionTextAtAdded,
            unitPrice: catalog.unitPriceAtAdded,
        };
    });
    const amount = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
    );
    const orderName =
        `${items[0].name}${items.length > 1 ? ` 외 ${items.length - 1}건` : ''}`.slice(
            0,
            100,
        );
    return { items, amount, orderName };
}

export function validateConfirmation(value: unknown) {
    const data = objectValue(value);
    if (
        typeof data.orderId !== 'string' ||
        !/^test_[0-9a-f-]{36}$/.test(data.orderId) ||
        typeof data.paymentKey !== 'string' ||
        !/^[A-Za-z0-9_-]{1,200}$/.test(data.paymentKey) ||
        !Number.isSafeInteger(data.amount) ||
        (data.amount as number) <= 0
    ) {
        throw new PaymentError(
            'INVALID_PAYMENT',
            '결제 승인 정보를 확인해 주세요.',
        );
    }
    return {
        orderId: data.orderId,
        paymentKey: data.paymentKey,
        amount: data.amount as number,
    };
}

export function verifyApprovedPayment(
    value: unknown,
    expected: { orderId: string; paymentKey: string; amount: number },
) {
    const payment = objectValue(value);
    if (
        payment.orderId !== expected.orderId ||
        payment.paymentKey !== expected.paymentKey ||
        payment.totalAmount !== expected.amount ||
        payment.currency !== 'KRW' ||
        payment.status !== 'DONE' ||
        typeof payment.approvedAt !== 'string' ||
        !Number.isFinite(Date.parse(payment.approvedAt)) ||
        typeof payment.method !== 'string'
    ) {
        throw new PaymentError(
            'PAYMENT_NOT_APPROVED',
            '결제 승인을 확인하지 못했습니다. 다시 확인해 주세요.',
            409,
        );
    }
    return { method: payment.method, approvedAt: payment.approvedAt };
}
