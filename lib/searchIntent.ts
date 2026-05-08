import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

export type SearchIntent = "festival" | "uitje" | "stad" | "onbekend";

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
  "wandelen",
  "wandeling",
  "kind",
  "kinderen",
  "restaurant",
  "restaurants",
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

export function detectSearchIntent(query: string): SearchIntent {
  const normalized = normalizeQuery(query);

  if (!normalized) return "onbekend";

  const matchedCity = cityOptions.some(
    (city) =>
      normalizeCitySlug(city.label) === normalizeCitySlug(query) ||
      city.value === normalizeCitySlug(query)
  );

  if (matchedCity) return "stad";

  if (festivalTerms.some((term) => normalized.includes(normalizeQuery(term)))) {
    return "festival";
  }

  if (activityTerms.some((term) => normalized.includes(normalizeQuery(term)))) {
    return "uitje";
  }

  return "onbekend";
}

export function getSearchRoute(query: string) {
  const trimmedQuery = query.trim();
  const intent = detectSearchIntent(trimmedQuery);
  const encodedQuery = encodeURIComponent(trimmedQuery);

  if (!trimmedQuery) return "/ontdek";

  if (intent === "festival") return `/festivals/lijst?query=${encodedQuery}`;
  if (intent === "uitje") return `/uitjes?query=${encodedQuery}`;
  if (intent === "stad") {
    return `/ontdek?city=${encodeURIComponent(normalizeCitySlug(trimmedQuery))}`;
  }

  return `/ontdek?query=${encodedQuery}`;
}
