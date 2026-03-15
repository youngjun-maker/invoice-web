# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Context

- PRD: @../docs/PRD.md
- 로드맵: @../docs/ROADMAP.md

## Project Overview

노션 기반 견적서 관리 시스템 MVP. Notion API를 데이터 소스로 활용하여 클라이언트가 고유 URL(`/invoice/[id]`)로 견적서를 조회하고 PDF로 다운로드하는 단일 기능 시스템.

---

## Commands

```bash
npm run dev        # Dev server with Turbopack (http://localhost:3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run type-check # TypeScript check (tsc --noEmit)
```

Add shadcn components:
```bash
npx shadcn@latest add <component-name>
```

---

## Architecture

### Route Structure

```
src/app/
├── layout.tsx                    # Root layout (fonts, metadata)
├── page.tsx                      # Root redirect / landing
├── not-found.tsx                 # 404 — "견적서를 찾을 수 없습니다"
├── invoice/[id]/
│   ├── page.tsx                  # Server Component: fetches from Notion, renders <InvoiceView>
│   ├── loading.tsx               # Skeleton loading state
│   └── error.tsx                 # Client error boundary
└── api/
    ├── invoice/[id]/route.ts     # GET: return invoice JSON
    └── pdf/route.ts              # GET ?id=: generate and stream PDF
```

### Data Flow

```
/invoice/[id]
  → page.tsx (Server Component)
    → isValidNotionId(id)           ← lib/utils.ts
    → getInvoiceById(id)            ← lib/notion.ts
      → notion.pages.retrieve()
      → fetchInvoiceItems()
    → <InvoiceView invoice={...} /> ← components/invoice/invoice-view.tsx
      → PDF download button
        → GET /api/pdf?id=...       ← app/api/pdf/route.ts
          → renderToBuffer(<InvoicePDF>) ← components/invoice/invoice-pdf.tsx
```

### Component Layers

```
src/components/
├── ui/           shadcn primitives — NEVER edit directly
├── shared/       reusable utility components (LoadingSpinner, EmptyState, etc.)
└── invoice/
    ├── invoice-view.tsx   Client Component: renders invoice UI + PDF download
    ├── invoice-pdf.tsx    @react-pdf/renderer PDF template
    └── index.ts           barrel export
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/notion.ts` | Notion API client. `getInvoiceById(pageId)` is the main entry point. Server-side only. |
| `src/lib/utils.ts` | `cn()`, `formatCurrency()`, `formatDate()`, `isValidNotionId()`, `normalizeNotionId()` |
| `src/lib/constants.ts` | `SITE_CONFIG`, `INVOICE_STATUS_LABELS`, `INVOICE_STATUS_COLORS` |
| `src/lib/env.ts` | Zod-validated env vars. Use `getServerEnv()` server-side only. |
| `src/types/invoice.ts` | All TypeScript types: `Invoice`, `InvoiceItem`, `InvoiceStatus`, API response types |
| `src/app/globals.css` | Tailwind v4 theme via `@theme inline` with oklch colors |

---

## Coding Rules

### TypeScript
- Strict mode is enabled — no `any`, no unchecked nulls.
- Import types from `@/types/invoice.ts`. Do not redefine domain types inline.
- Use `isValidNotionId()` before any Notion API call with a user-supplied ID.

### Server vs. Client
- `lib/notion.ts` and `lib/env.ts` are **server-side only**. Never import in Client Components.
- `getServerEnv()` must only be called from Server Components or API Routes.
- Mark interactive components with `"use client"` at the top.

### Styling
- Tailwind CSS v4 — use `@theme inline` CSS variables, **not** `tailwind.config.js`.
- shadcn/ui style: `new-york`, base color: `zinc`, icon library: `lucide-react`.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- No dark mode toggle — MVP uses system preference only.

### Notion Data
- Notion field names are Korean (e.g. `"견적서 번호"`, `"클라이언트명"`). Do not rename them.
- Always use `isFullPage()` guard from `@notionhq/client` before accessing page properties.
- `object_not_found` error code from Notion API means the page doesn't exist → return `null`.

### PDF Generation
- Use `renderToBuffer()` (not `renderToStream()`) inside the `/api/pdf` route handler.
- `InvoicePDF` component uses `NotoSansKR` font from Google Fonts CDN for Korean support.
- PDF generation runs only in the API route — not in Server Actions or Client Components.

### Error Handling
- Invalid Notion ID → call `notFound()` (renders `not-found.tsx`).
- `getInvoiceById` returns `null` for missing pages → call `notFound()`.
- Never expose internal error details to the client response.

### Path Alias
- `@/*` resolves to `./src/*` (e.g. `@/lib/utils`, `@/components/ui/button`).

---

## Environment Variables

```env
# Required
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx

# Optional
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

See `.env.example` for the template.

---

## Notion Database Schema

### Invoices DB

| Notion Field | Type | TypeScript |
|---|---|---|
| 견적서 번호 | Title | `invoice.invoiceNumber` |
| 클라이언트명 | Rich Text | `invoice.clientName` |
| 발행일 | Date | `invoice.issueDate` |
| 유효기간 | Date | `invoice.validUntil` |
| 총 금액 | Number | `invoice.totalAmount` |
| 상태 | Select (`대기`/`승인`/`거절`) | `invoice.status` |
| 항목 | Relation → Items DB | `invoice.items[]` |

### Items DB

| Notion Field | Type | TypeScript |
|---|---|---|
| 항목명 | Title | `item.description` |
| 수량 | Number | `item.quantity` |
| 단가 | Number | `item.unitPrice` |
| 금액 | Formula (수량 × 단가) | `item.amount` |

---

## Development Workflow

1. **Before coding** — check `../docs/ROADMAP.md` for the next task and its acceptance criteria.
2. **Task files** — create in `tasks/XXX-description.md` with spec, acceptance criteria, and steps.
3. **Testing** — any task touching API or business logic requires Playwright MCP E2E tests.
4. **After each task** — update progress in the task file; mark ✅ in ROADMAP.md when done.
5. **Stop after each task** — wait for instruction before starting the next one.
