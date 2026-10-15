import type { CartItem } from '@/domains/cart/types/cart.types';

export const mockCartItems: CartItem[] = [
    {
        id: 1,
        cartId: 1,
        productVariantId: 1,
        quantity: 1,
        unitPriceAtAdded: 189000, //장바구니 담은 시점의 가격
        productNameAtAdded: 'ONEPIECE Shell Jacket', //장바구니 담은 시점의 상품명
        optionTextAtAdded: 'BLACK / M', //장바구니 담은 시점의 옵션 텍스트
        imageUrlAtAdded: '/images/cart/outerJacketBlack.png', //장바구니 담은 시점의 이미지 URL
    },
    {
        id: 2,
        cartId: 1,
        productVariantId: 2,
        quantity: 1,
        unitPriceAtAdded: 69000, //장바구니 담은 시점의 가격
        productNameAtAdded: 'ONEPIECE T-Shirt', //장바구니 담은 시점의 상품명
        optionTextAtAdded: 'WHITE / L', //장바구니 담은 시점의 옵션 텍스트
        imageUrlAtAdded: '/images/cart/topTShirtBlack.png', //장바구니 담은 시점의 이미지 URL
    },
];
