import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFounder } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/founder/PageHeader";
import { ProjectForm } from "@/components/founder/ProjectForm";
import { updateProjectAction } from "@/lib/actions/project-actions";

export const metadata: Metadata = { title: "Edit Project", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFounder();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Edit: ${project.title}`} crumbs={[{ label: "Projects", href: "/founder/projects" }, { label: project.title }]} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ProjectForm action={updateProjectAction.bind(null, id)} initial={project} />
      </div>
    </div>
  );
}
