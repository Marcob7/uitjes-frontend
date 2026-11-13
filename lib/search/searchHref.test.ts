import assert from "node:assert/strict";
import test from "node:test";

import { buildSearchHref } from "./searchHref";

test("search shortcuts retain every selected filter and encode the query", () => {
  assert.equal(
    buildSearchHref("nl", {
      query: "koffie & taart",
      when: "weekend",
      category: "eten-drinken",
      free: true,
    }),
    "/nl/zoeken?query=koffie+%26+taart&when=weekend&category=eten-drinken&free=1",
  );
});

test("search shortcuts omit inactive filters and use the selected locale route", () => {
  assert.equal(buildSearchHref("en"), "/en/zoeken");
  assert.equal(buildSearchHref("en", { query: "museum" }), "/en/zoeken?query=museum");
});
