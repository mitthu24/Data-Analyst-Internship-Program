"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded={open}
            >
              <span className="font-bold text-navy-900">{item.question}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
