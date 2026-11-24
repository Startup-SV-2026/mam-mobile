import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Course, Progress } from "../types/course";
import { plannedLessons, totalLessons } from "../lib/curriculum";
import { CourseArt } from "../components/course/CourseArt";
import { Icon } from "../components/ui/Icon";
import { theme as t, ui } from "../components/ui/ui";
import { lessonState } from "../lib/roadmap";
import { MamMascot } from "../components/mascot/MamMascot";

interface MamRoadmapProps {
  course: Course;
  completed: Progress["completed"];
  onSelect: (index: number) => void;
  onNotes: () => void;
  onPodcast: () => void;
  onTutor: () => void;
  onSidebarToggle: () => void;
  onBack?: () => void;
  generation: { busy: boolean; error: string; retry: () => void };
}

// X-offset mapping for natural zigzag path like Wondering
const ZIGZAG_OFFSETS = [0, 24, 44, 20, -10, 16, 38, 8, -12, 28];

export function MamRoadmap({
  course,
  completed,
  onSelect,
  onNotes,
  onPodcast,
  onTutor,
  onSidebarToggle,
  onBack,
  generation,
}: MamRoadmapProps) {
  const count = course.lessons.filter(
    (_, i) => completed[`${course.id}:${i}`],
  ).length;
  const total = totalLessons(course);

  // Group lessons by sections/chapters
  const sections: {
    title: string;
    items: {
      entry: ReturnType<typeof plannedLessons>[number];
      lesson: Course["lessons"][number] | undefined;
      index: number;
    }[];
  }[] = [];

  plannedLessons(course).forEach((entry, index) => {
    const lesson = course.lessons[index];
    const title = entry.section || "Chương 1";
    let group = sections[sections.length - 1];
    if (!group || group.title !== title) {
      group = { title, items: [] };
      sections.push(group);
    }
    group.items.push({ entry, lesson, index });
  });

  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={[ui.row, { gap: 6, alignItems: "center", marginBottom: 12, paddingVertical: 4 }]}
        >
          <Icon name="back" size={18} color={t.accent} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: t.accent }}>Trang chủ</Text>
        </Pressable>
      )}

      {/* 1. Course Hero Card (Khung thẻ khóa học với 3D Art & Podcast) */}
      <View style={styles.courseHeroCard}>
        <View style={styles.artBox}>
          <CourseArt
            id={course.id}
            title={course.title}
            category={course.category}
            size={76}
          />
        </View>
        <View style={styles.heroInfo}>
          <Pressable
            accessibilityRole="button"
            onPress={onSidebarToggle}
            style={[ui.row, { gap: 6, alignItems: "center" }]}
          >
            <Text numberOfLines={1} style={styles.heroTitle}>
              {course.title}
            </Text>
            <Text style={{ fontSize: 12, color: t.muted, lineHeight: 12 }}>{"⌃\n⌄"}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onPodcast}
            style={styles.podcastButton}
          >
            <Icon name="headphones" size={18} color={t.muted} />
            <Text style={styles.podcastLabel}>Podcast</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onTutor}
          accessibilityLabel="Tùy chọn khóa học"
          style={styles.moreButton}
        >
          <Icon name="more" size={20} color={t.muted} />
        </Pressable>
      </View>

      {/* 2. Chapter / Section Card */}
      {sections.map((section, sIdx) => {
        const sectionLessonsDone = section.items.filter(
          ({ index }) => completed[`${course.id}:${index}`],
        ).length;

        return (
          <View key={sIdx} style={styles.sectionContainer}>
            {/* Section Header Card with Notes action icon */}
            <View style={styles.sectionCard}>
              <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 20 }}>
                <Text style={styles.sectionNumberTitle}>
                  {`${sIdx + 1}. ${section.title}`}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {sectionLessonsDone}/{section.items.length} bài hoàn thành
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ghi chú chương"
                onPress={onNotes}
                style={styles.notesIconButton}
              >
                <Icon name="notes" size={21} color={t.muted} />
              </Pressable>
            </View>

            {/* 3. Zigzag Vertical Node Path */}
            <View style={styles.pathTree}>
              {section.items.map(({ entry, lesson, index }, itemIdx) => {
                const state = lessonState(course, index, completed);
                const preparing = !lesson && generation.busy && state === "current";
                const offset = ZIGZAG_OFFSETS[itemIdx % ZIGZAG_OFFSETS.length];

                return (
                  <View
                    key={index}
                    style={[
                      styles.nodeRow,
                      { transform: [{ translateX: offset }] },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={entry.title}
                      disabled={state === "locked" || preparing}
                      onPress={() => (lesson ? onSelect(index) : generation.retry())}
                      style={({ pressed }) => [
                        styles.nodeWrap,
                        pressed && { transform: [{ translateY: 3 }] },
                      ]}
                    >
                      <View
                        style={[
                          styles.nodeRim,
                          state === "done" && { backgroundColor: t.nodeDoneRim },
                          state === "current" && { backgroundColor: t.nodeCurrentRim },
                          state === "locked" && { backgroundColor: t.nodeLockedRim },
                        ]}
                      />
                      <View
                        style={[
                          styles.nodeFace,
                          state === "done" && { backgroundColor: t.nodeDone },
                          state === "current" && { backgroundColor: t.nodeCurrent },
                          state === "locked" && { backgroundColor: t.nodeLocked },
                        ]}
                      >
                        {preparing ? (
                          <MamMascot size={36} mood="thinking" />
                        ) : state === "done" ? (
                          <Icon name="check" size={24} color={t.nodeDoneCheck} />
                        ) : state === "locked" ? (
                          <Icon name="lock" size={18} color={t.muted} />
                        ) : (
                          <Text style={styles.nodeNumber}>{entry.number}</Text>
                        )}
                      </View>
                    </Pressable>

                    {/* Lesson Label on the right of node */}
                    <Pressable
                      onPress={() => (lesson ? onSelect(index) : generation.retry())}
                      disabled={state === "locked" || preparing}
                      style={styles.nodeLabelBox}
                    >
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.nodeTitle,
                          state === "locked" && { color: t.muted },
                        ]}
                      >
                        {entry.title}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      <View style={{ height: 90 }} />
    </View>
  );
}

const NODE = 62;
const RIM = 6;

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingTop: 8,
  },
  courseHeroCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: t.line,
    backgroundColor: t.surface,
    gap: 16,
    shadowColor: t.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  artBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.soft,
  },
  heroInfo: {
    flex: 1,
    gap: 10,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: t.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  podcastButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
  },
  podcastLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: t.muted,
  },
  moreButton: {
    padding: 8,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    gap: 22,
  },
  sectionCard: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: t.line,
    backgroundColor: t.surface,
    overflow: "hidden",
    shadowColor: t.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionNumberTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: t.ink,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: t.muted,
    marginTop: 4,
  },
  notesIconButton: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: t.line,
  },
  pathTree: {
    gap: 22,
    paddingVertical: 8,
    alignItems: "center",
  },
  nodeRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "78%",
    gap: 18,
  },
  // Tactile disc: a darker rim sits RIM px below the face
  nodeWrap: {
    width: NODE,
    height: NODE + RIM,
  },
  nodeRim: {
    position: "absolute",
    top: RIM,
    left: 0,
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: t.nodeLockedRim,
  },
  nodeFace: {
    position: "absolute",
    top: 0,
    left: 0,
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: t.nodeLocked,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nodeLabelBox: {
    flex: 1,
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: t.ink,
    lineHeight: 23,
  },
});
