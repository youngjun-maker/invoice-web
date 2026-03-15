# Task 011: 보안 및 에러 처리 강화

## 목표
API 에러 메시지에서 내부 상세 정보 노출 제거, 구조화 로거 추가, 미들웨어 기반 요청 검증, 보안 헤더 강화.

## 수락 기준 (Acceptance Criteria)
- [x] `src/lib/logger.ts` 구조화 로거 생성 (production: JSON, development: 읽기 쉬운 포맷)
- [x] `api/pdf/route.ts` catch 블록에서 내부 에러 메시지 제거 → 제네릭 "Internal server error" 반환
- [x] `api/invoice/[id]/route.ts` catch 블록에 로거 추가
- [x] `src/middleware.ts` 생성: `/api/*` 라우트에 GET 이외 메서드 차단 (405), Content-Length 초과 차단 (413), CORS 헤더 설정
- [x] `next.config.ts` CSP 헤더 추가 (`unsafe-inline` 허용, `object-src 'none'`, `frame-ancestors 'none'`)
- [x] `src/lib/env.ts` NOTION_API_KEY `secret_` 접두사 검증 추가

## 변경된 파일
| 파일 | 변경 내용 |
|---|---|
| `src/lib/logger.ts` | 신규 — 구조화 서버 로거 |
| `src/middleware.ts` | 신규 — Edge Runtime 미들웨어 |
| `src/app/api/pdf/route.ts` | catch 블록 에러 노출 제거, 로거 추가 |
| `src/app/api/invoice/[id]/route.ts` | catch 블록에 로거 추가 |
| `src/lib/env.ts` | NOTION_API_KEY `secret_` 접두사 검증 추가 |
| `next.config.ts` | CSP 헤더 추가 |

## E2E 테스트 결과
- `/invoice/not-a-valid-id` → 404 페이지 렌더링 ✅
- `GET /api/invoice/not-a-valid-id` → 400 `INVALID_ID` ✅
- `POST /api/invoice/some-id` → 405 `METHOD_NOT_ALLOWED`, `Allow: GET` 헤더 ✅
- `GET /api/pdf?id=not-a-valid-id` → 400 `INVALID_ID` ✅
- 응답 헤더 확인: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `CSP`, `Access-Control-Allow-Methods` ✅
- 루트 페이지 정상 로드 ✅

## 구현 메모
- 미들웨어는 Edge Runtime 제약으로 `lib/notion.ts` / `lib/env.ts` import 불가 — 독립적으로 구현
- CSP의 `unsafe-inline`은 Next.js hydration에 필요하므로 제거 불가 (MVP 단계)
- Rate limiting은 Vercel 플랫폼 레벨에서 처리 — 미들웨어에서 미구현
- CORS `Access-Control-Allow-Origin`은 same-origin 요청에만 echo — 공개 CORS 허용 없음

## 상태
✅ 완료 (2026-03-15)
