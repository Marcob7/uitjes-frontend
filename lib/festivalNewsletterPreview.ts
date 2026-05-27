export type FestivalNewsletterSource = {
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  dateLabel?: string | null;
  date_text?: string | null;
  locationLabel?: string | null;
  city?: string | null;
  venue?: string | null;
  summary?: string | null;
  description?: string | null;
  introParagraphs?: string[] | null;
  genres?: string[] | null;
  href?: string | null;
  url?: string | null;
  ticket_url?: string | null;
};

export type FestivalNewsletterBlock = {
  title: string;
  dateLabel?: string;
  locationLabel?: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export type FestivalNewsletterPreview = {
  subject: string;
  intro: string;
  festivals: FestivalNewsletterBlock[];
  closing: string;
  plainText: string;
};

const FALLBACK_SUBJECT = "Festival Pulse: nieuwe tips staan klaar";
const FALLBACK_INTRO =
  "Er zijn nog geen festivals geselecteerd voor deze preview. Kies 3 tot 5 festivals om een nieuwsbriefvoorstel te maken.";
const FALLBACK_CLOSING =
  "Tot snel, en bewaar je favoriete festivalmomenten alvast.";

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

function getTitle(festival: FestivalNewsletterSource) {
  return cleanText(festival.name) || cleanText(festival.title) || "Festivaltip";
}

function getDateLabel(festival: FestivalNewsletterSource) {
  return cleanText(festival.dateLabel) || cleanText(festival.date_text);
}

function getLocationLabel(festival: FestivalNewsletterSource) {
  return (
    cleanText(festival.locationLabel) ||
    cleanText(festival.venue) ||
    cleanText(festival.city)
  );
}

function getDescription(festival: FestivalNewsletterSource) {
  const intro = Array.isArray(festival.introParagraphs)
    ? festival.introParagraphs.find(isUsefulText)
    : "";
  const direct =
    cleanText(festival.summary) || cleanText(festival.description) || cleanText(intro);

  if (direct) return truncateText(direct, 190);

  const genres = Array.isArray(festival.genres)
    ? festival.genres.filter(isUsefulText).slice(0, 3)
    : [];
  const location = getLocationLabel(festival);

  if (genres.length && location) {
    return `Een festivalmoment rond ${joinReadable(genres)} in ${location}.`;
  }

  if (genres.length) {
    return `Een festivalmoment rond ${joinReadable(genres)}.`;
  }

  return "Een geselecteerde festivalhighlight voor de komende editie.";
}

function getHref(festival: FestivalNewsletterSource) {
  const direct =
    cleanText(festival.href) ||
    cleanText(festival.url) ||
    cleanText(festival.ticket_url);

  if (direct) return direct;

  const slug = cleanText(festival.slug);
  return slug ? `/festivals/${slug}` : "/festivals/lijst";
}

function buildPlainText(preview: Omit<FestivalNewsletterPreview, "plainText">) {
  const festivalText = preview.festivals
    .map((festival) => {
      const meta = [festival.dateLabel, festival.locationLabel]
        .filter(isUsefulText)
        .join(" - ");

      return [
        festival.title,
        meta,
        festival.description,
        `${festival.ctaLabel}: ${festival.href}`,
      ]
        .filter(isUsefulText)
        .join("\n");
    })
    .join("\n\n");

  return [
    `Onderwerp: ${preview.subject}`,
    preview.intro,
    festivalText,
    preview.closing,
  ]
    .filter(isUsefulText)
    .join("\n\n");
}

export function buildFestivalNewsletterPreview(
  festivals: FestivalNewsletterSource[]
): FestivalNewsletterPreview {
  const blocks = festivals.slice(0, 5).map<FestivalNewsletterBlock>((festival) => ({
    title: getTitle(festival),
    dateLabel: getDateLabel(festival) || undefined,
    locationLabel: getLocationLabel(festival) || undefined,
    description: getDescription(festival),
    ctaLabel: "Bekijk festival",
    href: getHref(festival),
  }));

  if (blocks.length === 0) {
    const emptyPreview = {
      subject: FALLBACK_SUBJECT,
      intro: FALLBACK_INTRO,
      festivals: [],
      closing: FALLBACK_CLOSING,
    };

    return {
      ...emptyPreview,
      plainText: buildPlainText(emptyPreview),
    };
  }

  const featuredNames = joinReadable(blocks.slice(0, 3).map((festival) => festival.title));
  const preview = {
    subject: `Festival Pulse: ${featuredNames}`,
    intro: `Deze week selecteren we ${blocks.length} festivalhighlights die de moeite waard zijn om alvast te plannen.`,
    festivals: blocks,
    closing: FALLBACK_CLOSING,
  };

  return {
    ...preview,
    plainText: buildPlainText(preview),
  };
}
