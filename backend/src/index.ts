import { IncrementalCourses } from "./incremental-courses";
import { isCurriculum, isPreviousLessons } from "../../shared/lib/curriculum";
import { courseChatSchema } from "./course-chat-schema";
import {
  createPodcastProvider,
  PodcastError,
  isPodcastInput,
  type PodcastProvider,
} from "./podcast";
import { courseSchema } from "./course-schema";
import {
  coursePrompt,
  studyWeekPrompt,
  tutorPrompt,
  courseChatPrompt,
} from "./prompts";
import {
  isCourseBrief,
  isCourseChatHistory,
  isCourseChatReply,
  type CourseBrief,
  type CourseChatMessage,
} from "../../shared/lib/course-chat";
import type { CompletionFormat } from "./ai";
import { isActivities } from "../../shared/lib/study-plan";
import { IllustrationStore, imageConfig, planForLesson } from "./illustrations";
import http, { type ServerResponse } from "node:http";
import {
  complete as completeAI,
  getAIConfig,
  usableKey,
  AIError,
  type Message,
} from "./ai";
import { AuthStore } from "./auth";
import { isCourseContent, type CourseContent } from "../../shared/types/course";

// Tiny local-only development backend. Never place an API key in the Expo client.
const PORT = Number(process.env.PORT || 8787);
export function createApp({
  config = getAIConfig(),
  images = new IllustrationStore(imageConfig()),
  completeProvider = completeAI,
  podcastProvider = createPodcastProvider(),
  auth = new AuthStore(),
  courseCacheDir,
}: {
  config?: ReturnType<typeof getAIConfig>;
  images?: IllustrationStore;
  completeProvider?: typeof completeAI;
  podcastProvider?: PodcastProvider;
  auth?: AuthStore;
  courseCacheDir?: string;
} = {}) {
  const complete = (messages: Message[], json: CompletionFormat = false) =>
    completeProvider(config, messages, json);

  const incremental = new IncrementalCourses(
    complete,
    courseCacheDir,
    `${config.provider}:${config.model}`,
  );

  const send = (res: ServerResponse, status: number, payload: unknown) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      // Development: permits Expo Web / LAN mobile testing. Restrict this in production.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(payload));
  };
  const isText = (value: unknown, max = 200): value is string =>
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= max;
  const validCourse = (c: unknown): c is CourseContent =>
    isCourseContent(c) &&
    c.lessons.length === 3 &&
    c.lessons.every(
      (l) =>
        l.pages.length >= 3 &&
        l.pages.length <= 7 &&
        !!l.objective &&
        l.pages.every((p) => !!p.example && !!p.selfCheck && !!p.commonMistake),
    );
  type CourseRequest = {
    topic: string;
    goal: string;
    level: string;
    brief?: CourseBrief;
    conversation?: CourseChatMessage[];
  };
  async function generateCourse({
    topic,
    goal,
    level,
    brief,
    conversation,
  }: CourseRequest) {
    const message = await complete(
      [
        {
          role: "system",
          content:
            coursePrompt +
            "\nCấu trúc JSON bắt buộc:\n" +
            JSON.stringify(courseSchema),
        },
        {
          role: "user",
          content: JSON.stringify({
            topic,
            level,
            goal: goal || "Hiểu khái niệm cốt lõi",
            learnerBrief: brief,
            conversation,
          }),
        },
      ],
      { maxOutputTokens: 12288 },
    );
    let course: unknown;
    try {
      course = JSON.parse(message);
    } catch {
      throw new Error("AI chưa trả về JSON hợp lệ. Hãy thử lại.");
    }
    if (!validCourse(course))
      throw new Error("Nội dung chưa đúng cấu trúc bài học. Hãy thử lại.");
    return {
      ...course,
      lessons: course.lessons.map((l) => ({
        ...l,
        minutes: Math.max(
          5,
          Math.min(
            15,
            Math.ceil(
              l.pages.reduce(
                (sum, p) =>
                  sum +
                  [
                    p.body,
                    p.example?.scenario,
                    p.example?.explanation,
                    p.selfCheck?.question,
                    p.selfCheck?.answer,
                    p.commonMistake,
                  ]
                    .filter(Boolean)
                    .join(" ")
                    .split(/\s+/).length,
                0,
              ) /
                160 +
                l.pages.length,
            ),
          ),
        ),
      })),
    };
  }

  const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    if (req.method === "GET" && req.url === "/health")
      return send(res, 200, {
        ok: true,
        capabilities: { illustrations: true, podcast: !!podcastProvider },
        aiConfigured: usableKey(config.apiKey),
        provider: config.provider,
        model: config.model,
        images: {
          configured: images.configured,
          enabled: images.config.enabled,
          model: images.config.model,
          pipeline: images.pipeline(),
        },
      });
    if (req.method === "GET" && req.url === "/api/illustrations/status")
      return send(res, 200, {
        pipeline: images.pipeline(),
        jobs: images.list(),
        model: images.config.model,
      });
    const podcastMedia = req.url?.match(/^\/media\/podcasts\/([a-f0-9]{64})$/);
    if (req.method === "GET" && podcastMedia) {
      const bytes = await podcastProvider?.asset?.(podcastMedia[1]);
      if (!bytes) return send(res, 404, { error: "Chưa có âm thanh." });
      const headers = {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable",
      };
      const range = req.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        const start = match?.[1]
          ? Number(match[1])
          : match?.[2]
            ? Math.max(0, bytes.length - Number(match[2]))
            : -1;
        const end =
          match?.[1] && match?.[2]
            ? Math.min(bytes.length - 1, Number(match[2]))
            : bytes.length - 1;
        if (!match || start < 0 || start >= bytes.length || end < start) {
          res.writeHead(416, {
            ...headers,
            "Content-Range": `bytes */${bytes.length}`,
          });
          return res.end();
        }
        res.writeHead(206, {
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${bytes.length}`,
          "Content-Length": end - start + 1,
        });
        return res.end(bytes.subarray(start, end + 1));
      }
      res.writeHead(200, { ...headers, "Content-Length": bytes.length });
      return res.end(bytes);
    }
    const statusMatch = req.url?.match(
      /^\/api\/illustrations\/([a-f0-9]{64})$/,
    );
    if (req.method === "GET" && statusMatch) {
      const status = images.status(statusMatch[1]);
      return send(
        res,
        status ? 200 : 404,
        status ?? {
          error: "Không tìm thấy tranh. Bạn có thể tạo lại từ bài học.",
        },
      );
    }
    const mediaMatch = req.url?.match(
      /^\/media\/illustrations\/([a-f0-9]{64})$/,
    );
    if (req.method === "GET" && mediaMatch) {
      const asset = await images.asset(mediaMatch[1]);
      if (!asset) return send(res, 404, { error: "Chưa có ảnh." });
      res.writeHead(200, {
        "Content-Type": asset.mimeType,
        "Content-Length": asset.bytes.length,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
      });
      return res.end(asset.bytes);
    }
    if (req.method === "GET" && req.url === "/api/auth/demo") {
      try {
        const demo = auth.getDemoAccount();
        return send(res, 200, demo);
      } catch (e) {
        return send(res, 500, { error: "Không thể lấy tài khoản mẫu." });
      }
    }
    if (req.method === "GET" && req.url === "/api/auth/me") {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (!token) return send(res, 401, { error: "Chưa đăng nhập." });
      const user = auth.getUserByToken(token);
      if (!user) return send(res, 401, { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
      return send(res, 200, { user });
    }
    if (
      req.method !== "POST" ||
      ![
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/sync",
        "/api/podcast",
        "/api/course-plan",
        "/api/lesson",
        "/api/course-chat",
        "/api/course",
        "/api/study-week",
        "/api/tutor",
        "/api/illustrations",
        "/api/illustrations/control",
      ].includes(req.url || "")
    )
      return send(res, 404, { error: "Không tìm thấy trang." });
    if (
      !req.url?.startsWith("/api/auth") &&
      req.url !== "/api/podcast" &&
      !req.url?.startsWith("/api/illustrations") &&
      !usableKey(config.apiKey)
    )
      return send(res, 503, {
        error: `Bạn chưa cấu hình ${config.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} trong backend/.env.`,
      });
    try {
      let body = "";
      for await (const part of req) {
        body += part;
        if (
          Buffer.byteLength(body) >
          (req.url === "/api/podcast"
            ? 240000
            : req.url === "/api/lesson"
              ? 100000
              : 24000)
        )
          return send(res, 413, { error: "Dữ liệu gửi lên quá dài." });
      }
      let data;
      try {
        data = JSON.parse(body);
      } catch {
        return send(res, 400, { error: "Dữ liệu JSON không hợp lệ." });
      }
      if (typeof data !== "object" || data === null || Array.isArray(data))
        return send(res, 400, { error: "Dữ liệu không hợp lệ." });

      if (req.url === "/api/auth/register") {
        const { email, password, name = "" } = data;
        if (!email || typeof email !== "string" || !email.includes("@"))
          return send(res, 400, { error: "Email không hợp lệ." });
        if (!password || typeof password !== "string" || password.length < 6)
          return send(res, 400, { error: "Mật khẩu phải có ít nhất 6 ký tự." });
        try {
          const result = auth.register(email, password, String(name));
          return send(res, 201, result);
        } catch (e) {
          return send(res, 400, { error: e instanceof Error ? e.message : "Đăng ký thất bại." });
        }
      }

      if (req.url === "/api/auth/login") {
        const { email, password } = data;
        if (!email || !password)
          return send(res, 400, { error: "Vui lòng nhập email và mật khẩu." });
        try {
          const result = auth.login(String(email), String(password));
          return send(res, 200, result);
        } catch (e) {
          return send(res, 401, { error: e instanceof Error ? e.message : "Đăng nhập thất bại." });
        }
      }

      if (req.url === "/api/auth/sync") {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        if (!token) return send(res, 401, { error: "Chưa đăng nhập." });
        try {
          const user = auth.syncProgress(token, data.progress ?? {});
          return send(res, 200, { user });
        } catch (e) {
          return send(res, 400, { error: e instanceof Error ? e.message : "Đồng bộ thất bại." });
        }
      }

      if (req.url === "/api/podcast") {
        if (!isPodcastInput(data))
          return send(res, 400, { error: "Nội dung giọng đọc không hợp lệ." });
        if (!podcastProvider)
          return send(res, 503, {
            error: "Chưa kết nối giọng đọc. Thêm FPT_API_KEY vào backend/.env.",
          });
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 175000);
        const disconnected = () => abort.abort();
        res.on("close", disconnected);
        try {
          const asset = await podcastProvider.synthesize(data, abort.signal);
          if (!asset.audioUrl && !asset.audioUrls?.length)
            throw new Error("Dịch vụ chưa trả về tệp âm thanh.");
          return send(res, 200, asset);
        } finally {
          clearTimeout(timer);
          res.off("close", disconnected);
        }
      }
      if (req.url === "/api/illustrations/control") {
        if (data.action !== "resume")
          return send(res, 400, { error: "Thao tác không hợp lệ." });
        await images.resume();
        return send(res, 200, { pipeline: images.pipeline() });
      }
      if (req.url === "/api/illustrations") {
        if (!images.configured)
          return send(res, 503, {
            error:
              "Tạo tranh tự động chưa được bật hoặc chưa cấu hình key. Bạn vẫn có thể học bình thường.",
          });
        const { courseTitle, lesson, retry = false } = data;
        if (
          !isText(courseTitle, 150) ||
          !isCourseContent({
            title: courseTitle,
            subtitle: courseTitle,
            lessons: [lesson],
          }) ||
          typeof retry !== "boolean"
        )
          return send(res, 400, { error: "Dữ liệu minh họa không hợp lệ." });
        const status = await images.ensure(
          planForLesson(courseTitle, lesson),
          retry,
        );
        return send(res, 202, status);
      }
      if (req.url === "/api/course-plan") {
        if (
          !isCourseBrief(data.brief) ||
          !isCourseChatHistory(data.conversation ?? [])
        )
          return send(res, 400, { error: "Thông tin đề cương chưa hợp lệ." });
        const plan = await incremental.plan(
          data.brief,
          data.conversation ?? [],
        );
        return send(res, 200, { plan });
      }
      if (req.url === "/api/lesson") {
        const { curriculum, index, previousLessons = [] } = data;
        if (
          !isCurriculum(curriculum) ||
          !Number.isInteger(index) ||
          index < 0 ||
          !isPreviousLessons(previousLessons, curriculum.plan, index)
        )
          return send(res, 400, {
            error: "Cần hoàn thành các bài trước khi tạo bài này.",
          });
        let lesson = await incremental.lesson(
          curriculum,
          index,
          previousLessons,
        );
        try {
          const image = await images.ensure(
            planForLesson(curriculum.plan.title, lesson),
          );
          const pages = await Promise.all(
            lesson.pages.map(async (p, pIdx) => {
              if (pIdx === 0 || !p.illustrationPlan) return p;
              try {
                const pImg = await images.ensure(p.illustrationPlan);
                return pImg ? { ...p, illustration: { id: pImg.id } } : p;
              } catch {
                return p;
              }
            }),
          );
          lesson = {
            ...lesson,
            pages,
            ...(image ? { illustration: { id: image.id } } : {}),
          };
        } catch {}
        return send(res, 200, { lesson });
      }
      if (req.url === "/api/course-chat") {
        const { topic, messages = [] } = data;
        if (!isText(topic, 500) || !isCourseChatHistory(messages))
          return send(res, 400, { error: "Thông tin trò chuyện chưa hợp lệ." });
        const forceReady =
          messages.filter((m) => m.role === "assistant").length >= 4;
        const output = await complete(
          [
            { role: "system", content: courseChatPrompt },
            {
              role: "user",
              content: JSON.stringify({
                topic,
                conversation: messages,
                forceReady,
              }),
            },
          ],
          { schema: courseChatSchema, maxOutputTokens: 2048 },
        );
        let reply: unknown;
        try {
          reply = JSON.parse(output);
        } catch {
          return send(res, 502, {
            error: "AI chưa phản hồi đúng định dạng. Hãy thử lại.",
          });
        }
        if (!isCourseChatReply(reply) || (forceReady && reply.kind !== "ready"))
          return send(res, 502, {
            error: "AI chưa hoàn tất thông tin khóa học. Hãy thử lại.",
          });
        return send(res, 200, { reply });
      }
      if (req.url === "/api/study-week") {
        const { topic, level, focus, minutes, week, totalWeeks } = data;
        if (
          !isText(topic, 150) ||
          !isText(level, 100) ||
          !isText(focus, 300) ||
          ![10, 20, 30, 45, 60].includes(minutes) ||
          !Number.isInteger(week) ||
          !Number.isInteger(totalWeeks) ||
          week < 1 ||
          week > totalWeeks ||
          totalWeeks > 53
        )
          return send(res, 400, { error: "Thông tin kế hoạch chưa hợp lệ." });
        const previousTopics = data.previousTopics ?? [];
        if (
          !Array.isArray(previousTopics) ||
          previousTopics.length > 20 ||
          !previousTopics.every((v) => isText(v, 200))
        )
          return send(res, 400, { error: "Nội dung tuần trước chưa hợp lệ." });
        const output = await complete(
          [
            { role: "system", content: studyWeekPrompt },
            {
              role: "user",
              content: JSON.stringify({
                topic,
                level,
                focus,
                minutes,
                week,
                totalWeeks,
                previousTopics,
              }),
            },
          ],
          { maxOutputTokens: 8192 },
        );
        let result;
        try {
          result = JSON.parse(output);
        } catch {
          return send(res, 502, {
            error: "AI chưa trả về nội dung hợp lệ. Hãy thử lại.",
          });
        }
        if (Array.isArray(result?.activities))
          result.activities = result.activities.map((a: any) =>
            a &&
            (a.kind === "gap" || a.kind === "reading") &&
            typeof a.answer === "string" &&
            /^[0-3]$/.test(a.answer)
              ? { ...a, answer: Number(a.answer) }
              : a,
          );
        if (!isActivities(result?.activities))
          return send(res, 502, {
            error: "Hoạt động AI chưa đúng cấu trúc. Hãy thử lại.",
          });
        return send(res, 200, { activities: result.activities });
      }
      if (req.url === "/api/tutor") {
        const { courseTitle, lessonTitle, context, messages } = data;
        if (
          !isText(courseTitle, 150) ||
          !isText(lessonTitle, 150) ||
          !isText(context, 6000) ||
          !Array.isArray(messages) ||
          messages.length < 1 ||
          messages.length > 12 ||
          !messages.every(
            (m: unknown) =>
              typeof m === "object" &&
              m !== null &&
              "role" in m &&
              "content" in m &&
              ["user", "assistant"].includes(String(m.role)) &&
              isText(m.content, 4000),
          ) ||
          messages.at(-1).role !== "user"
        )
          return send(res, 400, { error: "Câu hỏi chưa hợp lệ." });
        const reply = await complete([
          {
            role: "system",
            content: tutorPrompt,
          },
          {
            role: "user",
            content: JSON.stringify({
              type: "lesson_context",
              courseTitle,
              lessonTitle,
              context,
            }),
          },
          ...messages,
        ]);
        return send(res, 200, { reply });
      }
      const {
        topic,
        goal = "",
        level = "Người mới",
        brief,
        conversation,
      } = data;
      if (
        !isText(topic, 150) ||
        typeof goal !== "string" ||
        goal.length > 600 ||
        !["Người mới", "Đã biết một chút", "Nâng cao"].includes(level)
      )
        return send(res, 400, {
          error: "Vui lòng nhập chủ đề và trình độ phù hợp.",
        });
      if (
        (brief !== undefined && !isCourseBrief(brief)) ||
        (conversation !== undefined && !isCourseChatHistory(conversation))
      )
        return send(res, 400, { error: "Bản tóm tắt khóa học chưa hợp lệ." });
      const course = await generateCourse({
        topic: topic.trim(),
        goal: goal.trim(),
        level,
        brief,
        conversation,
      });
      // Enqueue pictures without making the learner wait for image generation.
      const lessons = await Promise.all(
        course.lessons.map(async (lesson) => {
          try {
            const image = await images.ensure(
              planForLesson(course.title, lesson),
            );
            const pages = await Promise.all(
              lesson.pages.map(async (p, pIdx) => {
                if (pIdx === 0 || !p.illustrationPlan) return p;
                try {
                  const pImg = await images.ensure(p.illustrationPlan);
                  return pImg ? { ...p, illustration: { id: pImg.id } } : p;
                } catch {
                  return p;
                }
              }),
            );
            return {
              ...lesson,
              pages,
              ...(image ? { illustration: { id: image.id } } : {}),
            };
          } catch {
            return lesson;
          }
        }),
      );
      return send(res, 200, { course: { ...course, lessons } });
    } catch (e) {
      const error = e instanceof Error ? e : new Error("Không thể kết nối AI.");
      console.error("AI request failed:", error.name);
      return send(
        res,
        error instanceof AIError || error instanceof PodcastError
          ? error.status
          : 502,
        {
          error: ["AbortError", "TimeoutError"].includes(error.name)
            ? "AI phản hồi quá chậm. Hãy thử lại."
            : error.message || "Không thể tạo khóa học.",
        },
      );
    }
  });
  return { server, images };
}

// Only listen when launched as the entry script; imports can test the app independently.
if (process.argv[1] && /(?:^|[/\\])(?:backend[/\\]src|server)[/\\]index\.ts$/.test(process.argv[1])) {
  const { server, images } = createApp();
  images
    .initialize()
    .catch(() => {
      images.config.enabled = false;
      console.warn(
        "Không ghi được bộ nhớ tranh; tạm tắt tạo ảnh. Phần học bằng văn bản vẫn sẵn sàng.",
      );
    })
    .then(() =>
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`Mầm AI backend running at http://localhost:${PORT}`);
        console.log(
          `Illustrations enabled: ${images.configured}; model: ${images.config.model}`,
        );
      }),
    )
    .catch(() => {
      console.error(
        "Không khởi tạo được bộ nhớ tranh. Kiểm tra quyền ghi backend/.cache.",
      );
      process.exitCode = 1;
    });
}
