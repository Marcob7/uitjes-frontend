"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactElement, RefObject } from "react";

import ExploreCardItem from "./ExploreCardItem";
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

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
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
  const resultsLabel =
    filteredCards.length === 1
      ? "1 match"
      : `${filteredCards.length} matches`;

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

  return (
    <section
      ref={sectionRef}
      className="relative mt-2 scroll-mt-6 overflow-hidden bg-transparent sm:mt-4"
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[rgba(236,227,214,0.72)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-[rgba(221,238,194,0.58)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[rgba(247,231,200,0.46)] blur-3xl" />

      <div className="relative mx-auto max-w-[1240px] px-4 pb-12 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {activeFilters.map((filter) => {
            const Icon = filter.icon;
            const editStep = filter.editStep;

            if (editStep) {
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onEditSelection(editStep)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/82 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] ${filter.tone}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.label}</span>
                </button>
              );
            }

            return (
              <div
                key={filter.id}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium ${filter.tone}`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-5 border-b border-[#ded2c4]/70 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[#cfe2a6] bg-[#f5f9e9]/86 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#405028] shadow-[0_10px_24px_rgba(109,144,51,0.09)] backdrop-blur-md">
              {resultsLabel}
            </div>
            <h3 className="mt-4 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171511]">
              Resultaten voor {cityLabel}
            </h3>
            <p className="mt-3 max-w-[36rem] text-sm leading-6 text-[#665d54] sm:text-base">
              {completedStepCount === 0
                ? `Kies hierboven wat past en verfijn de selectie voor ${cityLabel} stap voor stap.`
                : `${filteredCards.length} locaties op basis van jullie moment, sfeer en stad.`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-0">
            <button
              type="button"
              onClick={onClearResultFilters}
              disabled={!hasResultFilters}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-[0_10px_24px_rgba(83,65,45,0.07)] backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] ${
                hasResultFilters
                  ? "border-[#cfe2a6] bg-[#f5f9e9]/86 text-[#405028] hover:-translate-y-0.5 hover:bg-white"
                  : "cursor-default border-[#dfd4c6] bg-white/58 text-[#796d62]"
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              <span>{hasResultFilters ? "Reset filters" : "Filter"}</span>
            </button>
            {RESULT_FILTER_OPTIONS.map((filter) => {
              const active = resultFilters.includes(filter.id);

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onToggleResultFilter(filter.id)}
                  aria-pressed={active}
                  title={filter.description}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-[0_10px_24px_rgba(83,65,45,0.07)] backdrop-blur-md transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] ${
                    active
                      ? "border-[#b8df71] bg-[#e8f6cf] text-[#344125]"
                      : "border-[#dfd4c6] bg-white/58 text-[#4b3a28] hover:bg-white"
                  }`}
                >
                  <span>{filter.label}</span>
                </button>
              );
            })}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfd4c6] bg-white/46 px-4 py-2.5 text-sm font-medium text-[#796d62] shadow-[0_10px_24px_rgba(83,65,45,0.06)] backdrop-blur-md">
              <span>Sorteren op match</span>
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {displayedCards.map((card, index) => (
            <ExploreCardItem
              key={card.id}
              card={card}
              index={index}
              isSelected={selectedId === card.id}
              onSelect={() => onSelectCard(card.id)}
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
          <div className="mt-8 rounded-[2rem] border border-[#dfd4c6] bg-white/64 p-6 text-[#171511] shadow-[0_18px_42px_rgba(83,65,45,0.08)] backdrop-blur-xl sm:p-8">
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
    </section>
  );
}
