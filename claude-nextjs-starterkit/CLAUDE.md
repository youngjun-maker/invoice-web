# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- PRD 문서: @../docs/PRD.md
- 개발 로드맵: @../docs/ROADMAP.md

## Project Overview

노션 기반 견적서 관리 시스템 MVP. Notion을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템.

## Commands

```bash
npm run dev        # Start dev server with Turbopack (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript type checking (tsc --noEmit)
```

Adding shadcn components:
```bash
npx shadcn@latest add <component-name>
```

## Architecture

### Route Structure

Single-purpose MVP — no auth, no dashboard, no marketing pages:

```
src/app/
├── layout.tsx              # Root layout (fonts, metadata)
├── page.tsx                # Root page (landing for direct access)
├── not-found.tsx           # 404 page (견적서를 찾을 수 없습니다)
├── invoice/[id]/
│   ├── page.tsx            # Server Component: fetches invoice from Notion
│   ├── loading.tsx         # Skeleton loading state
│   └── error.tsx           # Client error boundary
└── api/
    ├── invoice/[id]/route.ts  # GET: fetch invoice JSON
    └── pdf/route.ts           # GET ?id=: generate and stream PDF
```

### Data Flow

```
Client → /invoice/[notionPageId]
  → Server Component (page.tsx)
  → lib/notion.ts (getInvoiceById)
  → Notion API
  → <InvoiceView> (Client Component, handles PDF download)
  → /api/pdf?id=... (API Route)
  → @react-pdf/renderer → PDF stream
```

### Component Layers

```
src/components/
├── ui/          shadcn primitives (never edit directly)
├── shared/      reusable utility components (LoadingSpinner, EmptyState, etc.)
└── invoice/     domain-specific invoice components
    ├── invoice-view.tsx   Client Component: renders invoice UI + PDF download button
    └── invoice-pdf.tsx    PDF document template (@react-pdf/renderer)
```

### Key Files

- `src/lib/notion.ts` — Notion API client. `getInvoiceById(pageId)` is the main entry point.
- `src/lib/utils.ts` — `cn()`, `formatCurrency()`, `formatDate()`, `isValidNotionId()`, `normalizeNotionId()`.
- `src/lib/constants.ts` — `SITE_CONFIG`, `INVOICE_STATUS_LABELS`, `INVOICE_STATUS_COLORS`.
- `src/lib/env.ts` — Zod-validated environment variable schema. Import `getServerEnv()` server-side only.
- `src/types/invoice.ts` — All TypeScript types for Invoice domain.
- `src/app/globals.css` — Tailwind v4 theme via `@theme inline` with oklch colors.

### Styling Conventions

- Tailwind CSS v4 — use `@theme inline` CSS variables, not `tailwind.config.js`.
- shadcn/ui style: `new-york`, base color: `zinc`, icon library: `lucide-react`.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- No dark mode toggle — MVP uses system default only.

### Path Alias

`@/*` resolves to `./src/*` (e.g., `@/lib/utils`, `@/components/ui/button`).

### Environment Variables

Required server-side variables (see `.env.example`):
- `NOTION_API_KEY` — Notion integration token (starts with `secret_`)
- `NOTION_DATABASE_ID` — Notion Invoices database ID

Optional:
- `NEXT_PUBLIC_SITE_URL` — Public URL for canonical metadata

### PDF Generation Notes

- `@react-pdf/renderer` is used for server-side PDF generation.
- The `InvoicePDF` component uses `NotoSansKR` font loaded from Google Fonts CDN for Korean character support.
- PDF generation runs in the API route (`/api/pdf`), not in Server Actions or Client Components.
- `renderToBuffer()` is used (not `renderToStream()`) for compatibility with Next.js Route Handlers.

### Notion Data Mapping

| Notion Field | Type | Maps to |
|---|---|---|
| 견적서 번호 | Title | `invoice.invoiceNumber` |
| 클라이언트명 | Rich Text | `invoice.clientName` |
| 발행일 | Date | `invoice.issueDate` |
| 유효기간 | Date | `invoice.validUntil` |
| 총 금액 | Number | `invoice.totalAmount` |
| 상태 | Select | `invoice.status` |
| 항목 | Relation → Items DB | `invoice.items[]` |

Items DB fields: 항목명 (Title), 수량 (Number), 단가 (Number), 금액 (Formula)
