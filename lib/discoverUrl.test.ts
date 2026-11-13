import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDiscoverDetailHref,
  buildDiscoverUrl,
  getDiscoverUrlState,
} from "@/components/city-explore/discoverUrl";

test("discover URL parsing drops invalid state and preserves valid unique filters", () => {
  const state = getDiscoverUrlState(
    new URLSearchParams("companion=gezin&moment=weekend&vibe=cultureel&filters=free,culture,free,unknown&results=1&view=map&selected=18"),
    "utrecht",
  );

  assert.deepEqual(state, {
    city: "utrecht",
    plannerSelections: { companion: "gezin", moment: "weekend", vibe: "cultureel" },
    resultFilters: ["free", "culture"],
    isResultsOpen: true,
    view: "map",
    selectedId: 18,
  });
  assert.deepEqual(
    getDiscoverUrlState(new URLSearchParams("moment=weekend&selected=-2"), "utrecht").plannerSelections,
    {},
  );
});

test("discover detail links retain their own query while replacing stale result context", () => {
  const context = getDiscoverUrlState(
    new URLSearchParams("companion=solo&moment=nu&filters=free&results=1&view=map&selected=7"),
    "apeldoorn",
  );

  assert.equal(
    buildDiscoverUrl("apeldoorn", context.plannerSelections, context),
    "/ontdek?city=apeldoorn&companion=solo&moment=nu&filters=free&results=1&view=map&selected=7",
  );
  assert.equal(
    buildDiscoverDetailHref("/ontdek/park?ref=homepage&city=old", context),
    "/ontdek/park?ref=homepage&city=apeldoorn&companion=solo&moment=nu&filters=free&results=1&view=map&selected=7",
  );
});
