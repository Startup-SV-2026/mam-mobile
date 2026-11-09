import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  IllustrationStore,
  generateImage,
  illustrationPrompt,
  imageConfig,
  type ImageResult,
} from "../server/illustrations";
import { createApp } from "../server/index";
import { AIError } from "../server/ai";
import { STARTER_COURSES } from "../data/courses";
import { isCourseContent, readProgress } from "../src/types/course";
const plan = {
  scene: "Trái Đất và Mặt Trời trong không gian",
  caption: "Minh họa nghệ thuật, không theo tỉ lệ.",
  alt: "Trái Đất màu xanh gần Mặt Trời.",
};
const png = () =>
  readFile(join(process.cwd(), "assets/illustrations/space.png"));
async function waitReady(store: IllustrationStore, id: string) {
  for (let i = 0; i < 150; i++) {
    const s = store.status(id);
    if (s?.status === "ready" || s?.status === "failed") return s;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error("Job did not finish");
}
test("image adapter uses a separate model and key header, excludes thoughts, and validates returned image bytes", async () => {
  const bytes = await png();
  let calls = 0;
  const cfg = { ...imageConfig({}), enabled: true, apiKey: "fake-image-key" };
  const fake: typeof fetch = async (url, init) => {
    calls++;
    assert.ok(String(url).includes("gemini-3.1-flash-image:generateContent"));
    assert.ok(!String(url).includes(cfg.apiKey));
    assert.equal(new Headers(init?.headers).get("x-goog-api-key"), cfg.apiKey);
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.generationConfig.responseModalities, [
      "TEXT",
      "IMAGE",
    ]);
    assert.equal(body.generationConfig.imageConfig.aspectRatio, "3:2");
    assert.match(body.contents[0].parts[0].text, /mam-clay-v1/);
    return new Response(
      JSON.stringify({
        candidates: [
          {
            finishReason: "STOP",
            content: {
              parts: [
                {
                  thought: true,
                  inlineData: { mimeType: "image/png", data: "bad" },
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: bytes.toString("base64"),
                  },
                },
              ],
            },
          },
        ],
      }),
    );
  };
  const image = await generateImage(cfg, plan, fake);
  assert.ok(image.bytes.equals(bytes));
  assert.equal(calls, 1);
  for (const payload of [
    { candidates: [] },
    { promptFeedback: { blockReason: "SAFETY" } },
    { candidates: [{ finishReason: "MAX_TOKENS" }] },
    {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: Buffer.from("not an image").toString("base64"),
                },
              },
            ],
          },
        },
      ],
    },
  ])
    await assert.rejects(
      generateImage(
        cfg,
        plan,
        async () => new Response(JSON.stringify(payload)),
      ),
      AIError,
    );
  await assert.rejects(
    generateImage(
      cfg,
      plan,
      async () => new Response("private key details", { status: 429 }),
    ),
    /hạn mức/,
  );
});
test("queue deduplicates work, persists ready images across restarts, and never calls provider when disabled", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mam-art-"));
  let calls = 0;
  const cfg = {
    ...imageConfig({}),
    directory: dir,
    enabled: true,
    apiKey: "fake-key",
  };
  const generate = async (): Promise<ImageResult> => {
    calls++;
    return { bytes: await png(), mimeType: "image/png" };
  };
  try {
    const store = new IllustrationStore(cfg, generate);
    await store.initialize();
    const first = await store.ensure(plan);
    assert.ok(first);
    assert.equal((await store.ensure(plan))?.id, first.id);
    assert.equal((await waitReady(store, first.id))?.status, "ready");
    assert.equal(calls, 1);
    assert.ok((await store.asset(first.id))?.bytes.length);
    assert.equal(await store.asset("../secret"), null);
    const restarted = new IllustrationStore(cfg, generate);
    await restarted.initialize();
    assert.equal((await restarted.ensure(plan))?.status, "ready");
    assert.equal(calls, 1);
    const disabled = new IllustrationStore(
      { ...cfg, enabled: false },
      generate,
    );
    assert.equal(await disabled.ensure(plan), null);
    assert.equal(calls, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("failed jobs stay failed until an explicit retry and repeated retries are bounded", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mam-art-fail-"));
  let calls = 0;
  const store = new IllustrationStore(
    { ...imageConfig({}), enabled: true, apiKey: "fake", directory: dir },
    async () => {
      calls++;
      throw new AIError("Quota hết.");
    },
  );
  try {
    await store.initialize();
    const job = await store.ensure(plan);
    assert.ok(job);
    assert.equal((await waitReady(store, job.id))?.status, "failed");
    await store.ensure(plan);
    assert.equal(calls, 1);
    await store.ensure(plan, true);
    await waitReady(store, job.id);
    assert.equal(calls, 2);
    await store.ensure(plan, true);
    await waitReady(store, job.id);
    assert.equal(calls, 3);
    await store.ensure(plan, true);
    assert.equal(calls, 3);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("HTTP course creation returns before pictures finish, then status and media serve cached artwork", async () => {
  const dir = await mkdtemp(join(tmpdir(), "mam-art-http-"));
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  let imageCalls = 0;
  const images = new IllustrationStore(
    { ...imageConfig({}), directory: dir, enabled: true, apiKey: "fake" },
    async () => {
      imageCalls++;
      await gate;
      return { bytes: await png(), mimeType: "image/png" };
    },
  );
  const fixture = {
    ...STARTER_COURSES[0],
    lessons: STARTER_COURSES[0].lessons.map((l, i) => ({
      ...l,
      illustrationPlan: { ...plan, scene: `${plan.scene}: ${i}` },
    })),
  };
  const ids: string[] = [];
  const { server } = createApp({
    config: { provider: "gemini", model: "test-text", apiKey: "fake" },
    images,
    completeProvider: async () => JSON.stringify(fixture),
  });
  try {
    await images.initialize();
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    const r = await fetch(`${base}/api/course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "Vũ trụ", level: "Người mới" }),
    });
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(isCourseContent(body.course));
    const id = body.course.lessons[0].illustration.id;
    ids.push(
      ...body.course.lessons.map(
        (l: { illustration: { id: string } }) => l.illustration.id,
      ),
    );
    assert.ok(
      ["queued", "generating"].includes(
        (await (await fetch(`${base}/api/illustrations/${id}`)).json()).status,
      ),
    );
    assert.equal(
      (await fetch(`${base}/media/illustrations/${id}`)).status,
      404,
    );
    release();
    assert.equal((await waitReady(images, id))?.status, "ready");
    const asset = await fetch(`${base}/media/illustrations/${id}`);
    assert.equal(asset.headers.get("content-type"), "image/png");
    assert.ok(Buffer.from(await asset.arrayBuffer()).equals(await png()));
    await fetch(`${base}/api/course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "Vũ trụ", level: "Người mới" }),
    });
    for (const l of body.course.lessons)
      await waitReady(images, l.illustration.id);
    assert.equal(imageCalls, 3);
  } finally {
    release();
    await Promise.all(ids.map((id) => waitReady(images, id)));
    await new Promise<void>((r) => server.close(() => r()));
    await rm(dir, { recursive: true, force: true });
  }
});
test("old courses remain readable and image refs survive local progress parsing", () => {
  const id = "a".repeat(64);
  assert.ok(isCourseContent(STARTER_COURSES[0]));
  assert.deepEqual(
    readProgress({ illustrationIds: { "space:0": id, bad: "../../secret" } })
      .illustrationIds,
    { "space:0": id },
  );
  assert.equal(
    isCourseContent({
      ...STARTER_COURSES[0],
      lessons: [
        { ...STARTER_COURSES[0].lessons[0], illustrationPlan: { scene: "x" } },
      ],
    }),
    false,
  );
  assert.match(illustrationPrompt(plan), /no words/i);
});
