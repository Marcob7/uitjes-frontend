"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import { getSearchRoute } from "@/lib/searchIntent";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  placeholder?: string;
  buttonLabel?: string;
  rootClassName?: string;
  formClassName?: string;
  inputWrapperClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  suggestionsPanelClassName?: string;
  suggestionItemClassName?: string;
  submitButtonClassName?: string;
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
  placeholder = "Zoek op stad, festival of activiteit",
  buttonLabel = "Zoek",
  rootClassName,
  formClassName,
  inputWrapperClassName,
  iconClassName,
  inputClassName,
  suggestionsPanelClassName,
  suggestionItemClassName,
  submitButtonClassName,
}: SearchBarProps) {
  const router = useRouter();
  const searchInputId = useId();
  const suggestionsListId = useId();
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  // Deze lijst toont steden die matchen met wat de gebruiker intypt.
  const suggestions = useMemo((): CityOption[] => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return cityOptionsList;

    return cityOptionsList.filter((city) =>
      city.label.toLowerCase().includes(trimmed),
    );
  }, [query]);

  // Deze functie behoudt de bestaande stadssuggestie-flow.
  function goToCity(cityValue: string): void {
    const trimmedValue = cityValue.trim();

    if (!trimmedValue) return;

    const matchedCity = cityOptionsList.find(
      (city) =>
        city.label.toLowerCase() === trimmedValue.toLowerCase() ||
        city.slug === normalizeCitySlug(trimmedValue),
    );

    const citySlug = matchedCity
      ? matchedCity.slug
      : normalizeCitySlug(trimmedValue);

    if (!citySlug) return;

    router.push(`/ontdek?city=${encodeURIComponent(citySlug)}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    router.push(getSearchRoute(query));
  }

  function handleSuggestionClick(city: CityOption): void {
    setQuery(city.label);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    goToCity(city.label);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowSuggestions(true);
      setActiveSuggestionIndex((current) =>
        suggestions.length === 0 ? -1 : Math.min(current + 1, suggestions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((current) =>
        suggestions.length === 0 ? -1 : Math.max(current - 1, 0),
      );
      return;
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
      return;
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  }

  const activeSuggestionId =
    activeSuggestionIndex >= 0
      ? `${suggestionsListId}-option-${suggestions[activeSuggestionIndex]?.slug}`
      : undefined;

  return (
    <div className={cn("relative z-40 mx-auto max-w-2xl", rootClassName)}>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Zoek een stad"
        className={cn(
          "rounded-[24px] bg-white/95 p-2 shadow-lg backdrop-blur sm:rounded-full",
          formClassName,
        )}
      >
        <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center">
          <div
            className={cn(
              "relative flex min-h-[56px] flex-1 items-center rounded-2xl bg-transparent px-4 sm:min-h-[56px] sm:rounded-full sm:px-4",
              inputWrapperClassName,
            )}
          >
            <span className={cn("mr-3 text-lg text-slate-400", iconClassName)}>
              &#8981;
            </span>

            <label htmlFor={searchInputId} className="sr-only">
              Zoek een stad
            </label>

            <input
              id={searchInputId}
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={suggestionsListId}
              aria-activedescendant={activeSuggestionId}
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleInputKeyDown}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                }, 150);
              }}
              placeholder={placeholder}
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              spellCheck={false}
              maxLength={80}
              className={cn(
                "w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm",
                inputClassName,
              )}
            />

            {showSuggestions && suggestions.length > 0 ? (
              <div
                id={suggestionsListId}
                role="listbox"
                aria-label="Stadsuggesties"
                className={cn(
                  "absolute left-0 right-0 top-[calc(100%+12px)] z-[90] max-h-[min(18rem,55vh)] overflow-y-auto rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:rounded-[24px]",
                  suggestionsPanelClassName,
                )}
              >
                <ul className="flex flex-col gap-1">
                  {suggestions.map((city, index) => (
                    <li key={city.slug}>
                      <button
                        id={`${suggestionsListId}-option-${city.slug}`}
                        role="option"
                        aria-selected={index === activeSuggestionIndex}
                        type="button"
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onMouseDown={() => handleSuggestionClick(city)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50",
                          suggestionItemClassName,
                        )}
                      >
                        <span>{city.label}</span>
                        <span className="text-current/60">&rarr;</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className={cn(
              "h-[56px] px-7 md:w-auto",
              submitButtonClassName,
            )}
          >
            {buttonLabel}
          </AppButton>
        </div>
      </form>
    </div>
  );
}
