export interface Testimonial {
  studentName: string;
  role?: string;
  quote: string;
}

// No testimonials have been approved by the founder yet. Do not add placeholder
// or fabricated entries here — the /testimonials page renders a clean empty
// state until real, approved testimonials are added (Phase 2 admin panel).
export const testimonials: Testimonial[] = [];
