import { z } from "zod";

export const leadProfileValues = ["STUDENT", "FRESHER", "WORKING_PROFESSIONAL", "OTHER"] as const;

export const leadProfileLabels: Record<(typeof leadProfileValues)[number], string> = {
  STUDENT: "Student",
  FRESHER: "Fresher",
  WORKING_PROFESSIONAL: "Working Professional",
  OTHER: "Other",
};

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  specialization: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  profile: z.enum(leadProfileValues).optional(),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  consent: z.literal(true, { message: "Please confirm consent to be contacted." }),
  // Honeypot — real users never fill this; bots that auto-fill every field will.
  website: z.string().max(0, "Spam detected.").optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

export const leadStatusValues = ["NEW", "CONTACTED", "FOLLOW_UP", "ENROLLED", "CLOSED"] as const;
export const leadStatusLabels: Record<(typeof leadStatusValues)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow-up",
  ENROLLED: "Enrolled",
  CLOSED: "Closed",
};
