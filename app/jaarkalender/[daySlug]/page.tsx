import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ActivitiesSection from "@/components/calendar/ActivitiesSection";
import DayNavigationCTA from "@/components/calendar/DayNavigationCTA";
import DayHero from "@/components/calendar/DayHero";
import {
  formatJaarkalenderDate,
  generateJaarkalenderStaticParams,
  getJaarkalenderEventEntriesForDay,
  getJaarkalenderDayByNumber,
  getJaarkalenderDayBySlug,
  getJaarkalenderHrefForDate,
  getJaarkalenderHref,
} from "../data";

type PageProps = {
  params: {
    daySlug: string;
  };
};

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

  const selectedDate = new Date(`${day.isoDate}T12:00:00`);
  const previousDate = new Date(selectedDate);
  previousDate.setDate(selectedDate.getDate() - 1);
  const nextDate = new Date(selectedDate);
  nextDate.setDate(selectedDate.getDate() + 1);
  const previousDayHref = getJaarkalenderHrefForDate(previousDate);
  const nextDayHref = getJaarkalenderHrefForDate(nextDate);
  const previousDay = getJaarkalenderDayBySlug(
    previousDayHref.split("/").at(-1) ?? ""
  );
  const nextDay = getJaarkalenderDayBySlug(
    nextDayHref.split("/").at(-1) ?? ""
  );
  const todayDay = getJaarkalenderDayByNumber(10) ?? day;
  const activities = getJaarkalenderEventEntriesForDay(day).map(({ slot, card }) => ({
    slot,
    card,
  }));
  const dayLabel = formatJaarkalenderDate(day.isoDate) ?? day.isoDate;

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
        <div>
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
