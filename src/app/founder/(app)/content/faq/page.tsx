import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteFaqAction, toggleFaqStatusAction } from "@/lib/actions/faq-actions";

export const metadata: Metadata = { title: "FAQ", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderFaqPage() {
  await requireFounder();
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="FAQ"
        crumbs={[{ label: "Website Content", href: "/founder/content" }, { label: "FAQ" }]}
        actions={
          <Link href="/founder/content/faq/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add FAQ
          </Link>
        }
      />

      {faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faqs.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{f.question}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/content/faq/${f.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton id={f.id} status={f.status} action={toggleFaqStatusAction} />
                      <DeleteButton id={f.id} action={deleteFaqAction} confirmMessage="Delete this FAQ?" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
