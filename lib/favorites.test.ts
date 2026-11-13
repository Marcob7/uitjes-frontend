import assert from "node:assert/strict";
import test from "node:test";

import {
  getSavedPlaces,
  SAVED_PLACES_STORAGE_KEY,
  toggleSavedPlace,
} from "./savedPlaces";
import { addFavorite, getFavorites, isFavorite, removeFavorite, type FavoriteItem } from "./favorites";
import { clearCsrfTokenCache } from "./csrf";

const favorite: FavoriteItem = {
  id: 1,
  event_id: 42,
  title: "Museum",
  slug: "museum",
  city: "Nijmegen",
  kind: "outings",
  category: "Cultuur",
  summary: "Een museumbezoek.",
  image_url: null,
  created_at: "2026-11-04T12:00:00.000Z",
};

function mockFetch(t: test.TestContext, handler: typeof fetch) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = handler;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
}

test("favorites distinguishes a successful list from a successful empty list", async (t) => {
  mockFetch(t, async () => new Response(JSON.stringify([favorite]), { status: 200 }));
  assert.deepEqual(await getFavorites(), { status: "success", favorites: [favorite] });

  globalThis.fetch = async () => new Response(JSON.stringify([]), { status: 200 });
  assert.deepEqual(await getFavorites(), { status: "success", favorites: [] });
});

test("favorites keeps an explicit unauthorized outcome for HTTP 401 and 403", async (t) => {
  mockFetch(t, async () => new Response(null, { status: 401 }));
  assert.deepEqual(await getFavorites(), { status: "unauthorized" });

  globalThis.fetch = async () => new Response(null, { status: 403 });
  assert.deepEqual(await getFavorites(), { status: "unauthorized" });
});

test("favorites rejects HTTP 500 and network failures instead of returning an empty list", async (t) => {
  mockFetch(t, async () => new Response(JSON.stringify({ detail: "Unavailable" }), { status: 500 }));
  await assert.rejects(getFavorites(), /GET\(auth\) \/api\/favorites\/ failed: 500/);

  globalThis.fetch = async () => {
    throw new Error("Network unavailable");
  };
  await assert.rejects(getFavorites(), /Network unavailable/);

  globalThis.fetch = async () => new Response("not JSON", { status: 200 });
  await assert.rejects(getFavorites(), /returned an invalid response/);
});

test("favorites can be requested again after a failed request", async (t) => {
  let callCount = 0;
  mockFetch(t, async () => {
    callCount += 1;
    if (callCount === 1) throw new Error("Network unavailable");
    return new Response(JSON.stringify([favorite]), { status: 200 });
  });

  await assert.rejects(getFavorites(), /Network unavailable/);
  assert.deepEqual(await getFavorites(), { status: "success", favorites: [favorite] });
  assert.equal(callCount, 2);
});

test("local saved places stay readable after a failed favorites request", async (t) => {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const values = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: localStorage,
  });
  values.set(SAVED_PLACES_STORAGE_KEY, JSON.stringify([
    { id: "place:1", title: "Lokale plek", href: "/ontdek/lokaal" },
  ]));
  mockFetch(t, async () => {
    throw new Error("Network unavailable");
  });
  t.after(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });

  await assert.rejects(getFavorites(), /Network unavailable/);
  assert.deepEqual(getSavedPlaces(), [
    { id: "place:1", title: "Lokale plek", href: "/ontdek/lokaal" },
  ]);
});

test("favorite mutations use the event endpoint and payload", async (t) => {
  clearCsrfTokenCache();
  const requests: Array<{ url: string; method?: string; body?: string }> = [];
  mockFetch(t, async (url, options) => {
    requests.push({
      url: String(url),
      method: options?.method,
      body: options?.body as string | undefined,
    });
    if (String(url).endsWith("/api/csrf/")) {
      return new Response(JSON.stringify({ csrfToken: "test-csrf" }), { status: 200 });
    }
    return options?.method === "POST"
      ? new Response(JSON.stringify({ ok: true }), { status: 201 })
      : new Response(null, { status: 204 });
  });

  const added = await addFavorite(42);
  const removed = await removeFavorite(42);

  assert.deepEqual(added, { ok: true, auth: true, status: 201, data: { ok: true } });
  assert.deepEqual(removed, { ok: true, auth: true, status: 204, data: null });
  assert.deepEqual(requests, [
    { url: "http://127.0.0.1:8000/api/csrf/", method: "GET", body: undefined },
    { url: "http://127.0.0.1:8000/api/favorites/", method: "POST", body: JSON.stringify({ event_id: 42 }) },
    { url: "http://127.0.0.1:8000/api/favorites/42/", method: "DELETE", body: undefined },
  ]);
});

test("favorite mutations keep backend failures explicit", async (t) => {
  clearCsrfTokenCache();
  mockFetch(t, async (url) => {
    if (String(url).endsWith("/api/csrf/")) {
      return new Response(JSON.stringify({ csrfToken: "test-csrf" }), { status: 200 });
    }
    return new Response(JSON.stringify({ detail: "Unavailable" }), { status: 503 });
  });

  assert.deepEqual(
    await addFavorite(42),
    { ok: false, auth: true, status: 503, data: { detail: "Unavailable" } },
  );
});

test("local saved places toggle without affecting the backend favorite list", async (t) => {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const values = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, dispatchEvent: () => true },
  });
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorage });
  t.after(() => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: originalLocalStorage });
  });

  const place = { id: "place:1", title: "Lokale plek", href: "/ontdek/lokaal" };
  assert.equal(toggleSavedPlace(place).length, 1);
  assert.equal(getSavedPlaces()[0]?.id, place.id);
  assert.deepEqual(toggleSavedPlace(place), []);

  mockFetch(t, async () => new Response(JSON.stringify([favorite]), { status: 200 }));
  assert.equal(await isFavorite(favorite.event_id), true);
  assert.deepEqual(getSavedPlaces(), []);
});
