import { NextResponse } from "next/server";
import { requireFounderForAction } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { leadStatusValues, leadStatusLabels, leadProfileLabels } from "@/lib/validation/lead";
import { buildCsv } from "@/lib/csv";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(request: Request) {
  // This route is read-only (GET) but still founder-only — never exposes
  // lead data to unauthenticated or public callers.
  const founder = await requireFounderForAction().catch(() => null);
  if (!founder) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status");

  const where: Prisma.LeadWhereInput = {
    ...(status && leadStatusValues.includes(status as never) ? { status: status as never } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });

  const header = ["Name", "Email", "Phone", "Specialization", "Profile", "Status", "Consent", "Received", "Message"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.phone ?? "",
    lead.specialization ?? "",
    lead.profile ? leadProfileLabels[lead.profile] : "",
    leadStatusLabels[lead.status],
    lead.consent ? "Yes" : "No",
    lead.createdAt.toISOString(),
    (lead.message ?? "").replace(/\r?\n/g, " "),
  ]);

  const csv = buildCsv(header, rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
