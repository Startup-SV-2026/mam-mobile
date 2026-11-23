import type { Course, Lesson } from "../types/course";
export interface NarrationSegment {
  title: string;
  text: string;
  language: string;
}
export interface PodcastEpisode {
  id: string;
  courseId: string;
  lessonIndex: number;
  courseTitle: string;
  title: string;
  segments: NarrationSegment[];
  estimatedMinutes: number;
}
function chunks(text: string, max = 900) {
  const result: string[] = [];
  let rest = text.trim();
  while (rest.length > max) {
    let at = rest.lastIndexOf(". ", max - 1);
    if (at < max / 3) at = rest.lastIndexOf(" ", max - 1);
    if (at < 1) at = max;
    else at += 1;
    result.push(rest.slice(0, at).trim());
    rest = rest.slice(at).trim();
  }
  if (rest) result.push(rest);
  return result;
}
export function buildEpisode(course: Course, index: number): PodcastEpisode {
  const lesson: Lesson | undefined = course.lessons[index];
  if (!lesson) throw Error("Bài học không tồn tại.");
  const segments: NarrationSegment[] = [];
  const add = (title: string, text: string, language = "vi-VN") =>
    chunks(text).forEach((part) =>
      segments.push({ title, text: part, language }),
    );
  add("Giới thiệu", `${lesson.title}. ${lesson.objective || lesson.subtitle}`);
  for (const page of lesson.pages) {
    add(page.title, `${page.title}. ${page.body}`);
    if (page.vocab) {
      add("Từ vựng", `${page.vocab.word}. ${page.vocab.example}`, "en-US");
      add("Nghĩa", page.vocab.meaning);
    }
    if (page.example)
      add("Ví dụ", `${page.example.scenario} ${page.example.explanation}`);
    if (page.selfCheck) {
      add(
        "Tự luyện",
        `${page.selfCheck.question} Hãy tạm dừng để tự trả lời trước khi nghe phần tiếp theo.`,
      );
      add("Lời giải tham khảo", page.selfCheck.answer);
    }
    if (page.commonMistake) add("Dễ nhầm", page.commonMistake);
    add("Tóm tắt", page.takeaway);
  }
  const words = segments.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
  return {
    id: `${course.id}:${index}`,
    courseId: course.id,
    lessonIndex: index,
    courseTitle: course.title,
    title: lesson.title,
    segments,
    estimatedMinutes: Math.max(1, Math.ceil(words / 150)),
  };
}
