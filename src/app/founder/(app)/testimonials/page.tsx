import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteTestimonialAction, toggleTestimonialStatusAction } from "@/lib/actions/testimonial-actions";

export const metadata: Metadata = { title: "Testimonials", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderTestimonialsPage() {
  await requireFounder();
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Only testimonials with recorded consent can be published."
        actions={
          <Link href="/founder/testimonials/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Testimonial
          </Link>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" description="The public page shows a clean empty state until real, approved testimonials are added." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Consent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{t.studentName}</td>
                  <td className="px-4 py-3">{t.consent ? "✅ Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/testimonials/${t.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton id={t.id} status={t.status} action={toggleTestimonialStatusAction} />
                      <DeleteButton id={t.id} action={deleteTestimonialAction} confirmMessage={`Delete testimonial from "${t.studentName}"?`} />
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
