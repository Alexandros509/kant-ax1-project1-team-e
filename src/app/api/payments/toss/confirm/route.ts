import { cookies } from 'next/headers';

import {
    SESSION_COOKIE,
    confirmTestPayment,
} from '@/domains/orders/server/testPayment';
import {
    paymentErrorResponse,
    paymentRequestBody,
} from '@/domains/orders/server/paymentRoute';

export async function POST(request: Request) {
    try {
        const body = await paymentRequestBody(request);
        const cookieStore = await cookies();
        const receipt = await confirmTestPayment(
            body,
            cookieStore.get(SESSION_COOKIE)?.value,
        );
        return Response.json(receipt, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        return paymentErrorResponse(error);
    }
}
