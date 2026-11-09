import { test } from "node:test";
import assert from "node:assert/strict";
import { requireIllustrationBackend } from "../src/lib/illustration-api";
const response =
  (body: unknown): typeof fetch =>
  async () =>
    new Response(JSON.stringify(body));
test("old backend produces restart instructions instead of a generic page-not-found error", async () => {
  await assert.rejects(
    requireIllustrationBackend(
      "http://local",
      undefined,
      response({ ok: true, aiConfigured: true }),
    ),
    /bản cũ.*khởi động lại/,
  );
});
test("image setup distinguishes disabled generation from a missing key", async () => {
  await assert.rejects(
    requireIllustrationBackend(
      "http://local",
      undefined,
      response({ images: { enabled: false, configured: false } }),
    ),
    /IMAGE_GENERATION_ENABLED/,
  );
  await assert.rejects(
    requireIllustrationBackend(
      "http://local",
      undefined,
      response({ images: { enabled: true, configured: false } }),
    ),
    /key/,
  );
});
test("current configured backend permits image requests and forwards cancellation", async () => {
  const controller = new AbortController();
  await requireIllustrationBackend(
    "http://local",
    controller.signal,
    async (url, init) => {
      assert.equal(url, "http://local/health");
      assert.equal(init?.signal, controller.signal);
      return new Response(
        JSON.stringify({
          capabilities: { illustrations: true },
          images: { enabled: true, configured: true },
        }),
      );
    },
  );
});
test("wrong service and unavailable health have actionable messages", async () => {
  await assert.rejects(
    requireIllustrationBackend(
      "http://local",
      undefined,
      async () => new Response("<html>other app</html>"),
    ),
    /Địa chỉ API/,
  );
  await assert.rejects(
    requireIllustrationBackend(
      "http://local",
      undefined,
      async () => new Response("", { status: 503 }),
    ),
    /backend/,
  );
});
