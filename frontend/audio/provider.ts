import { fetchBackend } from "../services/backend-fetch";
import type { PodcastEpisode } from "./transcript";
export interface NarrationAsset {
  urls: string[];
}
export interface NarrationProvider {
  create(episode: PodcastEpisode, signal: AbortSignal): Promise<NarrationAsset>;
}
// The app only talks to the Mầm backend. FPT credentials stay on the server.
export function createApiNarrationProvider(
  baseUrl: string,
  request: typeof fetch = fetch,
): NarrationProvider {
  return {
    async create(episode, signal) {
      if (!baseUrl) throw Error("Chưa kết nối dịch vụ giọng đọc.");
      const r = await fetchBackend(
        `${baseUrl.replace(/\/$/, "")}/api/podcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal,
          body: JSON.stringify({
            episodeId: episode.id,
            title: episode.title,
            segments: episode.segments,
          }),
        },
        request,
      );
      if (r.status === 404)
        throw Error(
          "Máy chủ chưa hỗ trợ podcast. Hãy cập nhật và khởi động lại máy chủ Mầm.",
        );
      const body = await r.json();
      if (!r.ok)
        throw Error(body?.error || "Chưa tạo được giọng đọc. Hãy thử lại.");
      const values =
        body?.audioUrls ?? (body?.audioUrl ? [body.audioUrl] : null);
      if (!Array.isArray(values) || values.length < 1 || values.length > 100)
        throw Error("Dịch vụ chưa trả về âm thanh hợp lệ.");
      const urls = values.map((value: unknown) => {
        if (typeof value !== "string" || !value.trim())
          throw Error("Địa chỉ âm thanh không hợp lệ.");
        const url = new URL(value, baseUrl);
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password
        )
          throw Error("Địa chỉ âm thanh không hợp lệ.");
        return url.href;
      });
      return { urls };
    },
  };
}
export const narrationProvider = createApiNarrationProvider(
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787",
);
