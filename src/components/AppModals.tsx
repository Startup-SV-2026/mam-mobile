import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import type { Course } from "../types/course";
import { ui, theme as t, Action, IconButton, TactileButton, monoFont } from "./ui";
import { Icon } from "./Icon";

interface LessonActionModalProps {
  visible: boolean;
  course: Course;
  selectedLesson: number | null;
  isCompleted: boolean;
  onClose: () => void;
  onQuiz: () => void;
  onPodcast: () => void;
  onRead: () => void;
  onTutor: () => void;
}

export function LessonActionModal({
  visible,
  course,
  selectedLesson,
  isCompleted,
  onClose,
  onQuiz,
  onPodcast,
  onRead,
  onTutor,
}: LessonActionModalProps) {
  if (!visible) return null;
  const lesson = course.lessons[selectedLesson ?? 0];
  if (!lesson) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />
        <View style={[ui.row, { justifyContent: "space-between", alignItems: "flex-start" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text numberOfLines={2} style={[ui.title, { fontSize: 20, lineHeight: 26 }]}>
              {lesson.title}
            </Text>
            <Text style={[ui.body, { fontSize: 13, marginTop: 4 }]}>
              {isCompleted
                ? "Đã hoàn thành · Sẵn sàng ôn tập"
                : `${lesson.minutes} phút khám phá`}
            </Text>
          </View>
          <IconButton
            name="close"
            label="Đóng lựa chọn bài"
            onPress={onClose}
          />
        </View>

        <View style={{ gap: 10, marginTop: 6 }}>
          <TactileButton arrow icon="notes" onPress={onRead}>
            Đọc bài học
          </TactileButton>
          <TactileButton variant="secondary" icon="headphones" onPress={onPodcast}>
            Nghe Podcast
          </TactileButton>
          <TactileButton variant="secondary" icon="review" onPress={onQuiz}>
            Luyện tập nhanh
          </TactileButton>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onTutor}
          style={styles.tutorRow}
        >
          <View style={styles.tutorIconCircle}>
            <Icon name="chat" size={17} color={t.primary} />
          </View>
          <Text style={[ui.body, { flex: 1, color: t.ink, fontWeight: "600", marginLeft: 10 }]}>
            Hỏi gia sư Mầm về bài này
          </Text>
          <Text style={{ fontFamily: monoFont, color: t.muted, fontSize: 16 }}>↗</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface NotesModalProps {
  visible: boolean;
  subtitle: string;
  notesText: string;
  onChangeNotes: (text: string) => void;
  onClose: () => void;
}

export function NotesModal({
  visible,
  subtitle,
  notesText,
  onChangeNotes,
  onClose,
}: NotesModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetContainer}
      >
        <View style={styles.sheet}>
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <Text style={ui.title}>Ghi chú của mình</Text>
            <IconButton
              name="close"
              label="Đóng ghi chú"
              onPress={onClose}
            />
          </View>
          <Text style={ui.body}>{subtitle}</Text>
          <TextInput
            selectionColor={t.accent}
            keyboardAppearance="light"
            accessibilityLabel="Nội dung ghi chú"
            placeholder="Điều mình muốn ghi nhớ..."
            placeholderTextColor={t.muted}
            multiline
            value={notesText}
            onChangeText={onChangeNotes}
            maxLength={5000}
            textAlignVertical="top"
            style={[ui.input, { minHeight: 180, lineHeight: 25 }]}
          />
          <Text style={[ui.label, { fontSize: 10 }]}>
            TỰ ĐỘNG LƯU TRÊN THIẾT BỊ
          </Text>
          <TactileButton arrow onPress={onClose}>
            XONG
          </TactileButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

interface ResetConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmModal({
  visible,
  onConfirm,
  onCancel,
}: ResetConfirmModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <View style={styles.sheet}>
        <Text style={ui.title}>Xóa dữ liệu học?</Text>
        <Text style={ui.body}>
          Tiến độ, XP, khóa AI, thẻ đã lưu và ghi chú trên thiết bị này sẽ bị
          xóa.
        </Text>
        <View style={{ gap: 10, marginTop: 4 }}>
          <TactileButton onPress={onConfirm}>
            XÓA DỮ LIỆU
          </TactileButton>
          <TactileButton variant="secondary" onPress={onCancel}>
            GIỮ LẠI
          </TactileButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 14,
    paddingBottom: 22,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(35, 27, 21, 0.45)",
  },
  sheetContainer: {
    width: "100%",
    maxWidth: 420,
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: t.surface,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    zIndex: 1,
    borderWidth: 1.5,
    borderColor: t.line,
    shadowColor: t.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  dragHandle: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#DED8CB",
    alignSelf: "center",
    marginBottom: 4,
  },
  tutorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: t.soft,
    borderWidth: 1,
    borderColor: t.line,
    marginTop: 4,
  },
  tutorIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
  },
});
