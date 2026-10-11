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

export async function safeAction(fn: () => Promise<FormState>): Promise<FormState> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return { error: "Your session has expired. Please sign in again." };
    }
     
    console.error("[founder-action] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
