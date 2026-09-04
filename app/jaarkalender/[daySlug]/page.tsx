import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ActivitiesSection from "@/components/calendar/ActivitiesSection";
import DayNavigationCTA from "@/components/calendar/DayNavigationCTA";
import FeaturedActivity from "@/components/calendar/FeaturedActivity";
import DayHero from "@/components/calendar/DayHero";
import {
  generateJaarkalenderStaticParams,
  getJaarkalenderDayByNumber,
  getJaarkalenderDayBySlug,
  getJaarkalenderHref,
} from "../data";

type PageProps = {
  params: {
    daySlug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return generateJaarkalenderStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const day = getJaarkalenderDayBySlug(params.daySlug);

  if (!day) {
    return {
      title: "Dagagenda | Uitjes NL",
    };
  }

  return {
    title: `${day.weekdayDisplay} ${day.dayNumber} ${day.monthDisplay} | Uitjes NL`,
    description: day.intro,
  };
}

export default function JaarkalenderDayPage({ params }: PageProps) {
  const day = getJaarkalenderDayBySlug(params.daySlug);

  if (!day) {
    notFound();
  }

  const previousDayHref = getJaarkalenderHref(day.dayNumber - 1);
  const nextDayHref = getJaarkalenderHref(day.dayNumber + 1);
  const previousDay = getJaarkalenderDayByNumber(day.dayNumber - 1);
  const nextDay = getJaarkalenderDayByNumber(day.dayNumber + 1);
  const todayDay = getJaarkalenderDayByNumber(10) ?? day;
  const featuredSlot =
    day.timeline.find((slot) => slot.cards.some((card) => card.image)) ??
    day.timeline[0];
  const featuredCard = featuredSlot
    ? featuredSlot.cards.find((card) => card.image) ?? featuredSlot.cards[0]
    : null;
  const activities = day.timeline.flatMap((slot) =>
    slot.cards
      .filter((card) => card !== featuredCard)
      .map((card) => ({ slot, card }))
  );
  const dayLabel = `${day.weekdayDisplay.toLowerCase()} ${day.dayNumber} ${day.monthDisplay.toLowerCase()}`;

  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <DayHero
        day={day}
        previousDayHref={previousDayHref}
        nextDayHref={nextDayHref}
        todayDayHref={getJaarkalenderHref(todayDay.dayNumber)}
        isToday={day.dayNumber === todayDay.dayNumber}
      />

      <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        {featuredSlot && featuredCard ? (
          <FeaturedActivity
            daySlug={day.slug}
            slot={featuredSlot}
            card={featuredCard}
          />
        ) : null}

        <div className="mt-16 sm:mt-20">
          <ActivitiesSection
            daySlug={day.slug}
            dayLabel={dayLabel}
            activities={activities}
          />
        </div>
      </div>

      <DayNavigationCTA
        day={day}
        previousDay={previousDay}
        nextDay={nextDay}
        previousDayHref={previousDayHref}
        nextDayHref={nextDayHref}
      />
    </main>
  );
}
