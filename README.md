# Data Analyst Internship Program — Website

Next.js (App Router) + TypeScript + Tailwind CSS site for the Data Analyst Internship Program.

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Prisma schema prepared for PostgreSQL (Railway) — see `prisma/schema.prisma` and `.env.example`
- Deploys to Vercel; no Docker required

## Getting started
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — local development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript project check
- `npm run format` — Prettier write

## Content architecture
All program content (curriculum, trainers, pricing, FAQ, nav) lives in `src/lib/content/*.ts`
as the single source of truth. Public pages import from there rather than hardcoding content,
so a future admin panel (Phase 2) can move the same shapes into Postgres via `prisma/schema.prisma`
without changing how pages render.

## Known follow-ups (Phase 2)
- Wire the Contact form lead capture (`src/app/api/leads/route.ts`) to the Google Sheet at
  `settings.leadsSheetUrl` using a Google service account (see `.env.example`).
- Connect `DATABASE_URL` to a provisioned Railway Postgres instance and run Prisma migrations.
- Build the founder admin panel for curriculum/trainers/projects/testimonials/gallery.
- Add real trainer photos, testimonials, and gallery images once available.
