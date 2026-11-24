import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Course, Lesson } from "../types/course";
import { ui, theme as t, Action } from "../components/ui/ui";
import { plannedLessons, totalLessons } from "../lib/curriculum";
import { MascotLoading } from "../components/mascot/MascotLoading";
import { MamMascot } from "../components/mascot/MamMascot";

interface LessonDoneProps {
  course: Course;
  lessonIndex: number;
  activeLesson: Lesson;
  earnedXp: number;
  generation: {
    busy: boolean;
    error: string | null;
    retry: () => void;
  };
  onNextLesson: (index: number) => void;
  onHome: () => void;
}

export function LessonDone({
  course,
  lessonIndex,
  activeLesson,
  earnedXp,
  generation,
  onNextLesson,
  onHome,
}: LessonDoneProps) {
  const nextLessonAvailable = !!course.lessons[lessonIndex + 1];
  const nextLessonInfo = plannedLessons(course)[lessonIndex + 1];

  return (
    <View style={styles.container}>
      {generation.busy ? (
        <MascotLoading
          label={`Đang soạn bài ${nextLessonInfo?.number || "tiếp theo"}…`}
          size={130}
        />
      ) : (
        <MamMascot size={130} mood="happy" interactive />
      )}
      <Text style={[ui.title, { textAlign: "center" }]}>
        Đã hoàn thành bài học
      </Text>
      <Text style={[ui.body, { textAlign: "center" }]}>
        {activeLesson.title}
      </Text>
      <Text style={{ fontSize: 27, fontWeight: "700", color: t.ink }}>
        {earnedXp ? `+${earnedXp} XP` : "Đã ôn lại"}
      </Text>

      {lessonIndex + 1 < totalLessons(course) && (
        <>
          {generation.error && (
            <Text
              accessibilityRole="alert"
              style={{ color: t.danger, lineHeight: 22 }}
            >
              {generation.error}
            </Text>
          )}
          <Action
            style={{ width: "100%" }}
            disabled={!nextLessonAvailable && generation.busy}
            onPress={() =>
              nextLessonAvailable
                ? onNextLesson(lessonIndex + 1)
                : generation.retry()
            }
          >
            {nextLessonAvailable
              ? "HỌC BÀI TIẾP THEO"
              : generation.busy
                ? `ĐANG SOẠN BÀI ${nextLessonInfo?.number ?? ""}…`
                : generation.error
                  ? "THỬ LẠI TẠO BÀI TIẾP THEO"
                  : "TẠO BÀI TIẾP THEO"}
          </Action>
        </>
      )}

      <Action secondary style={{ width: "100%" }} onPress={onHome}>
        VỀ LỘ TRÌNH
      </Action>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
  },
});
