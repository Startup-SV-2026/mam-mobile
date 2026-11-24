import { fetchBackend } from "./backend-fetch";
import type { Progress } from "../types/course";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  progress: Partial<Progress> & {
    saved?: string[];
    notes?: Record<string, string>;
    illustrationIds?: Record<string, string>;
    selectedCourseId?: string;
  };
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

const getBaseUrl = () =>
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, "");

async function handleAuthResponse(response: Response): Promise<any> {
  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Phản hồi từ máy chủ không hợp lệ.");
  }
  if (!response.ok) {
    throw new Error(data?.error || `Yêu cầu thất bại (${response.status})`);
  }
  return data;
}

export async function fetchDemoAccount(): Promise<AuthResponse> {
  const response = await fetchBackend(`${getBaseUrl()}/api/auth/demo`);
  return handleAuthResponse(response);
}

export async function loginAccount(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetchBackend(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleAuthResponse(response);
}

export async function registerAccount(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const response = await fetchBackend(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return handleAuthResponse(response);
}

export async function fetchMe(token: string): Promise<{ user: UserProfile }> {
  const response = await fetchBackend(`${getBaseUrl()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleAuthResponse(response);
}

export async function syncUserProgress(
  token: string,
  progress: UserProfile["progress"],
): Promise<{ user: UserProfile }> {
  const response = await fetchBackend(`${getBaseUrl()}/api/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ progress }),
  });
  return handleAuthResponse(response);
}
