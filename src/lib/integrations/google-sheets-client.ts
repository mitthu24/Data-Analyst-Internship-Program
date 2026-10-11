import "server-only";
import { google } from "googleapis";
import { prisma } from "@/lib/db/prisma";
import { leadProfileLabels } from "@/lib/validation/lead";

const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

/**
 * Column order this adapter writes. Column A is the lead's stable database
 * ID — used as the idempotency key so a retry never creates a duplicate
 * row (see appendLeadRow below). Confirm this matches the real sheet's
 * header row before enabling sync in production; see
 * docs/GOOGLE_SHEETS_SETUP.md.
 */
const COLUMNS = [
  "Lead ID",
  "Submitted At",
  "Name",
  "Email",
  "Phone",
  "Specialization",
  "Profile",
  "Message",
  "Consent",
  "Source",
] as const;

function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) {
    throw new Error("Google service account credentials are not configured.");
  }
  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/** Returns the lead's row number if it's already present (by Lead ID in column A), else null. */
async function findExistingRow(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, leadId: string): Promise<number | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
  });
  const rows = res.data.values ?? [];
  const index = rows.findIndex((row) => row[0] === leadId);
  return index === -1 ? null : index + 1; // 1-indexed, includes header row
}

/**
 * Appends (or, on retry, skips re-adding) one lead's row to the configured
 * Google Sheet. The Lead's own `id` is written to column A and used to
 * detect an already-synced row, so re-running this after a prior partial
 * failure cannot create duplicate rows.
 */
export async function appendLeadRow(leadId: string): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not configured.");

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error(`Lead ${leadId} not found.`);

  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const existingRow = await findExistingRow(sheets, spreadsheetId, leadId);
  if (existingRow) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { sheetsSyncStatus: "SYNCED", sheetsSyncedAt: new Date(), sheetsLastError: null },
    });
    return;
  }

  const row = [
    lead.id,
    lead.createdAt.toISOString(),
    lead.name,
    lead.email,
    lead.phone ?? "",
    lead.specialization ?? "",
    lead.profile ? leadProfileLabels[lead.profile] : "",
    lead.message ?? "",
    lead.consent ? "Yes" : "No",
    lead.source,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      sheetsSyncStatus: "SYNCED",
      sheetsSyncedAt: new Date(),
      sheetsSyncAttempts: { increment: 1 },
      sheetsLastAttemptAt: new Date(),
      sheetsLastError: null,
    },
  });
}

export { COLUMNS as GOOGLE_SHEETS_EXPECTED_COLUMNS };
