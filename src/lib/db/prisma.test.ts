import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { classifyDatabaseError } from "./prisma";

function knownRequestError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("simulated", { code, clientVersion: "test" });
}

describe("classifyDatabaseError", () => {
  it("classifies a connection failure as DATABASE_UNAVAILABLE", () => {
    const err = new Prisma.PrismaClientInitializationError("can't reach database server", "test");
    expect(classifyDatabaseError(err)).toBe("DATABASE_UNAVAILABLE");
  });

  it("classifies a P1xxx known-request error as DATABASE_UNAVAILABLE", () => {
    expect(classifyDatabaseError(knownRequestError("P1001"))).toBe("DATABASE_UNAVAILABLE");
  });

  it("classifies P2021 (table does not exist) as DATABASE_SCHEMA_MISMATCH", () => {
    // The exact symptom of a database that was never migrated — e.g. a
    // Railway Postgres instance with DATABASE_URL set but
    // `prisma migrate deploy` never run against it.
    expect(classifyDatabaseError(knownRequestError("P2021"))).toBe("DATABASE_SCHEMA_MISMATCH");
  });

  it("classifies P2022 (column does not exist) as DATABASE_SCHEMA_MISMATCH", () => {
    expect(classifyDatabaseError(knownRequestError("P2022"))).toBe("DATABASE_SCHEMA_MISMATCH");
  });

  it("classifies an unrelated known-request error as DATABASE_ERROR", () => {
    expect(classifyDatabaseError(knownRequestError("P2002"))).toBe("DATABASE_ERROR");
  });

  it("classifies a non-Prisma error as DATABASE_ERROR", () => {
    expect(classifyDatabaseError(new Error("something else"))).toBe("DATABASE_ERROR");
  });
});
