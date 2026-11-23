import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ui, theme as t, Action, Sprout } from "../components/ui";
import { Icon } from "../components/Icon";
import { currentStreak } from "../lib/learning";
import type { UserProfile } from "../lib/auth-api";

interface ProfileScreenProps {
  user: UserProfile | null;
  xp: number;
  doneCount: number;
  streak: number;
  lastStudy: string;
  savedCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSaved: () => void;
  onOpenPodcast: () => void;
  onOpenLibrary: () => void;
  onOpenReview: () => void;
  onRequestReset: () => void;
}

export function ProfileScreen({
  user,
  xp,
  doneCount,
  streak,
  lastStudy,
  savedCount,
  onOpenAuth,
  onLogout,
  onOpenSaved,
  onOpenPodcast,
  onOpenLibrary,
  onOpenReview,
  onRequestReset,
}: ProfileScreenProps) {
  return (
    <>
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 25 }}>
        <Sprout size={80} />
        <Text style={ui.title}>
          {user ? user.name : "Khách thăm Mầm"}
        </Text>
        <Text style={ui.body}>
          {user ? user.email : "Tiến độ lưu cục bộ trên thiết bị này"}
        </Text>
      </View>

      {/* Account Status Card */}
      <View
        style={[
          ui.card,
          {
            marginBottom: 20,
            backgroundColor: user ? t.selected : t.surface,
            borderColor: user ? t.accent : t.line,
            gap: 10,
          },
        ]}
      >
        <View style={ui.row}>
          <Icon name={user ? "check" : "profile"} color={user ? t.accent : t.muted} size={20} />
          <Text style={{ fontWeight: "700", color: t.ink, flex: 1, fontSize: 15 }}>
            {user ? "Đã kết nối tài khoản đám mây" : "Chưa đăng nhập tài khoản"}
          </Text>
        </View>
        <Text style={[ui.body, { fontSize: 13 }]}>
          {user
            ? "Tiến độ học, ghi chú và thẻ lưu được đồng bộ tự động."
            : "Đăng nhập hoặc dùng thử tài khoản mẫu để lưu trữ và đồng bộ xuyên suốt."}
        </Text>
        <Action
          secondary={!!user}
          onPress={user ? onLogout : onOpenAuth}
          style={{ width: "100%" }}
        >
          {user ? "ĐĂNG XUẤT" : "ĐĂNG NHẬP / DÙNG TÀI KHOẢN MẪU"}
        </Action>
      </View>

      <View style={[ui.row, { marginBottom: 25 }]}>
        {[
          [String(xp), "ĐIỂM XP"],
          [String(doneCount), "BÀI ĐÃ HỌC"],
          [String(currentStreak(streak, lastStudy)), "NGÀY LIÊN TIẾP"],
        ].map(([v, l]) => (
          <View
            key={l}
            style={[
              ui.card,
              { flex: 1, padding: 12, alignItems: "center", gap: 8 },
            ]}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: t.ink,
              }}
            >
              {v}
            </Text>
            <Text
              style={[
                ui.label,
                {
                  fontSize: 8,
                  letterSpacing: 0.4,
                  textAlign: "center",
                },
              ]}
            >
              {l}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 15 }}>
        <Action secondary icon="bookmark" onPress={onOpenSaved}>
          THẺ ĐÃ LƯU ({savedCount})
        </Action>
        <Action secondary icon="headphones" onPress={onOpenPodcast}>
          Podcast · Nghe bài giảng
        </Action>
        <Action secondary icon="library" onPress={onOpenLibrary}>
          THƯ VIỆN CỦA BẠN
        </Action>
        <Action secondary icon="review" onPress={onOpenReview}>
          ÔN TẬP KIẾN THỨC
        </Action>
      </View>

      <View style={[ui.card, { marginTop: 28, gap: 12 }]}>
        <Text style={{ fontWeight: "700", fontSize: 17, color: t.ink }}>
          Dữ liệu học tập
        </Text>
        <Text style={ui.body}>
          Tiến độ, ghi chú và thẻ đã lưu được giữ trên thiết bị này.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onRequestReset}
        style={{ padding: 20, alignItems: "center" }}
      >
        <Text style={{ color: t.danger, fontSize: 13 }}>Xóa dữ liệu dùng thử</Text>
      </Pressable>
      <Text style={[ui.label, { textAlign: "center" }]}>MẦM · 0.3</Text>
    </>
  );
}
