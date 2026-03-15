# 노션 기반 견적서 관리 시스템

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 고유 URL로 견적서를 조회하고 PDF로 다운로드할 수 있는 시스템입니다.

## 프로젝트 개요

**목적**: Notion API를 데이터 소스로 활용하여 견적서를 웹에서 조회하고 PDF 다운로드를 제공
**사용자**: 견적서를 발행하는 프리랜서/소규모 기업(관리자)과 견적서를 받는 클라이언트
**관리 UI**: 별도 관리자 페이지 없음 — Notion 데이터베이스가 관리 UI

## 주요 페이지

1. `/invoice/[id]` — 견적서 조회 페이지 (Notion 페이지 ID 기반)
2. `/` — 루트 랜딩 (견적서 링크로 접속 안내)
3. 404 페이지 — "견적서를 찾을 수 없습니다" 안내

## 핵심 기능

- **F001** 노션 데이터베이스 연동 — Notion API로 견적서 데이터 실시간 조회
- **F002** 견적서 조회 — 고유 URL로 견적서 내용 표시 (발행일, 유효기간, 항목별 금액, 총액)
- **F003** PDF 다운로드 — 견적서를 PDF 파일로 변환 및 즉시 다운로드
- **F011** 유효성 검증 — 존재하지 않는 견적서 ID 접근 시 404 처리
- **F012** 반응형 레이아웃 — 모바일/태블릿/데스크톱 대응

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15.5.3 (App Router) |
| Runtime | React 19 |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS v4 (`@theme inline` CSS variables) |
| UI Components | shadcn/ui (new-york, zinc, lucide-react) |
| Notion API | @notionhq/client |
| PDF 생성 | @react-pdf/renderer |
| 배포 | Vercel |

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 NOTION_API_KEY, NOTION_DATABASE_ID 입력

# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# TypeScript 검사
npm run type-check

# 린트
npm run lint
```

## 환경 변수

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Notion 데이터베이스 설정

### 견적서 DB 필드

| Notion 필드 | 타입 | 설명 |
|---|---|---|
| 견적서 번호 | Title | 견적서 식별 번호 |
| 클라이언트명 | Rich Text | 수신인 이름 |
| 발행일 | Date | 견적서 발행일 |
| 유효기간 | Date | 견적서 유효 기간 |
| 총 금액 | Number | 견적 총액 |
| 상태 | Select (대기/승인/거절) | 견적서 상태 |
| 항목 | Relation → Items DB | 견적 항목 목록 |

### 항목 DB 필드

| Notion 필드 | 타입 | 설명 |
|---|---|---|
| 항목명 | Title | 항목 설명 |
| 수량 | Number | 수량 |
| 단가 | Number | 단가 |
| 금액 | Formula (수량 × 단가) | 항목 금액 |

## 개발 현황

- [x] 프로젝트 구조 설정
- [x] Notion API 클라이언트 (`src/lib/notion.ts`)
- [x] 타입 정의 (`src/types/invoice.ts`)
- [x] 견적서 조회 페이지 (`/invoice/[id]`)
- [x] PDF 생성 API (`/api/pdf`)
- [x] 견적서 뷰어 컴포넌트
- [ ] 한국어 폰트 자체 호스팅 (현재 Google Fonts CDN 사용)
- [ ] PDF 다운로드 실패 시 UI 피드백

## 문서

- [PRD](./docs/PRD.md) — 상세 요구사항
- [로드맵](./docs/ROADMAP.md) — 개발 계획
- [개발 가이드](./CLAUDE.md) — 코딩 규칙 및 아키텍처
