import { MamMascot } from "../mascot/MamMascot";
import { fetchBackend } from "../../services/backend-fetch";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import type { IllustrationStatus, Lesson } from "../../types/course";
import { theme as t } from "../ui/ui";
import { requireIllustrationBackend } from "../../services/illustration-api";

const url = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, "");
export function LessonIllustration({
  lesson,
  courseTitle,
  pageIndex = 0,
  onStatus,
}: {
  lesson: Lesson;
  courseTitle: string;
  pageIndex?: number;
  onStatus?: () => void;
}) {
  const [status, setStatus] = useState<IllustrationStatus | null>(null);
  const [error, setError] = useState("");
  const [dynamicId, setDynamicId] = useState<string | null>(null);

  const [imageError, setImageError] = useState(false);
  const [imageWidth, setImageWidth] = useState(320);
  const activePage = lesson.pages[pageIndex];
  const id =
    (pageIndex > 0 && activePage?.illustration?.id
      ? activePage.illustration.id
      : lesson.illustration?.id) || dynamicId;
  const activePlan =
    pageIndex > 0 && activePage?.illustrationPlan
      ? activePage.illustrationPlan
      : lesson.illustrationPlan;

  useEffect(() => {
    setStatus(null);
    setError("");
    setImageError(false);
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    if (!id) {
      if (activePlan && url) {
        controller = new AbortController();
        fetchBackend(`${url}/api/illustrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: activePlan }),
          signal: controller.signal,
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((body) => {
            if (active && body?.id) {
              setDynamicId(body.id);
              setStatus(body);
            }
          })
          .catch(() => {});
      }
      return () => controller?.abort();
    }

    if (!url) {
      setError("Chưa kết nối máy chủ tranh. Bạn vẫn có thể đọc tiếp.");
      return () => controller?.abort();
    }

    async function poll() {
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 12000);
      try {
        const r = await fetchBackend(`${url}/api/illustrations/${id}`, {
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
  const tranSamples: Record<string, ReturnType<typeof require>> = {
    "tran-1": require("../../../assets/illustrations/tran-lesson1.jpg"),
    "tran-2": require("../../../assets/illustrations/tran-lesson2.jpg"),
    "tran-3": require("../../../assets/illustrations/tran-lesson3.jpg"),
  };
  const tranSample =
    lesson.sampleIllustration && lesson.sampleIllustration in tranSamples
      ? tranSamples[lesson.sampleIllustration]
      : undefined;
  const ready = status?.status === "ready" && id && url;
  const pending =
    !error &&
    ((!!id && !status) ||
      status?.status === "queued" ||
      status?.status === "generating");

  // Khi AI đang tạo tranh riêng cho bài, hiển thị thẻ chờ thanh lịch thay vì ép tranh tĩnh không liên quan
  if (pending) {
    return (
      <View
        style={{
          marginTop: 16,
          marginBottom: 10,
          borderRadius: 22,
          padding: 20,
          backgroundColor: "#FAF7EE",
          borderWidth: 1,
          borderColor: "rgba(35, 27, 21, 0.08)",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <MamMascot size={36} mood="thinking" />
        <View style={{ alignItems: "center", gap: 3 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: t.accent,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            🎨 ĐANG VẼ TRANH MINH HỌA
          </Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 19,
              color: "#5C564E",
              textAlign: "center",
              fontStyle: "italic",
              maxWidth: 320,
            }}
          >
            {activePlan?.caption ||
              `Đang vẽ tranh minh họa cho bài “${lesson.title}”…`}
          </Text>
        </View>
      </View>
    );
  }

  const source =
    pageIndex === 0 && sample
      ? require("../../../assets/illustrations/space.png")
      : pageIndex === 0 && tranSample
        ? tranSample
        : ready
          ? { uri: `${url}/media/illustrations/${id}` }
          : undefined;

  if (!source) {
    const isPaused =
      status?.status === "paused" || status?.issue?.kind === "quota_exhausted";
    const sceneText =
      activePlan?.caption ||
      activePage?.takeaway ||
      lesson.pages[0]?.takeaway;

    return (
      <View
        style={{
          marginTop: 18,
          marginBottom: 10,
          borderRadius: 22,
          padding: 18,
          backgroundColor: "#FAF7EE",
          borderWidth: 1,
          borderColor: "rgba(35, 27, 21, 0.08)",
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <MamMascot size={26} mood={isPaused ? "idle" : "thinking"} />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: t.accent,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            {pending
              ? "🎨 ĐANG VẼ TRANH MINH HỌA"
              : "🌱 GÓC NHÌN MINH HỌA"}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 13.5,
            lineHeight: 20.5,
            color: "#4A433A",
            fontStyle: "italic",
          }}
        >
          {sceneText
            ? `“${sceneText}”`
            : `Minh họa câu chuyện trực quan cho bài “${lesson.title}”.`}
        </Text>

        {isPaused ? (
          <Text style={{ fontSize: 11, color: "#8C8275", marginTop: 2 }}>
            Hàng đợi AI tạo ảnh đang tạm dừng (cần nạp quota/model ảnh). Minh họa riêng sẽ tự động xuất hiện khi kích hoạt.
          </Text>
        ) : null}
      </View>
    );
  }

  const caption =
    activePlan?.caption ||
    (sample
      ? "Minh họa nghệ thuật về Trái Đất, Mặt Trời và Ngân Hà; các quỹ đạo chỉ mang tính tượng trưng, không theo tỉ lệ."
      : `Minh họa nghệ thuật cho “${lesson.title}”; góc nhìn trực quan về câu chuyện cốt lõi.`);

  return (
    <View style={{ marginTop: 18, marginBottom: 8 }}>
      {!imageError ? (
        <>
          <View
            onLayout={(event) => setImageWidth(event.nativeEvent.layout.width)}
            style={{
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: "rgba(35, 27, 21, 0.09)",
            }}
          >
            <Image
              source={source}
              accessibilityLabel={
                activePlan?.alt ||
                `Minh họa nghệ thuật cho bài ${lesson.title}`
              }
              resizeMode="cover"
              onError={() => setImageError(true)}
              style={{ width: "100%", height: Math.min(240, imageWidth / 1.5) }}
            />
          </View>
          {caption ? (
            <Text
              style={{
                fontSize: 12.5,
                lineHeight: 19,
                color: "#6B6359",
                fontStyle: "italic",
                marginTop: 8,
                paddingHorizontal: 2,
              }}
            >
              {caption}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
