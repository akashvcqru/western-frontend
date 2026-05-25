import type { ApiResponse, PaginatedApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5073";

// ─── Token helper ─────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// ─── Build query string ───────────────────────────────────────────────────────

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      q.set(key, String(val));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

// ─── Core request ─────────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  authRequired = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authRequired) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const json = await res.json();
      if (json?.message) errMsg = json.message;
    } catch {
      // Response is not JSON (e.g. plain text exception page)
    }
    throw new Error(errMsg);
  }

  const json = await res.json();
  return json as T;
}

// ─── Public GET helpers ───────────────────────────────────────────────────────

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>("GET", path);
}

export async function apiGetPaginated<T>(path: string): Promise<PaginatedApiResponse<T>> {
  return request<PaginatedApiResponse<T>>("GET", path);
}

// ─── Auth GET helpers (admin) ─────────────────────────────────────────────────

export async function apiAuthGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>("GET", path, undefined, true);
}

export async function apiAuthGetPaginated<T>(path: string): Promise<PaginatedApiResponse<T>> {
  return request<PaginatedApiResponse<T>>("GET", path, undefined, true);
}

// ─── Mutating helpers (always auth) ──────────────────────────────────────────

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>("POST", path, body, true);
}

export async function apiPut<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>("PUT", path, body, true);
}

export async function apiDelete<T = null>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>("DELETE", path, undefined, true);
}
