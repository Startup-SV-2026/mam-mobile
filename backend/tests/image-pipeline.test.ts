import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { imageResponseError, ImageProviderError } from "../src/image-errors";
import { IllustrationStore, imageConfig } from "../src/illustrations";
const plan = {
  scene: "A clay tree learning from repetition",
  caption: "Minh họa cây.",
  alt: "Một cây nhỏ",
};
const wait = async (check: () => boolean) => {
  for (let i = 0; i < 150; i++) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error("Timed out");
};
const quota = (message: string, violations: unknown[], retryDelay = "5s") =>
  new Response(
    JSON.stringify({
      error: {
        message,
        details: [
          {
            "@type": "type.googleapis.com/google.rpc.QuotaFailure",
            violations,
          },
          { "@type": "type.googleapis.com/google.rpc.RetryInfo", retryDelay },
        ],
      },
    }),
    { status: 429 },
  );
test("quota zero and daily limits outrank a misleading short retry delay; diagnostics never retain raw messages", async () => {
  const zero = await imageResponseError(
    quota("secret-key quota limit: 0", [
      {
        quotaId: "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
        quotaValue: "0",
      },
    ]),
    1000,
  );
  assert.equal(zero.issue.kind, "quota_exhausted");
  assert.equal(zero.issue.limit, 0);
  assert.equal(zero.issue.retryAt, undefined);
  assert.ok(!JSON.stringify(zero.issue).includes("secret-key"));
  const daily = await imageResponseError(
    quota("Limit reached", [
      {
        quotaId: "GenerateRequestsPerDayPerProjectPerModel",
        quotaValue: "100",
      },
    ]),
    1000,
  );
  assert.equal(daily.issue.kind, "quota_exhausted");
  assert.equal(daily.issue.retryAt, undefined);
});
test("minute limits respect the longer of RetryInfo and Retry-After; ambiguous 429 stays unknown", async () => {
  const r = quota(
    "Rate limit",
    [{ quotaId: "GenerateRequestsPerMinute", quotaValue: "2" }],
    "3.5s",
  );
  r.headers.set("Retry-After", "60");
  const rate = await imageResponseError(r, 1000);
  assert.equal(rate.issue.kind, "rate_limit");
  assert.equal(rate.issue.retryAt, 61000);
  assert.equal(
    (await imageResponseError(new Response("", { status: 429 }))).issue.kind,
    "unknown",
  );
});
test("hard quota pauses all queued images and the pause survives restart without further calls", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mam-pause-"));
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  const cfg = { ...imageConfig({}), directory, enabled: true, apiKey: "fake" };
  const generate = async () => {
    calls++;
    await gate;
    throw new ImageProviderError(
      { kind: "quota_exhausted", message: "Quota bằng 0", limit: 0 },
      429,
    );
  };
  const store = new IllustrationStore(cfg, generate);
  let restarted: IllustrationStore | undefined;
  try {
    await store.initialize();
    const first = await store.ensure(plan);
    const second = await store.ensure({ ...plan, scene: "A different scene" });
    assert.ok(first && second);
    release();
    await wait(() => store.pipeline().state === "paused");
    assert.equal(calls, 1);
    assert.equal(store.status(first.id)?.status, "paused");
    assert.equal(store.status(second.id)?.status, "paused");
    store.close();
    restarted = new IllustrationStore(cfg, generate);
    await restarted.initialize();
    assert.equal(restarted.pipeline().state, "paused");
    assert.equal(calls, 1);
    await restarted.ensure({ ...plan, scene: "A third scene" });
    assert.equal(calls, 1);
    assert.equal(restarted.pipeline().counts.paused, 3);
  } finally {
    release();
    store.close();
    restarted?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
test("temporary limits retry only after the delay and stop at three calls per job", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mam-backoff-"));
  let now = 1000;
  let calls = 0;
  const store = new IllustrationStore(
    { ...imageConfig({}), directory, enabled: true, apiKey: "fake" },
    async () => {
      calls++;
      throw new ImageProviderError(
        { kind: "rate_limit", message: "Slow down", retryAt: now + 10000 },
        429,
      );
    },
    () => now,
  );
  try {
    await store.initialize();
    const job = await store.ensure(plan);
    assert.ok(job);
    await wait(() => store.pipeline().state === "cooldown");
    assert.equal(calls, 1);
    store.tick();
    assert.equal(calls, 1);
    now = store.pipeline().issue!.retryAt!;
    store.tick();
    await wait(() => calls === 2 && store.pipeline().state === "cooldown");
    now = store.pipeline().issue!.retryAt!;
    store.tick();
    await wait(() => calls === 3 && store.status(job.id)?.status === "failed");
    now += 200000;
    store.tick();
    assert.equal(calls, 3);
    assert.equal(store.status(job.id)?.canRetry, false);
  } finally {
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});
test("saved art is reused for the identical scene across different captions, but not for a different scene", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mam-reuse-"));
  let calls = 0;
  const store = new IllustrationStore(
    { ...imageConfig({}), directory, enabled: true, apiKey: "fake" },
    async () => {
      calls++;
      return { bytes: Buffer.from("fake fixture"), mimeType: "image/png" };
    },
  );
  try {
    await store.initialize();
    const first = await store.ensure(plan);
    assert.ok(first);
    await wait(() => store.status(first.id)?.status === "ready");
    const reuse = await store.ensure({
      ...plan,
      scene: "  A clay tree learning from repetition  ",
      caption: "Another caption",
      alt: "Another label",
    });
    assert.equal(reuse?.id, first.id);
    assert.equal(calls, 1);
    const different = await store.ensure({
      ...plan,
      scene: "A tree learning a different concept",
    });
    assert.ok(different);
    assert.notEqual(different.id, first.id);
    await wait(() => store.status(different.id)?.status === "ready");
    assert.equal(calls, 2);
  } finally {
    store.close();
    await rm(directory, { recursive: true, force: true, maxRetries: 5 });
  }
});

test("manual resume probes again only after explicit action, then releases queued work if quota is restored", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mam-resume-"));
  let available = false;
  let calls = 0;
  const store = new IllustrationStore(
    { ...imageConfig({}), directory, enabled: true, apiKey: "fake" },
    async () => {
      calls++;
      if (!available)
        throw new ImageProviderError(
          { kind: "quota_exhausted", message: "Quota 0", limit: 0 },
          429,
        );
      return { bytes: Buffer.from("fixture"), mimeType: "image/png" };
    },
  );
  try {
    await store.initialize();
    const a = await store.ensure(plan);
    assert.ok(a);
    await wait(() => store.pipeline().state === "paused");
    const b = await store.ensure({ ...plan, scene: "Another scene" });
    assert.ok(b);
    assert.equal(calls, 1);
    available = true;
    await store.resume();
    await wait(
      () =>
        store.status(a.id)?.status === "ready" &&
        store.status(b.id)?.status === "ready",
    );
    assert.equal(calls, 3);
    assert.equal(store.pipeline().state, "active");
  } finally {
    store.close();
    await rm(directory, { recursive: true, force: true, maxRetries: 5 });
  }
});
