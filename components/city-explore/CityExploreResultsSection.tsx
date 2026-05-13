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
      tone: "border-white/18 bg-white/12 text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md",
      icon: PinIcon,
    },
  ];

  if (completedStepCount >= 1) {
    filters.unshift({
      id: "companion",
      label: getCompanionLabel(plannerSelections.companion),
      tone: "border-white/18 bg-[rgba(246,217,210,0.22)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md",
      icon: HeartIcon,
      editStep: 1,
    });
  }

  if (completedStepCount >= 2) {
    filters.unshift({
      id: "moment",
      label: getMomentLabel(plannerSelections.moment),
      tone: "border-white/18 bg-[rgba(223,240,214,0.22)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md",
      icon: CalendarIcon,
      editStep: 2,
    });
  }

  if (completedStepCount >= 3) {
    filters.unshift({
      id: "vibe",
      label: getVibeLabel(plannerSelections.vibe),
      tone: "border-white/18 bg-[rgba(246,232,191,0.22)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md",
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
      className="relative scroll-mt-6 border-b border-white/10 bg-transparent"
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[rgba(198,223,154,0.14)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[rgba(122,213,217,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />

      <div className="relative mx-auto max-w-[1220px] px-6 pb-8 pt-12 sm:px-8 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="rounded-[2.2rem] border border-white/16 bg-white/10 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-7">
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
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] ${filter.tone}`}
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

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#e8f2d0]/40 bg-[#e8f2d0]/18 px-4 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[#f1f7df] shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md">
                {resultsLabel}
              </div>
              <h3 className="mt-4 text-[clamp(2.2rem,3.6vw,3.3rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">
                Resultaten voor jullie moment
              </h3>
              <p className="mt-3 max-w-[36rem] text-sm leading-7 text-white/76 sm:text-base">
                {completedStepCount === 0
                  ? `Start hierboven met je eerste keuze en we verfijnen de resultaten voor ${cityLabel} stap voor stap.`
                  : `${filteredCards.length} locaties gevonden op basis van jullie gekozen moment, sfeer en stad.`}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-0">
              <button
                type="button"
                onClick={onClearResultFilters}
                disabled={!hasResultFilters}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] ${
                  hasResultFilters
                    ? "border-[#e8f2d0]/34 bg-[#e8f2d0]/18 text-white hover:-translate-y-0.5 hover:bg-[#e8f2d0]/24"
                    : "cursor-default border-white/16 bg-white/10 text-white/72"
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
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] ${
                      active
                        ? "border-[#e8f2d0]/44 bg-[#e8f2d0]/24 text-white"
                        : "border-white/16 bg-white/10 text-white hover:bg-white/14"
                    }`}
                  >
                    <span>{filter.label}</span>
                  </button>
                );
              })}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/72 shadow-[0_12px_28px_rgba(0,0,0,0.1)] backdrop-blur-md">
                <span>Sorteren op match</span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
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
            <p className="text-sm font-medium text-white/72">
              {visibleResultCount} van {filteredCards.length} resultaten
            </p>
            {hasMoreResults ? (
              <button
                type="button"
                onClick={handleShowMoreResults}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/16 bg-white/10 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:w-auto"
              >
                Meer resultaten tonen
              </button>
            ) : (
              <p className="text-sm font-medium text-white/72">
                Alle resultaten getoond
              </p>
            )}
          </div>
        ) : null}

        {hasNoResults ? (
          <div className="mt-8 rounded-[2rem] border border-white/16 bg-white/10 p-6 text-white shadow-[0_22px_48px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:p-8">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#e8f2d0]">
              Geen directe matches
            </div>
            <h3 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
              Geen resultaten voor deze combinatie
            </h3>
            <p className="mt-3 max-w-[40rem] text-sm leading-7 text-white/74 sm:text-base">
              Pas hierboven je moment, gezelschap of sfeer aan om opnieuw te zoeken
              in {cityLabel}.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
