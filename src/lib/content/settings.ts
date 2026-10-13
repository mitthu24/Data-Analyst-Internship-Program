// Single source of truth for program-wide settings. Phase 2's admin panel will
// move this into the `Settings` Prisma model (see prisma/schema.prisma); public
// pages should always import from here rather than hardcoding these values.

export const settings = {
  programName: "Placement-Oriented Internship Program",
  durationLabel: "8-Week",
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
    "This is an 8-week program. The exact weekly timetable and class timings for your batch are shared by the organizer before the batch starts and can be configured per batch — no fixed dates are set here.",
  leadsSheetUrl:
    "https://docs.google.com/spreadsheets/d/16l1B5ixtoFkJpQd93NuKr6UviNDh5puWQB-MagLq_n0/edit?usp=sharing",
} as const;

export const formatInr = (amount: number): string => `₹${amount.toLocaleString("en-IN")}`;

export type Settings = {
  programName: string;
  durationLabel: string;
  classDurationMinutes: number;
  coreClasses: number;
  mentorSessions: number;
  totalSessions: number;
  totalHours: number;
  pricing: {
    referencePriceInr: number;
    launchPriceInr: number;
    enrollmentPaymentInr: number;
  };
  enrollmentUrl: string;
  refundWindowDays: number;
  refundPolicyText: string;
  scheduleNote: string;
  leadsSheetUrl: string;
  batchDates: string | null;
  batchTiming: string | null;
  batchMode: string | null;
  batchVenue: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

/**
 * Program settings and pricing from Postgres, falling back to the static
 * object above whenever the database is unconfigured or unreachable.
 * `leadsSheetUrl` is a fixed reference, not founder-editable.
 */
export async function getSettings(): Promise<Settings> {
  const fallback: Settings = {
    ...settings,
    pricing: { ...settings.pricing },
    refundPolicyText: "",
    batchDates: null,
    batchTiming: null,
    batchMode: null,
    batchVenue: null,
    contactEmail: null,
    contactPhone: null,
  };

  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return fallback;
  try {
    const row = await prisma.settings.findUnique({ where: { id: "singleton" } });
    if (!row) return fallback;
    return {
      programName: row.programName,
      durationLabel: row.durationLabel,
      classDurationMinutes: row.classDurationMinutes,
      coreClasses: row.coreClasses,
      mentorSessions: row.mentorSessions,
      totalSessions: row.totalSessions,
      totalHours: row.totalHours,
      pricing: {
        referencePriceInr: row.referencePriceInr,
        launchPriceInr: row.launchPriceInr,
        enrollmentPaymentInr: row.enrollmentPaymentInr,
      },
      enrollmentUrl: row.enrollmentUrl,
      refundWindowDays: row.refundWindowDays,
      refundPolicyText: row.refundPolicyText,
      scheduleNote: row.scheduleNote,
      leadsSheetUrl: settings.leadsSheetUrl,
      batchDates: row.batchDates,
      batchTiming: row.batchTiming,
      batchMode: row.batchMode,
      batchVenue: row.batchVenue,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
    };
  } catch {
    return fallback;
  }
}
