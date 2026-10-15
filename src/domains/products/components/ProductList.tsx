'use client';

/**
 * 상품 목록 화면 전체를 구성하는 컴포넌트입니다.
 * 데이터 흐름: page.tsx → ProductList → ProductGrid → ProductCard.
 * page.tsx에서 받은 상품을 아래 그리드에 전달하고, 위에는 열 개수·카테고리 버튼을 배치합니다.
 * useState와 onClick을 사용하므로 파일 맨 위에 'use client' 선언이 필요합니다.
 * 이 선언은 이 파일을 클라이언트 컴포넌트의 진입점으로 지정합니다.
 */
// import type은 실행할 값이 아니라 TypeScript의 타입 검사에 사용할 정의를 가져옵니다.
import type { Product } from '@/domains/products/types/product.types';
import ProductGrid from '@/domains/products/components/ProductGrid';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import { useState } from 'react';

// Props는 부모 컴포넌트가 이 컴포넌트에 전달하는 값의 이름과 타입입니다.
interface ProductListProps {
    /** Product 타입을 따르는 상품들의 배열. 현재 page.tsx에서 전체 목 상품을 전달합니다. */
    products: Product[];
}

// { products }는 전달받은 props 객체에서 products 값만 꺼내는 구조 분해 문법입니다.
export default function ProductList({ products }: ProductListProps) {
    // useState는 선택한 값을 다음 렌더링에도 기억하게 합니다.
    // 첫 번째 값은 현재 상태, 두 번째 함수는 그 상태를 변경하는 함수입니다.
    // 버튼의 값은 숫자가 아닌 문자열 '3'·'4'·'6'으로 비교하며, 처음에는 '6'을 선택합니다.
    // 선택값은 ProductGrid에 전달되어 PC 화면의 열 개수와 카드 정보 표시 여부에 쓰입니다.
    const [selectedGridId, setSelectedGridId] = useState('6');
    // 'all'은 ALL 버튼을 뜻하는 화면용 값이며 실제 Category의 ID가 아닙니다.
    // 현재는 이 상태로 버튼 색상만 바꿉니다. 상품 필터링·주소 변경은 아직 연결하지 않았습니다.
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');

    return (
        <section>
            {/*
             * 상단 도구 영역입니다. 상품 그리드와 구분해 버튼 두 묶음을 배치합니다.
             * grid-cols-[1fr_auto_1fr]: 좌우는 같은 너비, 가운데는 내용에 필요한 너비입니다.
             * 첫 번째 ul은 왼쪽 칸, 두 번째 ul은 가운데 칸에 들어가고 오른쪽 칸은 비워둡니다.
             * items-center는 각 칸의 내용을 세로 가운데에 맞춥니다.
             * h-30은 높이, px-5는 좌우 안쪽 여백이며 text-sm은 내부 글자의 기본 크기입니다.
             */}
            <div
                id="top"
                className="grid h-30 grid-cols-[1fr_auto_1fr] items-center px-5 text-sm"
            >
                {/*
                 * 열 개수 선택 버튼입니다. flex로 가로 배치하고 gap-x-6으로 간격을 줍니다.
                 * justify-self-start는 그리드 칸 왼쪽에 내용 너비만큼만 박스를 배치합니다.
                 * rounded-xl은 모서리, px-4·py-4는 안쪽 여백, shadow-md는 바깥 그림자입니다.
                 * 각 버튼의 onClick은 상태를 변경하며 전체 페이지를 새로고침하지 않습니다.
                 * 조건 ? A : B 문법으로 선택된 버튼은 검정, 나머지는 회색으로 표시합니다.
                 * cursor-pointer는 버튼에 마우스를 올릴 때 손가락 커서를 표시합니다.
                 */}
                <ul className="flex items-center gap-x-6 justify-self-start rounded-xl px-4 py-4 shadow-md">
                    {/* 3열 선택: ProductGrid에서 showInfo가 true가 되어 상품 정보도 항상 보입니다. */}
                    <li>
                        <button
                            onClick={() => setSelectedGridId('3')}
                            className={`cursor-pointer ${
                                selectedGridId === '3'
                                    ? 'text-black'
                                    : 'text-gray-400'
                            }`}
                        >
                            3
                        </button>
                    </li>
                    {/* 4열 선택: 상품 정보는 카드 호버 시 표시됩니다. */}
                    <li>
                        <button
                            onClick={() => setSelectedGridId('4')}
                            className={`cursor-pointer ${
                                selectedGridId === '4'
                                    ? 'text-black'
                                    : 'text-gray-400'
                            }`}
                        >
                            4
                        </button>
                    </li>
                    {/* 6열 선택: 초기 선택값이며 상품 정보는 카드 호버 시 표시됩니다. */}
                    <li>
                        <button
                            onClick={() => setSelectedGridId('6')}
                            className={`cursor-pointer ${
                                selectedGridId === '6'
                                    ? 'text-black'
                                    : 'text-gray-400'
                            }`}
                        >
                            6
                        </button>
                    </li>
                </ul>

                {/*
                 * 가운데 소카테고리 버튼 영역입니다. 현재 OUTER의 하위 분류를 표시합니다.
                 * gap-x-10은 항목 사이 간격이며 text-center는 항목 내부 글자를 가로 정렬합니다.
                 * 구분선용 after 요소 없이 gap으로만 간격을 만듭니다.
                 */}
                <ul
                    id="category"
                    className="flex items-center gap-x-10 rounded-xl px-8 py-4 text-center shadow-md"
                >
                    {/* ALL은 데이터에서 가져오지 않고 직접 작성한 버튼이며 'all' 상태와 대응합니다. */}
                    <li className="cursor-pointer">
                        <button
                            onClick={() => setSelectedCategoryId('all')}
                            className={`cursor-pointer ${
                                selectedCategoryId === 'all'
                                    ? 'text-black'
                                    : 'text-gray-400'
                            }`}
                        >
                            ALL
                        </button>
                    </li>

                    {/*
                     * filter는 parent_id가 '1'(OUTER)인 소카테고리만 골라 새 배열을 만듭니다.
                     * 이 filter는 버튼 목록만 대상으로 하며 아래 상품 배열을 필터링하지 않습니다.
                     * map은 골라낸 카테고리마다 li·button 요소를 하나씩 만듭니다.
                     * key에는 고유 ID를 넣어 React가 목록의 각 항목을 구별하게 합니다.
                     * 클릭하면 category.id를 저장하고, category.name은 실제 버튼 글자로 표시합니다.
                     * 현재는 대분류 ID를 '1'로 고정했습니다. 대분류별 페이지 연결은 추후 작업입니다.
                     */}
                    {MOCK_CATEGORIES.filter(
                        (category) => category.parent_id === '1',
                    ).map((category) => (
                        <li key={category.id} className="cursor-pointer">
                            <button
                                onClick={() =>
                                    setSelectedCategoryId(category.id)
                                }
                                className={`cursor-pointer ${
                                    selectedCategoryId === category.id
                                        ? 'text-black'
                                        : 'text-gray-400'
                                }`}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/*
             * 상품 목록 본문입니다. px-5로 상단 영역과 동일한 좌우 여백을 줍니다.
             * products는 page.tsx에서 받은 배열을 그대로 전달합니다.
             * grid에는 현재 선택한 문자열 값을 넘겨 ProductGrid가 열 클래스를 정하도록 합니다.
             * 카테고리 선택에 따른 상품 변경은 아직 연결하지 않은 상태입니다.
             */}
            <div>
                <div className="px-5">
                    <ProductGrid products={products} grid={selectedGridId} />
                </div>
            </div>
        </section>
    );
}
