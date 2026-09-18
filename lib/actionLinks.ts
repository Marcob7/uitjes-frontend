import { buildGoogleCalendarHref as buildCalendarHref } from "@/lib/calendarIntegration";

type CalendarLinkInput = {
  title: string;
  details?: string;
  location?: string;
  start: Date;
  end?: Date;
};

function normalizeParts(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
}

export function buildWebSearchHref(parts: Array<string | null | undefined>) {
  const query = normalizeParts(parts).join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function buildMapsSearchHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query.trim()
  )}`;
}

export function buildActionSearchHref(options: {
  title: string;
  location?: string;
  actionLabel?: string;
  extraTerms?: string[];
}) {
  const { title, location, actionLabel, extraTerms = [] } = options;

  return buildWebSearchHref([title, location, actionLabel, ...extraTerms]);
}

export function buildTicketSearchHref(title: string, location?: string) {
  return buildActionSearchHref({
    title,
    location,
    actionLabel: "tickets",
    extraTerms: ["reserveren"],
  });
}

export function buildGoogleCalendarHref({
  title,
  details,
  location,
  start,
  end,
}: CalendarLinkInput) {
  return buildCalendarHref({
    title,
    start,
    end,
    isAllDay: false,
    location,
    description: details,
    uid: `uitjes-${start.getTime()}@uitjes-nl.local`,
  });
}
