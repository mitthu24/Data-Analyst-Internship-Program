import type { ZodError } from "zod";

export interface FormState {
  error?: string;
  success?: string;
}

export function zodErrorToMessage(error: ZodError): string {
  const first = error.issues[0];
  if (!first) return "Invalid input.";
  const path = first.path.join(".");
  return path ? `${path}: ${first.message}` : first.message;
}

/**
 * Next's redirect()/notFound() work by throwing a special error with a
 * `digest` starting with "NEXT_REDIRECT"/"NEXT_NOT_FOUND" — a catch-all
 * below must rethrow these unchanged, or every action that redirects on
 * success (login, logout, email change) would have that redirect silently
 * swallowed and replaced with a generic error.
 */
function isFrameworkControlFlowSignal(err: unknown): boolean {
  const digest = (err as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"));
}

export async function safeAction(fn: () => Promise<FormState>): Promise<FormState> {
  try {
    return await fn();
  } catch (err) {
    if (isFrameworkControlFlowSignal(err)) throw err;

    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return { error: "Your session has expired. Please sign in again." };
    }
    if (err instanceof Error && err.message === "DATABASE_UNAVAILABLE") {
      return { error: "The database is temporarily unavailable. Please try again in a moment." };
    }
    if (err instanceof Error && err.message === "DATABASE_SCHEMA_MISMATCH") {
      return { error: "The database schema is out of date. Ask the site administrator to run pending migrations." };
    }
    if (err instanceof Error && err.message === "DATABASE_ERROR") {
      return { error: "A database error occurred. Please try again — if this continues, contact the site administrator." };
    }

    console.error("[founder-action] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/** Same as safeAction, but for actions that return nothing (e.g. logout, which always redirects). */
export async function safeVoidAction(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (isFrameworkControlFlowSignal(err)) throw err;
    console.error("[founder-action] unexpected error:", err);
    throw err;
  }
}
