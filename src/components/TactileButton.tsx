import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Icon, type IconName } from "./Icon";
import { theme as t } from "../theme";

export const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "ui-monospace, SFMono-Regular, Menlo, monospace",
});

interface TactileButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "neutral";
  size?: "md" | "lg";
  disabled?: boolean;
  icon?: IconName;
  arrow?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * TactileButton:
 * Wondering-signature 3D mechanical push button with physical bottom rim bevel,
 * crisp uppercase monospace text, and mechanical depression on press.
 */
export function TactileButton({
  children,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  icon,
  arrow = false,
  style,
}: TactileButtonProps) {
  const isSecondary = variant === "secondary";
  const isNeutral = variant === "neutral";

  // Colors:
  // Primary: Mầm green face with darker green bevel rim
  // Secondary: Clean white face with warm beige bevel rim
  // Neutral: Warm clay grey face with darker grey bevel rim (like image 2)
  const faceBg = isSecondary
    ? "#FFFFFF"
    : isNeutral
      ? "#8D8882"
      : t.primary;

  const rimBg = isSecondary
    ? "#C8BEAF"
    : isNeutral
      ? "#68645F"
      : t.primaryEdge;

  const textColor = isSecondary ? t.ink : "#FFFFFF";
  const borderColor = isSecondary ? "#DDD5C6" : rimBg;

  const height = size === "lg" ? 50 : 40;
  const borderRadius = size === "lg" ? 16 : 13;
  const bevel = 4;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        { height: height + bevel },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {/* Bottom bevel rim (anchored to bottom) */}
          <View
            style={[
              styles.rim,
              {
                height,
                borderRadius,
                backgroundColor: rimBg,
                top: bevel,
              },
            ]}
          />

          {/* Top face that depresses when pressed */}
          <View
            style={[
              styles.face,
              {
                height,
                borderRadius,
                backgroundColor: faceBg,
                borderColor,
                top: pressed ? bevel : 0,
              },
            ]}
          >
            {arrow && (
              <Text
                style={[
                  styles.arrowText,
                  { color: textColor, marginRight: 6 },
                ]}
              >
                ↗
              </Text>
            )}
            {icon && (
              <View style={{ marginRight: 6 }}>
                <Icon
                  name={icon}
                  size={size === "lg" ? 17 : 15}
                  color={textColor}
                />
              </View>
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: textColor,
                  fontSize: size === "lg" ? 13 : 11,
                  letterSpacing: size === "lg" ? 1.6 : 1.2,
                },
              ]}
            >
              {typeof children === "string"
                ? children.toLocaleUpperCase("vi")
                : children}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
  },
  rim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  face: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  arrowText: {
    fontFamily: monoFont,
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontFamily: monoFont,
    fontWeight: "700",
    textAlign: "center",
  },
});
