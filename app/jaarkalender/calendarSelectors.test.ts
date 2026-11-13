import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMonthCalendarCells,
  getVisibleCalendarImportEvents,
} from "./calendarSelectors";

const october = new Date(2024, 9, 1);
const noFilters = { selectedCity: null, selectedCategory: null } as const;

test("buildMonthCalendarCells keeps the unfiltered October grid and event previews", () => {
  const cells = buildMonthCalendarCells(october, new Date(2024, 8, 30), noFilters);
  const firstDay = cells.find((cell) => cell.dayNumber === 1);

  assert.equal(cells.length, 35);
  assert.equal(firstDay?.eventCount, 7);
  assert.equal(firstDay?.eventLabels?.length, 2);
  assert.match(firstDay?.href ?? "", /^\/jaarkalender\//);
  assert.match(firstDay?.accessibleLabel ?? "", /dinsdag 1 oktober/);
});

test("buildMonthCalendarCells applies city and category filters independently", () => {
  const amsterdam = buildMonthCalendarCells(october, october, {
    selectedCity: "Amsterdam",
    selectedCategory: null,
  });
  const culture = buildMonthCalendarCells(october, october, {
    selectedCity: null,
    selectedCategory: "cultuur",
  });

  assert.equal(amsterdam.find((cell) => cell.dayNumber === 1)?.eventCount, 1);
  assert.equal(culture.find((cell) => cell.dayNumber === 1)?.eventCount, 1);
});

test("selectors keep empty months empty and restore the default filter result", () => {
  const emptyMonth = buildMonthCalendarCells(new Date(2024, 10, 1), october, noFilters);
  const emptyDay = emptyMonth.find((cell) => cell.dayNumber === 1);
  const restored = buildMonthCalendarCells(october, new Date(2024, 8, 30), noFilters);

  assert.equal(emptyDay?.href, undefined);
  assert.equal(emptyDay?.eventCount, undefined);
  assert.equal(getVisibleCalendarImportEvents(new Date(2024, 10, 1), noFilters).length, 0);
  assert.equal(getVisibleCalendarImportEvents(october, noFilters).length, 234);
  assert.deepEqual(restored, buildMonthCalendarCells(october, new Date(2024, 8, 30), noFilters));
});
