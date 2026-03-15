# Task 012: 테스트 및 배포 준비

## 목표
Vitest 단위/통합 테스트 설정, Playwright E2E 최종 검증, Vercel 배포 구성 파일 생성.

## 수락 기준
- [x] Vitest 설정 완료 (vitest.config.ts, setup.ts)
- [x] 유틸리티 단위 테스트 통과 (21개 테스트 전체 통과)
- [x] API 라우트 통합 테스트 통과
- [x] `npm run build` 프로덕션 빌드 성공
- [x] Playwright E2E: 루트 페이지 정상 로드
- [x] Playwright E2E: 견적서 페이지 정상 렌더링
- [x] Playwright E2E: PDF 다운로드 성공 (200 OK)
- [x] Playwright E2E: 잘못된 ID → 404 페이지
- [x] Playwright E2E: POST 요청 → 405 응답
- [x] vercel.json 생성
- [x] .env.example 확인 (이미 존재)

## 구현 내용

### 신규 생성 파일
- `vitest.config.ts` — jsdom 환경, @vitejs/plugin-react, `@/` 경로 별칭
- `src/__tests__/setup.ts` — @testing-library/jest-dom import
- `src/__tests__/lib/utils.test.ts` — formatCurrency, formatDate, isValidNotionId, normalizeNotionId 테스트 (13개)
- `src/__tests__/api/invoice.test.ts` — GET /api/invoice/[id] 핸들러 통합 테스트 (8개)
- `vercel.json` — Vercel 배포 구성, env 시크릿 참조

### 수정된 파일
- `package.json` — devDependencies 추가(vitest, @testing-library/react, @testing-library/jest-dom, @vitejs/plugin-react, jsdom), `test`/`test:run` 스크립트 추가

## 테스트 결과

### 단위/통합 테스트
```
Test Files  2 passed (2)
Tests       21 passed (21)
Duration    1.28s
```

### 프로덕션 빌드
```
✓ Compiled successfully in 6.1s
✓ Generating static pages (6/6)
Route (app)                         Size  First Load JS
├ ○ /                              138 B         102 kB
├ ƒ /api/invoice/[id]              138 B         102 kB
├ ƒ /api/pdf                       138 B         102 kB
└ ƒ /invoice/[id]                3.53 kB         115 kB
```

### Playwright E2E
| 시나리오 | 결과 |
|----------|------|
| GET / → 루트 페이지 렌더링 | ✅ 200 |
| GET /invoice/[실제ID] → 견적서 렌더링 | ✅ 200, 모든 섹션 표시 |
| PDF 다운로드 버튼 클릭 | ✅ 200, 파일 다운로드 성공 |
| GET /api/pdf?id=[실제ID] | ✅ 200 |
| GET /invoice/not-a-valid-notion-id → 404 | ✅ 404 페이지 표시 |
| POST /api/invoice/[id] → 405 | ✅ 405 |

## 테스트 설계 결정 사항

- Server Component 직접 테스트 제외 — RSC는 Node.js 스트리밍 환경에 의존하므로 jsdom에서 실행 불가. API 라우트 핸들러와 순수 함수만 테스트.
- `vi.mock('@/lib/notion')` + `vi.mock('@/lib/logger')` 로 서버 전용 모듈 격리.
- `NextRequest` 생성자로 실제 요청 객체 구성 — `next/server`의 실제 구현을 사용해 모킹 없이 테스트.
- `params`는 `Promise<{ id: string }>` — Next.js v15 규격에 맞게 `Promise.resolve()`로 래핑.
