// frontend/lib/api.js
import { API_BASE, getApiBase } from "@/lib/config";
import { getCsrfToken } from "@/lib/csrf";

export { API_BASE, getApiBase };

// Publiek
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

// Auth GET
export async function apiGetAuth(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      `GET(auth) ${path} failed: ${res.status} ${JSON.stringify(data)}`
    );
  }
  return data;
}

// Auth fetch met CSRF op mutaties
export async function apiFetchAuth(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers = new Headers(options.headers || {});

  if (isMutating) {
    const csrf = await getCsrfToken();
    headers.set("X-CSRFToken", csrf);

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    credentials: "include",
    cache: "no-store",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401 || res.status === 403) {
    return { ok: false, auth: false, status: res.status, data };
  }

  return { ok: res.ok, auth: true, status: res.status, data };
}