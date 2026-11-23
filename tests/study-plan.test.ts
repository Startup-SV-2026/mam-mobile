import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makeStudyPlan,
  parseStudyDate,
  studyDate,
  isStudyPlan,
  isActivities,
} from "../src/lib/study-plan";
import { createApp } from "../server/index";
import { getAIConfig } from "../server/ai";
import { IllustrationStore, imageConfig } from "../server/illustrations";
const activities = [
  {
    kind: "flashcard",
    prompt: "mitigate",
    answer: "giảm nhẹ",
    example: "Trees mitigate heat.",
  },
  {
    kind: "gap",
    prompt: "Trees _____ heat.",
    choices: ["mitigate", "invent", "recall", "deny"],
    answer: 0,
    explanation: "Reduce the effect.",
  },
  {
    kind: "match",
    prompt: "Ghép nghĩa",
    pairs: [
      { term: "mitigate", meaning: "giảm nhẹ" },
      { term: "infer", meaning: "suy luận" },
      { term: "retain", meaning: "giữ lại" },
    ],
  },
  {
    kind: "reading",
    prompt: "Trees cool streets. What is an effect?",
    choices: ["Less heat", "More heat", "No effect", "More traffic"],
    answer: 0,
    explanation: "Trees cool streets.",
  },
  {
    kind: "writing",
    prompt: "Write a sentence with mitigate.",
    sample: "Trees mitigate heat.",
    checklist: ["Đúng ngữ nghĩa"],
  },
];
test("monthly plan covers every date exactly once, including partial weeks", () => {
  const p = makeStudyPlan(
    "Từ vựng tiếng Anh",
    "C1/C2",
    20,
    "11/11/2026",
    "11/12/2026",
  );
  assert.equal(p.weeks.length, 4);
  assert.equal(p.weeks[0].start, p.start);
  assert.equal(p.weeks.at(-1)?.end, p.end);
  p.weeks
    .slice(1)
    .forEach((w, i) =>
      assert.equal(
        parseStudyDate(w.start) - parseStudyDate(p.weeks[i].end),
        86400000,
      ),
    );
  assert.ok(isStudyPlan(JSON.parse(JSON.stringify(p))));
});
test("dates reject normalization, reversed ranges and excessive durations", () => {
  assert.throws(() => parseStudyDate("31/02/2026"));
  assert.equal(studyDate(parseStudyDate("29/02/2028")), "29/02/2028");
  assert.throws(() =>
    makeStudyPlan("Math", "Beginner", 20, "12/11/2026", "11/11/2026"),
  );
  assert.throws(() =>
    makeStudyPlan("Math", "Beginner", 20, "01/01/2026", "02/01/2027"),
  );
  assert.equal(
    makeStudyPlan("Math", "Beginner", 20, "11/11/2026", "11/11/2026").weeks
      .length,
    1,
  );
});
test("activities and saved progress reject malformed AI data and invalid completion indexes", () => {
  assert.ok(isActivities(activities));
  assert.equal(isActivities(activities.slice(1)), false);
  assert.equal(
    isActivities(
      activities.map((a) => (a.kind === "gap" ? { ...a, answer: 8 } : a)),
    ),
    false,
  );
  const p = makeStudyPlan("English", "C1", 20, "11/11/2026", "11/12/2026");
  p.weeks[0].activities = activities as any;
  p.weeks[0].done = [99];
  assert.equal(isStudyPlan(p), false);
});
test("study endpoint validates input and provider output without generating illustrations", async () => {
  let calls = 0;
  const { server } = createApp({
    config: { ...getAIConfig({}), apiKey: "fake-test-key" },
    images: new IllustrationStore({ ...imageConfig({}), enabled: false }),
    completeProvider: async (_config, messages, format) => {
      assert.equal(typeof format, "object");
      assert.equal(
        (format as { maxOutputTokens: number }).maxOutputTokens,
        8192,
      );
      const userData = JSON.parse(messages.at(-1)!.content);
      assert.ok(Array.isArray(userData.previousTopics));
      calls++;
      return JSON.stringify({
        activities: activities.map((a) =>
          a.kind === "gap" || a.kind === "reading"
            ? { ...a, answer: String(a.answer) }
            : a,
        ),
      });
    },
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const addr = server.address() as { port: number };
    const post = (body: unknown) =>
      fetch(`http://127.0.0.1:${addr.port}/api/study-week`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    const data = {
      topic: "English",
      level: "C1",
      focus: "Collocations",
      minutes: 20,
      week: 1,
      totalWeeks: 4,
    };
    assert.equal((await post({ ...data, week: 5 })).status, 400);
    assert.equal(calls, 0);
    const r = await post(data);
    assert.equal(r.status, 200);
    assert.ok(isActivities((await r.json()).activities));
    assert.equal(calls, 1);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
  }
});

test("activity validation rejects duplicate choices after whitespace and case normalization", () => {
  assert.equal(
    isActivities(
      activities.map((a) =>
        a.kind === "gap"
          ? { ...a, choices: ["mitigate", " Mitigate ", "invent", "deny"] }
          : a,
      ),
    ),
    false,
  );
});
