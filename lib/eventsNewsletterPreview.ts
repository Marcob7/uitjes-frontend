export type EventsNewsletterSource = {
  slug?: string | null;
  title?: string | null;
  name?: string | null;
  dateLabel?: string | null;
  datum?: string | null;
  time?: string | null;
  locationLabel?: string | null;
  location?: string | null;
  locatie?: string | null;
  city?: string | null;
  venue?: string | null;
  category?: string | null;
  categorie?: string | null;
  summary?: string | null;
  description?: string | null;
  href?: string | null;
  url?: string | null;
};

export type EventsNewsletterBlock = {
  title: string;
  dateTimeLabel?: string;
  locationLabel?: string;
  categoryLabel?: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export type EventsNewsletterPreview = {
  subject: string;
  intro: string;
  events: EventsNewsletterBlock[];
  closing: string;
  plainText: string;
};

const FALLBACK_SUBJECT = "Weekly Pulse: nieuwe uitjes staan klaar";
const FALLBACK_INTRO =
  "Er zijn nog geen evenementen geselecteerd voor deze preview. Kies een paar jaarkalender-items om een nieuwsbriefvoorstel te maken.";
const FALLBACK_CLOSING =
  "Veel plezier met plannen. Bewaar je favorieten alvast voor later.";

function isUsefulText(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return (
    normalized.length > 0 &&
    normalized !== "undefined" &&
    normalized !== "null" &&
    normalized !== "nan" &&
    normalized !== "n/a"
  );
}

function cleanText(value: unknown) {
  return isUsefulText(value) ? value.trim() : "";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength - 1).trimEnd();
  return `${truncated}.`;
}

function joinReadable(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} en ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} en ${items[items.length - 1]}`;
}

function getTitle(event: EventsNewsletterSource) {
  return cleanText(event.title) || cleanText(event.name) || "Evenemententip";
}

function getDateTimeLabel(event: EventsNewsletterSource) {
  const dateLabel = cleanText(event.dateLabel) || cleanText(event.datum);
  const time = cleanText(event.time);

  if (dateLabel && time && !dateLabel.includes(time)) {
    return `${dateLabel} - ${time}`;
  }

  return dateLabel || time;
}

function getLocationLabel(event: EventsNewsletterSource) {
  return (
    cleanText(event.locationLabel) ||
    cleanText(event.location) ||
    cleanText(event.locatie) ||
    cleanText(event.venue) ||
    cleanText(event.city)
  );
}

function getCategoryLabel(event: EventsNewsletterSource) {
  return cleanText(event.category) || cleanText(event.categorie);
}

function getDescription(event: EventsNewsletterSource) {
  const direct = cleanText(event.summary) || cleanText(event.description);

  if (direct) return truncateText(direct, 190);

  const category = getCategoryLabel(event);
  const location = getLocationLabel(event);

  if (category && location) {
    return `Een geselecteerde ${category.toLowerCase()}-tip op ${location}.`;
  }

  if (category) {
    return `Een geselecteerde ${category.toLowerCase()}-tip uit de jaarkalender.`;
  }

  return "Een geselecteerde jaarkalender-tip voor je volgende vrije moment.";
}

function getHref(event: EventsNewsletterSource) {
  const direct = cleanText(event.href) || cleanText(event.url);

  if (direct) return direct;

  const slug = cleanText(event.slug);
  return slug ? `/jaarkalender/${slug}` : "/jaarkalender";
}

function buildPlainText(preview: Omit<EventsNewsletterPreview, "plainText">) {
  const eventsText = preview.events
    .map((event) => {
      const meta = [
        event.dateTimeLabel,
        event.locationLabel,
        event.categoryLabel,
      ]
        .filter(isUsefulText)
        .join(" - ");

      return [
        event.title,
        meta,
        event.description,
        `${event.ctaLabel}: ${event.href}`,
      ]
        .filter(isUsefulText)
        .join("\n");
    })
    .join("\n\n");

  return [
    `Onderwerp: ${preview.subject}`,
    preview.intro,
    eventsText,
    preview.closing,
  ]
    .filter(isUsefulText)
    .join("\n\n");
}

export function buildEventsNewsletterPreview(
  events: EventsNewsletterSource[]
): EventsNewsletterPreview {
  const blocks = events.slice(0, 5).map<EventsNewsletterBlock>((event) => ({
    title: getTitle(event),
    dateTimeLabel: getDateTimeLabel(event) || undefined,
    locationLabel: getLocationLabel(event) || undefined,
    categoryLabel: getCategoryLabel(event) || undefined,
    description: getDescription(event),
    ctaLabel: "Bekijk uitje",
    href: getHref(event),
  }));

  if (blocks.length === 0) {
    const emptyPreview = {
      subject: FALLBACK_SUBJECT,
      intro: FALLBACK_INTRO,
      events: [],
      closing: FALLBACK_CLOSING,
    };

    return {
      ...emptyPreview,
      plainText: buildPlainText(emptyPreview),
    };
  }

  const featuredNames = joinReadable(blocks.slice(0, 3).map((event) => event.title));
  const preview = {
    subject: `Weekly Pulse: ${featuredNames}`,
    intro: `Deze editie bundelt ${blocks.length} jaarkalender-tips voor cultuur, muziek en lokale momenten die je makkelijk vooruit kunt plannen.`,
    events: blocks,
    closing: FALLBACK_CLOSING,
  };

  return {
    ...preview,
    plainText: buildPlainText(preview),
  };
}
