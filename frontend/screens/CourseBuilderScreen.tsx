import { MascotLoading } from "../components/mascot/MascotLoading";
import { MamMascot } from "../components/mascot/MamMascot";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { Action, theme as t, ui } from "../components/ui/ui";
import {
  COURSE_LEVELS,
  isCourseBrief,
  type CourseBrief,
} from "../lib/course-chat";
import type { CourseBuilderController } from "../hooks/useCourseBuilder";
const fields: {
  key: Exclude<keyof CourseBrief, "level">;
  label: string;
  max: number;
}[] = [
  { key: "topic", label: "Chủ đề", max: 150 },
  { key: "goal", label: "Mục tiêu", max: 600 },
  { key: "experience", label: "Kiến thức đã có", max: 600 },
  { key: "focus", label: "Nội dung ưu tiên", max: 600 },
  { key: "format", label: "Cách học và bài tập", max: 600 },
  { key: "pace", label: "Nhịp học", max: 600 },
];
export function CourseBuilder({
  builder: b,
  onChange,
}: {
  builder: CourseBuilderController;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const waiting = b.busy || b.creating;
  const last = b.turns.at(-1);
  const question = last?.reply?.kind === "question" ? last.reply : null;
  if (b.creating)
    return (
      <View style={{ gap: 22, paddingTop: 16 }}>
        <View
          style={[
            ui.card,
            {
              minHeight: 360,
              justifyContent: "center",
              backgroundColor: t.selected,
            },
          ]}
        >
          <MascotLoading
            label={
              b.creationStep === "outline"
                ? "Đang tạo đề cương…"
                : "Đang soạn bài 1.1…"
            }
            detail={
              b.creationStep === "outline"
                ? "Sắp xếp các chương theo mục tiêu của bạn."
                : "Chỉ soạn bài đầu tiên. Các bài sau được tạo khi bạn học."
            }
            size={148}
          />
          <View style={[ui.row, { justifyContent: "center", gap: 8 }]}>
            <Text
              style={{
                fontSize: 12,
                color: b.creationStep === "lesson" ? t.accent : t.ink,
              }}
            >
              {b.creationStep === "lesson" ? "✓ Đề cương" : "Đề cương"}
            </Text>
            <Text style={{ color: t.muted }}>→</Text>
            <Text
              style={{
                fontSize: 12,
                color: b.creationStep === "lesson" ? t.ink : t.muted,
              }}
            >
              Bài 1.1
            </Text>
          </View>
        </View>
        <Action secondary onPress={b.stop}>
          DỪNG TẠO
        </Action>
      </View>
    );

  return (
    <View style={{ gap: 22, paddingTop: 12 }}>
      {b.turns.length === 0 ? (
        <View style={{ gap: 16, paddingVertical: 12 }}>
          <View style={[ui.row, { gap: 12 }]}>
            <View style={{ flex: 1, gap: 9 }}>
              <Text style={[ui.title, { fontSize: 26 }]}>Bạn muốn học gì?</Text>
              <Text style={ui.body}>
                Mô tả điều bạn muốn học. Mầm sẽ hỏi thêm để thiết kế khóa học
                phù hợp.
              </Text>
            </View>
            <MamMascot size={96} interactive />
          </View>
          <View style={{ gap: 8 }}>
            {[
              "Từ vựng tiếng Anh cho công việc",
              "Python để phân tích dữ liệu",
              "Tìm hiểu lịch sử Việt Nam",
            ].map((v) => (
              <Pressable
                key={v}
                accessibilityRole="button"
                onPress={() => b.setInput(v)}
                style={[ui.input, { padding: 12 }]}
              >
                <Text style={{ color: t.ink, fontSize: 14 }}>{v}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Text style={ui.label}>THIẾT KẾ KHÓA HỌC</Text>
          <Pressable
            accessibilityRole="button"
            disabled={waiting}
            onPress={() => {
              b.reset();
              setEditing(false);
            }}
            style={{ padding: 10 }}
          >
            <Text style={{ color: t.accent, fontSize: 13 }}>Bắt đầu lại</Text>
          </Pressable>
        </View>
      )}
      {b.turns.map((m, i) => (
        <View
          key={i}
          style={{
            gap: 5,
            alignSelf: m.role === "user" ? "flex-end" : "stretch",
            maxWidth: "100%",
          }}
        >
          <View
            style={{
              padding: 16,
              borderRadius: 18,
              borderBottomRightRadius: m.role === "user" ? 5 : 18,
              backgroundColor: m.role === "user" ? t.selected : t.surface,
              borderWidth: m.role === "user" ? 0 : 1,
              borderColor: t.line,
              gap: 7,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: t.accent }}>
              {m.role === "user" ? "Bạn" : "Mầm"}
            </Text>
            <Text
              selectable
              style={{ fontSize: 16, lineHeight: 25, color: t.ink }}
            >
              {m.content}
            </Text>
          </View>
          {m.role === "user" && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Sửa câu trả lời ${i + 1}`}
              disabled={waiting}
              onPress={() => {
                b.edit(i);
                setEditing(false);
                onChange();
              }}
              style={{ padding: 7, alignSelf: "flex-end" }}
            >
              <Text style={{ fontSize: 12, color: t.muted }}>Sửa</Text>
            </Pressable>
          )}
        </View>
      ))}
      {b.busy && <MascotLoading compact label="Mầm đang trả lời…" />}
      {question && !waiting && !b.error && (
        <View style={{ gap: 9 }}>
          {question.options.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => {
                void b.submit(option);
                onChange();
              }}
              style={[ui.input, { padding: 13, borderColor: t.primary }]}
            >
              <Text style={{ color: t.accent, fontSize: 14, lineHeight: 21 }}>
                {option}
              </Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void b.submit("Chưa xác định; hãy đề xuất giúp mình.");
              onChange();
            }}
            style={{ padding: 8 }}
          >
            <Text style={{ color: t.muted, fontSize: 13 }}>Để Mầm đề xuất</Text>
          </Pressable>
        </View>
      )}
      {b.brief && (
        <View style={[ui.card, { gap: 17 }]}>
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <Text style={{ fontSize: 19, fontWeight: "600", color: t.ink }}>
              Khóa học của bạn
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={waiting}
              onPress={() => setEditing(!editing)}
              style={{ padding: 8 }}
            >
              <Text style={{ color: t.accent }}>
                {editing ? "Xong" : "Chỉnh sửa"}
              </Text>
            </Pressable>
          </View>
          <Text style={ui.body}>Chia theo chương · Soạn từng bài khi học</Text>
          {fields.map((f) => (
            <View key={f.key} style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, color: t.muted, fontWeight: "600" }}>
                {f.label}
              </Text>
              {editing ? (
                <TextInput
                  accessibilityLabel={f.label}
                  editable={!waiting}
                  multiline
                  maxLength={f.max}
                  value={b.brief![f.key]}
                  onChangeText={(v) =>
                    b.setBrief((old) => (old ? { ...old, [f.key]: v } : old))
                  }
                  style={[
                    ui.input,
                    { fontSize: 14, lineHeight: 22, padding: 12 },
                  ]}
                  selectionColor={t.accent}
                />
              ) : (
                <Text style={{ color: t.ink, fontSize: 14, lineHeight: 22 }}>
                  {b.brief![f.key]}
                </Text>
              )}
            </View>
          ))}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, color: t.muted, fontWeight: "600" }}>
              Trình độ
            </Text>
            {editing ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {COURSE_LEVELS.map((level) => (
                  <Pressable
                    key={level}
                    accessibilityRole="button"
                    disabled={waiting}
                    accessibilityState={{ selected: level === b.brief!.level }}
                    onPress={() =>
                      b.setBrief((old) => (old ? { ...old, level } : old))
                    }
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor:
                        level === b.brief!.level ? t.selected : t.soft,
                    }}
                  >
                    <Text style={{ color: t.ink, fontSize: 12 }}>{level}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={{ color: t.ink, fontSize: 14 }}>
                {b.brief.level}
              </Text>
            )}
          </View>
          <Action
            icon="sparkle"
            disabled={waiting || !isCourseBrief(b.brief)}
            onPress={() => {
              Keyboard.dismiss();
              void b.create();
            }}
          >
            TẠO KHÓA HỌC
          </Action>
        </View>
      )}
      {b.error ? (
        <View style={{ gap: 12 }}>
          <Text
            accessibilityRole="alert"
            style={{ color: t.danger, fontSize: 14, lineHeight: 22 }}
          >
            {b.error}
          </Text>
          {b.canRetry && !waiting && (
            <Action
              secondary
              onPress={() => {
                void b.retry();
                onChange();
              }}
            >
              Thử lại
            </Action>
          )}
        </View>
      ) : null}
      {!b.brief && (!last || last.role === "assistant") && !waiting && (
        <View style={[ui.card, { gap: 12, padding: 15 }]}>
          <TextInput
            accessibilityLabel={
              b.turns.length ? "Trả lời Mầm" : "Chủ đề muốn học"
            }
            placeholder={
              b.turns.length ? "Viết câu trả lời của bạn…" : "Mình muốn học…"
            }
            placeholderTextColor={t.muted}
            selectionColor={t.accent}
            multiline
            maxLength={500}
            value={b.input}
            onChangeText={b.setInput}
            style={{
              minHeight: 65,
              fontSize: 16,
              lineHeight: 25,
              color: t.ink,
            }}
          />
          <Action
            icon="arrow"
            disabled={!b.input.trim()}
            onPress={() => {
              void b.submit();
              onChange();
            }}
          >
            {b.turns.length ? "GỬI CÂU TRẢ LỜI" : "TIẾP TỤC"}
          </Action>
        </View>
      )}
      {waiting && (
        <Pressable
          accessibilityRole="button"
          onPress={b.stop}
          style={{ padding: 12, alignSelf: "center" }}
        >
          <Text style={{ color: t.muted }}>Dừng</Text>
        </Pressable>
      )}
    </View>
  );
}
