import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

export type SearchIntent = "festival" | "zoeken" | "stad" | "onbekend";

const festivalTerms = [
  "festival",
  "festivals",
  "muziekfestival",
  "food festival",
  "foodfestival",
  "jazz festival",
  "dance festival",
  "techno",
  "jazz",
  "lowlands",
  "dekmantel",
];

const activityTerms = [
  "activiteit",
  "activiteiten",
  "uitje",
  "uitjes",
  "museum",
  "musea",
  "wandelen",
  "wandeling",
  "kind",
  "kinderen",
  "restaurant",
  "restaurants",
  "bowlen",
  "bowling",
  "klimmen",
  "klimhal",
  "regen",
  "slecht weer",
  "escaperoom",
  "escape room",
  "karten",
  "karting",
  "rondvaart",
  "date",
  "eten",
  "drinken",
  "lunch",
  "diner",
  "buiten",
  "binnen",
  "gratis",
  "workshop",
  "park",
  "route",
  "koffie",
];

function normalizeQuery(query: string) {
  return normalizeCitySlug(query).replace(/-/g, " ");
}

function normalizeRouteQuery(query: string | null | undefined) {
  return (query ?? "").trim().replace(/\s+/g, " ");
}

export function detectSearchIntent(query: string | null | undefined): SearchIntent {
  const routeQuery = normalizeRouteQuery(query);
  const normalized = normalizeQuery(routeQuery);

  if (!normalized) return "onbekend";

  const matchedCity = cityOptions.some(
    (city) =>
      normalizeCitySlug(city.label) === normalizeCitySlug(routeQuery) ||
      city.value === normalizeCitySlug(routeQuery)
  );

  if (matchedCity) return "stad";

  if (festivalTerms.some((term) => normalized.includes(normalizeQuery(term)))) {
    return "festival";
  }

  if (activityTerms.some((term) => normalized.includes(normalizeQuery(term)))) {
    return "zoeken";
  }

  return "onbekend";
}

export function getSearchRoute(query: string | null | undefined) {
  const trimmedQuery = normalizeRouteQuery(query);
  const intent = detectSearchIntent(trimmedQuery);
  const encodedQuery = encodeURIComponent(trimmedQuery);

  if (!trimmedQuery) return "/ontdek";

  if (intent === "festival") return `/festivals/lijst?query=${encodedQuery}`;
  if (intent === "zoeken") return `/zoeken?query=${encodedQuery}`;
  if (intent === "stad") {
    return `/ontdek?city=${encodeURIComponent(normalizeCitySlug(trimmedQuery))}`;
  }

  return `/zoeken?query=${encodedQuery}`;
}
