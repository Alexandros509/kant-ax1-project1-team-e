import ProductList from '@/domains/products/components/ProductList';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function Products() {
    return <ProductList products={MOCK_PRODUCTS} />;
}
