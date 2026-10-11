import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteCurriculumSessionAction, toggleCurriculumSessionStatusAction } from "@/lib/actions/curriculum-actions";
import { sessionModuleLabels } from "@/lib/validation/curriculum";

export const metadata: Metadata = { title: "Curriculum", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderCurriculumPage() {
  await requireFounder();

  const [sessions, settings] = await Promise.all([
    prisma.curriculumSession.findMany({ orderBy: { order: "asc" } }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const published = sessions.filter((s) => s.status === "PUBLISHED");
  const totalHours = published.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
  const drifted = settings && (published.length !== settings.totalSessions || totalHours !== settings.totalHours);

  return (
    <div>
      <PageHeader
        title="Curriculum"
        description={`${published.length} published sessions · ${totalHours}h total`}
        actions={
          <Link href="/founder/curriculum/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Session
          </Link>
        }
      />

      {drifted && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          ⚠ Published curriculum totals {published.length} sessions / {totalHours}h, but{" "}
          <Link href="/founder/settings" className="underline">
            Settings
          </Link>{" "}
          advertises {settings?.totalSessions} sessions / {settings?.totalHours}h on the public site. Update one to
          match the other.
        </div>
      )}

      {sessions.length === 0 ? (
        <EmptyState title="No curriculum sessions yet" description="Add the first session to get started." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-bold text-slate-400">{s.classNumber}</td>
                  <td className="px-4 py-3 font-semibold text-navy-900">{s.title}</td>
                  <td className="px-4 py-3 text-slate-500">{sessionModuleLabels[s.module]}</td>
                  <td className="px-4 py-3 text-slate-500">{s.durationMinutes} min</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/curriculum/${s.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton
                        id={s.id}
                        status={s.status}
                        action={toggleCurriculumSessionStatusAction}
                      />
                      <DeleteButton
                        id={s.id}
                        action={deleteCurriculumSessionAction}
                        confirmMessage={`Delete class ${s.classNumber} — "${s.title}"? This cannot be undone.`}
                      />
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
