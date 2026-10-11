# Google Sheets Lead Sync — Setup

## Status: not yet configured / not yet verified live

The integration is fully built (`src/lib/integrations/google-sheets.ts` and
`google-sheets-client.ts`) but **has not been connected to a real Google
Sheet or tested against the target sheet**, because no Google Cloud service
account credentials were available in the environment this was built in.
Every lead submitted today is stored correctly in PostgreSQL with
`sheetsSyncStatus = DISABLED`, and the admin panel (`/founder/leads/[id]`)
shows that status honestly. No code claims a live sync that hasn't been
verified. Follow the steps below to turn it on.

Target sheet (as given):
https://docs.google.com/spreadsheets/d/16l1B5ixtoFkJpQd93NuKr6UviNDh5puWQB-MagLq_n0/edit?usp=sharing

## How it works

1. A public lead submission (`POST /api/leads`) is **always** written to
   PostgreSQL first, inside the request. The HTTP response only depends on
   that write succeeding.
2. After the database write succeeds, `syncLeadToSheets(lead.id)` is called
   without being awaited by the response — a Sheets outage or slow API
   call never blocks or fails the lead's own save.
3. If Sheets credentials aren't configured, the lead's
   `sheetsSyncStatus` is set to `DISABLED` and nothing is attempted.
4. If credentials are configured, `appendLeadRow` authenticates with a
   Google service account and looks up the lead's own `id` in column A of
   the sheet before appending — if it's already there (e.g. this is a
   retry after a prior partial failure), it marks the row `SYNCED` without
   appending again. This is the duplicate-prevention mechanism required by
   the spec: the lead's database ID is the stable identifier, not row
   position or a timestamp.
5. Every attempt (success or failure) updates `sheetsSyncStatus`,
   `sheetsSyncAttempts`, `sheetsLastAttemptAt`, and — on failure —
   `sheetsLastError` (truncated, no secrets) on the `Lead` row.
6. The founder can see this status and trigger a retry from
   `/founder/leads/[id]` → **Retry Sync** at any time (e.g. after fixing
   credentials or sheet permissions), which calls the same adapter.

## Exact setup steps

1. **Create a Google Cloud service account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) →
     IAM & Admin → Service Accounts → Create Service Account.
   - Enable the **Google Sheets API** for the project (APIs & Services →
     Library → "Google Sheets API" → Enable).
   - Create a JSON key for the service account and download it.

2. **Share the target sheet with the service account**
   - Open the sheet above.
   - Click **Share**, and add the service account's email (looks like
     `something@project-id.iam.gserviceaccount.com`) as an **Editor**.
   - This project did not have access to open the sheet, so **the exact
     header row and column order have not been inspected**. Before
     enabling sync, open the sheet yourself and confirm (or adjust) that
     row 1 has headers in this order, or update `COLUMNS` in
     `src/lib/integrations/google-sheets-client.ts` to match whatever the
     sheet actually has:

     | A | B | C | D | E | F | G | H | I | J |
     |---|---|---|---|---|---|---|---|---|---|
     | Lead ID | Submitted At | Name | Email | Phone | Specialization | Profile | Message | Consent | Source |

     Column **A must stay the lead's database ID** for the
     duplicate-prevention logic to work — don't repurpose it.

3. **Set environment variables** (server-only — never prefix with
   `NEXT_PUBLIC_`, never commit real values):

   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=16l1B5ixtoFkJpQd93NuKr6UviNDh5puWQB-MagLq_n0
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_SHEET_NAME=Leads
   ```

   - The spreadsheet ID is the long string in the sheet's URL between
     `/d/` and `/edit`.
   - The private key from the downloaded JSON file contains literal `\n`
     sequences — paste it exactly as downloaded; the adapter converts
     `\n` to real newlines at runtime.
   - In Vercel: Project Settings → Environment Variables. Paste the key
     value as-is (Vercel preserves the embedded `\n` correctly when pasted
     as a single-line value).

4. **Verify**
   - Submit a real test inquiry through `/contact` on the deployed site.
   - Check `/founder/leads/[id]` for that lead: `sheetsSyncStatus` should
     read `SYNCED`.
   - Open the actual Google Sheet and confirm the row appeared with the
     correct values in the correct columns.
   - **Only after seeing a real row land in the real sheet** should this
     integration be described to stakeholders as "live."

## Rotating or revoking credentials

- To rotate: generate a new JSON key for the same service account in
  Google Cloud Console, update `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in
  Vercel, and delete the old key from the service account.
- To revoke access entirely: remove the service account's Editor
  permission from the sheet's Share dialog, or delete the service account.
  Existing synced rows in the sheet are unaffected; only future syncs stop.
