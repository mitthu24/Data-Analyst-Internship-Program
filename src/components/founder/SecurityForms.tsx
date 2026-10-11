"use client";

import { useFormState } from "react-dom";
import { useState, useTransition } from "react";
import { Field, TextInput } from "./fields";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import {
  changePasswordAction,
  changeEmailAction,
  revokeOtherSessionsAction,
} from "@/lib/actions/auth-actions";

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changePasswordAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <Field label="Current password">
        <TextInput name="currentPassword" type="password" required autoComplete="current-password" />
      </Field>
      <Field label="New password" hint="At least 12 characters, with uppercase, lowercase, a number, and a symbol.">
        <TextInput name="newPassword" type="password" required autoComplete="new-password" minLength={12} />
      </Field>
      <Field label="Confirm new password">
        <TextInput name="confirmPassword" type="password" required autoComplete="new-password" minLength={12} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Change Password</SubmitButton>
    </form>
  );
}

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction] = useFormState(changeEmailAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-slate-500">
        Current email: <strong className="text-navy-900">{currentEmail}</strong>
      </p>
      <Field label="New email">
        <TextInput name="newEmail" type="email" required />
      </Field>
      <Field label="Current password" hint="Required to confirm this change.">
        <TextInput name="currentPassword" type="password" required autoComplete="current-password" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Change Email</SubmitButton>
      <p className="text-xs text-slate-400">
        Changing your email signs out all other sessions and requires you to sign in again with the new address.
      </p>
    </form>
  );
}

export function RevokeSessionsButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await revokeOtherSessionsAction();
            setMessage(result.success ?? result.error ?? null);
          })
        }
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-slate-200 disabled:opacity-50"
      >
        {pending ? "Working..." : "Sign out all other sessions"}
      </button>
      {message && <p className="mt-2 text-sm font-semibold text-emerald-700">{message}</p>}
    </div>
  );
}
