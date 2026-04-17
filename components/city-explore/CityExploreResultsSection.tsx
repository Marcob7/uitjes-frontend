"use client";

import type { RefObject } from "react";

import CityExploreAlternativesSection from "./CityExploreAlternativesSection";
import ExploreCardItem from "./ExploreCardItem";
import type {
  ExploreCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";

type CityExploreResultsSectionProps = {
  cityLabel: string;
  filteredCards: ExploreCard[];
  selectedId: number | null;
  onSelectCard: (id: number) => void;
  sectionRef: RefObject<HTMLElement | null>;
  plannerSelections: PlannerSelections;
  completedStepCount: number;
};

const LOW_RESULTS_THRESHOLD = 2;

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
  const filters = [
    {
      id: "city",
      label: cityLabel,
      tone: "bg-[#ececf6] text-[#2b2f40]",
      icon: PinIcon,
    },
  ];

  if (completedStepCount >= 1) {
    filters.unshift({
      id: "companion",
      label: getCompanionLabel(plannerSelections.companion),
      tone: "bg-[#f7d8d3] text-[#3a2622]",
      icon: HeartIcon,
    });
  }

  if (completedStepCount >= 2) {
    filters.unshift({
      id: "moment",
      label: getMomentLabel(plannerSelections.moment),
      tone: "bg-[#dff0d6] text-[#23311d]",
      icon: CalendarIcon,
    });
  }

  if (completedStepCount >= 3) {
    filters.unshift({
      id: "vibe",
      label: getVibeLabel(plannerSelections.vibe),
      tone: "bg-[#f6e8bf] text-[#3c2f16]",
      icon: SparkIcon,
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
}: CityExploreResultsSectionProps) {
  const activeFilters = buildActiveFilters(
    cityLabel,
    plannerSelections,
    completedStepCount
  );
  const hasNoResults = filteredCards.length === 0;
  const hasFewResults =
    filteredCards.length > 0 && filteredCards.length <= LOW_RESULTS_THRESHOLD;

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="mx-auto max-w-[1220px] px-6 pb-8 pt-12 sm:px-8 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="flex flex-wrap items-center gap-3">
          {activeFilters.map((filter) => {
            const Icon = filter.icon;

            return (
              <div
                key={filter.id}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${filter.tone}`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mt-8 text-[clamp(1.9rem,3vw,2.8rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#151515]">
              Top matches
            </h3>
            <p className="mt-3 max-w-[36rem] text-sm leading-7 text-[#605347] sm:text-base">
              {completedStepCount === 0
                ? `Start hierboven met je eerste keuze en we verfijnen de resultaten voor ${cityLabel} stap voor stap.`
                : `${filteredCards.length} locaties gevonden op basis van jullie gekozen moment, sfeer en stad.`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f0eb] px-4 py-2.5 text-sm font-medium text-[#50443b]"
            >
              <FilterIcon className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f0eb] px-4 py-2.5 text-sm font-medium text-[#50443b]"
            >
              <span>Sorteren op match</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {hasNoResults ? null : (
            filteredCards.map((card, index) => (
              <ExploreCardItem
                key={card.id}
                card={card}
                index={index}
                isSelected={selectedId === card.id}
                onSelect={() => onSelectCard(card.id)}
              />
            ))
          )}
        </div>

        {hasNoResults ? (
          <CityExploreAlternativesSection
            cityLabel={cityLabel}
            plannerSelections={plannerSelections}
            scarcity="none"
          />
        ) : null}

        {hasFewResults ? (
          <CityExploreAlternativesSection
            cityLabel={cityLabel}
            plannerSelections={plannerSelections}
            scarcity="few"
          />
        ) : null}
      </div>
    </section>
  );
}
