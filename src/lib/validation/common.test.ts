import { describe, it, expect } from "vitest";
import { safeUrlSchema } from "./common";

describe("safeUrlSchema", () => {
  it("accepts an https URL", () => {
    expect(safeUrlSchema.safeParse("https://example.com/photo.jpg").success).toBe(true);
  });

  it("accepts an http URL", () => {
    expect(safeUrlSchema.safeParse("http://example.com/photo.jpg").success).toBe(true);
  });

  it("accepts an empty string as null", () => {
    const result = safeUrlSchema.safeParse("");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });

  it("rejects a javascript: URL (stored XSS vector)", () => {
    expect(safeUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });

  it("rejects a data: URL", () => {
    expect(safeUrlSchema.safeParse("data:text/html,<script>alert(1)</script>").success).toBe(false);
  });

  it("rejects a malformed URL", () => {
    expect(safeUrlSchema.safeParse("not a url").success).toBe(false);
  });
});
