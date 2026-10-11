export interface Trainer {
  name: string;
  role: string;
  company?: string;
  location?: string;
  bio: string;
  expertise?: string[];
  photoUrl?: string;
  linkedin?: string;
  isMentor?: boolean;
}

export const trainers: Trainer[] = [
  {
    name: "M. Kumar",
    role: "Data Analyst",
    company: "Advance Ply",
    location: "Sector 62, Noida",
    bio: "Works as a Data Analyst at Advance Ply, bringing day-to-day corporate reporting and MIS experience into the classroom. Full biography to be confirmed by the founder.",
    expertise: ["Excel", "Power BI", "SQL"],
    photoUrl: "/trainers/m-kumar.jpg",
  },
  {
    name: "Abhinav Panday",
    role: "Core Trainer",
    bio: "Core trainer for the program's Excel, Power BI, and SQL modules. Full biography to be confirmed by the founder.",
    expertise: ["Excel", "Power BI", "SQL"],
    photoUrl: "/trainers/abhinav-panday.jpg",
  },
  {
    name: "Raj Kumar",
    role: "MIS Analyst and Controller",
    company: "Creme Castle",
    location: "Sector 63, Noida",
    bio: "MIS Analyst and Controller at Creme Castle, contributing real-world MIS and reporting-controller experience to the program. Full biography to be confirmed by the founder.",
    expertise: ["HR Guidance", "Interview Prep", "Career Growth"],
    photoUrl: "/trainers/raj-kumar.jpg",
  },
];

export interface CorporateMentor {
  name: string;
  title: string;
  session: string;
  topic: string;
  assigned: boolean;
  expertise?: string[];
  photoUrl?: string;
}

export const corporateMentors: CorporateMentor[] = [
  {
    name: "Aditya Singh",
    title: "Senior HR, TVS",
    session: "Class 22",
    topic: "HR and Recruitment Insights",
    assigned: true,
    expertise: ["Excel", "Power BI", "SQL"],
    photoUrl: "/trainers/aditya-singh.jpg",
  },
  {
    name: "Pankaj Chauhan",
    title: "Marketing HOD, Advance Ply",
    session: "Class 23",
    topic: "Marketing Analytics and Business Performance",
    assigned: true,
    expertise: ["Marketing Strategy", "Business Analytics", "Growth Insights"],
    photoUrl: "/trainers/pankaj-chauhan.jpg",
  },
  {
    name: "Mentor to be assigned",
    title: "Business Analytics and Corporate Reporting",
    session: "Class 24",
    topic: "Business Analytics and Corporate Reporting",
    assigned: false,
    expertise: ["Business Analytics", "Corporate Reporting", "Industry Insights"],
  },
  {
    name: "Mentor to be assigned",
    title: "Specialization-Specific Career Masterclass",
    session: "Class 25",
    topic: "Specialization-Specific Career Masterclass",
    assigned: false,
    expertise: ["Business Analytics", "Corporate Reporting", "Industry Insights"],
  },
];

/** Published core trainers from Postgres, falling back to the static list above. */
export async function getTrainers(): Promise<Trainer[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return trainers;
  try {
    const rows = await prisma.trainer.findMany({
      where: { isMentor: false, status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return trainers;
    return rows.map((r) => ({
      name: r.name,
      role: r.role,
      company: r.company ?? undefined,
      location: r.location ?? undefined,
      bio: r.bio ?? "",
      expertise: r.expertise.length > 0 ? r.expertise : undefined,
      photoUrl: r.photoUrl ?? undefined,
      linkedin: r.linkedin ?? undefined,
    }));
  } catch {
    return trainers;
  }
}

/** Published corporate mentors for classes 22–25, read from the curriculum so session/topic stay accurate. */
export async function getCorporateMentors(): Promise<CorporateMentor[]> {
  const { prisma, isDatabaseConfigured } = await import("@/lib/db/prisma");
  if (!isDatabaseConfigured()) return corporateMentors;
  try {
    const rows = await prisma.curriculumSession.findMany({
      where: { module: "MENTOR", status: "PUBLISHED" },
      orderBy: { classNumber: "asc" },
      include: { trainer: true },
    });
    if (rows.length === 0) return corporateMentors;
    return rows.map((r) => ({
      name: r.trainer?.name ?? r.mentorName ?? "Mentor to be assigned",
      title: r.trainer?.role ?? r.mentorTitle ?? r.title,
      session: `Class ${r.classNumber}`,
      topic: r.title,
      assigned: Boolean(r.trainer || r.mentorName),
      expertise: r.trainer && r.trainer.expertise.length > 0 ? r.trainer.expertise : undefined,
      photoUrl: r.trainer?.photoUrl ?? undefined,
    }));
  } catch {
    return corporateMentors;
  }
}
