import { fetchBackend } from "./backend-fetch";
import {
  isCoursePlan,
  flattenPlan,
  type Curriculum,
  type PreviousLesson,
} from "../lib/curriculum";
import { isCourseContent } from "../types/course";
import type { CourseBrief, CourseChatMessage } from "../lib/course-chat";
async function post(
  route: string,
  body: unknown,
  signal: AbortSignal,
  request: typeof fetch,
  base: string,
) {
  if (!base) throw Error("Chưa kết nối máy chủ AI.");
  const r = await fetchBackend(
    `${base.replace(/\/$/, "")}${route}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    },
    request,
  );
  if (r.status === 404)
    throw Error("Khởi động lại máy chủ Mầm để hỗ trợ tạo bài theo tiến độ.");
  const data = await r.json();
  if (!r.ok) throw Error(data?.error || "Chưa tạo được nội dung. Hãy thử lại.");
  return data;
}
export async function requestPlan(
  brief: CourseBrief,
  conversation: CourseChatMessage[],
  signal: AbortSignal,
  request: typeof fetch = fetch,
  base = process.env.EXPO_PUBLIC_API_URL || "",
) {
  const data = await post(
    "/api/course-plan",
    { brief, conversation },
    signal,
    request,
    base,
  );
  if (!isCoursePlan(data?.plan))
    throw Error("Đề cương chưa hợp lệ. Hãy thử lại.");
  return data.plan;
}
export async function requestLesson(
  curriculum: Curriculum,
  index: number,
  previousLessons: PreviousLesson[],
  signal: AbortSignal,
  request: typeof fetch = fetch,
  base = process.env.EXPO_PUBLIC_API_URL || "",
) {
  const data = await post(
    "/api/lesson",
    { curriculum, index, previousLessons },
    signal,
    request,
    base,
  );
  if (
    !isCourseContent({
      title: "Bài học",
      subtitle: "Bài học",
      lessons: [data?.lesson],
    }) ||
    data.lesson.title !== flattenPlan(curriculum.plan)[index]?.title
  )
    throw Error("Bài học chưa hợp lệ. Hãy thử lại.");
  return data.lesson as import("../types/course").Lesson;
}
