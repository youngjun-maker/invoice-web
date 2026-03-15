---
name: 노션 기반 견적서 관리 시스템 MVP PRD 검증
description: 2026-03-14 검증한 노션 기반 견적서 조회 시스템 PRD의 주요 블로커 및 판정 결과
type: project
---

2026-03-14, 노션 기반 견적서 관리 시스템 MVP PRD를 Chain-of-Thought 방식으로 검증. 판정: 조건부 승인.

**핵심 블로커 3건**:
1. PDF 코드 샘플에서 `@react-pdf/renderer`와 `pdf-lib`의 API 혼용 오류 (`PDFDocument`는 존재하지 않는 export)
2. Notion Relation 타입 항목(items) 조회 로직이 코드 샘플에 누락됨 — 견적 항목 표시 불가
3. PDF 라이브러리 미결정 (Puppeteer는 Vercel 함수 크기 제한 초과 위험)

**주요 이슈**:
- "실시간 조회" 명세 vs. Next.js 15 기본 캐싱 동작 모순 (cache: 'no-store' 명시 필요)
- valid_until 만료 처리 로직 미정의 (데이터 모델에는 필드 존재)
- status 필드 활용 방식 미정의
- 통화 단위, VAT 처리 방식 미정의 (법적 효력 있는 문서)
- 성공 기준 5개 모두 정성적으로 작성되어 객관적 테스트 불가

**Why:** MVP 범위와 기술 선택(노션 백엔드, Next.js 15 + Vercel)은 합리적이나, 핵심 구현 코드 샘플에 오류가 있어 그대로 착수 불가.

**How to apply:** 이 프로젝트의 후속 PRD나 기술 명세 검토 시, 코드 샘플의 라이브러리 API 정확성과 Notion Relation 조회 로직을 우선 확인할 것.
