import { Suspense } from 'react';
import ProductList from '@/domains/products/components/ProductList';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function Products() {
    // ProductList는 useSearchParams로 ?category= 값을 읽으므로 Suspense로 감싸야 빌드 시 정적 렌더링이 실패하지 않습니다.
    return (
        <Suspense>
            <ProductList products={MOCK_PRODUCTS} />
        </Suspense>
    );
}
