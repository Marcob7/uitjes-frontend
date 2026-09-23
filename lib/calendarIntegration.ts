export type CalendarEvent = {
  title: string;
  start: Date;
  end?: Date;
  isAllDay: boolean;
  location?: string;
  description?: string;
  url?: string;
  uid: string;
};

/** A serializable calendar event used at server/client boundaries. */
export type CalendarEventInput = {
  title: string;
  startAt?: string | null;
  endAt?: string | null;
  location?: string | null;
  description?: string | null;
  url?: string | null;
  uid: string;
};

function parseStructuredDate(value?: string | null) {
  if (!value) return null;
  // Date labels and opening-hours text are deliberately not accepted here.
  // Only an ISO date or ISO date-time from a structured data field is valid.
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isCalendarExportable(event: CalendarEventInput) {
  return Boolean(event.title.trim() && parseStructuredDate(event.startAt));
}

export function toCalendarEvent(event: CalendarEventInput): CalendarEvent | null {
  const start = parseStructuredDate(event.startAt);
  if (!start || !event.title.trim()) return null;
  const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(event.startAt ?? "");
  const end = isAllDay ? undefined : parseStructuredDate(event.endAt);
  return {
    title: event.title,
    start,
    end: end && end > start ? end : undefined,
    isAllDay,
    location: event.location || undefined,
    description: event.description || undefined,
    url: event.url || undefined,
    uid: event.uid,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

function formatDate(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function formatUtcDateTime(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
    date.getUTCSeconds()
  )}Z`;
}

function formatLocalDateTime(date: Date) {
  return `${formatDate(date)}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let remaining = line;

  while (remaining.length > 72) {
    chunks.push(remaining.slice(0, 72));
    remaining = ` ${remaining.slice(72)}`;
  }

  return [...chunks, remaining].join("\r\n");
}

function descriptionWithUrl(event: CalendarEvent) {
  return [event.description, event.url].filter(Boolean).join("\n\n");
}

function safeEnd(event: CalendarEvent) {
  return event.end ?? new Date(event.start.getTime() + 2 * 60 * 60 * 1000);
}

export function buildGoogleCalendarHref(event: CalendarEvent) {
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title });
  const details = descriptionWithUrl(event);

  if (event.isAllDay) {
    const nextDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate() + 1);
    params.set("dates", `${formatDate(event.start)}/${formatDate(nextDay)}`);
  } else {
    params.set("dates", `${formatUtcDateTime(event.start)}/${formatUtcDateTime(safeEnd(event))}`);
  }
  if (details) params.set("details", details);
  if (event.location) params.set("location", event.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarHref(event: CalendarEvent) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
  });
  const details = descriptionWithUrl(event);

  if (event.isAllDay) {
    params.set("startdt", formatDate(event.start));
    params.set("enddt", formatDate(new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate() + 1)));
    params.set("allday", "true");
  } else {
    params.set("startdt", event.start.toISOString());
    params.set("enddt", safeEnd(event).toISOString());
  }
  if (details) params.set("body", details);
  if (event.location) params.set("location", event.location);

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function makeIcsCalendar(events: CalendarEvent[]) {
  const stamp = formatUtcDateTime(new Date());
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Uitjes NL//Agenda//NL", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];

  events.forEach((event) => {
    const details = descriptionWithUrl(event);
    lines.push("BEGIN:VEVENT", `UID:${escapeIcsText(event.uid)}`, `DTSTAMP:${stamp}`);
    if (event.isAllDay) {
      const nextDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${formatDate(event.start)}`, `DTEND;VALUE=DATE:${formatDate(nextDay)}`);
    } else {
      lines.push(`DTSTART:${formatLocalDateTime(event.start)}`, `DTEND:${formatLocalDateTime(safeEnd(event))}`);
    }
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    if (details) lines.push(`DESCRIPTION:${escapeIcsText(details)}`);
    if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    if (event.url) lines.push(`URL:${escapeIcsText(event.url)}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
