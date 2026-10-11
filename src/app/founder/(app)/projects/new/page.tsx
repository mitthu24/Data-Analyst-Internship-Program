import type { Metadata } from "next";
import { requireFounder } from "@/lib/auth/guard";
import { PageHeader } from "@/components/founder/PageHeader";
import { ProjectForm } from "@/components/founder/ProjectForm";
import { createProjectAction } from "@/lib/actions/project-actions";

export const metadata: Metadata = { title: "Add Project", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireFounder();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add Project" crumbs={[{ label: "Projects", href: "/founder/projects" }, { label: "New" }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
