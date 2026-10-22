'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mockCartItems } from '@/domains/cart/mocks/cart.mock';
import type { CartItem } from '@/domains/cart/types/cart.types';
import type { TestPaymentReceipt } from '@/domains/orders/types/order.types';

interface CartStore {
    cartItems: CartItem[];
    setCartItems: (update: (previousItems: CartItem[]) => CartItem[]) => void;
    hasHydrated: boolean;
    completedTestOrders: string[];
    applyTestPayment: (receipt: TestPaymentReceipt) => void;
}

const useCounterStore = create<CartStore>()(
    persist(
        (set) => ({
            cartItems: mockCartItems,
            hasHydrated: false,
            completedTestOrders: [],

            // 상품 목록과 Header가 같은 변경 결과를 읽도록 공통 상태를 갱신한다.
            setCartItems: (update) => {
                set((state) => ({
                    cartItems: update(state.cartItems),
                }));
            },
            applyTestPayment: (receipt) =>
                set((state) => {
                    if (state.completedTestOrders.includes(receipt.orderId))
                        return state;
                    return {
                        completedTestOrders: [
                            ...state.completedTestOrders,
                            receipt.orderId,
                        ],
                        cartItems: state.cartItems.flatMap((item) => {
                            const purchased = receipt.items.find(
                                (paid) =>
                                    paid.cartItemId === item.id &&
                                    paid.productVariantId ===
                                        item.productVariantId,
                            );
                            const quantity =
                                item.quantity - (purchased?.quantity ?? 0);
                            return quantity > 0 ? [{ ...item, quantity }] : [];
                        }),
                    };
                }),
        }),
        {
            name: 'onepiece-cart',
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
            partialize: (state) => ({
                cartItems: state.cartItems,
                completedTestOrders: state.completedTestOrders,
            }),
        },
    ),
);

export default useCounterStore;
