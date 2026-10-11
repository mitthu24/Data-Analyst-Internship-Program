# Data Analyst Internship Program — Website & Founder Admin Panel

A Next.js marketing site with a full, database-backed CMS for the Data
Analyst Internship Program: 15 public pages plus a founder admin panel
to manage curriculum, trainers, mentors, projects, testimonials, gallery,
pricing, leads, and general site content — without touching code.

## Stack

- **Next.js 16** (App Router, Turbopack), **TypeScript**, **Tailwind CSS 3**
- **PostgreSQL** via **Prisma 5** (Railway in production)
- **Argon2id** password hashing, server-side sessions (not JWTs)
- **Zod** validation on every mutation
- **Vercel Blob** for image uploads (optional, falls back to manual URLs)
- **Google Sheets API** for lead sync (optional, falls back to DB-only)
- **Vitest** for unit tests
- Deploys to Vercel; no Docker required

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and FOUNDER_BOOTSTRAP_* — see docs/DATABASE.md
npm run db:migrate     # apply migrations to your local Postgres
npm run db:seed        # bootstrap the founder account + import real Phase 1 content
npm run dev
```

Then sign in at `/founder/login` with the email/password you set in
`FOUNDER_BOOTSTRAP_EMAIL`/`FOUNDER_BOOTSTRAP_PASSWORD` — you'll be
prompted to change the password immediately (`/founder/security`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Run a production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check |
| `npm run test` | Vitest unit tests |
| `npm run format` | Prettier write |
| `npm run db:migrate` | Apply migrations in development (`prisma migrate dev`) |
| `npm run db:migrate:deploy` | Apply migrations in production (`prisma migrate deploy`) |
| `npm run db:seed` | Bootstrap the founder account + import initial content |

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the content layer, admin panel, and lead pipeline fit together
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, local setup, migrations, connecting Railway
- [`docs/SECURITY.md`](docs/SECURITY.md) — auth design, a real authorization bug found and fixed during this build, known accepted risks
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Vercel deploy steps, credential rotation
- [`docs/GOOGLE_SHEETS_SETUP.md`](docs/GOOGLE_SHEETS_SETUP.md) — exact steps to enable live lead sync
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — every check that was actually run, with real results

## Founder admin panel

| Route | Purpose |
|---|---|
| `/founder/login` | Sign in |
| `/founder` | Dashboard — live counts, recent activity |
| `/founder/content` | Homepage hero, About, Career Guidance, footer, announcement banner, SEO, FAQ |
| `/founder/curriculum` | The 25-session curriculum (full CRUD) |
| `/founder/trainers` | Core trainers |
| `/founder/mentors` | Corporate expert mentors (classes 22–25) |
| `/founder/projects` | Project portfolio |
| `/founder/testimonials` | Testimonials — publish requires recorded consent |
| `/founder/gallery` | Photo gallery |
| `/founder/brochure` | Brochure-specific settings (the brochure itself pulls curriculum/trainers/pricing live) |
| `/founder/pricing` | Pricing, refund policy text, enrollment URL — with a live preview |
| `/founder/leads` | Lead inbox — search, filter, status, notes, CSV export, Sheets retry |
| `/founder/settings` | Program schedule, batch details, contact info |
| `/founder/security` | Password/email change, active sessions, security activity log |

## Content architecture

Public pages read through async getters in `src/lib/content/*.ts`
(`getCurriculum()`, `getTrainers()`, `getSettings()`, …), which query
Postgres for published rows and fall back to shipped static defaults if
the database is unconfigured or unreachable — the marketing site never
breaks because of a database issue. See `docs/ARCHITECTURE.md` for the
full design.

## Known remaining setup (honestly stated, not glossed over)

- **Railway PostgreSQL is not connected.** Everything was built and
  verified against a local PostgreSQL 16 instance (no Railway credentials
  were available in this environment). See `docs/DATABASE.md` for the
  exact connection steps — the schema, migrations, and seed script are
  all ready to run against it unchanged.
- **Google Sheets sync is built but unverified against the real sheet** —
  this environment had no Google Cloud credentials either. Every lead
  today is saved correctly with `sheetsSyncStatus: DISABLED`. See
  `docs/GOOGLE_SHEETS_SETUP.md`.
- **Image uploads fall back to manual URLs** until `BLOB_READ_WRITE_TOKEN`
  is set — see `docs/DEPLOYMENT.md`.
- **Not deployed to Vercel from this session** — no Vercel project
  connected here. See `docs/DEPLOYMENT.md`.
