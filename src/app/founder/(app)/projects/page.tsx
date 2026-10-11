import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { EmptyState } from "@/components/founder/EmptyState";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PublishToggleButton } from "@/components/founder/PublishToggleButton";
import { DeleteButton } from "@/components/founder/DeleteButton";
import { deleteProjectAction, toggleProjectStatusAction } from "@/lib/actions/project-actions";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FounderProjectsPage() {
  await requireFounder();
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="The practical project portfolio shown on the public /projects page."
        actions={
          <Link href="/founder/projects/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            + Add Project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.difficulty}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/founder/projects/${p.id}/edit`} className="text-xs font-bold text-electric-600 hover:underline">
                        Edit
                      </Link>
                      <PublishToggleButton id={p.id} status={p.status} action={toggleProjectStatusAction} />
                      <DeleteButton id={p.id} action={deleteProjectAction} confirmMessage={`Delete project "${p.title}"?`} />
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
