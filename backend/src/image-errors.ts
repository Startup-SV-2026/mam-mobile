import { AIError } from "./ai";
import type { ImageIssue } from "../../shared/types/course";
const record = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
export class ImageProviderError extends AIError {
  constructor(
    readonly issue: ImageIssue,
    status = 502,
  ) {
    super(issue.message, status);
    this.name = "ImageProviderError";
  }
}
// Keep only diagnostic fields; never persist provider messages, request URLs, or credentials.
export async function imageResponseError(
  response: Response,
  now = Date.now(),
): Promise<ImageProviderError> {
  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    raw = {};
  }
  const error = record(record(raw).error);
  const message = typeof error.message === "string" ? error.message : "";
  const details = Array.isArray(error.details) ? error.details.map(record) : [];
  const violations = details.flatMap((d) =>
    Array.isArray(d.violations) ? d.violations.map(record) : [],
  );
  const zero =
    violations.some((v) => v.quotaValue === "0" || v.quotaValue === 0) ||
    /\blimit\s*:\s*0\b/i.test(message);
  const daily = violations.some((v) =>
    /PerDay|daily|per_day/i.test(
      String(v.quotaId) + " " + String(v.quotaMetric),
    ),
  );
  const metric = violations
    .map((v) => v.quotaId || v.quotaMetric)
    .find((v) => typeof v === "string" && /^[\w./-]{1,180}$/.test(v));
  const retry = details.find((d) =>
    String(d["@type"]).endsWith("RetryInfo"),
  )?.retryDelay;
  let retryMs =
    typeof retry === "string" && /^\d+(\.\d+)?s$/.test(retry)
      ? parseFloat(retry) * 1000
      : undefined;
  if (typeof retry === "object" && retry !== null && "seconds" in retry) {
    const seconds = Number(retry.seconds);
    if (Number.isFinite(seconds) && seconds >= 0) retryMs = seconds * 1000;
  }
  const header = response.headers.get("retry-after");
  if (header) {
    const seconds = Number(header);
    const delay = Number.isFinite(seconds)
      ? seconds * 1000
      : Date.parse(header) - now;
    if (Number.isFinite(delay) && delay >= 0)
      retryMs = Math.max(retryMs ?? 0, delay);
  }
  const diagnostic = {
    ...(metric ? { metric: String(metric) } : {}),
    ...(zero ? { limit: 0 } : {}),
  };
  if (response.status === 429) {
    if (zero || daily)
      return new ImageProviderError(
        {
          kind: "quota_exhausted",
          message: zero
            ? "Model ảnh đang có quota bằng 0. Hàng đợi đã tạm dừng."
            : "Đã chạm hạn mức theo ngày của model ảnh. Hàng đợi đã tạm dừng.",
          ...diagnostic,
        },
        429,
      );
    if (
      retryMs !== undefined ||
      violations.some((v) => /PerMinute|PerSecond/i.test(String(v.quotaId)))
    )
      return new ImageProviderError(
        {
          kind: "rate_limit",
          message:
            "Model ảnh đang giới hạn tốc độ. Máy chủ sẽ chờ rồi thử lại.",
          retryAt: now + Math.max(5000, retryMs ?? 30000),
          ...diagnostic,
        },
        429,
      );
    return new ImageProviderError(
      {
        kind: "unknown",
        message:
          "Google trả lỗi 429 nhưng chưa nêu rõ loại hạn mức. Hàng đợi đã dừng để tránh gọi lặp.",
        ...diagnostic,
      },
      429,
    );
  }
  if ([400, 401, 403, 404].includes(response.status))
    return new ImageProviderError({
      kind: "access",
      message:
        "Chưa truy cập được model ảnh. Cần kiểm tra key, tên model và quyền truy cập.",
    });
  if (response.status >= 500)
    return new ImageProviderError({
      kind: "temporary",
      message:
        "Dịch vụ tạo ảnh đang tạm gián đoạn. Máy chủ sẽ thử lại có giới hạn.",
      retryAt: now + Math.max(5000, retryMs ?? 30000),
    });
  return new ImageProviderError({
    kind: "unknown",
    message:
      "Chưa hoàn tất yêu cầu tạo ảnh. Có thể kiểm tra lại trong trạng thái AI.",
  });
}
