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
        "cause-effect",
        "funnel",
        "spectrum",
        "bars",
        "line-chart",
        "flowchart",
        "callout",
      ],
    },
    title: text,
    tone: {
      type: "string",
      enum: ["sage", "sky", "peach", "lavender", "sand"],
    },
    expression: text,
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: text,
          detail: text,
          value: text,
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
    layout: {
      type: "string",
      enum: ["visual", "story", "stat", "experiment", "action", "standard"],
    },
    visual,
    illustrationPlan: {
      type: "object",
      properties: {
        scene: text,
        caption: text,
        alt: text,
      },
      required: ["scene", "caption", "alt"],
    },
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
      items: {
        type: "object",
        properties: {
          title: text,
          subtitle: text,
          objective: text,
          openingQuote: {
            type: "object",
            properties: {
              text: text,
              label: text,
            },
            required: ["text", "label"],
          },
          illustrationPlan: {
            type: "object",
            properties: {
              scene: text,
              caption: text,
              alt: text,
            },
            required: ["scene", "caption", "alt"],
          },
          minutes: { type: "integer" },
          pages: { type: "array", items: page },
          quiz: {
            type: "object",
            properties: {
              question: text,
              choices: { type: "array", items: text },
              answer: { type: "integer" },
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
