"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppButton, AppSearchInput } from "@/components/ui/app";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";
import { cityOptions } from "@/lib/cityConfig";
import { getSearchRoute, normalizeSearchQuery } from "@/lib/searchIntent";

type EmptyStateSearchActionsProps = {
  initialQuery?: string;
  showBackButton?: boolean;
};

export default function EmptyStateSearchActions({
  initialQuery = "",
  showBackButton = true,
}: EmptyStateSearchActionsProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [query, setQuery] = useState(initialQuery);

  const citySuggestions = useMemo(() => {
    const normalizedQuery = normalizeSearchQuery(query).toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return cityOptions
      .filter((city) =>
        normalizeSearchQuery(city.label).toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3)
      .map((city) => ({ label: city.label, value: city.label }));
  }, [query]);

  function submitSearch(nextQuery: string) {
    const route = getSearchRoute(nextQuery);

    if (route) {
      router.push(localePathname(route, locale));
    }
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      <AppSearchInput
        value={query}
        onChange={setQuery}
        onSubmit={submitSearch}
        suggestions={citySuggestions}
        onSuggestionSelect={(suggestion) => submitSearch(suggestion.value ?? suggestion.label)}
        placeholder={t("search.placeholder")}
        submitLabel={t("search.submit")}
        className="text-left"
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {showBackButton ? (
          <AppButton
            type="button"
            variant="dark"
            size="sm"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            {t("common.back")}
          </AppButton>
        ) : null}
        <AppButton href={localePathname("/ontdek", locale)} variant="dark" size="sm" className="w-full sm:w-auto">
          {t("search.linkCityTitle")}
        </AppButton>
        <AppButton href={localePathname("/inspiratie", locale)} variant="dark" size="sm" className="w-full sm:w-auto">
          {t("navigation.inspiration")}
        </AppButton>
        <AppButton href={localePathname("/uitjes", locale)} variant="dark" size="sm" className="w-full sm:w-auto">
          {t("search.popular")}
        </AppButton>
      </div>
    </div>
  );
}
