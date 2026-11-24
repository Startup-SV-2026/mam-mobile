import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Icon, type IconName } from "./Icon";
import { theme as t } from "./ui";
import type { Screen } from "../types/course";

export interface MamTabItem {
  screen: Screen;
  icon: IconName;
  label: string;
}

// Wondering exact 5 tabs: Home, Sparkle, Brain, Books (slanted library), Profile
export const MAM_TABS: MamTabItem[] = [
  { screen: "home", icon: "home", label: "Trang chủ" },
  { screen: "create", icon: "sparkle", label: "Tạo khóa" },
  { screen: "goals", icon: "brain", label: "Mục tiêu" },
  { screen: "explore", icon: "books", label: "Thư viện" },
  { screen: "profile", icon: "profile", label: "Cá nhân" },
];

interface MamNavBarProps {
  activeScreen: Screen;
  onTabPress: (screen: Screen) => void;
  onTutorPress: () => void;
}

/** Biểu tượng Mầm đặc trưng: Hai lá mầm mềm mại vươn lên từ chồi sống */
function MamSproutIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      {/* Thân mầm uốn lượn nhẹ tự nhiên */}
      <Path
        d="M18 31C18 23 18 17 18 15"
        stroke="#216E33"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      {/* Hạt giống / gốc mầm */}
      <Circle cx={18} cy={30.5} r={2.5} fill="#216E33" />
      {/* Lá mầm bên trái (xanh Mầm đậm) */}
      <Path
        d="M17.5 17.5C17 10 9.5 5 4 7C3.5 14.5 9.5 19.5 17.5 17.5Z"
        fill="#27843D"
      />
      {/* Gân lá trái */}
      <Path
        d="M17 17C12 15 8 11.5 6 8.5"
        stroke="#1E6530"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Lá mầm bên phải (xanh chồi non tươi sáng) */}
      <Path
        d="M18 15C18.5 7.5 25 3.5 31.5 5C32.5 12.5 26.5 17.5 18 15Z"
        fill="#48B363"
      />
      {/* Gân lá phải */}
      <Path
        d="M18.5 14.5C23.5 12.5 27.5 9 29.5 6.5"
        stroke="#38944E"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
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
                size={22}
                color={isActive ? "#FFFFFF" : t.ink}
                filled={isActive}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Nút biểu tượng Mầm / Gia sư Mầm */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hỏi gia sư Mầm"
        onPress={onTutorPress}
        style={({ pressed }) => [
          styles.mamSproutButton,
          pressed && { transform: [{ scale: 0.92 }] },
        ]}
      >
        <MamSproutIcon size={36} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pillBar: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(237, 231, 220, 0.85)",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: t.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  tabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: t.deep,
    shadowColor: t.deep,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  mamSproutButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1.5,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: t.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
