import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Lead capture interface for Phase 1.
 *
 * Phase 2 will forward each lead to the Google Sheet at `settings.leadsSheetUrl`
 * using a Google service account (see GOOGLE_SHEETS_SPREADSHEET_ID,
 * GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in
 * .env.example) and persist it via the Lead Prisma model. For now this route
 * validates the submission and logs it server-side so the contact form has a
 * working, testable endpoint ahead of that integration.
 */
export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();

  if (!name || !email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid name and email are required." }, { status: 400 });
  }

  const lead = {
    name,
    email,
    phone: payload.phone?.trim() || null,
    message: payload.message?.trim() || null,
    source: "website",
    receivedAt: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log("[lead-capture] new lead received (Google Sheets sync pending Phase 2):", lead);

  return NextResponse.json({ ok: true });
}
