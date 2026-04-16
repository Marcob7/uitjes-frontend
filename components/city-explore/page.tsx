"use client";

import Image from "next/image";
import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";

import { optimizeRemoteImageUrl } from "@/lib/remoteImage";

import ExploreCardItem from "./ExploreCardItem";
import ExploreMap from "./ExploreMap";
import type {
  CityExploreViewProps,
  PlannerCompanion,
  PlannerSelections,
} from "./types";
import {
  buildExploreCards,
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

type CompanionOption = {
  id: PlannerCompanion;
  label: string;
  icon: (props: { className?: string }) => ReactElement;
};

const COMPANION_OPTIONS: CompanionOption[] = [
  { id: "solo", label: "Solo", icon: SoloIcon },
  { id: "date", label: "Date", icon: HeartIcon },
  { id: "gezin", label: "Gezin", icon: FamilyIcon },
  { id: "vrienden", label: "Vrienden", icon: FriendsIcon },
];

function SoloIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 11a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 12 11Zm-5.5 7.5c0-3.03 2.46-5.5 5.5-5.5s5.5 2.47 5.5 5.5c0 .55-.45 1-1 1h-9c-.55 0-1-.45-1-1Z" />
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

function FamilyIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M7.5 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM4.5 18.5c0-2.1 1.7-3.8 3.8-3.8h.08A3.95 3.95 0 0 1 12 16.83a3.95 3.95 0 0 1 3.62-2.13h.08c2.1 0 3.8 1.7 3.8 3.8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

function FriendsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M7.25 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9.5 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Zm-6.25 9c0-1.97 1.6-3.56 3.56-3.56h.27c.93 0 1.78.35 2.42.93a4.34 4.34 0 0 1 2.42-.93h.27c1.97 0 3.56 1.59 3.56 3.56a1 1 0 0 1-1 1H6.75a1 1 0 0 1-1-1Zm-3 0c0-1.73 1.4-3.13 3.13-3.13h.38c.37 0 .73.06 1.06.18a4.83 4.83 0 0 0-.57 2.26.9.9 0 0 1-.01.19H3.75a1 1 0 0 1-1-1Zm17.5 0c0-1.73-1.4-3.13-3.13-3.13h-.38c-.37 0-.73.06-1.06.18.38.65.57 1.44.57 2.26v.19h3a1 1 0 0 0 1-1Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

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

function buildCityBadge(cityLabel: string) {
  return `${cityLabel} selectie`;
}

function filterByCompanion<T extends { audiences?: PlannerCompanion[] }>(
  items: T[],
  companion: PlannerCompanion
) {
  const matches = items.filter(
    (item) => !item.audiences?.length || item.audiences.includes(companion)
  );

  return matches.length > 0 ? matches : items;
}

function formatCompanionDescription(companion: PlannerCompanion) {
  switch (companion) {
    case "solo":
      return "Rustige, spontane keuzes voor een avond in je eigen tempo.";
    case "gezin":
      return "Een selectie die laagdrempelig werkt voor meerdere leeftijden.";
    case "vrienden":
      return "Meer levendige matches die goed voelen voor samen op pad gaan.";
    default:
      return "Een selectie die intiem, sfeervol en makkelijk te combineren is.";
  }
}

function getHeroImage(
  image: string | null | undefined,
  fallbackImage: string,
  width: number
) {
  return optimizeRemoteImageUrl(image || fallbackImage, { width });
}

export default function CityExplorePage({
  city,
  events,
}: CityExploreViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
    return filterByCompanion(cards, plannerSelections.companion);
  }, [cards, plannerSelections.companion]);

  const filteredEvents = useMemo(() => {
    return filterByCompanion(displayEvents, plannerSelections.companion);
  }, [displayEvents, plannerSelections.companion]);

  const eventsForMap = useMemo(() => {
    return sortEventsByStartDate(filteredEvents);
  }, [filteredEvents]);

  const featuredCard = filteredCards[0] ?? cards[0] ?? null;

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
      <section className="border-b border-black/[0.04] bg-white">
        <div className="mx-auto max-w-[1220px] px-6 pb-10 pt-14 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="inline-flex rounded-full bg-[#cdef94] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#476624]">
            {buildCityBadge(cityLabel)}
          </div>

          <h1 className="mt-6 max-w-[11ch] text-[clamp(3.1rem,7vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-[#141414]">
            Beste matches voor jullie avond in {cityLabel}
          </h1>

          <p className="mt-5 max-w-[40rem] text-base leading-8 text-[#5d5148] sm:text-[1.06rem]">
            {editorialContent.intro}
          </p>
        </div>
      </section>

      <section className="bg-[#f6e8d9]">
        <div className="mx-auto grid max-w-[1220px] gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-10 lg:py-14">
          <div className="relative aspect-[1/1] overflow-hidden rounded-[2.2rem] bg-[#1d120f] shadow-[0_26px_60px_rgba(65,42,21,0.18)] sm:max-w-[420px]">
            <Image
              src={getHeroImage(
                featuredCard?.image || cityTheme.heroImage,
                cityTheme.fallbackImage,
                1200
              )}
              alt={featuredCard?.title || `${cityLabel} sfeerbeeld`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc8b41]/20 via-transparent to-[#100806]/72" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d0706]/85 via-[#0d0706]/30 to-transparent px-6 pb-6 pt-16 text-white">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/72">
                {featuredCard?.label || editorialContent.editionTag}
              </div>
              <div className="mt-2 text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.05em]">
                {featuredCard?.title || `Ontdek ${cityLabel}`}
              </div>
            </div>
          </div>

          <div className="max-w-[690px]">
            <p className="text-[1.05rem] text-[#51453a]">Stap 1 van 3</p>
            <h2 className="mt-2 text-[clamp(2.2rem,4vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#151515]">
              Stap 1: Gezelschap kiezen
            </h2>
            <p className="mt-4 max-w-[44rem] text-base leading-8 text-[#43382e] sm:text-[1.08rem]">
              Met wie ga je op pad in {cityLabel}? Voor nu koppelt deze eerste
              stap direct de resultaten en kaart aan je gezelschap. De volgende
              stappen kun je later verder uitbouwen.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-white/75 px-4 py-2 text-sm text-[#5a4e44] ring-1 ring-black/5">
              {formatCompanionDescription(plannerSelections.companion)}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {COMPANION_OPTIONS.map((option) => {
                const isActive = option.id === plannerSelections.companion;
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      setPlannerSelections((current) => ({
                        ...current,
                        companion: option.id,
                      }))
                    }
                    className={`group flex min-h-[124px] flex-col items-center justify-center rounded-[1.6rem] border px-5 py-6 text-center shadow-[0_14px_26px_rgba(65,42,21,0.05)] transition duration-200 ${
                      isActive
                        ? "border-[#3e6c1f] bg-[#cbf291] text-[#34571d]"
                        : "border-transparent bg-white text-[#202020] hover:-translate-y-0.5 hover:border-[#e0d3c4]"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 ${
                        isActive ? "text-[#426c22]" : "text-[#466c26]"
                      }`}
                    />
                    <span className="mt-4 text-[1.02rem] font-medium">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="inline-flex items-center gap-3 rounded-full bg-[#181615] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,22,21,0.18)] hover:-translate-y-0.5"
              >
                <span>Volgende stap</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="bg-white">
        <div className="mx-auto max-w-[1220px] px-6 py-12 sm:px-8 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-[#151515]">
                {filteredCards.length} locaties gevonden
              </h3>
              <p className="mt-3 max-w-[36rem] text-sm leading-7 text-[#605347] sm:text-base">
                De resultaten blijven gekoppeld aan de gekozen stad. Als er nog
                geen backend-data beschikbaar is, gebruiken we automatisch de
                dummy data uit de huidige explore-flow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
            {filteredCards.length === 0 ? (
              <div className="rounded-[2rem] bg-[#fbf8f4] p-6 text-sm leading-7 text-[#5d5148] shadow-[0_18px_40px_rgba(51,35,21,0.06)] ring-1 ring-black/[0.04] lg:col-span-2">
                Voor {cityLabel} zijn nog geen locaties beschikbaar in deze
                selectie.
              </div>
            ) : (
              filteredCards.map((card, index) => (
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

          <section className="mt-14">
            <ExploreMap
              cityLabel={cityLabel}
              events={eventsForMap}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
