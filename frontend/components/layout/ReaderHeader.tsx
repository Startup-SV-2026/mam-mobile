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
  return (
    <View style={styles.readerHeader}>
      <IconButton name="close" label="Đóng bài học" onPress={onClose} />
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${screen === "quiz" ? 100 : ((pageIndex + 1) / totalPages) * 100}%`,
            },
          ]}
        />
      </View>
      <Text style={{ color: t.ink, fontSize: 13 }}>
        {screen === "quiz" ? "?" : `${pageIndex + 1}/${totalPages}`}
      </Text>
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
    paddingHorizontal: 9,
    gap: 3,
    paddingVertical: 7,
  },
  track: {
    height: 9,
    borderRadius: 7,
    backgroundColor: t.line,
    flex: 1,
    overflow: "hidden",
    marginRight: 6,
  },
  fill: {
    height: "100%",
    backgroundColor: t.accent,
    borderRadius: 7,
  },
});
