import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
    const url = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
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
      const response = await fetch(`${url}/api/tutor`, {
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
    <Modal animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.header}>
          <View>
            <Text style={s.title}>✧ Hỏi Mầm</Text>
            <Text style={s.caption}>{lesson.title}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng gia sư"
            onPress={onClose}
            style={s.close}
          >
            <Text style={{ fontSize: 24 }}>×</Text>
          </Pressable>
        </View>
        <ScrollView
          ref={scroll}
          onContentSizeChange={() =>
            scroll.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={s.conversation}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.intro}>
            <Text style={{ fontSize: 40 }}>✦</Text>
            <Text style={s.title}>Cứ tò mò nhé.</Text>
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
              <Text style={s.caption}>{m.role === "user" ? "BẠN" : "MẦM"}</Text>
              <Text selectable style={s.message}>
                {m.content}
              </Text>
            </View>
          ))}
          {busy && <ActivityIndicator color="#549BBC" />}
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
            style={s.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gửi câu hỏi"
            disabled={busy || !question.trim()}
            onPress={() => ask()}
            style={[s.send, (busy || !question.trim()) && { opacity: 0.4 }]}
          >
            <Text style={{ color: "#FFFDF1", fontSize: 22 }}>↑</Text>
          </Pressable>
        </View>
        <Text style={s.note}>
          AI có thể trả lời sai. Hãy kiểm chứng thông tin quan trọng.
        </Text>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF1",
    paddingTop: Platform.OS === "ios" ? 52 : 20,
  },
  header: {
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#D4D0C3",
  },
  title: { fontSize: 24, fontWeight: "800", color: "#2C1C18" },
  caption: { fontSize: 11, color: "#867F73", marginTop: 6, fontWeight: "700" },
  close: { padding: 6 },
  conversation: {
    padding: 22,
    gap: 12,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
    flexGrow: 1,
  },
  intro: { paddingVertical: 18, gap: 12 },
  body: { fontSize: 14, lineHeight: 23, color: "#867F73" },
  suggestion: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#D4D0C3",
    borderRadius: 15,
    backgroundColor: "#FFFDF1",
  },
  bubble: {
    backgroundColor: "#FFFDF1",
    padding: 18,
    borderRadius: 18,
    maxWidth: "95%",
    alignSelf: "flex-start",
    gap: 8,
  },
  user: { backgroundColor: "#E3E5C8", alignSelf: "flex-end" },
  message: { fontSize: 15, lineHeight: 24, color: "#2C1C18" },
  error: { color: "#A84848", fontSize: 13, lineHeight: 20, padding: 12 },
  composer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#D4D0C3",
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFDF1",
    padding: 14,
    borderRadius: 16,
    maxHeight: 120,
    color: "#2C1C18",
  },
  send: {
    backgroundColor: "#2C1C18",
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    fontSize: 10,
    color: "#867F73",
    textAlign: "center",
    paddingBottom: 16,
  },
});
