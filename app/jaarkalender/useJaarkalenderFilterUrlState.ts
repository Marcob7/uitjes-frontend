"use client";

import { useEffect, useState } from "react";

import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

import {
  getCurrentLocalMonth,
  getMonthFromInputValue,
  getMonthFromUrl,
  getMonthInputValue,
} from "./calendarUtils";
import {
  jaarkalenderCategoryMeta,
  type JaarkalenderCategoryKey,
} from "./data";

export type JaarkalenderInitialFilters = {
  category?: string;
  city?: string;
  date?: string;
};

function getCityLabelFromUrl(value: string | null) {
  if (!value) return null;

  const normalizedValue = normalizeCitySlug(value);
  return (
    cityOptions.find(
      (city) =>
        city.value === normalizedValue ||
        normalizeCitySlug(city.label) === normalizedValue,
    )?.label ?? value
  );
}

function getInitialSearchParam(
  initialValue: string | undefined,
  name: string,
) {
  return initialValue ??
    (typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get(name));
}

/**
 * Owns the applied calendar filters and their browser-history contract.
 * Dialog draft/combobox state intentionally remains with the feature UI.
 */
export function useJaarkalenderFilterUrlState(
  initialFilters: JaarkalenderInitialFilters = {},
) {
  const [defaultMonth] = useState(() => getCurrentLocalMonth());
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getMonthFromUrl(
      getInitialSearchParam(initialFilters.date, "date"),
      getCurrentLocalMonth(),
    ),
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(() =>
    getCityLabelFromUrl(getInitialSearchParam(initialFilters.city, "city")),
  );
  const [selectedCategory, setSelectedCategory] =
    useState<JaarkalenderCategoryKey | null>(() => {
      const category = getInitialSearchParam(initialFilters.category, "category");
      return category && category in jaarkalenderCategoryMeta
        ? (category as JaarkalenderCategoryKey)
        : null;
    });

  function syncFilterParams(
    city: string | null,
    category: JaarkalenderCategoryKey | null,
    month: Date,
  ) {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isDefaultMonth =
      getMonthInputValue(month) === getMonthInputValue(defaultMonth);

    if (city) url.searchParams.set("city", normalizeCitySlug(city));
    else url.searchParams.delete("city");

    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");

    if (isDefaultMonth) url.searchParams.delete("date");
    else url.searchParams.set("date", getMonthInputValue(month));

    const nextHref = `${url.pathname}${url.search}${url.hash}`;
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextHref !== currentHref) {
      window.history.pushState(null, "", nextHref);
    }
  }

  function setMonthFilter(month: Date) {
    const normalizedMonth = getMonthFromInputValue(getMonthInputValue(month));
    if (!normalizedMonth) return;

    setSelectedMonth(normalizedMonth);
    syncFilterParams(selectedCity, selectedCategory, normalizedMonth);
  }

  function applyMonthInputValue(value: string) {
    const month = getMonthFromInputValue(value);
    if (month) setMonthFilter(month);
  }

  function setCityFilter(city: string | null) {
    setSelectedCity(city);
    syncFilterParams(city, selectedCategory, selectedMonth);
  }

  function setCategoryFilter(category: JaarkalenderCategoryKey | null) {
    setSelectedCategory(category);
    syncFilterParams(selectedCity, category, selectedMonth);
  }

  function clearFilters() {
    setSelectedCity(null);
    setSelectedCategory(null);
    setSelectedMonth(defaultMonth);
    syncFilterParams(null, null, defaultMonth);
  }

  useEffect(() => {
    function syncStateFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");

      setSelectedCity(getCityLabelFromUrl(params.get("city")));
      setSelectedCategory(
        category && category in jaarkalenderCategoryMeta
          ? (category as JaarkalenderCategoryKey)
          : null,
      );
      setSelectedMonth(getMonthFromUrl(params.get("date"), defaultMonth));
    }

    // Hydration and browser back/forward both derive applied state from the URL.
    syncStateFromUrl();
    window.addEventListener("popstate", syncStateFromUrl);
    return () => window.removeEventListener("popstate", syncStateFromUrl);
  }, [defaultMonth]);

  const hasActiveFilters =
    selectedCity !== null ||
    selectedCategory !== null ||
    getMonthInputValue(selectedMonth) !== getMonthInputValue(defaultMonth);

  return {
    defaultMonth,
    selectedMonth,
    selectedCity,
    selectedCategory,
    hasActiveFilters,
    setMonthFilter,
    applyMonthInputValue,
    setCityFilter,
    setCategoryFilter,
    clearFilters,
  };
}
