import type { Project } from "@/lib/content/projects";

const difficultyColors: Record<Project["difficulty"], string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-navy-900">{project.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${difficultyColors[project.difficulty]}`}>
          {project.difficulty}
        </span>
      </div>
      {project.isPlannedExample && (
        <span className="mb-3 inline-block w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
          Planned example project
        </span>
      )}
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{project.businessProblem}</p>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Tools</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tools.map((t) => (
            <span key={t} className="rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-lime-400">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">You will learn</p>
        <ul className="space-y-1 text-sm text-slate-600">
          {project.learningObjectives.map((o) => (
            <li key={o} className="flex gap-2">
              <span className="text-emerald-500">✓</span> {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Expected deliverable</p>
        <p className="text-sm font-semibold text-navy-900">{project.deliverables.join(", ")}</p>
      </div>

      {(project.demoUrl || project.githubUrl) && (
        <div className="mt-4 flex gap-3 text-sm font-bold text-electric-600">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              Live demo →
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
