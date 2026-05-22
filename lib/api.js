// frontend/lib/api.js
import { API_BASE, getApiBase } from "@/lib/config";
import { getCsrfToken } from "@/lib/csrf";
import { getStoredTokens } from "@/lib/jwtAuth";

export { API_BASE, getApiBase };

// Publiek
export async function apiGet(path) {
  const res = await fetch(`${getApiBase()}${path}`, { cache: "no-store" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

// Auth GET
export async function apiGetAuth(path) {
  let res;
  const headers = new Headers();
  const access = getStoredTokens()?.access;

  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  try {
    res = await fetch(`${getApiBase()}${path}`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });
  } catch {
    return null;
  }

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
  const access = getStoredTokens()?.access;

  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  if (isMutating) {
    const csrf = await getCsrfToken();
    headers.set("X-CSRFToken", csrf);

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  let res;

  try {
    res = await fetch(`${getApiBase()}${path}`, {
      ...options,
      method,
      credentials: "include",
      cache: "no-store",
      headers,
    });
  } catch {
    return { ok: false, auth: false, status: 0, data: null };
  }

  const data = await res.json().catch(() => null);

  if (res.status === 401 || res.status === 403) {
    return { ok: false, auth: false, status: res.status, data };
  }

  return { ok: res.ok, auth: true, status: res.status, data };
}
