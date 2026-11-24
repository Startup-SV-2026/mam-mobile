export const COURSE_LEVELS = [
  "Người mới",
  "Đã biết một chút",
  "Nâng cao",
] as const;
export type CourseBrief = {
  topic: string;
  goal: string;
  level: (typeof COURSE_LEVELS)[number];
  experience: string;
  focus: string;
  format: string;
  pace: string;
};
export type CourseChatMessage = { role: "user" | "assistant"; content: string };
export type CourseChatReply =
  | { kind: "question"; message: string; options: string[] }
  | { kind: "ready"; message: string; brief: CourseBrief };
const text = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
export function isCourseBrief(v: unknown): v is CourseBrief {
  if (!v || typeof v !== "object") return false;
  const b = v as CourseBrief;
  return (
    text(b.topic, 150) &&
    text(b.goal, 600) &&
    COURSE_LEVELS.includes(b.level) &&
    [b.experience, b.focus, b.format, b.pace].every((s) => text(s, 600))
  );
}
export function isCourseChatReply(v: unknown): v is CourseChatReply {
  if (!v || typeof v !== "object") return false;
  const r = v as CourseChatReply;
  if (!text(r.message, 800)) return false;
  if (r.kind === "ready") return isCourseBrief(r.brief);
  return (
    r.kind === "question" &&
    Array.isArray(r.options) &&
    r.options.length <= 4 &&
    r.options.every((o) => text(o, 120)) &&
    new Set(r.options.map((o) => o.trim().toLocaleLowerCase("vi"))).size ===
      r.options.length
  );
}
export function isCourseChatHistory(v: unknown): v is CourseChatMessage[] {
  return (
    Array.isArray(v) &&
    v.length <= 12 &&
    v.every(
      (m, i) =>
        m &&
        m.role === (i % 2 === 0 ? "assistant" : "user") &&
        text(m.content, 1000),
    ) &&
    v.length % 2 === 0
  );
}
