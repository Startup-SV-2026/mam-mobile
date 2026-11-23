import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme as t, ui } from "./ui";
import { Icon } from "./Icon";

export interface VocabData {
  word: string;
  type: string;
  ipa: string;
  meaning: string;
  root: string;
  example: string;
  synonyms: string[];
}

export function FlashcardView({
  word,
  type,
  ipa,
  meaning,
  root,
  example,
  synonyms,
}: VocabData) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Flashcard từ ${word}. Nhấn để lật thẻ.`}
      onPress={() => setFlipped(!flipped)}
      style={[s.card, flipped ? s.cardBack : s.cardFront]}
    >
      <View style={s.badgeRow}>
        <View style={s.tag}>
          <Text style={s.tagText}>IELTS 8.0+ / SAT</Text>
        </View>
        <View style={ui.row}>
          <Icon name="review" size={16} color={t.accent} />
          <Text style={{ fontSize: 12, color: t.muted, marginLeft: 4 }}>
            {flipped ? "Chạm để xem từ" : "Chạm để lật nghĩa"}
          </Text>
        </View>
      </View>

      {!flipped ? (
        // MẶT TRƯỚC (Front)
        <View style={s.frontContent}>
          <Text style={s.word}>{word}</Text>
          <Text style={s.ipa}>
            {type} · {ipa}
          </Text>

          <View style={s.promptBox}>
            <Text style={s.promptLabel}>THỬ ĐOÁN NGHĨA TRONG NGỮ CẢNH:</Text>
            <Text style={s.promptText}>
              “{example.replace(new RegExp(word, "gi"), "_____")}”
            </Text>
          </View>

          <View style={s.hintFooter}>
            <Text style={s.hintText}>Chạm để xem nghĩa và ví dụ</Text>
          </View>
        </View>
      ) : (
        // MẶT SAU (Back)
        <View style={s.backContent}>
          <View style={s.headerBack}>
            <Text style={s.wordSmall}>{word}</Text>
            <Text style={s.meaning}>{meaning}</Text>
          </View>

          <View style={s.divider} />

          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Gốc từ</Text>
            <Text style={s.detailValue}>{root}</Text>
          </View>

          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Ví dụ</Text>
            <Text style={s.exampleText}>“{example}”</Text>
          </View>

          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Từ đồng nghĩa</Text>
            <View style={s.synonymRow}>
              {synonyms.map((sWord, idx) => (
                <View key={idx} style={s.synonymChip}>
                  <Text style={s.synonymText}>{sWord}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 1,
    padding: 20,
    marginVertical: 18,
    minHeight: 280,
    justifyContent: "space-between",
  },
  cardFront: {
    backgroundColor: t.surface,
    borderColor: t.line,
  },
  cardBack: {
    backgroundColor: t.selected,
    borderColor: t.accent,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: t.soft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: t.accent,
    letterSpacing: 0.5,
  },
  frontContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  word: {
    fontSize: 34,
    fontWeight: "800",
    color: t.ink,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  ipa: {
    fontSize: 15,
    color: t.muted,
    marginTop: 6,
    marginBottom: 20,
    fontStyle: "italic",
  },
  promptBox: {
    backgroundColor: t.soft,
    borderRadius: 14,
    padding: 14,
    width: "100%",
    gap: 6,
  },
  promptLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: t.muted,
    letterSpacing: 0.4,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 22,
    color: t.ink,
    fontStyle: "italic",
  },
  hintFooter: {
    marginTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: t.accent,
    fontWeight: "600",
  },
  backContent: {
    flex: 1,
    gap: 12,
  },
  headerBack: {
    gap: 4,
  },
  wordSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: t.accent,
  },
  meaning: {
    fontSize: 20,
    fontWeight: "800",
    color: t.ink,
  },
  divider: {
    height: 1,
    backgroundColor: t.line,
    marginVertical: 4,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: t.ink,
  },
  detailValue: {
    fontSize: 14,
    color: t.ink,
    lineHeight: 20,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 21,
    color: t.ink,
    fontStyle: "italic",
  },
  synonymRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  synonymChip: {
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  synonymText: {
    fontSize: 12,
    color: t.ink,
    fontWeight: "600",
  },
});
