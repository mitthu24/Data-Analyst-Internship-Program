"use client";

import { useFormState } from "react-dom";
import { useTransition } from "react";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { updateLeadStatusAction, addLeadNoteAction, retryLeadSheetsSyncAction } from "@/lib/actions/lead-actions";
import { leadStatusValues, leadStatusLabels } from "@/lib/validation/lead";

export function LeadStatusForm({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(formData) => startTransition(async () => { await updateLeadStatusAction(leadId, formData); })}
      className="flex items-center gap-2"
    >
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
      >
        {leadStatusValues.map((s) => (
          <option key={s} value={s}>
            {leadStatusLabels[s]}
          </option>
        ))}
      </select>
      <button type="submit" disabled={pending} className="rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-50">
        {pending ? "..." : "Update"}
      </button>
    </form>
  );
}

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const action = addLeadNoteAction.bind(null, leadId);
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className="space-y-2">
      <textarea
        name="note"
        required
        rows={3}
        placeholder="Add a follow-up note..."
        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      <FormMessage state={state} />
      <SubmitButton>Add Note</SubmitButton>
    </form>
  );
}

export function RetrySheetsSyncButton({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await retryLeadSheetsSyncAction(leadId); })}
      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-slate-200 disabled:opacity-50"
    >
      {pending ? "Syncing..." : "Retry Sync"}
    </button>
  );
}
