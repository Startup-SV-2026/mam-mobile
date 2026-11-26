import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Course, Lesson } from "../types/course";
import { theme as t } from "../components/ui/ui";
import { plannedLessons, totalLessons } from "../lib/curriculum";
import { MascotLoading } from "../components/mascot/MascotLoading";
import { MamMascot } from "../components/mascot/MamMascot";
import { TactileButton } from "../components/ui/TactileButton";
import { Icon } from "../components/ui/Icon";

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
  const currentPlanned = plannedLessons(course)[lessonIndex];
  const nextLessonAvailable = !!course.lessons[lessonIndex + 1];
  const nextLessonInfo = plannedLessons(course)[lessonIndex + 1];
  const isChapterComplete =
    !!currentPlanned &&
    !!nextLessonInfo &&
    currentPlanned.section !== nextLessonInfo.section;

  return (
    <View style={styles.container}>
      {/* Top Mascot celebration */}
      <View style={styles.mascotArea}>
        {generation.busy ? (
          <MascotLoading
            label={
              isChapterComplete
                ? `Đang mở khóa ${nextLessonInfo?.section || "chương mới"}…`
                : `Đang soạn bài ${nextLessonInfo?.number || "tiếp theo"}…`
            }
            size={120}
          />
        ) : (
          <MamMascot size={120} mood="happy" interactive />
        )}
      </View>

      {/* Title & Subtitle */}
      <View style={styles.titleArea}>
        <Text style={styles.headingTitle}>
          {isChapterComplete
            ? "Hoàn thành một chương học!"
            : "Đã hoàn thành bài học"}
        </Text>
        <Text style={styles.subTitle}>
          {isChapterComplete
            ? `Xuất sắc! Bạn đã làm chủ ${currentPlanned?.section || "chương này"}. Chuẩn bị bước sang ${nextLessonInfo?.section || "chương tiếp theo"} với các kiến thức mới.`
            : "Một chút luyện tập ngắn sẽ giúp kiến thức vừa học in sâu và nhớ lâu hơn."}
        </Text>
      </View>

      {/* Live Challenge / Practice Highlight Card (matching reference) */}
      <View style={styles.challengeCard}>
        <View style={styles.soundBadge}>
          <Icon name="headphones" size={20} color="#27843D" />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.challengeTitle}>Thử thách phản xạ</Text>
            {earnedXp > 0 && (
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>+{earnedXp} XP</Text>
              </View>
            )}
          </View>
          <Text style={styles.challengeDesc}>
            {activeLesson.title}
          </Text>
        </View>
        <Icon name="chevron" size={18} color={t.muted} />
      </View>

      {/* Error display if generation failed */}
      {generation.error && (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {generation.error}
        </Text>
      )}

      {/* Bottom Button Actions */}
      <View style={styles.buttonGroup}>
        {lessonIndex + 1 < totalLessons(course) ? (
          <TactileButton
            variant="primary"
            disabled={!nextLessonAvailable && generation.busy}
            onPress={() =>
              nextLessonAvailable
                ? onNextLesson(lessonIndex + 1)
                : generation.retry()
            }
          >
            {nextLessonAvailable
              ? "BẮT ĐẦU BÀI TIẾP THEO"
              : generation.busy
                ? `ĐANG SOẠN BÀI ${nextLessonInfo?.number ?? ""}…`
                : generation.error
                  ? "THỬ LẠI TẠO BÀI TIẾP THEO"
                  : "TẠO BÀI TIẾP THEO"}
          </TactileButton>
        ) : (
          <TactileButton variant="primary" onPress={onHome}>
            HOÀN THÀNH KHÓA HỌC
          </TactileButton>
        )}

        <TactileButton variant="neutral" onPress={onHome}>
          ĐỂ SAU · VỀ LỘ TRÌNH
        </TactileButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  mascotArea: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  titleArea: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  headingTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: t.ink,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: t.muted,
    textAlign: "center",
  },
  challengeCard: {
    width: "100%",
    backgroundColor: "#F2F7F2", // soft sage green highlight
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(39, 132, 61, 0.15)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  soundBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2F0E2",
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: t.ink,
  },
  challengeDesc: {
    fontSize: 13.5,
    color: "#4A6B50",
  },
  xpBadge: {
    backgroundColor: "#E5F0E7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#216E33",
  },
  errorText: {
    color: t.danger,
    lineHeight: 20,
    fontSize: 13,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
});
