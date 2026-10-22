import { cookies } from 'next/headers';

import {
    SESSION_COOKIE,
    checkoutSession,
    prepareTestPayment,
} from '@/domains/orders/server/testPayment';
import {
    paymentErrorResponse,
    paymentRequestBody,
} from '@/domains/orders/server/paymentRoute';

export async function POST(request: Request) {
    try {
        const body = await paymentRequestBody(request);
        const cookieStore = await cookies();
        const session = checkoutSession(cookieStore.get(SESSION_COOKIE)?.value);
        const payment = await prepareTestPayment(
            body,
            session,
            new URL(request.url).origin,
        );
        cookieStore.set(SESSION_COOKIE, session, {
            httpOnly: true,
            sameSite: 'lax',
            secure: new URL(request.url).protocol === 'https:',
            path: '/',
            maxAge: 86400,
        });
        return Response.json(payment, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        return paymentErrorResponse(error);
    }
}
