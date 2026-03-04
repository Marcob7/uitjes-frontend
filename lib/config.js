// frontend/lib/config.js
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function getApiBase() {
  return API_BASE.replace(/\/$/, "");
}