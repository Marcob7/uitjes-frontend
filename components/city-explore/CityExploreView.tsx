"use client";

import { useEffect, useMemo, useState } from "react";

import CalendarSectionBlock from "./calendar/CalendarSectionBlock";
import ExploreCardItem from "./ExploreCardItem";
import ExploreMap from "./ExploreMap";
import HeroSection from "./HeroSection";
import IconicSection from "./IconicSection";
import StayInLoopSection from "./StayInLoopSection";
import CategoryTabs from "./CategoryTabs";
import type { CategoryKey, CityExploreViewProps } from "./types";
import {
  buildExploreCards,
  getCalendarEventsForCity,
  getEventsWithFallback,
  getSafeCityTheme,
  sortEventsByStartDate,
} from "./utils";

export default function CityExploreView({
  city,
  events,
}: CityExploreViewProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("events");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const cityTheme = useMemo(() => getSafeCityTheme(city), [city]);
  const cityLabel = cityTheme.label;

  const displayEvents = useMemo(() => {
    return getEventsWithFallback(city, events);
  }, [city, events]);

  const calendarEvents = useMemo(() => {
    return getCalendarEventsForCity(city);
  }, [city]);

  const cards = useMemo(() => {
    return buildExploreCards(
      activeCategory,
      displayEvents,
      cityLabel,
      cityTheme.fallbackImage
    );
  }, [activeCategory, displayEvents, cityLabel, cityTheme.fallbackImage]);

const eventsForMap = useMemo(() => {
  return sortEventsByStartDate(displayEvents || []);
}, [displayEvents]);

  useEffect(() => {
    if (activeCategory !== "events") {
      setSelectedId(null);
      return;
    }

    if (eventsForMap.length > 0) {
      setSelectedId((current) => current ?? eventsForMap[0].id);
      return;
    }

    if (cards.length > 0) {
      setSelectedId((current) => current ?? cards[0].id);
    }
  }, [activeCategory, eventsForMap, cards]);

  return (
    <section
      className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      style={{ backgroundColor: cityTheme.colors.pageBackground }}
    >
      <div className="mx-auto max-w-7xl">
        <HeroSection cityLabel={cityLabel} cityTheme={cityTheme} />

        <section className="mt-12">
  <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
          Curated picks
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Voor nu gevuld met Haarlem dummy data
        </p>
      </div>
<CategoryTabs
  activeCategory={activeCategory}
  onChange={setActiveCategory}
/>
{cards.length === 0 ? (
  <div className="rounded-[1.5rem] bg-white p-6 text-sm text-slate-500 ring-1 ring-black/5">
    Geen resultaten gevonden voor deze categorie.
  </div>
) : (
  <div className="space-y-4">
    {cards.map((card) => (
      <ExploreCardItem
        key={card.id}
        card={card}
        isSelected={selectedId === card.id}
        onSelect={() => setSelectedId(card.id)}
      />
    ))}
  </div>
)}
   
    </div>

    <ExploreMap
      cityLabel={cityLabel}
      events={eventsForMap}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />
  </div>
</section>

        <CalendarSectionBlock
          cityLabel={cityLabel}
          accentColor={cityTheme.colors.accent}
          accentTextColor={cityTheme.colors.accentText}
          calendarEvents={calendarEvents}
        />

        <IconicSection cityLabel={cityLabel} cityTheme={cityTheme} />

        <StayInLoopSection cityLabel={cityLabel} />
      </div>
    </section>
  );
}