"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import CategoryTabs from "./CategoryTabs";
import ExploreCardItem from "./ExploreCardItem";
import ExploreMap from "./ExploreMap";
import HeroSection from "./HeroSection";
import MomentPlannerSection from "./MomentPlannerSection";
import type {
  CategoryKey,
  CityExploreViewProps,
  ExploreFeatureCard,
  PlannerMoment,
  PlannerSelections,
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

const CURATED_COPY: Record<
  CategoryKey,
  { title: string; description: string; countLabel: string }
> = {
  events: {
    title: "Curated picks",
    description:
      "Een selectie van momenten die makkelijk in je dag passen en direct sfeer geven.",
    countLabel: "momenten",
  },
  attractions: {
    title: "Stadsfavorieten",
    description:
      "Plekken die het karakter van de stad laten zien zonder dat het toeristisch aanvoelt.",
    countLabel: "locaties",
  },
  restaurants: {
    title: "Eten met gevoel",
    description:
      "Curated adressen voor lunch, koffie of een avond die je net iets langer laat duren.",
    countLabel: "adressen",
  },
  bars: {
    title: "Avond met ritme",
    description:
      "Van losse borrelstop tot een plek waar je gerust blijft hangen tot laat.",
    countLabel: "stops",
  },
  thingsToDo: {
    title: "Meer dan alleen kijken",
    description:
      "Routes en ervaringen die van een bezoek meteen een echt stadsmoment maken.",
    countLabel: "ideeen",
  },
};

const MOMENT_PILLS: Array<{ value: PlannerMoment; label: string }> = [
  { value: "nu", label: "Nu bezig" },
  { value: "vanavond", label: "Vanavond" },
  { value: "morgen", label: "Morgen" },
  { value: "weekend", label: "Dit weekend" },
];

function FeatureIcon({ icon }: { icon: ExploreFeatureCard["icon"] }) {
  if (icon === "clock") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5v5l3 2" />
      </svg>
    );
  }

  if (icon === "map") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
        <path d="M9 4v14" />
        <path d="M15 6v14" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}

function getFeatureToneClass(tone: ExploreFeatureCard["tone"]) {
  switch (tone) {
    case "mint":
      return "bg-[#dff1da] text-[#284025]";
    case "mist":
      return "bg-[#e6e5f2] text-[#323344]";
    default:
      return "bg-[#f3e5bf] text-[#4c3b21]";
  }
}

function getPlannerSummary(selections: PlannerSelections) {
  const companionLabel =
    selections.companion === "vrienden"
      ? "vrienden"
      : selections.companion === "gezin"
        ? "het gezin"
        : selections.companion;

  const momentLabel =
    selections.moment === "weekend" ? "dit weekend" : selections.moment;

  const vibeLabel =
    selections.vibe === "eten-drinken"
      ? "eten en drinken"
      : selections.vibe;

  return `Voor ${companionLabel}, ${momentLabel} en ${vibeLabel}.`;
}

export default function CityExploreView({
  city,
  events,
}: CityExploreViewProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("events");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlannerVisible, setIsPlannerVisible] = useState(false);
  const [plannerSelections, setPlannerSelections] = useState<PlannerSelections>(
    DEFAULT_PLANNER_SELECTIONS
  );
  const plannerRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollPlannerRef = useRef(false);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const editorialContent = useMemo(() => getCityEditorialContent(city), [city]);
  const cityLabel = cityTheme.label;

  const displayEvents = useMemo(() => {
    return getEventsWithFallback(city, events);
  }, [city, events]);

  const filteredEvents = useMemo(() => {
    if (!isPlannerVisible) {
      return displayEvents;
    }

    return filterEventsByPlanner(displayEvents, plannerSelections);
  }, [displayEvents, isPlannerVisible, plannerSelections]);

  const cardsByCategory = useMemo(() => {
    const base = {
      events: buildExploreCards(
        "events",
        displayEvents,
        cityLabel,
        cityTheme.fallbackImage
      ),
      attractions: buildExploreCards(
        "attractions",
        displayEvents,
        cityLabel,
        cityTheme.fallbackImage
      ),
      restaurants: buildExploreCards(
        "restaurants",
        displayEvents,
        cityLabel,
        cityTheme.fallbackImage
      ),
      bars: buildExploreCards(
        "bars",
        displayEvents,
        cityLabel,
        cityTheme.fallbackImage
      ),
      thingsToDo: buildExploreCards(
        "thingsToDo",
        displayEvents,
        cityLabel,
        cityTheme.fallbackImage
      ),
    };

    if (!isPlannerVisible) {
      return base;
    }

    return {
      events: filterCardsByPlanner(base.events, plannerSelections),
      attractions: filterCardsByPlanner(base.attractions, plannerSelections),
      restaurants: filterCardsByPlanner(base.restaurants, plannerSelections),
      bars: filterCardsByPlanner(base.bars, plannerSelections),
      thingsToDo: filterCardsByPlanner(base.thingsToDo, plannerSelections),
    };
  }, [
    cityLabel,
    cityTheme.fallbackImage,
    displayEvents,
    isPlannerVisible,
    plannerSelections,
  ]);

  const cards = cardsByCategory[activeCategory];

  const categoryCounts = useMemo(
    () => ({
      events: cardsByCategory.events.length,
      attractions: cardsByCategory.attractions.length,
      restaurants: cardsByCategory.restaurants.length,
      bars: cardsByCategory.bars.length,
      thingsToDo: cardsByCategory.thingsToDo.length,
    }),
    [cardsByCategory]
  );

  const eventsForMap = useMemo(() => {
    return sortEventsByStartDate(filteredEvents || []);
  }, [filteredEvents]);

  useEffect(() => {
    if (activeCategory === "events") {
      const firstEventId = eventsForMap[0]?.id ?? cards[0]?.id ?? null;

      setSelectedId((current) => {
        if (current && eventsForMap.some((event) => event.id === current)) {
          return current;
        }

        return firstEventId;
      });

      return;
    }

    const firstCardId = cards[0]?.id ?? null;
    setSelectedId((current) => {
      if (current && cards.some((card) => card.id === current)) {
        return current;
      }

      return firstCardId;
    });
  }, [activeCategory, cards, eventsForMap]);

  useEffect(() => {
    if (!isPlannerVisible || !shouldScrollPlannerRef.current) {
      return;
    }

    shouldScrollPlannerRef.current = false;
    plannerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [isPlannerVisible]);

  const curatedCopy = CURATED_COPY[activeCategory];
  const sectionTitle = isPlannerVisible ? "Gefilterde picks" : curatedCopy.title;
  const sectionDescription = isPlannerVisible
    ? getPlannerSummary(plannerSelections)
    : curatedCopy.description;

  function openPlanner() {
    if (isPlannerVisible) {
      plannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return;
    }

    shouldScrollPlannerRef.current = true;
    setIsPlannerVisible(true);
  }

  return (
    <section
      className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      style={{ backgroundColor: cityTheme.colors.pageBackground }}
    >
      <div className="mx-auto max-w-7xl">
        <HeroSection
          cityLabel={cityLabel}
          cityTheme={cityTheme}
          editorialContent={editorialContent}
          onCtaClick={openPlanner}
          showRecommendations={!isPlannerVisible}
          plannerSection={
            isPlannerVisible ? (
              <div id="moment-planner" ref={plannerRef}>
                <MomentPlannerSection
                  selections={plannerSelections}
                  onCompanionChange={(value) =>
                    setPlannerSelections((current) => ({
                      ...current,
                      companion: value,
                    }))
                  }
                  onMomentChange={(value) =>
                    setPlannerSelections((current) => ({
                      ...current,
                      moment: value,
                    }))
                  }
                  onVibeChange={(value) =>
                    setPlannerSelections((current) => ({
                      ...current,
                      vibe: value,
                    }))
                  }
                  onHide={() => setIsPlannerVisible(false)}
                />
              </div>
            ) : null
          }
        />

        <section className="mt-8">
          <CategoryTabs
            activeCategory={activeCategory}
            counts={categoryCounts}
            onChange={setActiveCategory}
          />
        </section>

        <section
          id="curated-picks"
          className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div className="rounded-[2.4rem] border border-black/5 bg-[#f4e6d9] p-6 shadow-[0_24px_60px_rgba(64,42,24,0.08)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-[32rem]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#726554]">
                  {curatedCopy.countLabel}
                </div>
                <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.3rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111]">
                  {sectionTitle}
                </h2>
                <p className="mt-3 max-w-[32rem] text-sm leading-7 text-[#5e5548] sm:text-base">
                  {sectionDescription}
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d6252]">
                {isPlannerVisible ? (
                  <span className="block leading-5">
                    {cards.length} locaties
                    <br />
                    gevonden
                  </span>
                ) : (
                  `${cards.length} ${curatedCopy.countLabel}`
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {MOMENT_PILLS.map((option) => {
                const isActive = plannerSelections.moment === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (!isPlannerVisible) {
                        setIsPlannerVisible(true);
                      }

                      setPlannerSelections((current) => ({
                        ...current,
                        moment: option.value,
                      }));
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-white text-[#1f1f1f] shadow-sm"
                        : "bg-[#efe1d3] text-[#655b4f] hover:bg-[#eadbcd]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-4">
              {cards.length === 0 ? (
                <div className="rounded-[1.6rem] bg-white/75 p-6 text-sm text-[#655b4f] ring-1 ring-black/5">
                  Geen resultaten gevonden voor deze combinatie. Kies een andere
                  sfeer of een ander moment.
                </div>
              ) : (
                cards.map((card, index) => (
                  <ExploreCardItem
                    key={card.id}
                    card={card}
                    index={index}
                    isSelected={selectedId === card.id}
                    onSelect={() => setSelectedId(card.id)}
                  />
                ))
              )}
            </div>
          </div>

          <ExploreMap
            cityLabel={cityLabel}
            events={eventsForMap}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {editorialContent.featureCards.map((feature) => (
            <article
              key={feature.id}
              className={`rounded-[2rem] px-6 py-7 shadow-[0_18px_40px_rgba(52,39,24,0.05)] ${getFeatureToneClass(
                feature.tone
              )}`}
            >
              <div className="inline-flex rounded-full bg-white/70 p-3">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="mt-6 text-[1.8rem] font-semibold leading-[1.04] tracking-[-0.05em]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 opacity-80 sm:text-base">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
