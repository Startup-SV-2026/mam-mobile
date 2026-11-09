import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Course, Progress } from "../types/course";
import { Icon } from "./Icon";
import { CourseArt } from "./CourseArt";
import { Action, Sprout, theme as t, ui } from "./ui";
import { lessonState } from "../lib/roadmap";
export function Roadmap({
  course,
  completed,
  onLibrary,
  onSelect,
  onNotes,
  onExplore,
  onReview,
}: {
  course: Course;
  completed: Progress["completed"];
  onLibrary: () => void;
  onSelect: (i: number) => void;
  onNotes: () => void;
  onExplore: () => void;
  onReview: () => void;
}) {
  const count = course.lessons.filter(
    (_, i) => completed[`${course.id}:${i}`],
  ).length;
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chọn khóa học"
        onPress={onLibrary}
        style={s.course}
      >
        <View style={[s.cover, { backgroundColor: course.color }]}>
          <CourseArt id={course.id} size={92} />
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={s.courseTitle}>
            {course.title} <Text style={{ color: t.muted }}>⌄</Text>
          </Text>
          <Text style={ui.body}>
            {course.category} · {course.lessons.length} bài
          </Text>
        </View>
      </Pressable>
      <View style={s.section}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: t.ink }}>
            1. {course.subtitle}
          </Text>
          <Text style={[ui.body, { marginTop: 6 }]}>
            {count}/{course.lessons.length} bài hoàn thành
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ghi chú khóa học"
          onPress={onNotes}
          style={s.sectionNotes}
        >
          <Icon name="notes" />
        </Pressable>
      </View>
      <View style={s.path}>
        {course.lessons.map((lesson, i) => {
          const state = lessonState(course, i, completed);
          const shift = [0, 28, 55, 28][i % 4];
          return (
            <View key={i} style={[s.nodeRow, { paddingLeft: 32 + shift }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${state === "done" ? "Đã học" : state === "locked" ? "Chưa mở" : "Học tiếp"}: ${lesson.title}`}
                accessibilityState={{ disabled: state === "locked" }}
                disabled={state === "locked"}
                onPress={() => onSelect(i)}
                style={[
                  s.node,
                  state === "locked" ? s.locked : s.open,
                  state === "done" && s.done,
                ]}
              >
                {state === "current" ? (
                  <Sprout size={37} />
                ) : (
                  <Icon
                    name={state === "done" ? "check" : "lock"}
                    size={26}
                    color={state === "locked" ? "#B7B4A9" : "#439AC2"}
                  />
                )}
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    s.lessonTitle,
                    state === "locked" && { color: "#847E72" },
                  ]}
                >
                  {lesson.title}
                </Text>
                <Text style={[ui.body, { fontSize: 12, marginTop: 4 }]}>
                  {state === "done"
                    ? "Đã hoàn thành"
                    : state === "locked"
                      ? "Hoàn thành bài trước để mở"
                      : `${lesson.minutes} phút · Tiếp tục từ đây`}
                </Text>
              </View>
            </View>
          );
        })}
        <View style={[s.nodeRow, { paddingLeft: 60 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ôn tập khóa học"
            disabled={count < course.lessons.length}
            onPress={onReview}
            style={[s.node, count < course.lessons.length ? s.locked : s.open]}
          >
            <Icon
              name={count < course.lessons.length ? "lock" : "review"}
              color={count < course.lessons.length ? "#B7B4A9" : t.ink}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.lessonTitle}>Ôn tập hành trình</Text>
            <Text style={[ui.body, { fontSize: 12, marginTop: 4 }]}>
              {count < course.lessons.length
                ? `Hoàn thành ${course.lessons.length - count} bài còn lại`
                : "Đến vườn kiến thức của bạn"}
            </Text>
          </View>
        </View>
      </View>
      <View style={[ui.row, { marginTop: 15, marginBottom: 16 }]}>
        <View style={{ height: 1, backgroundColor: t.line, flex: 1 }} />
        <Text style={[ui.label, { fontSize: 10 }]}>KHÁM PHÁ TIẾP</Text>
        <View style={{ height: 1, backgroundColor: t.line, flex: 1 }} />
      </View>
      <Action secondary icon="sparkle" onPress={onExplore}>
        HÔM NAY HỌC ĐIỀU GÌ?
      </Action>
    </>
  );
}
const s = StyleSheet.create({
  course: {
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 27,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 8,
    marginBottom: 22,
  },
  cover: {
    width: 71,
    height: 71,
    borderRadius: 19,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: t.line,
  },
  courseTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "600",
    color: t.ink,
  },
  section: {
    borderWidth: 1,
    borderColor: t.line,
    borderBottomWidth: 3,
    borderRadius: 19,
    paddingLeft: 20,
    minHeight: 83,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionNotes: {
    padding: 20,
    alignSelf: "stretch",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: t.line,
    marginLeft: 12,
  },
  path: { paddingTop: 24, paddingBottom: 15 },
  nodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 17,
    minHeight: 118,
  },
  node: {
    width: 62,
    height: 66,
    borderRadius: 34,
    borderWidth: 2,
    borderBottomWidth: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  open: { borderColor: "#97D7F4", backgroundColor: t.bg },
  done: { backgroundColor: "#B5E4FA" },
  locked: { borderColor: "#D9D7CC", backgroundColor: "#F3F1E7" },
  lessonTitle: { fontSize: 17, lineHeight: 24, color: t.ink },
});
