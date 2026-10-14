"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { localePathname, type Locale } from "@/lib/i18n/config";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export type SearchResultsSortOption = "match" | "rating" | "price" | "recent";

export type SearchResultsFilterKey =
  | "city"
  | "when"
  | "category"
  | "free"
  | "rating";

export type SearchResultsFilterState = {
  city: string;
  when: string;
  category: string;
  free: boolean;
  rating: string;
};

type SearchParamsLike = {
  get: (name: string) => string | null;
  toString: () => string;
};

function readFilters(params: SearchParamsLike): SearchResultsFilterState {
  return {
    city: params.get("city") ?? "",
    when: params.get("when") ?? "",
    category: params.get("category") ?? "",
    free: params.get("free") === "1",
    rating: params.get("rating") ?? "",
  };
}

function getSort(params: SearchParamsLike): SearchResultsSortOption {
  const value = params.get("sort");

  return value === "rating" || value === "price" || value === "recent"
    ? value
    : "match";
}

export function useSearchResultsUrlState(locale: Locale) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const filterSignature = searchParams.toString();
  const activeQuery = normalizeSearchQuery(
    searchParams.get("query") ?? searchParams.get("q")
  );
  const filters = readFilters(searchParams);
  const sort = getSort(searchParams);

  function updateUrl(
    nextFilters: Partial<SearchResultsFilterState>,
    nextSort?: SearchResultsSortOption
  ) {
    const next = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...nextFilters };

    if (merged.city) next.set("city", merged.city);
    else next.delete("city");
    if (merged.when) next.set("when", merged.when);
    else next.delete("when");
    if (merged.category) next.set("category", merged.category);
    else next.delete("category");
    if (merged.free) next.set("free", "1");
    else next.delete("free");
    if (merged.rating) next.set("rating", merged.rating);
    else next.delete("rating");

    if (nextSort && nextSort !== "match") next.set("sort", nextSort);
    else if (nextSort === "match") next.delete("sort");

    const queryString = next.toString();
    const searchPath = localePathname("/zoeken", locale);

    startTransition(() => {
      router.replace(queryString ? `${searchPath}?${queryString}` : searchPath, {
        scroll: false,
      });
    });
  }

  return {
    activeQuery,
    filterSignature,
    filters,
    isPending,
    sort,
    updateUrl,
  };
}
