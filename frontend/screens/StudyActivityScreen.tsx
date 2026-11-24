import React, { useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import type { Activity } from "../lib/study-plan";
import { Action, theme as t, ui } from "../components/ui/ui";
export function StudyActivity({
  activity: a,
  draft,
  onDraft,
  onDone,
}: {
  activity: Activity;
  draft: string;
  onDraft: (v: string) => void;
  onDone: () => void;
}) {
  const [revealed, setRevealed] = useState(false),
    [choice, setChoice] = useState<number | null>(null),
    [checked, setChecked] = useState(false),
    [term, setTerm] = useState<number | null>(null),
    [matched, setMatched] = useState<number[]>([]),
    [message, setMessage] = useState("");
  const labels = {
    flashcard: "FLASHCARD",
    gap: "ĐIỀN TỪ",
    match: "GHÉP NGHĨA",
    reading: "ĐỌC HIỂU",
    writing: "LUYỆN VIẾT",
  };
  return (
    <View style={[ui.card, { gap: 16 }]}>
      <Text style={ui.label}>{labels[a.kind]}</Text>
      <Text style={{ fontSize: 19, lineHeight: 29, color: t.ink }}>
        {a.prompt}
      </Text>
      {a.kind === "flashcard" && (
        <>
          <Action secondary onPress={() => setRevealed(!revealed)}>
            {revealed ? "ẨN NGHĨA" : "LẬT THẺ"}
          </Action>
          {revealed && (
            <>
              <Text style={ui.body}>{a.answer}</Text>
              <Text style={ui.body}>{a.example}</Text>
              <Action onPress={onDone}>ĐÃ HỌC THẺ NÀY</Action>
            </>
          )}
        </>
      )}
      {(a.kind === "gap" || a.kind === "reading") && (
        <>
          {a.choices.map((c, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected: choice === i }}
              onPress={() => {
                setChoice(i);
                setChecked(false);
              }}
              style={[
                ui.input,
                choice === i && {
                  borderColor: t.accent,
                  backgroundColor: t.selected,
                },
              ]}
            >
              <Text style={{ color: t.ink }}>{c}</Text>
            </Pressable>
          ))}
          <Action
            disabled={choice === null}
            onPress={() => {
              setChecked(true);
              if (choice === a.answer) onDone();
            }}
          >
            KIỂM TRA
          </Action>
          {checked && (
            <Text accessibilityLiveRegion="polite" style={ui.body}>
              {choice === a.answer ? "Chính xác. " : "Thử lại nhé. "}
              {a.explanation}
            </Text>
          )}
        </>
      )}
      {a.kind === "match" && (
        <>
          <View style={[ui.row, { alignItems: "flex-start", gap: 8 }]}>
            <View style={{ flex: 1, gap: 8 }}>
              {a.pairs.map((p, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  disabled={matched.includes(i)}
                  onPress={() => setTerm(i)}
                  style={[
                    ui.input,
                    {
                      padding: 10,
                      opacity: matched.includes(i) ? 0.45 : 1,
                      borderColor: term === i ? t.accent : t.line,
                    },
                  ]}
                >
                  <Text style={{ color: t.ink }}>{p.term}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              {a.pairs
                .map((_, i) => a.pairs.length - 1 - i)
                .map((i) => (
                  <Pressable
                    key={i}
                    accessibilityRole="button"
                    disabled={matched.includes(i)}
                    onPress={() => {
                      if (term === null) {
                        setMessage("Chọn từ trước, rồi chọn nghĩa.");
                        return;
                      }
                      if (term !== i) {
                        setMessage("Chưa khớp, thử một nghĩa khác.");
                        return;
                      }
                      const next = [...matched, i];
                      setMatched(next);
                      setTerm(null);
                      setMessage("Đúng rồi!");
                      if (next.length === a.pairs.length) onDone();
                    }}
                    style={[
                      ui.input,
                      { padding: 10, opacity: matched.includes(i) ? 0.45 : 1 },
                    ]}
                  >
                    <Text style={{ color: t.ink }}>{a.pairs[i].meaning}</Text>
                  </Pressable>
                ))}
            </View>
          </View>
          <Text accessibilityLiveRegion="polite" style={ui.body}>
            {message || "Chọn một từ và nghĩa tương ứng."}
          </Text>
        </>
      )}
      {a.kind === "writing" && (
        <>
          <TextInput
            accessibilityLabel="Bài viết của bạn"
            placeholder="Viết câu trả lời…"
            placeholderTextColor={t.muted}
            value={draft}
            maxLength={5000}
            multiline
            onChangeText={onDraft}
            style={[ui.input, { minHeight: 130, textAlignVertical: "top" }]}
          />
          <Action
            secondary
            disabled={!draft.trim()}
            onPress={() => setRevealed(true)}
          >
            XEM GỢI Ý TỰ ĐÁNH GIÁ
          </Action>
          {revealed && (
            <>
              <Text style={ui.body}>{a.sample}</Text>
              {a.checklist.map((x, i) => (
                <Text key={i} style={ui.body}>
                  • {x}
                </Text>
              ))}
              <Text style={ui.label}>
                BÀI MẪU THAM KHẢO · KHÔNG CHẤM ĐIỂM TỰ ĐỘNG
              </Text>
              <Action onPress={onDone}>ĐÃ VIẾT VÀ TỰ ĐỐI CHIẾU</Action>
            </>
          )}
        </>
      )}
    </View>
  );
}
