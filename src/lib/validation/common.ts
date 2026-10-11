import { z } from "zod";

/** Only http(s) absolute URLs are accepted — blocks `javascript:`, `data:`, and other schemes that enable stored XSS via an href/src. */
export const safeUrlSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine(
    (v) => {
      if (v === null) return true;
      try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid http(s) URL." },
  );

/**
 * Image references accept either an absolute http(s) URL (an uploaded Blob
 * URL, or any external image) or a root-relative path like `/trainers/x.jpg`
 * (a file shipped under `public/`, which is how every seeded trainer/gallery
 * photo in this codebase is referenced). A bare `z.string().url()` /
 * `safeUrlSchema` rejects the latter, which both breaks saving here on the
 * server AND — via the matching `type="url"` input — causes the browser's
 * own HTML5 constraint validation to silently block the whole form's
 * submission client-side with no visible error. See `ImageUrlField`.
 */
function isValidImageRef(v: string): boolean {
  if (/^\/(?!\/)\S*$/.test(v)) return true; // root-relative, not "//host/..."
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const safeImageUrlSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || isValidImageRef(v), {
    message: "Enter a valid image URL (an https:// link, or a root-relative path like /trainers/photo.jpg).",
  });

export const requiredImageUrlSchema = z
  .string()
  .trim()
  .min(1, "Image URL is required.")
  .refine(isValidImageRef, {
    message: "Enter a valid image URL (an https:// link, or a root-relative path like /gallery/photo.jpg).",
  });

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const emptyToNull = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();
