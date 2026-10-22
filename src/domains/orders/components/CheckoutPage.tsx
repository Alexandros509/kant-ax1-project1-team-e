'use client';

import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import {
    openTestPayment,
    preparePayment,
} from '@/domains/orders/api/tossPayment';
import type { ShippingDetails } from '@/domains/orders/types/order.types';

import CheckoutForm from '@/domains/orders/components/CheckoutForm';
import OrderSummary from '@/domains/orders/components/OrderSummary';
import useCounterStore from '@/shared/store/useCounterStore';

export default function CheckoutPage() {
    const cartItems = useCounterStore((state) => state.cartItems);
    const hasHydrated = useCounterStore((state) => state.hasHydrated);
    const formId = useId();
    const [paymentMessage, setPaymentMessage] = useState('');
    const [sdkReady, setSdkReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const submitting = useRef(false);
    const attempt = useRef<{ payload: string; key: string } | null>(null);

    async function handlePayment(shipping: ShippingDetails) {
        if (submitting.current) return;
        submitting.current = true;
        setBusy(true);
        setPaymentMessage('');
        try {
            const payload = JSON.stringify({ cartItems, shipping });
            if (attempt.current?.payload !== payload) {
                attempt.current = { payload, key: crypto.randomUUID() };
            }
            const order = await preparePayment(
                cartItems,
                shipping,
                attempt.current.key,
            );
            await openTestPayment(order);
            attempt.current = null;
        } catch (error) {
            const canceled =
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'USER_CANCEL';
            setPaymentMessage(
                canceled
                    ? '결제를 취소했습니다. 다시 시도할 수 있습니다.'
                    : error instanceof Error
                      ? error.message
                      : '결제창을 열지 못했습니다. 다시 시도해 주세요.',
            );
            if (canceled) attempt.current = null;
        } finally {
            submitting.current = false;
            setBusy(false);
        }
    }

    return (
        <main
            lang="ko"
            className="mx-auto min-h-[75vh] max-w-7xl px-5 py-10 sm:px-9 sm:py-12"
        >
            <Script
                src="https://js.tosspayments.com/v2/standard"
                strategy="afterInteractive"
                onReady={() => setSdkReady(true)}
                onError={() =>
                    setPaymentMessage(
                        '결제창을 불러오지 못했습니다. 페이지를 새로고침해 주세요.',
                    )
                }
            />
            <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gray-500 hover:text-black"
            >
                <ArrowLeft size={14} aria-hidden="true" />
                장바구니로 돌아가기
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-6 pt-7 pb-10">
                <h1 className="text-[28px] font-normal tracking-wider">
                    주문 / 결제
                </h1>
                <ol
                    aria-label="주문 진행 단계"
                    className="flex items-center gap-3 text-[10px] tracking-widest text-gray-400"
                >
                    <li>
                        <Link href="/cart" className="hover:text-black">
                            장바구니
                        </Link>
                    </li>
                    <li aria-hidden="true" className="h-px w-6 bg-gray-200" />
                    <li aria-current="step" className="text-black">
                        주문 / 결제
                    </li>
                    <li aria-hidden="true" className="h-px w-6 bg-gray-200" />
                    <li>주문 완료</li>
                </ol>
            </div>

            <p className="mb-7 text-xs leading-6 text-gray-500">
                로그인한 계정에 테스트 주문과 결제 내역이 저장됩니다.{' '}
                <Link href="/login" className="underline underline-offset-4">
                    로그인
                </Link>
                {' · '}
                <Link href="/mypage" className="underline underline-offset-4">
                    주문 내역
                </Link>
            </p>

            {!hasHydrated ? (
                <p
                    role="status"
                    className="py-20 text-center text-sm text-gray-500"
                >
                    주문 정보를 불러오는 중입니다…
                </p>
            ) : cartItems.length === 0 ? (
                <section className="border-y border-gray-200 py-20 text-center">
                    <h2 className="text-sm tracking-wide">
                        장바구니가 비어 있습니다
                    </h2>
                    <p className="mt-3 text-xs text-gray-500">
                        상품을 장바구니에 담은 후 주문해 주세요.
                    </p>
                    <Link
                        href="/products"
                        className="mt-7 inline-block bg-black px-7 py-4 text-xs text-white hover:bg-gray-800"
                    >
                        쇼핑 계속하기
                    </Link>
                </section>
            ) : (
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.9fr)] lg:gap-15">
                    <CheckoutForm
                        formId={formId}
                        onSubmit={handlePayment}
                        onChange={() => setPaymentMessage('')}
                        busy={busy}
                    />
                    <OrderSummary
                        items={cartItems}
                        formId={formId}
                        paymentMessage={paymentMessage}
                        busy={busy}
                        sdkReady={sdkReady}
                    />
                </div>
            )}
        </main>
    );
}
