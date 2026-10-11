import { hash, verify } from "@node-rs/argon2";

// `Algorithm` is declared as a TS `const enum` in @node-rs/argon2, which is
// incompatible with isolatedModules — so we use its numeric value (2 = Argon2id)
// directly instead of importing the enum.
const ARGON2ID = 2;

// OWASP-recommended Argon2id parameters for an interactive login path.
const ARGON2_OPTIONS = {
  algorithm: ARGON2ID,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(hashValue: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashValue, plain);
  } catch {
    return false;
  }
}

export interface PasswordPolicyResult {
  valid: boolean;
  errors: string[];
}

/** Minimum bar for a founder password — enforced on bootstrap and on every password change. */
export function checkPasswordPolicy(password: string): PasswordPolicyResult {
  const errors: string[] = [];
  if (password.length < 12) errors.push("Password must be at least 12 characters long.");
  if (!/[a-z]/.test(password)) errors.push("Password must include a lowercase letter.");
  if (!/[A-Z]/.test(password)) errors.push("Password must include an uppercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Password must include a number.");
  if (!/[^a-zA-Z0-9]/.test(password)) errors.push("Password must include a symbol.");
  return { valid: errors.length === 0, errors };
}
