"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalHero from "@/components/FestivalHero";
import FestivalGenreFilters, {
  DEFAULT_FESTIVAL_GENRE,
  matchesFestivalGenre,
  type FestivalGenreFilter,
} from "../FestivalGenreFilters";
import {
  festivalOverviewItems,
  getFestivalDetailHref,
  type FestivalIcon,
} from "../data";

type FestivalsPageProps = {
  searchParams?: {
    query?: string;
  };
};

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m14.583 14.584 3.334 3.333M16.25 9.167a7.083 7.083 0 1 1-14.167 0 7.083 7.083 0 0 1 14.167 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FestivalGlyph({ icon }: { icon: FestivalIcon }) {
  if (icon === "fork") {
    return (
      <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M12 6v10M9 6v6M15 6v6M12 16v10M22 6v20M22 6c2.6 0 4 1.7 4 4.4 0 2.5-1.2 4.1-4 5.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "crown") {
    return (
      <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M7 23h18M9 23l2.5-10L16 17l4.5-4L23 23M11 10.5h.01M16 8.5h.01M21 10.5h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M10 22V10M16 26V6M22 20V12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FestivalCard({
  festival,
}: {
  festival: (typeof festivalOverviewItems)[number];
}) {
  return (
    <article className="group rounded-[1.9rem] border border-white/70 bg-white/58 px-4 py-4 text-[#171511] shadow-[0_18px_44px_rgba(66,49,31,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/72 hover:shadow-[0_24px_54px_rgba(66,49,31,0.12)] sm:px-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex min-w-0 items-start gap-4 md:flex-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] border border-[#e6dfd3] bg-[#fffaf3] text-[#7a7065] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] transition group-hover:border-[#ded4c7] group-hover:bg-white">
            <FestivalGlyph icon={festival.icon} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7e7366]">
              {festival.dateLabel}
            </p>
            <h2 className="mt-2 max-w-none text-[clamp(1.8rem,3vw,2.25rem)] leading-[0.98] tracking-[-0.055em] text-[#171511]">
              {festival.name}
            </h2>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#e6dfd3] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <Link
            href={getFestivalDetailHref(festival.slug)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ded4c7] bg-[#fffaf3] text-[#3f362f] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] sm:rounded-full"
            aria-label={`Open ${festival.name}`}
          >
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

function getFestivalSearchTerms(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  const terms = [normalizedQuery];

  if (normalizedQuery.includes("food")) terms.push("culinair");
  if (normalizedQuery.includes("muziek")) {
    terms.push("music", "jazz", "techno", "electronic", "multi-genre");
  }

  const withoutFestival = normalizedQuery
    .replace(/muziekfestival/g, "")
    .replace(/food festival/g, "food")
    .replace(/festivals?/g, "")
    .trim();

  if (withoutFestival) terms.push(withoutFestival);

  return Array.from(new Set(terms));
}

export default function FestivalsPage({ searchParams }: FestivalsPageProps) {
  const [query, setQuery] = useState(searchParams?.query ?? "");
  const [activeGenre, setActiveGenre] =
    useState<FestivalGenreFilter>(DEFAULT_FESTIVAL_GENRE);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredFestivals = useMemo(() => {
    const searchTerms = getFestivalSearchTerms(deferredQuery);
    const isGenericFestivalSearch =
      deferredQuery.includes("festival") && searchTerms.length === 1;

    return (
      festivalOverviewItems.filter((festival) => {
        const matchesGenre = matchesFestivalGenre(festival.genres, activeGenre);

        const searchableFestival = [
          festival.name,
          festival.locationLabel,
          festival.vibe,
          ...festival.genres,
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          deferredQuery.length === 0 ||
          isGenericFestivalSearch ||
          searchTerms.some((term) => searchableFestival.includes(term));

        return matchesGenre && matchesQuery;
      })
    );
  }, [activeGenre, deferredQuery]);

  function scrollToResults() {
    document.getElementById("festival-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Lijst" },
          ]}
          className="mb-6"
        />

        <FestivalHero
          eyebrow="Festivalzoeker"
          title="Vind je match"
          description={
            <>
              Een minimalistische gids naar festivals die resoneren met jouw
              energie. Gefilterd op kwaliteit, niet op volume.
            </>
          }
          search={
            <div className="rounded-[1.6rem] border border-white/18 bg-white/12 p-2 shadow-[0_24px_60px_rgba(3,10,14,0.18)] backdrop-blur-xl sm:rounded-full">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label
                  htmlFor="festival-search"
                className="flex min-h-12 flex-1 items-center gap-3 rounded-[1.1rem] px-4 text-white/86 sm:rounded-full"
                >
                  <SearchIcon />
                  <input
                    id="festival-search"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Zoek op genre, stad of vibe..."
                    className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/76 focus-visible:ring-2 focus-visible:ring-[#e8f2d0] sm:text-sm"
                  />
                </label>

                <button
                  type="button"
                  onClick={scrollToResults}
                  className="inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-[#e8f2d0]/65 bg-[#e8f2d0] px-6 text-sm font-semibold text-[#162016] shadow-[0_18px_36px_rgba(12,20,12,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full"
                >
                  Zoek
                </button>
              </div>
            </div>
          }
          filters={
            <FestivalGenreFilters
              activeGenre={activeGenre}
              onChange={setActiveGenre}
            />
          }
        />
        <section id="festival-results" className="py-8 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Selectie
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                Festivals voor jou
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {filteredFestivals.map((festival) => (
              <FestivalCard key={festival.slug} festival={festival} />
            ))}
          </div>

          {filteredFestivals.length === 0 ? (
            <div className="mt-4 rounded-[1.9rem] border border-[#e6dfd3] bg-white/72 px-6 py-10 text-center shadow-[0_18px_36px_rgba(45,37,28,0.06)] backdrop-blur-xl">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                {query.trim()
                  ? `Geen festivals gevonden voor "${query.trim()}"`
                  : "Geen festivals gevonden"}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5145]">
                Probeer een andere festivalzoekterm of open een bredere
                festivalweergave.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveGenre(DEFAULT_FESTIVAL_GENRE);
                    setQuery("");
                  }}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Bekijk alle festivals
                </button>
                <Link
                  href="/festivals/kalender"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Open festivalkalender
                </Link>
                <Link
                  href="/festivals/kalender"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Open festivalkalender
                </Link>
              </div>
            </div>
          ) : null}
        </section>

      </div>
    </main>
  );
}
