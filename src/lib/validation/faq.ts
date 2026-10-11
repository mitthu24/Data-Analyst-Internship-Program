import { z } from "zod";
import { publishStatusSchema } from "./common";

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(3000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
});

export type FaqInput = z.infer<typeof faqSchema>;
