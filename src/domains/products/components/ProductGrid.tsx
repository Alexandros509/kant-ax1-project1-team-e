import ProductCard from '@/domains/products/components/ProductCard';
import type { Product } from '@/domains/products/types/product.types';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <p className="py-24 text-center text-sm text-neutral-500">
                등록된 상품이 없습니다.
            </p>
        );
    }

    return (
        <ul
            aria-label="상품 목록"
            className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
        >
            {products.map((product) => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}
