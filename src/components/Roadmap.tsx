import { MamMascot } from "./MamMascot";
import { plannedLessons, totalLessons } from "../lib/curriculum";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Course, Progress } from "../types/course";
import { Icon } from "./Icon";
import { CourseArt } from "./CourseArt";
import { Action, theme as t, ui } from "./ui";
import { lessonState } from "../lib/roadmap";

export function Roadmap({
  course,
  completed,
  onLibrary,
  onSelect,
  onNotes,
  onExplore,
  onReview,
  onPodcast,
  onTutor,
  generation,
}: {
  course: Course;
  completed: Progress["completed"];
  onLibrary: () => void;
  onSelect: (i: number) => void;
  onNotes: () => void;
  onExplore: () => void;
  onReview: () => void;
  onPodcast: () => void;
  onTutor: () => void;
  generation: { busy: boolean; error: string; retry: () => void };
}) {
  const count = course.lessons.filter(
    (_, i) => completed[`${course.id}:${i}`],
  ).length;
  const sections: {
    title: string;
    items: {
      entry: ReturnType<typeof plannedLessons>[number];
      lesson: Course["lessons"][number] | undefined;
      index: number;
    }[];
  }[] = [];
  const total = totalLessons(course);
  plannedLessons(course).forEach((entry, index) => {
    const lesson = course.lessons[index];
    const title = entry.section;
    let group = sections[sections.length - 1];
    if (!group || group.title !== title) {
      group = { title, items: [] };
      sections.push(group);
    }
    group.items.push({ entry, lesson, index });
  });
  return (
    <View style={{ gap: 24 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chọn khóa học khác"
        onPress={onLibrary}
        style={s.course}
      >
        <View style={[s.cover, { backgroundColor: course.color }]}>
          <CourseArt
            id={course.id}
            title={course.title}
            category={course.category}
            size={88}
          />
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={[ui.label, { color: t.accent, letterSpacing: 0.5 }]}>
            {course.category}
          </Text>
          <Text style={s.title}>{course.title}</Text>
          <Text style={s.meta}>
            {count}/{total} bài hoàn thành
          </Text>
        </View>
        <Icon name="chevron" color={t.accent} size={18} />
      </Pressable>
      <View style={{ gap: 8 }}>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Tiến độ khóa học"
          accessibilityValue={{
            min: 0,
            max: total,
            now: count,
          }}
          style={{
            height: 5,
            borderRadius: 4,
            backgroundColor: t.line,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${(count / total) * 100}%`,
              backgroundColor: t.primary,
              borderRadius: 4,
            }}
          />
        </View>
        <Text style={s.meta}>
          {course.curriculum
            ? `${course.curriculum.plan.chapters.length} chương · ${total} bài · Soạn từng bài`
            : `${course.lessons.reduce((n, l) => n + l.minutes, 0)} phút`}{" "}
          · {course.level}
        </Text>
      </View>
      <View style={[ui.row, { gap: 10 }]}>
        <Action
          secondary
          icon="headphones"
          style={{ flex: 1 }}
          onPress={onPodcast}
        >
          Nghe bài giảng
        </Action>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hỏi gia sư Mầm"
          onPress={onTutor}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            paddingRight: 10,
            minHeight: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: t.line,
            backgroundColor: t.surface,
          }}
        >
          <MamMascot size={56} />
          <Text style={{ color: t.accent, fontSize: 12, fontWeight: "600" }}>
            Hỏi Mầm
          </Text>
        </Pressable>
      </View>
      {sections.map((section, i) => (
        <View key={i} style={{ gap: 8 }}>
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <Text style={[s.sectionTitle, { flex: 1 }]}>{section.title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ghi chú chương"
              onPress={onNotes}
              style={{ padding: 12 }}
            >
              <Icon name="notes" size={20} color={t.muted} />
            </Pressable>
          </View>
          {section.items.map(({ entry, lesson, index }) => {
            const state = lessonState(course, index, completed);
            const preparing = !lesson && generation.busy && state === "current";
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={`${state === "done" ? "Đã học" : state === "locked" ? "Chưa mở" : "Học tiếp"}: ${entry.number} · ${entry.title}`}
                accessibilityState={{
                  disabled: state === "locked" || preparing,
                }}
                disabled={state === "locked" || preparing}
                onPress={() => (lesson ? onSelect(index) : generation.retry())}
                style={s.lesson}
              >
                <View
                  style={[
                    s.node,
                    state === "current" && s.current,
                    state === "done" && s.done,
                  ]}
                >
                  {preparing ? (
                    <MamMascot size={44} mood="thinking" />
                  ) : state === "done" ? (
                    <Icon name="check" size={20} color={t.accent} />
                  ) : state === "locked" ? (
                    <Icon name="lock" size={18} color={t.muted} />
                  ) : (
                    <Text style={{ color: t.onPrimary, fontWeight: "600" }}>
                      {entry.number}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <Text
                    style={[
                      s.lessonTitle,
                      state === "locked" && { color: t.muted },
                    ]}
                  >
                    {course.curriculum
                      ? `${entry.number} · ${entry.title}`
                      : entry.title}
                  </Text>
                  <Text style={s.meta}>
                    {state === "done"
                      ? "Đã hoàn thành"
                      : state === "locked"
                        ? "Hoàn thành bài trước để mở"
                        : preparing
                          ? "Đang soạn bài…"
                          : !lesson
                            ? generation.error
                              ? "Chưa soạn được · Nhấn để thử lại"
                              : "Soạn khi đến lượt học"
                            : `${lesson.minutes} phút · ${lesson.pages.some((p) => p.vocab) ? "Flashcard" : "Bài học"}`}
                  </Text>
                </View>
                {state === "current" && (
                  <Icon name="arrow" size={17} color={t.accent} />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
      {generation.error && (
        <Text
          accessibilityRole="alert"
          style={{ color: t.danger, lineHeight: 22 }}
        >
          {generation.error}
        </Text>
      )}
      <Action
        secondary
        icon="review"
        disabled={count < total}
        onPress={onReview}
      >
        Ôn tập khóa học
      </Action>
      <Action secondary icon="sparkle" onPress={onExplore}>
        Tạo khóa học
      </Action>
    </View>
  );
}
const s = StyleSheet.create({
  course: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 20,
    backgroundColor: t.surface,
  },
  cover: {
    height: 80,
    width: 80,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, lineHeight: 29, fontWeight: "600", color: t.ink },
  meta: { fontSize: 12, lineHeight: 19, color: t.muted },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: t.ink,
  },
  lesson: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: t.line,
  },
  node: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: t.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  current: { backgroundColor: t.primary },
  done: { backgroundColor: t.selected },
  lessonTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: t.ink,
  },
});
