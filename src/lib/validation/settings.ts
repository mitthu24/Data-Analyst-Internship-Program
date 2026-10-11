import { z } from "zod";
import { emptyToNull } from "./common";

export const programSettingsSchema = z.object({
  programName: z.string().trim().min(3).max(160),
  durationLabel: z.string().trim().min(2).max(80),
  classDurationMinutes: z.coerce.number().int().min(15).max(480),
  coreClasses: z.coerce.number().int().min(0).max(999),
  mentorSessions: z.coerce.number().int().min(0).max(999),
  totalSessions: z.coerce.number().int().min(1).max(999),
  totalHours: z.coerce.number().min(0.5).max(1000),
  scheduleNote: z.string().trim().min(1).max(2000),
  batchDates: emptyToNull,
  batchTiming: emptyToNull,
  batchMode: emptyToNull,
  batchVenue: emptyToNull,
  contactEmail: emptyToNull,
  contactPhone: emptyToNull,
});

export const pricingSettingsSchema = z
  .object({
    currency: z.string().trim().min(2).max(10),
    referencePriceInr: z.coerce.number().int().min(0),
    launchPriceInr: z.coerce.number().int().min(0),
    enrollmentPaymentInr: z.coerce.number().int().min(0),
    enrollmentUrl: z.string().trim().url("Enter a valid enrollment URL."),
    refundWindowDays: z.coerce.number().int().min(0).max(365),
    refundPolicyText: emptyToNull,
  })
  .refine((data) => data.launchPriceInr <= data.referencePriceInr, {
    message: "Launch price should not be higher than the reference price.",
    path: ["launchPriceInr"],
  })
  .refine((data) => data.enrollmentPaymentInr <= data.launchPriceInr, {
    message: "The initial enrollment payment should not be higher than the launch price.",
    path: ["enrollmentPaymentInr"],
  });

export type ProgramSettingsInput = z.infer<typeof programSettingsSchema>;
export type PricingSettingsInput = z.infer<typeof pricingSettingsSchema>;
