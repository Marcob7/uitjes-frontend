"use client";

import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getRelativeEventLabel } from "@/lib/eventDateLabels";

import { EventDetailsHero } from "./EventDetailsHero";
import {
  EventDetailsCategoriesSection,
  EventDetailsTodaySection,
  EventDetailsWeekendSection,
} from "./EventDetailsSections";
import { EventDetailsTimeline } from "./EventDetailsTimeline";
import {
  categories,
  todayEvents,
  upcomingMoments,
  weekendEvents,
  weekendGuide,
} from "./eventDetailsData";

function useLocalNow() {
  const [now, setNow] = useState<Date>();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const updateAtNextMidnight = () => {
      setNow(new Date());
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 1, 0);
      timeout = setTimeout(updateAtNextMidnight, nextMidnight.getTime() - Date.now());
    };

    updateAtNextMidnight();
    return () => clearTimeout(timeout);
  }, []);

  return now;
}

function scrollRail(
  rail: HTMLDivElement | null,
  direction: "left" | "right"
) {
  if (!rail) return;

  const amount = Math.min(440, Math.max(280, rail.clientWidth * 0.78));
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  rail.scrollBy({
    left: direction === "right" ? amount : -amount,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export function EventDetailsPageClient() {
  const { locale, t } = useLocale();
  const todayRailRef = useRef<HTMLDivElement>(null);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const now = useLocalNow();
  const guideDateLabel = getRelativeEventLabel(weekendGuide, now, locale);
  const guideIsThisWeekend = guideDateLabel === t("date.thisWeekend");

  return (
    <main className="mt-0 min-h-screen overflow-x-clip bg-[#f6f3ec] text-[#1d2a20] lg:mt-24">
      <EventDetailsHero
        guideDateLabel={guideDateLabel}
        guideIsThisWeekend={guideIsThisWeekend}
      />
      <EventDetailsWeekendSection
        events={weekendEvents}
        now={now}
        guideDateLabel={guideDateLabel}
        guideIsThisWeekend={guideIsThisWeekend}
      />
      <EventDetailsTodaySection
        items={todayEvents}
        railRef={todayRailRef}
        onScroll={(direction) => scrollRail(todayRailRef.current, direction)}
      />
      <EventDetailsCategoriesSection categories={categories} />
      <EventDetailsTimeline
        moments={upcomingMoments}
        now={now}
        railRef={timelineRailRef}
        onScroll={(direction) => scrollRail(timelineRailRef.current, direction)}
      />
    </main>
  );
}
