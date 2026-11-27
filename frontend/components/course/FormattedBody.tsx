import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { theme as t } from "../ui/ui";
import { cleanParagraphBreaks } from "../../lib/visual-design";

interface FormattedBodyProps {
  body: string;
}

export function FormattedParagraph({
  text,
  style,
}: {
  text: string;
  style?: any;
}) {
  if (!text) return null;

  // Strip any accidental inline HTML tags like <span> or <div>, and sanitize token glitches like 10 11
  const clean = text
    .replace(/(?:(?<=[.!?…]["'”]?)\s*10\s+(?:10|11)\s*|(?<=\S)\s+10\s+(?:10|11)\s+(?=[A-ZÀ-ỸĐ]))/gu, " ")
    .replace(/<[^>]+>/g, "");

  // Split tokens by **bold** or _underline_
  const tokens = clean.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);

  return (
    <Text selectable style={[styles.paragraph, style]}>
      {tokens.map((token, i) => {
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          return (
            <Text key={i} style={styles.boldText}>
              {token.slice(2, -2)}
            </Text>
          );
        }
        if (token.startsWith("_") && token.endsWith("_") && token.length > 2) {
          return (
            <Text key={i} style={styles.termText}>
              {token.slice(1, -1)}
            </Text>
          );
        }
        return token;
      })}
    </Text>
  );
}

export function FormattedBody({ body }: FormattedBodyProps) {
  if (!body) return null;

  // Convert HTML linebreaks/divs to real newlines, clean token glitches (like ASCII 10 11), and strip remaining tags
  const normalized = cleanParagraphBreaks(body);

  // Split text by multiple newlines into paragraphs/blocks
  const blocks = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {blocks.map((block, idx) => {
        // 1. Callout / Highlight card (> blockquote or 💡 / 📌 / ⚡)
        if (block.startsWith(">") || /^[💡📌⚡⭐]/.test(block)) {
          const cleanText = block.replace(/^[>💡📌⚡⭐]\s*/, "").trim();
          return (
            <View key={idx} style={styles.calloutCard}>
              <View style={styles.calloutHeader}>
                <Text style={styles.calloutIcon}>💡</Text>
                <Text style={styles.calloutLabel}>ĐIỂM SÁNG CẦN NHỚ</Text>
              </View>
              <FormattedParagraph text={cleanText} style={styles.calloutText} />
            </View>
          );
        }

        // 2. Bullet list block (lines starting with - or • or *)
        const lines = block
          .split(/\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const isBulletList =
          lines.length > 1 && lines.every((l) => /^[-*•]\s+/.test(l));
        if (isBulletList) {
          return (
            <View key={idx} style={styles.listContainer}>
              {lines.map((line, lineIdx) => (
                <View key={lineIdx} style={styles.bulletRow}>
                  <View style={styles.bulletDot}>
                    <Text style={{ fontSize: 13 }}>🌱</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormattedParagraph
                      text={line.replace(/^[-*•]\s+/, "")}
                      style={styles.bulletText}
                    />
                  </View>
                </View>
              ))}
            </View>
          );
        }

        // 3. Numbered list block (1. , 2. )
        const isNumberedList =
          lines.length > 1 && lines.every((l) => /^\d+[\.\)]\s+/.test(l));
        if (isNumberedList) {
          return (
            <View key={idx} style={styles.listContainer}>
              {lines.map((line, lineIdx) => {
                const match = line.match(/^(\d+)[\.\)]\s+(.*)/);
                const num = match ? match[1] : `${lineIdx + 1}`;
                const itemText = match ? match[2] : line;
                return (
                  <View key={lineIdx} style={styles.numberedRow}>
                    <View style={styles.numberBadge}>
                      <Text style={styles.numberBadgeText}>{num}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <FormattedParagraph
                        text={itemText}
                        style={styles.bulletText}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          );
        }

        // 4. Standard Paragraph
        return <FormattedParagraph key={idx} text={block} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 16,
    gap: 12,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 27.5,
    color: t.ink,
    letterSpacing: -0.15,
  },
  boldText: {
    fontWeight: "700",
    color: t.ink,
  },
  termText: {
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: "rgba(35, 27, 21, 0.45)",
  },
  listContainer: {
    gap: 10,
    marginVertical: 4,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  bulletDot: {
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16.5,
    lineHeight: 25,
    color: t.ink,
  },
  numberedRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: t.selected,
    borderWidth: 1,
    borderColor: "rgba(39, 132, 61, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: t.accent,
  },
  calloutCard: {
    backgroundColor: "#F7F4EC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(35, 27, 21, 0.08)",
    borderLeftWidth: 4,
    borderLeftColor: t.primary,
    padding: 14,
    gap: 8,
    marginVertical: 6,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  calloutIcon: {
    fontSize: 14,
  },
  calloutLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: t.accent,
  },
  calloutText: {
    fontSize: 15.5,
    lineHeight: 24,
    color: t.ink,
    fontWeight: "500",
  },
});
