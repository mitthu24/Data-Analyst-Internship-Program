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

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const emptyToNull = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();
