import { z } from "zod";

export const sessionModuleValues = [
  "EXCEL",
  "POWER_BI",
  "SQL",
  "AUTOMATION",
  "AI_AND_WEB",
  "CORPORATE",
  "MENTOR",
] as const;

export const sessionModuleLabels: Record<(typeof sessionModuleValues)[number], string> = {
  EXCEL: "Advanced Excel",
  POWER_BI: "Power BI",
  SQL: "SQL",
  AUTOMATION: "Automation & Deployment",
  AI_AND_WEB: "AI & Web Dashboards",
  CORPORATE: "Corporate Readiness",
  MENTOR: "Corporate Expert Mentoring",
};

const listField = z
  .string()
  .transform((s) =>
    s
      .split(/\r?\n|,/)
      .map((x) => x.trim())
      .filter(Boolean),
  );

export const curriculumSessionSchema = z.object({
  classNumber: z.coerce.number().int().min(1).max(999),
  module: z.enum(sessionModuleValues),
  title: z.string().trim().min(3).max(200),
  durationMinutes: z.coerce.number().int().min(15).max(480),
  topics: listField,
  practicalExample: z.string().trim().min(1).max(2000),
  handsOnExercise: z.string().trim().min(1).max(2000),
  learningOutcome: z.string().trim().min(1).max(2000),
  deliverable: z.string().trim().min(1).max(2000),
  tools: listField,
  trainerId: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  mentorName: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  mentorTitle: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  order: z.coerce.number().int().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CurriculumSessionInput = z.infer<typeof curriculumSessionSchema>;
