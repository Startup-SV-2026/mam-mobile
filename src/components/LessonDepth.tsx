import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import type { LessonPage } from "../types/course";
import { Action, theme as t, ui } from "./ui";
export function LessonDepth({ page }: { page: LessonPage }) {
  const [draft, setDraft] = useState(""),
    [hint, setHint] = useState(false),
    [answer, setAnswer] = useState(false);
  if (!page.example && !page.selfCheck && !page.commonMistake) return null;
  return (
    <View style={{ gap: 20, marginTop: 24, marginBottom: 20 }}>
      {page.example && (
        <View style={[ui.card, { gap: 12 }]}>
          <Text style={[ui.label, { color: t.accent }]}>
            VÍ DỤ CÓ GIẢI THÍCH
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 26, color: t.ink }}>
            {page.example.scenario}
          </Text>
          <View style={ui.divider} />
          <Text style={ui.body}>{page.example.explanation}</Text>
        </View>
      )}
      {page.selfCheck && (
        <View style={{ gap: 13 }}>
          <Text style={[ui.label, { color: t.accent }]}>THỬ ÁP DỤNG</Text>
          <Text
            style={{
              fontSize: 17,
              lineHeight: 27,
              fontWeight: "500",
              color: t.ink,
            }}
          >
            {page.selfCheck.question}
          </Text>
          <TextInput
            accessibilityLabel="Câu trả lời tự luyện"
            placeholder="Viết cách bạn giải quyết…"
            placeholderTextColor={t.muted}
            multiline
            maxLength={3000}
            value={draft}
            onChangeText={setDraft}
            style={[ui.input, { minHeight: 100, textAlignVertical: "top" }]}
          />
          <View style={[ui.row, { gap: 8 }]}>
            <Action
              secondary
              style={{ flex: 1 }}
              onPress={() => setHint(!hint)}
            >
              {hint ? "Ẩn gợi ý" : "Gợi ý"}
            </Action>
            <Action
              secondary
              style={{ flex: 1 }}
              onPress={() => setAnswer(!answer)}
            >
              {answer ? "Ẩn lời giải" : "Xem lời giải"}
            </Action>
          </View>
          {hint && (
            <Text accessibilityLiveRegion="polite" style={ui.body}>
              {page.selfCheck.hint}
            </Text>
          )}
          {answer && (
            <View style={[ui.card, { gap: 8, backgroundColor: t.selected }]}>
              <Text style={{ fontWeight: "600", color: t.ink }}>
                Lời giải tham khảo
              </Text>
              <Text
                selectable
                style={{ fontSize: 15, lineHeight: 25, color: t.ink }}
              >
                {page.selfCheck.answer}
              </Text>
              <Text style={{ fontSize: 12, color: t.muted }}>
                Đối chiếu cách lập luận với câu trả lời của bạn.
              </Text>
            </View>
          )}
        </View>
      )}
      {page.commonMistake && (
        <View
          style={{
            borderLeftWidth: 3,
            borderColor: t.accent,
            paddingLeft: 14,
            gap: 7,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: t.ink }}>
            Dễ nhầm
          </Text>
          <Text style={ui.body}>{page.commonMistake}</Text>
        </View>
      )}
    </View>
  );
}
