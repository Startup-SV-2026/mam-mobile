import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon } from "../ui/Icon";
import { IconButton, theme as t, ui } from "../ui/ui";
import { currentStreak } from "../../lib/learning";
import type { Screen } from "../../types/course";

interface AppHeaderProps {
  screen: Screen;
  title: string;
  streak: number;
  lastStudy: string;
  xp: number;
  onExplore: () => void;
}

export function AppHeader({
  screen,
  title,
  streak,
  lastStudy,
  xp,
  onExplore,
}: AppHeaderProps) {
  if (screen === "done") return null;

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={{ fontSize: 26, fontWeight: "700", color: t.ink }}>
            {title}
          </Text>
        ) : screen === "create" ? (
          <Text style={styles.wordmark}>mầm.</Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở thư viện"
            onPress={onExplore}
          >
            <Icon name="library" color={t.muted} />
          </Pressable>
        )}
      </View>
      <View style={[ui.row, { gap: 13 }]}>
        <View style={[ui.row, { gap: 4 }]}>
          <Icon name="flame" color={t.muted} size={20} />
          <Text style={ui.body}>{currentStreak(streak, lastStudy)}</Text>
        </View>
        <View style={[ui.row, { gap: 4 }]}>
          <Icon name="star" color={t.muted} size={20} />
          <Text style={ui.body}>{xp}</Text>
        </View>
      </View>
    </View>
  );
}

interface ReaderHeaderProps {
  screen: "lesson" | "quiz";
  pageIndex: number;
  totalPages: number;
  isSaved: boolean;
  onClose: () => void;
  onOpenNotes: () => void;
  onToggleSave: () => void;
}

export function ReaderHeader({
  screen,
  pageIndex,
  totalPages,
  isSaved,
  onClose,
  onOpenNotes,
  onToggleSave,
}: ReaderHeaderProps) {
  const totalSteps = Math.max(1, totalPages + 1);
  const currentStep =
    screen === "quiz" ? totalSteps - 1 : Math.min(pageIndex, totalSteps - 2);

  return (
    <View style={styles.readerHeader}>
      <IconButton name="close" label="Đóng bài học" onPress={onClose} />
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep;
          const isPassed = i < currentStep;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                isActive && styles.activeDot,
                isPassed && styles.passedDot,
              ]}
            />
          );
        })}
      </View>
      <IconButton name="notes" label="Ghi chú bài học" onPress={onOpenNotes} />
      <IconButton
        name="bookmark"
        label={isSaved ? "Bỏ lưu thẻ" : "Lưu thẻ"}
        selected={isSaved}
        onPress={onToggleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 69,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  wordmark: {
    fontSize: 25,
    fontWeight: "700",
    color: t.ink,
  },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    paddingVertical: 10,
  },
  dotsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(35, 27, 21, 0.16)",
  },
  activeDot: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5CB9F2",
  },
  passedDot: {
    backgroundColor: "rgba(92, 185, 242, 0.4)",
  },
});
