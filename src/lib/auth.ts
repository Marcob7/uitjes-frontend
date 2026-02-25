// src/lib/auth.ts
export async function fetchMe() {
  const res = await fetch("http://localhost:8000/api/auth/user/", {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error("fetchMe failed");
  return res.json();
}