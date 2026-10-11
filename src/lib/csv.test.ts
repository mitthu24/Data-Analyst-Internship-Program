import { describe, it, expect } from "vitest";
import { csvCell, buildCsv } from "./csv";

describe("csvCell", () => {
  it("wraps a plain value in quotes", () => {
    expect(csvCell("Jane Doe")).toBe('"Jane Doe"');
  });

  it("escapes embedded quotes", () => {
    expect(csvCell('Say "hi"')).toBe('"Say ""hi"""');
  });

  it("neutralizes a formula-injection payload starting with =", () => {
    expect(csvCell("=SUM(A1:A10)")).toBe("\"'=SUM(A1:A10)\"");
  });

  it("neutralizes payloads starting with +, -, or @", () => {
    expect(csvCell("+1+1")).toBe("\"'+1+1\"");
    expect(csvCell("-1-1")).toBe("\"'-1-1\"");
    expect(csvCell("@cmd")).toBe("\"'@cmd\"");
  });

  it("leaves an ordinary negative-looking phone number guarded but intact after the quote", () => {
    const result = csvCell("-9876543210");
    expect(result).toContain("9876543210");
    expect(result.startsWith("\"'")).toBe(true);
  });
});

describe("buildCsv", () => {
  it("builds a CSV with header and rows joined by CRLF", () => {
    const csv = buildCsv(["Name", "Email"], [["Jane", "jane@example.com"]]);
    expect(csv).toBe('"Name","Email"\r\n"Jane","jane@example.com"');
  });
});
