import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Lesson, LessonPage } from "../../types/course";
import { ui, theme as t } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { FlashcardView } from "./FlashcardView";
import { LessonIllustration } from "./LessonIllustration";
import { LessonFigure } from "./LessonFigure";
import { FormattedBody } from "./FormattedBody";
import { SelfCheckCard } from "./SelfCheckCard";
import { triggerHaptic, playSound } from "../../lib/feedback";

interface LessonContentProps {
  pageIndex: number;
  activeLesson: Lesson;
  page: LessonPage;
  courseId: string;
  courseTitle: string;
  lessonIndex: number;
  onOpenAIStatus?: () => void;
  onAskTutor?: (question: string) => void;
}

export function LessonContent({
  pageIndex,
  activeLesson,
  page,
  courseId,
  courseTitle,
  lessonIndex,
  onOpenAIStatus,
  onAskTutor,
}: LessonContentProps) {
  const showIllustration = pageIndex === 0 || !!page.illustration?.id;
  const followUpProse = page.example
    ? `${page.example.scenario.trim()}\n\n${page.example.explanation.trim()}`
    : "";

  return (
    <>
      <View style={{ marginTop: 10, marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {page.emoji ? <Text style={{ fontSize: 15 }}>{page.emoji}</Text> : null}
          <Text
            style={{
              fontSize: 11.5,
              fontWeight: "700",
              color: t.accent,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {page.kicker || activeLesson.title}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            lineHeight: 34,
            color: t.ink,
            letterSpacing: -0.3,
            marginTop: 4,
          }}
        >
          {page.title}
        </Text>
      </View>

      <FormattedBody body={page.body} />
      {page.vocab ? <FlashcardView {...page.vocab} /> : null}

      {showIllustration ? (
        <>
          <LessonIllustration
            key={`${courseId}:${lessonIndex}:${pageIndex}`}
            lesson={activeLesson}
            courseTitle={courseTitle}
            pageIndex={pageIndex}
            onStatus={onOpenAIStatus}
          />
          {followUpProse ? (
            <View style={{ marginTop: 14 }}>
              <FormattedBody body={followUpProse} />
            </View>
          ) : null}
          {page.visual ? (
            <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
          ) : null}
        </>
      ) : (
        <>
          <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
          {followUpProse ? (
            <View style={{ marginTop: 6, marginBottom: 8 }}>
              <FormattedBody body={followUpProse} />
            </View>
          ) : null}
        </>
      )}

      {/* Active Reflection Card with 3 distinct UI variations */}
      <SelfCheckCard
        selfCheck={page.selfCheck}
        commonMistake={page.commonMistake}
        pageIndex={pageIndex}
      />

      {/* Contextual AI Copilot Button (Dynamic prompt per slide) */}
      {onAskTutor ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            triggerHaptic("selection");
            playSound("tap");
            const prompt =
              pageIndex % 3 === 0
                ? `Giải thích giúp mình trang "${page.title}" bằng một ví dụ đời thường hơn nhé.`
                : pageIndex % 3 === 1
                  ? `Trang "${page.title}" có điểm nào người mới học hay hiểu nhầm không bạn?`
                  : `Làm sao áp dụng nội dung trang "${page.title}" vào thực tế hàng ngày?`;
            onAskTutor(prompt);
          }}
          style={styles.copilotCard}
        >
          <View style={styles.copilotLeft}>
            <View style={styles.copilotIconCircle}>
              <Text style={styles.copilotEmoji}>
                {pageIndex % 3 === 0 ? "💡" : pageIndex % 3 === 1 ? "🔍" : "⚡"}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.copilotTitle}>
                {pageIndex % 3 === 0
                  ? "Chưa hiểu rõ trang này?"
                  : pageIndex % 3 === 1
                    ? "Cần thêm ví dụ thực tế?"
                    : "Muốn đào sâu bài học?"}
              </Text>
              <Text style={styles.copilotSub}>
                {pageIndex % 3 === 0
                  ? "Chạm để hỏi nhanh Gia sư Mầm AI"
                  : pageIndex % 3 === 1
                    ? "Nhờ Mầm AI phân tích tình huống"
                    : "Phản biện đa chiều cùng Mầm AI"}
              </Text>
            </View>
          </View>
          <View style={styles.copilotAction}>
            <Text style={styles.copilotActionText}>Hỏi ngay →</Text>
          </View>
        </Pressable>
      ) : null}
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
            onPress={() => {
              triggerHaptic("selection");
              playSound("tap");
              onSelectAnswer(i);
            }}
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
  copilotCard: {
    marginTop: 10,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "#FDFBF5",
    borderWidth: 1.2,
    borderColor: "#E5DEC9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  copilotLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  copilotIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FAF2DE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBDDBA",
  },
  copilotEmoji: {
    fontSize: 18,
  },
  copilotTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#231B15",
  },
  copilotSub: {
    fontSize: 12,
    color: "#7A6C58",
  },
  copilotAction: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: "#EBF5FE",
    borderWidth: 1,
    borderColor: "#72C3FA",
  },
  copilotActionText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#1B6D9B",
  },
});

