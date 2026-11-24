import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Icon, type IconName } from "./Icon";
import { theme } from "../theme";
export { theme } from "../theme";
import { TactileButton, monoFont } from "./TactileButton";
export { TactileButton, monoFont } from "./TactileButton";

export const ui = StyleSheet.create({
  title: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "700",
    color: theme.ink,
    letterSpacing: -0.5,
  },
  body: { fontSize: 15, lineHeight: 23, color: theme.muted },
  label: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.4,
    color: theme.muted,
    fontWeight: "600",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: {
    borderWidth: 1.5,
    borderColor: theme.line,
    borderRadius: 26,
    padding: 20,
    backgroundColor: theme.surface,
    shadowColor: theme.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.line,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: theme.ink,
    backgroundColor: "#FFFFFF",
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
  arrow = false,
  size = "lg",
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
  arrow?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <TactileButton
      variant={secondary ? "secondary" : "primary"}
      size={size}
      disabled={disabled}
      onPress={onPress}
      icon={icon}
      arrow={arrow}
      style={style}
    >
      {children}
    </TactileButton>
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
      style={({ pressed }) => ({
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: selected ? theme.soft : pressed ? theme.soft : theme.surface,
        borderWidth: 1.5,
        borderColor: selected ? theme.primary : theme.line,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: theme.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
        transform: pressed ? [{ scale: 0.95 }] : [],
      })}
    >
      <Icon
        name={name}
        filled={selected}
        size={17}
        color={selected ? theme.primary : theme.ink}
      />
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
