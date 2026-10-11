import { describe, it, expect } from "vitest";
import { safeUrlSchema, safeImageUrlSchema, requiredImageUrlSchema } from "./common";

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

// Regression coverage for the bug where photo/gallery image fields used
// safeUrlSchema (absolute-only) while every seeded photo is a root-relative
// path like "/trainers/m-kumar.jpg" — this silently blocked every founder
// CMS save for a trainer/gallery item (see ImageUrlField + this schema).
describe("safeImageUrlSchema", () => {
  it("accepts an https URL", () => {
    expect(safeImageUrlSchema.safeParse("https://example.com/photo.jpg").success).toBe(true);
  });

  it("accepts a root-relative path", () => {
    const result = safeImageUrlSchema.safeParse("/trainers/m-kumar.jpg");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("/trainers/m-kumar.jpg");
  });

  it("accepts an empty string as null", () => {
    const result = safeImageUrlSchema.safeParse("");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });

  it("rejects a protocol-relative path (//evil.com)", () => {
    expect(safeImageUrlSchema.safeParse("//evil.com/x.jpg").success).toBe(false);
  });

  it("rejects a javascript: URL", () => {
    expect(safeImageUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});

describe("requiredImageUrlSchema", () => {
  it("accepts a root-relative path", () => {
    expect(requiredImageUrlSchema.safeParse("/gallery/photo.jpg").success).toBe(true);
  });

  it("accepts an https URL", () => {
    expect(requiredImageUrlSchema.safeParse("https://example.com/photo.jpg").success).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(requiredImageUrlSchema.safeParse("").success).toBe(false);
  });

  it("rejects a javascript: URL", () => {
    expect(requiredImageUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});
