import {
  isCourseBrief,
  isCourseChatHistory,
  type CourseBrief,
  type CourseChatMessage,
} from "./course-chat";
import type { CourseContent, Lesson } from "../types/course";
export interface CoursePlan {
  title: string;
  subtitle: string;
  chapters: {
    title: string;
    lessons: { title: string; objective: string }[];
  }[];
}
export interface Curriculum {
  version: 1;
  brief: CourseBrief;
  conversation: CourseChatMessage[];
  plan: CoursePlan;
}
const text = (s: unknown, max: number): s is string =>
  typeof s === "string" && s.trim().length > 0 && s.length <= max;
export function isCoursePlan(v: unknown): v is CoursePlan {
  if (!v || typeof v !== "object") return false;
  const p = v as CoursePlan;
  return (
    text(p.title, 100) &&
    text(p.subtitle, 300) &&
    Array.isArray(p.chapters) &&
    p.chapters.length >= 2 &&
    p.chapters.length <= 6 &&
    p.chapters.every(
      (c) =>
        c &&
        text(c.title, 100) &&
        Array.isArray(c.lessons) &&
        c.lessons.length >= 2 &&
        c.lessons.length <= 5 &&
        c.lessons.every(
          (l) => l && text(l.title, 150) && text(l.objective, 400),
        ),
    )
  );
}
export function isCurriculum(v: unknown): v is Curriculum {
  if (!v || typeof v !== "object") return false;
  const c = v as Curriculum;
  return (
    c.version === 1 &&
    isCourseBrief(c.brief) &&
    isCourseChatHistory(c.conversation) &&
    isCoursePlan(c.plan)
  );
}
export function flattenPlan(plan: CoursePlan) {
  return plan.chapters.flatMap((chapter, c) =>
    chapter.lessons.map((lesson, l) => ({
      ...lesson,
      number: `${c + 1}.${l + 1}`,
      section: `Chương ${c + 1} · ${chapter.title}`,
    })),
  );
}
export function totalLessons(course: CourseContent) {
  return course.curriculum
    ? flattenPlan(course.curriculum.plan).length
    : course.lessons.length;
}
export function plannedLessons(course: CourseContent) {
  return course.curriculum
    ? flattenPlan(course.curriculum.plan)
    : course.lessons.map((l, i) => ({
        title: l.title,
        objective: l.objective || l.subtitle,
        number: String(i + 1),
        section: l.section || course.subtitle,
      }));
}
export function nextLessonIndex(
  course: CourseContent,
  completed: Record<string, boolean>,
  courseId: string,
) {
  const index = course.lessons.length;
  return course.curriculum &&
    index < totalLessons(course) &&
    course.lessons.every((_, i) => completed[`${courseId}:${i}`])
    ? index
    : null;
}
export interface PreviousLesson {
  title: string;
  objective: string;
  takeaways: string[];
  visualKinds?: string[];
  completed: true;
  section?: string;
}
export function lessonContext(lessons: Lesson[]): PreviousLesson[] {
  return lessons.map((l) => ({
    title: l.title,
    objective: l.objective || l.subtitle,
    takeaways: l.pages.map((p) => p.takeaway),
    visualKinds: l.pages
      .map((p) => p.visual?.kind)
      .filter((k): k is NonNullable<typeof k> => !!k),
    completed: true,
    section: l.section,
  }));
}
export function isPreviousLessons(
  v: unknown,
  plan: CoursePlan,
  index: number,
): v is PreviousLesson[] {
  const entries = flattenPlan(plan);
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < entries.length &&
    Array.isArray(v) &&
    v.length === index &&
    v.every(
      (l, i) =>
        l &&
        l.completed === true &&
        l.title === entries[i].title &&
        text(l.objective, 400) &&
        Array.isArray(l.takeaways) &&
        l.takeaways.length >= 3 &&
        l.takeaways.length <= 7 &&
        l.takeaways.every((s: unknown) => text(s, 1500)) &&
        (l.visualKinds === undefined ||
          (Array.isArray(l.visualKinds) &&
            l.visualKinds.length <= 8 &&
            l.visualKinds.every((k: unknown) => text(k, 40)))),
    )
  );
}
