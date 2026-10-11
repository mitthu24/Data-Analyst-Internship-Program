# Architecture

## Stack

- **Next.js 16** (App Router, Turbopack), **TypeScript**, **Tailwind CSS 3**.
- **PostgreSQL** via **Prisma 5**.
- **Zod** for all server-side input validation.
- **Argon2id** (`@node-rs/argon2`) for password hashing.
- **Vercel Blob** (optional) for image uploads.
- **Google Sheets API** (`googleapis`, optional) for lead sync.
- **Vitest** for unit tests.

## Two content layers, one public site

Every page under `src/app/*` (outside `/founder`) renders from
`src/lib/content/*` — the same modules Phase 1 introduced. Each one now
exports **two** things:

1. The original static array/object (e.g. `curriculum`, `trainers`,
   `settings`) — unchanged, and used as the fallback.
2. An async getter (`getCurriculum()`, `getTrainers()`, `getSettings()`,
   …) that queries Postgres for **published** rows and falls back to #1
   whenever the database is unconfigured, unreachable, or has no rows yet.

Public pages import only the getters. This means:

- A public page never 500s because of a database hiccup — it silently
  serves the shipped defaults instead.
- The admin panel and the public site render from the exact same shapes,
  so there's no risk of them drifting apart structurally.
- Draft content is invisible to the public site by construction — every
  getter filters `status: "PUBLISHED"` at the query level, not in the UI.

`src/lib/content/site-content.ts` + `site-schema.ts` do the same for
free-form copy (homepage hero, About intro, footer text, announcement
banner, SEO overrides, brochure intro) via a generic `ContentEntry`
key/value table, validated against a Zod shape per key rather than one
model per content type.

## The founder admin panel

Route group: `src/app/founder/(app)/*` — the `(app)` segment doesn't
affect the URL (so `/founder/(app)/curriculum` serves at `/founder/curriculum`),
it only lets `/founder/login` sit outside the authenticated layout.

- `src/app/founder/(app)/layout.tsx` calls `requireFounder()` and renders
  the sidebar shell.
- **Every page under it also calls `requireFounder()` itself** — this is
  not redundant. See docs/SECURITY.md for why a layout-only check is
  insufficient in Next's streaming render model.
- CRUD follows one consistent pattern per resource: a list page (table +
  search/filter where relevant), a `new` page, and a `[id]/edit` page,
  backed by Server Actions in `src/lib/actions/*-actions.ts`. Each action:
  1. `requireFounderForAction()`
  2. Validates with the matching Zod schema
  3. Mutates via Prisma
  4. `revalidatePath()`s every affected public route
  5. Writes an `AuditEvent` for publish/unpublish and sensitive changes
- Mentors (`/founder/mentors`) are not a separate table — they're
  `Trainer` rows with `isMentor: true`, sharing `TrainerForm` with core
  trainers but filtered and labeled differently in the UI.

## Request flow for a public lead

```
Contact form (client)
  → POST /api/leads (validates, rate-limits, duplicate-detects, writes to Postgres)
    → response returned to the browser immediately
    → syncLeadToSheets(lead.id) fires without being awaited
       → DISABLED if Sheets env vars aren't set (default today)
       → otherwise appends a row, keyed by the lead's own DB id for idempotency
```

Postgres is always the source of truth; Sheets is best-effort and
retryable from `/founder/leads/[id]`. See docs/GOOGLE_SHEETS_SETUP.md.

## Directory map

```
prisma/
  schema.prisma        # 13 models — see docs/DATABASE.md
  seed.ts               # bootstraps the founder account + Settings row
  seed-content.ts        # imports Phase 1's real content as initial published rows
src/
  app/
    (public pages)       # /, /about, /curriculum, ... — all async, DB-backed w/ fallback
    api/leads/            # public lead-capture endpoint
    api/founder/leads/export/  # authenticated CSV export
    founder/
      login/
      (app)/              # guarded admin panel, one folder per resource
  components/
    (public site components)
    founder/              # admin-only UI (forms, tables, sidebar)
  lib/
    auth/                 # session, password, login, guard, csrf, account, audit
    actions/              # one *-actions.ts per resource — all "use server"
    content/               # public content getters + static fallbacks
    validation/             # Zod schemas, one per resource
    integrations/           # Google Sheets adapter
    uploads/                 # storage abstraction (Vercel Blob)
    db/prisma.ts              # Prisma client singleton + health check
docs/                        # this file and its siblings
```
