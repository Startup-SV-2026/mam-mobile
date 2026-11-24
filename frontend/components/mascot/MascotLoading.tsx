import React from "react";
import { Text, View } from "react-native";
import { MamMascot } from "./MamMascot";
import { theme as t } from "../../styles/theme";
/** Indeterminate status: animation signals waiting, never invents a percentage. */
export function MascotLoading({
  label,
  detail,
  compact = false,
  size,
}: {
  label: string;
  detail?: string;
  compact?: boolean;
  size?: number;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      accessibilityLiveRegion="polite"
      style={{
        flexDirection: compact ? "row" : "column",
        alignItems: "center",
        justifyContent: compact ? "flex-start" : "center",
        gap: compact ? 10 : 16,
        paddingVertical: compact ? 6 : 24,
      }}
    >
      <MamMascot size={size ?? (compact ? 52 : 128)} mood="thinking" />
      <View
        style={{
          gap: 7,
          ...(compact ? { flex: 1 } : { alignSelf: "stretch" as const }),
        }}
      >
        <Text
          style={{
            color: t.ink,
            fontSize: compact ? 14 : 22,
            lineHeight: compact ? 22 : 30,
            fontWeight: compact ? "500" : "600",
            textAlign: compact ? "left" : "center",
          }}
        >
          {label}
        </Text>
        {detail && (
          <Text
            style={{
              color: t.muted,
              fontSize: 13,
              lineHeight: 21,
              textAlign: compact ? "left" : "center",
            }}
          >
            {detail}
          </Text>
        )}
      </View>
    </View>
  );
}
