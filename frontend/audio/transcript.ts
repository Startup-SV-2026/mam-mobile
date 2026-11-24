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
function cleanSpeechText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[*_~#]/g, "")
    .replace(/\.\s*\n+/g, ". ")
    .replace(/\s*\n+\s*/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
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

  const introLead =
    index === 0
      ? `Chào bạn, mừng bạn đến với Mầm Podcast! Hôm nay, chúng ta cùng lắng nghe bài học: ${cleanSpeechText(lesson.title)}.`
      : `Chào bạn, chúng ta lại gặp nhau trong bài học tiếp theo: ${cleanSpeechText(lesson.title)}.`;
  const objective = cleanSpeechText(lesson.objective || lesson.subtitle || "");
  const introText = objective
    ? `${introLead} Trong ít phút tới, chúng mình sẽ cùng khám phá về: ${objective}. Hãy chọn một góc thật thoải mái và cùng lắng nghe nhé!`
    : `${introLead} Hãy cùng thư giãn và bắt đầu nhé!`;
  add("Giới thiệu", introText);

  for (const page of lesson.pages) {
    const pageBody = cleanSpeechText(page.body);
    add(page.title, `${page.title}. ${pageBody}`);
    if (page.vocab) {
      add("Từ vựng", `${page.vocab.word}. ${page.vocab.example}`, "en-US");
      add(
        "Nghĩa",
        `Trong tiếng Việt, từ này có nghĩa là: ${cleanSpeechText(page.vocab.meaning)}.`,
      );
    }
    if (page.example) {
      const scenario = cleanSpeechText(page.example.scenario);
      const explanation = cleanSpeechText(page.example.explanation);
      add(
        "Ví dụ",
        `Để dễ hình dung hơn trong đời sống, hãy cùng mình lắng nghe một câu chuyện nhỏ nhé. ${scenario} ${explanation}`,
      );
    }
    if (page.selfCheck) {
      const question = cleanSpeechText(page.selfCheck.question);
      const answer = cleanSpeechText(page.selfCheck.answer);
      add(
        "Tự luyện",
        `Bây giờ, mình có một câu hỏi nhỏ dành riêng cho bạn để cùng ngẫm lại nhé: ${question} Bạn hãy tạm dừng vài giây để tự suy ngẫm trước khi nghe phần giải thích nhé.`,
      );
      add(
        "Lời giải tham khảo",
        `Và câu trả lời là: ${answer}. Bạn có cùng suy nghĩ như vậy không?`,
      );
    }
    if (page.commonMistake) {
      const mistake = cleanSpeechText(page.commonMistake);
      add(
        "Dễ nhầm",
        `À, có một điểm rất thú vị mà nhiều người hay nhầm lẫn: ${mistake}. Bạn nhớ lưu ý điều này nhé!`,
      );
    }
    if (page.takeaway) {
      add(
        "Tóm tắt",
        `Điểm cốt lõi đọng lại qua phần này là: ${cleanSpeechText(page.takeaway)}.`,
      );
    }
  }

  add(
    "Lời kết",
    `Vậy là chúng ta vừa hoàn thành bài học ${cleanSpeechText(lesson.title)}. Cảm ơn bạn đã đồng hành và lắng nghe Mầm Podcast hôm nay. Chúc bạn một ngày tràn đầy năng lượng và hẹn gặp lại bạn trong những bài học tiếp theo nhé!`,
  );

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
