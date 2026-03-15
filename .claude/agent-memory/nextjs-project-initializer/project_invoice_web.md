---
name: invoice-web project context
description: Notion-based invoice management system MVP — architecture decisions, tech stack, and initialization state
type: project
---

This is a Notion-based invoice management system MVP. The project lives at `claude-nextjs-starterkit/` under the workspace root.

**Why:** Freelancers/small businesses need to share invoices with clients via unique URLs, allowing PDF download. Notion serves as the database backend.

**How to apply:** All suggestions should be scoped to the MVP feature set: invoice view page + PDF download. No auth, no admin dashboard, no multi-tenancy.

## Tech Stack (verified installed and building)

- Next.js 15.5.3 (App Router, Turbopack in dev)
- React 19.1.0
- TypeScript 5.x with strict mode + noUncheckedIndexedAccess
- TailwindCSS v4 (CSS-first, @theme inline, no tailwind.config.js)
- shadcn/ui (new-york style, zinc base color)
- @notionhq/client ^2.2.15 — Notion API SDK
- @react-pdf/renderer ^4.3.0 — server-side PDF generation
- zod ^4.3.6 — env validation

## Project Structure

Source lives in `src/` with `@/*` alias pointing to `./src/*`.

Key paths:
- `src/app/invoice/[id]/page.tsx` — Server Component, fetches from Notion, renders InvoiceView
- `src/app/api/pdf/route.ts` — GET ?id= : generates PDF via renderToBuffer
- `src/app/api/invoice/[id]/route.ts` — JSON API endpoint
- `src/lib/notion.ts` — getInvoiceById() — main Notion data fetching logic
- `src/lib/env.ts` — Zod env validation, getServerEnv() for server-side use
- `src/types/invoice.ts` — All domain types

## Environment Variables Required

- NOTION_API_KEY (starts with "secret_")
- NOTION_DATABASE_ID
- NEXT_PUBLIC_SITE_URL (optional)

## Known Implementation Notes

- PDF uses NotoSansKR from Google Fonts CDN for Korean character support
- renderToBuffer() result must be wrapped in new Uint8Array() for Web API Response compatibility
- Notion 404 errors caught by checking error.code === "object_not_found"
- eslint.config.mjs uses @eslint/eslintrc FlatCompat to bridge legacy eslint-config-next
