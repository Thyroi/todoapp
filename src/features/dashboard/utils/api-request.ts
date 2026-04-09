import type { ApiResponse } from "@/src/features/dashboard/types";

export async function apiRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? "Unexpected response." : payload.error.message);
  }

  return payload.data;
}
