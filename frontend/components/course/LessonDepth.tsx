import React, { useState } from "react";
import { Text, TextInput, View, Pressable, StyleSheet } from "react-native";
import type { LessonPage } from "../../types/course";
import { Action, theme as t, ui } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { MamMascot } from "../mascot/MamMascot";

export function LessonDepth({ page }: { page: LessonPage }) {
  const [draft, setDraft] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState(false);

  if (!page.example && !page.selfCheck && !page.commonMistake) return null;

  return (
    <View style={styles.container}>
      {/* 1. TÌNH HUỐNG & VÍ DỤ PHÂN TÍCH */}
      {page.example && (
        <View style={styles.exampleCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgePill}>
              <Icon name="library" size={14} color={t.accent} />
              <Text style={styles.badgeText}>TÌNH HUỐNG THỰC TẾ</Text>
            </View>
            <Icon name="bookmark" size={16} color="rgba(35, 27, 21, 0.3)" />
          </View>

          <Text style={styles.scenarioText}>{page.example.scenario}</Text>

          <View style={styles.divider} />

          <View style={{ gap: 6 }}>
            <Text style={styles.subHeading}>Phân tích góc nhìn:</Text>
            <Text style={styles.explanationText}>{page.example.explanation}</Text>
          </View>
        </View>
      )}

      {/* 2. CÂU HỎI SUY NGẪM / THỬ ÁP DỤNG (Matching Reflection Card in Reference) */}
      {page.selfCheck && (
        <View style={styles.reflectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.reflectionTitle}>
              {page.selfCheck.question.length > 50
                ? "Câu hỏi suy ngẫm"
                : page.selfCheck.question}
            </Text>
            <Icon name="bookmark" size={16} color="rgba(35, 27, 21, 0.3)" />
          </View>

          <Text style={styles.reflectionPrompt}>
            {page.selfCheck.question}
          </Text>

          {/* Interactive Action Bar */}
          <View style={styles.actionBar}>
            <Pressable
              onPress={() => setShowInput(!showInput)}
              style={[styles.smallPillBtn, showInput && styles.smallPillBtnActive]}
            >
              <Text style={[styles.pillBtnText, showInput && styles.pillBtnTextActive]}>
                {showInput ? "Đóng ghi chú" : "Tự trả lời"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setHint(!hint)}
              style={[styles.smallPillBtn, hint && styles.smallPillBtnActive]}
            >
              <Text style={[styles.pillBtnText, hint && styles.pillBtnTextActive]}>
                {hint ? "Ẩn gợi ý" : "Gợi ý"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setAnswer(!answer)}
              style={[styles.smallPillBtn, answer && styles.smallPillBtnActive]}
            >
              <Text style={[styles.pillBtnText, answer && styles.pillBtnTextActive]}>
                {answer ? "Ẩn phân tích" : "Xem phân tích"}
              </Text>
            </Pressable>
          </View>

          {/* Optional Interactive Draft Input */}
          {showInput && (
            <View style={{ gap: 8, marginTop: 8 }}>
              <TextInput
                accessibilityLabel="Câu trả lời tự luyện"
                placeholder="Viết góc nhìn hoặc cách bạn sẽ xử lý…"
                placeholderTextColor={t.muted}
                multiline
                maxLength={3000}
                value={draft}
                onChangeText={setDraft}
                style={styles.textInput}
              />
            </View>
          )}

          {/* Hint callout */}
          {hint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintLabel}>💡 Gợi ý tư duy:</Text>
              <Text style={styles.hintText}>{page.selfCheck.hint}</Text>
            </View>
          )}

          {/* Answer / Expert Perspective */}
          {answer && (
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>🎯 Lập luận đối chiếu:</Text>
              <Text selectable style={styles.answerText}>
                {page.selfCheck.answer}
              </Text>
              <Text style={styles.answerSub}>
                So sánh lập luận này với trải nghiệm thực tế của bạn.
              </Text>
            </View>
          )}

          {/* Mascot Watermark in Reflection Card */}
          <View style={styles.reflectionMascot}>
            <MamMascot size={36} mood="thinking" />
          </View>
        </View>
      )}

      {/* 3. LƯU Ý & ĐIỂM MÙ THƯỜNG GẶP (Common Mistake Callout) */}
      {page.commonMistake && (
        <View style={styles.mistakeCard}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Icon name="review" size={16} color="#A33924" />
            <Text style={styles.mistakeTitle}>ĐIỂM MÙ CẦN TRÁNH</Text>
          </View>
          <Text style={styles.mistakeText}>{page.commonMistake}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    marginTop: 20,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(39, 132, 61, 0.08)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: t.accent,
  },
  exampleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.09)",
    padding: 18,
    gap: 12,
  },
  scenarioText: {
    fontSize: 15.5,
    lineHeight: 25,
    color: t.ink,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(35, 27, 21, 0.07)",
    marginVertical: 2,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: "600",
    color: t.muted,
  },
  explanationText: {
    fontSize: 14.5,
    lineHeight: 23,
    color: "#5C564E",
  },
  reflectionCard: {
    backgroundColor: "#F4EFE6", // warm tactile ivory matching reference
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.09)",
    padding: 18,
    gap: 12,
    position: "relative",
  },
  reflectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: t.ink,
    letterSpacing: -0.2,
    flex: 1,
    paddingRight: 10,
  },
  reflectionPrompt: {
    fontSize: 14.5,
    lineHeight: 23,
    color: "#4A433A",
    paddingRight: 34,
  },
  actionBar: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  smallPillBtn: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "rgba(35, 27, 21, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.08)",
  },
  smallPillBtnActive: {
    backgroundColor: "#27843D",
    borderColor: "#216E33",
  },
  pillBtnText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: t.ink,
  },
  pillBtnTextActive: {
    color: "#FFFFFF",
  },
  textInput: {
    minHeight: 85,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.12)",
    padding: 12,
    fontSize: 14,
    color: t.ink,
    textAlignVertical: "top",
  },
  hintBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 14,
    padding: 12,
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#5CB9F2",
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C7DA0",
  },
  hintText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: t.ink,
  },
  answerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: t.accent,
  },
  answerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: t.accent,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: t.ink,
  },
  answerSub: {
    fontSize: 11.5,
    color: t.muted,
  },
  reflectionMascot: {
    position: "absolute",
    right: 14,
    bottom: 12,
    opacity: 0.9,
  },
  mistakeCard: {
    backgroundColor: "#FAF1EE",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(163, 57, 36, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#A33924",
    padding: 16,
    gap: 6,
  },
  mistakeTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#A33924",
  },
  mistakeText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4A3B37",
  },
});
