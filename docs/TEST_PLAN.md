# Test Plan & Results

All results below are from commands actually run during this build — none
are assumed. Automated checks (`npm run lint`, `npm run typecheck`,
`npm run test`, `npm run build`) are repeatable from a clean checkout; the
integration checks were run with Playwright against real `next build &&
next start` production builds and a real local PostgreSQL 16 database
(not Railway — no Railway credentials were available in this environment;
see docs/DATABASE.md).

## Automated: lint, typecheck, unit tests, build

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 errors, 0 warnings |
| TypeScript | `npm run typecheck` | ✅ 0 errors |
| Unit tests | `npm run test` | ✅ 33/33 passing (6 files) |
| Production build | `npm run build` | ✅ all 40+ routes compile |

Unit test coverage: Argon2 password hashing/verification and policy
enforcement, CSV formula-injection escaping, lead submission schema
(including honeypot rejection), pricing schema cross-field validation
(launch ≤ reference, enrollment payment ≤ launch), curriculum session
schema, and `javascript:`/`data:` URL rejection in `safeUrlSchema`.

## Integration (manual, via Playwright against a live build + live Postgres)

Each row below was independently executed and its actual outcome
recorded — this is not a predicted/expected list.

| # | Spec requirement | How verified | Result |
|---|---|---|---|
| 1 | Founder login succeeds only with valid credentials | Logged in with correct password (→ dashboard), wrong password (→ error, stays on login) | ✅ both correct |
| 2 | Unauthenticated requests can't reach founder pages/APIs | `curl`/browser request to `/founder` with no cookie; also the CSV export API with no session | ✅ redirects to `/founder/login`; API returns `401` |
| 2b | *(found during this testing, not a pre-written case)* | A layout-only auth check let an unauthenticated response's raw HTML/RSC payload include real dashboard data before the client-side redirect ran | 🔧 **Real bug found and fixed** — see docs/SECURITY.md. Re-verified clean afterward (response shrank from ~16KB with lead-count data to an ~800-byte redirect) |
| 3 | Password changes require the current password | Attempted change with wrong current password | ✅ rejected with a clear error |
| 4 | Session revocation works after credential changes | Changed password, confirmed other sessions' cookies no longer grant access (DB: `Session.revokedAt` set) | ✅ |
| 5 | Curriculum CRUD persists in PostgreSQL | Created a test session via the admin UI, confirmed row count +1 in `psql`, edited its title, confirmed the edit persisted, toggled publish/unpublish, deleted it, confirmed row count back to baseline | ✅ full lifecycle verified against the real table |
| 6 | Trainer/mentor CRUD persists | Same create→edit→publish-toggle→delete lifecycle for `Trainer` (both `isMentor: false` and `true`) | ✅ |
| 7 | Project, testimonial, gallery, pricing, content updates persist | Same lifecycle for `Project`, `Testimonial`, `GalleryItem`; pricing (`launchPriceInr`) and homepage hero title saved via `/founder/pricing` and `/founder/content`, confirmed in `psql` | ✅ |
| 8 | Published content appears on the public site | Edited homepage hero title in the admin, loaded `/` in a second browser context, confirmed the new title appeared; reverted and reconfirmed | ✅ — this also validates `revalidatePath` on-demand ISR is wired correctly end-to-end |
| 9 | Draft content remains private | Testimonial created with `status: DRAFT` and consent unchecked; `/testimonials` public page confirmed it does not list it; publish action for a non-consented testimonial explicitly rejected server-side | ✅ |
| 10 | Lead submissions persist and are manageable | Submitted the real public `/contact` form, confirmed it appears in `/founder/leads`, opened the detail page, added a follow-up note, changed status to Contacted | ✅ |
| 11 | CSV export works and doesn't leak unrelated data | Exported with a `q=` filter matching only the test lead, confirmed the CSV contains exactly that lead; confirmed the export endpoint returns `401` with no session | ✅ |
| 12 | Google Sheets failures are visible and retryable | No real Google credentials available (see docs/GOOGLE_SHEETS_SETUP.md) — confirmed the lead's `sheetsSyncStatus` correctly reads `DISABLED` (not a false `SYNCED`), and the Retry button is present and callable | ✅ as far as verifiable without real credentials; **live sync to the actual target sheet has not been exercised** |
| 13 | Public pages render when optional integrations are unconfigured | Entire session ran with Sheets and Blob uploads unconfigured; all 15 public pages returned 200 throughout | ✅ |
| 14 | Brochure content and QR destination remain correct | Brochure page renders curriculum/trainers/pricing live from the database; QR code generated from the live `enrollmentUrl` | ✅ (QR payload = URL, not re-scanned with a camera in this environment, but generated via the same `qrcode` library and settings value as Phase 1, which was previously verified) |
| 15 | All existing public routes continue working | All 15 Phase 1 public routes return 200 after the full Phase 2 migration | ✅ |
| 16 | Mobile layouts at 320/375/390/430/768/1024/1440px | Playwright across all 15 public pages × 7 widths: checked HTTP status, `document.documentElement.scrollWidth` for horizontal overflow, and browser console errors | ✅ 105/105 checks clean, 0 console errors |

### A note on #2b

This is the most important finding from testing this build: it was not on
a pre-written checklist, it surfaced from actually trying to break
authorization during development, and it represented a real information
disclosure (dashboard data reaching an unauthenticated response body). It
is documented in full, with before/after evidence, in docs/SECURITY.md.
Every founder page in the codebase follows the fixed pattern.

## What was not tested (and why)

- **Live Google Sheets sync** — no Google Cloud credentials were available
  in this environment. The adapter, retry logic, and duplicate-prevention
  key are implemented and unit-testable in isolation, but a real row
  landing in the real target sheet has not been observed. Do not describe
  this integration as "live" until that happens — see
  docs/GOOGLE_SHEETS_SETUP.md.
- **Vercel Blob uploads** — no `BLOB_READ_WRITE_TOKEN` was available.
  `isUploadConfigured()` correctly reports `false` and every affected form
  falls back to a manual URL field, which was tested; the actual upload
  path through `@vercel/blob` itself was not exercised against a real
  store.
- **Railway Postgres** — all database testing used a local PostgreSQL 16
  instance with an identical schema/migration history to what would run
  against Railway. The migrations themselves are standard Prisma SQL with
  nothing Railway-specific, but applying them against the real Railway
  instance for the first time is still a remaining step (docs/DATABASE.md).
- **A real production Vercel deployment** — not performed; no Vercel
  project/credentials in this session. See docs/DEPLOYMENT.md for the
  exact remaining steps.
