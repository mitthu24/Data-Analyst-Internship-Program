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

export const metadata: Metadata = { title: "Trainers", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderTrainersPage() {
  await requireFounder();
  const trainers = await prisma.trainer.findMany({ where: { isMentor: false }, orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Trainers"
        description="Core program trainers shown on the public /trainers page."
        actions={
          <Link href="/founder/trainers/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Trainer
          </Link>
        }
      />

      {trainers.length === 0 ? (
        <EmptyState title="No trainers yet" description="Add the first trainer profile." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainers.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{t.name}</td>
                  <td className="px-4 py-3 text-slate-500">{t.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/trainers/${t.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton id={t.id} status={t.status} action={toggleTrainerStatusAction} />
                      <DeleteButton id={t.id} action={deleteTrainerAction} confirmMessage={`Delete trainer "${t.name}"?`} />
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
