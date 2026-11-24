import { COURSE_LEVELS } from "../../shared/lib/course-chat";
const string = (maxLength: number) => ({
  type: "string",
  minLength: 1,
  maxLength,
});
// A flat schema avoids union variants; runtime validation checks the fields
// required for a question versus a confirmed brief.
export const courseChatSchema = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "message"],
  properties: {
    kind: { type: "string", enum: ["question", "ready"] },
    message: string(800),
    options: { type: "array", maxItems: 4, items: string(120) },
    brief: {
      type: "object",
      additionalProperties: false,
      required: [
        "topic",
        "goal",
        "level",
        "experience",
        "focus",
        "format",
        "pace",
      ],
      properties: {
        topic: string(150),
        goal: string(600),
        level: { type: "string", enum: [...COURSE_LEVELS] },
        experience: string(600),
        focus: string(600),
        format: string(600),
        pace: string(600),
      },
    },
  },
};
