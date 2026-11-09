import type { Course, Progress } from "../types/course";
export function lessonState(
  course: Course,
  index: number,
  completed: Progress["completed"],
): "done" | "current" | "locked" {
  if (completed[`${course.id}:${index}`]) return "done";
  return course.lessons
    .slice(0, index)
    .every((_, i) => completed[`${course.id}:${i}`])
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
        (status === "Đang học" && done > 0 && done < c.lessons.length) ||
        (status === "Hoàn thành" && done === c.lessons.length))
    );
  });
}
