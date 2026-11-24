import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  FptPodcastProvider,
  narrationParts,
  PodcastError,
  type PodcastInput,
} from "../src/podcast";
import { createApp } from "../src/index";
const input: PodcastInput = {
  episodeId: "one",
  title: "Bài học",
  segments: [
    {
      title: "Mở đầu",
      text: "Nội dung bài học bằng tiếng Việt.",
      language: "vi-VN",
    },
  ],
};
test("FPT text parts preserve content and respect the 5000 character API limit", () => {
  const source = {
    ...input,
    segments: Array.from({ length: 20 }, (_, i) => ({
      title: "Bài",
      text: String(i) + " " + "Từ vựng. ".repeat(99),
      language: "vi-VN",
    })),
  };
  const parts = narrationParts(source);
  assert.ok(parts.length > 1);
  assert.ok(parts.every((p) => p.length >= 3 && p.length <= 5000));
  assert.equal(
    parts.join("\n\n"),
    source.segments.map((s) => s.text.trim()).join("\n\n"),
  );
});
test("FPT uses one server-side voice, polls pending MP3 and reuses persistent cache", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "mam-podcast-"));
  let posts = 0,
    gets = 0;
  const request: typeof fetch = async (url, init) => {
    if (init?.method === "POST") {
      posts++;
      assert.equal(url, "https://api.fpt.ai/hmi/tts/v5");
      assert.equal(new Headers(init.headers).get("api_key"), "test-only");
      assert.equal(new Headers(init.headers).get("voice"), "banmai");
      assert.equal(init.body, input.segments[0].text);
      return Response.json({ error: 0, async: "https://audio.test/file.mp3" });
    }
    gets++;
    assert.equal(new Headers(init?.headers).has("api_key"), false);
    return gets === 1
      ? new Response("", { status: 404 })
      : new Response("ID3testaudio", {
          headers: { "Content-Type": "audio/mpeg" },
        });
  };
  try {
    const p = new FptPodcastProvider({
      apiKey: "test-only",
      cacheDir: dir,
      request,
      pollMs: 1,
    });
    const asset = await p.synthesize(input, new AbortController().signal);
    assert.equal(posts, 1);
    assert.equal(gets, 2);
    assert.equal(asset.audioUrls.length, 1);
    const id = asset.audioUrls[0].split("/").at(-1)!;
    assert.equal((await p.asset(id))?.toString(), "ID3testaudio");
    assert.equal(await p.asset("../secret"), null);
    const restored = new FptPodcastProvider({
      apiKey: "test-only",
      cacheDir: dir,
      request: async () => {
        throw Error("must not call provider");
      },
    });
    assert.deepEqual(
      await restored.synthesize(
        { ...input, episodeId: "other-id" },
        new AbortController().signal,
      ),
      asset,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("retry continues an existing FPT job without creating and charging again", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "mam-podcast-"));
  let posts = 0,
    available = false;
  const request: typeof fetch = async (_, init) => {
    if (init?.method === "POST") {
      posts++;
      return Response.json({ error: 0, async: "https://audio.test/file.mp3" });
    }
    return available
      ? new Response("ID3audio", { headers: { "Content-Type": "audio/mpeg" } })
      : new Response("", { status: 404 });
  };
  try {
    const p = new FptPodcastProvider({
      apiKey: "test",
      cacheDir: dir,
      request,
      pollMs: 1,
      attempts: 1,
    });
    await assert.rejects(
      p.synthesize(input, new AbortController().signal),
      /vẫn đang được xử lý/,
    );
    available = true;
    await p.synthesize(input, new AbortController().signal);
    assert.equal(posts, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("missing key, quota, authorization and cancellation never leak provider details", async () => {
  await assert.rejects(
    new FptPodcastProvider({ apiKey: "" }).synthesize(
      input,
      new AbortController().signal,
    ),
    /FPT_API_KEY/,
  );
  for (const status of [401, 403, 429]) {
    const dir = await mkdtemp(path.join(tmpdir(), "mam-podcast-"));
    try {
      const p = new FptPodcastProvider({
        apiKey: "secret",
        cacheDir: dir,
        request: async () =>
          new Response("sensitive provider response", { status }),
      });
      await assert.rejects(
        p.synthesize(input, new AbortController().signal),
        (e: unknown) =>
          e instanceof PodcastError &&
          !e.message.includes("sensitive") &&
          e.status === (status === 429 ? 429 : 503),
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }
  const c = new AbortController();
  c.abort();
  let called = false;
  await assert.rejects(
    new FptPodcastProvider({
      apiKey: "test",
      request: async () => {
        called = true;
        throw Error();
      },
    }).synthesize(input, c.signal),
  );
  assert.equal(called, false);
});
test("podcast media serves byte ranges for audio seeking and rejects invalid ranges", async () => {
  const id = "a".repeat(64),
    bytes = Buffer.from("ID3audiofixture");
  const app = createApp({
    podcastProvider: {
      async synthesize() {
        return { audioUrls: [`/media/podcasts/${id}`] };
      },
      async asset(key) {
        return key === id ? bytes : null;
      },
    },
  });
  await new Promise<void>((resolve) =>
    app.server.listen(0, "127.0.0.1", resolve),
  );
  const address = app.server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const r = await fetch(`${base}/media/podcasts/${id}`, {
      headers: { range: "bytes=3-7" },
    });
    assert.equal(r.status, 206);
    assert.equal(await r.text(), bytes.subarray(3, 8).toString());
    assert.equal(r.headers.get("content-range"), `bytes 3-7/${bytes.length}`);
    assert.equal(
      (
        await fetch(`${base}/media/podcasts/${id}`, {
          headers: { range: "bytes=999-" },
        })
      ).status,
      416,
    );
    const post = await fetch(`${base}/api/podcast`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    assert.equal(post.status, 200);
    assert.deepEqual(await post.json(), {
      audioUrls: [`/media/podcasts/${id}`],
    });
  } finally {
    await new Promise<void>((resolve) => app.server.close(() => resolve()));
  }
});
