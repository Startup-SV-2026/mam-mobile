import { test } from "node:test";
import assert from "node:assert/strict";
import { isLessonVisual, readProgress } from "../types/course";
import { STARTER_COURSES } from "../data/courses";
import {
  courseArtKey,
  getNestedLayerRenderOrder,
  localizeLabel,
  localizeVisual,
  visualKinds,
  visualPalette,
  visualPalettes,
} from "../lib/visual-design";
test("all eight visual formats validate, including legacy saved diagrams", () => {
  const items = [
    { label: "A", detail: "Một khái niệm" },
    { label: "B", detail: "Khái niệm liên quan" },
  ];
  for (const kind of visualKinds) {
    const visual = {
      kind,
      title: "Mối quan hệ",
      items:
        kind === "cycle"
          ? [...items, { label: "C", detail: "Quay về bước đầu" }]
          : kind === "metrics"
            ? items.map((i, n) => ({ ...i, value: String(n + 1) }))
            : items,
      ...(kind === "formula" ? { expression: "a + b = c" } : {}),
    };
    assert.ok(isLessonVisual(visual), kind);
    assert.ok(visualPalette(visual));
  }
  assert.equal(
    isLessonVisual({ kind: "formula", title: "Công thức", items }),
    false,
  );
  assert.equal(
    isLessonVisual({ kind: "metrics", title: "Con số", items }),
    false,
  );
  assert.equal(
    isLessonVisual({ kind: "steps", title: "A", tone: "javascript", items }),
    false,
  );
  assert.equal(
    isLessonVisual({
      kind: "steps",
      title: "A",
      items: [{ label: "x".repeat(101), detail: "x" }, items[0]],
    }),
    false,
  );
  const course = { ...STARTER_COURSES[0], source: "ai" };
  assert.equal(
    readProgress({ customCourses: [course] }).customCourses.length,
    1,
  );
});
test("new AI IDs use topic-aware artwork rather than all inheriting the technology cover", () => {
  assert.equal(courseArtKey("ai-123", "Python làm sạch dữ liệu CSV"), "ai");
  assert.equal(courseArtKey("ai-123", "Từ vựng tiếng Anh C1"), "lexicon");
  assert.equal(courseArtKey("ai-123", "Giao tiếp tiếng Anh A2"), "language");
  assert.equal(courseArtKey("ai-123", "Lịch sử nhà Trần"), "history");
  assert.equal(
    courseArtKey("", "Quá trình xâm lược và kháng chiến chống Pháp giai đoạn đầu", "Hệ thống hóa Lịch sử Việt Nam cận hiện đại"),
    "history",
  );
  assert.equal(courseArtKey("ai-123", "Tiết kiệm tiền mỗi tháng"), "money");
  assert.equal(courseArtKey("ai-123", "Thiên văn học"), "space");
  assert.equal(courseArtKey("ai-123", "Thiết kế đồ họa cơ bản"), "design");
  assert.equal(courseArtKey("ai-123", "Dinh dưỡng và sức khỏe sinh học"), "health");
  assert.equal(courseArtKey("ai-123", "Chiến thuật cờ vua và tư duy logic"), "logic");
  assert.equal(courseArtKey("ai-123", "Địa lý thế giới và biến đổi khí hậu"), "earth");
  assert.equal(courseArtKey("ai-123", "Bản sắc văn hóa và di sản Đông Sơn"), "culture");
  assert.equal(courseArtKey("ai-123", "Vật lý lượng tử và khoa học khám phá"), "science");
  assert.equal(courseArtKey("ai-123", "Luyện thi SAT nâng cao"), "exam");
  assert.equal(courseArtKey("ai-123", "Văn học cổ điển và triết học"), "literature");
  assert.equal(courseArtKey("mind"), "mind");
  assert.equal(courseArtKey("ai"), "ai");
});
test("visual accents retain readable contrast for white labels", () => {
  const lum = (hex: string) => {
    const rgb = hex
      .slice(1)
      .match(/../g)!
      .map((s) => parseInt(s, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  for (const p of Object.values(visualPalettes))
    assert.ok(1.05 / (lum(p.strong) + 0.05) >= 4.5, p.strong);
});

test("localizeLabel translates bare Latin and English terms to friendly Vietnamese", () => {
  assert.equal(localizeLabel("Sapiens"), "Người tinh khôn (Sapiens)");
  assert.equal(localizeLabel("Homo sapiens"), "Người tinh khôn (Sapiens)");
  assert.equal(localizeLabel("Neanderthal"), "Người cổ Neanderthal");
  assert.equal(localizeLabel("Erectus"), "Người đứng thẳng (Erectus)");
  assert.equal(localizeLabel("Trigger"), "Điểm kích hoạt (Trigger)");
  assert.equal(localizeLabel("Inputs"), "Đầu vào");
  assert.equal(localizeLabel("Outputs"), "Đầu ra");
});

test("getNestedLayerRenderOrder places core at innermost center and outer shell at outermost container", () => {
  // 1. Inside-Out order: item[0] is Core ("Cốt lõi"), item[last] is Outer ("Tương lai")
  // Outermost container must render index 2 ("Tương lai"), inner center must render index 0 ("Cốt lõi")
  const insideOutItems = [
    { label: "Cốt lõi" },
    { label: "Mở rộng" },
    { label: "Tương lai" },
  ];
  assert.deepEqual(getNestedLayerRenderOrder(insideOutItems), [2, 1, 0]);

  // 2. Outside-In order: item[0] is Outer ("Vỏ Trái Đất"), item[last] is Core ("Lõi Trái Đất")
  // Outermost container renders index 0 ("Vỏ Trái Đất"), inner center renders index 2 ("Lõi Trái Đất")
  const outsideInItems = [
    { label: "Vỏ Trái Đất (Crust)" },
    { label: "Lớp Manti" },
    { label: "Lõi Trái Đất (Core)" },
  ];
  assert.deepEqual(getNestedLayerRenderOrder(outsideInItems), [0, 1, 2]);

  // 3. Default order when no explicit outer keyword: defaults to Inside-Out (item[0] is center core)
  const defaultItems = [
    { label: "Tâm điểm A" },
    { label: "Lớp B" },
  ];
  assert.deepEqual(getNestedLayerRenderOrder(defaultItems), [1, 0]);
});

