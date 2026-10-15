import type { FileInfo } from '@/domains/files/types/file.types';

/** 상품 목록과 상세 화면에서 사용하는 상품 정보 */
export interface Product {
    id: number;
    
    categoryId: number;         /* 상품이 속한 소분류 ID (예: 11 = JACKET, 12 = COAT) */
    categoryName: string;
    name: string;
    size: number;               /* 현재 목업 데이터에서 사용하는 숫자형 사이즈 값 */
    detail: string;
    productCare: string;
    shipping: string;
    images: FileInfo[];
    listPrice: number;          /* 정가 (원) */
    salePrice: number;          /* 판매가 (원) */
    new: boolean;               /* 신상품 여부 */
}
