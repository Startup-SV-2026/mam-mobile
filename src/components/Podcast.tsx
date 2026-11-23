import { MascotLoading } from "./MascotLoading";
import { MamMascot } from "./MamMascot";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Course, Progress } from "../types/course";
import { buildEpisode } from "../audio/transcript";
import type { PodcastController } from "../audio/usePodcast";
import { lessonState } from "../lib/roadmap";
import { Action, theme as t, ui } from "./ui";
import { Icon } from "./Icon";
function clock(value: number) {
  const n = Math.max(0, Math.floor(value || 0));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
}
export function Podcast({
  courses,
  courseId,
  completed,
  player: p,
  onCourse,
  onRead,
}: {
  courses: Course[];
  courseId: string;
  completed: Progress["completed"];
  player: PodcastController;
  onCourse: (id: string) => void;
  onRead: (courseId: string, index: number) => void;
}) {
  const [transcript, setTranscript] = useState(false);
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const e = p.episode;
  const preparing = p.loading || (p.status.isBuffering && !p.error);
  return (
    <View style={{ gap: 22, paddingTop: 12 }}>
      {!e && (
        <Text style={ui.body}>Nghe nội dung bài học và theo dõi bản đọc.</Text>
      )}
      {e && (
        <View style={[ui.card, { gap: 14, backgroundColor: t.selected }]}>
          <View style={ui.row}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: t.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="headphones" color={t.onPrimary} size={28} />
            </View>
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={ui.label}>BÀI GIẢNG</Text>
              <Text
                style={{
                  fontSize: 21,
                  lineHeight: 28,
                  fontWeight: "600",
                  color: t.ink,
                }}
              >
                {e.title}
              </Text>
            </View>
          </View>
          <Text style={ui.body}>{e.courseTitle}</Text>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Tiến độ nghe"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(
                (p.status.currentTime / (p.status.duration || 1)) * 100,
              ),
            }}
            style={{
              height: 5,
              borderRadius: 5,
              backgroundColor: t.line,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(100, (p.status.currentTime / (p.status.duration || 1)) * 100)}%`,
                backgroundColor: t.primary,
              }}
            />
          </View>
          {!preparing && (
            <Text style={[ui.body, { fontSize: 12 }]}>
              {p.status.isLoaded && p.partCount > 0
                ? `${p.partCount > 1 ? `Phần ${p.part + 1}/${p.partCount} · ` : ""}${clock(p.status.currentTime)} / ${clock(p.status.duration)}`
                : p.loading
                  ? "Đang chuẩn bị bài giảng…"
                  : "Chưa có âm thanh"}
            </Text>
          )}

          {preparing && (
            <MascotLoading
              compact
              label={
                p.loading ? "Đang chuẩn bị bài giảng…" : "Đang tải âm thanh…"
              }
            />
          )}
          <View style={[ui.row, { justifyContent: "center", gap: 14 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lùi 15 giây"
              onPress={() => void p.jump(-1)}
              style={{ padding: 14 }}
            >
              <Icon name="previous" size={26} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                p.loading
                  ? "Hủy chuẩn bị"
                  : p.playing
                    ? "Tạm dừng"
                    : "Phát bài giảng"
              }
              onPress={() =>
                void (p.playing || p.loading ? p.pause() : p.resume())
              }
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: t.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.loading ? (
                <Icon name="close" color={t.onPrimary} size={24} />
              ) : (
                <Icon
                  name={p.loading ? "close" : p.playing ? "pause" : "play"}
                  color={t.onPrimary}
                  size={28}
                />
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tiến 15 giây"
              onPress={() => void p.jump(1)}
              style={{ padding: 14 }}
            >
              <Icon name="next" size={26} />
            </Pressable>
          </View>
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Tốc độ ${p.rate}. Nhấn để đổi tốc độ`}
              onPress={() =>
                void p.changeRate(
                  p.rate === 1
                    ? 1.25
                    : p.rate === 1.25
                      ? 1.5
                      : p.rate === 1.5
                        ? 0.75
                        : 1,
                )
              }
              style={{ padding: 10 }}
            >
              <Text style={{ color: t.accent, fontWeight: "600" }}>
                {p.rate}×
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setTranscript(!transcript)}
              style={{ padding: 10 }}
            >
              <Text style={{ color: t.accent }}>
                {transcript ? "Ẩn bản đọc" : "Xem bản đọc"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dừng nghe"
              onPress={() => void p.stop()}
              style={{ padding: 10 }}
            >
              <Text style={{ color: t.muted }}>Dừng</Text>
            </Pressable>
          </View>
          <Action
            secondary
            icon="notes"
            onPress={() => onRead(e.courseId, e.lessonIndex)}
          >
            Đọc bài học
          </Action>
        </View>
      )}
      {p.error ? (
        <View style={[ui.card, { gap: 12 }]}>
          <Text
            accessibilityRole="alert"
            style={{ color: t.danger, lineHeight: 22 }}
          >
            {p.error}
          </Text>
          {e && (
            <Action secondary onPress={() => void p.load(e)}>
              Thử lại
            </Action>
          )}
        </View>
      ) : null}
      {transcript && e && (
        <View style={{ gap: 16 }}>
          <Text style={[ui.title, { fontSize: 22 }]}>Bản đọc</Text>
          {e.segments.map((s, i) => (
            <View
              key={i}
              style={{
                gap: 7,
                padding: 14,
                borderLeftWidth: 2,
                borderColor: t.line,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: t.accent }}
              >
                {i + 1}. {s.title}
              </Text>
              <Text
                selectable
                style={{ fontSize: 15, lineHeight: 25, color: t.ink }}
              >
                {s.text}
              </Text>
            </View>
          ))}
        </View>
      )}
      <Text style={[ui.title, { fontSize: 22 }]}>Chọn khóa học</Text>
      <View style={[ui.row, { flexWrap: "wrap", gap: 8 }]}>
        {courses.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityState={{ selected: c.id === course.id }}
            onPress={() => onCourse(c.id)}
            style={[
              ui.input,
              {
                padding: 11,
                backgroundColor: c.id === course.id ? t.selected : t.surface,
              },
            ]}
          >
            <Text style={{ fontSize: 13, color: t.ink }}>{c.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ gap: 0 }}>
        {course.lessons.map((lesson, i) => {
          const locked = lessonState(course, i, completed) === "locked";
          const active = e?.id === `${course.id}:${i}`;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Nghe: ${lesson.title}`}
              disabled={locked}
              accessibilityState={{ disabled: locked, selected: active }}
              onPress={() => void p.load(buildEpisode(course, i))}
              style={[
                ui.row,
                {
                  paddingVertical: 18,
                  borderBottomWidth: 1,
                  borderColor: t.line,
                },
              ]}
            >
              <Icon
                name={locked ? "lock" : "headphones"}
                color={active ? t.accent : t.muted}
              />
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: locked ? t.muted : t.ink,
                    fontWeight: active ? "600" : "400",
                  }}
                >
                  {lesson.title}
                </Text>
                <Text style={{ fontSize: 12, color: t.muted }}>
                  {locked
                    ? "Hoàn thành bài trước để mở"
                    : `Khoảng ${buildEpisode(course, i).estimatedMinutes} phút nghe`}
                </Text>
              </View>
              {active && (
                <Text style={{ fontSize: 11, color: t.accent }}>
                  {p.playing ? "Đang nghe" : "Đã chọn"}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
export function MiniPodcast({
  player: p,
  onOpen,
}: {
  player: PodcastController;
  onOpen: () => void;
}) {
  if (!p.episode) return null;
  return (
    <View
      style={[
        ui.row,
        {
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.line,
          borderRadius: 16,
          padding: 10,
          gap: 6,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mở trình phát podcast"
        onPress={onOpen}
        style={[ui.row, { flex: 1, gap: 10, padding: 4 }]}
      >
        {p.loading || (p.status.isBuffering && !p.error) ? (
          <MamMascot size={34} mood="thinking" />
        ) : (
          <Icon name="headphones" color={t.accent} />
        )}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 13, fontWeight: "600", color: t.ink }}
          >
            {p.episode.title}
          </Text>
          <Text style={{ fontSize: 11, color: t.muted }}>
            {p.error
              ? "Chưa phát được"
              : p.loading
                ? "Đang chuẩn bị"
                : p.playing
                  ? "Đang nghe"
                  : "Tạm dừng"}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          p.loading
            ? "Hủy chuẩn bị"
            : p.playing
              ? "Tạm dừng podcast"
              : "Phát podcast"
        }
        onPress={() => void (p.playing || p.loading ? p.pause() : p.resume())}
        style={{ padding: 12 }}
      >
        <Icon
          name={p.loading ? "close" : p.playing ? "pause" : "play"}
          color={t.accent}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đóng podcast"
        onPress={() => void p.stop()}
        style={{ padding: 10 }}
      >
        <Icon name="close" size={18} color={t.muted} />
      </Pressable>
    </View>
  );
}
