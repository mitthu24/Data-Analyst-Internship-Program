import { z } from "zod";
import { safeUrlSchema, emptyToNull, publishStatusSchema } from "./common";

export const testimonialSchema = z
  .object({
    studentName: z.string().trim().min(2).max(120),
    role: emptyToNull,
    quote: z.string().trim().min(10).max(2000),
    imageUrl: safeUrlSchema,
    consent: z.coerce.boolean(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    status: publishStatusSchema,
  })
  .refine((data) => data.status !== "PUBLISHED" || data.consent, {
    message: "A testimonial can only be published once the student's consent to publish has been recorded.",
    path: ["status"],
  });

export type TestimonialInput = z.infer<typeof testimonialSchema>;
