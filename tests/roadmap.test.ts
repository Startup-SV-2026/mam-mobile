import { test } from "node:test";
import assert from "node:assert/strict";
import { STARTER_COURSES } from "../data/courses";
import { lessonState, filterLibrary } from "../src/lib/roadmap";
import { isLessonVisual, readProgress } from "../src/types/course";
const course = STARTER_COURSES[0];
test("roadmap opens lessons in order while preserving previously completed lessons", () => {
  assert.equal(lessonState(course, 0, {}), "current");
  assert.equal(lessonState(course, 1, {}), "locked");
  assert.equal(lessonState(course, 0, { "space:0": true }), "done");
  assert.equal(lessonState(course, 1, { "space:0": true }), "current");
  assert.equal(lessonState(course, 2, { "space:1": true }), "locked");
  assert.equal(lessonState(course, 2, { "space:2": true }), "done");
});
test("library combines category, query and actual learning status", () => {
  const completed = { "space:0": true };
  assert.equal(
    filterLibrary(STARTER_COURSES, completed, " vũ trụ ", "Tất cả", "Đang học")
      .length,
    1,
  );
  assert.equal(
    filterLibrary(STARTER_COURSES, completed, "", "Khoa học", "Chưa học")
      .length,
    0,
  );
  assert.equal(
    filterLibrary(STARTER_COURSES, completed, "", "Tất cả", "Hoàn thành")
      .length,
    0,
  );
});
test("bookmarks, notes, and course choice survive progress parsing without breaking legacy progress", () => {
  const p = readProgress({
    saved: ["space:0:0", null, 17],
    notes: { space: "Mình muốn nhớ điều này", invalid: 5 },
    selectedCourseId: "mind",
  });
  assert.deepEqual(p.saved, ["space:0:0"]);
  assert.deepEqual(p.notes, { space: "Mình muốn nhớ điều này" });
  assert.equal(p.selectedCourseId, "mind");
  assert.deepEqual(readProgress({ xp: 25 }).saved, []);
  assert.deepEqual(readProgress({}).notes, {});
});
test("structured visual validation rejects unsafe or malformed diagrams", () => {
  const visual = course.lessons[0].pages[0].visual;
  assert.ok(isLessonVisual(visual));
  assert.equal(isLessonVisual({ ...visual, kind: "html", items: [] }), false);
  assert.equal(
    isLessonVisual({ ...visual, items: [{ label: "x", detail: 45 }] }),
    false,
  );
});
