import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { theme as t } from "../ui/ui";

interface FormattedBodyProps {
  body: string;
}

export function FormattedParagraph({ text }: { text: string }) {
  if (!text) return null;

  // Split tokens by **bold** or _underline_
  const tokens = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);

  return (
    <Text selectable style={styles.paragraph}>
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

  // Split text by multiple newlines into paragraphs
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {paragraphs.map((para, idx) => (
        <FormattedParagraph key={idx} text={para} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 17.5,
    lineHeight: 28,
    color: t.ink,
    letterSpacing: -0.15,
    marginBottom: 14,
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
});
