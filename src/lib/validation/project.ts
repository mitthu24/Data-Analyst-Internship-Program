import { z } from "zod";
import { safeUrlSchema, publishStatusSchema } from "./common";

const listField = z
  .string()
  .transform((s) =>
    s
      .split(/\r?\n|,/)
      .map((x) => x.trim())
      .filter(Boolean),
  );

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const projectSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : slugify(v)))
    .nullable(),
  businessProblem: z.string().trim().min(1).max(2000),
  tools: listField,
  learningObjectives: listField,
  deliverables: listField,
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  isPlannedExample: z.coerce.boolean(),
  imageUrl: safeUrlSchema,
  demoUrl: safeUrlSchema,
  githubUrl: safeUrlSchema,
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
});

export { slugify };
export type ProjectInput = Omit<z.infer<typeof projectSchema>, "slug"> & { slug: string | null };
