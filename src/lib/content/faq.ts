export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Who is this program for?",
    answer:
      "MBA students from every specialization, BBA/B.Com/B.Sc. and other graduates, freshers and job seekers, and working professionals who want practical analytics skills. No prior analytics background is required.",
  },
  {
    question: "What is the program format?",
    answer:
      "A one-week program with 25 sessions in total: 21 core classes plus 4 corporate expert mentoring sessions, each 90 minutes long, for 37.5 hours of instructional time overall. The exact daily schedule and class timings for your batch are configured and shared by the organizer before the batch starts.",
  },
  {
    question: "How much does it cost?",
    answer:
      "The reference price is ₹19,999 and the current launch price is ₹1,999. Enrollment begins with an initial payment of ₹499 to reserve your seat. This ₹499 is an initial enrollment payment, not the full program price — the remaining payment terms are confirmed by the organizer at the time of enrollment.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. We offer a 100% money-back guarantee during the first week of the program if you do not like it or find it unsuitable, subject to the clear, founder-approved terms on our Refund Policy page.",
  },
  {
    question: "Will I get a job after this program?",
    answer:
      "This program builds practical, job-relevant analytics skills, a project portfolio, and interview preparation. We do not promise employment or any specific salary outcome — your results depend on your effort, background, and the job market.",
  },
  {
    question: "What tools will I learn?",
    answer:
      "Advanced Excel, Power BI, SQL, automation tools (VBA, Office Scripts, Google Apps Script), AI assistants (ChatGPT, Claude Code), and the basics of deploying a dashboard live using GitHub and Vercel.",
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
