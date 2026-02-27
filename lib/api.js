import { getCsrfToken } from "@/lib/csrf";

// frontend/lib/api.js
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Voor publieke endpoints (events)
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

// Voor auth endpoints (me) of later favorites (met sessie-cookie)
export async function apiGetAuth(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    credentials: "include",
  });
  const data = await res.json().catch(() => null);

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) {
    throw new Error(
      `GET(auth) ${path} failed: ${res.status} ${JSON.stringify(data)}`
    );
  }
  return data;
}

export async function apiFetchAuth(path, options = {}) {
  const csrf = getCsrfToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(csrf ? { "X-CSRFToken": csrf } : {}),
      // alleen Content-Type zetten als je body JSON is
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  const data = await res.json().catch(() => null);

  // Handig gedrag voor “niet ingelogd”
  if (res.status === 401 || res.status === 403) {
    return { ok: false, auth: false, status: res.status, data };
  }

  return { ok: res.ok, status: res.status, data };
}