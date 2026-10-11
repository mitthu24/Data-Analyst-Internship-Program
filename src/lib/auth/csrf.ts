import "server-only";
import { headers } from "next/headers";

/**
 * CSRF strategy:
 *  - All founder CMS mutations are implemented as Next.js Server Actions,
 *    which Next itself protects by verifying the request's Origin header
 *    against the deployment's allowed origins before invoking the action.
 *  - The few plain API routes under /api/founder/* are read-only (GET) or,
 *    where they do mutate, call this same-origin check explicitly.
 *  - The session cookie is SameSite=Lax, which already blocks the cookie
 *    from being attached to cross-site POST/PUT/DELETE requests in modern
 *    browsers — this is a second, independent layer on top of the above.
 */
export async function assertSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");

  if (!origin || !host) {
    throw new Error("CROSS_ORIGIN_REQUEST_BLOCKED");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("CROSS_ORIGIN_REQUEST_BLOCKED");
  }

  if (originHost !== host) {
    throw new Error("CROSS_ORIGIN_REQUEST_BLOCKED");
  }
}
