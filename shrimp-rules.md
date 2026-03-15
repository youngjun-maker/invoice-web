# Development Guidelines

## Project Overview

- **Purpose**: Notion-based invoice management MVP — clients view invoices via `/invoice/[id]` and download as PDF
- **Stack**: Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4, shadcn/ui (new-york/zinc), @react-pdf/renderer, @notionhq/client
- **Path alias**: `@/*` → `./src/*`

---

## Project Architecture

### Directory Rules

- `src/app/` — routes only; no business logic
- `src/lib/` — server-side utilities (`notion.ts`, `env.ts` are **server-only**)
- `src/components/ui/` — shadcn primitives; **NEVER edit these files**
- `src/components/shared/` — reusable UI (LoadingSpinner, EmptyState)
- `src/components/invoice/` — invoice-specific components; export via `index.ts` barrel
- `src/types/invoice.ts` — single source of truth for all domain types
- `tasks/` — task spec files named `XXX-description.md`

### Route Map

```
/invoice/[id]               → src/app/invoice/[id]/page.tsx       (Server Component)
/invoice/[id] loading       → src/app/invoice/[id]/loading.tsx
/invoice/[id] error         → src/app/invoice/[id]/error.tsx       ("use client")
/api/invoice/[id]           → src/app/api/invoice/[id]/route.ts
/api/pdf                    → src/app/api/pdf/route.ts
```

---

## Server vs. Client Boundary

- **Server-only files**: `src/lib/notion.ts`, `src/lib/env.ts` — never import in Client Components or browser code
- **`getServerEnv()`** — call only from Server Components or API Routes
- **`"use client"`** — required at top of any file using hooks, event handlers, or browser APIs
- `invoice-view.tsx` is a Client Component; `invoice/[id]/page.tsx` is a Server Component
- PDF generation runs **only** in `/api/pdf` route handler — never in Server Actions or Client Components

---

## TypeScript Rules

- No `any`, no unchecked nulls — strict mode is enforced
- Import all domain types from `@/types/invoice.ts`; **never redefine inline**
- Do not create new type files for domain types; extend `src/types/invoice.ts` if needed

---

## Notion API Rules

- Always call `isValidNotionId(id)` before any Notion API call with a user-supplied ID
- Always use `isFullPage()` guard from `@notionhq/client` before accessing page properties
- Notion field names are Korean — **never rename** (e.g., `"견적서 번호"`, `"클라이언트명"`, `"항목명"`, `"수량"`, `"단가"`, `"금액"`)
- `object_not_found` error → return `null` from `getInvoiceById`
- Invalid ID or `null` result from `getInvoiceById` → call `notFound()` in page.tsx
- Never expose internal error details to the client response

---

## Styling Rules

- Tailwind CSS v4: use `@theme inline` CSS variables in `src/app/globals.css` — **do NOT use `tailwind.config.js`**
- Use `cn()` from `@/lib/utils` for all conditional class merging
- Add shadcn components with: `npx shadcn@latest add <component-name>`
- No dark mode toggle — system preference only (already configured)
- Do not add inline styles; use Tailwind classes

---

## PDF Rules

- Use `renderToBuffer()` — **never `renderToStream()`** — inside `/api/pdf` route handler
- Korean font support via `NotoSansKR` from Google Fonts CDN in `invoice-pdf.tsx`
- PDF component: `src/components/invoice/invoice-pdf.tsx`
- PDF API route: `src/app/api/pdf/route.ts`

---

## Error Handling Rules

- Invalid Notion ID → `notFound()` (renders `not-found.tsx`)
- Missing page (null) → `notFound()`
- Never send stack traces or internal error messages to the client
- Use `src/app/invoice/[id]/error.tsx` for runtime errors in the invoice route

---

## Key File Interactions

| When modifying... | Also check/update... |
|---|---|
| `src/types/invoice.ts` | All files importing from it (`notion.ts`, `invoice-view.tsx`, `invoice-pdf.tsx`, API routes) |
| `src/lib/notion.ts` | `src/app/invoice/[id]/page.tsx`, `src/app/api/invoice/[id]/route.ts` |
| `src/components/invoice/invoice-pdf.tsx` | `src/app/api/pdf/route.ts` |
| `src/lib/constants.ts` | Any component using `INVOICE_STATUS_LABELS` or `INVOICE_STATUS_COLORS` |
| `src/app/invoice/[id]/page.tsx` | `loading.tsx`, `error.tsx` in same directory |
| New invoice component | `src/components/invoice/index.ts` barrel export |

---

## Workflow Rules

1. **Before coding** — read `docs/ROADMAP.md` to identify the next task
2. **Create task file** in `tasks/XXX-description.md` with: spec, related files, acceptance criteria, implementation steps
3. **API/business logic tasks** — include `## 테스트 체크리스트` section with Playwright MCP test scenarios
4. **After implementation** — run Playwright MCP E2E tests; do not proceed without passing tests
5. **After each task** — mark ✅ in `docs/ROADMAP.md`; **stop and wait for next instruction**

---

## Prohibited Actions

- **NEVER edit** files in `src/components/ui/`
- **NEVER import** `src/lib/notion.ts` or `src/lib/env.ts` in Client Components
- **NEVER use** `renderToStream()` for PDF generation
- **NEVER rename** Korean Notion field names
- **NEVER redefine** domain types inline — use `@/types/invoice.ts`
- **NEVER expose** error internals to client responses
- **NEVER use** `tailwind.config.js` for theme customization — use `@theme inline` in `globals.css`
- **NEVER use** `any` type or bypass TypeScript strict checks
- **NEVER start the next task** without explicit user instruction
