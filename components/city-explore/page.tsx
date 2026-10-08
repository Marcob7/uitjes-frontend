"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import {
  buildDiscoverDetailHref,
  buildDiscoverUrl,
  getDiscoverPlannerStepCount,
  getDiscoverUrlState,
  type DiscoverView,
} from "./discoverUrl";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";

const PLANNER_STEP_COUNT = 3;

export default function CityExplorePage({
  city,
  events,
  useEventFallback = true,
}: CityExploreViewProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const discoverQuery = searchParams.toString();
  const urlState = useMemo(
    () => getDiscoverUrlState(new URLSearchParams(discoverQuery), city),
    [city, discoverQuery]
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStepCount, setCompletedStepCount] = useState(0);
  const [plannerSelections, setPlannerSelections] = useState<PlannerSelections>(
    () => urlState.plannerSelections
  );
  const [resultFilters, setResultFilters] = useState<ResultFilterKey[]>(
    () => urlState.resultFilters
  );
  const resultsRef = useRef<HTMLElement | null>(null);
  // The URL is the only authority for results mode. A city or a partial
  // planner selection never closes the fullscreen wizard by itself.
  const isFlowOpen = !urlState.isResultsOpen;

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

  // The query string is the persistent source of truth. Keeping the local
  // state in lockstep also makes browser back/forward restore the exact result
  // set and its labels, instead of leaving stale answers behind.
  useLayoutEffect(() => {
    const completedSteps = getDiscoverPlannerStepCount(
      urlState.plannerSelections
    );

    setPlannerSelections(urlState.plannerSelections);
    setCompletedStepCount(completedSteps);
    setResultFilters(urlState.resultFilters);
    setSelectedId(urlState.selectedId);
    setCurrentStep(
      urlState.isResultsOpen
        ? 1
        : Math.min(completedSteps + 1, PLANNER_STEP_COUNT + 1)
    );
  }, [urlState]);

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
    router.replace(buildDiscoverUrl(city, plannerSelections), { scroll: false });
  }

  function handlePlannerSelectionChange(
    key: keyof PlannerSelections,
    value: NonNullable<PlannerSelections[keyof PlannerSelections]>
  ) {
    const nextSelections = { ...plannerSelections, [key]: value };
    setPlannerSelections(nextSelections);
    router.push(buildDiscoverUrl(city, nextSelections), { scroll: false });
  }

  function handleFlowComplete() {
    setCompletedStepCount(PLANNER_STEP_COUNT);
    setCurrentStep(PLANNER_STEP_COUNT);
    router.replace(
      buildDiscoverUrl(city, plannerSelections, {
        resultFilters,
        isResultsOpen: true,
        view: "list",
        selectedId,
      }),
      { scroll: false }
    );
    window.setTimeout(showResults, 0);
  }

  function handleViewAllResults() {
    // This is deliberately different from completing the planner: it removes
    // every personal and result filter while retaining the selected city.
    setPlannerSelections({});
    setCompletedStepCount(0);
    setResultFilters([]);
    setCurrentStep(1);
    router.push(
      buildDiscoverUrl(city, {}, { isResultsOpen: true, view: "list" }),
      { scroll: false }
    );
    window.setTimeout(showResults, 0);
  }

  function handleToggleResultFilter(filter: ResultFilterKey) {
    const nextFilters = resultFilters.includes(filter)
      ? resultFilters.filter((item) => item !== filter)
      : [...resultFilters, filter];
    setResultFilters(nextFilters);
    router.replace(
      buildDiscoverUrl(city, plannerSelections, {
        resultFilters: nextFilters,
        isResultsOpen: true,
        view: urlState.view,
        selectedId,
      }),
      { scroll: false }
    );
  }

  function handleClearResultFilters() {
    setResultFilters([]);
    router.replace(
      buildDiscoverUrl(city, plannerSelections, {
        isResultsOpen: true,
        view: urlState.view,
        selectedId,
      }),
      { scroll: false }
    );
  }

  function handleClearAllFilters() {
    handleViewAllResults();
  }

  function handleSelectCard(id: number) {
    setSelectedId(id);
  }

  function handleMapSelectCard(id: number) {
    setSelectedId(id);
    router.replace(
      buildDiscoverUrl(city, plannerSelections, {
        resultFilters,
        isResultsOpen: true,
        view: urlState.view,
        selectedId: id,
      }),
      { scroll: false }
    );
  }

  function handleViewChange(view: DiscoverView) {
    router.replace(
      buildDiscoverUrl(city, plannerSelections, {
        resultFilters,
        isResultsOpen: true,
        view,
        selectedId,
      }),
      { scroll: false }
    );
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
      {!isFlowOpen ? (
        <CityExploreResultsSection
          cityLabel={cityLabel}
          filteredCards={filteredCards}
          selectedId={selectedId}
          onSelectCard={handleSelectCard}
          onMapSelectCard={handleMapSelectCard}
          sectionRef={resultsRef}
          plannerSelections={plannerSelections}
          completedStepCount={completedStepCount}
          onEditSelection={openPlannerAtStep}
          resultFilters={resultFilters}
          onToggleResultFilter={handleToggleResultFilter}
          onClearResultFilters={handleClearResultFilters}
          onClearAllFilters={handleClearAllFilters}
          view={urlState.view}
          onViewChange={handleViewChange}
          getDetailHref={(href) =>
            localePathname(buildDiscoverDetailHref(href, {
              city,
              plannerSelections,
              resultFilters,
              isResultsOpen: true,
              view: urlState.view,
              selectedId,
            }), locale)
          }
        />
      ) : null}
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
