import { API_BASE } from "@/lib/api";

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/api/auth/user/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error("fetchMe failed");
  return res.json();
}