import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import type { IllustrationStatus, Lesson } from "../types/course";
import { theme as t, ui } from "./ui";
import { requireIllustrationBackend } from "../lib/illustration-api";
import { Icon } from "./Icon";
const url = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
export function LessonIllustration({
  lesson,
  courseTitle,
  onStatus,
}: {
  lesson: Lesson;
  courseTitle: string;
  onStatus: () => void;
}) {
  const [status, setStatus] = useState<IllustrationStatus | null>(null);
  const [error, setError] = useState("");

  const [imageError, setImageError] = useState(false);
  const [imageWidth, setImageWidth] = useState(320);
  const id = lesson.illustration?.id;

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
        if (r.status === 404)
          await requireIllustrationBackend(url, controller.signal);
        const body = await r.json();
        if (!active) return;
        if (!r.ok)
          throw new Error(body.error || "Chưa lấy được trạng thái tranh.");
        if (
          body.id !== id ||
          !["queued", "generating", "ready", "failed", "paused"].includes(
            body.status,
          )
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
  }, [id, lesson.title]);
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
            ui.row,
            { justifyContent: "space-between", gap: 8, paddingVertical: 4 },
          ]}
        >
          <View style={[ui.row, { gap: 7, flex: 1 }]}>
            {pending ? (
              <ActivityIndicator size="small" color={t.muted} />
            ) : (
              <Icon name="sprout" size={15} color={t.muted} />
            )}
            <Text style={{ fontSize: 11, color: t.muted, flex: 1 }}>
              {pending
                ? "Tranh đang được chuẩn bị"
                : lesson.pages[0]?.visual
                  ? "Đang dùng sơ đồ minh họa"
                  : "Nội dung bài học vẫn sẵn sàng"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onStatus}
            style={{ paddingVertical: 9, paddingLeft: 4 }}
          >
            <Text style={{ fontSize: 11, color: "#467F9B" }}>
              Trạng thái AI ↗
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
