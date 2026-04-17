"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import CityExploreFormSection from "./CityExploreFormSection";
import CityExploreHeroSection from "./CityExploreHeroSection";
import CityExploreMapSection from "./CityExploreMapSection";
import CityExploreResultsSection from "./CityExploreResultsSection";
import type {
  CityExploreViewProps,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";
import {
  buildExploreCards,
  filterCardsByPlanner,
  filterEventsByPlanner,
  getCityEditorialContent,
  getEventsWithFallback,
  getSafeCityTheme,
  sortEventsByStartDate,
} from "./utils";

const DEFAULT_PLANNER_SELECTIONS: PlannerSelections = {
  companion: "date",
  moment: "nu",
  vibe: "eten-drinken",
};

function matchesPlannerProgress<
  T extends {
    audiences?: PlannerCompanion[];
    moments?: PlannerMoment[];
    vibes?: PlannerVibe[];
  },
>(item: T, selections: PlannerSelections, completedStepCount: number) {
  const matchesCompanion =
    completedStepCount < 1 ||
    !item.audiences?.length ||
    item.audiences.includes(selections.companion);
  const matchesMoment =
    completedStepCount < 2 ||
    !item.moments?.length ||
    item.moments.includes(selections.moment);
  const matchesVibe =
    completedStepCount < 3 ||
    !item.vibes?.length ||
    item.vibes.includes(selections.vibe);

  return matchesCompanion && matchesMoment && matchesVibe;
}

function filterByPlannerProgress<
  T extends {
    audiences?: PlannerCompanion[];
    moments?: PlannerMoment[];
    vibes?: PlannerVibe[];
  },
>(
  items: T[],
  selections: PlannerSelections,
  completedStepCount: number
) {
  if (completedStepCount === 0) {
    return items;
  }

  return items.filter((item) =>
    matchesPlannerProgress(item, selections, completedStepCount)
  );
}

export default function CityExplorePage({
  city,
  events,
}: CityExploreViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStepCount, setCompletedStepCount] = useState(0);
  const [plannerSelections, setPlannerSelections] = useState<PlannerSelections>(
    DEFAULT_PLANNER_SELECTIONS
  );
  const resultsRef = useRef<HTMLElement | null>(null);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const editorialContent = useMemo(() => getCityEditorialContent(city), [city]);
  const cityLabel = cityTheme.label;

  const displayEvents = useMemo(() => {
    return getEventsWithFallback(city, events);
  }, [city, events]);

  const cards = useMemo(() => {
    return buildExploreCards(
      "events",
      displayEvents,
      cityLabel,
      cityTheme.fallbackImage
    );
  }, [cityLabel, cityTheme.fallbackImage, displayEvents]);

  const filteredCards = useMemo(() => {
    if (completedStepCount >= 3) {
      return filterCardsByPlanner(cards, plannerSelections);
    }

    return filterByPlannerProgress(cards, plannerSelections, completedStepCount);
  }, [cards, completedStepCount, plannerSelections]);

  const filteredEvents = useMemo(() => {
    if (completedStepCount >= 3) {
      return filterEventsByPlanner(displayEvents, plannerSelections);
    }

    return filterByPlannerProgress(
      displayEvents,
      plannerSelections,
      completedStepCount
    );
  }, [completedStepCount, displayEvents, plannerSelections]);

  const eventsForMap = useMemo(() => {
    return sortEventsByStartDate(filteredEvents);
  }, [filteredEvents]);

  const featuredCard = filteredCards[0] ?? cards[0] ?? null;

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
    setCurrentStep(4);
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

  useEffect(() => {
    const firstAvailableId = eventsForMap[0]?.id ?? filteredCards[0]?.id ?? null;

    setSelectedId((current) => {
      if (current && filteredCards.some((card) => card.id === current)) {
        return current;
      }

      if (current && eventsForMap.some((event) => event.id === current)) {
        return current;
      }

      return firstAvailableId;
    });
  }, [eventsForMap, filteredCards]);

  return (
    <main
      className="min-h-screen bg-[#fbf8f3] text-[#171717]"
      style={{ backgroundColor: cityTheme.colors.pageBackground || "#fbf8f3" }}
    >
      <CityExploreHeroSection
        cityLabel={cityLabel}
        intro={editorialContent.intro}
        cityTheme={cityTheme}
      />

      <CityExploreFormSection
        cityLabel={cityLabel}
        plannerSelections={plannerSelections}
        currentStep={currentStep}
        completedStepCount={completedStepCount}
        featuredCard={featuredCard}
        onCompanionSelect={handleCompanionSelect}
        onMomentSelect={handleMomentSelect}
        onVibeSelect={handleVibeSelect}
        onPreviousStep={handlePreviousStep}
        onGoToStep={handleGoToStep}
        onClearStep={handleClearStep}
        onShowResults={() =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      />

      <CityExploreResultsSection
        cityLabel={cityLabel}
        filteredCards={filteredCards}
        selectedId={selectedId}
        onSelectCard={setSelectedId}
        sectionRef={resultsRef}
        plannerSelections={plannerSelections}
        completedStepCount={completedStepCount}
      />

      <CityExploreMapSection
        cityLabel={cityLabel}
        events={eventsForMap}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </main>
  );
}
