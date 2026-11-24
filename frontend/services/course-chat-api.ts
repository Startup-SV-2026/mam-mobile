import { fetchBackend } from "./backend-fetch";
import { isCourseChatReply, type CourseChatMessage } from "../lib/course-chat";
export async function askCourseChat(
  topic: string,
  messages: CourseChatMessage[],
  signal: AbortSignal,
  request: typeof fetch = fetch,
  baseUrl = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, ""),
) {
  if (!baseUrl) throw Error("Chưa kết nối máy chủ AI.");
  const response = await fetchBackend(
    `${baseUrl.replace(/\/$/, "")}/api/course-chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({ topic, messages }),
    },
    request,
  );
  if (response.status === 404)
    throw Error(
      "Máy chủ cần được khởi động lại để hỗ trợ tạo khóa qua trò chuyện.",
    );
  const data = await response.json();
  if (!response.ok)
    throw Error(data?.error || "AI chưa phản hồi. Hãy thử lại.");
  if (!isCourseChatReply(data?.reply))
    throw Error("Nội dung phản hồi chưa hợp lệ. Hãy thử lại.");
  return data.reply;
}
