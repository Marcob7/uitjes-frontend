import assert from "node:assert/strict";
import test from "node:test";

import type { SearchResultsFilterState } from "@/components/search/useSearchResultsUrlState";
import { isPriceLabelFree, type GeneralSearchResult } from "./searchResults";
import {
  filterSearchResults,
  getSearchResultText,
  sortSearchResults,
} from "./searchSelectors";

const noFilters: SearchResultsFilterState = {
  city: "",
  when: "",
  category: "",
  free: false,
  rating: "",
};

const results: GeneralSearchResult[] = [
  {
    id: "museum-utrecht",
    title: "Museum aan de gracht",
    description: "",
    href: "/ontdek/museum",
    badge: "Cultuur",
    city: "Utrecht",
    citySlug: "utrecht",
    location: "Utrecht",
    priceLabel: "Gratis",
    priceMin: 0,
    isFree: true,
    ratingValue: 4.5,
    startAt: "2026-10-30T12:00:00.000Z",
    tags: ["binnen", "museum"],
    meta: "",
    source: "inspiration",
    score: 1,
  },
  {
    id: "park-amsterdam",
    title: "Wandeling in het park",
    description: "",
    href: "/ontdek/park",
    badge: "Buiten",
    city: "Amsterdam",
    citySlug: "amsterdam",
    location: "",
    isFree: false,
    ratingValue: null,
    priceMin: null,
    startAt: null,
    tags: ["buiten", "park"],
    meta: "",
    source: "city-content",
    score: 1,
  },
];

test("search selectors retain all results without filters and handle optional fields", () => {
  assert.deepEqual(filterSearchResults(results, noFilters), results);
  assert.match(getSearchResultText(results[1]), /wandeling in het park/);
});

test("search selectors combine filters", () => {
  assert.deepEqual(
    filterSearchResults(results, { ...noFilters, city: "utrecht", free: true }),
    [results[0]],
  );
  assert.deepEqual(
    filterSearchResults(results, { ...noFilters, category: "buiten" }),
    [results[1]],
  );
});

test("search selectors keep match order and sort deterministic ties", () => {
  assert.deepEqual(sortSearchResults(results, "match", "nl"), results);
  assert.deepEqual(
    sortSearchResults(
      [
        { ...results[0], id: "z", title: "Zebra", ratingValue: 4 },
        { ...results[0], id: "a", title: "Alfa", ratingValue: 4 },
      ],
      "rating",
      "nl",
    ).map((result) => result.title),
    ["Alfa", "Zebra"],
  );
});

test("search selectors apply city, time, category, price and rating as one result set", () => {
  const matching = {
    ...results[0],
    dateLabel: "Dit weekend",
    ratingValue: 4.8,
  };

  assert.deepEqual(
    filterSearchResults([matching, results[1]], {
      ...noFilters,
      city: "utrecht",
      when: "weekend",
      category: "cultuur",
      free: true,
      rating: "4",
    }),
    [matching],
  );
});

test("search sorting keeps unknown price and date values behind known values", () => {
  const dated = { ...results[0], id: "dated", title: "Zebra", priceMin: 12, startAt: "2026-10-31T12:00:00.000Z" };
  const newest = { ...results[1], id: "newest", title: "Alfa", priceMin: 8, startAt: "2026-11-01T12:00:00.000Z" };
  const unknown = { ...results[1], id: "unknown", title: "Museum", priceMin: null, startAt: null };

  assert.deepEqual(
    sortSearchResults([unknown, dated, newest], "price", "nl").map((result) => result.id),
    ["newest", "dated", "unknown"],
  );
  assert.deepEqual(
    sortSearchResults([unknown, dated, newest], "recent", "nl").map((result) => result.id),
    ["newest", "dated", "unknown"],
  );
});

test("only explicit free price labels match the free filter", () => {
  assert.equal(isPriceLabelFree("Gratis"), true);
  assert.equal(isPriceLabelFree("Vanaf EUR 0"), true);
  assert.equal(isPriceLabelFree("EUR 10 - EUR 35"), false);
  assert.equal(isPriceLabelFree("EUR 100"), false);
});
