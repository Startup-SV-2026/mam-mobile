import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Course, Progress } from "../types/course";
import type { UserProfile } from "../lib/auth-api";
import { CourseArt } from "./CourseArt";
import { Icon } from "./Icon";
import { MamMascot } from "./MamMascot";
import { theme as t, ui } from "./ui";
import { totalLessons } from "../lib/curriculum";
import { currentStreak } from "../lib/learning";
import { ArtChip, Scrim, SectionHeader } from "./MamKit";

interface MamHomeDashboardProps {
  user: UserProfile | null;
  courses: Course[];
  activeCourse: Course;
  completed: Progress["completed"];
  streak: number;
  lastStudy: string;
  xp: number;
  onContinueCourse: (course: Course) => void;
  onSelectCourse: (course: Course) => void;
  onExplore: () => void;
  onCreateCourse: () => void;
  onOpenGoals: () => void;
}

export function MamHomeDashboard({
  user,
  courses,
  activeCourse,
  completed,
  streak,
  lastStudy,
  xp,
  onContinueCourse,
  onSelectCourse,
  onExplore,
  onCreateCourse,
  onOpenGoals,
}: MamHomeDashboardProps) {
  // Vietnamese given name is the last word (e.g. "Nguyễn An" -> "An")
  const userName = user?.name?.trim()
    ? user.name.trim().split(/\s+/).pop()
    : "bạn";
  const completedLessons = activeCourse.lessons.filter(
    (_, i) => completed[`${activeCourse.id}:${i}`],
  ).length;
  const total = totalLessons(activeCourse);
  const percent = total > 0 ? Math.round((completedLessons / total) * 100) : 0;

  // Next lesson title
  const nextLessonIndex = activeCourse.lessons.findIndex(
    (_, i) => !completed[`${activeCourse.id}:${i}`],
  );
  const currentLessonIdx = nextLessonIndex >= 0 ? nextLessonIndex : 0;
  const currentLessonTitle =
    activeCourse.lessons[currentLessonIdx]?.title || "Khám phá bài học";

  // Categories
  const categories = [
    { id: "all", name: "Tất cả", icon: "sparkle" },
    { id: "business", name: "Tài chính", icon: "brain" },
    { id: "science", name: "Khoa học", icon: "lightning" },
    { id: "arts", name: "Triết học", icon: "library" },
  ];

  // Other suggested courses
  const otherCourses = courses.filter((c) => c.id !== activeCourse.id);

  return (
    <View style={styles.container}>
      {/* 1. Header greeting & mascot */}
      <View style={styles.greetingCard}>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.pillBadge}>
            <Icon name="sprout" size={14} color={t.accent} />
            <Text style={styles.pillBadgeText}>HÔM NAY</Text>
          </View>
          <Text style={styles.greetingTitle}>Chào {userName}.</Text>
          <Text style={styles.greetingSubtitle}>
            Tiếp tục bài đang học hoặc chọn một chủ đề mới.
          </Text>
        </View>
        <MamMascot size={72} mood="happy" />
      </View>

      {/* 2. Today's summary stats row */}
      <View style={styles.statsRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenGoals}
          style={styles.statItem}
        >
          <Icon name="flame" size={20} color="#D97706" />
          <View>
            <Text style={styles.statVal}>
              {currentStreak(streak, lastStudy)} ngày
            </Text>
            <Text style={styles.statLabel}>Chuỗi học tập</Text>
          </View>
        </Pressable>

        <View style={styles.statItem}>
          <Icon name="star" size={20} color="#CA8A04" />
          <View>
            <Text style={styles.statVal}>{xp} XP</Text>
            <Text style={styles.statLabel}>Điểm tích lũy</Text>
          </View>
        </View>
      </View>

      {/* 3. Continue Learning Hero Card */}
      <View style={{ marginBottom: 14 }}>
        <SectionHeader
          icon="sprout"
          title="Đang học"
          action="Lộ trình"
          onAction={() => onContinueCourse(activeCourse)}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Tiếp tục khóa học: ${activeCourse.title}`}
        onPress={() => onContinueCourse(activeCourse)}
        style={styles.heroCourseCard}
      >
        <View style={styles.heroArtwork}>
          <CourseArt id={activeCourse.id} title={activeCourse.title} category={activeCourse.category} />
          <View style={styles.heroArtChip}><ArtChip label={activeCourse.category} /></View>
        </View>
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text numberOfLines={2} style={styles.heroTitle}>{activeCourse.title}</Text>
          <Text numberOfLines={2} style={styles.heroSubtitle}>
            {completedLessons === total ? "Đã hoàn thành khóa học" : `Bài ${currentLessonIdx + 1}: ${currentLessonTitle}`}
          </Text>
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>

        {/* CTA Button */}
        <View style={styles.heroFooter}>
          <Text style={styles.lessonsCountText}>
            {completedLessons}/{total} bài học đã hoàn thành
          </Text>
          <View style={styles.continueButton}>
            <Text style={styles.continueButtonText}>{completedLessons === total ? "Xem lại" : "Học tiếp"}</Text>
            <Icon name="play" size={14} color="#FFFFFF" filled />
          </View>
        </View>
        </View>
      </Pressable>

      {/* 4. Suggestions */}
      <View style={{ marginTop: 30, marginBottom: 14 }}>
        <SectionHeader
          icon="sparkle"
          title="Gợi ý"
          chip="Cho bạn"
          action="Xem tất cả"
          onAction={onExplore}
        />
      </View>

      {/* Horizontal Carousel of other courses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {otherCourses.slice(0, 5).map((c) => {
          const cCompleted = c.lessons.filter(
            (_, i) => completed[`${c.id}:${i}`],
          ).length;
          const cTotal = totalLessons(c);

          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`Khóa học ${c.title}`}
              onPress={() => onSelectCourse(c)}
              style={styles.suggestionCard}
            >
              <CourseArt id={c.id} title={c.title} category={c.category} />
              <Scrim />
              <View style={styles.suggestionTop}>
                <ArtChip
                  icon={cCompleted > 0 ? "check" : "notes"}
                  label={cCompleted > 0 ? `${cCompleted}/${cTotal} bài` : `${cTotal} bài`}
                />
              </View>
              <View style={styles.suggestionBottom}>
                <Text style={styles.suggestionCategory}>{c.category}</Text>
                <Text numberOfLines={2} style={styles.suggestionTitle}>
                  {c.title}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* Add Course Card */}
        <Pressable
          accessibilityRole="button"
          onPress={onCreateCourse}
          style={styles.createCourseCard}
        >
          <View style={styles.createIconCircle}>
            <Icon name="sparkle" size={26} color={t.accent} />
          </View>
          <Text style={styles.createCardTitle}>Tạo khóa mới</Text>
          <Text style={styles.createCardSub}>Học bất cứ chủ đề nào bạn thích với AI</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroArtwork: { height: 190, backgroundColor: t.soft },
  heroArtChip: { position: "absolute", top: 14, left: 14 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greetingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.surface,
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: t.line,
  },

  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.selected,
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
    marginBottom: 8,
  },

  pillBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: t.accent,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: t.ink,
    letterSpacing: -0.5,
  },

  greetingSubtitle: {
    fontSize: 13,
    color: t.muted,
    lineHeight: 18,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.surface,
  },

  statVal: {
    fontSize: 16,
    fontWeight: "700",
    color: t.ink,
  },
  statLabel: {
    fontSize: 11,
    color: t.muted,
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: t.muted,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: "600",
    color: t.accent,
  },
  heroCourseCard: {
    backgroundColor: t.surface,
    borderRadius: 28,
    paddingBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.line,
    shadowColor: t.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },

  heroCourseTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: "600",
    color: t.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: "700",
    color: t.muted,
    marginLeft: "auto",
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: t.ink,
    lineHeight: 29,
    letterSpacing: -0.2,
  },

  heroSubtitle: {
    fontSize: 13,
    color: t.muted,
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: t.soft,
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 14,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: t.accent,
    borderRadius: 3,
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  lessonsCountText: {
    fontSize: 12,
    color: t.muted,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.deep,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 7,
  },

  continueButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  horizontalScroll: {
    gap: 14,
    paddingRight: 16,
    paddingBottom: 4,
  },
  suggestionCard: {
    width: 236,
    height: 168,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: t.line,
    overflow: "hidden",
    backgroundColor: t.soft,
  },
  suggestionTop: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  suggestionBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    gap: 3,
  },

  suggestionBody: {
    padding: 12,
    gap: 4,
  },
  suggestionCategory: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  suggestionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 20,
  },

  suggestionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  suggestionCount: {
    fontSize: 11,
    color: t.muted,
  },
  createCourseCard: {
    width: 168,
    height: 168,
    backgroundColor: t.surface,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: t.line,
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  createIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: t.selected,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  createCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: t.ink,
    textAlign: "center",
  },
  createCardSub: {
    fontSize: 11,
    color: t.muted,
    textAlign: "center",
    lineHeight: 15,
  },
});
