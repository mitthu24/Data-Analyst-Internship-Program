"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
