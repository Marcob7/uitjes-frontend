"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ExploreBackgroundScene } from "@/components/discover/ExploreBackgroundScene";

import DiscoverFlow from "./DiscoverFlow";
import CityExploreHeroSection from "./CityExploreHeroSection";
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
  getCityEditorialContent,
  getEventsWithFallback,
  isLiquidPaletteDark,
  getSafeCityTheme,
} from "./utils";

const DEFAULT_PLANNER_SELECTIONS: PlannerSelections = {
  companion: "date",
  moment: "nu",
  vibe: "eten-drinken",
};

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
    DEFAULT_PLANNER_SELECTIONS
  );
  const [resultFilters, setResultFilters] = useState<ResultFilterKey[]>([]);
  const resultsRef = useRef<HTMLElement | null>(null);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const editorialContent = useMemo(() => getCityEditorialContent(city), [city]);
  const cityLabel = cityTheme.label;
  const isDarkLiquid = useMemo(() => isLiquidPaletteDark(cityTheme), [cityTheme]);

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
      className="relative isolate pt-18 min-h-screen overflow-hidden bg-[#f8f5f3] px-4 pt-4 text-[#171717] md:px-6 lg:px-8"
      style={{ backgroundColor: "#f8f5f3" }}
    >
      <ExploreBackgroundScene />
      <div className="relative z-10 mx-auto max-w-[1240px] py-4 sm:py-6 lg:py-8">
        <CityExploreHeroSection
          cityLabel={cityLabel}
          intro={editorialContent.intro}
          resultCount={cards.length}
          isGenericLanding={isGenericLanding}
          cityTheme={cityTheme}
          isDarkLiquid={isDarkLiquid}
        />

      </div>

      <div className="relative z-10">
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
      </div>
      {isFlowOpen ? (
        <DiscoverFlow
          cityLabel={cityLabel}
          selections={plannerSelections}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onSelectionChange={handlePlannerSelectionChange}
          previewCards={previewCards}
          onComplete={handleFlowComplete}
        />
      ) : null}
      {/* The map remains available in CityExploreMapSection for future placement; it is intentionally not rendered on /ontdek. */}
    </main>
  );
}
