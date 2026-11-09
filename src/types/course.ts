export interface LessonPage { kicker: string; title: string; body: string; emoji: string; takeaway: string }
export interface Quiz { question: string; choices: string[]; answer: number; why: string }
export interface Lesson { title: string; subtitle: string; minutes: number; pages: LessonPage[]; quiz: Quiz }
export interface CourseContent { title: string; subtitle: string; lessons: Lesson[] }
export interface Course extends CourseContent { id: string; category: string; emoji: string; color: string; accent: string; level: string; source: 'sample' | 'ai' }
export type Screen = 'home' | 'explore' | 'course' | 'lesson' | 'quiz' | 'done' | 'stats' | 'profile' | 'create' | 'review';
export interface ReviewCard { due: number; interval: number; repetitions: number }
export interface Progress { completed: Record<string, boolean>; xp: number; streak: number; lastStudy: string; customCourses: Course[]; reviews: Record<string, ReviewCard> }
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
export function isCourseContent(v: unknown): v is CourseContent {
  return record(v) && text(v.title) && text(v.subtitle) && Array.isArray(v.lessons) && v.lessons.length > 0 && v.lessons.length <= 30 && v.lessons.every(l =>
    record(l) && typeof l.minutes === 'number' && Number.isFinite(l.minutes) && l.minutes > 0 && text(l.title) && text(l.subtitle) && Array.isArray(l.pages) && l.pages.length > 0 && l.pages.every(p => record(p) && ['kicker','title','body','emoji','takeaway'].every(k => text(p[k]))) &&
    record(l.quiz) && text(l.quiz.question) && text(l.quiz.why) && Array.isArray(l.quiz.choices) && l.quiz.choices.length === 4 && l.quiz.choices.every(text) && typeof l.quiz.answer === 'number' && Number.isInteger(l.quiz.answer) && l.quiz.answer >= 0 && l.quiz.answer < 4);
}
export function isCourse(v: unknown): v is Course {
  return isCourseContent(v) && record(v) && ['id','category','emoji','color','accent','level'].every(k => text(v[k])) && (v.source === 'sample' || v.source === 'ai');
}
export function readProgress(value: unknown): Progress {
  const p = record(value) ? value : {};
  const completed: Progress['completed'] = {};
  if (record(p.completed)) for (const [k,v] of Object.entries(p.completed)) if (v === true) completed[k] = true;
  const reviews: Progress['reviews'] = {};
  if (record(p.reviews)) for (const [k,v] of Object.entries(p.reviews)) if (record(v) && typeof v.due === 'number' && Number.isFinite(v.due) && typeof v.interval === 'number' && Number.isFinite(v.interval) && v.interval >= 0 && typeof v.repetitions === 'number' && Number.isInteger(v.repetitions) && v.repetitions >= 0) reviews[k] = v as unknown as ReviewCard;
  const count = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  return {completed, reviews, xp: count(p.xp), streak: count(p.streak), lastStudy: typeof p.lastStudy === 'string' ? p.lastStudy : '', customCourses: Array.isArray(p.customCourses) ? p.customCourses.filter(isCourse) : []};
}
