import assert from "node:assert/strict";
import test from "node:test";

import { getSavedPlaces, SAVED_PLACES_STORAGE_KEY } from "./savedPlaces";
import { getFavorites, type FavoriteItem } from "./favorites";

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

function mockFetch(t: test.TestContext, handler: () => Promise<Response>) {
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
