import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { IncrementalCourses } from "../server/incremental-courses";
import { createApp } from "../server/index";
import { imageConfig, IllustrationStore } from "../server/illustrations";
import { STARTER_COURSES } from "../data/courses";
import {
  readProgress,
  isCourseContent,
  type Course,
} from "../src/types/course";
import {
  flattenPlan,
  totalLessons,
  nextLessonIndex,
  lessonContext,
  isCoursePlan,
  type Curriculum,
} from "../src/lib/curriculum";
import { lessonState, filterLibrary } from "../src/lib/roadmap";
const brief = {
  topic: "Python",
  goal: "Phân tích dữ liệu CSV",
  level: "Đã biết một chút" as const,
  experience: "Biết biến và vòng lặp",
  focus: "Làm sạch dữ liệu",
  format: "Ví dụ dữ liệu và bài tự luyện",
  pace: "20 phút/ngày",
};
const plan = {
  title: "Phân tích dữ liệu CSV",
  subtitle: "Đọc và xử lý dữ liệu",
  chapters: [
    {
      title: "Đọc dữ liệu",
      lessons: [
        { title: "Nạp dữ liệu CSV", objective: "Đọc dữ liệu thành bảng" },
        { title: "Kiểm tra kiểu dữ liệu", objective: "Nhận diện kiểu dữ liệu" },
      ],
    },
    {
      title: "Làm sạch dữ liệu",
      lessons: [
        { title: "Xử lý ô trống", objective: "Chọn cách xử lý dữ liệu thiếu" },
        { title: "Tóm tắt dữ liệu", objective: "Tính một thống kê phù hợp" },
      ],
    },
  ],
};
const curriculum: Curriculum = { version: 1, brief, conversation: [], plan };
const lesson = {
  ...STARTER_COURSES.find((c) => c.id === "ai")!.lessons[0],
  illustrationPlan: {
    scene: "Một bảng dữ liệu và kính lúp",
    caption: "Minh họa",
    alt: "Bảng dữ liệu",
  },
};
const first = {
  ...lesson,
  title: plan.chapters[0].lessons[0].title,
  objective: plan.chapters[0].lessons[0].objective,
  section: "Chương 1 · Đọc dữ liệu",
};
const course: Course = {
  ...STARTER_COURSES[0],
  id: "incremental",
  source: "ai",
  emoji: "",
  title: plan.title,
  subtitle: plan.subtitle,
  lessons: [first],
  curriculum,
};
test("outline numbering and progress count planned lessons without generating placeholders", () => {
  assert.ok(isCoursePlan(plan));
  assert.deepEqual(
    flattenPlan(plan).map((l) => l.number),
    ["1.1", "1.2", "2.1", "2.2"],
  );
  assert.equal(totalLessons(course), 4);
  assert.equal(course.lessons.length, 1);
  assert.equal(nextLessonIndex(course, {}, course.id), null);
  assert.equal(lessonState(course, 1, {}), "locked");
  const completed = { "incremental:0": true };
  assert.equal(nextLessonIndex(course, completed, course.id), 1);
  assert.equal(lessonState(course, 1, completed), "current");
  assert.equal(lessonState(course, 2, completed), "locked");
  const withSecond = {
    ...course,
    lessons: [first, { ...lesson, title: plan.chapters[0].lessons[1].title }],
  };
  assert.equal(nextLessonIndex(withSecond, completed, course.id), null);
  assert.equal(
    filterLibrary([course], completed, "", "Tất cả", "Hoàn thành").length,
    0,
  );
  assert.equal(
    filterLibrary([course], completed, "", "Tất cả", "Đang học").length,
    1,
  );
});
test("partial courses and confirmed brief survive persistence while legacy courses remain unchanged", () => {
  assert.ok(isCourseContent(course));
  const restored = readProgress(
    JSON.parse(
      JSON.stringify({
        customCourses: [course],
        completed: { "incremental:0": true },
      }),
    ),
  );
  assert.equal(restored.customCourses.length, 1);
  assert.deepEqual(restored.customCourses[0].curriculum, curriculum);
  assert.equal(restored.customCourses[0].lessons.length, 1);
  assert.equal(
    isCourseContent({
      ...course,
      lessons: [{ ...first, title: "wrong slot" }],
    }),
    false,
  );
  assert.equal(
    isCourseContent({
      ...course,
      curriculum: { ...curriculum, plan: { chapters: [] } },
    }),
    false,
  );
  assert.equal(
    totalLessons(STARTER_COURSES[0]),
    STARTER_COURSES[0].lessons.length,
  );
});
test("service writes only the requested lesson, deduplicates requests and reuses disk cache", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "mam-course-"));
  let planCalls = 0,
    lessonCalls = 0;
  const complete = async (messages: { role: string; content: string }[]) => {
    const input = JSON.parse(messages[1].content);
    if (!input.currentLesson) {
      planCalls++;
      return JSON.stringify(plan);
    }
    lessonCalls++;
    assert.equal(input.currentLesson.number, "1.1");
    assert.deepEqual(input.previousLessons, []);
    assert.deepEqual(input.learnerBrief, brief);
    return JSON.stringify(lesson);
  };
  try {
    const service = new IncrementalCourses(complete, dir, "test");
    assert.deepEqual(await service.plan(brief, []), plan);
    assert.equal(lessonCalls, 0);
    const [a, b] = await Promise.all([
      service.lesson(curriculum, 0, []),
      service.lesson(curriculum, 0, []),
    ]);
    assert.deepEqual(a, b);
    assert.equal(a.title, first.title);
    assert.equal(lessonCalls, 1);
    const reloaded = new IncrementalCourses(
      async () => {
        throw Error("must reuse cache");
      },
      dir,
      "test",
    );
    assert.deepEqual(await reloaded.lesson(curriculum, 0, []), a);
    assert.deepEqual(await reloaded.plan(brief, []), plan);
    assert.equal(planCalls, 1);
  } finally {
    await rm(dir, { recursive: true, force: true, maxRetries: 5 });
  }
});
test("lesson 1.2 requires completion context and receives only prior learning", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "mam-course-"));
  let called = 0;
  try {
    const service = new IncrementalCourses(
      async (messages) => {
        called++;
        const input = JSON.parse(messages[1].content);
        assert.equal(input.currentLesson.number, "1.2");
        assert.deepEqual(input.previousLessons, lessonContext([first]));
        assert.equal(input.outline.chapters.length, 2);
        return JSON.stringify(lesson);
      },
      dir,
      "test",
    );
    await assert.rejects(service.lesson(curriculum, 1, []), /hoàn thành/);
    assert.equal(called, 0);
    const next = await service.lesson(curriculum, 1, lessonContext([first]));
    assert.equal(next.title, plan.chapters[0].lessons[1].title);
    assert.equal(called, 1);
  } finally {
    await rm(dir, { recursive: true, force: true, maxRetries: 5 });
  }
});
test("incremental endpoints reject skipping and malformed content without caching failed lessons", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "mam-course-http-"));
  let calls = 0,
    valid = false;
  const app = createApp({
    config: { provider: "gemini", model: "test", apiKey: "test" },
    courseCacheDir: dir,
    images: new IllustrationStore({ ...imageConfig({}), enabled: false }),
    completeProvider: async () => {
      calls++;
      return JSON.stringify(valid ? lesson : { ...lesson, pages: [] });
    },
  });
  await new Promise<void>((r) => app.server.listen(0, "127.0.0.1", r));
  const address = app.server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const post = (index: number, previousLessons: unknown[] = []) =>
    fetch(base + "/api/lesson", {
      method: "POST",
      body: JSON.stringify({ curriculum, index, previousLessons }),
    });
  try {
    assert.equal((await post(1)).status, 400);
    assert.equal(calls, 0);
    assert.equal((await post(0)).status, 502);
    valid = true;
    const r = await post(0);
    assert.equal(r.status, 200);
    assert.equal((await r.json()).lesson.title, first.title);
    assert.equal(calls, 2);
    assert.equal((await post(0)).status, 200);
    assert.equal(calls, 2);
    assert.equal((await post(99)).status, 400);
  } finally {
    await new Promise<void>((r) => app.server.close(() => r()));
    await rm(dir, { recursive: true, force: true, maxRetries: 5 });
  }
});
