"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Catches any uncaught error from /founder/login and everything under
 * /founder/(app) — including requireFounder()'s session check, which runs
 * on every request and previously had no error boundary above it, so a
 * transient database hiccup (e.g. a serverless cold start racing a Railway
 * connection) crashed the whole page with Next's generic error screen
 * instead of a clear, retryable message.
 */
export default function FounderError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log only the digest (a safe, non-sensitive reference id) — never the
    // raw error message, which could echo a connection string fragment.
    console.error("[founder] boundary caught error, digest:", error.digest);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white">
        <h1 className="text-lg font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/60">
          We couldn&apos;t load this page, most likely because of a temporary database connection issue. This is
          usually brief — please try again.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
          >
            Try again
          </button>
          <Link
            href="/founder/login"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
