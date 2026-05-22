// frontend/lib/csrf.js
import { getApiBase } from "@/lib/config";

let csrfTokenCache = null;

export async function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;

  const res = await fetch(`${getApiBase()}/api/csrf/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.csrfToken) {
    throw new Error(`CSRF fetch failed: ${res.status} ${JSON.stringify(data)}`);
  }

  csrfTokenCache = data.csrfToken;
  return csrfTokenCache;
}

export function clearCsrfTokenCache() {
  csrfTokenCache = null;
}
