# kant-ax1-project1-team-e

AX 1기 프로젝트(1) - Team E
React / Next.js 쇼핑몰 UI

## 팀원

- @Alexandros509 (최기혁)
- @jihyunkims495-sys (김지현)
- @tuski0 (선병철)
- @yoosangjn-stack (유상진)

## 프로젝트 목표

쇼핑몰 주제를 정하고, React/Next.js로
메인 · 상품 목록 · 상품 상세 페이지를 구현합니다.

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## 실행 방법

1. 의존성 설치: `npm ci`
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 http://localhost:3000 접속

## 상품 목록 Supabase 연동

`/products`는 Supabase의 공개 상품과 활성 카테고리를 조회합니다.
`.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 설정하세요.

- `ProductCatalog.tsx`: 로딩·오류·재시도와 이미지 URL 갱신을 처리합니다.
- `getProductCatalog.ts`: 상품·카테고리를 조회하고 DB 필드를 카드 타입으로 변환합니다.
- 이미지는 `product-images` 버킷의 서명 URL로 표시하며, 누락된 이미지는 안내 문구로 표시합니다.
- 상품 상세 페이지는 아직 기존 목데이터를 사용합니다.

카탈로그 입력 SQL과 Storage 업로드 순서는 [업로드 안내](supabase/UPLOAD_GUIDE.md)를 참고하세요.

## 토스 테스트 결제

한 화면형 주문서 오른쪽 결제 버튼에서 토스 SDK v2 결제창을 호출하고 서버에서 승인합니다.
토스 키는 설정하지 않아도 토스 공식 공개 테스트 키로 결제합니다. 내 상점 키를 쓰려면 `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`와 `TOSS_SECRET_KEY`를 같은 테스트 키 세트로 넣으세요.
로그인한 회원의 테스트 주문·결제는 Supabase에 저장되며 재고는 차감하지 않습니다.
테스트 키 발급·환경 설정·동작 확인 방법은 [토스 테스트 결제 안내](docs/TOSS_TEST_PAYMENT.md)를 참고하세요.
