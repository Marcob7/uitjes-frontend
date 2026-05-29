import { getApiBase } from "@/lib/config";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const backendUrl = `${getApiBase()}/api/city-content/${url.search}`;

  try {
    const response = await fetch(backendUrl, { cache: "no-store" });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json({ results: [] }, { status: 502 });
  }
}
