export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Who can join?",
    answer:
      "MBA students and graduates, BBA students and graduates, students and graduates from other degree programs, freshers, and early-career professionals who want to build practical corporate skills and prepare for their next career opportunity. No prior analytics background is required.",
  },
  {
    question: "What is the duration?",
    answer:
      "An 8-week program with 25 sessions in total: 21 core classes plus 4 corporate expert mentoring sessions, each 90 minutes long, for 37.5 hours of instructional time overall. The exact weekly schedule and class timings for your batch are configured and shared by the organizer before the batch starts.",
  },
  {
    question: "What skills are covered?",
    answer:
      "Advanced Excel, Power BI, SQL, automation tools (VBA, Office Scripts, Google Apps Script), AI assistants used responsibly (ChatGPT, Claude Code), and the basics of deploying a dashboard live using GitHub and Vercel — alongside corporate readiness and interview preparation.",
  },
  {
    question: "How much practical work is included?",
    answer:
      "The program is built around real-world project work and hands-on practice in every module, so you build a project portfolio you can discuss in interviews, not just theory.",
  },
  {
    question: "What is the initial ₹499 payment?",
    answer:
      "The initial ₹499 payment reserves your seat in the program. It is not the full program fee — the remaining payment terms are confirmed by the organizer at the time of enrollment.",
  },
  {
    question: "What is the total launch fee?",
    answer:
      "The reference price is ₹19,999 and the current launch price is ₹1,999. Enrollment begins with the initial ₹499 payment described above, which counts toward this launch price.",
  },
  {
    question: "What does the money-back guarantee cover?",
    answer:
      "We offer a 7-day, 100% money-back guarantee if you find the program unsuitable in week one, subject to the clear, founder-approved terms on our Refund Policy page.",
  },
  {
    question: "Does the program guarantee placement?",
    answer:
      "No. This is a placement-oriented, career-preparation program — it builds practical skills, project experience, and interview readiness. We do not promise guaranteed placement, a guaranteed salary or package, or a job offer. Outcomes depend on your effort, background, and the job market.",
  },
  {
    question: "What career support is actually included?",
    answer:
      "The program includes practical skill-building, real-world project work, interview preparation, and corporate insights from industry professionals. It does not currently include placement assistance, recruiter connections, or interview referrals.",
  },
  {
    question: "What should learners expect after completing the program?",
    answer:
      "A portfolio of real-world projects, practical skills in Excel, Power BI, SQL, automation, and AI-assisted dashboards, and stronger interview readiness — not a guaranteed job, salary, or placement.",
  },
  {
    question: "Do I need to bring my own laptop and software?",
    answer:
      "Yes, a laptop is required. Microsoft Excel and a free Power BI Desktop install are needed; SQL, GitHub, and deployment tools used in class are free to set up.",
  },
  {
    question: "How do I enroll?",
    answer: "Use the enrollment link on this site to reserve your seat with the initial ₹499 payment.",
  },
];

/** Published FAQs from Postgres, falling back to the static list above. */
export async function getFaqs(): Promise<FaqItem[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return faqs;
  try {
    const rows = await prisma.faq.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } });
    if (rows.length === 0) return faqs;
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    return faqs;
  }
}
