import { test } from "node:test";
import assert from "node:assert/strict";
import { STARTER_COURSES } from "../../shared/data/courses";
import { isCourseContent, readProgress } from "../../shared/types/course";
import { createApp } from "../src/index";
import { getAIConfig } from "../src/ai";
import { IllustrationStore, imageConfig } from "../src/illustrations";
const deepLesson = STARTER_COURSES.find((c) => c.id === "ai")!.lessons[0];
test("rich lessons preserve practice and worked examples through persistence while legacy courses remain readable", () => {
  const course = {
    ...STARTER_COURSES[0],
    source: "ai" as const,
    lessons: [deepLesson],
  };
  assert.ok(isCourseContent(course));
  assert.deepEqual(
    readProgress({ customCourses: [course] }).customCourses[0].lessons[0]
      .pages[0].selfCheck,
    deepLesson.pages[0].selfCheck,
  );
  const old = {
    ...course,
    lessons: [
      {
        ...deepLesson,
        objective: undefined,
        pages: deepLesson.pages.map((p) => ({
          ...p,
          example: undefined,
          selfCheck: undefined,
          commonMistake: undefined,
        })),
      },
    ],
  };
  assert.ok(isCourseContent(old));
});
test("malformed optional learning blocks cannot enter stored lessons", () => {
  const course = { ...STARTER_COURSES[0], lessons: [deepLesson] };
  for (const change of [
    { example: { scenario: "x" } },
    { selfCheck: { question: "x", hint: "", answer: "x" } },
    { commonMistake: 42 },
    { example: { scenario: "x", explanation: "x".repeat(3001) } },
  ]) {
    assert.equal(
      isCourseContent({
        ...course,
        lessons: [
          { ...deepLesson, pages: [{ ...deepLesson.pages[0], ...change }] },
        ],
      }),
      false,
    );
  }
});
test("course creation rejects shallow output, requires learning blocks, and estimates reading and practice time", async () => {
  let shallow = true;
  const fixture = {
    title: "AI cơ bản",
    subtitle: "Phân biệt học máy với quy tắc",
    lessons: [0, 1, 2].map((i) => ({ ...deepLesson, title: `Bài ${i + 1}` })),
  };
  const { server } = createApp({
    config: { ...getAIConfig({}), apiKey: "test-key" },
    images: new IllustrationStore({ ...imageConfig({}), enabled: false }),
    completeProvider: async (_config, messages, format) => {
      assert.equal(
        (format as { maxOutputTokens: number }).maxOutputTokens,
        12288,
      );
      assert.ok(messages[0].content.includes("selfCheck"));
      assert.equal(
        JSON.parse(messages[1].content).goal,
        "Hiểu cách mô hình học từ dữ liệu",
      );
      return JSON.stringify(
        shallow
          ? {
              ...fixture,
              lessons: fixture.lessons.map((l) => ({
                ...l,
                pages: l.pages.map((p) => ({ ...p, selfCheck: undefined })),
              })),
            }
          : fixture,
      );
    },
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  try {
    const { port } = server.address() as { port: number };
    const post = () =>
      fetch(`http://127.0.0.1:${port}/api/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "AI",
          level: "Người mới",
          goal: "Hiểu cách mô hình học từ dữ liệu",
        }),
      });
    assert.equal((await post()).status, 502);
    shallow = false;
    const r = await post();
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(isCourseContent(body.course));
    assert.ok(
      body.course.lessons.every(
        (l: any) =>
          l.minutes >= 5 &&
          l.minutes <= 15 &&
          l.objective &&
          l.pages.every(
            (p: any) => p.selfCheck && p.example && p.commonMistake,
          ),
      ),
    );
  } finally {
    await new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r())));
  }
});
