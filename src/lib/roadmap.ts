import { totalLessons } from "./curriculum";
import type { Course, Progress } from "../types/course";
export function lessonState(
  course: Course,
  index: number,
  completed: Progress["completed"],
): "done" | "current" | "locked" {
  if (index < 0 || index >= totalLessons(course)) return "locked";
  if (completed[`${course.id}:${index}`]) return "done";
  return Array.from({ length: index }, (_, i) => i).every(
    (i) => completed[`${course.id}:${i}`],
  )
    ? "current"
    : "locked";
}
export function filterLibrary(
  courses: Course[],
  completed: Progress["completed"],
  search: string,
  category: string,
  status: string,
) {
  const query = search.trim().toLocaleLowerCase("vi");
  return courses.filter((c) => {
    const done = c.lessons.filter((_, i) => completed[`${c.id}:${i}`]).length;
    return (
      (category === "Tất cả" || c.category === category) &&
      (!query ||
        `${c.title} ${c.subtitle} ${c.category}`
          .toLocaleLowerCase("vi")
          .includes(query)) &&
      (status === "Tất cả" ||
        (status === "Chưa học" && done === 0) ||
        (status === "Đang học" && done > 0 && done < totalLessons(c)) ||
        (status === "Hoàn thành" && done === totalLessons(c)))
    );
  });
}
