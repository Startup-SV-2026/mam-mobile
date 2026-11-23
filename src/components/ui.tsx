import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Icon, type IconName } from "./Icon";
import { theme } from "../theme";
export { theme } from "../theme";
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
    backgroundColor: theme.surface,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: theme.ink,
    backgroundColor: theme.surface,
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
          backgroundColor: secondary ? theme.surface : theme.primary,
          borderWidth: 1,
          borderColor: secondary ? theme.line : theme.primaryEdge,
          borderBottomWidth: 1,
          borderRadius: 12,
          minHeight: 51,
          paddingHorizontal: 14,
          paddingVertical: 12,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 9,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={19}
          color={secondary ? theme.ink : theme.onPrimary}
        />
      )}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: secondary ? theme.ink : theme.onPrimary,
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
        backgroundColor: theme.primary,
        borderRadius: size * 0.4,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "-8deg" }],
      }}
    >
      <Icon name="sprout" size={size * 0.65} color={theme.onPrimary} />
    </View>
  );
}
