import { test } from "node:test";
import assert from "node:assert/strict";
import {
  complete,
  getAIConfig,
  usableKey,
  AIError,
  type AIConfig,
  type Message,
} from "../src/ai";
import { courseSchema } from "../src/course-schema";
import { STARTER_COURSES } from "../../shared/data/courses";
import { isCourseContent } from "../../shared/types/course";
const config: AIConfig = {
  provider: "gemini",
  model: "gemini-3.1-flash-lite",
  apiKey: "test-key-no-real-credentials",
};
const messages: Message[] = [
  { role: "system", content: "Bạn là gia sư" },
  { role: "user", content: "Xin chào" },
  { role: "assistant", content: "Chào bạn" },
  { role: "user", content: "Giải thích tiếp nhé" },
];
const response = (text: string) =>
  new Response(
    JSON.stringify({
      candidates: [{ finishReason: "STOP", content: { parts: [{ text }] } }],
    }),
    { status: 200 },
  );
test("provider selection respects explicit choice and existing OpenAI configuration", () => {
  assert.equal(getAIConfig({}).provider, "gemini");
  assert.equal(
    getAIConfig({ GEMINI_API_KEY: "test", OPENAI_API_KEY: "test" }).provider,
    "gemini",
  );
  assert.equal(getAIConfig({ OPENAI_API_KEY: "test" }).provider, "openai");
  assert.equal(
    getAIConfig({ AI_PROVIDER: "openai", GEMINI_API_KEY: "test" }).apiKey,
    "",
  );
  assert.throws(() => getAIConfig({ AI_PROVIDER: "invalid" }), /AI_PROVIDER/);
  assert.equal(usableKey("sk-replace-with-your-key"), false);
  assert.equal(usableKey("  "), false);
});
test("Gemini maps system and chat roles, sends key in header, and requests structured course output", async () => {
  let calls = 0;
  const fake: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(
      String(url),
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
    );
    assert.ok(!String(url).includes(config.apiKey));
    assert.equal(
      new Headers(init?.headers).get("x-goog-api-key"),
      config.apiKey,
    );
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.systemInstruction, {
      parts: [{ text: "Bạn là gia sư" }],
    });
    assert.deepEqual(
      body.contents.map((m: { role: string }) => m.role),
      ["user", "model", "user"],
    );
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.deepEqual(body.generationConfig.responseJsonSchema, courseSchema);
    assert.ok(init?.signal);
    return response(JSON.stringify(STARTER_COURSES[0]));
  };
  assert.ok(
    isCourseContent(JSON.parse(await complete(config, messages, true, fake))),
  );
  assert.equal(calls, 1);
});
test("tutor uses text mode and returns only answer parts, excluding thoughts", async () => {
  const fake: typeof fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.generationConfig.responseMimeType, undefined);
    return new Response(
      JSON.stringify({
        candidates: [
          {
            finishReason: "STOP",
            content: {
              parts: [
                { thought: true, text: "Internal reasoning" },
                { text: "Xin " },
                { text: "chào!" },
              ],
            },
          },
        ],
      }),
    );
  };
  assert.equal(await complete(config, messages, false, fake), "Xin chào!");
});
test("quota and configuration errors are actionable; raw provider details are never returned", async () => {
  for (const status of [400, 401, 403, 404, 429, 500, 503]) {
    const fake: typeof fetch = async () =>
      new Response(`private detail ${config.apiKey}`, { status });
    await assert.rejects(
      complete(config, messages, false, fake),
      (e: unknown) => {
        assert.ok(e instanceof AIError);
        assert.ok(!e.message.includes(config.apiKey));
        assert.equal(e.status, status === 429 ? 429 : 502);
        return true;
      },
    );
  }
  let called = false;
  await assert.rejects(
    complete({ ...config, apiKey: "" }, messages, false, async () => {
      called = true;
      return response("unused");
    }),
    /GEMINI_API_KEY/,
  );
  assert.equal(called, false);
});
test("blocked, truncated, and empty responses cannot become successful lessons", async () => {
  for (const body of [
    { promptFeedback: { blockReason: "SAFETY" } },
    {
      candidates: [
        {
          finishReason: "MAX_TOKENS",
          content: { parts: [{ text: "partial" }] },
        },
      ],
    },
    { candidates: [{ finishReason: "SAFETY" }] },
    { candidates: [] },
  ]) {
    await assert.rejects(
      complete(
        config,
        messages,
        true,
        async () => new Response(JSON.stringify(body)),
      ),
      AIError,
    );
  }
});
test("OpenAI adapter retains its request and response contract", async () => {
  const fake: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.openai.com/v1/chat/completions");
    assert.equal(
      new Headers(init?.headers).get("Authorization"),
      `Bearer ${config.apiKey}`,
    );
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "gpt-4o-mini");
    assert.deepEqual(body.messages, messages);
    return new Response(
      JSON.stringify({
        choices: [{ finish_reason: "stop", message: { content: "Hello" } }],
      }),
    );
  };
  assert.equal(
    await complete(
      { ...config, provider: "openai", model: "gpt-4o-mini" },
      messages,
      false,
      fake,
    ),
    "Hello",
  );
});

test("weekly JSON mode uses a separate output budget without forcing the course schema", async () => {
  for (const provider of ["gemini", "openai"] as const) {
    const fake: typeof fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      if (provider === "gemini") {
        assert.equal(
          body.generationConfig.responseMimeType,
          "application/json",
        );
        assert.equal(body.generationConfig.responseJsonSchema, undefined);
        assert.equal(body.generationConfig.maxOutputTokens, 8192);
        return response('{"activities":[]}');
      }
      assert.deepEqual(body.response_format, { type: "json_object" });
      assert.equal(body.max_completion_tokens, 8192);
      return new Response(
        JSON.stringify({
          choices: [
            {
              finish_reason: "stop",
              message: { content: '{"activities":[]}' },
            },
          ],
        }),
      );
    };
    assert.equal(
      await complete(
        { ...config, provider },
        messages,
        { maxOutputTokens: 8192 },
        fake,
      ),
      '{"activities":[]}',
    );
  }
});
