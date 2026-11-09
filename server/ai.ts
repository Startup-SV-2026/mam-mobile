// Provider adapters are server-only: API keys never enter the Expo bundle.
import { courseSchema } from './course-schema';
export type Message = { role: 'system' | 'user' | 'assistant'; content: string };
export interface AIConfig { provider: 'gemini' | 'openai'; model: string; apiKey: string }
export function getAIConfig(env: Record<string, string | undefined> = process.env): AIConfig {
  const provider = env.AI_PROVIDER?.trim() || (usableKey(env.GEMINI_API_KEY) ? 'gemini' : usableKey(env.OPENAI_API_KEY) ? 'openai' : 'gemini');
  if (provider !== 'gemini' && provider !== 'openai') throw new Error('AI_PROVIDER phải là gemini hoặc openai.');
  return {provider, model: (provider === 'gemini' ? env.GEMINI_MODEL?.trim() : env.OPENAI_MODEL?.trim()) || (provider === 'gemini' ? 'gemini-3.1-flash-lite' : 'gpt-4o-mini'), apiKey: (provider === 'gemini' ? env.GEMINI_API_KEY : env.OPENAI_API_KEY)?.trim() || ''};
}
export const usableKey = (key: string | undefined): boolean => !!key?.trim() && !/replace-with|your[-_ ]?(api[-_ ]?)?key|paste[-_ ]?here/i.test(key);
export class AIError extends Error {
  constructor(message: string, public readonly status = 502) { super(message); this.name = 'AIError'; }
}
function upstreamError(status: number): AIError {
  if (status === 429) return new AIError('AI đã chạm hạn mức hoặc đang có quá nhiều yêu cầu. Hãy đợi rồi thử lại và kiểm tra quota trong trang quản lý API.', 429);
  if ([400,401,403].includes(status)) return new AIError('Không thể dùng cấu hình AI hiện tại. Kiểm tra API key, quyền truy cập, khu vực và model trong server/.env.');
  if (status === 404) return new AIError('Không tìm thấy model AI. Kiểm tra GEMINI_MODEL hoặc OPENAI_MODEL trong server/.env.');
  return new AIError('Dịch vụ AI đang bận hoặc chưa phản hồi. Hãy thử lại sau.');
}
const object = (value: unknown): Record<string, unknown> => typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
function geminiText(raw: unknown): string {
  const body = object(raw);
  if (object(body.promptFeedback).blockReason) throw new AIError('AI chưa thể trả lời nội dung này. Hãy thử cách đặt câu hỏi khác.');
  const candidate = object(Array.isArray(body.candidates) ? body.candidates[0] : undefined);
  if (candidate.finishReason === 'MAX_TOKENS') throw new AIError('Câu trả lời AI bị ngắt do quá dài. Hãy thử chủ đề cụ thể hơn.');
  if (candidate.finishReason && candidate.finishReason !== 'STOP') throw new AIError('AI chưa thể hoàn tất câu trả lời. Hãy thử cách đặt câu hỏi khác.');
  const parts = object(candidate.content).parts;
  return Array.isArray(parts) ? parts.map(object).filter(p => p.thought !== true && typeof p.text === 'string').map(p => p.text).join('') : '';
}
export async function complete(config: AIConfig, messages: Message[], json = false, request: typeof fetch = fetch): Promise<string> {
  if (!usableKey(config.apiKey)) throw new AIError(`Bạn chưa cấu hình ${config.provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY'} trong server/.env.`, 503);
  const signal = AbortSignal.timeout(48000);
  let response: Response;
  if (config.provider === 'gemini') {
    response = await request(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`, {
      method: 'POST', signal,
      headers: {'Content-Type':'application/json', 'x-goog-api-key':config.apiKey},
      body: JSON.stringify({
        systemInstruction: {parts:[{text:messages.filter(m=>m.role==='system').map(m=>m.content).join('\n\n')}]},
        contents: messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),
        generationConfig: {maxOutputTokens:json?8192:2048, ...(json?{responseMimeType:'application/json',responseJsonSchema:courseSchema}:{})},
      }),
    });
  } else {
    response = await request('https://api.openai.com/v1/chat/completions', {
      method:'POST', signal,
      headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.apiKey}`},
      body:JSON.stringify({model:config.model,messages,max_completion_tokens:json?4200:1000,...(json?{response_format:{type:'json_object'}}:{})}),
    });
  }
  // Never expose raw provider errors: they can include credentials or request details.
  if (!response.ok) throw upstreamError(response.status);
  const raw: unknown = await response.json();
  let content: unknown;
  if (config.provider === 'gemini') content = geminiText(raw);
  else {
    const choices=object(raw).choices;
    const candidate=object(Array.isArray(choices)?choices[0]:undefined);
    if (candidate.finish_reason === 'length') throw new AIError('Câu trả lời AI bị ngắt do quá dài. Hãy thử lại.');
    content=object(candidate.message).content;
  }
  if (typeof content !== 'string' || !content.trim() || content.length > 50000) throw new AIError('AI trả về dữ liệu trống hoặc không hợp lệ. Hãy thử lại.');
  return content;
}
