import { describe, it, expect } from "vitest";
import { safeAction, safeVoidAction } from "./action-helpers";

function redirectSignal(): never {
  const err = new Error("NEXT_REDIRECT") as Error & { digest: string };
  err.digest = "NEXT_REDIRECT;replace;/founder;307;";
  throw err;
}

describe("safeAction", () => {
  it("returns the action's own result on success", async () => {
    const result = await safeAction(async () => ({ success: "ok" }));
    expect(result).toEqual({ success: "ok" });
  });

  it("rethrows Next's redirect signal instead of swallowing it", async () => {
    // Regression test: a prior version of safeAction had no special case for
    // redirect()'s thrown control-flow signal, so wrapping loginAction (which
    // calls redirect() on success) in safeAction would have silently turned
    // every successful login into a generic error instead of navigating.
    await expect(safeAction(async () => redirectSignal())).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
  });

  it("maps UNAUTHENTICATED to a friendly session-expired message", async () => {
    const result = await safeAction(async () => {
      throw new Error("UNAUTHENTICATED");
    });
    expect(result.error).toMatch(/session has expired/i);
  });

  it("maps DATABASE_UNAVAILABLE to a friendly retry message", async () => {
    const result = await safeAction(async () => {
      throw new Error("DATABASE_UNAVAILABLE");
    });
    expect(result.error).toMatch(/temporarily unavailable/i);
  });

  it("maps any other error to a generic message, never leaking the raw error", async () => {
    const result = await safeAction(async () => {
      throw new Error("connection refused at postgresql://user:secret@host:5432/db");
    });
    expect(result.error).toBe("Something went wrong. Please try again.");
  });
});

describe("safeVoidAction", () => {
  it("rethrows Next's redirect signal", async () => {
    await expect(safeVoidAction(async () => redirectSignal())).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
  });

  it("rethrows other errors after logging (caller's error boundary handles display)", async () => {
    await expect(
      safeVoidAction(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });
});
