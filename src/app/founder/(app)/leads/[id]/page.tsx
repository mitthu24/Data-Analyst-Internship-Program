import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { leadStatusLabels, leadProfileLabels } from "@/lib/validation/lead";
import { LeadStatusForm, LeadNoteForm, RetrySheetsSyncButton } from "@/components/founder/LeadDetailForms";

export const metadata: Metadata = { title: "Lead Detail", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const sheetsStatusColors: Record<string, string> = {
  DISABLED: "bg-slate-200 text-slate-600",
  PENDING: "bg-amber-100 text-amber-700",
  SYNCED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-rose-100 text-rose-700",
};

export default async function FounderLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { notes: { include: { createdBy: true }, orderBy: { createdAt: "desc" } }, isDuplicateOf: true },
  });
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={lead.name} crumbs={[{ label: "Leads", href: "/founder/leads" }, { label: lead.name }]} />

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Email</p>
          <p className="font-semibold text-navy-900">{lead.email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Phone</p>
          <p className="font-semibold text-navy-900">{lead.phone ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Specialization</p>
          <p className="font-semibold text-navy-900">{lead.specialization ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Profile</p>
          <p className="font-semibold text-navy-900">{lead.profile ? leadProfileLabels[lead.profile] : "—"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Consent to contact</p>
          <p className="font-semibold text-navy-900">{lead.consent ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">Received</p>
          <p className="font-semibold text-navy-900">{lead.createdAt.toLocaleString("en-IN")}</p>
        </div>
        {lead.message && (
          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase text-slate-400">Message</p>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{lead.message}</p>
          </div>
        )}
        {lead.isDuplicateOf && (
          <div className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700 sm:col-span-2">
            ⚠ Possible duplicate of a lead submitted on {lead.isDuplicateOf.createdAt.toLocaleString("en-IN")} with the same email.
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Status</h2>
        <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
        <p className="mt-2 text-xs text-slate-400">Current: {leadStatusLabels[lead.status]}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Google Sheets Sync</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${sheetsStatusColors[lead.sheetsSyncStatus]}`}>{lead.sheetsSyncStatus}</span>
        </div>
        <dl className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>
            <dt className="font-bold">Attempts</dt>
            <dd>{lead.sheetsSyncAttempts}</dd>
          </div>
          <div>
            <dt className="font-bold">Last attempt</dt>
            <dd>{lead.sheetsLastAttemptAt?.toLocaleString("en-IN") ?? "—"}</dd>
          </div>
          {lead.sheetsLastError && (
            <div className="col-span-2">
              <dt className="font-bold">Last error</dt>
              <dd className="text-rose-600">{lead.sheetsLastError}</dd>
            </div>
          )}
        </dl>
        <RetrySheetsSyncButton leadId={lead.id} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Follow-up Notes</h2>
        <LeadNoteForm leadId={lead.id} />
        <div className="mt-4 space-y-3">
          {lead.notes.length === 0 ? (
            <p className="text-sm text-slate-400">No notes yet.</p>
          ) : (
            lead.notes.map((n) => (
              <div key={n.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="text-slate-700">{n.note}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {n.createdBy?.email ?? "Founder"} · {n.createdAt.toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
