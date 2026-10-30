import assert from "node:assert/strict";
import test from "node:test";

import { buildCityContentQuery } from "./cityContent";

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
