import "server-only";
import { redirect } from "next/navigation";
import { getCurrentFounder, type AuthenticatedFounder } from "./session";

/**
 * Call at the top of every founder server component/page and every founder
 * server action. Redirects to /founder/login when there is no valid
 * session — this is the real authorization boundary (not the UI shell),
 * so every protected route must call it itself rather than relying on a
 * parent layout alone.
 */
export async function requireFounder(): Promise<AuthenticatedFounder> {
  const founder = await getCurrentFounder();
  if (!founder) {
    redirect("/founder/login");
  }
  return founder;
}

/** For server actions: throws instead of redirecting, so the caller can show an error. */
export async function requireFounderForAction(): Promise<AuthenticatedFounder> {
  const founder = await getCurrentFounder();
  if (!founder) {
    throw new Error("UNAUTHENTICATED");
  }
  return founder;
}
