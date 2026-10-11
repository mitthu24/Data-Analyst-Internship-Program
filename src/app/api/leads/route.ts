import { NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { leadSubmissionSchema } from "@/lib/validation/lead";
import { syncLeadToSheets } from "@/lib/integrations/google-sheets";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function getClientIp(request: Request): string | null {
  const h = request.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "The enrollment inquiry system is not fully configured yet. Please use the enrollment link instead." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid submission." }, { status: 400 });
  }

  const ip = getClientIp(request);

  // Rate limiting: cap submissions per IP within the window (DB-backed so it
  // holds across serverless instances, unlike an in-memory counter).
  if (ip) {
    const recentCount = await prisma.lead.count({
      where: { ip, createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } },
    });
    if (recentCount >= RATE_LIMIT_MAX_SUBMISSIONS) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }
  }

  const { name, email, phone, specialization, profile, message, consent } = parsed.data;

  // Duplicate detection: flag (not block) a resubmission from the same email within 24h.
  const possibleDuplicate = await prisma.lead.findFirst({
    where: { email, createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) } },
    orderBy: { createdAt: "desc" },
  });

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      specialization,
      profile,
      message,
      consent,
      source: "website",
      ip,
      isDuplicateOfId: possibleDuplicate?.id,
    },
  });

  // Google Sheets sync happens after the DB write succeeds and never blocks
  // or fails the response — see docs/GOOGLE_SHEETS_SETUP.md.
  void syncLeadToSheets(lead.id);

  return NextResponse.json({ ok: true });
}
