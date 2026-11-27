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
  "cause-effect",
  "funnel",
  "spectrum",
  "bars",
  "line-chart",
  "flowchart",
  "callout",
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
  "cause-effect": "peach",
  funnel: "lavender",
  spectrum: "sky",
  bars: "sage",
  "line-chart": "sky",
  flowchart: "sand",
  callout: "sand",
};
export function visualPalette(visual: LessonVisual) {
  return visualPalettes[visual.tone || defaults[visual.kind]];
}
export const visualNames: Record<LessonVisual["kind"], string> = {
  steps: "Từng bước",
  comparison: "So sánh",
  cycle: "Vòng lặp",
  timeline: "Dòng thời gian",
  "concept-map": "Sơ đồ nhánh",
  layers: "Các lớp",
  formula: "Công thức",
  metrics: "Con số đáng nhớ",
  "cause-effect": "Nguyên nhân & Kết quả",
  funnel: "Các bước chọn lọc",
  spectrum: "Thang mức độ",
  bars: "Biểu đồ so sánh",
  "line-chart": "Đồ thị xu hướng",
  flowchart: "Lưu đồ quyết định",
  callout: "Tình huống suy ngẫm",
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
    /tran-mong|lich su|dai viet|nha tran|bach dang|le trung hung|trieu dai|thoi ky|chien tranh|the chien|khang chien|su viet|trieu dinh|hoang de|phap thuoc|thuoc dia|can vuong|dan chu|cach mang/.test(
      value,
    ) || (/\bvua\b/.test(value) && !/co vua/.test(value))
  )
    return "history";

  if (
    /van hoa|di san|dong son|dan toc|phong tuc|truyen thong|khao co|dan gian/.test(
      value,
    )
  )
    return "culture";

  // Math, Logic & Strategy:
  if (/toan hoc|toan\b|logic|co vua|xac suat|thong ke|so hoc|hinh hoc|dai so|tinh toan|\bgiai do\b/.test(value))
    return "logic";

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
  if (/suc khoe|sinh hoc|y hoc|dinh duong|the thao|thao moc|thuoc|co the|benh|y te|duoc lieu|gen|di truyen|dna|te bao|tien hoa|dot bien/.test(value))
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

export function localizeLabel(label: string): string {
  if (!label) return "";
  const trimmed = label.trim();
  const lower = trimmed.toLowerCase();

  // Sinh học & Tiến hóa loài người
  if (lower === "sapiens" || lower === "homo sapiens") {
    return "Người tinh khôn (Sapiens)";
  }
  if (lower === "neanderthal" || lower === "homo neanderthalensis") {
    return "Người cổ Neanderthal";
  }
  if (lower === "erectus" || lower === "homo erectus") {
    return "Người đứng thẳng (Erectus)";
  }
  if (lower === "habilis" || lower === "homo habilis") {
    return "Người khéo léo (Habilis)";
  }
  if (lower === "australopithecus") {
    return "Vượn người cổ (Australopithecus)";
  }
  if (lower === "denisova" || lower === "denisovan") {
    return "Người cổ Denisova";
  }

  // Thuật ngữ kỹ năng & kinh tế hay bị để nguyên tiếng Anh
  if (lower === "trigger" || lower === "triggers") {
    return "Điểm kích hoạt (Trigger)";
  }
  if (lower === "input" || lower === "inputs") {
    return "Đầu vào";
  }
  if (lower === "output" || lower === "outputs") {
    return "Đầu ra";
  }
  if (lower === "flow" || lower === "flow state") {
    return "Dòng chảy tập trung (Flow)";
  }
  if (lower === "bias" || lower === "biases") {
    return "Thiên kiến tư duy";
  }

  return trimmed;
}

export function localizeVisual(visual: LessonVisual): LessonVisual {
  return {
    ...visual,
    title: visual.title ? visual.title.trim() : "",
    items: (visual.items || []).map((it) => ({
      ...it,
      label: localizeLabel(it.label),
    })),
  };
}

/**
 * Calculates rendering order for nested concentric layers.
 * Since recursive JSX renders Outer -> Inner, but standard cognitive/mental models
 * list Core (Lõi/Tâm) first, we ensure that:
 * - When items are given inside-out (items[0] = Core), outer wrapper renders items[last],
 *   and deepest center renders items[0].
 * - When items are explicitly given outside-in (items[0] = Outer shell), outer wrapper renders items[0].
 * Returns array of indices in original items to render from Outermost to Innermost.
 */
export function getNestedLayerRenderOrder(items: Array<{ label: string }>): number[] {
  if (items.length <= 1) return items.map((_, i) => i);
  const first = (items[0]?.label || "").toLowerCase();
  const last = (items[items.length - 1]?.label || "").toLowerCase();
  const coreKeywords = /(cốt\s*lõi|lõi|nhân|tâm|gốc|core|nucleus|center|trọng tâm|bản chất|hạt nhân)/i;
  const outerKeywords = /(vỏ|ngoài|bề mặt|outer|crust|periphery|ứng dụng|mở rộng|toàn cầu|tương lai)/i;

  const isInsideOut = (() => {
    if (coreKeywords.test(first) || outerKeywords.test(last)) return true;
    if (outerKeywords.test(first) || coreKeywords.test(last)) return false;
    return true; // Default inside-out (items[0] is center core)
  })();

  return isInsideOut
    ? items.map((_, i) => items.length - 1 - i)
    : items.map((_, i) => i);
}

