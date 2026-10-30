import { cityOptions as sharedCityOptions } from "@/lib/cityConfig";
import { isCityContentCity } from "@/lib/cityContentCities";

import {
  filterCalendarItems,
  getCityFromLocation,
  getJaarkalenderDayForDate,
  getMonthGrid,
  hasJaarkalenderDataForMonth,
  isSameDay,
  isSameMonth,
} from "./calendarUtils";
import {
  getJaarkalenderCalendarItemsForDate,
  jaarkalenderDays,
  type JaarkalenderCategoryKey,
} from "./data";

export type MonthCalendarCell = {
  key: string;
  day: string;
  dayNumber?: number;
  monthLabel?: string;
  muted?: boolean;
  href?: string;
  eventCount?: number;
  eventLabels?: string[];
  isToday?: boolean;
};

export type CalendarCityOption = {
  label: string;
  hasCalendarItems: boolean;
  hasBackendContent: boolean;
};

const MONTH_SHORT_NAMES = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

const daysByNumber = new Map(
  jaarkalenderDays.map((day) => [day.dayNumber, day]),
);

const calendarCities = new Set(
  jaarkalenderDays.flatMap((day) =>
    day.calendarItems.map((item) => getCityFromLocation(item.locatie)),
  ),
);

export const calendarCityOptions: CalendarCityOption[] = sharedCityOptions.map(
  (city) => ({
    label: city.label,
    hasCalendarItems: calendarCities.has(city.label),
    hasBackendContent: isCityContentCity(city.value),
  }),
);

type CalendarFilters = {
  selectedCity: string | null;
  selectedCategory: JaarkalenderCategoryKey | null;
};

/** Builds the presentational grid model without React, URL, or DOM state. */
export function buildMonthCalendarCells(
  selectedMonth: Date,
  today: Date,
  { selectedCity, selectedCategory }: CalendarFilters,
): MonthCalendarCell[] {
  return getMonthGrid(selectedMonth).map((date) => {
    const isCurrentMonth = isSameMonth(date, selectedMonth);
    const isToday = isCurrentMonth && isSameDay(date, today);
    const day = getJaarkalenderDayForDate(date, daysByNumber);

    if (!isCurrentMonth || !day) {
      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        day: String(date.getDate()),
        dayNumber: isCurrentMonth ? date.getDate() : undefined,
        monthLabel: isCurrentMonth
          ? undefined
          : MONTH_SHORT_NAMES[date.getMonth()],
        muted: !isCurrentMonth,
        isToday,
      };
    }

    const filteredItems = filterCalendarItems(
      getJaarkalenderCalendarItemsForDate(date),
      selectedCity,
      selectedCategory,
    );

    return {
      key: `day-${day.dayNumber}`,
      day: String(day.dayNumber),
      dayNumber: day.dayNumber,
      href: `/jaarkalender/${day.slug}`,
      eventCount: filteredItems.length,
      eventLabels: filteredItems.slice(0, 2).map((item) => item.title),
      isToday,
    };
  });
}

export function getVisibleCalendarImportEvents(
  selectedMonth: Date,
  { selectedCity, selectedCategory }: CalendarFilters,
) {
  if (!hasJaarkalenderDataForMonth(selectedMonth)) {
    return [];
  }

  return jaarkalenderDays.flatMap((day) =>
    filterCalendarItems(
      getJaarkalenderCalendarItemsForDate(
        new Date(`${day.isoDate}T12:00:00`),
      ),
      selectedCity,
      selectedCategory,
    ).map((item) => ({
      dayIsoDate: day.isoDate,
      daySlug: day.slug,
      item,
    })),
  );
}
