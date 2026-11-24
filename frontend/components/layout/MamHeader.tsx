import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon } from "../ui/Icon";
import { theme as t, ui } from "../ui/ui";
import { currentStreak } from "../../lib/learning";
import type { Screen } from "../../types/course";

interface MamHeaderProps {
  screen: Screen;
  title?: string;
  streak: number;
  lastStudy: string;
  xp: number;
  onToggleSidebar?: () => void;
}

export function MamHeader({
  screen,
  title,
  streak,
  lastStudy,
  xp,
  onToggleSidebar,
}: MamHeaderProps) {
  if (screen === "done" || screen === "auth") return null;

  return (
    <View style={styles.header}>
      {/* Left: Sidebar toggle icon if on home/course, or Screen Title */}
      <View style={styles.leftContainer}>
        {screen === "course" ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở danh sách khóa học"
            onPress={onToggleSidebar}
            style={styles.sidebarButton}
          >
            <Icon name="sidebar" size={24} color={t.ink} />
          </Pressable>
        ) : screen === "home" ? (
          <View style={[ui.row, { gap: 6, alignItems: "center" }]}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: t.ink, letterSpacing: -0.5 }}>
              mầm<Text style={{ color: t.accent }}>.</Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.screenTitle}>{title || "Mầm"}</Text>
        )}
      </View>

      {/* Right: Streak & XP indicators (Wondering exact 🛡 1  ⭐️ 0) */}
      <View style={[ui.row, { gap: 12 }]}>
        <View style={[ui.row, { gap: 3, alignItems: "center" }]}>
          <Icon name="shield" color={t.terracotta} size={16} />
          <Text style={styles.badgeText}>{currentStreak(streak, lastStudy)}</Text>
        </View>
        <View style={[ui.row, { gap: 3, alignItems: "center" }]}>
          <Icon name="star" color={t.terracotta} size={16} />
          <Text style={styles.badgeText}>{xp}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  sidebarButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: t.ink,
    letterSpacing: -0.6,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "500",
    color: t.terracotta,
  },
});
