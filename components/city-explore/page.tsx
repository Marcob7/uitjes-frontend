"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ExploreBackgroundScene } from "@/components/discover/ExploreBackgroundScene";

import CityExploreFormSection from "./CityExploreFormSection";
import CityExploreHeroSection from "./CityExploreHeroSection";
import CityExploreResultsSection from "./CityExploreResultsSection";
import type {
  CityExploreViewProps,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
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

export default function CityExplorePage({
  city,
  events,
  useEventFallback = true,
  isGenericLanding = false,
}: CityExploreViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStepCount, setCompletedStepCount] = useState(0);
  const [plannerSelections, setPlannerSelections] = useState<PlannerSelections>(
    DEFAULT_PLANNER_SELECTIONS
  );
  const [resultFilters, setResultFilters] = useState<ResultFilterKey[]>([]);
  const plannerRef = useRef<HTMLElement | null>(null);
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
  }

  function showPlannerStep(step: number) {
    setCurrentStep(step);
    window.setTimeout(() => {
      scrollToSection(plannerRef.current, "start");
    }, 60);
  }

  function handleCompanionSelect(value: PlannerCompanion) {
    setPlannerSelections((current) => ({
      ...current,
      companion: value,
    }));
    setCompletedStepCount((current) => Math.max(current, 1));
    setCurrentStep(2);
  }

  function handleMomentSelect(value: PlannerMoment) {
    setPlannerSelections((current) => ({
      ...current,
      moment: value,
    }));
    setCompletedStepCount((current) => Math.max(current, 2));
    setCurrentStep(3);
  }

  function handleVibeSelect(value: PlannerVibe) {
    setPlannerSelections((current) => ({
      ...current,
      vibe: value,
    }));
    setCompletedStepCount((current) => Math.max(current, 3));
    setCurrentStep(3);
    window.setTimeout(() => {
      showResults();
    }, 120);
  }

  function handlePreviousStep() {
    setCurrentStep((current) => Math.max(1, current - 1));
  }

  function handleGoToStep(step: number) {
    setCurrentStep(step);
  }

  function handleClearStep(step: number) {
    setCurrentStep(step);
    setCompletedStepCount(step - 1);
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
    setCompletedStepCount(0);
    setCurrentStep(1);
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

        <CityExploreFormSection
          cityLabel={cityLabel}
          isDarkLiquid={false}
          plannerSelections={plannerSelections}
          currentStep={currentStep}
          completedStepCount={completedStepCount}
          onCompanionSelect={handleCompanionSelect}
          onMomentSelect={handleMomentSelect}
          onVibeSelect={handleVibeSelect}
          onPreviousStep={handlePreviousStep}
          onGoToStep={handleGoToStep}
          onClearStep={handleClearStep}
          onShowResults={showResults}
          sectionRef={plannerRef}
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
          onEditSelection={showPlannerStep}
          resultFilters={resultFilters}
          onToggleResultFilter={handleToggleResultFilter}
          onClearResultFilters={handleClearResultFilters}
          onClearAllFilters={handleClearAllFilters}
        />
      </div>
      {/* The map remains available in CityExploreMapSection for future placement; it is intentionally not rendered on /ontdek. */}
    </main>
  );
}
