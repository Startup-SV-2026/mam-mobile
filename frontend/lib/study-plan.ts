export type Activity =
  | { kind: "flashcard"; prompt: string; answer: string; example: string }
  | {
      kind: "gap" | "reading";
      prompt: string;
      choices: string[];
      answer: number;
      explanation: string;
    }
  | {
      kind: "match";
      prompt: string;
      pairs: { term: string; meaning: string }[];
    }
  | { kind: "writing"; prompt: string; sample: string; checklist: string[] };
export interface StudyWeek {
  start: string;
  end: string;
  focus: string;
  activities?: Activity[];
  done: number[];
  drafts: Record<string, string>;
}
export interface StudyPlan {
  id: string;
  topic: string;
  level: string;
  minutes: number;
  start: string;
  end: string;
  weeks: StudyWeek[];
}
const DAY = 86400000;
export function parseStudyDate(value: string): number {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) throw Error("Nhập ngày theo dạng DD/MM/YYYY.");
  const d = Date.UTC(+m[3], +m[2] - 1, +m[1]);
  const date = new Date(d);
  if (
    date.getUTCFullYear() !== +m[3] ||
    date.getUTCMonth() !== +m[2] - 1 ||
    date.getUTCDate() !== +m[1]
  )
    throw Error("Ngày không tồn tại.");
  return d;
}
export function studyDate(n: number) {
  const d = new Date(n);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}
export function makeStudyPlan(
  topic: string,
  level: string,
  minutes: number,
  start: string,
  end: string,
): StudyPlan {
  const a = parseStudyDate(start),
    b = parseStudyDate(end),
    days = Math.round((b - a) / DAY) + 1;
  if (!level.trim() || level.length > 100)
    throw Error("Nhập trình độ mong muốn, tối đa 100 ký tự.");
  if (!topic.trim() || topic.trim().length > 150)
    throw Error("Nhập mục tiêu học, tối đa 150 ký tự.");
  if (days < 1 || days > 366)
    throw Error("Ngày kết thúc phải từ ngày bắt đầu, trong tối đa một năm.");
  if (![10, 20, 30, 45, 60].includes(minutes))
    throw Error("Chọn thời lượng học hợp lệ.");
  const count = Math.max(1, Math.round(days / 7));
  const english = /tiếng anh|english|từ vựng|vocabulary/i.test(topic);
  const phases = english
    ? [
        "Nghĩa và cách dùng từ trong ngữ cảnh",
        "Collocations và sắc thái nghĩa",
        "Đọc hiểu, suy luận và diễn đạt lại",
        "Vận dụng từ vựng trong bài viết",
      ]
    : [
        "Nền tảng và nguyên lý quan trọng",
        "Vận dụng qua ví dụ",
        "Giải quyết tình huống",
        "Tổng hợp và tự đánh giá",
      ];
  return {
    id: `plan-${Date.now()}`,
    topic: topic.trim(),
    level,
    minutes,
    start,
    end,
    weeks: Array.from({ length: count }, (_, i) => ({
      start: studyDate(a + Math.floor((i * days) / count) * DAY),
      end: studyDate(a + (Math.floor(((i + 1) * days) / count) - 1) * DAY),
      focus: phases[Math.min(3, Math.floor((i * 4) / count))],
      done: [],
      drafts: {},
    })),
  };
}
export function isActivities(value: unknown): value is Activity[] {
  if (!Array.isArray(value) || value.length < 5 || value.length > 12)
    return false;
  const text = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0 && v.length <= 4000;
  return (
    value.every(
      (a) =>
        a &&
        text(a.prompt) &&
        (a.kind === "flashcard"
          ? text(a.answer) && text(a.example)
          : a.kind === "gap" || a.kind === "reading"
            ? Array.isArray(a.choices) &&
              a.choices.length === 4 &&
              a.choices.every(text) &&
              new Set(
                a.choices.map((c: string) => c.trim().toLocaleLowerCase()),
              ).size === 4 &&
              Number.isInteger(a.answer) &&
              a.answer >= 0 &&
              a.answer < 4 &&
              text(a.explanation)
            : a.kind === "match"
              ? Array.isArray(a.pairs) &&
                a.pairs.length >= 3 &&
                a.pairs.length <= 6 &&
                a.pairs.every(
                  (p: any) => p && text(p.term) && text(p.meaning),
                ) &&
                new Set(a.pairs.map((p: any) => p.term)).size ===
                  a.pairs.length &&
                new Set(a.pairs.map((p: any) => p.meaning)).size ===
                  a.pairs.length
              : a.kind === "writing"
                ? text(a.sample) &&
                  Array.isArray(a.checklist) &&
                  a.checklist.length >= 1 &&
                  a.checklist.length <= 6 &&
                  a.checklist.every(text)
                : false),
    ) &&
    ["flashcard", "gap", "match", "reading", "writing"].every((k) =>
      value.some((a) => a.kind === k),
    )
  );
}
export function isStudyPlan(v: unknown): v is StudyPlan {
  try {
    const p = v as StudyPlan;
    const expected = makeStudyPlan(p.topic, p.level, p.minutes, p.start, p.end);
    return (
      typeof p.id === "string" &&
      typeof p.level === "string" &&
      Array.isArray(p.weeks) &&
      p.weeks.length === expected.weeks.length &&
      p.weeks.every(
        (w, i) =>
          w.start === expected.weeks[i].start &&
          w.end === expected.weeks[i].end &&
          typeof w.focus === "string" &&
          (!w.activities || isActivities(w.activities)) &&
          Array.isArray(w.done) &&
          w.done.every(
            (n) =>
              Number.isInteger(n) && n >= 0 && n < (w.activities?.length ?? 0),
          ) &&
          !!w.drafts &&
          typeof w.drafts === "object" &&
          Object.values(w.drafts).every(
            (x) => typeof x === "string" && x.length <= 5000,
          ),
      )
    );
  } catch {
    return false;
  }
}
