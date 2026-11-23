import { fetchBackend } from "./backend-fetch";
// Tell local-development setup errors apart from a missing cached picture.
export async function requireIllustrationBackend(
  baseUrl: string,
  signal?: AbortSignal,
  request: typeof fetch = (input, init) => fetchBackend(String(input), init),
): Promise<void> {
  const response = await request(`${baseUrl}/health`, { signal });
  if (!response.ok)
    throw new Error(
      "Chưa kết nối được máy chủ Mầm. Hãy kiểm tra backend đang chạy.",
    );
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      "Địa chỉ API chưa trỏ tới máy chủ Mầm. Hãy kiểm tra kết nối backend.",
    );
  }
  if (!body?.capabilities?.illustrations && !body?.images)
    throw new Error(
      "Backend đang chạy bản cũ, chưa hỗ trợ tạo tranh. Hãy khởi động lại backend Mầm.",
    );
  if (body.images?.enabled === false)
    throw new Error(
      "Tạo tranh đang tắt. Bật IMAGE_GENERATION_ENABLED=true trong server/.env rồi khởi động lại backend.",
    );
  if (body.images?.configured !== true)
    throw new Error(
      "Chưa cấu hình key cho model ảnh. Hãy kiểm tra cấu hình Gemini trong backend.",
    );
}
