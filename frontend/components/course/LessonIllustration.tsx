import { MamMascot } from "../mascot/MamMascot";
import { fetchBackend } from "../../services/backend-fetch";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { IllustrationStatus, Lesson } from "../../types/course";
import { theme as t, ui } from "../ui/ui";
import { requireIllustrationBackend } from "../../services/illustration-api";
import { Icon } from "../ui/Icon";
import { courseArtKey } from "../../lib/visual-design";

const artworks = {
  space: require("../../../assets/artwork/space-v2.jpg"),
  mind: require("../../../assets/artwork/mind-v2.jpg"),
  money: require("../../../assets/artwork/money-v2.jpg"),
  ai: require("../../../assets/artwork/ai-v2.jpg"),
  language: require("../../../assets/artwork/language-v2.jpg"),
  history: require("../../../assets/artwork/history-v2.jpg"),
  lexicon: require("../../../assets/artwork/lexicon-v2.jpg"),
  science: require("../../../assets/artwork/science-v2.jpg"),
  exam: require("../../../assets/artwork/exam-v2.jpg"),
  literature: require("../../../assets/artwork/literature-v2.jpg"),
  design: require("../../../assets/artwork/design-v2.jpg"),
  health: require("../../../assets/artwork/health-v2.jpg"),
  logic: require("../../../assets/artwork/logic-v2.jpg"),
  earth: require("../../../assets/artwork/earth-v2.jpg"),
  culture: require("../../../assets/artwork/culture-v2.jpg"),
};

const artworksV3: Record<string, ReturnType<typeof require>> = {
  mind: require("../../../assets/artwork/mind-v3.jpg"),
  space: require("../../../assets/artwork/space-v3.jpg"),
  ai: require("../../../assets/artwork/ai-v3.jpg"),
  language: require("../../../assets/artwork/language-v3.jpg"),
  history: require("../../../assets/artwork/history-v3.jpg"),
  money: require("../../../assets/artwork/money-v3.jpg"),
  lexicon: require("../../../assets/artwork/lexicon-v3.jpg"),
};

const url = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
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
  const artKey = courseArtKey(lesson.illustration?.id || "", lesson.title, courseTitle);
  const fallbackArtwork =
    pageIndex === 1 && artworksV3[artKey]
      ? artworksV3[artKey]
      : artworks[artKey as keyof typeof artworks] || artworks.mind;

  const source = sample
    ? require("../../../assets/illustrations/space.png")
    : tranSample
      ? tranSample
      : ready
        ? { uri: `${url}/media/illustrations/${id}` }
        : fallbackArtwork;
  const caption =
    lesson.illustrationPlan?.caption ||
    (sample
      ? "Minh họa nghệ thuật về Trái Đất, Mặt Trời và Ngân Hà; các quỹ đạo chỉ mang tính tượng trưng, không theo tỉ lệ."
      : `Minh họa nghệ thuật cho “${lesson.title}”; góc nhìn trực quan về cơ chế cốt lõi.`);
  const pending =
    !error &&
    ((!!id && !status) ||
      status?.status === "queued" ||
      status?.status === "generating");
  return (
    <View style={{ marginTop: 20, marginBottom: 6 }}>
      {source && !imageError ? (
        <>
          <View
            onLayout={(event) => setImageWidth(event.nativeEvent.layout.width)}
            style={{
              borderRadius: 21,
              overflow: "hidden",
              backgroundColor: t.surface,
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
              resizeMode="cover"
              onError={() => setImageError(true)}
              style={{ width: "100%", height: Math.min(240, imageWidth / 1.5) }}
            />
          </View>
          {caption ? (
            <Text
              style={{
                fontSize: 11,
                lineHeight: 17,
                color: t.muted,
                marginTop: 8,
              }}
            >
              {caption}
            </Text>
          ) : null}
          {pending && (
            <View style={[ui.row, { gap: 6, alignItems: "center", marginTop: 4 }]}>
              <MamMascot size={20} mood="thinking" />
              <Text style={{ fontSize: 11, color: t.muted }}>
                AI đang tạo thêm tranh minh họa riêng cho bài…
              </Text>
            </View>
          )}
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
              <MamMascot size={36} mood="thinking" />
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
        </View>
      )}
    </View>
  );
}
