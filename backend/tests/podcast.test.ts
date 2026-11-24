import { test } from "node:test";
import assert from "node:assert/strict";
import type { Course } from "../../shared/types/course";
import { buildEpisode } from "../../frontend/audio/transcript";
import { createApiNarrationProvider } from "../../frontend/audio/provider";
import { isPodcastInput } from "../src/podcast";
import { createApp } from "../src/index";
import { getAIConfig } from "../src/ai";

const course: Course = {
  id: "english",
  title: "English",
  subtitle: "C1",
  category: "Ngôn ngữ",
  color: "#fff",
  accent: "#000",
  emoji: "",
  level: "C1",
  source: "ai",
  lessons: [
    {
      title: "Vocabulary",
      subtitle: "Learn words",
      minutes: 5,
      objective: "Use mitigate",
      pages: [
        {
          title: "Mitigate",
          kicker: "Word",
          emoji: "",
          body: "Cách dùng từ.",
          takeaway: "Reduce the impact.",
          vocab: {
            word: "mitigate",
            type: "verb",
            ipa: "/mit/",
            root: "Latin",
            synonyms: ["reduce"],
            meaning: "giảm nhẹ",
            example: "Trees mitigate heat.",
          },
          example: { scenario: "Nắng nóng.", explanation: "Dùng mitigate." },
          selfCheck: {
            question: "Dùng từ nào?",
            hint: "m",
            answer: "mitigate",
          },
          commonMistake: "Không dùng với mọi ngữ cảnh.",
        },
      ],
      quiz: {
        question: "Meaning?",
        choices: ["Reduce", "Increase"],
        answer: 0,
        why: "Reduce impact.",
      },
    },
  ],
};
test("narration includes lesson depth, English pronunciation and separated self-check answers", () => {
  const e = buildEpisode(course, 0);
  assert.equal(e.courseId, course.id);
  assert.ok(
    e.segments.some(
      (s) => s.language === "en-US" && s.text.includes("Trees mitigate heat."),
    ),
  );
  assert.ok(
    e.segments.some(
      (s) => s.title === "Ví dụ" && s.text.includes("Nắng nóng."),
    ),
  );
  const question = e.segments.findIndex((s) => s.title === "Tự luyện");
  assert.ok(e.segments[question].text.includes("tạm dừng"));
  assert.equal(e.segments[question + 1].title, "Lời giải tham khảo");
  assert.ok(e.segments.some((s) => s.title === "Dễ nhầm"));
  assert.ok(e.estimatedMinutes >= 1);
  assert.throws(() => buildEpisode(course, 99));
});
test("long content splits without losing text and obeys provider segment limits", () => {
  const c = structuredClone(course);
  c.lessons[0].pages[0].body = ("x".repeat(899) + " ").repeat(6) + "end";
  const e = buildEpisode(c, 0);
  assert.ok(e.segments.every((s) => s.text.length <= 900));
  assert.equal(
    e.segments
      .filter((s) => s.title === "Mitigate")
      .map((s) => s.text)
      .join(" "),
    "Mitigate. " + c.lessons[0].pages[0].body,
  );
  assert.ok(
    isPodcastInput({ episodeId: e.id, title: e.title, segments: e.segments }),
  );
});
test("AI adapter sends transcript with cancellation and resolves relative media URL", async () => {
  const e = buildEpisode(course, 0),
    c = new AbortController();
  const p = createApiNarrationProvider(
    "https://mam.test/",
    async (url, init) => {
      assert.equal(url, "https://mam.test/api/podcast");
      assert.equal(init?.signal, c.signal);
      const body = JSON.parse(String(init?.body));
      assert.equal(body.episodeId, e.id);
      assert.deepEqual(body.segments, e.segments);
      return Response.json({ audioUrl: "/media/lesson.mp3" });
    },
  );
  assert.deepEqual(await p.create(e, c.signal), {
    urls: ["https://mam.test/media/lesson.mp3"],
  });
});
test("AI adapter rejects unavailable providers and invalid media responses", async () => {
  const e = buildEpisode(course, 0),
    signal = new AbortController().signal;
  for (const status of [404])
    await assert.rejects(
      createApiNarrationProvider(
        "https://mam.test",
        async () => new Response("", { status }),
      ).create(e, signal),
      /chưa hỗ trợ podcast/,
    );
  for (const body of [
    null,
    {},
    { audioUrl: "" },
    { audioUrl: "javascript:alert(1)" },
    { audioUrl: "https://key:secret@mam.test/audio" },
  ]) {
    await assert.rejects(
      createApiNarrationProvider("https://mam.test", async () =>
        Response.json(body),
      ).create(e, signal),
    );
  }
});
test("podcast endpoint works independently of text AI configuration and leaves AI integration explicit", async () => {
  const input = {
    episodeId: "one",
    title: "Lesson",
    segments: [{ title: "Intro", text: "Hello", language: "en-US" }],
  };
  assert.equal(
    isPodcastInput({
      ...input,
      segments: [{ ...input.segments[0], text: "x".repeat(901) }],
    }),
    false,
  );
  for (const configured of [false, true]) {
    const app = createApp({
      config: { ...getAIConfig(), apiKey: "" },
      podcastProvider: configured
        ? {
            async synthesize(data, signal) {
              assert.deepEqual(data, input);
              assert.equal(signal.aborted, false);
              return { audioUrl: "/media/test.mp3" };
            },
          }
        : undefined,
    });
    await new Promise<void>((resolve) =>
      app.server.listen(0, "127.0.0.1", resolve),
    );
    const address = app.server.address();
    assert.ok(address && typeof address !== "string");
    const url = `http://127.0.0.1:${address.port}/api/podcast`;
    try {
      const invalid = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ ...input, segments: [] }),
      });
      assert.equal(invalid.status, 400);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(input),
      });
      assert.equal(response.status, configured ? 200 : 503);
      if (configured)
        assert.deepEqual(await response.json(), {
          audioUrl: "/media/test.mp3",
        });
    } finally {
      await new Promise<void>((resolve) => app.server.close(() => resolve()));
    }
  }
});
