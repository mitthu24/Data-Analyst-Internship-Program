"use client";

import { useState } from "react";
import type { CurriculumSession } from "@/lib/content/curriculum";

const moduleColors: Record<string, string> = {
  "Advanced Excel": "bg-emerald-500/15 text-emerald-600",
  "Power BI": "bg-electric-500/15 text-electric-600",
  SQL: "bg-lime-500/20 text-lime-700",
  "Automation & Deployment": "bg-amber-500/15 text-amber-600",
  "AI & Web Dashboards": "bg-purple-500/15 text-purple-600",
  "Corporate Readiness": "bg-slate-200 text-slate-700",
  "Corporate Expert Mentoring": "bg-rose-500/15 text-rose-600",
};

export function SessionCard({ session }: { session: CurriculumSession }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-black text-lime-400">
          {String(session.classNumber).padStart(2, "0")}
        </span>
        <span className="flex-1">
          <span
            className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              moduleColors[session.module] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {session.module}
          </span>
          <h3 className="text-base font-bold text-navy-900 sm:text-lg">{session.title}</h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Class {session.classNumber} · {session.durationMinutes} minutes
            {session.mentor ? ` · ${session.mentor.name} — ${session.mentor.title}` : ""}
          </p>
        </span>
        <svg
          className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm text-slate-600">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Topics covered</dt>
              <dd className="flex flex-wrap gap-1.5">
                {session.topics.length > 0
                  ? session.topics.map((t) => (
                      <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {t}
                      </span>
                    ))
                  : <span className="text-slate-400">To be confirmed</span>}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Tools used</dt>
              <dd className="flex flex-wrap gap-1.5">
                {session.tools.length > 0
                  ? session.tools.map((t) => (
                      <span key={t} className="rounded-full bg-navy-900/90 px-2 py-0.5 text-xs font-semibold text-lime-400">
                        {t}
                      </span>
                    ))
                  : <span className="text-slate-400">Not applicable</span>}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Practical corporate example</dt>
              <dd>{session.practicalExample}</dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Hands-on exercise</dt>
              <dd>{session.handsOnExercise}</dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Expected learning outcome</dt>
              <dd>{session.learningOutcome}</dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Expected deliverable</dt>
              <dd>{session.deliverable}</dd>
            </div>
          </dl>
          {session.founderEditable && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              The mentor and exact topic for this session can be updated by the founder.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
