// Single source of truth for program-wide settings. Phase 2's admin panel will
// move this into the `Settings` Prisma model (see prisma/schema.prisma); public
// pages should always import from here rather than hardcoding these values.

export const settings = {
  programName: "Data Analyst Internship Program",
  durationLabel: "One week",
  classDurationMinutes: 90,
  coreClasses: 21,
  mentorSessions: 4,
  totalSessions: 25,
  totalHours: 37.5,
  pricing: {
    referencePriceInr: 19999,
    launchPriceInr: 1999,
    enrollmentPaymentInr: 499,
  },
  enrollmentUrl: "https://superprofile.bio/vp/data-analyst-internship-program",
  refundWindowDays: 7,
  scheduleNote:
    "This is a one-week program. The exact daily timetable and class timings for your batch are shared by the organizer before the batch starts and can be configured per batch — no fixed dates are set here.",
  leadsSheetUrl:
    "https://docs.google.com/spreadsheets/d/16l1B5ixtoFkJpQd93NuKr6UviNDh5puWQB-MagLq_n0/edit?usp=sharing",
} as const;

export const formatInr = (amount: number): string => `₹${amount.toLocaleString("en-IN")}`;
