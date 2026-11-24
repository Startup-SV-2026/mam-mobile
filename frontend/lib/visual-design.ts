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
export const courseArtKeys = [
  "space",
  "mind",
  "money",
  "ai",
  "language",
  "history",
  "lexicon",
  "science",
  "exam",
  "literature",
  "design",
  "health",
  "logic",
  "earth",
  "culture",
] as const;

export type CourseArtKey = (typeof courseArtKeys)[number];

// Covers use topic information, not random AI IDs, so a new Python course isn't a book placeholder.
export function courseArtKey(id: string, title = "", category = ""): CourseArtKey {
  if (id === "space") return "space";
  if (id === "mind") return "mind";
  if (id === "money") return "money";
  if (id === "ai") return "ai";
  if (id === "english") return "language";
  if (id === "tran-mong") return "history";
  if (id === "ielts-sat") return "lexicon";

  const tag = id.startsWith("ai-") ? "" : id;
  const value = `${tag} ${title} ${category}`
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

  if (/space|vu tru|thien van|hanh tinh|ngan ha|sao hoa/.test(value)) return "space";
  if (/dia ly|trai dat|khi hau|moi truong|ban do|cac nuoc|chau luc|du lich|quoc gia/.test(value)) return "earth";
  if (/mind|tam ly|thoi quen|nao bo|suy nghi|cam xuc/.test(value)) return "mind";
  if (/money|tien bac|tai chinh|tiet kiem|kinh te|dau tu/.test(value)) return "money";
  if (
    /van hoa|di san|dong son|dan toc|phong tuc|truyen thong|khao co|dan gian/.test(
      value,
    )
  )
    return "culture";

  // Math, Logic & Strategy:
  if (/toan hoc|toan\b|logic|co vua|xac suat|thong ke|so hoc|hinh hoc|dai so|tinh toan|giai do/.test(value))
    return "logic";

  if (
    /tran-mong|lich su|dai viet|nha tran|bach dang|le trung hung|trieu dai|thoi ky|chien tranh|the chien|khang chien|su viet|trieu dinh|hoang de/.test(
      value,
    ) || (/\bvua\b/.test(value) && !/co vua/.test(value))
  )
    return "history";

  if (
    /(^|\s)ai($|\s|-)|python|csv|du lieu|lap trinh|cong nghe|phan mem|machine learning|thuat toan/.test(
      value,
    )
  )
    return "ai";

  // Art, Design & Creativity:
  if (/thiet ke|my thuat|hoi hoa|sang tao|ve tranh|mau sac|nghe thuat|graphics|design|typography/.test(value))
    return "design";

  // Health, Biology & Wellness:
  if (/suc khoe|sinh hoc|y hoc|dinh duong|the thao|thao moc|thuoc|co the|benh|y te|duoc lieu/.test(value))
    return "health";

  // Natural sciences & Discovery:
  if (/khoa hoc|vat ly|hoa hoc|thien nhien|kinh thien van|thi nghiem|vat chat/.test(value))
    return "science";

  // Literature & Writing:
  if (/van hoc|tac pham|tho\b|truyen|triet hoc|viet lach|tieu thuyet|ngu van/.test(value))
    return "literature";

  // Tests & Exams (SAT, luyện thi, chuẩn hóa, nâng cao):
  if (/\bsat\b|luyen thi|thi cu|nang cao|chinh phuc/.test(value))
    return "exam";

  // Vocabulary & Test Prep (IELTS, từ vựng, ngữ pháp):
  if (/ielts|tu vung|lexicon|c1|c2|ngu phap|hoc thuat/.test(value))
    return "lexicon";

  // Conversational Language (tiếng Anh giao tiếp, ngoại ngữ):
  if (/english|tieng anh|ngoai ngu|ngon ngu|giao tiep|hoi thoai/.test(value))
    return "language";

  return "lexicon";
}
