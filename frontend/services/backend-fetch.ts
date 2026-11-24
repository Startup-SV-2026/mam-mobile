// Preserve HTTP responses and cancellation; translate transport failures only.
export async function fetchBackend(
  input: string,
  init?: RequestInit,
  request: typeof fetch = fetch,
): Promise<Response> {
  try {
    return await request(input, init);
  } catch (error) {
    if (
      init?.signal?.aborted ||
      (error instanceof Error &&
        ["AbortError", "TimeoutError"].includes(error.name))
    )
      throw error;
    throw new Error(
      "Không kết nối được máy chủ Mầm. Kiểm tra kết nối rồi thử lại.",
    );
  }
}
