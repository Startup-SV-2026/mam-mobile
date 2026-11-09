import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import type { IllustrationStatus, Lesson } from "../types/course";
import { theme as t, ui } from "./ui";
import { Icon } from "./Icon";
const url = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
export function LessonIllustration({
  lesson,
  courseTitle,
  onAsset,
}: {
  lesson: Lesson;
  courseTitle: string;
  onAsset: (id: string) => void;
}) {
  const [status, setStatus] = useState<IllustrationStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageWidth, setImageWidth] = useState(320);
  const id = lesson.illustration?.id;
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    setStatus(null);
    setError("");
    setImageError(false);
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    if (!id || !url) {
      if (id && !url)
        setError("Chưa kết nối máy chủ tranh. Bạn vẫn có thể đọc tiếp.");
      return () => controller?.abort();
    }
    async function poll() {
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 12000);
      try {
        const r = await fetch(`${url}/api/illustrations/${id}`, {
          signal: controller.signal,
        });
        const body = await r.json();
        if (!active) return;
        if (!r.ok)
          throw new Error(body.error || "Chưa lấy được trạng thái tranh.");
        if (
          body.id !== id ||
          !["queued", "generating", "ready", "failed"].includes(body.status)
        )
          throw new Error("Trạng thái tranh không hợp lệ.");
        setStatus(body);
        setError("");
        if (body.status === "queued" || body.status === "generating")
          timer = setTimeout(poll, 3000);
      } catch (e) {
        if (active) {
          setError(
            e instanceof Error ? e.message : "Mất kết nối máy chủ tranh.",
          );
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    void poll();
    return () => {
      active = false;
      controller?.abort();
      clearTimeout(timer);
    };
  }, [id, lesson.title, refresh]);
  async function create() {
    if (!url) {
      setError("Chưa kết nối máy chủ tạo tranh. Bài học vẫn sẵn sàng.");
      return;
    }
    setBusy(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const r = await fetch(`${url}/api/illustrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseTitle, lesson, retry: true }),
        signal: controller.signal,
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "Chưa tạo được tranh.");
      if (typeof body.id !== "string" || !/^[a-f0-9]{64}$/.test(body.id))
        throw new Error("Dữ liệu tranh không hợp lệ.");
      setStatus(body);
      onAsset(body.id);
      // Same id after retry: reload the mounted poller by returning to waiting state.
      if (id === body.id) {
        setStatus(null);
        setRefresh((v) => v + 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không kết nối được máy chủ.");
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  const sample = lesson.sampleIllustration === "space";
  const ready = status?.status === "ready" && id && url;
  const source = sample
    ? require("../../assets/illustrations/space.png")
    : ready
      ? { uri: `${url}/media/illustrations/${id}` }
      : undefined;
  const caption =
    lesson.illustrationPlan?.caption ||
    (sample
      ? "Minh họa nghệ thuật về Trái Đất, Mặt Trời và Ngân Hà; các quỹ đạo chỉ mang tính tượng trưng, không theo tỉ lệ."
      : `Minh họa nghệ thuật cho “${lesson.title}”; không phải tư liệu gốc hoặc mô hình theo tỉ lệ.`);
  const pending =
    !error &&
    ((!!id && !status) ||
      status?.status === "queued" ||
      status?.status === "generating");
  return (
    <View style={{ marginTop: 23, marginBottom: 4 }}>
      {source && !imageError ? (
        <>
          <View
            onLayout={(event) => setImageWidth(event.nativeEvent.layout.width)}
            style={{
              borderRadius: 21,
              overflow: "hidden",
              backgroundColor: "#F6F1E8",
              borderWidth: 1,
              borderColor: t.line,
            }}
          >
            <Image
              source={source}
              accessibilityLabel={
                lesson.illustrationPlan?.alt ||
                `Minh họa nghệ thuật cho bài ${lesson.title}`
              }
              resizeMode="contain"
              onError={() => setImageError(true)}
              style={{ width: "100%", height: imageWidth / 1.5 }}
            />
          </View>
          {caption ? (
            <Text
              style={{
                fontSize: 11,
                lineHeight: 17,
                color: t.muted,
                marginTop: 9,
              }}
            >
              {caption}
            </Text>
          ) : null}
        </>
      ) : (
        <View
          style={[
            ui.card,
            {
              gap: 12,
              backgroundColor: "#F6F3E8",
              borderStyle: "dashed",
              padding: 17,
            },
          ]}
        >
          <View style={ui.row}>
            {pending ? (
              <ActivityIndicator color={t.ink} />
            ) : (
              <Icon name="sparkle" color={t.muted} />
            )}
            <Text
              style={{ flex: 1, fontSize: 14, lineHeight: 21, color: t.ink }}
            >
              {pending
                ? "Mầm đang vẽ một góc nhìn cho bài này…"
                : error ||
                  status?.error ||
                  (imageError
                    ? "Chưa tải được tranh. Bạn có thể đọc tiếp."
                    : "Một bức tranh riêng cho bài học này.")}
            </Text>
          </View>
          {!pending && (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={create}
              style={{ paddingVertical: 6 }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#467F9B" }}
              >
                {busy
                  ? "ĐANG GỬI YÊU CẦU…"
                  : id
                    ? "THỬ LẠI"
                    : "TẠO TRANH MINH HỌA"}
              </Text>
            </Pressable>
          )}
          <Text style={{ fontSize: 11, lineHeight: 17, color: t.muted }}>
            Bạn có thể học tiếp trong lúc chờ. Tạo tranh dùng hạn mức API ảnh
            riêng.
          </Text>
        </View>
      )}
    </View>
  );
}
