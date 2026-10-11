/**
 * Imports the real Phase 1 content (src/lib/content/*) into Postgres as the
 * initial published rows, so the admin panel starts populated with the
 * genuine 25-session curriculum, trainers, mentors, projects and FAQ —
 * never abbreviated placeholders. Idempotent: upserts by stable natural
 * keys (classNumber, trainer name, project slug, question) so re-running
 * after a founder has started editing in the admin panel won't clobber
 * their changes to existing rows' other fields on a second run of a
 * *different* seed, but will re-run cleanly on an empty database.
 */
import type { PrismaClient } from "@prisma/client";
import { curriculum as staticCurriculum, type SessionModule as StaticModule } from "../src/lib/content/curriculum";
import { trainers as staticTrainers, corporateMentors as staticMentors } from "../src/lib/content/trainers";
import { projects as staticProjects } from "../src/lib/content/projects";
import { faqs as staticFaqs } from "../src/lib/content/faq";

const MODULE_MAP: Record<StaticModule, string> = {
  "Advanced Excel": "EXCEL",
  "Power BI": "POWER_BI",
  SQL: "SQL",
  "Automation & Deployment": "AUTOMATION",
  "AI & Web Dashboards": "AI_AND_WEB",
  "Corporate Readiness": "CORPORATE",
  "Corporate Expert Mentoring": "MENTOR",
};

const DIFFICULTY_MAP: Record<string, string> = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function importPhase1Content(prisma: PrismaClient): Promise<void> {
  // Trainers (core trainers + corporate mentors, both live in the Trainer table).
  const trainerIdByName = new Map<string, string>();

  for (const [index, t] of staticTrainers.entries()) {
    const existing = await prisma.trainer.findFirst({ where: { name: t.name } });
    const row =
      existing ??
      (await prisma.trainer.create({
        data: {
          name: t.name,
          role: t.role,
          company: t.company ?? null,
          location: t.location ?? null,
          bio: t.bio,
          photoUrl: t.photoUrl ?? null,
          isMentor: false,
          sortOrder: index,
          status: "PUBLISHED",
        },
      }));
    trainerIdByName.set(t.name, row.id);
  }

  for (const [index, m] of staticMentors.entries()) {
    if (!m.assigned) continue;
    const existing = await prisma.trainer.findFirst({ where: { name: m.name } });
    const row =
      existing ??
      (await prisma.trainer.create({
        data: {
          name: m.name,
          role: m.title,
          photoUrl: m.photoUrl ?? null,
          isMentor: true,
          sortOrder: 100 + index,
          status: "PUBLISHED",
        },
      }));
    trainerIdByName.set(m.name, row.id);
  }
  console.log(`Trainers/mentors: ${trainerIdByName.size} rows ensured.`);

  // Curriculum — all 25 sessions, preserved in full (no abbreviation).
  let curriculumCount = 0;
  for (const s of staticCurriculum) {
    const existing = await prisma.curriculumSession.findUnique({ where: { classNumber: s.classNumber } });
    if (existing) continue; // never overwrite a founder's edits on re-run
    await prisma.curriculumSession.create({
      data: {
        classNumber: s.classNumber,
        module: MODULE_MAP[s.module] as never,
        title: s.title,
        durationMinutes: s.durationMinutes,
        topics: s.topics,
        practicalExample: s.practicalExample,
        handsOnExercise: s.handsOnExercise,
        learningOutcome: s.learningOutcome,
        deliverable: s.deliverable,
        tools: s.tools,
        trainerId: s.mentor ? (trainerIdByName.get(s.mentor.name) ?? null) : null,
        mentorName: s.mentor?.name ?? null,
        mentorTitle: s.mentor?.title ?? null,
        order: s.classNumber,
        status: "PUBLISHED",
        isEditableByFounder: Boolean(s.founderEditable),
      },
    });
    curriculumCount++;
  }
  console.log(`Curriculum: ${curriculumCount} new sessions created (existing ones left untouched).`);

  // Projects
  let projectCount = 0;
  for (const [index, p] of staticProjects.entries()) {
    const slug = slugify(p.title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) continue;
    await prisma.project.create({
      data: {
        slug,
        title: p.title,
        businessProblem: p.businessProblem,
        tools: p.tools,
        learningObjectives: p.learningObjectives,
        deliverables: p.deliverables,
        difficulty: DIFFICULTY_MAP[p.difficulty] as never,
        isPlannedExample: p.isPlannedExample,
        demoUrl: p.demoUrl ?? null,
        githubUrl: p.githubUrl ?? null,
        sortOrder: index,
        status: "PUBLISHED",
      },
    });
    projectCount++;
  }
  console.log(`Projects: ${projectCount} new rows created.`);

  // FAQ
  let faqCount = 0;
  for (const [index, f] of staticFaqs.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (existing) continue;
    await prisma.faq.create({
      data: { question: f.question, answer: f.answer, sortOrder: index, status: "PUBLISHED" },
    });
    faqCount++;
  }
  console.log(`FAQ: ${faqCount} new rows created.`);
}
