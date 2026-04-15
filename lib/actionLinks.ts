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

function formatGoogleCalendarDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
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
  const safeEnd = end ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(
      safeEnd
    )}`,
  });

  if (details) {
    params.set("details", details);
  }

  if (location) {
    params.set("location", location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
