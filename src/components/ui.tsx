import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Icon, type IconName } from "./Icon";
export const theme = {
  bg: "#FFFDF1",
  ink: "#2C1C18",
  muted: "#867F73",
  line: "#D4D0C3",
  soft: "#F3F0E4",
  blue: "#7DCEF5",
  blueEdge: "#549BBC",
  green: "#B6C883",
  peach: "#F9D8C9",
};
export const ui = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "700",
    color: theme.ink,
    letterSpacing: -0.6,
  },
  body: { fontSize: 15, lineHeight: 23, color: theme.muted },
  label: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: theme.muted,
    fontWeight: "600",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 22,
    padding: 20,
    backgroundColor: theme.bg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: theme.ink,
    backgroundColor: "#FFFEF9",
  },
  divider: { height: 1, backgroundColor: theme.line, marginVertical: 20 },
});
export function Action({
  children,
  onPress,
  secondary = false,
  disabled = false,
  style,
  icon,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: secondary ? theme.bg : theme.blue,
          borderWidth: 1,
          borderColor: secondary ? theme.line : theme.blueEdge,
          borderBottomWidth: pressed ? 1 : 5,
          borderRadius: 14,
          minHeight: 51,
          paddingHorizontal: 14,
          paddingVertical: 12,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 9,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={19} />}
      <Text
        style={{
          fontSize: 13,
          letterSpacing: 1.2,
          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
          color: theme.ink,
          textAlign: "center",
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  selected = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        padding: 10,
        borderRadius: 14,
        backgroundColor: selected ? theme.soft : "transparent",
      }}
    >
      <Icon name={name} filled={selected} />
    </Pressable>
  );
}
export function Sprout({ size = 48 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: theme.ink,
        borderRadius: size * 0.4,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "-8deg" }],
      }}
    >
      <Icon name="sprout" size={size * 0.65} color={theme.bg} />
    </View>
  );
}
