import ProductGrid from '@/domains/products/components/ProductGrid';
import type { Product } from '@/domains/products/types/product.types';

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    return (
        <section
            aria-labelledby="product-list-title"
            className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10"
        >
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-neutral-200 pb-5">
                <h1
                    id="product-list-title"
                    className="text-xl font-semibold tracking-wide sm:text-2xl"
                >
                    ALL PRODUCTS
                </h1>
                <p className="shrink-0 text-sm text-neutral-500">
                    총 {products.length}개 상품
                </p>
            </div>
            <ProductGrid products={products} />
        </section>
    );
}
