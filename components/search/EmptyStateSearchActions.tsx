"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppButton, AppSearchInput } from "@/components/ui/app";
import { cityOptions } from "@/lib/cityConfig";
import { getSearchRoute } from "@/lib/searchIntent";

type EmptyStateSearchActionsProps = {
  initialQuery?: string;
  showBackButton?: boolean;
};

export default function EmptyStateSearchActions({
  initialQuery = "",
  showBackButton = true,
}: EmptyStateSearchActionsProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const citySuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return cityOptions
      .filter((city) => city.label.toLowerCase().includes(normalizedQuery))
      .slice(0, 3)
      .map((city) => ({ label: city.label, value: city.label }));
  }, [query]);

  function submitSearch(nextQuery: string) {
    router.push(getSearchRoute(nextQuery));
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      <AppSearchInput
        value={query}
        onChange={setQuery}
        onSubmit={submitSearch}
        suggestions={citySuggestions}
        onSuggestionSelect={(suggestion) => submitSearch(suggestion.value ?? suggestion.label)}
        placeholder="Zoek opnieuw op stad, activiteit of festival"
        submitLabel="Zoek"
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
            Terug
          </AppButton>
        ) : null}
        <AppButton href="/ontdek" variant="dark" size="sm" className="w-full sm:w-auto">
          Zoek op een stad
        </AppButton>
        <AppButton href="/inspiratie" variant="dark" size="sm" className="w-full sm:w-auto">
          Bekijk inspiratie
        </AppButton>
        <AppButton href="/uitjes" variant="dark" size="sm" className="w-full sm:w-auto">
          Populaire categorieen
        </AppButton>
      </div>
    </div>
  );
}
