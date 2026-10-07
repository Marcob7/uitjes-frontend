export type EventDateRange = {
  startAt: string | Date;
  endAt?: string | Date;
};

import { formatDate } from "@/lib/i18n/format";
import { getCommonMessages } from "@/lib/i18n/messages";
import { localeToIntl, type Locale } from "@/lib/i18n/config";


function toLocalCalendarDate(value: string | Date): Date | null {
  if (typeof value === "string") {
    // Date-only values represent a calendar day. Parsing them with `new Date`
    // would interpret them as UTC and can move them to the previous local day.
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));

      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }
  }

  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addCalendarDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isSameCalendarDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function dateRange(range: EventDateRange) {
  const start = toLocalCalendarDate(range.startAt);
  const providedEnd = range.endAt ? toLocalCalendarDate(range.endAt) : null;

  if (!start) return null;

  return {
    start,
    end: providedEnd && providedEnd >= start ? providedEnd : start,
  };
}

function formatDateRange(start: Date, end: Date, locale: Locale) {
  if (isSameCalendarDate(start, end)) return formatDate(start, locale);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()}–${formatDate(end, locale)}`;
  }

  if (sameYear) {
    const startWithoutYear = new Intl.DateTimeFormat(localeToIntl[locale], {
      day: "numeric",
      month: "long",
    }).format(start);
    return `${startWithoutYear}–${formatDate(end, locale)}`;
  }

  return `${formatDate(start, locale)}–${formatDate(end, locale)}`;
}

/**
 * The relevant weekend is Friday through Sunday. From Monday through Thursday
 * it means the upcoming Friday–Sunday; on Friday through Sunday it means the
 * weekend currently in progress. An event only qualifies when its full date
 * range intersects that window.
 */
function getRelevantWeekend(today: Date) {
  const day = today.getDay();
  const daysToFriday = day === 0 ? -2 : day === 6 ? -1 : 5 - day;
  const start = addCalendarDays(today, daysToFriday);

  return { start, end: addCalendarDays(start, 2) };
}

/**
 * Returns a truthful Dutch label for an event's local calendar-date range.
 * Relative labels have deliberate precedence: Vandaag, Morgen, Dit weekend,
 * then an unambiguous concrete date range.
 */
export function getRelativeEventLabel(
  range: EventDateRange,
  now?: Date,
  locale: Locale = "nl",
): string {
  const dates = dateRange(range);
  const copy = getCommonMessages(locale).date;
  if (!dates) return copy.pending;

  // Rendering without a browser-local clock (for example during SSR) stays
  // honest by using the concrete date until the client supplies `now`.
  if (!now) return formatDateRange(dates.start, dates.end, locale);

  const today = toLocalCalendarDate(now);
  if (!today) return formatDateRange(dates.start, dates.end, locale);

  if (dates.start <= today && dates.end >= today) return copy.today;

  const tomorrow = addCalendarDays(today, 1);
  if (isSameCalendarDate(dates.start, tomorrow)) return copy.tomorrow;

  const weekend = getRelevantWeekend(today);
  if (dates.start <= weekend.end && dates.end >= weekend.start) {
    return copy.thisWeekend;
  }

  return formatDateRange(dates.start, dates.end, locale);
}
