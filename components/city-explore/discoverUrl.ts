import type {
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
  ResultFilterKey,
} from "./types";

const COMPANIONS = new Set<PlannerCompanion>([
  "solo",
  "date",
  "gezin",
  "vrienden",
]);
const MOMENTS = new Set<PlannerMoment>(["nu", "vanavond", "morgen", "weekend"]);
const VIBES = new Set<PlannerVibe>([
  "cultureel",
  "actief",
  "eten-drinken",
  "relaxed",
]);
const RESULT_FILTERS = new Set<ResultFilterKey>([
  "food_drink",
  "outings",
  "free",
  "now",
  "evening",
  "culture",
  "active",
]);

type SearchParams = Pick<URLSearchParams, "get">;

export type DiscoverView = "list" | "map";

/** The complete, shareable state of a completed discover result set. */
export type DiscoverUrlState = {
  city: string;
  plannerSelections: PlannerSelections;
  resultFilters: ResultFilterKey[];
  isResultsOpen: boolean;
  view: DiscoverView;
  selectedId: number | null;
};

/**
 * Reads only valid, sequential planner answers. A malformed or partial query
 * can therefore never leave a later filter active without its earlier choice.
 */
export function getDiscoverPlannerSelections(
  searchParams: SearchParams
): PlannerSelections {
  const companion = searchParams.get("companion");
  if (!companion || !COMPANIONS.has(companion as PlannerCompanion)) return {};

  const selections: PlannerSelections = {
    companion: companion as PlannerCompanion,
  };
  const moment = searchParams.get("moment");
  if (!moment || !MOMENTS.has(moment as PlannerMoment)) return selections;

  selections.moment = moment as PlannerMoment;
  const vibe = searchParams.get("vibe");
  if (vibe && VIBES.has(vibe as PlannerVibe)) {
    selections.vibe = vibe as PlannerVibe;
  }

  return selections;
}

export function getDiscoverPlannerStepCount(selections: PlannerSelections) {
  if (!selections.companion) return 0;
  if (!selections.moment) return 1;
  if (!selections.vibe) return 2;
  return 3;
}

function getResultFilters(searchParams: SearchParams): ResultFilterKey[] {
  const rawFilters = searchParams.get("filters");
  if (!rawFilters) return [];

  return rawFilters.split(",").reduce<ResultFilterKey[]>((filters, value) => {
    const filter = value as ResultFilterKey;
    if (RESULT_FILTERS.has(filter) && !filters.includes(filter)) {
      filters.push(filter);
    }
    return filters;
  }, []);
}

function getSelectedId(searchParams: SearchParams) {
  const value = Number(searchParams.get("selected"));
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

/** Reads every URL-owned part of the discover experience in one place. */
export function getDiscoverUrlState(
  searchParams: SearchParams,
  city: string
): DiscoverUrlState {
  return {
    city,
    plannerSelections: getDiscoverPlannerSelections(searchParams),
    resultFilters: getResultFilters(searchParams),
    // A city by itself intentionally opens the introduction. This explicit
    // marker distinguishes it from a user who deliberately chose all results.
    isResultsOpen: searchParams.get("results") === "1",
    view: searchParams.get("view") === "map" ? "map" : "list",
    selectedId: getSelectedId(searchParams),
  };
}

type DiscoverUrlOptions = Pick<
  DiscoverUrlState,
  "resultFilters" | "isResultsOpen" | "view" | "selectedId"
>;

/** Builds the canonical discover route without carrying stale query state. */
export function buildDiscoverUrl(
  city: string,
  selections: PlannerSelections = {},
  options: Partial<DiscoverUrlOptions> = {}
) {
  const searchParams = new URLSearchParams({ city });

  if (selections.companion) searchParams.set("companion", selections.companion);
  if (selections.moment) searchParams.set("moment", selections.moment);
  if (selections.vibe) searchParams.set("vibe", selections.vibe);

  if (options.resultFilters?.length) {
    searchParams.set("filters", options.resultFilters.join(","));
  }
  if (options.isResultsOpen) searchParams.set("results", "1");
  if (options.isResultsOpen) searchParams.set("view", options.view ?? "list");
  if (options.selectedId) searchParams.set("selected", String(options.selectedId));

  return `/ontdek?${searchParams.toString()}`;
}

/**
 * Keeps the result URL as the single source of truth when opening an existing
 * detail route. The route itself is never inferred or replaced.
 */
export function buildDiscoverDetailHref(href: string, context: DiscoverUrlState) {
  if (!href.startsWith("/ontdek/")) return href;

  const [path, existingQuery = ""] = href.split("?", 2);
  const params = new URLSearchParams(existingQuery);
  ["city", "companion", "moment", "vibe", "filters", "results", "view", "selected"].forEach(
    (key) => params.delete(key)
  );

  const contextQuery = buildDiscoverUrl(
    context.city,
    context.plannerSelections,
    context
  ).split("?", 2)[1];
  new URLSearchParams(contextQuery).forEach((value, key) => params.set(key, value));

  return `${path}?${params.toString()}`;
}
