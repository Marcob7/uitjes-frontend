"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, RefObject } from "react";

import DiscoverResultsList from "./DiscoverResultsList";
import DiscoverResultsEmptyState from "./DiscoverResultsEmptyState";
import DiscoverResultsFilterDialog from "./DiscoverResultsFilterDialog";
import DiscoverResultsMap from "./DiscoverResultsMap";
import DiscoverResultsMobileMapDialog from "./DiscoverResultsMobileMapDialog";
import DiscoverResultsPagination from "./DiscoverResultsPagination";
import DiscoverResultsToolbar from "./DiscoverResultsToolbar";
import type {
  ExploreCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
  ResultFilterKey,
} from "./types";
import type { DiscoverView } from "./discoverUrl";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";

const INITIAL_VISIBLE_RESULTS = 6;
const RESULTS_INCREMENT = 6;

type CityExploreResultsSectionProps = {
  cityLabel: string;
  filteredCards: ExploreCard[];
  selectedId: number | null;
  onSelectCard: (id: number) => void;
  onMapSelectCard?: (id: number) => void;
  sectionRef: RefObject<HTMLElement | null>;
  plannerSelections?: PlannerSelections;
  completedStepCount?: number;
  selectionLabels?: string[];
  hasPlannerSelections?: boolean;
  isLoading?: boolean;
  onEditSelection: (step: number) => void;
  resultFilters: ResultFilterKey[];
  onToggleResultFilter: (filter: ResultFilterKey) => void;
  onClearResultFilters: () => void;
  onClearAllFilters: () => void;
  view?: DiscoverView;
  onViewChange?: (view: DiscoverView) => void;
  getDetailHref?: (href: string) => string;
};

type ActiveFilter = {
  id: string;
  label: string;
  tone: string;
  icon: (props: { className?: string }) => ReactElement;
  editStep?: number;
};

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

function getCompanionLabel(value: PlannerCompanion, t: (key: string) => string) {
  switch (value) {
    case "solo":
      return t("discover.solo");
    case "gezin":
      return t("discover.family");
    case "vrienden":
      return t("discover.friends");
    default:
      return t("discover.date");
  }
}

function getMomentLabel(value: PlannerMoment, t: (key: string) => string) {
  switch (value) {
    case "nu":
      return t("discover.now");
    case "vanavond":
      return t("discover.tonight");
    case "morgen":
      return t("discover.later");
    default:
      return t("discover.weekend");
  }
}

function getVibeLabel(value: PlannerVibe, t: (key: string) => string) {
  switch (value) {
    case "cultureel":
      return t("discover.culture");
    case "actief":
      return t("discover.active");
    case "relaxed":
      return t("discover.relaxed");
    default:
      return t("discover.foodDrink");
  }
}

function buildActiveFilters(
  cityLabel: string,
  plannerSelections: PlannerSelections,
  completedStepCount: number,
  t: (key: string) => string,
) {
  const filters: ActiveFilter[] = [
    {
      id: "city",
      label: cityLabel,
      tone: "border-[#d8cbbd] bg-white/68 text-[#4b3a28] shadow-[0_10px_24px_rgba(83,65,45,0.07)] backdrop-blur-md",
      icon: PinIcon,
    },
  ];

  if (completedStepCount >= 1 && plannerSelections.companion) {
    filters.unshift({
      id: "companion",
      label: getCompanionLabel(plannerSelections.companion, t),
      tone: "border-[#e5b7aa]/70 bg-[rgba(246,217,210,0.48)] text-[#4b241f] shadow-[0_10px_24px_rgba(154,80,62,0.08)] backdrop-blur-md",
      icon: HeartIcon,
      editStep: 1,
    });
  }

  if (completedStepCount >= 2 && plannerSelections.moment) {
    filters.unshift({
      id: "moment",
      label: getMomentLabel(plannerSelections.moment, t),
      tone: "border-[#a7cdb4]/70 bg-[rgba(223,240,214,0.52)] text-[#243f2b] shadow-[0_10px_24px_rgba(57,111,72,0.08)] backdrop-blur-md",
      icon: CalendarIcon,
      editStep: 2,
    });
  }

  if (completedStepCount >= 3 && plannerSelections.vibe) {
    filters.unshift({
      id: "vibe",
      label: getVibeLabel(plannerSelections.vibe, t),
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
  onMapSelectCard,
  sectionRef,
  plannerSelections = {} as PlannerSelections,
  completedStepCount = 0,
  selectionLabels: selectionLabelsOverride,
  hasPlannerSelections,
  isLoading = false,
  onEditSelection,
  resultFilters,
  onToggleResultFilter,
  onClearResultFilters,
  onClearAllFilters,
  view = "list",
  onViewChange,
  getDetailHref,
}: CityExploreResultsSectionProps) {
  const { locale, t } = useLocale();
  const [visibleState, setVisibleState] = useState({
    count: INITIAL_VISIBLE_RESULTS,
    resultSetKey: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [localView, setLocalView] = useState<DiscoverView>(view);
  const [draftResultFilters, setDraftResultFilters] =
    useState<ResultFilterKey[]>(resultFilters);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeFilters = buildActiveFilters(
    cityLabel,
    plannerSelections,
    completedStepCount,
    t,
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
  const contextualDisplayedCards = useMemo(
    () =>
      getDetailHref
        ? displayedCards.map((card) => ({ ...card, href: getDetailHref(card.href) }))
        : displayedCards,
    [displayedCards, getDetailHref]
  );
  const visibleResultCount = displayedCards.length;
  const hasMoreResults = visibleResultCount < filteredCards.length;
  const hasExpandableResults = filteredCards.length > INITIAL_VISIBLE_RESULTS;
  const hasResultFilters = resultFilters.length > 0;
  const hasPlannerFilters = hasPlannerSelections ?? completedStepCount > 0;
  const hasActiveFilters = hasResultFilters || hasPlannerFilters;
  const filterModalId = "explore-filter-modal";
  const filterTitleId = "explore-filter-title";
  const resultsLabel = filteredCards.length === 1
    ? t("discover.oneResult")
    : t("discover.resultCount", { count: filteredCards.length });
  const selectionLabels = selectionLabelsOverride ?? activeFilters
    .filter((filter) => filter.id !== "city")
    .map((filter) => filter.label);
  const isLoadingResults = isLoading && filteredCards.length === 0;

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
    setLocalView(view);
  }, [view]);

  const activeView = localView;
  const isMobileMapOpen = activeView === "map";

  function changeView(nextView: DiscoverView) {
    setLocalView(nextView);
    onViewChange?.(nextView);
  }

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

  return (
    <section ref={sectionRef} className="relative mt-3 scroll-mt-32 bg-[#F6F5F0] sm:mt-4 lg:scroll-mt-48">
      <div className="mx-auto max-w-[1800px] px-4 pb-20 pt-4 sm:px-6 lg:px-8 xl:px-10">
        <DiscoverResultsToolbar
          cityLabel={cityLabel}
          resultsLabel={resultsLabel}
          selectionLabels={selectionLabels}
          activeFilterCount={resultFilters.length}
          filterButtonRef={filterButtonRef}
          filterModalId={filterModalId}
          isFilterModalOpen={isFilterModalOpen}
          onEditChoices={() => onEditSelection(1)}
          onOpenFilters={openFilters}
          onOpenMap={() => changeView("map")}
        />

        <DiscoverResultsFilterDialog
          open={isFilterModalOpen}
          cityLabel={cityLabel}
          filters={draftResultFilters}
          dialogId={filterModalId}
          titleId={filterTitleId}
          onChange={handleDraftFilterToggle}
          onApply={applyFilters}
          onReset={clearFilters}
          onClose={closeFilters}
        />

        <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1.18fr)_minmax(470px,0.82fr)] lg:items-start lg:gap-8 xl:gap-10">
          <div>
            <DiscoverResultsList
              cards={contextualDisplayedCards}
              selectedId={selectedId}
              isLoading={isLoadingResults}
              onSelectCard={onSelectCard}
              loadingLabel={t("discover.loadingResults")}
            />

            {hasExpandableResults && !hasNoResults && !isLoadingResults ? (
              <DiscoverResultsPagination
                visibleResultCount={visibleResultCount}
                totalResultCount={filteredCards.length}
                hasMoreResults={hasMoreResults}
                onShowMore={handleShowMoreResults}
              />
            ) : null}

            {hasNoResults && !isLoadingResults ? (
              <DiscoverResultsEmptyState
                cityLabel={cityLabel}
                hasActiveFilters={hasActiveFilters}
                chooseCityHref={localePathname("/ontdek", locale)}
                onClearAllFilters={onClearAllFilters}
              />
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-40 h-[min(760px,calc(100dvh-10rem))] min-h-[560px]">
              <DiscoverResultsMap
                cityLabel={cityLabel}
                cards={contextualDisplayedCards}
                selectedId={selectedId}
                onSelectCard={onMapSelectCard ?? onSelectCard}
              />
            </div>
          </aside>
        </div>

        <DiscoverResultsMobileMapDialog
          open={isMobileMapOpen}
          cityLabel={cityLabel}
          cards={contextualDisplayedCards}
          selectedId={selectedId}
          onSelectCard={onMapSelectCard ?? onSelectCard}
          onBackToList={() => changeView("list")}
        />
      </div>
    </section>
  );
}
