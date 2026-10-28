import assert from "node:assert/strict";
import test from "node:test";

import { findCity, getCityLabel, normalizeCitySlug } from "./cityConfig";

test("city lookup resolves known cities and returns undefined for unknown cities", () => {
  assert.deepEqual(findCity("utrecht"), { label: "Utrecht", value: "utrecht" });
  assert.equal(findCity("onbekende-stad"), undefined);
  assert.equal(getCityLabel("onbekende-stad"), undefined);
});

test("city lookup normalizes labels and the 's-Hertogenbosch alias", () => {
  assert.equal(normalizeCitySlug("'s-Hertogenbosch"), "den-bosch");
  assert.equal(findCity("'s-Hertogenbosch")?.value, "den-bosch");
  assert.equal(findCity("den bosch")?.label, "Den Bosch");
});
