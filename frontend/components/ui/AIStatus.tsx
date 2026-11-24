import { MascotLoading } from "../mascot/MascotLoading";
import { fetchBackend } from "../../services/backend-fetch";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import type {
  ImagePipeline,
  IllustrationStatus,
  Lesson,
} from "../../types/course";
import { Action, theme as t, ui } from "./ui";
import { Icon } from "./Icon";
import { requireIllustrationBackend } from "../../services/illustration-api";
const base = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
type Job = IllustrationStatus & { title: string; caption: string };
export function AIStatus({
  lesson,
  courseTitle,
  onAsset,
  onBack,
}: {
  lesson: Lesson;
  courseTitle: string;
  onAsset: (id: string) => void;
  onBack: () => void;
}) {
  const [pipeline, setPipeline] = useState<ImagePipeline | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let controller: AbortController;
    const load = async () => {
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        if (!base) throw new Error("Chưa cấu hình địa chỉ backend.");
        const r = await fetchBackend(`${base}/api/illustrations/status`, {
          signal: controller.signal,
        });
        if (!r.ok)
          throw new Error(
            r.status === 404
              ? "Backend cần được khởi động lại để có trang trạng thái AI."
              : "Chưa tải được trạng thái AI.",
          );
        const body = await r.json();
        if (active) {
          setPipeline(body.pipeline);
          setJobs(Array.isArray(body.jobs) ? body.jobs : []);
          setModel(body.model);
          setError("");
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "Không kết nối được backend.",
          );
      } finally {
        clearTimeout(timeout);
        if (active) timer = setTimeout(load, 5000);
      }
    };
    void load();
    return () => {
      active = false;
      controller?.abort();
      clearTimeout(timer);
    };
  }, [refresh]);
  async function act(action: "resume" | "create") {
    setBusy(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      await requireIllustrationBackend(base, controller.signal);
      const r = await fetchBackend(
        `${base}/api/illustrations${action === "resume" ? "/control" : ""}`,
        {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            action === "resume"
              ? { action: "resume" }
              : { courseTitle, lesson, retry: true },
          ),
        },
      );
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "Chưa thực hiện được thao tác.");
      if (action === "create") {
        if (typeof body.id !== "string" || !/^[a-f0-9]{64}$/.test(body.id))
          throw new Error("Mã tranh chưa hợp lệ.");
        onAsset(body.id);
      }
      setRefresh((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa kết nối được AI.");
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  const label =
    pipeline?.state === "active"
      ? "Sẵn sàng"
      : pipeline?.state === "cooldown"
        ? "Đang chờ tự thử lại"
        : pipeline?.state === "paused"
          ? "Hàng đợi tạm dừng"
          : pipeline?.state === "disabled"
            ? "Tạo ảnh đang tắt"
            : pipeline?.state === "unconfigured"
              ? "Chưa cấu hình key"
              : "Đang kết nối";
  const issue = pipeline?.issue;
  const ready = jobs.filter((j) => j.status === "ready");
  return (
    <View style={{ gap: 20 }}>
      <Action secondary icon="back" onPress={onBack}>
        QUAY LẠI
      </Action>
      <View style={[ui.card, { gap: 14, backgroundColor: t.soft }]}>
        <View style={ui.row}>
          <Icon name="sparkle" color={t.accent} />
          <Text
            style={{ fontSize: 21, fontWeight: "700", color: t.ink, flex: 1 }}
          >
            {label}
          </Text>
        </View>
        <Text style={ui.body}>
          Bài học và sơ đồ vẫn dùng bình thường khi ảnh chưa sẵn sàng.
        </Text>
        {(busy || (!pipeline && !error)) && (
          <MascotLoading compact label="Đang kết nối AI…" />
        )}
        {!busy &&
          jobs.some(
            (j) => j.status === "generating" || j.status === "queued",
          ) && <MascotLoading compact label="Đang chuẩn bị tranh minh họa…" />}
      </View>
      {error ? (
        <Text
          accessibilityRole="alert"
          style={{ fontSize: 14, lineHeight: 22, color: t.danger }}
        >
          {error}
        </Text>
      ) : null}
      {issue && (
        <View style={[ui.card, { gap: 10 }]}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: t.ink }}>
            Thông tin từ dịch vụ ảnh
          </Text>
          <Text style={ui.body}>{issue.message}</Text>
          {issue.limit !== undefined && (
            <Text style={ui.body}>Quota được báo: {issue.limit}</Text>
          )}
          {issue.metric && (
            <Text
              selectable
              style={{ fontSize: 12, lineHeight: 19, color: t.muted }}
            >
              {issue.metric}
            </Text>
          )}
          {issue.retryAt && (
            <Text style={ui.body}>
              Tự thử lại sau{" "}
              {new Date(issue.retryAt).toLocaleTimeString("vi-VN")}.
            </Text>
          )}
          {!issue.retryAt && (
            <Text style={ui.body}>
              Kiểm tra quota, model và quyền truy cập trong Google AI Studio.
              Khi đã xử lý, bạn có thể cho hàng đợi chạy lại bên dưới.
            </Text>
          )}
        </View>
      )}
      <View style={ui.row}>
        {[
          ["ready", "Đã có"],
          ["queued", "Đang chờ"],
          ["paused", "Tạm dừng"],
        ].map(([key, label]) => (
          <View
            key={key}
            style={[
              ui.card,
              { flex: 1, padding: 12, gap: 6, alignItems: "center" },
            ]}
          >
            <Text style={{ fontSize: 24, color: t.ink }}>
              {pipeline?.counts[key] ?? 0}
            </Text>
            <Text style={{ fontSize: 11, color: t.muted }}>{label}</Text>
          </View>
        ))}
      </View>
      {["paused", "cooldown"].includes(pipeline?.state ?? "") && (
        <Action disabled={busy} onPress={() => act("resume")}>
          KIỂM TRA LẠI VÀ TIẾP TỤC
        </Action>
      )}
      <View style={[ui.card, { gap: 13 }]}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: t.ink }}>
          Bài đang đọc
        </Text>
        <Text style={ui.body}>{lesson.title}</Text>
        <Action
          secondary
          disabled={
            busy ||
            ["paused", "cooldown", "disabled", "unconfigured"].includes(
              pipeline?.state ?? "",
            )
          }
          onPress={() => act("create")}
        >
          TẠO HOẶC DÙNG LẠI TRANH
        </Action>
        <Text style={{ fontSize: 11, lineHeight: 18, color: t.muted }}>
          Mỗi yêu cầu có thể sử dụng quota API ảnh. Tranh cùng mô tả cảnh sẽ
          dùng lại bản đã lưu.
        </Text>
      </View>
      <Text style={ui.label}>MODEL ẢNH</Text>
      <Text selectable style={ui.body}>
        {model || "—"}
      </Text>
      <Action
        secondary
        disabled={busy}
        onPress={() => setRefresh((v) => v + 1)}
      >
        LÀM MỚI TRẠNG THÁI
      </Action>
      {ready.length > 0 && (
        <>
          <Text style={[ui.title, { fontSize: 22 }]}>
            Thư viện tranh đã lưu
          </Text>
          {ready
            .slice(-10)
            .reverse()
            .map((job) => (
              <View key={job.id} style={[ui.card, { padding: 12, gap: 9 }]}>
                <Image
                  accessibilityLabel={job.title}
                  source={{ uri: `${base}/media/illustrations/${job.id}` }}
                  resizeMode="contain"
                  style={{ width: "100%", height: 180, borderRadius: 12 }}
                />
                <Text style={[ui.body, { fontSize: 13 }]}>{job.caption}</Text>
              </View>
            ))}
        </>
      )}
      {jobs.some((j) => j.status === "failed") && (
        <>
          <Text style={ui.label}>YÊU CẦU CHƯA HOÀN TẤT</Text>
          {jobs
            .filter((j) => j.status === "failed")
            .slice(-5)
            .map((j) => (
              <View key={j.id} style={[ui.card, { gap: 7, padding: 15 }]}>
                <Text style={{ fontWeight: "600", color: t.ink }}>
                  {j.title}
                </Text>
                <Text style={[ui.body, { fontSize: 13 }]}>
                  {j.issue?.message ?? j.error ?? "Chưa có tranh."}
                </Text>
              </View>
            ))}
        </>
      )}
    </View>
  );
}
