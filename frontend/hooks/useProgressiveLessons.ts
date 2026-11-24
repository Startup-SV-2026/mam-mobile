import { useEffect, useRef, useState } from "react";
import type { Course, Lesson } from "../types/course";
import { lessonContext, nextLessonIndex } from "../lib/curriculum";
import { requestLesson } from "../services/incremental-api";
export function useProgressiveLessons(
  course: Course,
  completed: Record<string, boolean>,
  enabled: boolean,
  onReady: (courseId: string, index: number, lesson: Lesson) => void,
) {
  const [jobs, setJobs] = useState<
    Record<string, { busy: boolean; error: string }>
  >({});
  const attempted = useRef(new Set<string>()),
    requests = useRef(new Map<string, AbortController>()),
    alive = useRef(true),
    callback = useRef(onReady);
  callback.current = onReady;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      for (const c of requests.current.values()) c.abort();
    };
  }, []);
  async function ensure(target = course, retry = false) {
    const index = nextLessonIndex(target, completed, target.id);
    if (index === null || !target.curriculum) return;
    const key = `${target.id}:${index}`;
    if (requests.current.has(key) || (!retry && attempted.current.has(key)))
      return;
    attempted.current.add(key);
    const c = new AbortController();
    requests.current.set(key, c);
    setJobs((old) => ({ ...old, [key]: { busy: true, error: "" } }));
    const timer = setTimeout(() => c.abort(), 90000);
    try {
      const lesson = await requestLesson(
        target.curriculum,
        index,
        lessonContext(target.lessons),
        c.signal,
      );
      if (!alive.current) return;
      callback.current(target.id, index, lesson);
      setJobs((old) => ({ ...old, [key]: { busy: false, error: "" } }));
    } catch (e) {
      if (alive.current)
        setJobs((old) => ({
          ...old,
          [key]: {
            busy: false,
            error:
              e instanceof Error && e.name === "AbortError"
                ? "Soạn bài quá lâu. Hãy thử lại."
                : e instanceof Error
                  ? e.message
                  : "Chưa soạn được bài tiếp theo.",
          },
        }));
    } finally {
      clearTimeout(timer);
      requests.current.delete(key);
    }
  }
  useEffect(() => {
    if (enabled) void ensure();
  }, [course, completed, enabled]);
  const key = `${course.id}:${course.lessons.length}`;
  return {
    busy: jobs[key]?.busy || false,
    error: jobs[key]?.error || "",
    retry: () => void ensure(course, true),
  };
}
