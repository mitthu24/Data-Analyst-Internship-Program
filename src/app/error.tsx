"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Root error boundary for the public site — a defense-in-depth safety net so an
 * unexpected server error never renders Next's generic, unbranded error page. */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[site] boundary caught error, digest:", error.digest);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-bold text-navy-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500">
          This page hit a temporary error. Please try again — if it keeps happening, come back in a few minutes.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
          >
            Try again
          </button>
          <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-slate-50">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
