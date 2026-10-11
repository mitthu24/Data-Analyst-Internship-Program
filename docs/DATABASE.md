# Database

## Status

- **Schema**: complete (`prisma/schema.prisma`) — 13 models covering auth,
  content, leads, and audit logging.
- **Migrations**: versioned and applied cleanly against a real PostgreSQL
  16 instance during development (two migrations so far —
  `20261011053825_init_phase2_cms` and `20261011061135_add_lead_ip`).
- **Production (Railway)**: **not connected**. This environment had no
  Railway credentials available, so everything above was built and
  verified against a local PostgreSQL 16 instance instead. No
  `DATABASE_URL` for Railway was invented or assumed anywhere in the code
  or committed files. See "Connecting Railway" below for the exact next
  step.

## Stack

- **Prisma 5** as the ORM and migration tool.
- **PostgreSQL** (16 locally; Railway in production).
- A lazily-instantiated singleton client (`src/lib/db/prisma.ts`) shared
  across the app via `globalThis` in development to avoid exhausting
  connections on hot reload.

## Environment variable validation

- `isDatabaseConfigured()` (`src/lib/db/prisma.ts`) checks whether
  `DATABASE_URL` is set, without connecting. Public content loaders
  (`src/lib/content/*`) call this first and fall back to their shipped
  static defaults if it's false — the marketing site never 500s just
  because Postgres isn't configured yet.
- `checkDatabaseHealth()` runs a real `SELECT 1` and is used by the
  founder dashboard to show live connection status.
- Anything that actually requires the database (auth, every founder
  mutation) calls through Prisma directly and will surface a clear error
  if the connection fails, rather than silently no-op'ing.

## Local development setup

1. Install PostgreSQL 16 (or use any Postgres 14+).
2. Create a database and a role:
   ```bash
   sudo -u postgres psql -c "CREATE ROLE appuser WITH LOGIN PASSWORD 'devpassword';"
   sudo -u postgres psql -c "ALTER ROLE appuser CREATEDB;"
   sudo -u postgres psql -c "CREATE DATABASE dainternship OWNER appuser;"
   ```
3. Copy `.env.example` to `.env` and set:
   ```
   DATABASE_URL="postgresql://appuser:devpassword@localhost:5432/dainternship"
   FOUNDER_BOOTSTRAP_EMAIL="you@example.com"
   FOUNDER_BOOTSTRAP_PASSWORD="At-least-12-chars!1"
   ```
4. Apply migrations:
   ```bash
   npm run db:migrate
   ```
5. Bootstrap the founder account and import Phase 1's real content
   (curriculum, trainers, mentors, projects, FAQ) as the initial published
   rows:
   ```bash
   npm run db:seed
   ```
   This is idempotent — re-running it never overwrites a founder's edits
   to existing rows, and only fills in anything missing.

## Production migrations

Vercel builds run `npm install`, which runs `prisma generate` via the
`postinstall` script — this does **not** apply migrations. Migrations must
be applied explicitly against the production database:

```bash
# From a machine/CI job with the production DATABASE_URL set:
npm run db:migrate:deploy
```

`db:migrate:deploy` runs `prisma migrate deploy`, which applies pending
migrations non-interactively and is safe to run repeatedly (it only
applies what hasn't been applied yet). Run it once per new migration, as
part of your deploy process — it is intentionally **not** wired into the
Vercel build itself, so a bad migration can't take down a working
deployment silently.

Never run `prisma migrate reset` or `prisma db push --force-reset`
against a database with real data — both are destructive.

## Connecting Railway (the actual remaining step)

1. Create a PostgreSQL database in a Railway project.
2. Copy its connection string (Railway's "Connect" tab, the
   `DATABASE_URL`-shaped value — enable "Public Networking" if migrating
   from outside Railway's own network, e.g. from Vercel's build step or
   your local machine).
3. Set `DATABASE_URL` in:
   - Vercel: Project Settings → Environment Variables (Production,
     Preview, and Development as appropriate).
   - Your local `.env`, temporarily, if you're the one applying the first
     migration.
4. Run `npm run db:migrate:deploy` against that `DATABASE_URL`.
5. Run `npm run db:seed` once (with `FOUNDER_BOOTSTRAP_EMAIL` /
   `FOUNDER_BOOTSTRAP_PASSWORD` set) to create the real founder account
   and import the Phase 1 content.
6. Redeploy (or just visit the site) — public pages will immediately start
   reading from the real database.

## Schema overview

| Model | Purpose |
|---|---|
| `Founder` | The single admin account; password hash, lockout state, `mustChangePassword` |
| `Session` | Opaque, hashed session tokens (not JWTs) — revocable server-side |
| `AuditEvent` | Security and content-change audit log |
| `ContentEntry` | Generic key/value store for hero/about/footer/banner/SEO copy |
| `Settings` | Singleton row: program schedule, pricing, refund policy, contact info |
| `CurriculumSession` | The 25 sessions; `module`, `order`, `status`, optional `trainerId` |
| `Trainer` | Core trainers and corporate mentors (`isMentor` flag) |
| `Project` | Portfolio projects |
| `Testimonial` | Requires `consent=true` to ever be published |
| `GalleryItem` | Photos |
| `Faq` | FAQ entries |
| `Lead` | Public inquiries; status, Sheets sync state, duplicate detection |
| `LeadNote` | Founder follow-up notes on a lead |

All content models share a `status: DRAFT | PUBLISHED` pattern — public
pages only ever query `PUBLISHED` rows.
