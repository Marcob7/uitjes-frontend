import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInspirationContextQuery,
  withInspirationContext,
} from "./href";

test("buildInspirationContextQuery omits an empty context", () => {
  assert.equal(buildInspirationContextQuery(), "");
});

test("buildInspirationContextQuery preserves each supported context value", () => {
  assert.equal(buildInspirationContextQuery({ location: "utrecht" }), "location=utrecht");
  assert.equal(buildInspirationContextQuery({ nearbyCity: "den-bosch" }), "nearbyCity=den-bosch");
  assert.equal(
    buildInspirationContextQuery({ location: "nearby", nearbyCity: "Den Bosch & omgeving" }),
    "location=nearby&nearbyCity=Den+Bosch+%26+omgeving",
  );
});

test("withInspirationContext only appends a query when context exists", () => {
  assert.equal(withInspirationContext("/inspiratie/vandaag"), "/inspiratie/vandaag");
  assert.equal(
    withInspirationContext("/inspiratie/vandaag", { location: "utrecht" }),
    "/inspiratie/vandaag?location=utrecht",
  );
});
