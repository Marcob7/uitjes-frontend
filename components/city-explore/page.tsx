"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import DiscoverFlow from "./DiscoverFlow";
import CityExploreResultsSection from "./CityExploreResultsSection";
import type {
  CityExploreViewProps,
  PlannerSelections,
  ResultFilterKey,
} from "./types";
import {
  buildExploreCards,
  filterCardsByPlannerProgress,
  filterCardsByResultFilters,
  getEventsWithFallback,
  getSafeCityTheme,
} from "./utils";

// A new flow has no planner answers. Values are added only after a choice card
// is activated; the type remains shared with completed planner consumers.
const EMPTY_PLANNER_SELECTIONS = {} as PlannerSelections;

const PLANNER_STEP_COUNT = 3;

export default function CityExplorePage({
  city,
  events,
  useEventFallback = true,
  isGenericLanding = false,
}: CityExploreViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStepCount, setCompletedStepCount] = useState(0);
  const [isFlowOpen, setIsFlowOpen] = useState(true);
  const [plannerSelections, setPlannerSelections] = useState<PlannerSelections>(
    EMPTY_PLANNER_SELECTIONS
  );
  const [resultFilters, setResultFilters] = useState<ResultFilterKey[]>([]);
  const resultsRef = useRef<HTMLElement | null>(null);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const cityLabel = cityTheme.label;

  const displayEvents = useMemo(() => {
    return useEventFallback ? getEventsWithFallback(city, events) : events;
  }, [city, events, useEventFallback]);

  const cards = useMemo(() => {
    return buildExploreCards(
      "events",
      displayEvents,
      cityLabel,
      cityTheme.fallbackImage,
      useEventFallback,
      city
    );
  }, [city, cityLabel, cityTheme.fallbackImage, displayEvents, useEventFallback]);

  const plannerFilteredCards = useMemo(() => {
    return filterCardsByPlannerProgress(
      cards,
      plannerSelections,
      completedStepCount
    );
  }, [cards, completedStepCount, plannerSelections]);

  const filteredCards = useMemo(() => {
    return filterCardsByResultFilters(plannerFilteredCards, resultFilters);
  }, [plannerFilteredCards, resultFilters]);

  const previewCards = useMemo(() => {
    if (
      !plannerSelections.companion ||
      !plannerSelections.moment ||
      !plannerSelections.vibe
    ) {
      return [];
    }

    const fullyMatchedCards = filterCardsByPlannerProgress(
      cards,
      plannerSelections,
      PLANNER_STEP_COUNT
    );

    return filterCardsByResultFilters(fullyMatchedCards, resultFilters);
  }, [cards, plannerSelections, resultFilters]);

  function scrollToSection(target: HTMLElement | null, block: ScrollLogicalPosition) {
    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block,
    });
  }

  function showResults() {
    scrollToSection(resultsRef.current, "start");

    window.setTimeout(() => {
      resultsRef.current
        ?.querySelector<HTMLElement>("#explore-results-heading")
        ?.focus({ preventScroll: true });
    }, 0);
  }

  function openPlannerAtStep(step = 1) {
    setCurrentStep(step);
    setIsFlowOpen(true);
  }

  function handlePlannerSelectionChange(
    key: keyof PlannerSelections,
    value: PlannerSelections[keyof PlannerSelections]
  ) {
    setPlannerSelections((current) => ({ ...current, [key]: value }));
  }

  function handleFlowComplete() {
    setCompletedStepCount(PLANNER_STEP_COUNT);
    setCurrentStep(PLANNER_STEP_COUNT);
    setIsFlowOpen(false);
    window.setTimeout(showResults, 0);
  }

  function handleViewAllResults() {
    const selectedStepCount = plannerSelections.vibe
      ? 3
      : plannerSelections.moment
        ? 2
        : plannerSelections.companion
          ? 1
          : 0;

    setCompletedStepCount(selectedStepCount);
    setIsFlowOpen(false);
    window.setTimeout(showResults, 0);
  }

  function handleToggleResultFilter(filter: ResultFilterKey) {
    setResultFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  }

  function handleClearResultFilters() {
    setResultFilters([]);
  }

  function handleClearAllFilters() {
    setResultFilters([]);
    openPlannerAtStep(1);
  }

  useEffect(() => {
    const firstAvailableId = filteredCards[0]?.id ?? null;
    setSelectedId((current) =>
      current && filteredCards.some((card) => card.id === current)
        ? current
        : firstAvailableId
    );
  }, [filteredCards]);

  return (
    <main
      className="min-h-screen bg-[#F6F5F0] pt-32 text-[#171717] lg:pt-48"
      style={{ backgroundColor: "#f8f5f3" }}
    >
      <CityExploreResultsSection
          cityLabel={cityLabel}
          filteredCards={filteredCards}
          selectedId={selectedId}
          onSelectCard={setSelectedId}
          sectionRef={resultsRef}
          plannerSelections={plannerSelections}
          completedStepCount={completedStepCount}
          onEditSelection={openPlannerAtStep}
          resultFilters={resultFilters}
          onToggleResultFilter={handleToggleResultFilter}
          onClearResultFilters={handleClearResultFilters}
          onClearAllFilters={handleClearAllFilters}
      />
      {isFlowOpen ? (
        <DiscoverFlow
          cityLabel={cityLabel}
          selections={plannerSelections}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onSelectionChange={handlePlannerSelectionChange}
          previewCards={previewCards}
          onComplete={handleFlowComplete}
          onViewAllResults={handleViewAllResults}
        />
      ) : null}
    </main>
  );
}
