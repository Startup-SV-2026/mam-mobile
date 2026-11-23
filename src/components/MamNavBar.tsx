import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Icon, type IconName } from "./Icon";
import { theme as t } from "./ui";
import { MamMascot } from "./MamMascot";
import type { Screen } from "../types/course";

export interface MamTabItem {
  screen: Screen;
  icon: IconName;
  label: string;
}

export const MAM_TABS: MamTabItem[] = [
  { screen: "home", icon: "home", label: "Trang chủ" },
  { screen: "create", icon: "sparkle", label: "Tạo khóa" },
  { screen: "goals", icon: "brain", label: "Mục tiêu" },
  { screen: "explore", icon: "library", label: "Thư viện" },
  { screen: "profile", icon: "profile", label: "Cá nhân" },
];

interface MamNavBarProps {
  activeScreen: Screen;
  onTabPress: (screen: Screen) => void;
  onTutorPress: () => void;
}

export function MamNavBar({
  activeScreen,
  onTabPress,
  onTutorPress,
}: MamNavBarProps) {
  const activeTab =
    activeScreen === "course"
      ? "home"
      : activeScreen === "stats"
        ? "profile"
        : activeScreen === "podcast"
          ? "home"
          : activeScreen;

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.pillBar}>
        {MAM_TABS.map((item) => {
          const isActive = activeTab === item.screen;
          return (
            <Pressable
              key={item.screen}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabPress(item.screen)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Icon
                name={item.icon}
                size={23}
                color={isActive ? t.primary : t.muted}
                filled={isActive}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Floating Mascot / AI Tutor Action Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hỏi gia sư Mầm"
        onPress={onTutorPress}
        style={styles.mascotFab}
      >
        <MamMascot size={46} mood="happy" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 16,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pillBar: {
    flex: 1,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: t.line,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: t.ink,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: t.selected,
  },
  mascotFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: t.ink,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
