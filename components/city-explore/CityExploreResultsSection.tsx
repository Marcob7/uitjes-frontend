"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, RefObject } from "react";

import ExploreCardItem from "./ExploreCardItem";
import CityExploreMapSection from "./CityExploreMapSection";
import type {
  ExploreCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
  ResultFilterKey,
} from "./types";
import { RESULT_FILTER_OPTIONS } from "./utils";

const INITIAL_VISIBLE_RESULTS = 6;
const RESULTS_INCREMENT = 6;

type CityExploreResultsSectionProps = {
  cityLabel: string;
  filteredCards: ExploreCard[];
  selectedId: number | null;
  onSelectCard: (id: number) => void;
  sectionRef: RefObject<HTMLElement | null>;
  plannerSelections: PlannerSelections;
  completedStepCount: number;
  onEditSelection: (step: number) => void;
  resultFilters: ResultFilterKey[];
  onToggleResultFilter: (filter: ResultFilterKey) => void;
  onClearResultFilters: () => void;
  onClearAllFilters: () => void;
};

type ActiveFilter = {
  id: string;
  label: string;
  tone: string;
  icon: (props: { className?: string }) => ReactElement;
  editStep?: number;
};

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.75v3" />
      <path d="M17 3.75v3" />
      <rect x="4" y="6.75" width="16" height="13" rx="2.5" />
      <path d="M4 10.75h16" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 20.1 4.76 12.9a4.9 4.9 0 0 1 6.92-6.93L12 6.3l.32-.33a4.9 4.9 0 1 1 6.92 6.93L12 20.1Z" />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.65 4.35L18 9l-4.35 1.65L12 15l-1.65-4.35L6 9l4.35-1.65L12 3Z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function getCompanionLabel(value: PlannerCompanion) {
  switch (value) {
    case "solo":
      return "Solo";
    case "gezin":
      return "Gezin";
    case "vrienden":
      return "Vrienden";
    default:
      return "Date";
  }
}

function getMomentLabel(value: PlannerMoment) {
  switch (value) {
    case "nu":
      return "Nu";
    case "vanavond":
      return "Vanavond";
    case "morgen":
      return "Morgen";
    default:
      return "Dit weekend";
  }
}

function getVibeLabel(value: PlannerVibe) {
  switch (value) {
    case "cultureel":
      return "Cultureel";
    case "actief":
      return "Actief";
    case "relaxed":
      return "Relaxed";
    default:
      return "Eten & drinken";
  }
}

function buildActiveFilters(
  cityLabel: string,
  plannerSelections: PlannerSelections,
  completedStepCount: number
) {
  const filters: ActiveFilter[] = [
    {
      id: "city",
      label: cityLabel,
      tone: "border-[#d8cbbd] bg-white/68 text-[#4b3a28] shadow-[0_10px_24px_rgba(83,65,45,0.07)] backdrop-blur-md",
      icon: PinIcon,
    },
  ];

  if (completedStepCount >= 1) {
    filters.unshift({
      id: "companion",
      label: getCompanionLabel(plannerSelections.companion),
      tone: "border-[#e5b7aa]/70 bg-[rgba(246,217,210,0.48)] text-[#4b241f] shadow-[0_10px_24px_rgba(154,80,62,0.08)] backdrop-blur-md",
      icon: HeartIcon,
      editStep: 1,
    });
  }

  if (completedStepCount >= 2) {
    filters.unshift({
      id: "moment",
      label: getMomentLabel(plannerSelections.moment),
      tone: "border-[#a7cdb4]/70 bg-[rgba(223,240,214,0.52)] text-[#243f2b] shadow-[0_10px_24px_rgba(57,111,72,0.08)] backdrop-blur-md",
      icon: CalendarIcon,
      editStep: 2,
    });
  }

  if (completedStepCount >= 3) {
    filters.unshift({
      id: "vibe",
      label: getVibeLabel(plannerSelections.vibe),
      tone: "border-[#e2c47d]/70 bg-[rgba(247,231,200,0.56)] text-[#4b3718] shadow-[0_10px_24px_rgba(139,98,26,0.08)] backdrop-blur-md",
      icon: SparkIcon,
      editStep: 3,
    });
  }

  return filters;
}

export default function CityExploreResultsSection({
  cityLabel,
  filteredCards,
  selectedId,
  onSelectCard,
  sectionRef,
  plannerSelections,
  completedStepCount,
  onEditSelection,
  resultFilters,
  onToggleResultFilter,
  onClearResultFilters,
  onClearAllFilters,
}: CityExploreResultsSectionProps) {
  const [visibleState, setVisibleState] = useState({
    count: INITIAL_VISIBLE_RESULTS,
    resultSetKey: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const [draftResultFilters, setDraftResultFilters] =
    useState<ResultFilterKey[]>(resultFilters);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeFilters = buildActiveFilters(
    cityLabel,
    plannerSelections,
    completedStepCount
  );
  const hasNoResults = filteredCards.length === 0;
  const resultSetKey = useMemo(
    () => `${cityLabel}:${filteredCards.map((card) => card.id).join(",")}`,
    [cityLabel, filteredCards]
  );
  const visibleCount =
    visibleState.resultSetKey === resultSetKey
      ? visibleState.count
      : INITIAL_VISIBLE_RESULTS;
  const displayedCards = filteredCards.slice(0, visibleCount);
  const visibleResultCount = displayedCards.length;
  const hasMoreResults = visibleResultCount < filteredCards.length;
  const hasExpandableResults = filteredCards.length > INITIAL_VISIBLE_RESULTS;
  const hasResultFilters = resultFilters.length > 0;
  const hasPlannerFilters = completedStepCount > 0;
  const hasActiveFilters = hasResultFilters || hasPlannerFilters;
  const filterModalId = "explore-filter-modal";
  const filterTitleId = "explore-filter-title";
  const resultsLabel =
    filteredCards.length === 1
      ? "1 resultaat"
      : `${filteredCards.length} resultaten`;
  const selectionLabels = activeFilters
    .filter((filter) => filter.id !== "city")
    .map((filter) => filter.label);

  useEffect(() => {
    setVisibleState((current) => {
      if (current.resultSetKey === resultSetKey) {
        return current;
      }

      return {
        count: INITIAL_VISIBLE_RESULTS,
        resultSetKey,
      };
    });
  }, [resultSetKey]);

  useEffect(() => {
    if (!isFilterModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterModalOpen]);

  useEffect(() => {
    if (!isMobileMapOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMapOpen]);

  useEffect(() => {
    if (!isFilterModalOpen) {
      setDraftResultFilters(resultFilters);
    }
  }, [isFilterModalOpen, resultFilters]);

  function handleShowMoreResults() {
    setVisibleState((current) => {
      const currentCount =
        current.resultSetKey === resultSetKey
          ? current.count
          : INITIAL_VISIBLE_RESULTS;

      return {
        count: Math.min(currentCount + RESULTS_INCREMENT, filteredCards.length),
        resultSetKey,
      };
    });
  }

  function openFilters() {
    setDraftResultFilters(resultFilters);
    setIsFilterModalOpen(true);
  }

  function closeFilters() {
    setIsFilterModalOpen(false);
    window.setTimeout(() => {
      filterButtonRef.current?.focus();
    }, 0);
  }

  function handleDraftFilterToggle(filter: ResultFilterKey) {
    setDraftResultFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  }

  function applyFilters() {
    draftResultFilters.forEach((filter) => {
      if (!resultFilters.includes(filter)) {
        onToggleResultFilter(filter);
      }
    });

    resultFilters.forEach((filter) => {
      if (!draftResultFilters.includes(filter)) {
        onToggleResultFilter(filter);
      }
    });

    closeFilters();
  }

  function clearFilters() {
    setDraftResultFilters([]);
    onClearResultFilters();
  }

  function handleFilterModalKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closeFilters();
    }
  }

  return (
    <section ref={sectionRef} className="relative mt-3 scroll-mt-32 bg-[#F6F5F0] sm:mt-4 lg:scroll-mt-48">
      <div className="mx-auto max-w-[1800px] px-4 pb-20 pt-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 border-b border-[#DCE1DC] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              id="explore-results-heading"
              tabIndex={-1}
              className="text-[clamp(2.25rem,3.2vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#29342F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC]"
            >
              Uitjes in {cityLabel}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#65736C] sm:text-base">
              {resultsLabel}
              {selectionLabels.length ? ` · ${selectionLabels.join(" · ")}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => onEditSelection(1)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DCE1DC] bg-white px-5 py-2.5 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              Keuzes aanpassen
            </button>
            <button
              ref={filterButtonRef}
              type="button"
              onClick={openFilters}
              aria-expanded={isFilterModalOpen}
              aria-controls={filterModalId}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] ${
                hasResultFilters
                  ? "border-[#9DBAAE] bg-[#DDEBE2] text-[#1D5A46] hover:bg-[#EAF2EC]"
                  : "border-[#DCE1DC] bg-white text-[#355E7A] hover:border-[#355E7A]"
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
              {hasResultFilters ? (
                <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1D5A46] px-1.5 text-xs font-bold text-white">
                  {resultFilters.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMapOpen(true)}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#9DBAAE] bg-[#DDEBE2] px-5 py-2.5 text-sm font-semibold text-[#1D5A46] lg:hidden"
        >
          <PinIcon className="h-4 w-4" /> Kaart bekijken
        </button>

        {isFilterModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleFilterModalKeyDown}
          >
            <button
              type="button"
              aria-label="Filtervenster sluiten"
              className="absolute inset-0 bg-black/40"
              onClick={closeFilters}
            />

            <div
              id={filterModalId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={filterTitleId}
              className="relative z-10 w-full max-w-md overflow-y-auto rounded-3xl border border-[#dfd4c6] bg-[#fffaf2] p-5 text-[#171511] shadow-xl sm:p-6"
              style={{ maxHeight: "calc(100dvh - 2rem)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    id={filterTitleId}
                    className="text-2xl font-semibold leading-none tracking-[-0.03em] text-[#171511]"
                  >
                    Filters
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#665d54]">
                    Verfijn de resultaten voor {cityLabel}.
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeFilters}
                  aria-label="Filtervenster sluiten"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dfd4c6] bg-white/72 text-[#4b3a28] shadow-[0_10px_22px_rgba(83,65,45,0.08)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449]"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <fieldset className="mt-6 space-y-3">
                <legend className="text-sm font-semibold text-[#4b3a28]">
                  Filteropties
                </legend>
                {RESULT_FILTER_OPTIONS.map((filter) => {
                  const checked = draftResultFilters.includes(filter.id);

                  return (
                    <label
                      key={filter.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left shadow-[0_10px_22px_rgba(83,65,45,0.05)] transition ${
                        checked
                          ? "border-[#b8df71] bg-[#e8f6cf] text-[#344125]"
                          : "border-[#dfd4c6] bg-white/68 text-[#4b3a28] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleDraftFilterToggle(filter.id)}
                        className="mt-1 h-4 w-4 rounded border-[#b8aa98] accent-[#405028] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449]"
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <span>{filter.label}</span>
                          {checked ? (
                            <span className="rounded-full bg-[#405028] px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">
                              Actief
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#665d54]">
                          {filter.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d6c9b8] bg-white/68 px-5 py-2.5 text-sm font-semibold text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
                >
                  Wissen
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#cfe2a6] bg-[#e8f2d0] px-5 py-2.5 text-sm font-semibold text-[#162016] shadow-[0_12px_28px_rgba(109,144,51,0.12)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
                >
                  Toepassen
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1.18fr)_minmax(470px,0.82fr)] lg:items-start lg:gap-8 xl:gap-10">
          <div>
            <div className="grid gap-5 border-y border-[#DCE1DC] py-5 sm:grid-cols-2">
              {displayedCards.map((card) => (
                <ExploreCardItem
                  key={card.id}
                  card={card}
                  isSelected={selectedId === card.id}
                  onSelect={() => onSelectCard(card.id)}
                  variant="flow"
                />
              ))}
            </div>

        {hasExpandableResults && !hasNoResults ? (
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#786d63]">
              {visibleResultCount} van {filteredCards.length} resultaten
            </p>
            {hasMoreResults ? (
              <button
                type="button"
                onClick={handleShowMoreResults}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#d6c9b8] bg-white/68 px-4 py-2.5 text-sm font-medium text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:w-auto"
              >
                Meer resultaten tonen
              </button>
            ) : (
              <p className="text-sm font-medium text-[#786d63]">
                Alle resultaten getoond
              </p>
            )}
          </div>
        ) : null}

        {hasNoResults ? (
          <div className="mt-8 rounded-[2rem] border border-[#d5e1bd] bg-white/78 p-6 text-[#171511] shadow-[0_18px_42px_rgba(75,92,52,0.08)] backdrop-blur-xl sm:p-8">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#667b36]">
              Geen directe matches
            </div>
            <h3 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#171511]">
              {hasActiveFilters
                ? `Geen resultaten gevonden in ${cityLabel} met deze filters`
                : `Geen resultaten gevonden in ${cityLabel}`}
            </h3>
            <p className="mt-3 max-w-[40rem] text-sm leading-7 text-[#665d54] sm:text-base">
              {hasActiveFilters
                ? `Pas je filters aan of bekijk alle resultaten in ${cityLabel}.`
                : `Kies een andere stad of probeer later opnieuw voor ${cityLabel}.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#cfe2a6] bg-[#e8f2d0] px-5 py-2.5 text-sm font-semibold text-[#162016] shadow-[0_12px_28px_rgba(109,144,51,0.12)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
                >
                  Bekijk alle resultaten in {cityLabel}
                </button>
              ) : null}
              <a
                href="/ontdek"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d6c9b8] bg-white/68 px-5 py-2.5 text-sm font-semibold text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
              >
                Kies een andere stad
              </a>
            </div>
          </div>
        ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-40 h-[min(760px,calc(100dvh-10rem))] min-h-[560px]">
              <CityExploreMapSection
                cityLabel={cityLabel}
                events={filteredCards}
                selectedId={selectedId}
                setSelectedId={onSelectCard}
                layout="embedded"
                fullHeight
              />
            </div>
          </aside>
        </div>

        {isMobileMapOpen ? (
          <div className="fixed inset-0 z-50 bg-[#F6F5F0] p-3 lg:hidden" role="dialog" aria-modal="true" aria-label={`Kaart van ${cityLabel}`}>
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-[#29342F]">{cityLabel} op de kaart</h2>
              <button type="button" onClick={() => setIsMobileMapOpen(false)} className="inline-flex min-h-11 items-center rounded-full border border-[#DCE1DC] bg-white px-4 text-sm font-semibold text-[#355E7A]">Lijst bekijken</button>
            </div>
            <div className="h-[calc(100dvh-5.25rem)]">
              <CityExploreMapSection cityLabel={cityLabel} events={filteredCards} selectedId={selectedId} setSelectedId={(id) => { onSelectCard(id); }} layout="embedded" fullHeight />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
