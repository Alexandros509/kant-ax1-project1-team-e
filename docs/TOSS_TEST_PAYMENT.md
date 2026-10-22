# 토스 테스트 결제 설정

현재 구현은 **로컬 개발용 테스트 결제**입니다. 테스트 키만 허용하며 라이브 키는 서버에서 거부합니다. 별도 SDK 패키지 설치 없이 토스 JavaScript SDK v2를 불러옵니다.

이번 연결 범위는 **카드·간편결제의 가상 승인 테스트**입니다. 입금 대기와 웹훅이 필요한 가상계좌 결제는 포함하지 않으며, 결제창형에서 다른 수단을 선택하면 요청 전에 안내합니다.

## 1. 테스트 키 확인

1. [토스 개발자센터](https://developers.tosspayments.com/)에 가입하고 로그인합니다.
2. 내 상점(계약 전이면 개발 연동 체험 상점)을 선택하고 **API 키 → 테스트**에서 클라이언트 키와 시크릿 키를 확인합니다.
3. 같은 상점·같은 키 종류의 키 한 쌍을 사용합니다.

| 키 종류                | 클라이언트 키  | 시크릿 키      | 연결 방식                                           |
| ---------------------- | -------------- | -------------- | --------------------------------------------------- |
| 주문서형·결제창형 연동 | `test_gck_...` | `test_gsk_...` | `widgets.renderPaymentWindow()`                     |
| API 개별 연동          | `test_ck_...`  | `test_sk_...`  | `payment.requestPayment()` 카드·간편결제 통합결제창 |

전자결제 신청 전에는 API 개별 연동 체험 상점의 키를 사용할 수 있습니다. 발급 범위는 [공식 API 키 안내](https://docs.tosspayments.com/reference/using-api/api-keys)를 참고하세요.

## 2. 환경 변수 입력

프로젝트 루트의 **기존 `.env.local`**에 아래 두 줄을 추가합니다. 기존 Supabase 설정은 유지하세요.

```dotenv
NEXT_PUBLIC_TOSS_CLIENT_KEY=개발자센터에서_복사한_테스트_클라이언트_키
TOSS_SECRET_KEY=동일한_세트의_테스트_시크릿_키
```

시크릿 키에는 `NEXT_PUBLIC_`을 붙이지 않습니다. `.env.local`은 Git 추적에서 제외되며, 시크릿 키는 서버의 승인·조회 요청에만 사용됩니다. 키는 채팅이나 소스 코드에 붙여 넣지 마세요.

입력 후 개발 서버를 다시 실행합니다.

```sh
npm run dev
```

## 3. 결제 테스트

1. `http://localhost:3000/cart`에서 수량을 조정하고 **CHECKOUT**으로 이동합니다.
2. 배송지와 주문 확인 체크박스를 입력하고 오른쪽 **결제하기**를 누릅니다.
3. 토스 테스트 결제창의 안내대로 카드 또는 간편결제를 진행합니다. 카드번호·비밀번호는 쇼핑몰 입력란에 넣지 않습니다.
4. `/checkout/success`로 돌아오면 서버가 주문 금액과 브라우저 세션을 확인하고 토스 승인 API를 호출합니다.
5. 토스 응답이 `DONE`이고 주문번호·금액·통화·결제 키가 일치할 때만 완료 화면과 장바구니 반영이 진행됩니다.
6. 완료 화면 새로고침 시 중복 승인·중복 장바구니 차감이 없어야 합니다. 결제창을 닫거나 실패하면 장바구니를 유지합니다.

모바일 결제는 iframe 안에서 지원되지 않을 수 있으므로 일반 브라우저의 독립 탭에서 테스트하세요. 토스가 제공하는 테스트 환경에서만 진행하며 실제 금액은 청구되지 않습니다.

## 구현 흐름과 파일

```text
CheckoutPage → POST /api/payments/toss/prepare
             → 토스 SDK 결제창 / 인증
             → /checkout/success
             → POST /api/payments/toss/confirm
             → 토스 결제 승인 API → 승인된 결과만 완료 표시
```

- `src/domains/orders/api/tossPayment.ts`: 브라우저의 준비·승인 요청과 키 종류에 따른 SDK 호출
- `src/app/api/payments/toss/{prepare,confirm}/route.ts`: 서버 API 진입점, 출처 검증과 HttpOnly 세션 쿠키
- `src/domains/orders/server/testPayment.ts`: 키 검증, 테스트 주문 저장, 소유권·금액 검증, 토스 승인·조회·멱등키
- `src/domains/orders/server/testPaymentValidation.ts`: 배송지·상품·승인 응답 검증
- `src/domains/orders/components/{PaymentResult,OrderReceipt}.tsx`: 승인 대기·재확인·실패·완료 화면
- `src/shared/store/useCounterStore.ts`: 리다이렉트 후 세션 장바구니 복원, 승인된 주문의 수량만 한 번 반영

## 현재 범위와 보관 데이터

- 현재 장바구니는 `cart.mock.ts`의 임시 상품을 사용합니다. 서버도 이 파일의 **상품 ID·가격**을 기준으로 계산하고 브라우저의 가격·상품명은 신뢰하지 않습니다.
- 테스트 주문·배송지·승인 결과는 로컬 `.local/test-payments/`에 저장됩니다. Git에서 제외하고 파일 접근 권한을 제한했습니다. 실제 개인정보 대신 테스트용 배송지를 사용하세요. 테스트가 끝나면 개발 서버를 중지한 후 이 폴더를 삭제하면 기록이 제거됩니다.
- 장바구니와 처리한 테스트 주문번호는 브라우저 `sessionStorage`에 보관합니다. 주문 소유권 확인용 세션 쿠키는 HttpOnly이며 24시간 유지됩니다.
- 실제 Supabase `orders`, `payments`, 재고·배송에는 반영하지 않습니다. 현재 DB의 주문 접수 함수는 결제 전에 재고를 차감할 수 있어 테스트 결제와 직접 연결하지 않았습니다.
- 이 파일 저장소는 단일 로컬 서버를 위한 것입니다. 서버리스·다중 서버·실결제에는 DB 트랜잭션, 회원 소유권 검증, 재고 예약·복구, 웹훅 및 대사가 먼저 필요합니다. 라이브 키만 바꿔 운영 결제로 사용하는 구조가 아닙니다.

## 문제 확인

| 증상                     | 확인할 내용                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| 테스트 키 설정 안내      | 두 환경 변수 이름, 테스트 키 접두어, 같은 키 종류의 세트인지 확인하고 서버 재시작             |
| 결제창 로딩 실패         | 광고 차단·네트워크 설정 확인 후 새로고침                                                      |
| 금액 불일치              | 장바구니로 돌아가 다시 시작. 서버의 테스트 상품 가격과 비교됨                                 |
| 승인 상태 확인 실패      | 완료 화면에서 **승인 상태 다시 확인**. 응답 유실 시 토스 조회 API로 복구하며 동일 멱등키 사용 |
| 세션/주문을 찾을 수 없음 | 결제를 시작한 브라우저·동일 호스트에서 재시도. localhost와 IP 주소를 혼용하지 않기            |

공식 자료: [결제창형 연동](https://docs.tosspayments.com/guides/v2/payment-widget/integration-window), [API 개별 통합결제창](https://docs.tosspayments.com/guides/v2/payment-window/integration), [멱등키·인증](https://docs.tosspayments.com/reference/using-api/authorization).
