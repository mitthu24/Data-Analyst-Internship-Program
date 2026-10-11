"use client";

import { useState } from "react";
import clsx from "clsx";
import { modules, type SessionModule, type CurriculumSession } from "@/lib/content/curriculum";
import { SessionCard } from "./SessionCard";

/** Homepage curriculum teaser: pick a module tab, see that module's sessions (click one to open its topics). */
export function CurriculumModulePreview({ curriculum }: { curriculum: CurriculumSession[] }) {
  const availableModules = modules.filter((m) => curriculum.some((s) => s.module === m));
  const [activeModule, setActiveModule] = useState<SessionModule>(availableModules[0]);

  const sessions = curriculum.filter((s) => s.module === activeModule);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {availableModules.map((m) => {
          const count = curriculum.filter((s) => s.module === m).length;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setActiveModule(m)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                activeModule === m ? "bg-navy-900 text-white" : "bg-white text-slate-600 hover:bg-slate-200",
              )}
            >
              {m} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <SessionCard key={session.classNumber} session={session} />
        ))}
      </div>
    </div>
  );
}
