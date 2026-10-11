/**
 * Bootstraps the first founder account from server-only environment
 * variables (FOUNDER_BOOTSTRAP_EMAIL / FOUNDER_BOOTSTRAP_PASSWORD) and the
 * default program Settings row. Safe to re-run: it no-ops once a founder
 * with that email already exists, and upserts Settings rather than
 * duplicating it.
 *
 * Usage:
 *   FOUNDER_BOOTSTRAP_EMAIL=you@example.com FOUNDER_BOOTSTRAP_PASSWORD='...' npm run db:seed
 *
 * The bootstrapped account has mustChangePassword=true — the admin UI
 * forces a password change on first login before the account is treated as
 * fully configured for production, and the bootstrap password is never
 * displayed anywhere after this script runs.
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { importPhase1Content } from "./seed-content";

const prisma = new PrismaClient();
const ARGON2ID = 2; // Algorithm.Argon2id — avoid importing the const enum (isolatedModules)

async function main() {
  const email = process.env.FOUNDER_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.FOUNDER_BOOTSTRAP_PASSWORD;

  if (!email || !password) {
    console.error(
      "Skipping founder bootstrap: set FOUNDER_BOOTSTRAP_EMAIL and FOUNDER_BOOTSTRAP_PASSWORD " +
        "(server-only, never commit real values) before running `npm run db:seed`.",
    );
  } else if (password.length < 12) {
    console.error("Skipping founder bootstrap: FOUNDER_BOOTSTRAP_PASSWORD must be at least 12 characters.");
  } else {
    const existing = await prisma.founder.findUnique({ where: { email } });
    if (existing) {
      console.log(`Founder account for ${email} already exists — not modifying it.`);
    } else {
      const passwordHash = await hash(password, {
        algorithm: ARGON2ID,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      });
      await prisma.founder.create({
        data: { email, passwordHash, mustChangePassword: true },
      });
      console.log(`Created founder account for ${email}. They must change the password on first login.`);
    }
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  console.log("Settings row ready.");

  await importPhase1Content(prisma);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
