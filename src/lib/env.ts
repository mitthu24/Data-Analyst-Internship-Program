/**
 * Server-only environment access with explicit, actionable errors instead of
 * silent `undefined`s. Only called from code paths that truly require a
 * given variable (auth, admin mutations) — public pages never import this,
 * so a missing DATABASE_URL never breaks the marketing site.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable "${name}". Set it in your .env (local) or your hosting ` +
        `provider's environment settings (production) — see .env.example and docs/DATABASE.md.`,
    );
  }
  return value;
}

export function getDatabaseUrl(): string {
  return required("DATABASE_URL");
}

export function getBootstrapCredentials(): { email: string; password: string } {
  return {
    email: required("FOUNDER_BOOTSTRAP_EMAIL"),
    password: required("FOUNDER_BOOTSTRAP_PASSWORD"),
  };
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
