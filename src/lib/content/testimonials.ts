export interface Testimonial {
  studentName: string;
  role?: string;
  quote: string;
  imageUrl?: string;
}

// No testimonials have been approved by the founder yet. Do not add placeholder
// or fabricated entries here — the /testimonials page renders a clean empty
// state until real, approved testimonials are added via the admin panel.
export const testimonials: Testimonial[] = [];

/**
 * Published, consented testimonials from Postgres. Unlike other content
 * getters here, this one does NOT fall back to fabricated data on error —
 * it falls back to the empty list, matching the "never invent testimonials"
 * requirement even if the database is briefly unavailable.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return testimonials;
  try {
    const rows = await prisma.testimonial.findMany({
      where: { status: "PUBLISHED", consent: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((r) => ({
      studentName: r.studentName,
      role: r.role ?? undefined,
      quote: r.quote,
      imageUrl: r.imageUrl ?? undefined,
    }));
  } catch {
    return testimonials;
  }
}
