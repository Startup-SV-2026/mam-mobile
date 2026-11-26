import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Lesson } from "../../types/course";
import { theme as t } from "../ui/ui";
import { Icon } from "../ui/Icon";

interface LessonHookProps {
  lesson: Lesson;
  courseTitle?: string;
}

export function LessonHook({ lesson, courseTitle }: LessonHookProps) {
  // Derive hook text
  const quoteText =
    lesson.openingQuote?.text?.trim() ||
    extractProvocativeHook(lesson);

  const label =
    lesson.openingQuote?.label?.trim() ||
    courseTitle ||
    lesson.title;

  return (
    <View style={s.container}>
      <View style={s.centerCard}>
        <View style={s.iconWrapper}>
          <Icon name="sparkle" size={24} color={t.accent} />
        </View>

        <Text style={s.quoteText}>
          "{quoteText.replace(/^["'“]|["'”]$/g, "")}"
        </Text>

        <View style={s.metaRow}>
          <View style={s.line} />
          <Text style={s.label}>{label}</Text>
          <View style={s.line} />
        </View>
      </View>
    </View>
  );
}

function extractProvocativeHook(lesson: Lesson): string {
  // If there's an objective with a question or punchy thought
  if (lesson.objective && lesson.objective.length > 10) {
    return lesson.objective;
  }
  // Or check first page body for the first sentence
  const firstBody = lesson.pages[0]?.body || "";
  const firstSentence = firstBody.split(/\n|\. |\? |! /)[0]?.trim();
  if (firstSentence && firstSentence.length > 15) {
    return firstSentence + (firstSentence.endsWith("?") ? "" : ".");
  }
  return lesson.title;
}

const s = StyleSheet.create({
  container: {
    minHeight: 440,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  centerCard: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4EFE6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E6DFD3",
  },
  quoteText: {
    fontSize: 25,
    lineHeight: 38,
    fontWeight: "700",
    color: "#231B15",
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 28,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  line: {
    width: 24,
    height: 1,
    backgroundColor: "#D9D0C3",
  },
  label: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#8A7F70",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
