"use client";

import { useState } from "react";
import clsx from "clsx";
import { modules, type SessionModule, type CurriculumSession } from "@/lib/content/curriculum";
import { SessionCard } from "./SessionCard";

const INITIAL_VISIBLE = 8;

export function CurriculumExplorer({ curriculum }: { curriculum: CurriculumSession[] }) {
  const [activeModule, setActiveModule] = useState<SessionModule | "All">("All");
  const [expanded, setExpanded] = useState(false);

  const filtered = activeModule === "All" ? curriculum : curriculum.filter((s) => s.module === activeModule);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const remaining = filtered.length - visible.length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveModule("All");
            setExpanded(false);
          }}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
            activeModule === "All" ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          )}
        >
          All {curriculum.length}
        </button>
        {modules.map((m) => {
          const count = curriculum.filter((s) => s.module === m).length;
          return (
            <button
              key={m}
              type="button"
              onClick={() => {
                setActiveModule(m);
                setExpanded(false);
              }}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                activeModule === m ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {m} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {visible.map((session) => (
          <SessionCard key={session.classNumber} session={session} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-navy-900 transition-colors hover:border-navy-900"
          >
            Show all {filtered.length} sessions ({remaining} more)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {expanded && filtered.length > INITIAL_VISIBLE && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-sm font-bold text-slate-500 hover:text-navy-900"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}
