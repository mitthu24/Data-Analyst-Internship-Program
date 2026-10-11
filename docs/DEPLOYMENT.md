# Deployment

## Status

Not deployed from this session — there is no Vercel project or Vercel
authentication available in this environment. Everything below is written
as the exact next steps, not a report of something already done.

## Prerequisites

1. A GitHub repository with this code pushed (`mitthu24/Data-Analyst-Internship-Program`,
   branch `claude/founder-admin-panel-phase2` as of this writing — merge to
   your intended production branch when ready).
2. A Railway PostgreSQL database — see docs/DATABASE.md.
3. (Optional) A Google Cloud service account for Sheets sync — see
   docs/GOOGLE_SHEETS_SETUP.md.
4. (Optional) A Vercel Blob store for image uploads — see below.

## First deploy

1. **Import the repo into Vercel** (vercel.com → Add New → Project →
   select the GitHub repo). Vercel auto-detects Next.js; no custom build
   command is required (`next build` is the default and is what this
   project uses).
2. **Set environment variables** (Project Settings → Environment
   Variables) for Production (and Preview, if you want preview
   deployments to also hit the real database):
   - `DATABASE_URL` — the Railway connection string.
   - `NEXT_PUBLIC_SITE_URL` — the production URL, e.g.
     `https://your-domain.com`.
   - `FOUNDER_BOOTSTRAP_EMAIL`, `FOUNDER_BOOTSTRAP_PASSWORD` — only needed
     transiently to run the seed script once (step 4); safe to remove from
     Vercel afterward since the seed script is run separately, not during
     the Vercel build.
   - `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
     `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SHEETS_SHEET_NAME` —
     optional, see docs/GOOGLE_SHEETS_SETUP.md.
   - `BLOB_READ_WRITE_TOKEN` — optional, see "Image uploads" below.
3. **Apply database migrations** before (or right after) the first deploy,
   from any machine with the production `DATABASE_URL`:
   ```bash
   DATABASE_URL="<railway-url>" npm run db:migrate:deploy
   ```
4. **Bootstrap the founder account and seed content** (once):
   ```bash
   DATABASE_URL="<railway-url>" \
   FOUNDER_BOOTSTRAP_EMAIL="you@example.com" \
   FOUNDER_BOOTSTRAP_PASSWORD="At-least-12-chars!1" \
   npm run db:seed
   ```
5. **Deploy** (Vercel does this automatically on push once the project is
   connected). Verify:
   - The public site loads at the production URL.
   - `/founder/login` is reachable and logs in with the bootstrapped
     credentials, then **immediately change the password** at
     `/founder/security` — a fresh account is flagged
     `mustChangePassword` for exactly this reason.
6. **Delete `FOUNDER_BOOTSTRAP_PASSWORD` from Vercel's environment
   variables** after step 4 — it has no further use in production and
   shouldn't linger in an environment variable store.

## Image uploads (Vercel Blob)

1. Vercel dashboard → your project → Storage → Create → Blob.
2. Copy the generated `BLOB_READ_WRITE_TOKEN` into the project's
   environment variables.
3. Redeploy (or just wait for the next deploy) — the "Upload File" button
   appears automatically on trainer/gallery image fields once
   `isUploadConfigured()` sees the token; until then those forms fall back
   to a plain "paste an image URL" field, which always works regardless.

No other provider needs to be selected — this was the only storage option
with zero-additional-account-setup for a Vercel deployment, and the
abstraction (`src/lib/uploads/storage.ts`) is written against an interface
if a different provider is ever preferred later.

## Credential rotation

- **Founder password**: `/founder/security` → Change Password (requires
  the current one). Revokes every other active session automatically.
- **Founder email**: `/founder/security` → Change Email (requires the
  current password). Also revokes every other session.
- **Database password**: rotate in Railway, then update `DATABASE_URL` in
  Vercel and redeploy. No code change needed.
- **Google service account key**: generate a new key in Google Cloud
  Console for the same service account, update
  `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in Vercel, then delete the old key
  from the service account. See docs/GOOGLE_SHEETS_SETUP.md.
- **Vercel Blob token**: Vercel Storage settings → regenerate, update
  `BLOB_READ_WRITE_TOKEN`.

Never commit any of the above to the repository. `.env` is gitignored;
`.env.example` holds placeholder names only.

## CI / pre-deploy checks

This repo doesn't currently define a CI workflow file. Before every
deploy, run locally (or wire into GitHub Actions):

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

All four are green as of the commit this file ships in.
