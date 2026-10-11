import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { leadStatusLabels, leadStatusValues } from "@/lib/validation/lead";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  FOLLOW_UP: "bg-purple-100 text-purple-700",
  ENROLLED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-200 text-slate-600",
};

export default async function FounderLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireFounder();
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const status = sp.status && leadStatusValues.includes(sp.status as never) ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status: status as never } : {}),
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

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportHref = `/api/founder/leads/export?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) }).toString()}`;

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${total} total inquiries`}
        actions={
          <a href={exportHref} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-slate-200">
            Export CSV
          </a>
        }
      />

      <form method="GET" className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">All statuses</option>
          {leadStatusValues.map((s) => (
            <option key={s} value={s}>
              {leadStatusLabels[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800">
          Filter
        </button>
      </form>

      {leads.length === 0 ? (
        <EmptyState title="No leads found" description={q || status ? "Try a different search or filter." : "Inquiries from the public Contact form will appear here."} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {lead.name}
                    {lead.isDuplicateOfId && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Possible duplicate</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <div>{lead.email}</div>
                    {lead.phone && <div className="text-xs">{lead.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColors[lead.status]}`}>{leadStatusLabels[lead.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{lead.createdAt.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/founder/leads/${lead.id}`} className="text-xs font-bold text-electric-600 hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/founder/leads?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page: String(p) }).toString()}`}
              className={`rounded-lg px-3 py-1.5 font-bold ${p === page ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
