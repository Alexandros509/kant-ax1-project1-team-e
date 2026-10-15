'use client';

import Link from 'next/link';
import CartItemList from '@/domains/cart/components/CartItemList';
import CartSummary from '@/domains/cart/components/CartSummary';
import useCounterStore from '@/shared/store/useCounterStore';

export default function CartPage() {
    const cartItems = useCounterStore((state) => state.cartItems);
    const setCartItems = useCounterStore((state) => state.setCartItems);

    function handleIncreaseQuantity(cartItemId: number) {
        // 연속 클릭에도 직전 상태를 기준으로 수량을 계산한다.
        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item.id === cartItemId
                    ? // 원본 객체를 직접 바꾸지 않고 선택한 상품만 새 객체로 만든다.
                      { ...item, quantity: item.quantity + 1 }
                    : item,
            ),
        );
    }
    function handleDecreaseQuantity(cartItemId: number) {
        // 버튼 상태와 별개로, 상태 변경 로직에서도 최소 수량 1개를 보장한다.
        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item.id === cartItemId
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item,
            ),
        );
    }

    function handleRemoveItem(cartItemId: number) {
        // 원본 배열을 직접 바꾸지 않고, 삭제할 상품을 제외한 목록으로 갱신한다.
        setCartItems((previousItems) =>
            previousItems.filter((item) => item.id !== cartItemId),
        );
    }

    return (
        <main className="mx-auto max-w-none px-12 py-12">
            <h1 className="mb-8 text-2xl font-semibold">CART</h1>

            {/* 목록과 쇼핑 링크를 같은 열에 두고, 주문 요약을 옆에 배치한다. */}
            <div className="grid items-start gap-8 md:grid-cols-[2fr_1fr] md:gap-x-16 xl:gap-x-100">
                <div>
                    <CartItemList
                        items={cartItems}
                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}
                        onRemoveItem={handleRemoveItem}
                    />

                    <Link
                        href="/products"
                        className="mt-6 inline-flex border border-gray-300 px-5 py-3 text-sm"
                    >
                        계속 쇼핑하기
                    </Link>
                </div>

                {/* 상품이 있을 때만 주문 요약을 표시한다. */}
                {cartItems.length > 0 && <CartSummary items={cartItems} />}
            </div>
        </main>
    );
}
