const text = { type: "string" };
const visual = {
  type: "object",
  properties: {
    kind: {
      type: "string",
      enum: [
        "steps",
        "comparison",
        "cycle",
        "timeline",
        "concept-map",
        "layers",
        "formula",
        "metrics",
      ],
    },
    title: text,
    tone: {
      type: "string",
      enum: ["sage", "sky", "peach", "lavender", "sand"],
    },
    expression: { type: "string", maxLength: 140 },
    items: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          label: text,
          detail: text,
          value: { type: "string", maxLength: 32 },
        },
        required: ["label", "detail"],
      },
    },
  },
  required: ["kind", "title", "items"],
};
const page = {
  type: "object",
  properties: {
    kicker: text,
    title: text,
    body: text,
    emoji: text,
    takeaway: text,
    visual,
    example: {
      type: "object",
      properties: { scenario: text, explanation: text },
      required: ["scenario", "explanation"],
    },
    selfCheck: {
      type: "object",
      properties: { question: text, hint: text, answer: text },
      required: ["question", "hint", "answer"],
    },
    commonMistake: text,
  },
  required: [
    "kicker",
    "title",
    "body",
    "emoji",
    "takeaway",
    "visual",
    "example",
    "selfCheck",
    "commonMistake",
  ],
};
export const courseSchema = {
  type: "object",
  properties: {
    title: text,
    subtitle: text,
    lessons: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: text,
          subtitle: text,
          objective: text,
          illustrationPlan: {
            type: "object",
            properties: {
              scene: { type: "string", maxLength: 1800 },
              caption: { type: "string", maxLength: 400 },
              alt: { type: "string", maxLength: 400 },
            },
            required: ["scene", "caption", "alt"],
          },
          minutes: { type: "integer", minimum: 5, maximum: 15 },
          pages: { type: "array", minItems: 3, maxItems: 3, items: page },
          quiz: {
            type: "object",
            properties: {
              question: text,
              choices: { type: "array", minItems: 4, maxItems: 4, items: text },
              answer: { type: "integer", minimum: 0, maximum: 3 },
              why: text,
            },
            required: ["question", "choices", "answer", "why"],
          },
        },
        required: [
          "title",
          "subtitle",
          "objective",
          "minutes",
          "pages",
          "quiz",
          "illustrationPlan",
        ],
      },
    },
  },
  required: ["title", "subtitle", "lessons"],
};

export const lessonSchema = courseSchema.properties.lessons.items;
