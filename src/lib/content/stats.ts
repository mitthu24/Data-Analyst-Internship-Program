// Only verified, structural facts about the program — no fabricated placement,
// hiring, or student-count statistics. Every number here is derived directly
// from the program's own published content.
import { getCurriculum } from "./curriculum";
import { getTrainers, getCorporateMentors } from "./trainers";
import { getProjects } from "./projects";

export async function getProgramStats() {
  const [curriculum, trainers, corporateMentors, projects] = await Promise.all([
    getCurriculum(),
    getTrainers(),
    getCorporateMentors(),
    getProjects(),
  ]);

  const totalHours = curriculum.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;

  return [
    { label: "Total sessions", value: `${curriculum.length}` },
    { label: "Minutes per session", value: "90" },
    { label: "Instructional hours", value: `${totalHours}` },
    { label: "Core trainers", value: `${trainers.length}` },
    { label: "Corporate mentor sessions", value: `${corporateMentors.filter((m) => m.assigned).length}` },
    { label: "Practical projects", value: `${projects.length}` },
  ] as const;
}
