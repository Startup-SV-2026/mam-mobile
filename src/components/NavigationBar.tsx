import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon, type IconName } from "./Icon";
import { theme as t } from "./ui";
import type { Screen } from "../types/course";

export interface TabItem {
  screen: Screen;
  icon: IconName;
  label: string;
}

export const TABS: TabItem[] = [
  { screen: "home", icon: "home", label: "Lộ trình" },
  { screen: "explore", icon: "library", label: "Thư viện" },
  { screen: "create", icon: "sparkle", label: "Tạo khóa" },
  { screen: "goals", icon: "review", label: "Mục tiêu" },
  { screen: "profile", icon: "profile", label: "Cá nhân" },
];

interface NavigationBarProps {
  activeScreen: Screen;
  onTabPress: (screen: Screen) => void;
}

export function NavigationBar({ activeScreen, onTabPress }: NavigationBarProps) {
  const activeTab =
    activeScreen === "course"
      ? "home"
      : activeScreen === "stats"
        ? "profile"
        : activeScreen === "podcast"
          ? "home"
          : activeScreen;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {TABS.map((item) => {
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
                size={22}
                color={isActive ? t.accent : t.muted}
                filled={isActive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 12,
    left: 14,
    right: 14,
  },
  bar: {
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.surface,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: t.ink,
    shadowOpacity: 0,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
  },
  tabButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabButtonActive: {
    backgroundColor: t.selected,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: t.accent,
    fontWeight: "700",
  },
  tabLabelInactive: {
    color: t.muted,
  },
});
