import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Lesson, LessonPage } from "../../types/course";
import { ui, theme as t } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { FlashcardView } from "./FlashcardView";
import { LessonIllustration } from "./LessonIllustration";
import { LessonFigure } from "./LessonFigure";
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

export function resolveLayout(
  page: LessonPage,
  pageIndex: number,
): "visual" | "story" | "stat" | "experiment" | "action" | "standard" {
  if (page.layout) return page.layout;

  // 1. Big Stat archetype: metrics with a clear numerical/percentage value
  if (
    page.visual?.kind === "metrics" &&
    page.visual.items?.some((it) => it.value && it.value.trim().length > 0)
  ) {
    return "stat";
  }

  // 2. Action archetype: step-by-step framework
  if (page.visual?.kind === "steps") {
    return "action";
  }

  // 3. Thought Experiment / Dilemma: callout or comparison with a question
  if (
    page.visual?.kind === "callout" ||
    (page.visual?.kind === "comparison" && (page.title.includes("?") || page.kicker?.includes("?")))
  ) {
    return "experiment";
  }

  // 4. Visual-First: When page has a hero diagram (flowchart, line-chart, layers, funnel, cause-effect, bars, cycle)
  if (
    page.visual &&
    ["flowchart", "line-chart", "layers", "funnel", "cause-effect", "bars", "cycle"].includes(
      page.visual.kind,
    )
  ) {
    return "visual";
  }

  // 5. Deep Story: When illustration is present or no visual is specified
  if (!page.visual || !page.visual.items?.length) {
    return "story";
  }

  return "standard";
}

function PageHeader({ page, activeLesson }: { page: LessonPage; activeLesson: Lesson }) {
  return (
    <View style={{ marginTop: 10, marginBottom: 12 }}>
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
          marginTop: 2,
        }}
      >
        {page.title}
      </Text>
    </View>
  );
}

function TakeawayPill({ text }: { text: string }) {
  if (!text) return null;
  return (
    <View
      style={{
        marginTop: 16,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#F2ECE1",
        borderWidth: 1,
        borderColor: "rgba(35, 27, 21, 0.08)",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 16, marginTop: 1 }}>🌱</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 10.5,
            fontWeight: "700",
            letterSpacing: 1,
            color: t.accent,
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          ĐIỂM CHẠM CỐT LÕI
        </Text>
        <Text
          style={{
            fontSize: 13.5,
            lineHeight: 20,
            color: "#423B33",
            fontWeight: "600",
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
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
  const layout = resolveLayout(page, pageIndex);
  const showIllustration = pageIndex === 0 || !!page.illustration?.id;
  const followUpProse = page.example
    ? `${page.example.scenario.trim()}\n\n${page.example.explanation.trim()}`
    : "";

  // 1. VISUAL-FIRST LAYOUT: Sơ đồ làm nhân vật chính ngay dưới tiêu đề
  if (layout === "visual" && page.visual) {
    return (
      <>
        <PageHeader page={page} activeLesson={activeLesson} />

        {/* Hero Figure */}
        <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />

        {/* Short insight / takeaway underneath */}
        <TakeawayPill text={page.takeaway} />

        {/* Concise body text if relevant */}
        {page.body ? (
          <View style={{ marginTop: 8 }}>
            <FormattedBody body={page.body} />
          </View>
        ) : null}

        {followUpProse ? (
          <View style={{ marginTop: 10 }}>
            <FormattedBody body={followUpProse} />
          </View>
        ) : null}
      </>
    );
  }

  // 2. STAT / METRIC HERO LAYOUT: Con số khổng lồ ấn tượng
  if (layout === "stat" && page.visual?.items?.[0]) {
    const heroItem = page.visual.items[0];
    const otherItems = page.visual.items.slice(1);
    return (
      <>
        <PageHeader page={page} activeLesson={activeLesson} />

        {/* Giant Stat Hero Card */}
        <View
          style={{
            marginTop: 8,
            marginBottom: 16,
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: "#231B15",
            backgroundColor: "#F7F3EB",
            padding: 22,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 52,
              fontWeight: "900",
              color: "#231B15",
              letterSpacing: -1,
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            {heroItem.value || "100%"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: t.accent,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {heroItem.label}
          </Text>
          <Text
            style={{
              fontSize: 13.5,
              lineHeight: 20,
              color: "#5C5449",
              textAlign: "center",
              maxWidth: 320,
            }}
          >
            {heroItem.detail}
          </Text>

          {otherItems.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 16,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: "rgba(35, 27, 21, 0.1)",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              {otherItems.map((it, idx) => (
                <View key={idx} style={{ alignItems: "center", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "800",
                      color: "#231B15",
                      fontFamily: "monospace",
                    }}
                  >
                    {it.value || "•"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: "#736B5E",
                      textAlign: "center",
                      marginTop: 2,
                    }}
                  >
                    {it.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <FormattedBody body={page.body} />
        {followUpProse ? (
          <View style={{ marginTop: 10 }}>
            <FormattedBody body={followUpProse} />
          </View>
        ) : null}
        <TakeawayPill text={page.takeaway} />
      </>
    );
  }

  // 3. THOUGHT EXPERIMENT / DILEMMA LAYOUT: Tình huống thử thách phản biện
  if (layout === "experiment") {
    return (
      <>
        <PageHeader page={page} activeLesson={activeLesson} />

        <View
          style={{
            marginVertical: 10,
            padding: 18,
            borderRadius: 20,
            backgroundColor: "#F4EEE2",
            borderWidth: 1.5,
            borderColor: "rgba(35, 27, 21, 0.12)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Icon name="sparkle" size={17} color={t.accent} />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1.2,
                color: t.accent,
                textTransform: "uppercase",
              }}
            >
              THÍ NGHIỆM TƯ DUY
            </Text>
          </View>
          <FormattedBody body={page.body} />
        </View>

        {page.visual ? (
          <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
        ) : null}

        {followUpProse ? (
          <View style={{ marginTop: 12 }}>
            <FormattedBody body={followUpProse} />
          </View>
        ) : null}

        <TakeawayPill text={page.takeaway} />
      </>
    );
  }

  // 4. ACTIONABLE FRAMEWORK LAYOUT: Checklist thực thi
  if (layout === "action") {
    return (
      <>
        <PageHeader page={page} activeLesson={activeLesson} />

        {/* Short intro */}
        {page.body ? (
          <View style={{ marginBottom: 10 }}>
            <FormattedBody body={page.body} />
          </View>
        ) : null}

        {/* Step-by-step Action Figure */}
        {page.visual ? (
          <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
        ) : null}

        {followUpProse ? (
          <View style={{ marginTop: 12 }}>
            <FormattedBody body={followUpProse} />
          </View>
        ) : null}

        <TakeawayPill text={page.takeaway} />
      </>
    );
  }

  // 5. DEEP STORY LAYOUT: Thuần kể chuyện nhập tâm, tranh minh họa
  if (layout === "story") {
    return (
      <>
        <PageHeader page={page} activeLesson={activeLesson} />

        {showIllustration ? (
          <LessonIllustration
            key={`${courseId}:${lessonIndex}:${pageIndex}`}
            lesson={activeLesson}
            courseTitle={courseTitle}
            pageIndex={pageIndex}
            onStatus={onOpenAIStatus}
          />
        ) : null}

        <View style={{ marginTop: 10 }}>
          <FormattedBody body={page.body} />
        </View>

        {followUpProse ? (
          <View style={{ marginTop: 12 }}>
            <FormattedBody body={followUpProse} />
          </View>
        ) : null}

        <TakeawayPill text={page.takeaway} />
      </>
    );
  }

  // 6. STANDARD / EDITORIAL BALANCED LAYOUT
  return (
    <>
      <PageHeader page={page} activeLesson={activeLesson} />
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
          {page.visual ? (
            <LessonFigure page={page} lesson={activeLesson} index={pageIndex} />
          ) : null}
          {followUpProse ? (
            <View style={{ marginTop: 6, marginBottom: 8 }}>
              <FormattedBody body={followUpProse} />
            </View>
          ) : null}
        </>
      )}
      <TakeawayPill text={page.takeaway} />
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
