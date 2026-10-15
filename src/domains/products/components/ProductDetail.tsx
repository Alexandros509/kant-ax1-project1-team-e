// 클릭과 상태를 쓰는 파일이라는 표시 'use client';
// 컴포넌트가 클라이언트에서 렌더링되어야 함을 명시하는 JavaScript 디렉티브
// React Hooks 사용, 브라우저 전용 API 사용, 이벤트 핸들링, 상호작용이 필요한 UI 컴포넌트
'use client';

// import: 다른 파일에서 export한 것을 가져와 이 파일에서 쓸 수 있게 함
// { 이름 }: 그 파일이 이름을 붙여 내보낸 것(named export)을 같은 이름으로 가져옴
// @/: 프로젝트의 src 폴더를 뜻하는 줄임 경로 (tsconfig.json에 설정됨)
// 팀 mock 상품 10개가 들어 있는 배열
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';
// 숫자 153260을 "153,260원" 글자로 바꿔 주는 팀 공용 함수
import { formatPrice } from '@/shared/utils/formatPrice';
// 상태를 만드는 함수 가져오기
import { useState } from 'react';

/*
 * 리액트 컴포넌트: 화면 조각(JSX)을 return 하는 함수
 *
 * export default: 이 파일의 "대표"로 내보냄 → 다른 파일에서 { } 없이 import ProductDetail from ... 으로 가져옴
 * function ProductDetail(): 컴포넌트 이름은 반드시 대문자로 시작 (소문자면 HTML 태그로 착각함)
 * 사용하는 곳: src/app/(shop)/products/[id]/page.tsx 에서 <ProductDetail /> 태그처럼 씀
 *
 * 화면이 다시 그려지는(리렌더링) 때: 아래 상태(useState) 값이 바뀔 때마다
 * 이 함수 전체가 처음부터 다시 실행되고, 새로 return 한 JSX로 화면이 바뀜
 */
// 바깥(page.tsx)에서 받는 값(props)의 모양
/*
 * props: 부모 컴포넌트가 자식 컴포넌트에게 넘겨주는 값
 *
 * 넘기는 쪽 (page.tsx)	<ProductDetail id={Number(id)} />  → 태그 속성처럼 씀
 * 받는 쪽 (이 파일)	ProductDetail({ id })              → 함수 매개변수로 받음
 * 두 쪽의 이름(id)이 같아야 짝이 맞음
 *
 * type 이름 = { ... }	TypeScript 타입 설계도. "이 컴포넌트는 이런 props를 받는다"를 정해 둠
 * id: number	id는 숫자여야 함 → page.tsx에서 Number(id)로 글자를 숫자로 바꿔 넘기는 이유
 * 설계도와 다르게 넘기면 (예: id를 안 넘기거나 글자로 넘기면) 빨간 밑줄로 미리 알려 줌
 */
type ProductDetailProps = {
    id: number;
};

export default function ProductDetail({ id }: ProductDetailProps) {
    /*
     * useState: 화면이 "기억"해야 하는 값(상태)을 만드는 리액트 Hook
     *
     * const [값, 값을바꾸는함수] = useState(처음값);
     * [ , ]	배열 구조 분해 할당. useState가 돌려준 두 개를 각각 이름 붙여 꺼냄
     * 값	지금 상태 (예: activeTab → 'detail')
     * 값을바꾸는함수	set으로 시작하는 이름이 관례. 이 함수로 바꿔야 화면이 다시 그려짐
     *              (activeTab = 'shipping' 처럼 직접 대입하면 화면이 바뀌지 않음)
     * 처음값	컴포넌트가 처음 그려질 때 한 번만 쓰임
     *
     * Hook 규칙: useState는 컴포넌트 함수 맨 위쪽에서, if·반복문 밖에서 호출해야 함
     *           (매번 같은 순서로 실행되어야 리액트가 어느 값이 어느 상태인지 구분함)
     */
    const [activeTab, setActiveTab] = useState('detail'); // 지금 열린 탭을 기억. 처음은 DETAILS
    const [selectedSize, setSelectedSize] = useState(''); // 선택한 사이즈. 처음은 선택 없음
    const [message, setMessage] = useState(''); // Add to cart 아래 안내 문구

    // 주소의 id와 같은 상품을 찾음. 없으면 undefined
    /*
     * 배열.find((항목) => 조건)	배열을 앞에서부터 보면서 조건이 참인 "첫 번째 하나"를 돌려줌
     * item	MOCK_PRODUCTS 안의 상품 하나 (이름은 아무거나 지어도 됨)
     * item.id === id	그 상품의 id가 props로 받은 id와 같은가?
     * 결과	찾으면 상품 객체 / 끝까지 못 찾으면 undefined (값이 없다는 뜻)
     *
     * filter와 차이: filter는 맞는 것 "전부"를 배열로, find는 맞는 것 "하나"를 그대로 돌려줌
     */
    const product = MOCK_PRODUCTS.find((item) => item.id === id);

    // 상품이 없으면 안내 문구만 보여 주고 끝냄
    /*
     * !product	product가 없으면(undefined) true  → 예: /products/99 처럼 없는 번호로 들어온 경우
     * return <p>...</p>	이 문구만 화면에 그리고 함수를 여기서 끝냄 (아래 코드는 실행 안 됨)
     *
     * 이 위치인 이유
     * - useState 3줄보다 아래: Hook은 매번 같은 순서로 실행되어야 하므로 return보다 먼저 와야 함
     * - product.images를 쓰는 코드보다 위: 상품이 없는데 product.images를 읽으면 오류가 나기 때문
     * - 이 if를 지나면 TypeScript가 "아래에서는 product가 반드시 있다"고 알게 되어
     *   product.name 등에 빨간 밑줄이 생기지 않음
     */
    if (!product) {
        return <p className="p-10">상품을 찾을 수 없습니다.</p>;
    }
    // 상단 왼쪽: 상세 이미지 중 모델 사진이 아닌 것 (정면·뒷면·디테일 5장)
    {
        /* 
    image.original_name	파일 이름 ('outerCoatIvoryModelFront.png')
    .includes('Model')	이름 안에 Model이라는 글자가 있으면 true
    !	반대로 뒤집기 → "Model이 없으면 true"
    &&	앞뒤 조건이 둘 다 맞아야 남김 
    */
    }

    const productImages = product.images.filter(
        (image) =>
            image.location === 'product_desc' &&
            !image.original_name.includes('Model'),
    );
    // 왼쪽에 실제로 보여 줄 이미지: 상세 이미지가 없으면 대표 이미지(product_main)로 대신함
    /*
     * 필요한 이유: 1번 코트만 상세 이미지(product_desc)가 있고, 2~10번 상품은 대표 이미지 1장뿐임
     *            → productImages가 빈 배열이 되어 왼쪽이 빈칸으로 보이는 것을 막음
     *
     * 조건 ? A : B	삼항 연산자. 조건이 참이면 A, 거짓이면 B를 leftImages에 담음
     * productImages.length > 0	상세 이미지가 1장 이상 있는가? (length = 배열 칸 수)
     * ? productImages	있으면 상세 이미지 그대로 사용
     * : product.images.filter(...)	없으면 대표 이미지(product_main)만 골라 사용
     *
     * 화면(JSX)에서는 productImages 대신 이 leftImages를 map으로 그림
     */
    const leftImages =
        productImages.length > 0
            ? productImages
            : product.images.filter(
                  (image) => image.location === 'product_main',
              );
    // 하단: 상세 이미지 중 모델 착용 사진 (정면·측면·뒷면 3장)
    /*
     * 위의 productImages와 조건이 하나만 다름
     * productImages	!image.original_name.includes('Model') → 파일 이름에 Model이 "없는" 것
     * modelImages	image.original_name.includes('Model')  → 파일 이름에 Model이 "있는" 것
     * → 같은 상세 이미지 8장을 상단 5장 / 하단 3장으로 나눔
     *
     * 주의: 파일 이름 규칙(모델 사진에는 Model이 들어감)에 기대는 방식
     *      mockData.ts 72번 줄 주석처럼 파일명이 용도를 보장하지는 않으므로, 팀과 공유해 둘 것
     * 모델 사진이 없는 상품(2~10번)은 빈 배열 → 하단 영역에 아무것도 안 나옴
     */
    const modelImages = product.images.filter(
        (image) =>
            image.location === 'product_desc' &&
            image.original_name.includes('Model'),
    );

    // Add to cart를 눌렀을 때 실행
    /*
     * 이벤트 핸들러: 클릭 같은 사용자 행동이 일어났을 때 실행할 함수
     * handle + 대상 이름으로 짓는 것이 리액트 관례 (handleAddToCart = 장바구니 담기 처리)
     *
     * 컴포넌트 함수 안에 만들었기 때문에 selectedSize, setMessage 같은 상태를 바로 쓸 수 있음
     * if (selectedSize === '')	사이즈를 아직 안 골랐으면
     * return;	안내 문구만 바꾸고 함수를 여기서 끝냄 (아래 줄은 실행 안 됨)
     * `... ${selectedSize})`	백틱 문자열. ${ } 자리에 변수 값을 끼워 넣음
     */
    function handleAddToCart() {
        if (selectedSize === '') {
            setMessage('사이즈를 선택해 주세요.');
            return;
        }
        setMessage(`장바구니에 담았습니다. (사이즈 ${selectedSize})`);
    }

    /*
     * return ( JSX ): 이 컴포넌트가 화면에 그릴 내용
     *
     * JSX	HTML처럼 생겼지만 JavaScript 안에서 쓰는 리액트 문법
     * className	HTML의 class 대신 씀 (class는 JavaScript 예약어라서)
     * { }	JSX 안에서 "여기는 글자가 아니라 JavaScript 값" 이라는 표시
     * {/* *\/}	JSX 안에서 주석을 쓰는 방법
     * 최상위 태그는 하나여야 함 → 여기서는 <main>이 전체를 감쌈
     */
    return (
        <main className="">
            {/*  상단 영역  */}
            <div className="wrapper flex flex-col gap-5 md:flex-row">
                <div className="image flex w-full flex-col gap-5 md:w-1/2">
                    {/*
                    배열.map((항목) => ( JSX ))	배열의 항목을 하나씩 꺼내 JSX를 하나씩 만들어 줌 (리액트에서 목록 그리는 기본 방법)
                    image	productImages 안의 이미지 정보 객체 하나 (url, seq, id 등)
                    key={image.id}	목록의 각 항목을 구분하는 고유값. map으로 반복할 때 리액트가 꼭 요구함
                                    (없으면 콘솔 경고, 순서가 바뀔 때 엉뚱한 항목을 다시 그릴 수 있음)
                    src={image.url}	따옴표 대신 { } → 고정 글자가 아니라 객체 안의 값을 넣음
                    alt={`...${ }...`}	백틱 문자열로 상품명과 순서를 끼워 넣은 설명 글
                    */}
                    {leftImages.map((image) => (
                        <img
                            key={image.id}
                            className="w-full"
                            src={image.url}
                            alt={`${product.name} 상세 이미지 ${image.seq}`}
                        />
                    ))}
                </div>
                {/*  상품 정보 영역  */}
                <div className="w-full px-4 pt-6 pb-16 text-[11px] md:w-1/2 md:pt-[22vh]">
                    <div className="sticky top-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-10 md:top-[22vh] md:mx-auto md:w-[calc(41%+5.5rem)] md:gap-x-16">
                        {/*
                        {product.name}	product 객체 안의 name 값을 화면에 표시 ("아이보리 싱글 코트")
                        {formatPrice(...)}	{ } 안에서는 함수도 실행 가능. 돌려준 결과("158,000원")가 표시됨
                        <del>	취소선 글자 (할인 전 정가)
                        */}
                        <div className="col-start-2 flex flex-col gap-2">
                            <h2 className="font-semibold uppercase">
                                {product.name}
                            </h2>
                            <h3>
                                <del className="mr-2 text-neutral-400">
                                    {formatPrice(product.listPrice)}
                                </del>
                                {formatPrice(product.salePrice)}
                            </h3>
                            <h3 className="text-neutral-400 uppercase">색상</h3>
                        </div>
                        <div className="flex items-center text-[10px] text-neutral-400 uppercase">
                            size
                        </div>
                        {/*
                        사이즈 버튼 4개: 탭 버튼과 같은 방식 (아래 탭 주석의 onClick·삼항 연산자 설명 참고)
                        onClick={() => setSelectedSize('1')}	누르면 선택한 사이즈 상태를 '1'로 바꿈 → 화면이 다시 그려짐
                        selectedSize === '1' ? A : B	지금 선택된 사이즈가 '1'이면 검정 스타일(A), 아니면 회색 스타일(B)
                        () => 를 쓰는 이유	setSelectedSize('1')처럼 괄호 안에 값을 넘겨야 해서
                                          onClick={setSelectedSize('1')}로 쓰면 클릭 전, 그리는 순간 바로 실행되어 버림
                        */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedSize('1')}
                                className={
                                    selectedSize === '1'
                                        ? 'size-6 cursor-pointer rounded-sm bg-neutral-900 text-[10px] font-semibold text-white'
                                        : 'size-6 cursor-pointer rounded-sm bg-neutral-100 text-[10px] font-semibold hover:bg-neutral-200'
                                }
                            >
                                1
                            </button>
                            <button
                                onClick={() => setSelectedSize('2')}
                                className={
                                    selectedSize === '2'
                                        ? 'size-6 cursor-pointer rounded-sm bg-neutral-900 text-[10px] font-semibold text-white'
                                        : 'size-6 cursor-pointer rounded-sm bg-neutral-100 text-[10px] font-semibold hover:bg-neutral-200'
                                }
                            >
                                2
                            </button>
                            <button
                                onClick={() => setSelectedSize('3')}
                                className={
                                    selectedSize === '3'
                                        ? 'size-6 cursor-pointer rounded-sm bg-neutral-900 text-[10px] font-semibold text-white'
                                        : 'size-6 cursor-pointer rounded-sm bg-neutral-100 text-[10px] font-semibold hover:bg-neutral-200'
                                }
                            >
                                3
                            </button>
                            <button
                                onClick={() => setSelectedSize('4')}
                                className={
                                    selectedSize === '4'
                                        ? 'size-6 cursor-pointer rounded-sm bg-neutral-900 text-[10px] font-semibold text-white'
                                        : 'size-6 cursor-pointer rounded-sm bg-neutral-100 text-[10px] font-semibold hover:bg-neutral-200'
                                }
                            >
                                4
                            </button>
                        </div>
                        {/*
                        onClick={handleAddToCart}	위에서 만든 함수의 "이름"만 넘김 → 클릭할 때 리액트가 대신 실행
                                                  넘길 값이 없어서 () => 없이 이름만 씀
                                                  (handleAddToCart()처럼 괄호를 붙이면 그리는 순간 바로 실행됨)
                        {message}	message 상태 값을 표시. setMessage로 바뀌면 이 글자도 자동으로 바뀜
                        */}
                        <div className="col-start-2 flex flex-col gap-2">
                            <button
                                onClick={handleAddToCart}
                                className="h-10 w-full cursor-pointer rounded-sm bg-neutral-900 text-[10px] font-semibold text-white uppercase hover:bg-neutral-700"
                            >
                                Add to cart
                            </button>
                            <p className="min-h-4">{message}</p>
                        </div>
                        <div className="col-start-2">
                            <div className="grid grid-cols-3 text-[10px]">
                                {/* 
                                onClick= "클릭하면" 
                                { }	JavaScript 값
                                () =>	"이 일을 해라" (화살표 함수, 클릭할 때 실행됨)
                                setActiveTab('detail')	열린 탭을 'detail'로 바꿔라

                                삼항 연산자(조건 ? 참일 때 : 거짓일 때)
                                className={ }	따옴표 대신 중괄호: 고정 글자가 아니라 계산한 값을 클래스로 씀
                                activeTab === 'detail'	지금 열린 탭이 detail인가?
                                ? '...'	맞으면 굵고 진한 글자
                                : '...'	아니면 연한 회색 글자
                                */}
                                <button
                                    onClick={() => setActiveTab('detail')}
                                    className={
                                        activeTab === 'detail'
                                            ? 'cursor-pointer border-b-2 border-neutral-900 py-3 text-neutral-900 uppercase'
                                            : 'cursor-pointer border-b-2 border-neutral-200 py-3 text-neutral-400 uppercase hover:text-neutral-900'
                                    }
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('productCare')}
                                    className={
                                        activeTab === 'productCare'
                                            ? 'cursor-pointer border-b-2 border-neutral-900 py-3 text-neutral-900 uppercase'
                                            : 'cursor-pointer border-b-2 border-neutral-200 py-3 text-neutral-400 uppercase hover:text-neutral-900'
                                    }
                                >
                                    Product Care
                                </button>
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className={
                                        activeTab === 'shipping'
                                            ? 'cursor-pointer border-b-2 border-neutral-900 py-3 text-neutral-900 uppercase'
                                            : 'cursor-pointer border-b-2 border-neutral-200 py-3 text-neutral-400 uppercase hover:text-neutral-900'
                                    }
                                >
                                    Shipping & Returns
                                </button>
                                {/*  2행: col-span-3를 적용하여 3칸을 모두 차지함  */}
                                <div className="col-span-3 py-4">
                                    {/*
                                    조건 && 값	조건이 참일 때만 값을 화면에 그림 (거짓이면 아무것도 안 그림)
                                    activeTab === 'detail'	지금 열린 탭이 detail인가?
                                    → 세 줄 중 열린 탭과 이름이 같은 한 줄만 참이라 그 내용만 보임
                                    */}
                                    <p className="leading-[1.9] whitespace-pre-line">
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
                {/* 상단 왼쪽 이미지와 같은 map 방식. modelImages(모델 착용 사진 3장)를 한 줄에 나열 */}
                {modelImages.map((image) => (
                    <img
                        key={image.id}
                        className="w-full md:w-1/3"
                        src={image.url}
                        alt={`${product.name} 모델 착용 이미지 ${image.seq}`}
                    />
                ))}
            </div>
        </main>
    );
}
