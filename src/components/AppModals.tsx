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
import { ui, theme as t, Action, IconButton } from "./ui";
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
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Text style={[ui.title, { flex: 1, fontSize: 22 }]}>
            {lesson.title}
          </Text>
          <IconButton
            name="close"
            label="Đóng lựa chọn bài"
            onPress={onClose}
          />
        </View>
        <Text style={ui.body}>
          {isCompleted
            ? "Đã hoàn thành · Sẵn sàng ôn lại"
            : `${lesson.minutes} phút để khám phá`}
        </Text>
        <Action icon="review" onPress={onQuiz}>
          LUYỆN TẬP
        </Action>
        <Action secondary icon="headphones" onPress={onPodcast}>
          Nghe bài giảng
        </Action>
        <Action secondary icon="notes" onPress={onRead}>
          ĐỌC BÀI HỌC
        </Action>
        <Pressable
          accessibilityRole="button"
          onPress={onTutor}
          style={[ui.row, { paddingVertical: 10 }]}
        >
          <Icon name="chat" />
          <Text style={[ui.body, { flex: 1, color: t.ink, marginLeft: 8 }]}>
            Hỏi về bài học
          </Text>
          <Icon name="arrow" size={19} />
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
          <Action onPress={onClose}>XONG</Action>
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
        <Action onPress={onConfirm}>XÓA DỮ LIỆU</Action>
        <Action secondary onPress={onCancel}>
          GIỮ LẠI
        </Action>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: t.overlay,
  },
  sheetContainer: {
    width: "100%",
    maxWidth: 400,
  },
  sheet: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: t.surface,
    borderRadius: 26,
    padding: 22,
    gap: 16,
    zIndex: 1,
    shadowColor: t.ink,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
});
