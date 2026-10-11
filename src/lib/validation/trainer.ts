import { z } from "zod";
import { safeUrlSchema, emptyToNull, publishStatusSchema } from "./common";

const listField = z
  .string()
  .transform((s) =>
    s
      .split(/\r?\n|,/)
      .map((x) => x.trim())
      .filter(Boolean),
  );

export const trainerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(160),
  company: emptyToNull,
  location: emptyToNull,
  bio: emptyToNull,
  expertise: listField,
  photoUrl: safeUrlSchema,
  linkedin: safeUrlSchema,
  isMentor: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
});

export type TrainerInput = z.infer<typeof trainerSchema>;
