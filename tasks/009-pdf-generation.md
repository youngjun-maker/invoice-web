# Task 009: PDF 생성 및 다운로드 기능

## 개요

`@react-pdf/renderer`를 사용하여 견적서를 PDF로 변환하고 다운로드하는 기능을 구현한다.
한글 폰트(NotoSansKR) 지원 및 API Route를 통한 스트리밍 다운로드를 포함한다.

## 관련 파일

- `src/components/invoice/invoice-pdf.tsx` — `@react-pdf/renderer` PDF 템플릿
- `src/app/api/pdf/route.ts` — `GET /api/pdf?id=` PDF 생성 및 스트림 반환
- `src/components/invoice/invoice-view.tsx` — PDF 다운로드 버튼 (Client Component)

## 수락 기준

- [x] `GET /api/pdf?id={notionPageId}` → PDF 바이너리 반환
- [x] `renderToBuffer()` 사용 (renderToStream 아님)
- [x] `NotoSansKR` 폰트로 한글 정상 렌더링
- [x] `Content-Disposition: attachment` 헤더 (UTF-8 인코딩 파일명)
- [x] 잘못된 ID → 400, 존재하지 않는 ID → 404, 서버 오류 → 500
- [x] `InvoiceView`에서 다운로드 버튼 클릭 시 `fetch('/api/pdf?id=...')` 트리거
- [x] 다운로드 중 로딩 상태 표시

## 구현 단계

- [x] **Step 1** — `InvoicePDF` 컴포넌트 구현 (A4, 한글 폰트, 섹션 레이아웃)
- [x] **Step 2** — `GET /api/pdf` Route Handler 구현
- [x] **Step 3** — `InvoiceView` 다운로드 버튼 핸들러 연결
- [x] **Step 4** — 파일명 UTF-8 인코딩 처리

## 상태

✅ 완료
