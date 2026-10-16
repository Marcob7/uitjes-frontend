export type SearchResultsSortOption = "match" | "rating" | "price" | "recent";

export type SearchWhenFilterValue = "today" | "weekend";

export type SearchCategoryFilterValue =
  | "buiten"
  | "binnen"
  | "met-kinderen"
  | "eten-drinken";

export type SearchFixedFilterValue =
  | SearchWhenFilterValue
  | SearchCategoryFilterValue;

type SearchSortDefinition = {
  value: SearchResultsSortOption;
  labelKey:
    | "search.bestMatch"
    | "search.highestRated"
    | "search.priceLowHigh"
    | "search.recent";
};

export type SearchFixedFilterOption = {
  value: SearchFixedFilterValue;
  labelKey:
    | "search.whenToday"
    | "search.whenWeekend"
    | "search.categoryOutdoor"
    | "search.categoryIndoor"
    | "search.categoryChildren"
    | "search.categoryFood";
  terms: readonly string[];
};

export const SEARCH_SORT_OPTIONS = [
  { value: "match", labelKey: "search.bestMatch" },
  { value: "rating", labelKey: "search.highestRated" },
  { value: "price", labelKey: "search.priceLowHigh" },
  { value: "recent", labelKey: "search.recent" },
] as const satisfies ReadonlyArray<SearchSortDefinition>;

export const DEFAULT_SEARCH_RESULTS_SORT: SearchResultsSortOption = "match";

export const SEARCH_WHEN_FILTER_OPTIONS = [
  {
    value: "today",
    labelKey: "search.whenToday",
    terms: ["vandaag", "nu", "doorlopend", "actueel"],
  },
  {
    value: "weekend",
    labelKey: "search.whenWeekend",
    terms: ["weekend", "zaterdag", "zondag"],
  },
] as const satisfies ReadonlyArray<SearchFixedFilterOption>;

export const SEARCH_CATEGORY_FILTER_OPTIONS = [
  {
    value: "buiten",
    labelKey: "search.categoryOutdoor",
    terms: ["buiten", "natuur", "park", "wandeling", "route"],
  },
  {
    value: "binnen",
    labelKey: "search.categoryIndoor",
    terms: ["binnen", "museum", "cultuur", "workshop", "overdekt"],
  },
  {
    value: "met-kinderen",
    labelKey: "search.categoryChildren",
    terms: ["met-kinderen", "kinderen", "gezin", "familie", "kids"],
  },
  {
    value: "eten-drinken",
    labelKey: "search.categoryFood",
    terms: ["eten-drinken", "eten", "drinken", "restaurant", "horeca"],
  },
] as const satisfies ReadonlyArray<SearchFixedFilterOption>;

export function parseSearchResultsSort(value: string | null): SearchResultsSortOption {
  return (
    SEARCH_SORT_OPTIONS.find((option) => option.value === value)?.value ??
    DEFAULT_SEARCH_RESULTS_SORT
  );
}
