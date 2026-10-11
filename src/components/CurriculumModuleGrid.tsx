"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { modules, type CurriculumSession } from "@/lib/content/curriculum";

const moduleStyle: Record<string, { icon: string; badge: string; iconBg: string }> = {
  "Advanced Excel": { icon: "📊", badge: "bg-emerald-500/15 text-emerald-700", iconBg: "bg-emerald-500/10" },
  "Power BI": { icon: "📈", badge: "bg-electric-500/15 text-electric-700", iconBg: "bg-electric-500/10" },
  SQL: { icon: "🗄️", badge: "bg-lime-500/20 text-lime-800", iconBg: "bg-lime-500/10" },
  "Automation & Deployment": { icon: "⚙️", badge: "bg-amber-500/15 text-amber-700", iconBg: "bg-amber-500/10" },
  "AI & Web Dashboards": { icon: "🤖", badge: "bg-purple-500/15 text-purple-700", iconBg: "bg-purple-500/10" },
  "Corporate Readiness": { icon: "💼", badge: "bg-slate-200 text-slate-700", iconBg: "bg-slate-100" },
  "Corporate Expert Mentoring": { icon: "🎤", badge: "bg-rose-500/15 text-rose-700", iconBg: "bg-rose-500/10" },
};

function ModuleCard({ moduleName, sessions }: { moduleName: string; sessions: CurriculumSession[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const style = moduleStyle[moduleName] ?? { icon: "📘", badge: "bg-slate-100 text-slate-600", iconBg: "bg-slate-100" };

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors",
        open ? "border-emerald-300/70 shadow-md" : "border-slate-200",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
              style.iconBg,
            )}
            aria-hidden="true"
          >
            {style.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-navy-900">{moduleName}</span>
            <span className={clsx("mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold", style.badge)}>
              {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
            </span>
          </span>
        </span>
        <svg
          className={clsx(
            "h-5 w-5 shrink-0 text-slate-400 transition-transform motion-reduce:transition-none",
            open && "rotate-180 text-emerald-600",
          )}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-2 border-t border-emerald-100 bg-emerald-50/30 px-5 pb-5 pt-4">
            {sessions.map((session) => (
              <div
                key={session.classNumber}
                className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm shadow-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-navy-900 text-xs font-black text-lime-400">
                  {String(session.classNumber).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-navy-900">{session.title}</span>
                <span className="shrink-0 text-xs font-medium text-slate-500">{session.durationMinutes} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
