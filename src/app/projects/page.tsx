import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Practical Projects",
  description: "The practical project portfolio built during the Skillo Academy Placement-Oriented Internship Program.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">Practical Project Portfolio</h1>
          <p className="mt-4 text-lg text-white/75">
            Planned example projects worked through during the program — each one a portfolio-ready deliverable.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading
          title={`${projects.length} Projects Across the Program`}
          description="Labeled as planned examples — no completed work or live demos are claimed until they exist."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </Section>
    </>
  );
}
