import { getCityConfig } from "@/lib/cityConfig";
import {
  APELDOORN_DUMMY_EVENTS,
  HAARLEM_CALENDAR_EVENTS,
  HAARLEM_DUMMY_EVENTS,
  MONTH_NAMES,
  mockCardsByCategory,
} from "./data";
import type {
  BackendEvent,
  CalendarEvent,
  CategoryKey,
  ExploreCard,
  IconicCard,
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

export function getSafeCityTheme(city: string): SafeCityTheme {
  const normalizedCity = city.toLowerCase();

  if (normalizedCity === "haarlem") {
    return {
      slug: "haarlem",
      label: "Haarlem",
      description:
        "Ontdek stijlvolle hotspots, culturele plekken en lokale favorieten in Haarlem.",
      heroImage: "/images/apeldoorn_img.jpg",
      fallbackImage: "/images/julianatoren.jpg",
      colors: {
        pageBackground: "#f8f4ef",
        softSurface: "#e9ddd2",
        accent: "#171717",
        accentText: "#ffffff",
        heading: "#111111",
        text: "#4b4b4b",
        mutedSurface: "#f1e8de",
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
      fallbackImage: config?.fallbackImage || "/images/julianatoren.jpg",
      colors: {
        pageBackground: config?.colors?.pageBackground || "#f8f4ef",
        softSurface: config?.colors?.softSurface || "#e9ddd2",
        accent: config?.colors?.accent || "#171717",
        accentText: config?.colors?.accentText || "#ffffff",
        heading: config?.colors?.heading || "#111111",
        text: config?.colors?.text || "#4b4b4b",
        mutedSurface: config?.colors?.mutedSurface || "#f1e8de",
      },
    };
  } catch {
    return {
      slug: normalizedCity,
      label: city.charAt(0).toUpperCase() + city.slice(1),
      description: `Ontdek bijzondere plekken, culturele highlights en lokale favorieten in ${city}.`,
      heroImage: "/images/apeldoorn_img.jpg",
      fallbackImage: "/images/julianatoren.jpg",
      colors: {
        pageBackground: "#f8f4ef",
        softSurface: "#e9ddd2",
        accent: "#171717",
        accentText: "#ffffff",
        heading: "#111111",
        text: "#4b4b4b",
        mutedSurface: "#f1e8de",
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

  return sortEventsByStartDate(events)
  .slice(0, 6)
  .map((event) => ({
    id: event.id,
    title: event.title || "Onbekend event",
    label: event.is_free ? "FREE EVENT" : "EVENT",
    time: formatTimeRange(event.start_at, event.end_at),
    location: formatVenue(event.venue, cityLabel),
    image: fallbackImage,
    href: `/ontdek/${slugify(event.title || `event-${event.id}`)}`,
  }));
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
      cta: "Explore Collection →",
      image: heroImage || fallbackImage,
    },
    {
      id: 2,
      title: "Culturele hotspots",
      description:
        "Van musea en historische gebouwen tot creatieve plekken en stadsverhalen.",
      cta: "Guided Tours →",
      image: fallbackImage,
    },
    {
      id: 3,
      title: "Lokale favorieten",
      description:
        "Sfeervolle plekken, verrassende adressen en stadsdelen die je niet wilt missen.",
      cta: "Ontdek meer →",
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

  for (let i = startDay; i > 0; i--) {
    cells.push(new Date(year, month, 1 - i));
  }

  for (let day = 1; day <= totalDays; day++) {
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