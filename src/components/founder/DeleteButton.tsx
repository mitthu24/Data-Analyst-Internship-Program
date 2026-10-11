"use client";

import { useTransition } from "react";
import type { FormState } from "@/lib/actions/action-helpers";

export function DeleteButton({
  id,
  action,
  confirmMessage,
}: {
  id: string;
  action: (id: string) => Promise<FormState>;
  confirmMessage: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => { await action(id); });
      }}
      className="text-xs font-bold text-rose-500 hover:text-rose-700 disabled:opacity-50"
    >
      {pending ? "..." : "Delete"}
    </button>
  );
}
