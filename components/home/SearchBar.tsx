"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

type SearchBarProps = {
  placeholder?: string;
  buttonLabel?: string;
};

type CityOption = {
  label: string;
  slug: string;
};

const cityOptionsList: CityOption[] = cityOptions.map((city) => ({
  label: city.label,
  slug: city.value,
}));

export default function SearchBar({
  placeholder = "Zoek op stad, festival, restaurant of activiteit",
  buttonLabel = "Zoek",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Deze lijst toont steden die matchen met wat de gebruiker intypt.
  const suggestions = useMemo((): CityOption[] => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return cityOptionsList;

    return cityOptionsList.filter((city) =>
      city.label.toLowerCase().includes(trimmed)
    );
  }, [query]);

  // Deze functie zet de ingevoerde stad om naar een geldige slug
  // en stuurt de gebruiker daarna door naar de ontdekpagina.
  function goToCity(cityValue: string): void {
    const trimmedValue = cityValue.trim();

    if (!trimmedValue) return;

    const matchedCity = cityOptionsList.find(
      (city) =>
        city.label.toLowerCase() === trimmedValue.toLowerCase() ||
        city.slug === normalizeCitySlug(trimmedValue)
    );

    const citySlug = matchedCity
      ? matchedCity.slug
      : normalizeCitySlug(trimmedValue);

    if (!citySlug) return;

    router.push(`/ontdek?city=${encodeURIComponent(citySlug)}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    goToCity(query);
  }

  function handleSuggestionClick(city: CityOption): void {
    setQuery(city.label);
    setShowSuggestions(false);
    goToCity(city.label);
  }

  return (
    <div className="relative mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Zoek een stad"
        className="rounded-full bg-white/95 p-2 shadow-lg backdrop-blur"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex min-h-[52px] flex-1 items-center rounded-full bg-transparent px-4">
            <span className="mr-3 text-slate-400">⌕</span>

            <label htmlFor="homepage-city-search" className="sr-only">
              Zoek een stad
            </label>

            <input
              id="homepage-city-search"
              type="search"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              placeholder={placeholder}
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              spellCheck={false}
              maxLength={80}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            {showSuggestions && suggestions.length > 0 ? (
              <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-30 rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <ul className="flex flex-col gap-1">
                  {suggestions.map((city) => (
                    <li key={city.slug}>
                      <button
                        type="button"
                        onMouseDown={() => handleSuggestionClick(city)}
                        className="flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <span>{city.label}</span>
                        <span className="text-slate-400">→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-lime-700 px-7 text-sm font-semibold text-white transition hover:bg-lime-800"
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}