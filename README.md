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

## 토스 테스트 결제

한 화면형 주문서 오른쪽 결제 버튼에서 토스 SDK v2 결제창을 호출하고 서버에서 승인합니다.
`.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`와 `TOSS_SECRET_KEY`를 같은 테스트 키 세트로 추가하세요.
현재는 임시 장바구니와 로컬 테스트 주문을 사용하며 Supabase 주문·재고에는 반영하지 않습니다.
테스트 키 발급·환경 설정·동작 확인 방법은 [토스 테스트 결제 안내](docs/TOSS_TEST_PAYMENT.md)를 참고하세요.
