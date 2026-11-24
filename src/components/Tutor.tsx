import { MascotLoading } from "./MascotLoading";
import { MamMascot } from "./MamMascot";
import { fetchBackend } from "../lib/backend-fetch";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme as t } from "../theme";
import type { Lesson } from "../types/course";

type Message = { role: "user" | "assistant"; content: string };

export function Tutor({
  lesson,
  courseTitle,
  onClose,
}: {
  lesson: Lesson;
  courseTitle: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function ask(value = question) {
    const clean = value.trim();
    if (!clean || busy) return;
    const url = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    if (!url) {
      setError(
        "Gia sư AI cần kết nối máy chủ. Bật máy chủ AI theo hướng dẫn trong README để bắt đầu.",
      );
      return;
    }
    setError("");
    setBusy(true);
    const history: Message[] = [...messages, { role: "user", content: clean }];
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 50000);
    try {
      const response = await fetchBackend(`${url}/api/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          courseTitle,
          lessonTitle: lesson.title,
          context: lesson.pages.map((p) => `${p.title}: ${p.body}`).join("\n"),
          messages: history.slice(-12),
        }),
      });
      const body = await response.json();
      if (!response.ok || typeof body.reply !== "string" || !body.reply.trim())
        throw new Error(body.error || "Gia sư chưa phản hồi. Hãy thử lại.");
      setMessages([...history, { role: "assistant", content: body.reply }]);
      setQuestion("");
    } catch (e) {
      setError(
        e instanceof Error && e.name === "AbortError"
          ? "Hết thời gian chờ. Bạn thử lại nhé."
          : e instanceof Error
            ? e.message
            : "Không thể kết nối gia sư.",
      );
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }

  return (
    <View style={s.overlay}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.header}>
          <View>
            <Text style={s.title}>Hỏi Mầm</Text>
            <Text style={s.caption}>{lesson.title}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng gia sư"
            onPress={onClose}
            style={s.close}
          >
            <Text style={{ fontSize: 24, color: t.ink, fontWeight: "600" }}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scroll}
          onContentSizeChange={() =>
            scroll.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={s.conversation}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.intro}>
            <MamMascot
              size={90}
              mood={busy ? "thinking" : "idle"}
              interactive
            />
            <Text style={s.title}>Bạn cần giải thích gì?</Text>
            <Text style={s.body}>
              Mình có thể giải thích bài học, đưa ví dụ hoặc giúp bạn tự kiểm
              tra.
            </Text>
          </View>

          {messages.length === 0 &&
            [
              "Giải thích bài này đơn giản hơn",
              "Cho mình một ví dụ thực tế",
              "Đặt một câu hỏi để mình tự kiểm tra",
            ].map((q) => (
              <Pressable
                accessibilityRole="button"
                key={q}
                disabled={busy}
                onPress={() => ask(q)}
                style={s.suggestion}
              >
                <Text style={s.body}>{q} ↗</Text>
              </Pressable>
            ))}

          {messages.map((m, i) => (
            <View key={i} style={[s.bubble, m.role === "user" && s.user]}>
              <Text style={[s.caption, m.role === "user" && { color: "rgba(255,255,255,0.7)" }]}>
                {m.role === "user" ? "BẠN" : "MẦM"}
              </Text>
              <Text selectable style={[s.message, m.role === "user" && { color: "#FFFFFF" }]}>
                {m.content}
              </Text>
            </View>
          ))}

          {busy && <MascotLoading compact label="Mầm đang trả lời…" />}

          {error ? (
            <Text accessibilityRole="alert" style={s.error}>
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <View style={s.composer}>
          <TextInput
            accessibilityLabel="Câu hỏi cho gia sư"
            value={question}
            onChangeText={setQuestion}
            maxLength={1000}
            multiline
            placeholder="Mình muốn hỏi..."
            placeholderTextColor={t.muted}
            selectionColor={t.accent}
            keyboardAppearance="light"
            style={s.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gửi câu hỏi"
            disabled={busy || !question.trim()}
            onPress={() => ask()}
            style={[s.send, (busy || !question.trim()) && { opacity: 0.4 }]}
          >
            <Text style={{ color: t.onPrimary, fontSize: 22, fontWeight: "700" }}>↑</Text>
          </Pressable>
        </View>

        <Text style={s.note}>
          AI có thể trả lời sai. Hãy kiểm chứng thông tin quan trọng.
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: t.bg,
  },
  container: {
    flex: 1,
    backgroundColor: t.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: t.line,
  },
  title: { fontSize: 20, fontWeight: "700", color: t.ink, letterSpacing: -0.3 },
  caption: { fontSize: 12, color: t.muted, marginTop: 2, fontWeight: "500" },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  conversation: {
    padding: 20,
    gap: 12,
    flexGrow: 1,
  },
  intro: {
    alignItems: "center",
    paddingVertical: 18,
    gap: 8,
  },
  body: { fontSize: 14, lineHeight: 22, color: t.muted, textAlign: "center" },
  suggestion: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 20,
    backgroundColor: t.surface,
    shadowColor: t.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  bubble: {
    backgroundColor: t.surface,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    maxWidth: "88%",
    alignSelf: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderColor: t.line,
    shadowColor: t.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  user: {
    backgroundColor: t.deep,
    borderColor: t.deep,
    alignSelf: "flex-end",
  },
  message: { fontSize: 15, lineHeight: 23, color: t.ink },
  error: { color: t.danger, fontSize: 13, lineHeight: 20, padding: 12 },
  composer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: t.surface,
    borderTopWidth: 1,
    borderColor: t.line,
  },
  input: {
    flex: 1,
    backgroundColor: t.bg,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    maxHeight: 100,
    color: t.ink,
    borderWidth: 1,
    borderColor: t.line,
    fontSize: 15,
  },
  send: {
    backgroundColor: t.deep,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    shadowColor: t.deep,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  note: {
    fontSize: 11,
    color: t.muted,
    textAlign: "center",
    paddingBottom: 8,
    paddingTop: 4,
  },
});
