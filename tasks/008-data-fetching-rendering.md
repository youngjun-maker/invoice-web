# Task 008: 견적서 데이터 페칭 및 렌더링

## 개요

Server Component에서 Notion 데이터를 페치하고, `InvoiceView`에 실제 데이터를 연결한다.
더미 데이터 의존성을 제거하고 동적 라우팅과 실제 API 연동을 완성한다.

## 관련 파일

- `src/app/invoice/[id]/page.tsx` — Server Component: ID 검증 + 데이터 페치 + 렌더링
- `src/app/invoice/[id]/loading.tsx` — 스켈레톤 로딩 UI
- `src/app/invoice/[id]/error.tsx` — 에러 바운더리
- `src/app/api/invoice/[id]/route.ts` — GET /api/invoice/[id] JSON 엔드포인트
- `src/lib/utils.ts` — `isValidNotionId()`, `normalizeNotionId()`

## 수락 기준

- [x] `isValidNotionId(id)` 실패 → `notFound()` 호출
- [x] `getInvoiceById()` null 반환 → `notFound()` 호출
- [x] `generateMetadata` 동적으로 제목/설명 설정
- [x] `<InvoiceView invoice={invoice} />` 실제 데이터로 렌더링
- [x] API Route `GET /api/invoice/[id]` — JSON 응답 (400/404/500 처리 포함)
- [x] 더미 데이터가 프로덕션 경로에서 사용되지 않음

## 구현 단계

- [x] **Step 1** — `page.tsx`에서 `getInvoiceById` 연동 (더미 데이터 제거)
- [x] **Step 2** — ID 유효성 검증 (`isValidNotionId`) 후 `notFound()` 처리
- [x] **Step 3** — `generateMetadata` 구현
- [x] **Step 4** — `GET /api/invoice/[id]` Route Handler 구현

## 상태

✅ 완료
