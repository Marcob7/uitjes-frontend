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
  PlannerSelections,
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
  if (event.is_free || event.price_min === 0) {
    return "Gratis";
  }

  if (typeof event.price_min === "number") {
    return `EUR ${event.price_min.toFixed(2).replace(".", ",")}`;
  }

  return "Prijs volgt";
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

export function buildExploreCards(
  activeTab: CategoryKey,
  events: BackendEvent[],
  cityLabel: string,
  fallbackImage: string
): ExploreCard[] {
  if (activeTab !== "events") {
    return mockCardsByCategory[activeTab];
  }

  if (!events?.length) {
    return mockCardsByCategory.events;
  }

  return sortEventsByStartDate(events).slice(0, 6).map((event) => ({
    id: event.id,
    title: event.title || "Onbekend event",
    label: event.category_label || (event.is_free ? "Free event" : "Event"),
    time: formatTimeRange(event.start_at, event.end_at),
    location: formatVenue(event.venue, cityLabel),
    image: event.image || fallbackImage,
    href: `/ontdek/${slugify(event.title || `event-${event.id}`)}`,
    description:
      event.summary ||
      "Een zorgvuldig geselecteerd moment dat goed past in een spontane stadsdag.",
    price: formatPrice(event),
    distance: formatDistance(event),
    status: formatStatus(event),
    rating: event.rating || null,
    audiences: event.audiences,
    moments: event.moments,
    vibes: event.vibes,
  }));
}

function matchesPlannerSelections(
  item: Pick<ExploreCard, "audiences" | "moments" | "vibes">,
  selections: PlannerSelections
) {
  const matchesCompanion =
    !item.audiences?.length || item.audiences.includes(selections.companion);
  const matchesMoment =
    !item.moments?.length || item.moments.includes(selections.moment);
  const matchesVibe = !item.vibes?.length || item.vibes.includes(selections.vibe);

  return matchesCompanion && matchesMoment && matchesVibe;
}

export function filterEventsByPlanner(
  events: BackendEvent[],
  selections: PlannerSelections
) {
  return events.filter((event) => matchesPlannerSelections(event, selections));
}

export function filterCardsByPlanner(
  cards: ExploreCard[],
  selections: PlannerSelections
) {
  return cards.filter((card) => matchesPlannerSelections(card, selections));
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
