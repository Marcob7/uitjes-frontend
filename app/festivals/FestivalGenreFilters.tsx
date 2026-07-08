"use client";

import { useEffect, useId, useRef, useState } from "react";

export const FESTIVAL_GENRES = [
  { value: "all", label: "Alle genres" },
  { value: "techno", label: "Techno" },
  { value: "jazz", label: "Jazz" },
  { value: "culinair", label: "Culinair" },
  { value: "kunst", label: "Kunst" },
] as const;

export type FestivalGenreFilter = (typeof FESTIVAL_GENRES)[number]["value"];

export const DEFAULT_FESTIVAL_GENRE: FestivalGenreFilter = "all";

type FestivalGenreFiltersProps = {
  activeGenre: FestivalGenreFilter;
  onChange: (genre: FestivalGenreFilter) => void;
};

function getGenreLabel(genreValue: FestivalGenreFilter) {
  return (
    FESTIVAL_GENRES.find((genre) => genre.value === genreValue)?.label ??
    "Alle genres"
  );
}

export function matchesFestivalGenre(
  genres: readonly string[],
  activeGenre: FestivalGenreFilter
) {
  if (activeGenre === DEFAULT_FESTIVAL_GENRE) return true;

  return genres.includes(getGenreLabel(activeGenre));
}

function FilterIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.25h11M4.75 8h6.5M6.5 11.75h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FestivalGenreFilters({
  activeGenre,
  onChange,
}: FestivalGenreFiltersProps) {
  const dialogId = useId();
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftGenre, setDraftGenre] =
    useState<FestivalGenreFilter>(activeGenre);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeFilterCount = activeGenre === DEFAULT_FESTIVAL_GENRE ? 0 : 1;
  const activeGenreLabel = getGenreLabel(activeGenre);

  useEffect(() => {
    if (!filterOpen) {
      setDraftGenre(activeGenre);
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeFilters();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeGenre, filterOpen]);

  function closeFilters() {
    setFilterOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function applyFilters() {
    onChange(draftGenre);
    closeFilters();
  }

  function clearFilters() {
    setDraftGenre(DEFAULT_FESTIVAL_GENRE);
    onChange(DEFAULT_FESTIVAL_GENRE);
    closeFilters();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={filterOpen}
        aria-controls={filterOpen ? dialogId : undefined}
        onClick={() => setFilterOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/24 bg-white/16 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(3,10,14,0.16)] backdrop-blur-xl transition hover:bg-white/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] active:scale-[0.98]"
      >
        <FilterIcon />
        <span>
          Filters
          {activeFilterCount > 0 ? (
            <span className="hidden sm:inline"> · {activeGenreLabel}</span>
          ) : null}
        </span>
        {activeFilterCount > 0 ? (
          <span
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e8f2d0] px-1.5 text-[11px] font-bold text-[#324d17]"
            aria-label="1 actief filter"
          >
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {filterOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Filtervenster sluiten"
            className="absolute inset-0 bg-[#171511]/48 backdrop-blur-sm"
            onClick={closeFilters}
          />
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[1.55rem] border border-[#efe4d4] bg-[#fffaf3] p-4 text-[#171511] shadow-[0_26px_80px_rgba(23,21,17,0.24)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id={`${dialogId}-title`}
                className="text-lg font-semibold tracking-[-0.03em]"
              >
                Filters
              </h2>
              <button
                type="button"
                onClick={closeFilters}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ded4c7] bg-white text-[#3f362f] transition hover:bg-[#f8f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
                aria-label="Filters sluiten"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Genre">
              {FESTIVAL_GENRES.map((genre) => {
                const active = draftGenre === genre.value;

                return (
                  <label
                    key={genre.value}
                    className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-[#9cc84e] bg-[#e8f2d0] text-[#324d17] shadow-[inset_0_0_0_1px_rgba(63,94,31,0.08)]"
                        : "border-[#e6dfd3] bg-white text-[#3f362f] hover:border-[#d7cfbf] hover:bg-[#f8f5f3]"
                    }`}
                  >
                    <span>{genre.label}</span>
                    <input
                      type="radio"
                      name="festival-genre"
                      value={genre.value}
                      checked={active}
                      onChange={() => setDraftGenre(genre.value)}
                      className="h-4 w-4 accent-[#5f7f2b]"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={applyFilters}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#171511] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(23,21,17,0.18)] transition hover:bg-[#2b271f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                Toepassen
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d7cfbf] bg-white px-5 text-sm font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                Wissen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
