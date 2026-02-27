// src/lib/auth.ts
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export async function fetchMe() {
  
   const res = await fetch(`${base}/api/auth/user/`, {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error("fetchMe failed");
  return res.json();
}