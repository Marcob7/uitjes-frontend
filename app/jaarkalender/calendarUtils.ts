import { normalizeCitySlug } from "@/lib/cityConfig";

import type { JaarkalenderCategoryKey, JaarkalenderDay } from "./data";

// Fixtures currently cover October 2024. This limits fixture lookup only; it
// never determines the month presented to a visitor.
const JAARKALENDER_DATA_YEAR = 2024;
const JAARKALENDER_DATA_MONTH = 9;

export function getCityFromLocation(location: string) {
  return location.split(",").at(-1)?.trim() ?? location;
}

export function isSameMonth(date: Date, monthDate: Date) {
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}

export function isSameDay(date: Date, dayDate: Date) {
  return date.getFullYear() === dayDate.getFullYear() && date.getMonth() === dayDate.getMonth() && date.getDate() === dayDate.getDate();
}

export function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();
  const dates: Date[] = [];

  for (let index = startDay; index > 0; index -= 1) dates.push(new Date(year, month, 1 - index));
  for (let day = 1; day <= totalDays; day += 1) dates.push(new Date(year, month, day));
  while (dates.length % 7 !== 0) {
    dates.push(new Date(year, month + 1, dates.length - (startDay + totalDays) + 1));
  }
  return dates;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getMonthInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getCurrentLocalMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getMonthFromInputValue(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return null;
  const [year, month] = value.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);
  return year >= 1 && month >= 1 && month <= 12 && monthDate.getFullYear() === year && monthDate.getMonth() === month - 1
    ? monthDate
    : null;
}

export function getMonthFromUrl(value: string | null, fallbackMonth: Date) {
  return value ? getMonthFromInputValue(value) ?? fallbackMonth : fallbackMonth;
}

export function hasJaarkalenderDataForMonth(date: Date) {
  return date.getFullYear() === JAARKALENDER_DATA_YEAR && date.getMonth() === JAARKALENDER_DATA_MONTH;
}

export function getJaarkalenderDayForDate(date: Date, daysByNumber: Map<number, JaarkalenderDay>) {
  return hasJaarkalenderDataForMonth(date) ? daysByNumber.get(date.getDate()) ?? null : null;
}

export function filterCalendarItems(
  items: JaarkalenderDay["calendarItems"],
  selectedCity: string | null,
  selectedCategory: JaarkalenderCategoryKey | null
) {
  return items.filter((item) => (
    (!selectedCity || normalizeCitySlug(getCityFromLocation(item.locatie)) === normalizeCitySlug(selectedCity)) &&
    (!selectedCategory || item.categorie === selectedCategory)
  ));
}
