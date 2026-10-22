export interface ShippingDetails {
    recipientName: string;
    recipientPhone: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string;
    shippingMessage: string;
}

export interface CheckoutItem {
    cartItemId: number;
    productVariantId: number;
    quantity: number;
}

export interface TestPaymentItem extends CheckoutItem {
    name: string;
    option: string | null;
    unitPrice: number;
}

export interface PreparedTestPayment {
    orderId: string;
    orderName: string;
    amount: number;
    customerKey: string;
    customerName: string;
    clientKey: string;
    integration: 'window' | 'legacy';
    successUrl: string;
    failUrl: string;
}

export interface TestPaymentReceipt {
    orderId: string;
    orderName: string;
    amount: number;
    method: string;
    approvedAt: string;
    items: TestPaymentItem[];
    testMode: true;
}
