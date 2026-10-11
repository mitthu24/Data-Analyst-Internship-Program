# Security

## Authentication

- **Password hashing**: Argon2id via `@node-rs/argon2` (native, Vercel-serverless-compatible),
  with OWASP-recommended parameters (19 MiB memory, 2 iterations,
  parallelism 1). See `src/lib/auth/password.ts`.
- **Password policy**: enforced on every password change — minimum 12
  characters, upper + lower case, a number, and a symbol
  (`checkPasswordPolicy`, unit-tested).
- **Sessions**: opaque 256-bit random tokens, stored server-side as their
  SHA-256 hash only (`src/lib/auth/session.ts`). Not JWTs — a session can
  be revoked instantly by deleting/flagging its database row, which a
  stateless JWT cannot do. Cookie is `httpOnly`, `SameSite=Lax`, and
  `Secure` in production.
- **No public registration endpoint.** The only way to create a founder
  account is `prisma/seed.ts`, run manually with server-only env vars
  (`FOUNDER_BOOTSTRAP_EMAIL` / `FOUNDER_BOOTSTRAP_PASSWORD`). Neither value
  is hardcoded anywhere in the codebase.
- **Forced password change**: a freshly bootstrapped account has
  `mustChangePassword=true` and sees a persistent banner in the admin UI
  until it's changed. The bootstrap password is never displayed anywhere
  after the seed script runs (it isn't stored — only its Argon2 hash is).
- **Rate limiting**: failed-login count and a lockout timestamp live on the
  `Founder` row itself (not in-memory), so the lockout holds correctly
  across Vercel's multiple serverless instances. 5 failed attempts locks
  the account for 15 minutes.
- **Audit log**: every login success/failure/lockout, logout, password
  change, email change, session revocation, and content publish/unpublish
  writes an `AuditEvent` row, visible at `/founder/security` and in the
  dashboard's recent-activity feed.

## Authorization — the real finding from this build

Next.js App Router can render a route segment's `page.tsx` **in parallel**
with its `layout.tsx` during a streaming response. This was verified
directly during development: a layout-only `requireFounder()` guard
allowed an unauthenticated request's raw HTTP response to include the
dashboard's real data (lead counts, etc.) in the RSC payload, even though
the client-side router would have redirected before rendering it —
because the redirect and the page's data-fetching both happened, and the
page's output still made it into the response body sent to the browser.

**Fix applied project-wide**: every single founder page component (not
just the shared layout) calls `requireFounder()` itself, before any data
fetching. This was re-verified against a production build afterward — the
response for an unauthenticated request to `/founder` dropped from 16KB
(containing lead counts and dashboard structure) to a clean ~800-byte
redirect instruction with no application data. Every founder page added
after that point follows the same pattern; `src/lib/auth/guard.ts`
documents it inline as the required convention.

Server actions follow the equivalent rule via `requireFounderForAction()`,
called first in every action in `src/lib/actions/*.ts`.

## CSRF

- All founder CMS mutations are Next.js **Server Actions**, which Next
  itself verifies the request's `Origin` header against before invoking —
  this is enforced by the framework, not application code.
- The session cookie is `SameSite=Lax`, a second independent layer: modern
  browsers won't attach it to a cross-site POST/PUT/DELETE.
- The few plain API routes under `/api/founder/*` (e.g. CSV export) are
  read-only GETs; `src/lib/auth/csrf.ts` documents the same-origin check
  available for any future mutating route handler.

## Input validation and injection

- Every mutation validates its input with **Zod** schemas
  (`src/lib/validation/*`) before touching the database — unit-tested.
- All database access goes through **Prisma**'s query builder; the only
  raw SQL in the codebase is a parameterless `SELECT 1` health check.
  No string-interpolated queries anywhere.
- **Stored XSS**: no `dangerouslySetInnerHTML` anywhere in the codebase.
  React escapes all rendered text by default.
- **Unsafe URLs**: `safeUrlSchema` (`src/lib/validation/common.ts`)
  rejects anything that isn't `http:`/`https:` — blocking `javascript:`
  and `data:` URL stored-XSS vectors in trainer photos, project links,
  gallery images, and the enrollment URL. Unit-tested.
- **CSV injection**: the leads CSV export (`src/lib/csv.ts`) prefixes any
  cell starting with `=`, `+`, `-`, or `@` with a single quote, so a lead
  that enters `=SUM(...)` as their name can't execute a formula when a
  founder opens the export in Excel/Sheets. Unit-tested.
- **File uploads**: validated server-side for MIME type (JPEG/PNG/WebP/GIF
  only) and a 5MB size cap before ever reaching storage; filenames are
  replaced with a random UUID, never the user-supplied name
  (`src/lib/uploads/storage.ts`).

## Spam / abuse protection on the public lead form

- A honeypot field (`website`), hidden from real users via CSS, rejects
  any submission that fills it in.
- Database-backed rate limiting (max 5 submissions per IP per 10 minutes)
  — DB-backed for the same reason as login lockouts: it has to hold across
  serverless instances.
- Duplicate detection flags (not blocks) a second submission from the same
  email within 24 hours, surfaced to the founder in `/founder/leads`.

## Logging hygiene

- No lead PII, passwords, or session tokens are ever written to logs.
  The one `console.error` in the codebase (`src/lib/actions/action-helpers.ts`)
  logs unexpected server errors for debugging, not request payloads.
- Audit log entries store structured, non-sensitive detail objects
  (e.g. `{ resource: "curriculum", op: "update", id }`), never raw form data.

## Security headers

Set via `next.config.mjs` on every route:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | see below |

**Content-Security-Policy** is deliberately pragmatic rather than maximal:
`default-src 'self'` with `script-src`/`style-src` allowing
`'unsafe-inline'`. Next.js injects inline bootstrap and RSC
flight-stream `<script>` tags on every page, so a strict policy without
`'unsafe-inline'` would need a per-request nonce threaded through
middleware into every response — real, worthwhile hardening, but out of
scope for this build. It was verified (via a headless-browser console
check across `/`, `/curriculum`, and `/founder/login`) to produce **zero**
CSP violations, so nothing is silently broken today; tightening it to a
nonce-based policy is the one concrete follow-up recommended here.

## Known, accepted risks (documented, not fixed)

1. **Dev-tooling dependency vulnerabilities.** `npm audit` flags
   transitive dependencies of Tailwind CSS 3 / ESLint / tsx / vitest
   (postcss, braces, chokidar, micromatch, esbuild). All of these run only
   at build/dev time — none ship in the production runtime bundle. Fixing
   them requires a Tailwind 4 major upgrade, which is a real breaking-change
   migration (new config format) intentionally left out of this build's
   scope rather than rushed.
2. **React 18.** Next.js 16 supports React 18 but deprecates it (removed
   in Next 17). The Next.js security advisories that motivated the Next
   14→16 upgrade are fixed independent of the React version; a React 19
   migration is a separate, larger change (new JSX transform edge cases,
   `useFormState` → `useActionState` rename) left for a dedicated follow-up
   rather than bundled into this one.
3. **Email change has no second-channel verification.** No transactional
   email provider is configured in this environment. Changing a founder's
   email today requires re-entering the current password (so it can't be
   done by a hijacked session alone) and immediately revokes every other
   active session — but it does not send a confirmation link to the new
   address, so a founder who fat-fingers the new email would lock
   themselves out rather than a verification step catching it. Wiring a
   provider (Resend, Postmark, SES) and adding a confirm-by-link step is
   the recommended next step, noted inline in `src/lib/auth/account.ts`.
4. **CSP allows `'unsafe-inline'`** — see above.
