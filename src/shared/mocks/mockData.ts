// 카테고리 트리, 게시판 목록, 공용 파일 정보를 모의 데이터로 구성
import type { FileInfo } from '@/domains/files/types/file.types';

import type { Product } from '@/domains/products/types/product.types';

// parentId가 null이면 대분류,
// 값이 있으면 해당 대분류에 속하는 소분류입니다.
export const MOCK_CATEGORIES = [
    // 대분류
    { id: 1, name: 'OUTER', parentId: null },
    { id: 2, name: 'TOP', parentId: null },
    { id: 3, name: 'BOTTOM', parentId: null },

    // OUTER 소분류
    { id: 11, name: 'JACKET', parentId: 1 },
    { id: 12, name: 'COAT', parentId: 1 },

    // TOP 소분류
    { id: 21, name: 'SHIRT', parentId: 2 },
    { id: 22, name: 'SWEATER', parentId: 2 },
    { id: 23, name: 'HOODIE', parentId: 2 },

    // BOTTOM 소분류
    { id: 31, name: 'PANTS', parentId: 3 },
    { id: 32, name: 'DENIM', parentId: 3 },
];

// 상품 이미지의 공용 파일 정보를 생성합니다.
function createMockProductImage(
    id: number,
    filename: string,
    fileSize: number,
): FileInfo {
    return {
        id,
        gid: `mock-product-${id}`,
        location: 'product_main',
        original_name: filename,
        content_type: 'image/png',
        extension: 'png',
        file_size: fileSize,
        done: true,
        seq: 1,
        created_at: '2026-09-01T00:00:00.000Z',
        url: `/products/${filename}`,
    };
}

const COMMON_PRODUCT_INFO = {
    size: 1,
    productCare: `Manufactured : Sep 2026
Quality warranty : in accordance with applicable laws and consumer dispute resolution regulations

제조년월 : 2026년 9월
품질 보증 기준 : 관련법 및 소비자 분쟁해결 규정에 따름
공식채널 구매만 A/S 가능

Made in China
*세탁 및 관리 시 제품에 부착된 케어라벨의 취급 주의사항을 확인해 주시기 바랍니다.`,
    shipping: `Shipping
배송 지역: 전국 (일부 지역 제외)
택배사 : CJ대한통운 (1588-1255)
배송비 : 조건부 무료 (주문금액 70,000원 미만 시 3,000원 부과)
배송 기간: 영업일 기준 1–3일 소요
*퀵 서비스 및 매장 픽업 서비스 미제공
*제주 및 도서·산간 지역 배송 시 추가 배송비 3,500원 부과

Returns
신청 기간: 수령일로부터 7일 이내 (마이페이지 → 주문내역)
처리 방식: 접수 후 영업일 내로 순차 진행 (지정 택배사 자동 수거)
*반품 시 6,000원 차감 후 환불 처리 (오배송·불량은 해당 없음)
*제주 및 도서·산간 지역 반품·교환 시 왕복 배송비 13,000원 부과`,
};

export const MOCK_PRODUCTS: Product[] = [
    {
        ...COMMON_PRODUCT_INFO,
        id: 1,
        categoryId: 12,
        categoryName: 'COAT',
        name: '화이트 싱글 코트',
        detail: `Shell : Cotton 65%, Polyester 35%
Lining : Polyester 100%

- Relaxed fit with a clean silhouette
- Single-breasted button closure
- Side pockets for everyday essentials

겉감: 면 65%, 폴리에스터 35%
안감: 폴리에스터 100%

- 여유로운 핏과 깔끔한 실루엣
- 싱글 버튼 여밈
- 실용적인 양쪽 사이드 포켓
- 밝은 색상으로 다양한 스타일에 활용하기 좋은 코트

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(1, 'outer-coat-white.png', 1670384)],
        listPrice: 158000,
        salePrice: 153260,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 2,
        categoryId: 22,
        categoryName: 'SWEATER',
        name: '화이트 크루넥 스웨터',
        detail: `Body : Cotton 60%, Acrylic 40%

- Soft knit texture
- Classic crew neckline
- Ribbed cuffs and hem

본체: 면 60%, 아크릴 40%

- 부드러운 촉감의 니트 조직
- 기본 크루넥 디자인
- 소매와 밑단의 리브 마감
- 단독 착용과 레이어드에 모두 활용하기 좋은 스웨터

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(2, 'top-sweater-white.png', 2183822)],
        listPrice: 78000,
        salePrice: 75660,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 3,
        categoryId: 31,
        categoryName: 'PANTS',
        name: '릴랙스드 데일리 팬츠',
        detail: `Body : Cotton 98%, Polyurethane 2%

- Relaxed straight fit
- Comfortable stretch fabric
- Front and back pockets

본체: 면 98%, 폴리우레탄 2%

- 여유로운 스트레이트 핏
- 움직임이 편안한 신축성 있는 원단
- 앞뒤 포켓 구성
- 일상에서 편하게 착용할 수 있는 데일리 팬츠

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(3, 'bottom.png', 1780930)],
        listPrice: 68000,
        salePrice: 65960,
        new: false,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 4,
        categoryId: 21,
        categoryName: 'SHIRT',
        name: '베이직 코튼 셔츠',
        detail: `Body : Cotton 100%

- Lightweight cotton fabric
- Button-front closure
- Curved hem for versatile styling

본체: 면 100%

- 가볍고 편안한 코튼 원단
- 전면 버튼 여밈
- 자연스럽게 떨어지는 곡선형 밑단
- 단독 착용하거나 가벼운 아우터처럼 활용할 수 있는 셔츠

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(4, 'top-shirt.png', 1860241)],
        listPrice: 58000,
        salePrice: 56260,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 5,
        categoryId: 11,
        categoryName: 'JACKET',
        name: '데일리 집업 자켓',
        detail: `Shell : Nylon 100%
Lining : Polyester 100%

- Lightweight nylon shell
- Full zip closure
- Adjustable hem for a flexible fit

겉감: 나일론 100%
안감: 폴리에스터 100%

- 가볍게 착용하기 좋은 나일론 소재
- 전면 지퍼 여밈
- 밑단 조절 디테일
- 간절기 데일리 룩에 활용하기 좋은 집업 자켓

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(5, 'outer.png', 1803092)],
        listPrice: 118000,
        salePrice: 114460,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 6,
        categoryId: 12,
        categoryName: 'COAT',
        name: '클래식 울 블렌드 코트',
        detail: `Shell : Wool 50%, Polyester 50%
Lining : Polyester 100%

- Warm wool-blend fabric
- Classic collar design
- Back vent for ease of movement

겉감: 울 50%, 폴리에스터 50%
안감: 폴리에스터 100%

- 보온성을 높인 울 혼방 원단
- 클래식한 칼라 디자인
- 움직임을 편하게 하는 뒤트임
- 차분한 스타일을 완성하는 데일리 코트

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(6, 'outer-coat.png', 2190744)],
        listPrice: 178000,
        salePrice: 172660,
        new: false,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 7,
        categoryId: 31,
        categoryName: 'PANTS',
        name: '와이드 코튼 팬츠',
        detail: `Body : Cotton 100%

- Wide-leg silhouette
- Structured cotton fabric
- Belt loops and zip fly closure

본체: 면 100%

- 여유롭게 떨어지는 와이드 실루엣
- 형태를 안정적으로 잡아주는 코튼 원단
- 벨트 고리와 지퍼 여밈
- 셔츠와 스웨터에 자연스럽게 어울리는 팬츠

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(7, 'bottom-pants.png', 2122710)],
        listPrice: 72000,
        salePrice: 69840,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 8,
        categoryId: 23,
        categoryName: 'HOODIE',
        name: '릴랙스드 코튼 후디',
        detail: `Body : Cotton 80%, Polyester 20%

- Relaxed fit
- Adjustable drawstring hood
- Kangaroo pocket

본체: 면 80%, 폴리에스터 20%

- 편안한 릴랙스드 핏
- 스트링으로 조절 가능한 후드
- 전면 캥거루 포켓
- 캐주얼한 데일리 스타일에 활용하기 좋은 후디

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(8, 'hood.png', 2473720)],
        listPrice: 89000,
        salePrice: 86330,
        new: true,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 9,
        categoryId: 22,
        categoryName: 'SWEATER',
        name: '베이직 니트 스웨터',
        detail: `Body : Acrylic 50%, Wool 30%, Nylon 20%

- Warm knit construction
- Relaxed shoulder line
- Ribbed neckline, cuffs and hem

본체: 아크릴 50%, 울 30%, 나일론 20%

- 따뜻하게 착용할 수 있는 혼방 니트
- 자연스럽게 내려오는 어깨 라인
- 목둘레, 소매와 밑단의 리브 마감
- 셔츠 위에 겹쳐 입기 좋은 베이직 스웨터

*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(9, 'top-sweater.png', 2469728)],
        listPrice: 88000,
        salePrice: 85360,
        new: false,
    },
    {
        ...COMMON_PRODUCT_INFO,
        id: 10,
        categoryId: 32,
        categoryName: 'DENIM',
        name: '스트레이트 데님 팬츠',
        detail: `Body : Cotton 100%

- Classic straight fit
- Five-pocket construction
- Washed denim finish

본체: 면 100%

- 기본 스트레이트 핏
- 클래식한 5포켓 구성
- 자연스러운 워싱 디테일
- 다양한 상의와 매치하기 좋은 데님 팬츠

*데님 소재 특성상 밝은 색상의 의류에 이염될 수 있습니다.
*제품 색상은 제품컷과 가장 유사합니다.`,
        images: [createMockProductImage(10, 'bottom-jean.png', 2203207)],
        listPrice: 82000,
        salePrice: 79540,
        new: true,
    },
];
