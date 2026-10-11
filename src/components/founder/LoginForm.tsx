"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type FormState } from "@/lib/actions/auth-actions";

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-bold text-white/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-white/15 bg-navy-950 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-bold text-white/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/15 bg-navy-950 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
