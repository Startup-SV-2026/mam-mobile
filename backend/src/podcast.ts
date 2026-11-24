import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { EdgeTTS } from "node-edge-tts";
export interface PodcastInput {
  episodeId: string;
  title: string;
  segments: { title: string; text: string; language: string }[];
}
export interface PodcastProvider {
  synthesize(
    input: PodcastInput,
    signal: AbortSignal,
  ): Promise<{ audioUrl?: string; audioUrls?: string[] }>;
  asset?(id: string): Promise<Buffer | null>;
}
export function isPodcastInput(value: unknown): value is PodcastInput {
  if (!value || typeof value !== "object") return false;
  const v = value as PodcastInput;
  const text = (s: unknown, max: number) =>
    typeof s === "string" && s.trim().length > 0 && s.length <= max;
  return (
    text(v.episodeId, 300) &&
    text(v.title, 300) &&
    Array.isArray(v.segments) &&
    v.segments.length > 0 &&
    v.segments.length <= 200 &&
    v.segments.every(
      (s) =>
        s &&
        text(s.title, 300) &&
        text(s.text, 900) &&
        ["vi-VN", "en-US"].includes(s.language),
    )
  );
}
// FPT v5 accepts at most 5,000 characters per request. All parts use one voice.
export function narrationParts(input: PodcastInput): string[] {
  const parts: string[] = [];
  for (const segment of input.segments) {
    const text = segment.text.trim();
    if (!parts.length || parts.at(-1)!.length + text.length + 2 > 5000)
      parts.push(text);
    else parts[parts.length - 1] += "\n\n" + text;
  }
  return parts.map((p) => (p.length < 3 ? p + "..." : p));
}
export class PodcastError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}
interface Options {
  apiKey?: string;
  cacheDir?: string;
  request?: typeof fetch;
  pollMs?: number;
  attempts?: number;
}
export class FptPodcastProvider implements PodcastProvider {
  readonly voice = "banmai"; // One Vietnamese female Northern voice throughout the app.
  private cacheDir: string;
  private request: typeof fetch;
  private apiKey: string;
  private pending = new Map<string, Promise<string>>();
  constructor(private options: Options = {}) {
    this.apiKey = options.apiKey ?? process.env.FPT_API_KEY ?? "";
    this.cacheDir =
      options.cacheDir ??
      process.env.PODCAST_CACHE_DIR ??
      "backend/.cache/podcasts";
    this.request = options.request ?? fetch;
  }
  private id(text: string) {
    return createHash("sha256")
      .update(
        JSON.stringify({
          provider: "fpt-v5",
          voice: this.voice,
          speed: 0,
          text,
        }),
      )
      .digest("hex");
  }
  async asset(id: string) {
    if (!/^[a-f0-9]{64}$/.test(id)) return null;
    try {
      return await readFile(path.join(this.cacheDir, id + ".mp3"));
    } catch {
      return null;
    }
  }
  private async save(file: string, content: string | Uint8Array) {
    const temp = file + "." + randomUUID() + ".tmp";
    await writeFile(temp, content);
    await rename(temp, file);
  }
  private async prepare(
    text: string,
    id: string,
    signal: AbortSignal,
  ): Promise<string> {
    await mkdir(this.cacheDir, { recursive: true });
    const metadata = path.join(this.cacheDir, id + ".json");
    let url: string | undefined;
    try {
      const saved = JSON.parse(await readFile(metadata, "utf8"));
      url = saved.url;
    } catch {}
    if (!url) {
      const response = await this.request("https://api.fpt.ai/hmi/tts/v5", {
        method: "POST",
        signal,
        headers: {
          api_key: this.apiKey,
          voice: this.voice,
          speed: "0",
          format: "mp3",
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: text,
      });
      if ([401, 403].includes(response.status))
        throw new PodcastError(
          "API key giọng đọc không hợp lệ. Kiểm tra FPT_API_KEY trong backend/.env.",
          503,
        );
      if (response.status === 429)
        throw new PodcastError(
          "Tạo giọng đọc đã chạm hạn mức. Hãy thử lại sau.",
          429,
        );
      if (!response.ok)
        throw new PodcastError("Dịch vụ giọng đọc chưa phản hồi. Hãy thử lại.");
      const data = await response.json();
      if (data?.error !== 0 || typeof data.async !== "string")
        throw new PodcastError(
          "FPT.AI chưa tạo được giọng đọc. Kiểm tra key và hạn mức tài khoản.",
        );
      const parsed = new URL(data.async);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password)
        throw new PodcastError("Dịch vụ trả về địa chỉ âm thanh không hợp lệ.");
      url = parsed.href;
      // Preserve the pending URL so retries poll the existing job instead of paying again.
      await this.save(metadata, JSON.stringify({ url }));
    }
    for (let attempt = 0; attempt < (this.options.attempts ?? 60); attempt++) {
      signal.throwIfAborted();
      const response = await this.request(url, { signal });
      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (!/audio\/|application\/octet-stream/i.test(contentType))
          throw new PodcastError("Dịch vụ chưa trả về tệp MP3 hợp lệ.");
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length || bytes.length > 20 * 1024 * 1024)
          throw new PodcastError("Tệp âm thanh không hợp lệ.");
        await this.save(path.join(this.cacheDir, id + ".mp3"), bytes);
        return `/media/podcasts/${id}`;
      }
      if (![403, 404, 429, 500, 502, 503, 504].includes(response.status))
        throw new PodcastError("Không tải được âm thanh từ dịch vụ giọng đọc.");
      await delay(this.options.pollMs ?? 2000, undefined, { signal });
    }
    throw new PodcastError(
      "Bài giảng vẫn đang được xử lý. Hãy thử lại sau; Mầm sẽ dùng lại yêu cầu đã tạo.",
      504,
    );
  }
  async synthesize(input: PodcastInput, signal: AbortSignal) {
    if (!this.apiKey.trim())
      throw new PodcastError(
        "Chưa kết nối giọng đọc. Thêm FPT_API_KEY vào backend/.env rồi khởi động lại máy chủ Mầm.",
        503,
      );
    const parts = narrationParts(input);
    // Sequential requests avoid bursting the free tier. Cached parts cost no new request.
    const audioUrls: string[] = [];
    for (const text of parts) {
      signal.throwIfAborted();
      const id = this.id(text);
      if (await this.asset(id)) {
        audioUrls.push(`/media/podcasts/${id}`);
        continue;
      }
      let job = this.pending.get(id);
      if (!job) {
        job = this.prepare(text, id, signal);
        this.pending.set(id, job);
        void job.finally(() => this.pending.delete(id)).catch(() => {});
      }
      audioUrls.push(await job);
      signal.throwIfAborted();
    }
    return { audioUrls };
  }
}

export class EdgePodcastProvider implements PodcastProvider {
  readonly voice: string;
  private cacheDir: string;
  private pending = new Map<string, Promise<string>>();

  constructor(options: { voice?: string; cacheDir?: string } = {}) {
    this.voice =
      options.voice ??
      process.env.PODCAST_VOICE ??
      "vi-VN-HoaiMyNeural"; // Microsoft Edge Vietnamese natural female voice
    this.cacheDir =
      options.cacheDir ??
      process.env.PODCAST_CACHE_DIR ??
      "backend/.cache/podcasts";
  }

  private id(text: string) {
    return createHash("sha256")
      .update(
        JSON.stringify({
          provider: "edge-tts",
          voice: this.voice,
          text,
        }),
      )
      .digest("hex");
  }

  async asset(id: string) {
    if (!/^[a-f0-9]{64}$/.test(id)) return null;
    try {
      return await readFile(path.join(this.cacheDir, id + ".mp3"));
    } catch {
      return null;
    }
  }

  async synthesize(input: PodcastInput, signal: AbortSignal) {
    await mkdir(this.cacheDir, { recursive: true });
    const parts = narrationParts(input);
    const audioUrls: string[] = [];

    for (const text of parts) {
      signal.throwIfAborted();
      const id = this.id(text);
      if (await this.asset(id)) {
        audioUrls.push(`/media/podcasts/${id}`);
        continue;
      }
      let job = this.pending.get(id);
      if (!job) {
        job = (async () => {
          const tts = new EdgeTTS({ voice: this.voice });
          const targetPath = path.join(this.cacheDir, id + ".mp3");
          const tempPath = targetPath + "." + randomUUID() + ".tmp";
          try {
            await tts.ttsPromise(text, tempPath);
            await rename(tempPath, targetPath);
            return `/media/podcasts/${id}`;
          } catch (err) {
            try {
              await rm(tempPath, { force: true });
            } catch {}
            throw new PodcastError(
              "Không thể tạo giọng đọc Microsoft Edge TTS. Hãy kiểm tra kết nối mạng.",
              502,
            );
          }
        })();
        this.pending.set(id, job);
        void job.finally(() => this.pending.delete(id)).catch(() => {});
      }
      audioUrls.push(await job);
      signal.throwIfAborted();
    }
    return { audioUrls };
  }
}

export function createPodcastProvider(): PodcastProvider {
  const provider = (process.env.PODCAST_PROVIDER || "").toLowerCase().trim();
  if (provider === "edge") {
    return new EdgePodcastProvider();
  }
  return new FptPodcastProvider();
}
