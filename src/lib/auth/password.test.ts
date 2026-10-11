import { describe, it, expect } from "vitest";
import { checkPasswordPolicy, hashPassword, verifyPassword } from "./password";

describe("checkPasswordPolicy", () => {
  it("rejects a short password", () => {
    const result = checkPasswordPolicy("Short1!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("12 characters"))).toBe(true);
  });

  it("rejects a password missing a symbol", () => {
    const result = checkPasswordPolicy("NoSymbolHere123");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("symbol"))).toBe(true);
  });

  it("rejects a password missing uppercase", () => {
    const result = checkPasswordPolicy("alllowercase123!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("uppercase"))).toBe(true);
  });

  it("accepts a strong password", () => {
    const result = checkPasswordPolicy("Str0ng!Passw0rd");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("hashPassword / verifyPassword", () => {
  it("hashes a password and verifies it correctly", async () => {
    const hash = await hashPassword("Str0ng!Passw0rd");
    expect(hash).not.toBe("Str0ng!Passw0rd");
    expect(await verifyPassword(hash, "Str0ng!Passw0rd")).toBe(true);
  });

  it("rejects the wrong password against a hash", async () => {
    const hash = await hashPassword("Str0ng!Passw0rd");
    expect(await verifyPassword(hash, "WrongPassword!1")).toBe(false);
  });

  it("verifyPassword never throws on a malformed hash", async () => {
    await expect(verifyPassword("not-a-real-hash", "whatever")).resolves.toBe(false);
  });
});
