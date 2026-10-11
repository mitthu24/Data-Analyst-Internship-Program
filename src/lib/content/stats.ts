// Only verified, structural facts about the program — no fabricated placement,
// hiring, or student-count statistics. Every number here is derived directly
// from the program's own design (session count, hours, trainers, mentors).
import { curriculum } from "./curriculum";
import { trainers, corporateMentors } from "./trainers";

export const programStats = [
  { label: "Total sessions", value: `${curriculum.length}` },
  { label: "Minutes per session", value: "90" },
  { label: "Instructional hours", value: "37.5" },
  { label: "Core trainers", value: `${trainers.length}` },
  { label: "Corporate mentor sessions", value: `${corporateMentors.length}` },
  { label: "Practical projects", value: "8" },
] as const;
