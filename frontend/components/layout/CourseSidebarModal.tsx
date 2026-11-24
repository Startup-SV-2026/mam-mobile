import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import type { Course } from "../../types/course";
import { theme as t, ui } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { TactileButton } from "../ui/TactileButton";

interface CourseSidebarModalProps {
  visible: boolean;
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (course: Course) => void;
  onCreateCourse: () => void;
  onClose: () => void;
}

export function CourseSidebarModal({
  visible,
  courses,
  activeCourseId,
  onSelectCourse,
  onCreateCourse,
  onClose,
}: CourseSidebarModalProps) {
  if (!visible) return null;

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <View style={styles.container}>
      {/* 1. Main Left Drawer Panel */}
      <View style={styles.drawer}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.drawerHeader}>
            <Text style={styles.headerLabel}>Khóa học</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {courses.map((c) => {
              const isActive = c.id === activeCourseId;
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => {
                    onSelectCourse(c);
                    onClose();
                  }}
                  style={[
                    styles.courseItem,
                    isActive && styles.courseItemActive,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.courseTitle,
                      isActive && styles.courseTitleActive,
                    ]}
                  >
                    {c.title}
                  </Text>
                  <Text style={{ color: t.muted, fontSize: 13, letterSpacing: 1 }}>···</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.drawerFooter}>
            <TactileButton
              variant="secondary"
              size="md"
              onPress={() => {
                onClose();
                onCreateCourse();
              }}
              style={{ width: 175 }}
            >
              + Tạo khóa mới
            </TactileButton>
          </View>
        </SafeAreaView>
      </View>

      {/* 2. Peeking Right Area (Bounded inside phone frame, tap to close) */}
      <Pressable style={styles.peekArea} onPress={onClose}>
        <SafeAreaView style={styles.peekContent}>
          <View style={styles.peekHeader}>
            <View style={styles.peekIconBox}>
              <Icon name="sidebar" size={22} color={t.muted} />
            </View>
          </View>

          {activeCourse && (
            <View style={styles.peekCourseCard}>
              <View style={styles.peekArtBox} />
            </View>
          )}

          <View style={styles.peekSectionCard}>
            <View style={styles.peekSkeletonText} />
            <View style={[styles.peekSkeletonText, { width: "50%", marginTop: 4 }]} />
          </View>
        </SafeAreaView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  drawer: {
    width: "82%",
    height: "100%",
    backgroundColor: t.bg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: t.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  drawerHeader: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: t.muted,
  },
  listContent: {
    gap: 4,
    paddingVertical: 8,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  courseItemActive: {
    backgroundColor: t.soft,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: t.ink,
    flex: 1,
    marginRight: 8,
  },
  courseTitleActive: {
    fontWeight: "700",
    color: t.ink,
  },
  drawerFooter: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  newCourseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    alignSelf: "flex-start",
    shadowColor: t.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  newCourseText: {
    fontSize: 14,
    fontWeight: "600",
    color: t.ink,
  },
  peekArea: {
    flex: 1,
    backgroundColor: t.bg,
    opacity: 0.88,
    paddingLeft: 10,
  },
  peekContent: {
    flex: 1,
    paddingTop: 12,
    gap: 14,
  },
  peekHeader: {
    height: 48,
    justifyContent: "center",
  },
  peekIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  peekCourseCard: {
    height: 76,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.surface,
    padding: 10,
  },
  peekArtBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  peekSectionCard: {
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.surface,
    padding: 12,
    justifyContent: "center",
  },
  peekSkeletonText: {
    height: 8,
    width: "70%",
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 4,
  },
});
