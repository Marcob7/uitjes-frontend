import { getCityConfig } from "@/lib/cityConfig";
import {
  APELDOORN_DUMMY_EVENTS,
  CITY_EDITORIAL_CONTENT,
  HAARLEM_CALENDAR_EVENTS,
  HAARLEM_DUMMY_EVENTS,
  MONTH_NAMES,
  mockCardsByCategory,
} from "./data";
import type {
  BackendEvent,
  CalendarEvent,
  CategoryKey,
  EditorialContent,
  ExploreCard,
  IconicCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
  ResultFilterKey,
  SafeCityTheme,
} from "./types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getEventsWithFallback(city: string, events?: BackendEvent[]) {
  if (events && events.length > 0) {
    return events;
  }

  const normalizedCity = city.toLowerCase();

  if (normalizedCity === "haarlem") {
    return HAARLEM_DUMMY_EVENTS;
  }

  if (normalizedCity === "apeldoorn") {
    return APELDOORN_DUMMY_EVENTS;
  }

  return [];
}

function formatCityLabel(city: string) {
  return city
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCityEditorialContent(city: string): EditorialContent {
  const normalizedCity = city.toLowerCase();
  const directMatch = CITY_EDITORIAL_CONTENT[normalizedCity];

  if (directMatch) {
    return directMatch;
  }

  const cityLabel = formatCityLabel(city);

  return {
    ...CITY_EDITORIAL_CONTENT.default,
    editionTag: `${cityLabel.toUpperCase()} EDITION`,
    titleIntro: "Vind de",
    titleAccent: "frisse",
    titleOutro: `momenten van ${cityLabel}.`,
    intro: `Van culturele stops tot lokale favorieten. Wij zetten de mooiste momenten van ${cityLabel} klaar, zodat je sneller uitkomt bij een plan dat echt bij de stad past.`,
    featureCards: CITY_EDITORIAL_CONTENT.default.featureCards.map((card) => ({
      ...card,
      description: card.description.replace("de stad", cityLabel),
    })),
  };
}

function hexToRgb(hex: string) {
  const normalized = (hex || "#000000").replace("#", "");
  const fallback = "000000";
  const safeValue = /^[0-9a-fA-F]{6}$/.test(normalized)
    ? normalized
    : fallback;

  return {
    red: parseInt(safeValue.slice(0, 2), 16),
    green: parseInt(safeValue.slice(2, 4), 16),
    blue: parseInt(safeValue.slice(4, 6), 16),
  };
}

function srgbToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(hex: string) {
  const { red, green, blue } = hexToRgb(hex);
  const r = srgbToLinear(red);
  const g = srgbToLinear(green);
  const b = srgbToLinear(blue);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLiquidPaletteDark(theme: SafeCityTheme) {
  const deep = getRelativeLuminance(theme.liquid.deep);
  const mid = getRelativeLuminance(theme.liquid.mid);
  const highlight = getRelativeLuminance(theme.liquid.highlight);
  const weightedLuminance = deep * 0.48 + mid * 0.36 + highlight * 0.16;

  return weightedLuminance < 0.24;
}

export function getSafeCityTheme(city: string): SafeCityTheme {
  const normalizedCity = city.toLowerCase();

  if (normalizedCity === "haarlem") {
    return {
      slug: "haarlem",
      label: "Haarlem",
      description:
        "Van historische musea tot moderne jazz-avonden aan het water. Wij cureren de meest authentieke ervaringen in de stad van de bloemen.",
      heroImage: "/images/apeldoorn_img.jpg",
      fallbackImage: "/images/apeldoorn_img.jpg",
      liquid: {
        deep: "#173822",
        mid: "#5f8a32",
        highlight: "#d8f2b5",
      },
      colors: {
        pageBackground: "#f8f4ee",
        softSurface: "#fbf7f1",
        accent: "#b8ea72",
        accentText: "#20301a",
        heading: "#111111",
        text: "#4f493f",
        mutedSurface: "#f2e7db",
      },
    };
  }

  try {
    const config = getCityConfig(city) as Partial<SafeCityTheme> | undefined;

    return {
      slug: config?.slug || normalizedCity,
      label: config?.label || city.charAt(0).toUpperCase() + city.slice(1),
      description:
        config?.description ||
        `Ontdek bijzondere plekken, culturele highlights en lokale favorieten in ${city}.`,
      heroImage: config?.heroImage || "/images/apeldoorn_img.jpg",
      fallbackImage: config?.fallbackImage || "/images/apeldoorn_img.jpg",
      liquid: {
        deep: config?.liquid?.deep || "#132016",
        mid: config?.liquid?.mid || "#4f7a45",
        highlight: config?.liquid?.highlight || "#d9f0d0",
      },
      colors: {
        pageBackground: config?.colors?.pageBackground || "#f8f4ee",
        softSurface: config?.colors?.softSurface || "#fbf7f1",
        accent: config?.colors?.accent || "#b8ea72",
        accentText: config?.colors?.accentText || "#20301a",
        heading: config?.colors?.heading || "#111111",
        text: config?.colors?.text || "#4f493f",
        mutedSurface: config?.colors?.mutedSurface || "#f2e7db",
      },
    };
  } catch {
    return {
      slug: normalizedCity,
      label: city.charAt(0).toUpperCase() + city.slice(1),
      description: `Ontdek bijzondere plekken, culturele highlights en lokale favorieten in ${city}.`,
      heroImage: "/images/apeldoorn_img.jpg",
      fallbackImage: "/images/apeldoorn_img.jpg",
      liquid: {
        deep: "#132016",
        mid: "#4f7a45",
        highlight: "#d9f0d0",
      },
      colors: {
        pageBackground: "#f8f4ee",
        softSurface: "#fbf7f1",
        accent: "#b8ea72",
        accentText: "#20301a",
        heading: "#111111",
        text: "#4f493f",
        mutedSurface: "#f2e7db",
      },
    };
  }
}

export function getCalendarEventsForCity(city: string) {
  if (city.toLowerCase() === "haarlem") {
    return HAARLEM_CALENDAR_EVENTS;
  }

  return HAARLEM_CALENDAR_EVENTS;
}

export function formatCityTitle(cityLabel: string) {
  return `${cityLabel} Discovery`;
}

export function formatIntro(cityLabel: string, fallbackDescription?: string) {
  if (fallbackDescription) return fallbackDescription;
  return `Ontdek bijzondere plekken, culturele highlights en lokale favorieten in ${cityLabel}.`;
}

export function formatVenue(venue: string | null | undefined, cityLabel: string) {
  if (!venue || venue.toLowerCase() === "nan") {
    return cityLabel;
  }

  return venue;
}

export function formatTimeRange(startAt: string | null, endAt: string | null) {
  if (!startAt) return "Tijd volgt";

  const start = new Date(startAt);
  const startTime = start.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endAt) return startTime;

  const end = new Date(endAt);
  const endTime = end.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

function formatPrice(event: BackendEvent) {
  if (event.price_note?.trim()) {
    return event.price_note.trim();
  }

  if (event.is_free || event.price_min === 0) {
    return "Gratis";
  }

  if (typeof event.price_min === "number") {
    return `€ ${event.price_min.toFixed(2).replace(".", ",")}`;
  }

  return undefined;
}

function formatDistance(event: BackendEvent) {
  if (typeof event.walk_minutes === "number") {
    return `${event.walk_minutes} min lopen`;
  }

  return "Centraal gelegen";
}

function formatStatus(event: BackendEvent) {
  if (event.status) {
    return event.status;
  }

  if (event.is_ongoing) {
    return "Nu bezig";
  }

  if (event.date_text) {
    return event.date_text;
  }

  return "Plan dit moment";
}

function normalizeRatingValue(value: unknown, maxValue: number | null = 5) {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    return value > 0 && value <= (maxValue ?? 5) ? value : null;
  }

  if (typeof value !== "string") return null;

  const match = value.trim().match(/\d+(?:[,.]\d+)?/);
  if (!match) return null;

  const numericValue = Number(match[0].replace(",", "."));
  if (!Number.isFinite(numericValue)) return null;

  return numericValue > 0 && numericValue <= (maxValue ?? 5) ? numericValue : null;
}

function normalizeReviewCount(value: unknown) {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return null;
    return Math.floor(value);
  }

  if (typeof value !== "string") return null;

  const cleaned = value.trim();
  if (!/^\d+(?:[.\s]\d{3})*$/.test(cleaned)) return null;

  const numericValue = Number(cleaned.replace(/[.\s]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function sortEventsByStartDate(events: BackendEvent[]) {
  return [...events].sort((a, b) => {
    const aTime = a.start_at
      ? new Date(a.start_at).getTime()
      : Number.POSITIVE_INFINITY;
    const bTime = b.start_at
      ? new Date(b.start_at).getTime()
      : Number.POSITIVE_INFINITY;

    return aTime - bTime;
  });
}

function getEventPriorityScore(event: BackendEvent) {
  return typeof event.priority_score === "number" ? event.priority_score : 0;
}

function isHighlightedEvent(event: BackendEvent) {
  return Boolean(
    event.featured ||
      event.is_featured ||
      event.editors_pick ||
      event.hidden_gem ||
      event.is_hidden_gem ||
      getEventPriorityScore(event) >= 80
  );
}

export function sortEventsByHighlightAndStartDate(events: BackendEvent[]) {
  return [...events].sort((a, b) => {
    const highlightDiff =
      Number(isHighlightedEvent(b)) - Number(isHighlightedEvent(a));

    if (highlightDiff !== 0) {
      return highlightDiff;
    }

    const priorityDiff = getEventPriorityScore(b) - getEventPriorityScore(a);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const aTime = a.start_at
      ? new Date(a.start_at).getTime()
      : Number.POSITIVE_INFINITY;
    const bTime = b.start_at
      ? new Date(b.start_at).getTime()
      : Number.POSITIVE_INFINITY;

    return aTime - bTime;
  });
}

export function buildExploreCards(
  activeTab: CategoryKey,
  events: BackendEvent[],
  cityLabel: string,
  fallbackImage: string,
  useMockFallback = true,
  citySlug?: string
): ExploreCard[] {
  if (activeTab !== "events") {
    return mockCardsByCategory[activeTab];
  }

  if (!events?.length) {
    return useMockFallback
      ? mockCardsByCategory.events.map((card) => ({
          ...card,
          href: appendCityToExploreHref(card.href, citySlug),
        }))
      : [];
  }

  return sortEventsByHighlightAndStartDate(events).map((event) => {
    const ratingMax = normalizeRatingValue(
      event.rating_max,
      Number.POSITIVE_INFINITY
    ) ?? 5;

    return {
      id: event.id,
      eventId: !useMockFallback && Number.isFinite(event.id) && event.id > 0 ? event.id : null,
      title: event.title || "Onbekend event",
      label: event.category_label || (event.is_free ? "Free event" : "Event"),
      time: formatTimeRange(event.start_at, event.end_at),
      location: formatVenue(event.venue, cityLabel),
      image: event.image || null,
      imageAlt: event.imageAlt,
      href: appendCityToExploreHref(
        `/ontdek/${event.slug || slugify(event.title || `event-${event.id}`)}`,
        event.city || citySlug
      ),
      description:
        event.summary ||
        "Een zorgvuldig geselecteerd moment dat goed past in een spontane stadsdag.",
      price: formatPrice(event),
      distance: formatDistance(event),
      status: formatStatus(event),
      rating: normalizeRatingValue(event.rating),
      ratingValue: normalizeRatingValue(event.rating_value, ratingMax),
      reviewCount: normalizeReviewCount(event.review_count),
      ratingSource: event.rating_source ?? null,
      ratingMax,
      priorityScore: event.priority_score ?? null,
      featured: Boolean(event.featured || event.is_featured),
      editorsPick: Boolean(event.editors_pick),
      hiddenGem: Boolean(event.hidden_gem || event.is_hidden_gem),
      startAt: event.start_at,
      endAt: event.end_at,
      isOngoing: event.is_ongoing,
      kind: event.kind,
      tags: event.tags,
      audiences: event.audiences,
      moments: event.moments,
      vibes: event.vibes,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
    };
  });
}

function appendCityToExploreHref(href: string, city?: string | null) {
  if (!city || !href.startsWith("/ontdek/")) {
    return href;
  }

  const cityParam = slugify(city);
  if (!cityParam) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}city=${encodeURIComponent(cityParam)}`;
}

type PlannerFilterItem = {
  title?: string | null;
  label?: string | null;
  category_label?: string | null;
  kind?: string | null;
  location?: string | null;
  venue?: string | null;
  description?: string | null;
  summary?: string | null;
  price?: string | null;
  price_min?: number | null;
  status?: string | null;
  date_text?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  is_free?: boolean;
  is_ongoing?: boolean;
  isOngoing?: boolean;
  tags?: string[];
  audiences?: PlannerCompanion[];
  moments?: PlannerMoment[];
  vibes?: PlannerVibe[];
};

const RESULT_FILTERS = {
  food_drink: {
    label: "Eten & drinken",
    description: "Kind food_drink of duidelijke horeca/food-signalen.",
  },
  outings: {
    label: "Uitjes",
    description: "Kind outings of items die niet als food_drink zijn gemarkeerd.",
  },
  free: {
    label: "Gratis",
    description: "is_free, prijs 0 of prijstekst met gratis/free.",
  },
  now: {
    label: "Nu",
    description: "Dezelfde momentlogica als CityFormSelect: Nu.",
  },
  evening: {
    label: "Vanavond",
    description: "Dezelfde momentlogica als CityFormSelect: Vanavond.",
  },
  culture: {
    label: "Cultureel",
    description: "Dezelfde sfeerlogica als CityFormSelect: Cultureel.",
  },
  active: {
    label: "Actief/buiten",
    description: "Dezelfde sfeerlogica als CityFormSelect: Actief.",
  },
} satisfies Record<ResultFilterKey, { label: string; description: string }>;

const RESULT_FILTER_GROUPS: Record<ResultFilterKey, "kind" | "price" | "moment" | "vibe"> = {
  food_drink: "kind",
  outings: "kind",
  free: "price",
  now: "moment",
  evening: "moment",
  culture: "vibe",
  active: "vibe",
};

export const RESULT_FILTER_OPTIONS = Object.entries(RESULT_FILTERS).map(
  ([id, filter]) => ({
    id: id as ResultFilterKey,
    label: filter.label,
    description: filter.description,
  })
);

function normalizeFilterText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildFilterText(item: PlannerFilterItem) {
  return normalizeFilterText(
    [
      item.title,
      item.label,
      item.category_label,
      item.kind,
      item.location,
      item.venue,
      item.description,
      item.summary,
      item.price,
      item.status,
      item.date_text,
      ...(item.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function textHasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function inferAudienceMatch(item: PlannerFilterItem, companion: PlannerCompanion) {
  const text = buildFilterText(item);

  switch (companion) {
    case "gezin":
      return textHasAny(text, [
        "gezin",
        "familie",
        "kind",
        "kinderen",
        "speel",
        "workshop",
      ]);
    case "vrienden":
      return textHasAny(text, [
        "vrienden",
        "muziek",
        "festival",
        "bar",
        "borrel",
        "drank",
        "bier",
        "markt",
        "actief",
      ]);
    case "solo":
      return textHasAny(text, [
        "solo",
        "museum",
        "kunst",
        "route",
        "wandeling",
        "expositie",
        "bibliotheek",
        "rondkijken",
      ]);
    default:
      return textHasAny(text, [
        "date",
        "avond",
        "restaurant",
        "diner",
        "terras",
        "film",
        "theater",
        "wandeling",
        "romant",
      ]);
  }
}

function getEventStart(item: PlannerFilterItem) {
  const startAt = item.start_at ?? item.startAt;
  if (!startAt) return null;

  const date = new Date(startAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isTomorrow(date: Date, now: Date) {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return isSameDate(date, tomorrow);
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function inferMomentMatch(item: PlannerFilterItem, moment: PlannerMoment) {
  const text = buildFilterText(item);
  const start = getEventStart(item);
  const flexiblePlace = !start && item.kind === "food_drink";
  const now = new Date();

  switch (moment) {
    case "nu":
      return (
        item.is_ongoing ||
        item.isOngoing ||
        flexiblePlace ||
        textHasAny(text, ["nu", "vandaag", "doorlopend"]) ||
        Boolean(start && isSameDate(start, now))
      );
    case "vanavond":
      return (
        textHasAny(text, ["avond", "vanavond", "diner", "borrel", "theater"]) ||
        Boolean(start && start.getHours() >= 17)
      );
    case "morgen":
      return (
        flexiblePlace ||
        textHasAny(text, ["morgen", "later plannen"]) ||
        Boolean(start && isTomorrow(start, now))
      );
    default:
      return (
        flexiblePlace ||
        textHasAny(text, ["weekend", "zaterdag", "zondag"]) ||
        Boolean(start && isWeekend(start))
      );
  }
}

function inferVibeMatch(item: PlannerFilterItem, vibe: PlannerVibe) {
  const text = buildFilterText(item);

  switch (vibe) {
    case "cultureel":
      return textHasAny(text, [
        "cultuur",
        "cultureel",
        "museum",
        "kunst",
        "theater",
        "erfgoed",
        "monument",
        "expositie",
        "galerie",
        "film",
        "histor",
      ]);
    case "actief":
      return textHasAny(text, [
        "actief",
        "buiten",
        "wandeling",
        "fiets",
        "route",
        "sport",
        "park",
        "natuur",
        "haven",
        "water",
        "tour",
      ]);
    case "eten-drinken":
      return (
        item.kind === "food_drink" ||
        textHasAny(text, [
          "eten",
          "drinken",
          "restaurant",
          "cafe",
          "lunch",
          "diner",
          "culinair",
          "proeverij",
          "terras",
          "food",
          "koffie",
          "borrel",
        ])
      );
    default:
      return textHasAny(text, [
        "relaxed",
        "rustig",
        "ontspannen",
        "park",
        "wandeling",
        "rondkijken",
        "koffie",
        "terras",
        "laagdrempelig",
      ]);
  }
}

function matchesPlannerSelections(
  item: PlannerFilterItem,
  selections: PlannerSelections
) {
  const matchesCompanion = !selections.companion || (
    item.audiences?.length
      ? item.audiences.includes(selections.companion)
      : inferAudienceMatch(item, selections.companion)
  );
  const matchesMoment = !selections.moment || (
    item.moments?.length
      ? item.moments.includes(selections.moment)
      : inferMomentMatch(item, selections.moment)
  );
  const matchesVibe = !selections.vibe || (
    item.vibes?.length
      ? item.vibes.includes(selections.vibe)
      : inferVibeMatch(item, selections.vibe)
  );

  return matchesCompanion && matchesMoment && matchesVibe;
}

function matchesPlannerProgress(
  item: PlannerFilterItem,
  selections: PlannerSelections,
  completedStepCount: number
) {
  if (completedStepCount < 1) return true;

  const matchesCompanion = !selections.companion || (
    item.audiences?.length
      ? item.audiences.includes(selections.companion)
      : inferAudienceMatch(item, selections.companion)
  );

  if (completedStepCount < 2) return matchesCompanion;

  const matchesMoment = !selections.moment || (
    item.moments?.length
      ? item.moments.includes(selections.moment)
      : inferMomentMatch(item, selections.moment)
  );

  if (completedStepCount < 3) return matchesCompanion && matchesMoment;

  const matchesVibe = !selections.vibe || (
    item.vibes?.length
      ? item.vibes.includes(selections.vibe)
      : inferVibeMatch(item, selections.vibe)
  );

  return matchesCompanion && matchesMoment && matchesVibe;
}

function isFreeItem(item: PlannerFilterItem) {
  if (item.is_free || item.price_min === 0) {
    return true;
  }

  const text = buildFilterText(item);
  return textHasAny(text, ["gratis", "free", "vrij entree", "0,00", "eur 0"]);
}

function matchesResultFilter(item: PlannerFilterItem, filter: ResultFilterKey) {
  const normalizedKind = item.kind?.toLowerCase() ?? "";

  switch (filter) {
    case "food_drink":
      return normalizedKind === "food_drink" || inferVibeMatch(item, "eten-drinken");
    case "outings":
      return normalizedKind === "outings" || normalizedKind !== "food_drink";
    case "free":
      return isFreeItem(item);
    case "now":
      return inferMomentMatch(item, "nu");
    case "evening":
      return inferMomentMatch(item, "vanavond");
    case "culture":
      return inferVibeMatch(item, "cultureel");
    case "active":
      return inferVibeMatch(item, "actief");
    default:
      return true;
  }
}

function matchesResultFilters(
  item: PlannerFilterItem,
  resultFilters: ResultFilterKey[]
) {
  if (resultFilters.length === 0) return true;

  const groupedFilters = resultFilters.reduce<
    Record<"kind" | "price" | "moment" | "vibe", ResultFilterKey[]>
  >(
    (groups, filter) => {
      groups[RESULT_FILTER_GROUPS[filter]].push(filter);
      return groups;
    },
    {
      kind: [],
      price: [],
      moment: [],
      vibe: [],
    }
  );

  return Object.values(groupedFilters).every((filters) => {
    if (filters.length === 0) return true;

    return filters.some((filter) => matchesResultFilter(item, filter));
  });
}

export function filterEventsByPlanner(
  events: BackendEvent[],
  selections: PlannerSelections
) {
  return events.filter((event) => matchesPlannerSelections(event, selections));
}

export function filterEventsByPlannerProgress(
  events: BackendEvent[],
  selections: PlannerSelections,
  completedStepCount: number
) {
  return events.filter((event) =>
    matchesPlannerProgress(event, selections, completedStepCount)
  );
}

export function filterEventsByResultFilters(
  events: BackendEvent[],
  resultFilters: ResultFilterKey[]
) {
  return events.filter((event) => matchesResultFilters(event, resultFilters));
}

export function filterCardsByPlanner(
  cards: ExploreCard[],
  selections: PlannerSelections
) {
  return cards.filter((card) => matchesPlannerSelections(card, selections));
}

export function filterCardsByPlannerProgress(
  cards: ExploreCard[],
  selections: PlannerSelections,
  completedStepCount: number
) {
  return cards.filter((card) =>
    matchesPlannerProgress(card, selections, completedStepCount)
  );
}

export function filterCardsByResultFilters(
  cards: ExploreCard[],
  resultFilters: ResultFilterKey[]
) {
  return cards.filter((card) => matchesResultFilters(card, resultFilters));
}

export function buildIconicCards(
  cityLabel: string,
  heroImage: string,
  fallbackImage: string
): IconicCard[] {
  return [
    {
      id: 1,
      title: `Iconisch ${cityLabel}`,
      description: `Ontdek een van de meest herkenbare plekken van ${cityLabel} en ervaar de sfeer van de stad.`,
      cta: "Explore Collection ->",
      image: heroImage || fallbackImage,
    },
    {
      id: 2,
      title: "Culturele hotspots",
      description:
        "Van musea en historische gebouwen tot creatieve plekken en stadsverhalen.",
      cta: "Guided Tours ->",
      image: fallbackImage,
    },
    {
      id: 3,
      title: "Lokale favorieten",
      description:
        "Sfeervolle plekken, verrassende adressen en stadsdelen die je niet wilt missen.",
      cta: "Ontdek meer ->",
      image: fallbackImage,
    },
  ];
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameMonth(date: Date, currentDate: Date) {
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
}

export function getMonthGrid(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();

  const cells: Date[] = [];

  for (let i = startDay; i > 0; i -= 1) {
    cells.push(new Date(year, month, 1 - i));
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - (startDay + totalDays) + 1;
    cells.push(new Date(year, month + 1, nextDay));
  }

  return cells;
}

export function getWeekDates(currentDate: Date) {
  const dayIndex = (currentDate.getDay() + 6) % 7;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - dayIndex);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

export function getColorClasses(color: CalendarEvent["color"]) {
  switch (color) {
    case "green":
      return "bg-[#CFE8BF] text-[#1F2A17]";
    case "purple":
      return "bg-[#DEDCEF] text-[#1E1E25]";
    case "sand":
      return "bg-[#EEDFCF] text-[#2D241C]";
    default:
      return "bg-[#CFE8BF] text-[#1F2A17]";
  }
}

export { MONTH_NAMES };
