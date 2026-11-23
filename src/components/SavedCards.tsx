import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Course, Lesson, LessonPage } from "../types/course";
import { ui, theme as t, Action, IconButton } from "./ui";
import { Icon } from "./Icon";

interface SavedCardsProps {
  courses: Course[];
  savedKeys: string[];
  filterCourseId: string | null;
  onBack: () => void;
  onReadCard: (courseId: string, lessonIndex: number, pageIndex: number) => void;
  onToggleSave: (key: string) => void;
}

export function SavedCards({
  courses,
  savedKeys,
  filterCourseId,
  onBack,
  onReadCard,
  onToggleSave,
}: SavedCardsProps) {
  const savedPages = courses
    .filter((c: Course) => !filterCourseId || c.id === filterCourseId)
    .flatMap((c: Course) =>
      c.lessons.flatMap((l: Lesson, i: number) =>
        l.pages.map((p: LessonPage, j: number) => ({
          course: c,
          lesson: i,
          page: j,
          content: p,
          key: `${c.id}:${i}:${j}`,
        })),
      ),
    )
    .filter((p) => savedKeys.includes(p.key));

  return (
    <>
      <Action secondary icon="back" onPress={onBack}>
        VỀ THƯ VIỆN
      </Action>
      <View style={{ height: 24 }} />
      {savedPages.length ? (
        savedPages.map((p) => (
          <View key={p.key} style={[ui.card, { marginBottom: 16, gap: 12 }]}>
            <Text style={ui.label}>{p.course.title}</Text>
            <Text style={{ fontSize: 19, fontWeight: "700", color: t.ink }}>
              {p.content.title}
            </Text>
            <Text style={ui.body}>{p.content.takeaway}</Text>
            <View style={ui.row}>
              <Action
                secondary
                style={{ flex: 1 }}
                onPress={() => onReadCard(p.course.id, p.lesson, p.page)}
              >
                ĐỌC LẠI
              </Action>
              <IconButton
                name="bookmark"
                label="Bỏ lưu thẻ"
                selected
                onPress={() => onToggleSave(p.key)}
              />
            </View>
          </View>
        ))
      ) : (
        <View style={[ui.card, { gap: 12 }]}>
          <Icon name="bookmark" size={34} />
          <Text style={ui.title}>Gom điều đáng nhớ.</Text>
          <Text style={ui.body}>
            Nhấn biểu tượng đánh dấu trong bài học để giữ lại thẻ tại đây.
          </Text>
        </View>
      )}
    </>
  );
}
