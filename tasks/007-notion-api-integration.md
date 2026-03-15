# Task 007: Notion API 통합 구현

## 개요

Notion API 클라이언트를 설정하고, 견적서 데이터를 조회하는 서비스 레이어를 구현한다.

## 관련 파일

- `src/lib/notion.ts` — Notion 클라이언트 및 데이터 페칭 로직
- `src/lib/env.ts` — Zod 검증 환경 변수
- `src/types/invoice.ts` — Invoice, InvoiceItem, InvoiceStatus 타입

## 수락 기준

- [x] Notion API 연결 성공
- [x] `getInvoiceById(pageId)` — 존재하는 페이지 → Invoice 반환
- [x] `getInvoiceById(pageId)` — `object_not_found` → `null` 반환
- [x] `isFullPage()` guard 적용
- [x] 한국어 Notion 필드명 그대로 사용 (`견적서 번호`, `클라이언트명` 등)
- [x] 항목(Items) 병렬 페치 (`Promise.all`)
- [x] `총 금액` 없으면 items 합산으로 fallback
- [x] `getServerEnv()` 서버 사이드에서만 호출

## 구현 단계

- [x] **Step 1** — `src/lib/env.ts` Zod 스키마 구현
- [x] **Step 2** — `src/lib/notion.ts` Notion 클라이언트 초기화 (`getNotionClient`)
- [x] **Step 3** — `getInvoiceById` 구현 (페이지 조회 + 필드 추출)
- [x] **Step 4** — `fetchInvoiceItems` 구현 (관계형 항목 병렬 조회)
- [x] **Step 5** — `object_not_found` 에러 핸들링

## 상태

✅ 완료
