"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cityOptions } from "@/lib/cityConfig";
import { localePathname } from "@/lib/i18n/config";
import { getSearchRoute, normalizeSearchQuery } from "@/lib/searchIntent";
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
  placeholder,
  buttonLabel,
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
  const { locale, t } = useLocale();
  const searchInputId = useId();
  const suggestionsListId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  // Deze lijst toont steden die matchen met wat de gebruiker intypt.
  const suggestions = useMemo((): CityOption[] => {
    const normalizedQuery = normalizeSearchQuery(query).toLocaleLowerCase("nl-NL");

    if (!normalizedQuery) return cityOptionsList;

    return cityOptionsList.filter((city) =>
      normalizeSearchQuery(city.label).toLocaleLowerCase("nl-NL").includes(normalizedQuery),
    );
  }, [query]);

  // City suggestions and free-text submits deliberately share the same
  // resolver, so cities are the only terms that use the discovery route.
  function goToCity(cityValue: string): void {
    const route = getSearchRoute(cityValue);
    if (route) router.push(localePathname(route, locale));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedQuery = normalizeSearchQuery(query);
    if (!normalizedQuery) {
      setError(t("search.emptyQuery"));
      inputRef.current?.focus();
      return;
    }

    const route = getSearchRoute(normalizedQuery);

    if (route) {
      setError(null);
      setQuery(normalizedQuery);
      router.push(localePathname(route, locale));
    }
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
    <div className={cn("relative z-50 mx-auto max-w-2xl", rootClassName)}>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label={t("home.heroSearchLabel")}
        className={cn(
          "rounded-[26px] bg-white/95 p-2 shadow-lg backdrop-blur sm:rounded-full",
          formClassName,
        )}
      >
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div
            className={cn(
              "flex min-h-[56px] min-w-0 flex-1 items-center rounded-[20px] bg-transparent px-4 sm:min-h-[56px] sm:rounded-full",
              inputWrapperClassName,
            )}
          >
            <span className={cn("mr-3 text-lg text-slate-400", iconClassName)}>
              &#8981;
            </span>

            <label htmlFor={searchInputId} className="sr-only">
              {t("home.heroSearchLabel")}
            </label>

            <input
              id={searchInputId}
              ref={inputRef}
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={suggestionsListId}
              aria-activedescendant={activeSuggestionId}
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setError(null);
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
              placeholder={placeholder ?? t("home.heroSearchPlaceholder")}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${searchInputId}-error` : undefined}
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              spellCheck={false}
              maxLength={80}
              className={cn(
                "min-w-0 w-full bg-transparent text-[16px] leading-6 text-slate-700 outline-none placeholder:text-slate-400 md:text-sm",
                inputClassName,
              )}
            />
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
            {buttonLabel ?? t("search.submit")}
          </AppButton>
        </div>
      </form>

      {error ? (
        <p
          id={`${searchInputId}-error`}
          role="status"
          aria-live="polite"
          className="mt-2 rounded-xl bg-white/95 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-sm"
        >
          {error}
        </p>
      ) : null}

      {showSuggestions && suggestions.length > 0 ? (
        <div
          id={suggestionsListId}
          role="listbox"
          aria-label="Stadsuggesties"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[min(20rem,52vh)] overflow-y-auto rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_22px_52px_rgba(15,23,42,0.18)] sm:rounded-[24px]",
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
  );
}
