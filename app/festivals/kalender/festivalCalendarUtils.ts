import { normalizeSearchQuery } from "@/lib/searchIntent";

import type { FestivalCalendarEvent } from "./festivalCalendarData";

export type FestivalCalendarCell = {
  key: string;
  dayNumber: string;
  muted?: boolean;
  events?: FestivalCalendarEvent[];
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameMonth(date: Date, monthDate: Date) {
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();
  const dates: Date[] = [];

  for (let index = startDay; index > 0; index -= 1) {
    dates.push(new Date(year, month, 1 - index));
  }

  for (let day = 1; day <= totalDays; day += 1) {
    dates.push(new Date(year, month, day));
  }

  while (dates.length % 7 !== 0) {
    const nextDay = dates.length - (startDay + totalDays) + 1;
    dates.push(new Date(year, month + 1, nextDay));
  }

  return dates;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function buildFestivalCalendarCells(
  currentMonth: Date,
  events: FestivalCalendarEvent[]
): FestivalCalendarCell[] {
  const eventsByDate = new Map<string, FestivalCalendarEvent[]>();

  for (const event of events) {
    const dateEvents = eventsByDate.get(event.date) ?? [];
    dateEvents.push(event);
    eventsByDate.set(event.date, dateEvents);
  }

  return getMonthGrid(currentMonth).map((date) => {
    const dateKey = formatDateKey(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return {
      key: dateKey,
      dayNumber: String(date.getDate()),
      muted: !isCurrentMonth,
      events: isCurrentMonth ? eventsByDate.get(dateKey) : undefined,
    };
  });
}

function getFestivalSearchTerms(query: string) {
  return normalizeSearchQuery(query)
    .toLowerCase()
    .replace(/muziekfestival/g, "")
    .replace(/food festival/g, "food")
    .replace(/festivals?/g, "")
    .split(" ")
    .map((term) => term.trim())
    .filter(Boolean);
}

export function matchesFestivalCalendarSearch(
  event: FestivalCalendarEvent,
  query: string
) {
  const searchTerms = getFestivalSearchTerms(query);

  if (searchTerms.length === 0) return true;

  const searchableEvent = [event.label, ...event.genres].join(" ").toLowerCase();

  return searchTerms.some((term) => searchableEvent.includes(term));
}
