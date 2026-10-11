import { describe, it, expect } from "vitest";
import { curriculumSessionSchema } from "./curriculum";

const baseSession = {
  classNumber: 1,
  module: "EXCEL",
  title: "Corporate Excel Foundations",
  durationMinutes: 90,
  topics: "Tables, Formatting, Sorting",
  practicalExample: "Example",
  handsOnExercise: "Exercise",
  learningOutcome: "Outcome",
  deliverable: "Deliverable",
  tools: "Microsoft Excel",
  trainerId: "",
  status: "PUBLISHED",
};

describe("curriculumSessionSchema", () => {
  it("accepts a valid session and splits comma-separated topics/tools into arrays", () => {
    const result = curriculumSessionSchema.safeParse(baseSession);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topics).toEqual(["Tables", "Formatting", "Sorting"]);
      expect(result.data.tools).toEqual(["Microsoft Excel"]);
      expect(result.data.trainerId).toBeNull();
    }
  });

  it("rejects an invalid module", () => {
    const result = curriculumSessionSchema.safeParse({ ...baseSession, module: "NOT_A_MODULE" });
    expect(result.success).toBe(false);
  });

  it("rejects a duration outside the allowed range", () => {
    const result = curriculumSessionSchema.safeParse({ ...baseSession, durationMinutes: 5 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = curriculumSessionSchema.safeParse({ ...baseSession, title: "ab" });
    expect(result.success).toBe(false);
  });
});
