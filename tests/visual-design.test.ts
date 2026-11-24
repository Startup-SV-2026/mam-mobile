import { test } from "node:test";
import assert from "node:assert/strict";
import { isLessonVisual, readProgress } from "../src/types/course";
import { STARTER_COURSES } from "../data/courses";
import {
  courseArtKey,
  visualKinds,
  visualPalette,
  visualPalettes,
} from "../src/lib/visual-design";
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
