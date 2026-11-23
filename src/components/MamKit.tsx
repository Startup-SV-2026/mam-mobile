import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Icon, type IconName } from "./Icon";
import { theme as t } from "./ui";

// Shared Wondering-style building blocks, tinted for Mầm.

export const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "ui-monospace, SFMono-Regular, Menlo, monospace",
});

/** Bottom-up dark scrim so white titles read well on artwork. */
export function Scrim({ height = "60%" }: { height?: number | `${number}%` }) {
  return (
    <View pointerEvents="none" style={[styles.scrim, { height }]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="mamScrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0F1F14" stopOpacity="0" />
            <Stop offset="1" stopColor="#0F1F14" stopOpacity="0.62" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#mamScrim)" />
      </Svg>
    </View>
  );
}

/** Outlined monospace uppercase button, e.g. "XEM TẤT CẢ". */
export function MonoButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.mono, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.monoText}>{label.toLocaleUpperCase("vi")}</Text>
    </Pressable>
  );
}

/** Section header: accent icon + title + soft chip, optional right action. */
export function SectionHeader({
  icon,
  title,
  chip,
  action,
  onAction,
}: {
  icon?: IconName;
  title: string;
  chip?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {icon && <Icon name={icon} size={20} color={t.primary} />}
        <Text style={styles.headerTitle}>{title}</Text>
        {chip ? (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ) : null}
      </View>
      {action ? <MonoButton label={action} onPress={onAction} /> : null}
    </View>
  );
}

/** Small translucent dark chip used on top of artwork. */
export function ArtChip({ icon, label }: { icon?: IconName; label: string }) {
  return (
    <View style={styles.artChip}>
      {icon && <Icon name={icon} size={13} color="#FFFFFF" />}
      <Text style={styles.artChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  mono: {
    borderWidth: 1,
    borderColor: "#C9CFBC",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
  },
  monoText: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.2,
    color: t.ink,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: t.ink,
    letterSpacing: -0.4,
  },
  chip: {
    backgroundColor: t.soft,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    color: t.muted,
  },
  artChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15,31,20,0.55)",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 11,
  },
  artChipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
});
