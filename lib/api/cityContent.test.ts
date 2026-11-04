import assert from "node:assert/strict";
import test from "node:test";

import { buildCityContentQuery, getCityContentByCity } from "./cityContent";

test("city-content query serializes a city and pagination in the established order", () => {
  assert.equal(
    buildCityContentQuery({ city: "apeldoorn", limit: 20, offset: 0 }),
    "city=apeldoorn&limit=20&offset=0",
  );
});

test("city-content query serializes filters and encodes special characters", () => {
  assert.equal(
    buildCityContentQuery({
      city: "Den Haag",
      type: "food_drink",
      query: "koffie & taart",
      terms: ["kinderen", "gratis"],
    }),
    "city=Den+Haag&type=food_drink&query=koffie+%26+taart&terms=kinderen%2Cgratis",
  );
});

test("city-content query omits empty optional values while retaining zero pagination", () => {
  assert.equal(
    buildCityContentQuery({ city: "", query: "", terms: [], limit: 0, offset: 0 }),
    "limit=0&offset=0",
  );
});

test("city-content callers can preserve a failed request as an error instead of an empty list", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalConsoleWarn = console.warn;
  const failedResponse = new Response(JSON.stringify({ detail: "Unavailable" }), {
    status: 503,
    headers: { "content-type": "application/json" },
  });

  globalThis.fetch = async () => failedResponse.clone();
  console.warn = () => {};
  t.after(() => {
    globalThis.fetch = originalFetch;
    console.warn = originalConsoleWarn;
  });

  await assert.rejects(
    getCityContentByCity("nijmegen", { throwOnError: true }),
    /GET .* failed: 503/,
  );
});
