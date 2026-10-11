import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteTrainerAction, toggleTrainerStatusAction } from "@/lib/actions/trainer-actions";

export const metadata: Metadata = { title: "Corporate Mentors", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderMentorsPage() {
  await requireFounder();
  const mentors = await prisma.trainer.findMany({ where: { isMentor: true }, orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Corporate Mentors"
        description="Classes 22–25 are corporate expert mentoring sessions — link a mentor here, then assign them to a session in Curriculum."
        actions={
          <Link href="/founder/mentors/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Mentor
          </Link>
        }
      />

      {mentors.length === 0 ? (
        <EmptyState title="No mentors yet" description="Add the first corporate expert mentor." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mentors.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{m.name}</td>
                  <td className="px-4 py-3 text-slate-500">{m.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/mentors/${m.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton id={m.id} status={m.status} action={toggleTrainerStatusAction} />
                      <DeleteButton id={m.id} action={deleteTrainerAction} confirmMessage={`Delete mentor "${m.name}"?`} />
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
