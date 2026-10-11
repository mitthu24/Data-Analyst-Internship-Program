import { describe, it, expect } from "vitest";
import { leadSubmissionSchema } from "./lead";

describe("leadSubmissionSchema", () => {
  it("accepts a valid minimal submission", () => {
    const result = leadSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a submission without consent", () => {
    const result = leadSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a filled-in honeypot field (bot detection)", () => {
    const result = leadSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      consent: true,
      website: "http://spam.example.com",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty honeypot field", () => {
    const result = leadSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      consent: true,
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = leadSubmissionSchema.safeParse({ name: "J", email: "jane@example.com", consent: true });
    expect(result.success).toBe(false);
  });
});
