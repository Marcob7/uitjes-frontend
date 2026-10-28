import {
  SEARCH_CATEGORY_FILTER_OPTIONS,
  SEARCH_WHEN_FILTER_OPTIONS,
  type SearchResultsSortOption,
} from "@/components/search/searchFilterConfig";
import type { SearchResultsFilterState } from "@/components/search/useSearchResultsUrlState";
import { localeToIntl, type Locale } from "@/lib/i18n/config";
import type { GeneralSearchResult } from "@/lib/search/searchResults";

export function normalizeSearchResultText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getSearchResultText(result: GeneralSearchResult) {
  return normalizeSearchResultText(
    [
      result.title,
      result.badge,
      result.categorySlug,
      result.city,
      result.location,
      result.priceLabel,
      result.dateLabel,
      result.kind,
      ...result.tags,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesSearchResultFilters(
  result: GeneralSearchResult,
  filters: SearchResultsFilterState,
) {
  const text = getSearchResultText(result);
  if (filters.city && result.citySlug !== filters.city) return false;
  if (filters.free && !result.isFree && !text.includes("gratis")) return false;
  if (filters.rating && (result.ratingValue ?? 0) < Number(filters.rating)) return false;

  if (filters.when) {
    const when = SEARCH_WHEN_FILTER_OPTIONS.find((option) => option.value === filters.when);
    if (when && !when.terms.some((term) => text.includes(normalizeSearchResultText(term)))) {
      return false;
    }
  }

  if (filters.category) {
    const category = SEARCH_CATEGORY_FILTER_OPTIONS.find(
      (option) => option.value === filters.category,
    );
    if (category && !category.terms.some((term) => text.includes(normalizeSearchResultText(term)))) {
      return false;
    }
  }

  return true;
}

export function filterSearchResults(
  results: GeneralSearchResult[],
  filters: SearchResultsFilterState,
) {
  return results.filter((result) => matchesSearchResultFilters(result, filters));
}

export function sortSearchResults(
  results: GeneralSearchResult[],
  sort: SearchResultsSortOption,
  locale: Locale,
) {
  const next = [...results];
  const compareTitles = (a: GeneralSearchResult, b: GeneralSearchResult) =>
    a.title.localeCompare(b.title, localeToIntl[locale]);

  if (sort === "rating") {
    next.sort((a, b) => (b.ratingValue ?? -1) - (a.ratingValue ?? -1) || compareTitles(a, b));
  } else if (sort === "price") {
    next.sort((a, b) =>
      (a.priceMin ?? Number.POSITIVE_INFINITY) - (b.priceMin ?? Number.POSITIVE_INFINITY) ||
      compareTitles(a, b),
    );
  } else if (sort === "recent") {
    next.sort((a, b) => {
      const aTime = a.startAt ? new Date(a.startAt).getTime() : 0;
      const bTime = b.startAt ? new Date(b.startAt).getTime() : 0;
      return bTime - aTime || compareTitles(a, b);
    });
  }

  return next;
}
