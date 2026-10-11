"use client";

import { useTransition } from "react";
import type { FormState } from "@/lib/actions/action-helpers";

export function PublishToggleButton({
  id,
  status,
  action,
}: {
  id: string;
  status: "DRAFT" | "PUBLISHED";
  action: (id: string, nextStatus: "DRAFT" | "PUBLISHED") => Promise<FormState>;
}) {
  const [pending, startTransition] = useTransition();
  const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await action(id, next); })}
      className="text-xs font-bold text-slate-500 hover:text-navy-900 disabled:opacity-50"
    >
      {pending ? "..." : status === "PUBLISHED" ? "Unpublish" : "Publish"}
    </button>
  );
}
