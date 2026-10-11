"use client";

import { useState } from "react";
import clsx from "clsx";
import { curriculum, modules, type SessionModule } from "@/lib/content/curriculum";
import { SessionCard } from "./SessionCard";

export function CurriculumExplorer() {
  const [activeModule, setActiveModule] = useState<SessionModule | "All">("All");

  const filtered = activeModule === "All" ? curriculum : curriculum.filter((s) => s.module === activeModule);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveModule("All")}
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
              onClick={() => setActiveModule(m)}
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

      <div className="space-y-3">
        {filtered.map((session) => (
          <SessionCard key={session.classNumber} session={session} />
        ))}
      </div>
    </div>
  );
}
