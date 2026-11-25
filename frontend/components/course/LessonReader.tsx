import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Lesson, LessonPage } from "../../types/course";
import { ui, theme as t } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { FlashcardView } from "./FlashcardView";
import { LessonIllustration } from "./LessonIllustration";
import { LessonFigure } from "./LessonFigure";
import { LessonDepth } from "./LessonDepth";
import { FormattedBody } from "./FormattedBody";

interface LessonContentProps {
  pageIndex: number;
  activeLesson: Lesson;
  page: LessonPage;
  courseId: string;
  courseTitle: string;
  lessonIndex: number;
  onOpenAIStatus?: () => void;
}

export function LessonContent({
  pageIndex,
  activeLesson,
  page,
  courseId,
  courseTitle,
  lessonIndex,
  onOpenAIStatus,
}: LessonContentProps) {
  return (
    <>
      {pageIndex === 0 && activeLesson.objective && (
        <View
          style={[
            ui.card,
            {
              gap: 8,
              marginTop: 10,
              backgroundColor: t.selected,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(39, 132, 61, 0.15)",
              padding: 16,
            },
          ]}
        >
          <Text style={[ui.label, { color: t.accent, fontSize: 11, letterSpacing: 1.2 }]}>
            MỤC TIÊU BÀI HỌC
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 23, color: t.ink, fontWeight: "500" }}>
            {activeLesson.objective}
          </Text>
        </View>
      )}

      <View style={{ marginTop: 14 }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: t.muted, letterSpacing: 0.8, textTransform: "uppercase" }}>
          {page.kicker || activeLesson.title}
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            lineHeight: 34,
            color: t.ink,
            letterSpacing: -0.3,
            marginTop: 8,
          }}
        >
          {page.title}
        </Text>
      </View>

      <FormattedBody body={page.body} />
      {page.vocab ? <FlashcardView {...page.vocab} /> : null}
      {(pageIndex === 0 || pageIndex === 1) && (
        <LessonIllustration
          key={`${courseId}:${lessonIndex}:${pageIndex}`}
          lesson={activeLesson}
          courseTitle={courseTitle}
          pageIndex={pageIndex}
          onStatus={onOpenAIStatus}
        />
      )}
      <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
      <LessonDepth
        key={`${courseId}:${lessonIndex}:${pageIndex}`}
        page={page}
      />
    </>
  );
}

interface QuizContentProps {
  activeLesson: Lesson;
  answer: number | null;
  checked: boolean;
  isCorrect: boolean;
  onSelectAnswer: (index: number) => void;
}

export function QuizContent({
  activeLesson,
  answer,
  checked,
  isCorrect,
  onSelectAnswer,
}: QuizContentProps) {
  return (
    <>
      <Text style={[ui.label, { marginTop: 20, textAlign: "center" }]}>
        THỬ SỨC MỘT CHÚT
      </Text>
      <View style={{ alignItems: "center", padding: 24 }}>
        <Icon name="review" size={64} color={t.accent} />
      </View>
      <Text
        style={[
          ui.title,
          { fontSize: 25, lineHeight: 34, textAlign: "center" },
        ]}
      >
        {activeLesson.quiz.question}
      </Text>
      <View style={{ gap: 12, marginTop: 25 }}>
        {activeLesson.quiz.choices.map((choice, i) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: answer === i }}
            disabled={checked && isCorrect}
            key={i}
            onPress={() => onSelectAnswer(i)}
            style={[
              styles.option,
              answer === i && {
                borderColor: t.accent,
                backgroundColor: t.selected,
                borderBottomColor: t.accent,
              },
            ]}
          >
            <Text style={{ fontSize: 13, color: t.muted, padding: 5 }}>
              {String.fromCharCode(65 + i)}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                lineHeight: 24,
                color: t.ink,
              }}
            >
              {choice}
            </Text>
            {answer === i && <Icon name="check" size={19} />}
          </Pressable>
        ))}
      </View>
      {checked && (
        <View
          style={[
            ui.card,
            {
              backgroundColor: isCorrect ? t.success : t.dangerSurface,
              marginTop: 20,
              gap: 8,
            },
          ]}
        >
          <Text style={{ fontWeight: "700", color: t.ink }}>
            {isCorrect ? "Chính xác!" : "Cùng thử lại nhé."}
          </Text>
          <Text style={[ui.body, { color: t.ink }]}>
            {activeLesson.quiz.why}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: t.line,
    borderRadius: 15,
    minHeight: 65,
  },
});
