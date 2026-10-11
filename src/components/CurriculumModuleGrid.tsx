"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { modules, type CurriculumSession } from "@/lib/content/curriculum";

const moduleColors: Record<string, string> = {
  "Advanced Excel": "bg-emerald-500/15 text-emerald-700",
  "Power BI": "bg-electric-500/15 text-electric-700",
  SQL: "bg-lime-500/20 text-lime-800",
  "Automation & Deployment": "bg-amber-500/15 text-amber-700",
  "AI & Web Dashboards": "bg-purple-500/15 text-purple-700",
  "Corporate Readiness": "bg-slate-200 text-slate-700",
  "Corporate Expert Mentoring": "bg-rose-500/15 text-rose-700",
};

function ModuleCard({ moduleName, sessions }: { moduleName: string; sessions: CurriculumSession[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        <span className="flex items-center gap-3">
          <span
            className={clsx(
              "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
              moduleColors[moduleName] ?? "bg-slate-100 text-slate-600",
            )}
          >
            {moduleName}
          </span>
          <span className="text-sm font-bold text-navy-900">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </span>
        </span>
        <svg
          className={clsx("h-5 w-5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div id={panelId} className="space-y-2 border-t border-slate-100 px-5 pb-5 pt-4">
          {sessions.map((session) => (
            <div
              key={session.classNumber}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-navy-900 text-xs font-black text-lime-400">
                {String(session.classNumber).padStart(2, "0")}
              </span>
              <span className="flex-1 font-semibold text-navy-900">{session.title}</span>
              <span className="shrink-0 text-xs font-medium text-slate-500">{session.durationMinutes} min</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Homepage curriculum teaser: all seven modules visible at once as
 * independently expandable cards (two columns on laptop/desktop), rather
 * than a single module-at-a-time tab view.
 */
export function CurriculumModuleGrid({ curriculum }: { curriculum: CurriculumSession[] }) {
  const availableModules = modules.filter((m) => curriculum.some((s) => s.module === m));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {availableModules.map((m) => (
        <ModuleCard key={m} moduleName={m} sessions={curriculum.filter((s) => s.module === m)} />
      ))}
    </div>
  );
}
