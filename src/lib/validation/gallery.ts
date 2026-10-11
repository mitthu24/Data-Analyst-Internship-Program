import { z } from "zod";
import { emptyToNull, publishStatusSchema, requiredImageUrlSchema } from "./common";

export const galleryItemSchema = z.object({
  imageUrl: requiredImageUrlSchema,
  caption: emptyToNull,
  altText: z.string().trim().min(3).max(200),
  category: emptyToNull,
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
