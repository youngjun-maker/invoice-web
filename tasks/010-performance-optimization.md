# Task 010: 성능 최적화 및 캐싱 구현

## 목표
Notion API 호출 비용 절감 및 응답 속도 향상을 위해 캐싱 레이어를 추가한다.

## 변경 범위

| 파일 | 변경 내용 |
|------|---------|
| `src/lib/notion.ts` | Notion Client 싱글톤 + `unstable_cache` 래핑 (revalidate: 60초) |
| `next.config.ts` | `serverExternalPackages: ["@react-pdf/renderer"]` 추가 |
| `src/app/api/invoice/[id]/route.ts` | 성공 응답에 `Cache-Control` 헤더 추가 |
| `src/app/invoice/[id]/loading.tsx` | 이미 존재 — 변경 불필요 |

## 수용 기준 (Acceptance Criteria)
- [x] Notion Client가 모듈 레벨에서 한 번만 초기화된다
- [x] `getInvoiceById` 결과가 60초간 캐시된다
- [x] `/api/invoice/[id]` 성공 응답에 `Cache-Control: public, s-maxage=60, stale-while-revalidate=30` 헤더가 포함된다
- [x] `next.config.ts`에 `serverExternalPackages`가 추가된다
- [x] `npm run type-check && npm run lint` 통과
- [x] E2E 테스트: 견적서 페이지 로드 정상
- [x] E2E 테스트: PDF 다운로드 정상 (`content-type: application/pdf` 확인)
- [x] E2E 테스트: `/api/invoice/[id]` 응답 헤더 `cache-control: public, s-maxage=60, stale-while-revalidate=30` 확인

## 진행 상황

- [x] 파일 분석 완료
- [x] `src/lib/notion.ts` 수정 (싱글톤 + unstable_cache)
- [x] `next.config.ts` 수정 (serverExternalPackages)
- [x] `src/app/api/invoice/[id]/route.ts` 수정 (Cache-Control)
- [x] type-check + lint 통과
- [x] E2E 테스트 통과

## 구현 세부사항

### Notion Client 싱글톤
`_notionClient` 모듈 변수를 도입해 Node.js 프로세스당 한 번만 `Client`를 생성한다.
요청마다 `new Client()`를 호출하던 방식을 제거했다.

### unstable_cache 래핑
`fetchInvoiceById` (내부 함수)를 `unstable_cache`로 래핑해 `getInvoiceById`로 export한다.
캐시 키: `["invoice-by-id"]`, revalidate: 60초.
`generateMetadata`와 `InvoicePage` 양쪽에서 동일 ID로 호출하면 첫 번째 결과가 재사용된다.

### Cache-Control 헤더
`/api/invoice/[id]` 성공 응답에만 헤더를 추가했다. 404/400/500 오류 응답은 캐시하지 않는다.
PDF 라우트는 이미 `no-store`로 올바르게 설정되어 있어 변경하지 않았다.
