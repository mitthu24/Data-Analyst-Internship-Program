import "server-only";
import { prisma } from "@/lib/db/prisma";

/**
 * Whether Google Sheets credentials are configured. See
 * docs/GOOGLE_SHEETS_SETUP.md for the exact setup steps — until all three
 * env vars below are set, sync is left disabled and every lead's
 * sheetsSyncStatus stays PENDING (never silently marked SYNCED).
 */
export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
}

/**
 * Fire-and-forget sync of one lead to the configured Google Sheet. Never
 * throws — PostgreSQL is always the primary record, so a Sheets failure
 * must never affect the lead's own save. Marks the attempt on the Lead row
 * so the founder can see and retry failures from /founder/leads.
 */
export async function syncLeadToSheets(leadId: string): Promise<void> {
  if (!isSheetsConfigured()) {
    await prisma.lead
      .update({ where: { id: leadId }, data: { sheetsSyncStatus: "DISABLED" } })
      .catch(() => undefined);
    return;
  }

  try {
    const { appendLeadRow } = await import("./google-sheets-client");
    await appendLeadRow(leadId);
  } catch (err) {
    await prisma.lead
      .update({
        where: { id: leadId },
        data: {
          sheetsSyncStatus: "FAILED",
          sheetsSyncAttempts: { increment: 1 },
          sheetsLastAttemptAt: new Date(),
          sheetsLastError: err instanceof Error ? err.message.slice(0, 500) : "Unknown error",
        },
      })
      .catch(() => undefined);
  }
}
