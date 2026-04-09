"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

type CityOption = {
  label: string;
  slug: string;
};

const cityOptionsList: CityOption[] = cityOptions.map((city) => ({
  label: city.label,
  slug: city.value,
}));

const featuredCities: CityOption[] = [
  "amsterdam",
  "rotterdam",
  "utrecht",
  "apeldoorn",
  "deventer",
  "zwolle",
]
  .map((slug) => cityOptionsList.find((city) => city.slug === slug))
  .filter(Boolean) as CityOption[];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const suggestions = useMemo((): CityOption[] => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return cityOptionsList;

    return cityOptionsList.filter((city) =>
      city.label.toLowerCase().includes(trimmed)
    );
  }, [query]);

  function goToCity(cityValue: string): void {
    const matchedCity = cityOptionsList.find(
      (city) =>
        city.label.toLowerCase() === cityValue.trim().toLowerCase() ||
        city.slug === normalizeCitySlug(cityValue)
    );

    const citySlug = matchedCity
      ? matchedCity.slug
      : normalizeCitySlug(cityValue);

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
    <section className="relative overflow-hidden border-b border-[#e9dfd2] bg-[#FDFBF7]">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5b33]">
            Uitjes NL
          </p>
          <h1 className="font-heading mt-4 max-w-4xl text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.92] tracking-[-0.065em] text-[#23170f] [text-wrap:balance]">
            Zoek een stad en zie meteen wat daar te doen is.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#625141] sm:text-lg">
            Typ een plaatsnaam, open de ontdekpagina en filter verder op moment,
            prijs of type uitje.
          </p>
        </div>

        <div className="mt-10 max-w-5xl">
          <form
            onSubmit={handleSubmit}
            role="search"
            aria-label="Zoek een stad"
            className="relative overflow-visible rounded-[2rem] border border-[#e5d9c8] bg-white shadow-[0_28px_70px_rgba(92,63,36,0.10)]"
          >
            <div className="border-b border-[#ece1d2] px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d5b33]">
                  Begin hier
                </p>
                <span className="rounded-full border border-[#e4d5c1] bg-[#faf4eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8d5b33]">
                  Vandaag populair
                </span>
              </div>
              <p
                id="hero-search-help"
                className="mt-2 text-sm leading-6 text-[#6e5a49]"
              >
                Bijvoorbeeld Amsterdam, Rotterdam, Utrecht of Zwolle. Enter werkt ook.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
              <div className="relative flex min-w-0 flex-1 items-center gap-4 rounded-[1.4rem] bg-[#f8f4ed] px-4 py-3 sm:px-5 sm:py-4">
                <svg
                  className="h-5 w-5 shrink-0 text-[#9b714d]"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14.1667 14.1667L17.5 17.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8.75"
                    cy="8.75"
                    r="5.75"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <div className="min-w-0 flex-1">
                  <label htmlFor="city-search" className="sr-only">
                    Naar welke stad wil je zoeken?
                  </label>
                  <input
                    id="city-search"
                    name="city"
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
                    placeholder="Naar welke stad wil je zoeken?"
                    autoComplete="off"
                    enterKeyHint="search"
                    inputMode="search"
                    spellCheck={false}
                    maxLength={80}
                    required
                    aria-describedby="hero-search-help"
                    className="w-full min-w-0 bg-transparent text-lg text-[#23170f] outline-none placeholder:text-[#9b836d] sm:text-xl"
                  />
                </div>

                {showSuggestions && suggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 rounded-[1.4rem] border border-[#e5d9c8] bg-white p-2 shadow-[0_18px_40px_rgba(92,63,36,0.14)]">
                    <ul className="flex flex-col gap-1">
                      {suggestions.map((city) => (
                        <li key={city.slug}>
                          <button
                            type="button"
                            onMouseDown={() => handleSuggestionClick(city)}
                            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-[#3b291d] transition hover:bg-[#faf4eb]"
                          >
                            <span>{city.label}</span>
                            <span className="text-[#9b836d]">→</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[1.35rem] bg-[#b7d36b] px-6 text-base font-semibold text-[#1f1b15] shadow-[0_14px_30px_rgba(127,158,53,0.18)] transition hover:-translate-y-0.5 hover:bg-[#a9c55f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f9e35] lg:min-w-[180px]"
              >
                Zoek evenementen
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d5b33]">
                Snelle start
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {featuredCities.map((city) => (
                  <Link
                    key={city.label}
                    href={`/ontdek?city=${city.slug}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ddd0bd] bg-white px-4 py-2 text-sm font-medium text-[#5f4d3e] transition hover:-translate-y-0.5 hover:border-[#bb8b58] hover:bg-[#fff7ec] hover:text-[#3b291d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb8b58]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#b97a40]"
                      aria-hidden="true"
                    />
                    {city.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/ontdek"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#6e5a49] transition hover:text-[#3b291d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb8b58]"
            >
              Liever eerst rustig bladeren?
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
