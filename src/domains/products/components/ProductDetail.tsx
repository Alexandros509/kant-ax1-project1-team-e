// 클릭과 상태를 쓰는 파일이라는 표시 'use client';
// 컴포넌트가 클라이언트에서 렌더링되어야 함을 명시하는 JavaScript 디렉티브
// React Hooks 사용, 브라우저 전용 API 사용, 이벤트 핸들링, 상호작용이 필요한 UI 컴포넌트
'use client';

import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';
import { formatPrice } from '@/shared/utils/formatPrice';
// 상태를 만드는 함수 가져오기
import { useState } from 'react';

export default function ProductDetail() {
    const product = MOCK_PRODUCTS[0]; // 0번째 = id 1 화이트 싱글 코트
    const [activeTab, setActiveTab] = useState('detail'); // 지금 열린 탭을 기억. 처음은 DETAILS
    return (
        <main className="mx-auto max-w-7xl p-5">
            {/*  상단 영역  */}
            <div className="wrapper flex flex-col gap-5 md:flex-row">
                <div className="image flex w-full flex-col gap-5 md:w-2/3">
                    <img
                        className="w-full"
                        src="https://picsum.photos/seed/backpack-1/1946/2335"
                        alt="상품 이미지1"
                    />
                    <img
                        className="w-full"
                        src="https://picsum.photos/seed/backpack-2/1946/2335"
                        alt="상품 이미지2"
                    />
                    <img
                        className="w-full"
                        src="https://picsum.photos/seed/backpack-3/1946/2335"
                        alt="상품 이미지3"
                    />
                </div>

                {/*  상품 정보 영역  */}
                <div className="buttons bg-gray-100 p-5 md:w-1/3">
                    <div className="wrapper sticky top-5 grid grid-cols-2">
                        <div className="bg-blue-200 p-4">size</div>
                        <div className="flex w-full flex-col bg-blue-200 p-4">
                            <h2 className="text-xl font-bold">
                                {product.name}
                            </h2>
                            <h3>
                                <del className="mr-2 text-neutral-400">
                                    {formatPrice(product.listPrice)}
                                </del>
                                {formatPrice(product.salePrice)}
                            </h3>
                            <h3>색상</h3>
                            <div>
                                <button>1</button>
                                <button>2</button>
                                <button>3</button>
                                <button>4</button>
                            </div>
                            <button>Add to cart</button>
                        </div>
                        <div className="col-span-2 bg-green-200 p-4">
                            <div className="grid grid-cols-3 gap-4">
                                {/* 
                                onClick= "클릭하면" 
                                { }	JavaScript 값
                                () =>	"이 일을 해라" (화살표 함수, 클릭할 때 실행됨)
                                setActiveTab('detail')	열린 탭을 'detail'로 바꿔라
                                */}
                                <button
                                    onClick={() => setActiveTab('detail')}
                                    className="bg-blue-200 p-4"
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('productCare')}
                                    className="bg-blue-300 p-4"
                                >
                                    Product Care
                                </button>
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className="bg-blue-300 p-4"
                                >
                                    Shipping & Returns
                                </button>
                                {/*  2행: col-span-3를 적용하여 3칸을 모두 차지함  */}
                                <div className="col-span-3 bg-green-200 p-4">
                                    <p className="whitespace-pre-line">
                                        {activeTab === 'detail' &&
                                            product.detail}
                                        {activeTab === 'productCare' &&
                                            product.productCare}
                                        {activeTab === 'shipping' &&
                                            product.shipping}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  하단 영역  */}
            <div className="mt-10 flex flex-col gap-5 md:flex-row">
                <img
                    className="w-full md:w-1/3"
                    src="https://picsum.photos/seed/backpack-1/600/600"
                    alt="모델 핏1"
                />
                <img
                    className="w-full md:w-1/3"
                    src="https://picsum.photos/seed/backpack-2/600/600"
                    alt="모델 핏2"
                />
                <img
                    className="w-full md:w-1/3"
                    src="https://picsum.photos/seed/backpack-3/600/600"
                    alt="모델 핏3"
                />
            </div>
        </main>
    );
}
