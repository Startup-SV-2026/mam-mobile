import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { ui, theme as t, Action } from "../components/ui";
import { MamMascot } from "../components/MamMascot";
import {
  loginAccount,
  registerAccount,
  type AuthResponse,
} from "../lib/auth-api";

interface AuthScreenProps {
  onSuccess: (authData: AuthResponse) => void;
  onContinueAsGuest?: () => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data: AuthResponse;
      if (mode === "login") {
        data = await loginAccount(email, password);
      } else {
        data = await registerAccount(email, password, name);
      }
      onSuccess(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotBox}>
        <MamMascot size={88} mood="happy" interactive />
        <Text style={styles.logoText}>mầm.</Text>
        <Text style={ui.body}>Gieo sự tò mò, gặt hái tri thức!</Text>
      </View>

      <View style={[ui.card, { gap: 14, marginTop: 10 }]}>
        <View style={styles.tabToggle}>
          <Pressable
            accessibilityRole="tab"
            onPress={() => {
              setMode("login");
              setError(null);
            }}
            style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "login" && styles.toggleTextActive,
              ]}
            >
              Đăng nhập
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            onPress={() => {
              setMode("register");
              setError(null);
            }}
            style={[
              styles.toggleBtn,
              mode === "register" && styles.toggleBtnActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "register" && styles.toggleTextActive,
              ]}
            >
              Đăng ký
            </Text>
          </Pressable>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={{ color: t.danger, fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {mode === "register" && (
          <View style={{ gap: 6 }}>
            <Text style={ui.label}>HỌ VÀ TÊN</Text>
            <TextInput
              style={ui.input}
              placeholder="VD: Nguyễn Văn A"
              placeholderTextColor={t.muted}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={{ gap: 6 }}>
          <Text style={ui.label}>EMAIL</Text>
          <TextInput
            style={ui.input}
            placeholder="email@example.com"
            placeholderTextColor={t.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={ui.label}>MẬT KHẨU</Text>
          <TextInput
            style={ui.input}
            placeholder="Ít nhất 6 ký tự"
            placeholderTextColor={t.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Action
          onPress={handleSubmit}
          disabled={loading}
          style={{ width: "100%", marginTop: 6 }}
        >
          {loading ? (
            "VUI LÒNG ĐỢI…"
          ) : mode === "login" ? (
            "ĐĂNG NHẬP"
          ) : (
            "TẠO TÀI KHOẢN"
          )}
        </Action>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    gap: 16,
    justifyContent: "center",
  },
  mascotBox: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "800",
    color: t.accent,
    letterSpacing: -0.5,
  },
  tabToggle: {
    flexDirection: "row",
    backgroundColor: t.line,
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: t.surface,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: t.muted,
  },
  toggleTextActive: {
    color: t.ink,
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: t.dangerSurface,
    padding: 10,
    borderRadius: 10,
  },
});
