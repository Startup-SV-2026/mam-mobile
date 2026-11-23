import type { LessonVisual } from "../types/course";
export const visualKinds = [
  "steps",
  "comparison",
  "cycle",
  "timeline",
  "concept-map",
  "layers",
  "formula",
  "metrics",
] as const;
export const visualTones = [
  "sage",
  "sky",
  "peach",
  "lavender",
  "sand",
] as const;
export const visualPalettes = {
  sage: {
    paper: "#F0F5E9",
    light: "#E0EDCE",
    strong: "#39734C",
    ink: "#243D2C",
  },
  sky: {
    paper: "#EEF4F7",
    light: "#D7E8F0",
    strong: "#35677F",
    ink: "#233F4B",
  },
  peach: {
    paper: "#FFF1E9",
    light: "#F7D9C8",
    strong: "#9A5138",
    ink: "#5D3729",
  },
  lavender: {
    paper: "#F3F0FA",
    light: "#E3DAF1",
    strong: "#6F5895",
    ink: "#413259",
  },
  sand: {
    paper: "#F9F3E7",
    light: "#EDE0C2",
    strong: "#806033",
    ink: "#59462D",
  },
} as const;
const defaults: Record<LessonVisual["kind"], (typeof visualTones)[number]> = {
  steps: "sky",
  comparison: "peach",
  cycle: "sage",
  timeline: "sand",
  "concept-map": "lavender",
  layers: "sky",
  formula: "sand",
  metrics: "sage",
};
export function visualPalette(visual: LessonVisual) {
  return visualPalettes[visual.tone || defaults[visual.kind]];
}
export const visualNames: Record<LessonVisual["kind"], string> = {
  steps: "Từng bước",
  comparison: "So sánh",
  cycle: "Chu trình",
  timeline: "Dòng thời gian",
  "concept-map": "Bản đồ ý tưởng",
  layers: "Các lớp",
  formula: "Công thức",
  metrics: "Các con số",
};
// Covers use topic information, not random AI IDs, so a new Python course isn't a book placeholder.
export function courseArtKey(id: string, title = "", category = "") {
  const tag = id.startsWith("ai-") ? "" : id;
  const value = `${tag} ${title} ${category}`
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  if (/ielts|sat\b|lexicon|c1|c2|hoc thuat/.test(value)) return "lexicon";
  if (/space|vu tru|thien van|hanh tinh/.test(value)) return "space";
  if (/mind|tam ly|thoi quen|nao bo/.test(value)) return "mind";
  if (/money|tien bac|tai chinh|tiet kiem|kinh te/.test(value)) return "money";
  if (/tran-mong|lich su|dai viet|nha tran|bach dang/.test(value))
    return "history";
  if (/english|tieng anh|ngoai ngu|ngon ngu|giao tiep/.test(value))
    return "language";
  if (
    /(^|\s)ai($|\s|-)|python|csv|du lieu|lap trinh|cong nghe|phan mem/.test(
      value,
    )
  )
    return "ai";
  return "lexicon";
}
