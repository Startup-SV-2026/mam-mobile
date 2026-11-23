import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchBackend } from "../src/lib/backend-fetch";
test("network failures have an actionable message and do not leak transport details", async () => {
  for (const error of [
    new TypeError("Failed to fetch"),
    new Error("Network request failed"),
  ]) {
    let calls = 0;
    await assert.rejects(
      fetchBackend("http://localhost:8787/api/course", undefined, async () => {
        calls++;
        throw error;
      }),
      /Không kết nối được máy chủ Mầm/,
    );
    assert.equal(calls, 1);
  }
});
test("HTTP failures and cancellation retain their identity without retrying requests", async () => {
  const response = new Response(JSON.stringify({ error: "quota" }), {
    status: 429,
  });
  assert.equal(
    await fetchBackend("http://localhost:8787", {}, async () => response),
    response,
  );
  const aborted = new DOMException("Cancelled", "AbortError");
  await assert.rejects(
    fetchBackend("http://localhost:8787", {}, async () => {
      throw aborted;
    }),
    (e) => e === aborted,
  );
  const c = new AbortController();
  c.abort();
  const reason = new Error("Cancelled");
  await assert.rejects(
    fetchBackend("http://localhost:8787", { signal: c.signal }, async () => {
      throw reason;
    }),
    (e) => e === reason,
  );
});
