import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";


export default function Header () {
    return (
        <header className='sticky top-0 z-50 w-full'>
            <div className='grid h-8 grid-cols-[1fr_auto_1fr] items-center px-1'>
        {/* group: 버튼과 드롭다운 메뉴를 하나의 hover 영역으로 묶음
            h-full: 헤더 아래까지 영역을 채워 마우스 이동 중 끊기지 않게 함 */}
        <nav className="group flex h-full items-center text-[10px] font-semibold">
        {/* 카테고리 버튼
            그룹에 마우스가 올라가면 검정 배경과 흰색 글자로 바뀝니다. */}
        <button
            type="button"
            className="flex h-7 w-35 cursor-pointer items-center justify-center rounded-md
                    bg-white text-black
                    hover:bg-black hover:text-white
                    group-hover:bg-black group-hover:text-white
                    group-focus-within:bg-neutral-950 group-focus-within:text-white"
        >
            ONEPIECE
        </button>

        {/*
            absolute: 본문을 아래로 밀지 않고 그 위에 겹쳐 표시
            inset-x-0: header의 왼쪽부터 오른쪽 끝까지 펼침
            top-full: header 바로 아래에 배치

            invisible opacity-0: 평소에는 보이지 않게 함
            group-hover:visible: 그룹에 마우스를 올리면 표시
            group-hover:opacity-100: 완전히 보이게 함
            border-b shadow-sm: 본문과 구분되는 테두리와 그림자를 만듬
        */}
        <div
            className="invisible absolute inset-x-0 top-full border-b bg-white
                    px-6 py-8 text-xs opacity-0 shadow-sm
                    group-hover:visible group-hover:opacity-100"
        >
            {/* 메뉴를 네 개의 열로 나누고 열 사이 간격 */}
            <div className="grid grid-cols-4 gap-8">
            {/* flex-col: 메뉴를 세로로 배치 gap-3: 메뉴 사이에 간격. */}
            <div className="flex flex-col gap-3">
                <p className="mb-2 text-neutral-400">SHOP</p>
                <Link href="/products" className="hover:underline">
                ALL PRODUCTS
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <p className="mb-2 text-neutral-400">TOP</p>
                <Link href="/products?category=t-shirts" className="hover:underline">
                T-SHIRTS
                </Link>
                <Link href="/products?category=hoodies" className="hover:underline">
                HOODIES
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <p className="mb-2 text-neutral-400">BOTTOM</p>
                <Link href="/products?category=pants" className="hover:underline">
                PANTS
                </Link>
                <Link href="/products?category=shorts" className="hover:underline">
                SHORTS
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <p className="mb-2 text-neutral-400">ACCESSORIES</p>
                <Link href="/products?category=bags" className="hover:underline">
                BAGS
                </Link>
                <Link href="/products?category=headwear" className="hover:underline">
                HEADWEAR
                </Link>
            </div>
            </div>
        </div>
        </nav>

        <Link href="/" className="relative block h-8 w-30">
        {/* relative: 내부 이미지의 위치 기준
            block: 링크를 박스 형태로 만듬
            h-5 w-30: 로고 영역을 높이 20px, 너비 120px로 지정 */}

            <Image
                src="/Logo.png" // public 폴더 기준의 이미지 경로
                alt="ONEPIECE"     // 이미지의 의미를 설명하는 대체 텍스트
                fill                   // 부모 링크 영역을 채웁니다.
                sizes="120px"          // 표시할 이미지 너비를 브라우저에 알림
                className="object-contain" // 이미지 비율을 유지하며 영역 안에 맞춥니다.
            ></Image>
        </Link>
        <nav
          aria-label="사용자 메뉴"
          className="flex items-center justify-end gap-8 pr-3 text-[10px]"
        >
          {/*
           * 검색 아이콘을 감싸는 버튼
           *
           * type="button": 폼 제출을 방지
           * aria-label="검색": 글자가 없는 아이콘 버튼의 용도를 설명
           *
           * flex: 아이콘을 Flex 방식으로 배치
           * h-7, w-7: 버튼 영역을 높이·너비 각각 28px로 지정
           * cursor-pointer: 손가락 모양 커서를 표시
           * items-center: 아이콘을 세로 중앙에 배치
           * justify-center: 아이콘을 가로 중앙에 배치
           */}
          <button
            type="button"
            aria-label="검색"
            className="flex h-7 w-7 cursor-pointer items-center justify-center"
          >
            {/*
             * size={12}: 아이콘의 너비와 높이를 12px로 지정합니다.
             * strokeWidth={1.5}: 아이콘의 선 두께를 지정합니다.
             */}
            <Search size={12} strokeWidth={1.5} />
          </button>

            {/*
           * 회원가입 페이지로 이동하는 링크
           * href="/join": /login 주소로 이동
           */}
          <Link href="/login">JOIN</Link>

          {/*
           * 로그인 페이지로 이동하는 링크
           * href="/login": /login 주소로 이동
           */}
          <Link href="/login">LOGIN</Link>

          {/*
           * 장바구니 페이지로 이동하는 링크
           *
           * href="/cart": /cart 주소로 이동
           * flex: CART 글자와 수량을 가로로 배치.
           * items-center: 글자와 수량을 세로 중앙에 정렬
           * gap-3: CART 글자와 수량 사이에 12px 간격
           */}
          <Link href="/cart" className="flex items-center gap-3">
            {/* span은 문장이나 글자 일부를 묶는 HTML 태그입니다. */}
            <span>CART</span>

            {/* 장바구니 수량을 표시. 현재는 숫자 0을 직접 적은 상태 */}
            <span>0</span>
          </Link>
        </nav>
        </div>
        </header>
    );
    
}