import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { triggerHaptic, playSound } from "../../lib/feedback";
import { theme as t } from "../ui/ui";

export type SelfCheckVariant = "flip" | "contrast" | "poll";

interface SelfCheckCardProps {
  selfCheck?: {
    question: string;
    hint: string;
    answer: string;
  };
  commonMistake?: string;
  pageIndex?: number;
  variant?: SelfCheckVariant;
}

const INK = "#231B15";

export function SelfCheckCard({
  selfCheck,
  commonMistake,
  pageIndex = 0,
  variant: forcedVariant,
}: SelfCheckCardProps) {
  // Mỗi trang hiển thị đúng 1 variant duy nhất luân phiên theo trang:
  // Trang 1 -> Flip Card, Trang 2 -> Contrast Card, Trang 3 -> Poll Card
  const variant: SelfCheckVariant =
    forcedVariant ??
    (pageIndex % 3 === 1 ? "contrast" : pageIndex % 3 === 2 ? "poll" : "flip");

  const [flipped, setFlipped] = useState(false);
  const [pollSelected, setPollSelected] = useState<"A" | "B" | null>(null);
  const [activeContrast, setActiveContrast] = useState<"mistake" | "breakthrough" | null>("breakthrough");

  if (!selfCheck?.question) return null;

  return (
    <View style={styles.cardContainer}>
      {/* ============================================================ */}
      {/* Variant 1: Thẻ Lật Thử Thách (Flip Mode)                     */}
      {/* ============================================================ */}
      {variant === "flip" && (
        <View style={styles.flipCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeFlip}>
              <Text style={styles.badgeIcon}>🃏</Text>
              <Text style={styles.badgeTextFlip}>
                {flipped ? "LỜI GIẢI & GÓC NHÌN MỚI" : "TỰ THỬ THÁCH BẢN THÂN"}
              </Text>
            </View>
            <Text style={styles.tagLabel}>Dành 10 giây suy ngẫm</Text>
          </View>

          {!flipped ? (
            <View style={{ gap: 12 }}>
              <Text style={styles.questionText}>{selfCheck.question}</Text>

              {selfCheck.hint ? (
                <View style={styles.hintBox}>
                  <Text style={styles.hintEmoji}>💡</Text>
                  <Text style={styles.hintContent}>
                    <Text style={{ fontWeight: "700" }}>Gợi ý nhỏ: </Text>
                    {selfCheck.hint}
                  </Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  triggerHaptic("medium");
                  playSound("flip");
                  setFlipped(true);
                }}
                style={styles.flipActionBtn}
              >
                <Text style={styles.flipActionText}>
                  Lật thẻ xem câu trả lời & góc nhìn mới ↺
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <Text style={styles.quoteQuestion}>“{selfCheck.question}”</Text>

              <View style={styles.answerCard}>
                <View style={styles.boxTitleRow}>
                  <Text style={styles.answerIcon}>🎯</Text>
                  <Text style={styles.answerTitle}>BẢN CHẤT VẤN ĐỀ LÀ GÌ?</Text>
                </View>
                <Text style={styles.boxBodyText}>{selfCheck.answer}</Text>
              </View>

              {commonMistake ? (
                <View style={styles.mistakeCard}>
                  <View style={styles.boxTitleRow}>
                    <Text style={styles.mistakeIcon}>⚠️</Text>
                    <Text style={styles.mistakeTitle}>
                      SAI LẦM PHỔ BIẾN NHIỀU NGƯỜI HAY MẮC
                    </Text>
                  </View>
                  <Text style={styles.boxBodyText}>{commonMistake}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  triggerHaptic("light");
                  playSound("tap");
                  setFlipped(false);
                }}
                style={styles.unflipBtn}
              >
                <Text style={styles.unflipText}>↩ Đọc lại câu hỏi</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* ============================================================ */}
      {/* Variant 2: Đối Chiếu Hai Cực (Mindset Contrast Mode)          */}
      {/* ============================================================ */}
      {variant === "contrast" && (
        <View style={styles.contrastCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeContrast}>
              <Text style={styles.badgeIcon}>⚖️</Text>
              <Text style={styles.badgeTextContrast}>ĐỔI GÓC NHÌN</Text>
            </View>
            <Text style={styles.tagLabel}>Thói quen cũ vs Cách làm mới</Text>
          </View>

          <Text style={styles.questionText}>{selfCheck.question}</Text>

          {selfCheck.hint ? (
            <View style={styles.hintBox}>
              <Text style={styles.hintEmoji}>💡</Text>
              <Text style={styles.hintContent}>
                <Text style={{ fontWeight: "700" }}>Gợi ý suy ngẫm: </Text>
                {selfCheck.hint}
              </Text>
            </View>
          ) : null}

          {/* Hai thẻ đối chiếu được diễn giải dễ hiểu */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {commonMistake ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  triggerHaptic("selection");
                  playSound("tap");
                  setActiveContrast(activeContrast === "mistake" ? null : "mistake");
                }}
                style={[
                  styles.versusItem,
                  styles.versusMistake,
                  activeContrast === "mistake" && styles.versusSelected,
                ]}
              >
                <View style={styles.versusHeaderRow}>
                  <View style={styles.versusBadgeMistake}>
                    <Text style={styles.versusBadgeTextMistake}>
                      🛑 CÁCH NGHĨ CŨ (DỄ MẮC BẪY)
                    </Text>
                  </View>
                  <Text style={styles.versusIndicator}>
                    {activeContrast === "mistake" ? "Thu gọn ▲" : "Chạm để đọc kỹ ▼"}
                  </Text>
                </View>
                <Text style={styles.versusExplainer}>
                  Thói quen chúng ta hay mắc phải nhưng ít khi hiệu quả lâu dài:
                </Text>
                <Text
                  numberOfLines={activeContrast === "mistake" ? undefined : 2}
                  style={styles.versusContent}
                >
                  {commonMistake}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                triggerHaptic("selection");
                playSound("reveal");
                setActiveContrast(activeContrast === "breakthrough" ? null : "breakthrough");
              }}
              style={[
                styles.versusItem,
                styles.versusBreakthrough,
                activeContrast === "breakthrough" && styles.versusSelected,
              ]}
            >
              <View style={styles.versusHeaderRow}>
                <View style={styles.versusBadgeBreakthrough}>
                  <Text style={styles.versusBadgeTextBreakthrough}>
                    ✨ CÁCH NGHĨ MỚI (HIỆU QUẢ HƠN)
                  </Text>
                </View>
                <Text style={styles.versusIndicator}>
                  {activeContrast === "breakthrough" ? "Thu gọn ▲" : "Chạm để đọc kỹ ▼"}
                </Text>
              </View>
              <Text style={styles.versusExplainer}>
                Góc nhìn sâu hơn giúp bạn tạo ra bước chuyển biến thật sự:
              </Text>
              <Text
                numberOfLines={activeContrast === "breakthrough" ? undefined : 2}
                style={styles.versusContent}
              >
                {selfCheck.answer}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ============================================================ */}
      {/* Variant 3: Khảo Sát Tương Tác Nhanh (Poll Mode)              */}
      {/* ============================================================ */}
      {variant === "poll" && (
        <View style={styles.pollCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePoll}>
              <Text style={styles.badgeIcon}>🗳️</Text>
              <Text style={styles.badgeTextPoll}>NẾU LÀ BẠN?</Text>
            </View>
            <Text style={styles.tagLabel}>Khảo sát suy nghĩ</Text>
          </View>

          <Text style={styles.questionText}>{selfCheck.question}</Text>

          <Text style={styles.pollPrompt}>
            Chọn phương án giống thói quen hiện tại của bạn nhất:
          </Text>

          {/* Interactive Option Chips */}
          <View style={{ gap: 8, marginTop: 2 }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                triggerHaptic("selection");
                playSound("tap");
                setPollSelected("A");
              }}
              style={[
                styles.pollOption,
                pollSelected === "A" && styles.pollOptionChosen,
              ]}
            >
              <View style={styles.pollOptionLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    pollSelected === "A" && styles.radioCircleActive,
                  ]}
                >
                  {pollSelected === "A" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.pollOptionText}>
                  Mình thường làm theo thói quen cũ (chỉ nhìn kết quả trước mắt)
                </Text>
              </View>
              {pollSelected !== null && (
                <Text style={styles.pollPercent}>32% người chọn</Text>
              )}
            </Pressable>

            {pollSelected !== null && (
              <View style={styles.pollProgressBarBg}>
                <View
                  style={[
                    styles.pollProgressBarFill,
                    { width: "32%", backgroundColor: "#E5DEC9" },
                  ]}
                />
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                triggerHaptic("selection");
                playSound("tap");
                setPollSelected("B");
              }}
              style={[
                styles.pollOption,
                pollSelected === "B" && styles.pollOptionChosen,
              ]}
            >
              <View style={styles.pollOptionLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    pollSelected === "B" && styles.radioCircleActive,
                  ]}
                >
                  {pollSelected === "B" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.pollOptionText}>
                  Mình sẽ dừng lại tìm nguyên nhân thật sự (để thay đổi cách làm)
                </Text>
              </View>
              {pollSelected !== null && (
                <Text style={[styles.pollPercent, { color: "#1B6D9B" }]}>
                  68% người chọn
                </Text>
              )}
            </Pressable>

            {pollSelected !== null && (
              <View style={styles.pollProgressBarBg}>
                <View
                  style={[
                    styles.pollProgressBarFill,
                    { width: "68%", backgroundColor: "#72C3FA" },
                  ]}
                />
              </View>
            )}
          </View>

          {/* Revealed Insight after Voting */}
          {pollSelected !== null ? (
            <View style={{ gap: 10, marginTop: 10 }}>
              <View style={styles.answerCard}>
                <View style={styles.boxTitleRow}>
                  <Text style={styles.answerIcon}>💡</Text>
                  <Text style={styles.answerTitle}>
                    VÌ SAO CÁCH THỨ HAI LẠI HIỆU QUẢ HƠN?
                  </Text>
                </View>
                <Text style={styles.boxBodyText}>{selfCheck.answer}</Text>
              </View>

              {commonMistake ? (
                <View style={styles.mistakeCard}>
                  <View style={styles.boxTitleRow}>
                    <Text style={styles.mistakeIcon}>⚠️</Text>
                    <Text style={styles.mistakeTitle}>
                      SAI LẦM PHỔ BIẾN BẠN NÊN TRÁNH
                    </Text>
                  </View>
                  <Text style={styles.boxBodyText}>{commonMistake}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  triggerHaptic("light");
                  playSound("tap");
                  setPollSelected(null);
                }}
                style={styles.unflipBtn}
              >
                <Text style={styles.unflipText}>Chọn lại phương án khác ↺</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 18,
  },

  // Flip Variant
  flipCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#FAF6EE",
    borderWidth: 1.5,
    borderColor: "#E5DEC9",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeFlip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFE6D4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeTextFlip: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D5F4D",
    letterSpacing: 0.6,
  },

  // Contrast Variant
  contrastCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#FDFBF7",
    borderWidth: 1.5,
    borderColor: "#E2D9C4",
    gap: 12,
  },
  badgeContrast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EDEBF8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeTextContrast: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5B4A8C",
    letterSpacing: 0.6,
  },

  // Poll Variant
  pollCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#FAF8F3",
    borderWidth: 1.5,
    borderColor: "#E2D9C4",
    gap: 12,
  },
  badgePoll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF3D6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeTextPoll: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B6214",
    letterSpacing: 0.6,
  },

  badgeIcon: {
    fontSize: 12,
  },
  tagLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#8E806D",
  },
  questionText: {
    fontSize: 16.5,
    lineHeight: 24,
    fontWeight: "700",
    color: INK,
  },
  quoteQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#6E6252",
    fontStyle: "italic",
    paddingHorizontal: 4,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.08)",
  },
  hintEmoji: {
    fontSize: 13,
    marginTop: 1,
  },
  hintContent: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18.5,
    color: "#5B5143",
  },

  // Flip Action Buttons
  flipActionBtn: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
  },
  flipActionText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FDFBF7",
  },
  unflipBtn: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  unflipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#7A6C58",
  },

  // Boxes
  answerCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#72C3FA",
    gap: 6,
  },
  mistakeCard: {
    backgroundColor: "#FFF8F5",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F0735E",
    gap: 5,
  },
  boxTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  answerIcon: {
    fontSize: 13,
  },
  answerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B6D9B",
    letterSpacing: 0.6,
  },
  mistakeIcon: {
    fontSize: 13,
  },
  mistakeTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B83A26",
    letterSpacing: 0.6,
  },
  boxBodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: INK,
  },

  // Versus Mode
  versusItem: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  versusMistake: {
    backgroundColor: "#FFF7F4",
    borderColor: "#F5C8BE",
  },
  versusBreakthrough: {
    backgroundColor: "#F2F9F5",
    borderColor: "#B8E3D5",
  },
  versusSelected: {
    borderColor: INK,
    borderWidth: 2,
  },
  versusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  versusBadgeMistake: {
    backgroundColor: "#FFEBE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  versusBadgeTextMistake: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B83A26",
    letterSpacing: 0.5,
  },
  versusBadgeBreakthrough: {
    backgroundColor: "#E2F4ED",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  versusBadgeTextBreakthrough: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1B8062",
    letterSpacing: 0.5,
  },
  versusIndicator: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7A6C58",
  },
  versusExplainer: {
    fontSize: 12,
    color: "#7A6C58",
    fontStyle: "italic",
    lineHeight: 16,
  },
  versusContent: {
    fontSize: 13.5,
    lineHeight: 19.5,
    color: INK,
  },

  // Poll Mode
  pollOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DFD7C2",
  },
  pollOptionChosen: {
    borderColor: INK,
    backgroundColor: "#FAF6EE",
  },
  pollOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#9E907E",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: INK,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: INK,
  },
  pollOptionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: INK,
    flex: 1,
  },
  pollPercent: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7A6C58",
  },
  pollProgressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(35, 27, 21, 0.06)",
    overflow: "hidden",
    marginHorizontal: 4,
    marginTop: -2,
    marginBottom: 4,
  },
  pollProgressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  pollPrompt: {
    fontSize: 12.5,
    color: "#7A6C58",
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: 4,
  },
});
