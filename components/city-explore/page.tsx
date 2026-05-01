"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { WebGLLiquid } from "@/components/ui/webgl-liquid";

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
  isLiquidPaletteDark,
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
  const plannerRef = useRef<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const editorialContent = useMemo(() => getCityEditorialContent(city), [city]);
  const cityLabel = cityTheme.label;
  const isDarkLiquid = useMemo(() => isLiquidPaletteDark(cityTheme), [cityTheme]);

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
      className="min-h-screen bg-[#f8f5f3] px-4 pt-4 text-[#171717] md:px-6 lg:px-8"
      style={{ backgroundColor: "#f8f5f3" }}
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white/50">
        <div className="absolute inset-0">
          <WebGLLiquid
            title=""
            subtitle=""
            description=""
            colorDeep={cityTheme.liquid.deep}
            colorMid={cityTheme.liquid.mid}
            colorHighlight={cityTheme.liquid.highlight}
            speed={0.78}
            flowStrength={0.88}
            grain={0.03}
            contrast={1.06}
            opacity={0.88}
            reveal={false}
            className="h-full w-full !min-h-0 !items-start"
            style={{
              minHeight: "100%",
              height: "100%",
              backgroundColor: "#09151b",
            }}
            overlayClassName={
              isDarkLiquid
                ? "bg-gradient-to-br from-[#09151b]/84 via-[#09151b]/64 to-[#0d2027]/58"
                : "bg-gradient-to-br from-[#09151b]/78 via-[#09151b]/58 to-[#0d2027]/48"
            }
            glowClassName={
              isDarkLiquid
                ? "bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(198,223,154,0.18),transparent_24%)]"
                : "bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(198,223,154,0.2),transparent_24%)]"
            }
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,26,0.1),rgba(7,19,26,0.4))]" />
        <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-[rgba(198,223,154,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 h-48 w-48 rounded-full bg-[rgba(122,213,217,0.14)] blur-3xl" />

        <div className="relative z-10">
          <CityExploreHeroSection
            cityLabel={cityLabel}
            intro={editorialContent.intro}
            cityTheme={cityTheme}
            isDarkLiquid={isDarkLiquid}
          />

          <CityExploreFormSection
            cityLabel={cityLabel}
            isDarkLiquid={isDarkLiquid}
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

          <CityExploreResultsSection
            cityLabel={cityLabel}
            filteredCards={filteredCards}
            selectedId={selectedId}
            onSelectCard={setSelectedId}
            sectionRef={resultsRef}
            plannerSelections={plannerSelections}
            completedStepCount={completedStepCount}
            onEditSelection={showPlannerStep}
          />
        </div>
      </div>

      <CityExploreMapSection
        cityLabel={cityLabel}
        events={eventsForMap}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </main>
  );
}
