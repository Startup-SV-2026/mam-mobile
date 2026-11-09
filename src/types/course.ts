export interface IllustrationPlan {
  scene: string;
  caption: string;
  alt: string;
}
export interface ImageIssue {
  kind:
    | "rate_limit"
    | "quota_exhausted"
    | "access"
    | "temporary"
    | "content"
    | "unknown";
  message: string;
  retryAt?: number;
  metric?: string;
  limit?: number;
}
export interface ImagePipeline {
  state: "active" | "cooldown" | "paused" | "disabled" | "unconfigured";
  issue?: ImageIssue;
  counts: Record<string, number>;
}
export interface IllustrationStatus {
  id: string;
  status: "queued" | "generating" | "ready" | "failed" | "paused";
  issue?: ImageIssue;
  retryAt?: number;
  canRetry?: boolean;
  url?: string;
  error?: string;
}
export function isIllustrationPlan(v: unknown): v is IllustrationPlan {
  return (
    typeof v === "object" &&
    v !== null &&
    ["scene", "caption", "alt"].every((k) => {
      const x = (v as Record<string, unknown>)[k];
      return (
        typeof x === "string" &&
        x.trim().length > 0 &&
        x.length <= (k === "scene" ? 1800 : 400)
      );
    })
  );
}
export interface LessonVisual {
  kind: "steps" | "comparison" | "cycle" | "timeline";
  title: string;
  items: { label: string; detail: string }[];
}
export interface LessonPage {
  visual?: LessonVisual;
  kicker: string;
  title: string;
  body: string;
  emoji: string;
  takeaway: string;
}
export interface Quiz {
  question: string;
  choices: string[];
  answer: number;
  why: string;
}
export interface Lesson {
  illustrationPlan?: IllustrationPlan;
  illustration?: { id: string };
  sampleIllustration?: "space";
  title: string;
  subtitle: string;
  minutes: number;
  pages: LessonPage[];
  quiz: Quiz;
}
export interface CourseContent {
  title: string;
  subtitle: string;
  lessons: Lesson[];
}
export interface Course extends CourseContent {
  id: string;
  category: string;
  emoji: string;
  color: string;
  accent: string;
  level: string;
  source: "sample" | "ai";
}
export type Screen =
  | "home"
  | "explore"
  | "course"
  | "lesson"
  | "quiz"
  | "done"
  | "stats"
  | "ai-status"
  | "profile"
  | "create"
  | "review"
  | "saved";
export interface ReviewCard {
  due: number;
  interval: number;
  repetitions: number;
}
export interface Progress {
  illustrationIds: Record<string, string>;
  saved: string[];
  notes: Record<string, string>;
  selectedCourseId: string;
  completed: Record<string, boolean>;
  xp: number;
  streak: number;
  lastStudy: string;
  customCourses: Course[];
  reviews: Record<string, ReviewCard>;
}
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
export function isLessonVisual(v: unknown): v is LessonVisual {
  return (
    record(v) &&
    ["steps", "comparison", "cycle", "timeline"].includes(String(v.kind)) &&
    typeof v.title === "string" &&
    v.title.trim().length > 0 &&
    Array.isArray(v.items) &&
    v.items.length >= 2 &&
    v.items.length <= 3 &&
    (v.kind !== "cycle" || v.items.length === 3) &&
    v.items.every(
      (i) =>
        record(i) &&
        typeof i.label === "string" &&
        i.label.trim().length > 0 &&
        typeof i.detail === "string" &&
        i.detail.trim().length > 0,
    )
  );
}
const text = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;
export function isCourseContent(v: unknown): v is CourseContent {
  return (
    record(v) &&
    text(v.title) &&
    text(v.subtitle) &&
    Array.isArray(v.lessons) &&
    v.lessons.length > 0 &&
    v.lessons.length <= 30 &&
    v.lessons.every(
      (l) =>
        record(l) &&
        (l.illustrationPlan === undefined ||
          isIllustrationPlan(l.illustrationPlan)) &&
        (l.illustration === undefined ||
          (record(l.illustration) &&
            typeof l.illustration.id === "string" &&
            /^[a-f0-9]{64}$/.test(l.illustration.id))) &&
        typeof l.minutes === "number" &&
        Number.isFinite(l.minutes) &&
        l.minutes > 0 &&
        text(l.title) &&
        text(l.subtitle) &&
        Array.isArray(l.pages) &&
        l.pages.length > 0 &&
        l.pages.every(
          (p) =>
            record(p) &&
            ["kicker", "title", "body", "emoji", "takeaway"].every((k) =>
              text(p[k]),
            ) &&
            (p.visual === undefined || isLessonVisual(p.visual)),
        ) &&
        record(l.quiz) &&
        text(l.quiz.question) &&
        text(l.quiz.why) &&
        Array.isArray(l.quiz.choices) &&
        l.quiz.choices.length === 4 &&
        l.quiz.choices.every(text) &&
        typeof l.quiz.answer === "number" &&
        Number.isInteger(l.quiz.answer) &&
        l.quiz.answer >= 0 &&
        l.quiz.answer < 4,
    )
  );
}
export function isCourse(v: unknown): v is Course {
  return (
    isCourseContent(v) &&
    record(v) &&
    ["id", "category", "emoji", "color", "accent", "level"].every((k) =>
      text(v[k]),
    ) &&
    (v.source === "sample" || v.source === "ai")
  );
}
export function readProgress(value: unknown): Progress {
  const p = record(value) ? value : {};
  const completed: Progress["completed"] = {};
  if (record(p.completed))
    for (const [k, v] of Object.entries(p.completed))
      if (v === true) completed[k] = true;
  const reviews: Progress["reviews"] = {};
  if (record(p.reviews))
    for (const [k, v] of Object.entries(p.reviews))
      if (
        record(v) &&
        typeof v.due === "number" &&
        Number.isFinite(v.due) &&
        typeof v.interval === "number" &&
        Number.isFinite(v.interval) &&
        v.interval >= 0 &&
        typeof v.repetitions === "number" &&
        Number.isInteger(v.repetitions) &&
        v.repetitions >= 0
      )
        reviews[k] = v as unknown as ReviewCard;
  const count = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  return {
    illustrationIds: record(p.illustrationIds)
      ? Object.fromEntries(
          Object.entries(p.illustrationIds).filter(
            (e): e is [string, string] =>
              typeof e[1] === "string" && /^[a-f0-9]{64}$/.test(e[1]),
          ),
        )
      : {},
    saved: Array.isArray(p.saved)
      ? p.saved.filter((v): v is string => typeof v === "string")
      : [],
    notes: record(p.notes)
      ? Object.fromEntries(
          Object.entries(p.notes).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {},
    selectedCourseId:
      typeof p.selectedCourseId === "string" ? p.selectedCourseId : "space",
    completed,
    reviews,
    xp: count(p.xp),
    streak: count(p.streak),
    lastStudy: typeof p.lastStudy === "string" ? p.lastStudy : "",
    customCourses: Array.isArray(p.customCourses)
      ? p.customCourses.filter(isCourse)
      : [],
  };
}
