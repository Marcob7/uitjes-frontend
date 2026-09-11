import { getApiBase } from "@/lib/config";

export const runtime = "edge";

const CITY_CONTENT_PROXY_TIMEOUT_MS = 10_000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const backendUrl = `${getApiBase()}/api/city-content/${url.search}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CITY_CONTENT_PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(backendUrl, { cache: "no-store", signal: controller.signal });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { detail: "De city-content bron is tijdelijk niet bereikbaar." },
      { status: controller.signal.aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
