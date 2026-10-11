export interface Trainer {
  name: string;
  role: string;
  company?: string;
  location?: string;
  bio: string;
  photoUrl?: string;
  isMentor?: boolean;
}

// Neutral placeholders until the founder supplies genuine photos and biographies.
export const trainers: Trainer[] = [
  {
    name: "M. Kumar",
    role: "Data Analyst",
    company: "Advance Ply",
    location: "Sector 62, Noida",
    bio: "Works as a Data Analyst at Advance Ply, bringing day-to-day corporate reporting and MIS experience into the classroom. Full biography to be confirmed by the founder.",
  },
  {
    name: "Abhinav Panday",
    role: "Core Trainer",
    bio: "Core trainer for the program's Excel, Power BI, and SQL modules. Full biography to be confirmed by the founder.",
  },
  {
    name: "Raj Kumar",
    role: "MIS Analyst and Controller",
    company: "Creme Castle",
    location: "Sector 63, Noida",
    bio: "MIS Analyst and Controller at Creme Castle, contributing real-world MIS and reporting-controller experience to the program. Full biography to be confirmed by the founder.",
  },
];

export interface CorporateMentor {
  name: string;
  title: string;
  session: string;
  topic: string;
  assigned: boolean;
}

export const corporateMentors: CorporateMentor[] = [
  {
    name: "Aditya Singh",
    title: "Senior HR, TVS",
    session: "Class 22",
    topic: "HR and Recruitment Insights",
    assigned: true,
  },
  {
    name: "Pankaj Chauhan",
    title: "Marketing HOD, Advance Ply",
    session: "Class 23",
    topic: "Marketing Analytics and Business Performance",
    assigned: true,
  },
  {
    name: "Mentor to be assigned",
    title: "Business Analytics and Corporate Reporting",
    session: "Class 24",
    topic: "Business Analytics and Corporate Reporting",
    assigned: false,
  },
  {
    name: "Mentor to be assigned",
    title: "Specialization-Specific Career Masterclass",
    session: "Class 25",
    topic: "Specialization-Specific Career Masterclass",
    assigned: false,
  },
];
