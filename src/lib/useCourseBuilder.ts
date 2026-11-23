import { useEffect, useRef, useState } from "react";
import type { Course } from "../types/course";
import { isCourseContent } from "../types/course";
import { askCourseChat } from "./course-chat-api";
import { requestPlan, requestLesson } from "./incremental-api";
import type { Curriculum } from "./curriculum";
import {
  isCourseBrief,
  type CourseBrief,
  type CourseChatMessage,
  type CourseChatReply,
} from "./course-chat";
export type BuilderTurn = CourseChatMessage & { reply?: CourseChatReply };
export function useCourseBuilder(onCreated: (course: Course) => void) {
  const [turns, setTurns] = useState<BuilderTurn[]>([]),
    [input, setInput] = useState("");
  const [brief, setBrief] = useState<CourseBrief | null>(null),
    [busy, setBusy] = useState(false),
    [creating, setCreating] = useState(false),
    [error, setError] = useState("");
  const [creationStep, setCreationStep] = useState<"outline" | "lesson">(
    "outline",
  );
  const controller = useRef<AbortController | null>(null),
    generation = useRef(0),
    locked = useRef(false);
  const pendingPlan = useRef<{ key: string; curriculum: Curriculum } | null>(
    null,
  );
  const pending = useRef<{
    topic: string;
    messages: CourseChatMessage[];
  } | null>(null);
  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
    },
    [],
  );
  function cancel() {
    generation.current++;
    controller.current?.abort();
    controller.current = null;
    locked.current = false;
    setBusy(false);
    setCreating(false);
    setCreationStep("outline");
  }
  function reset() {
    cancel();
    setTurns([]);
    setInput("");
    setBrief(null);
    setError("");
    pending.current = null;
    pendingPlan.current = null;
  }
  async function query(
    topic: string,
    messages: CourseChatMessage[],
    baseTurns: BuilderTurn[],
  ) {
    locked.current = true;
    setBusy(true);
    setError("");
    setBrief(null);
    pending.current = { topic, messages };
    const token = ++generation.current,
      c = new AbortController();
    controller.current = c;
    const timer = setTimeout(() => c.abort(), 50000);
    try {
      const reply = await askCourseChat(topic, messages, c.signal);
      if (token !== generation.current) return;
      setTurns([
        ...baseTurns,
        { role: "assistant", content: reply.message, reply },
      ]);
      if (reply.kind === "ready") setBrief(reply.brief);
      pending.current = null;
    } catch (e) {
      if (token === generation.current)
        setError(
          e instanceof Error && e.name === "AbortError"
            ? "AI phản hồi quá lâu. Hãy thử lại."
            : e instanceof Error
              ? e.message
              : "Chưa kết nối được AI.",
        );
    } finally {
      clearTimeout(timer);
      if (token === generation.current) {
        setBusy(false);
        locked.current = false;
        controller.current = null;
      }
    }
  }
  async function submit(value = input) {
    const clean = value.trim();
    if (locked.current || brief || clean.length < 1 || clean.length > 500)
      return;
    const next: BuilderTurn[] = [...turns, { role: "user", content: clean }];
    setTurns(next);
    setInput("");
    await query(
      next[0].content,
      next.slice(1).map(({ role, content }) => ({ role, content })),
      next,
    );
  }
  async function retry() {
    if (locked.current || !pending.current) return;
    await query(pending.current.topic, pending.current.messages, turns);
  }
  function edit(at: number) {
    if (locked.current || turns[at]?.role !== "user") return;
    setInput(turns[at].content);
    setTurns(turns.slice(0, at));
    setBrief(null);
    setError("");
    pending.current = null;
  }
  async function create() {
    if (locked.current || !isCourseBrief(brief)) return;
    const snapshot = { ...brief };
    locked.current = true;
    setCreating(true);
    setCreationStep("outline");
    setError("");
    const token = ++generation.current,
      c = new AbortController();
    controller.current = c;
    const timer = setTimeout(() => c.abort(), 90000);
    try {
      const conversation = turns
        .slice(1, -1)
        .map(({ role, content }) => ({ role, content }));
      const planKey = JSON.stringify({ brief: snapshot, conversation });
      let curriculum: Curriculum;
      if (pendingPlan.current?.key === planKey)
        curriculum = pendingPlan.current.curriculum;
      else {
        const plan = await requestPlan(snapshot, conversation, c.signal);
        if (token !== generation.current) return;
        curriculum = { version: 1, brief: snapshot, conversation, plan };
        pendingPlan.current = { key: planKey, curriculum };
      }
      setCreationStep("lesson");
      const lesson = await requestLesson(curriculum, 0, [], c.signal);
      if (token !== generation.current) return;
      const content = {
        title: curriculum.plan.title,
        subtitle: curriculum.plan.subtitle,
        curriculum,
        lessons: [lesson],
      };
      if (!isCourseContent(content))
        throw Error("Nội dung khóa học chưa hợp lệ. Hãy thử lại.");
      const course: Course = {
        ...content,
        id: `ai-${Date.now()}`,
        source: "ai",
        category: "Cá nhân hoá",
        color: "#EAF4EC",
        accent: "#27843D",
        emoji: "📘",
        level: snapshot.level,
      };
      reset();
      onCreated(course);
    } catch (e) {
      if (token === generation.current)
        setError(
          e instanceof Error && e.name === "AbortError"
            ? "Tạo khóa học quá lâu. Bản tóm tắt vẫn được giữ để thử lại."
            : e instanceof Error
              ? e.message
              : "Chưa tạo được khóa học.",
        );
    } finally {
      clearTimeout(timer);
      if (token === generation.current) {
        setCreating(false);
        locked.current = false;
        controller.current = null;
      }
    }
  }
  function stop() {
    cancel();
    setError("Đã dừng yêu cầu. Bạn có thể thử lại hoặc sửa câu trả lời.");
  }
  return {
    turns,
    input,
    setInput,
    brief,
    setBrief,
    busy,
    creating,
    creationStep,
    error,
    submit,
    retry,
    edit,
    reset,
    create,
    stop,
    canRetry: !!pending.current,
  };
}
export type CourseBuilderController = ReturnType<typeof useCourseBuilder>;
