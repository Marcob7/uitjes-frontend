import {
  inspirationResults,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import {
  searchCityContent,
  type CityContentItem,
} from "@/lib/api/cityContent";
import { cityOptions, getCityConfig, normalizeCitySlug } from "@/lib/cityConfig";
import { unwrapCssImageUrl } from "@/lib/remoteImage";

export type GeneralSearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  imageAlt?: string;
  badge: string;
  categorySlug?: string;
  city: string;
  citySlug: string;
  location: string;
  priceLabel?: string;
  priceMin?: number | null;
  isFree: boolean;
  ratingValue?: number | null;
  reviewCount?: number | null;
  startAt?: string | null;
  dateLabel?: string | null;
  kind?: string | null;
  tags: string[];
  meta: string;
  source: "inspiration" | "city-content";
  score: number;
};

export type GeneralSearchResultState =
  | { status: "success"; results: GeneralSearchResult[] }
  | { status: "error" };

const queryAliases: Record<string, string[]> = {
  museum: ["musea", "cultuur", "expositie", "bibliotheek"],
  musea: ["museum", "cultuur", "expositie"],
  vandaag: ["nu", "doorlopend", "actueel"],
  restaurant: ["restaurants", "eten", "drinken", "lunch", "diner", "horeca", "food"],
  restaurants: ["restaurant", "eten", "drinken", "lunch", "diner", "horeca", "food"],
  eten: ["restaurant", "restaurants", "drinken", "lunch", "diner", "horeca", "food"],
  lunch: ["eten", "drinken", "restaurant", "horeca"],
  kinderen: ["kind", "gezin", "familie", "kids", "workshop"],
  kind: ["kinderen", "gezin", "familie", "kids"],
  date: ["romantisch", "samen", "avond", "diner"],
  regen: ["binnen", "slecht weer", "overdekt", "museum", "workshop"],
  wandelen: ["wandeling", "wandelroute", "route", "buiten", "natuur", "park"],
  wandeling: ["wandelen", "wandelroute", "route", "buiten", "natuur", "park"],
  buiten: ["wandelen", "wandeling", "wandelroute", "route", "natuur", "park"],
  gratis: ["budget", "free", "vrij entree"],
  bowlen: ["bowling", "actief", "binnen"],
  klimmen: ["klimhal", "actief", "binnen"],
  escaperoom: ["escape room", "actief", "binnen"],
  karten: ["karting", "actief"],
  rondvaart: ["boot", "water", "haven", "tour"],
};

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function compactStrings(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value?.trim()));
}

function getSearchTerms(query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const terms = new Set([normalizedQuery]);
  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);

  for (const part of queryParts) {
    terms.add(part);
  }

  for (const [alias, expansions] of Object.entries(queryAliases)) {
    const normalizedAlias = normalize(alias);

    if (normalizedQuery.includes(normalizedAlias)) {
      expansions.forEach((expansion) => terms.add(normalize(expansion)));
    }
  }

  return [...terms];
}

function fieldMatches(value: string, terms: string[]) {
  const normalizedValue = normalize(value);
  return terms.some((term) => normalizedValue.includes(term));
}

function scoreFields(fields: {
  title: string;
  category: string;
  description: string;
  tags: string;
}, terms: string[]) {
  if (fieldMatches(fields.title, terms)) return 0;
  if (fieldMatches(fields.category, terms)) return 1;
  if (fieldMatches(`${fields.description} ${fields.tags}`, terms)) return 2;
  return null;
}

function mapInspirationResult(
  result: InspirationResult,
  terms: string[]
): GeneralSearchResult | null {
  const categoryText = [
    result.category,
    result.categoryLabel,
    result.type,
    result.city,
    result.location,
    ...result.categories,
  ].join(" ");
  const descriptionText = [
    result.description,
    result.practicalInfo,
    result.detail,
    result.price,
  ].join(" ");
  const score = scoreFields(
    {
      title: result.title,
      category: categoryText,
      description: descriptionText,
      tags: result.tags.join(" "),
    },
    terms
  );

  if (score == null) return null;

  const numericRating = Number.parseFloat(result.rating.replace(",", "."));
  const priceIsFree = normalize(result.price).includes("gratis") || normalize(result.price).includes("0");
  const citySlug = normalizeCitySlug(result.city);

  return {
    id: `inspiration:${result.category}:${result.slug}`,
    title: result.title,
    description: result.description,
    href: `/inspiratie/${result.category}/${result.slug}`,
    image: unwrapCssImageUrl(result.image),
    imageAlt: result.title,
    badge: result.categoryLabel,
    categorySlug: result.category,
    city: result.city,
    citySlug,
    location: result.location,
    priceLabel: result.price,
    priceMin: null,
    isFree: priceIsFree,
    ratingValue: Number.isFinite(numericRating) ? numericRating : null,
    reviewCount: null,
    startAt: null,
    dateLabel: result.categories.includes("weekend") ? "Dit weekend" : result.categories.includes("vandaag") ? "Vandaag" : null,
    kind: result.type,
    tags: [result.city, result.price, ...result.tags].slice(0, 5),
    meta: `${result.type} - ${result.location}`,
    source: "inspiration",
    score,
  };
}

function formatPrice(item: CityContentItem) {
  if (item.priceNote) return item.priceNote;
  if (item.isFree || item.priceMin === 0) return "Gratis";
  if (typeof item.priceMin === "number") {
    return `EUR ${item.priceMin.toFixed(2).replace(".", ",")}`;
  }
  return null;
}

function getCityDisplayLabel(value: string) {
  const normalizedValue = normalizeCitySlug(value);
  return cityOptions.find((city) => city.value === normalizedValue)?.label ?? value;
}

function getCityContentHref(item: CityContentItem) {
  const slug = item.slug ?? normalizeCitySlug(item.title ?? `item-${item.id ?? ""}`);
  const city = normalizeCitySlug(item.city ?? item.cityName ?? "");
  const cityParam = city ? `?city=${encodeURIComponent(city)}` : "";

  return `/ontdek/${slug}${cityParam}`;
}

function mapCityContentResult(
  item: CityContentItem,
  terms: string[]
): GeneralSearchResult | null {
  if (!item.title) return null;

  const categoryText = compactStrings([
    item.category,
    item.kind,
    item.city,
    item.cityName,
    item.venue,
    item.venueAddress,
    item.address,
  ]).join(" ");
  const descriptionText = compactStrings([
    item.summary,
    item.description,
    item.practicalInfo,
    item.priceNote,
    item.dateText,
    item.openingHoursText,
  ]).join(" ");
  const score = scoreFields(
    {
      title: item.title,
      category: categoryText,
      description: descriptionText,
      tags: item.tags.join(" "),
    },
    terms
  );

  if (score == null) return null;

  const cityLabel = getCityDisplayLabel(item.cityName ?? item.city ?? "Nederland");
  const citySlug = normalizeCitySlug(item.city ?? item.cityName ?? "");
  const cityFallbackImage = getCityConfig(citySlug).cardImage ?? getCityConfig(citySlug).fallbackImage;
  const location = compactStrings([item.venue ?? item.address, cityLabel]).join(" · ");
  const price = formatPrice(item);

  return {
    id: `city-content:${item.slug ?? item.id ?? item.title}`,
    title: item.title,
    description:
      item.summary ??
      item.description ??
      "Een resultaat uit de lokale city-content collectie.",
    href: getCityContentHref(item),
    image: item.imageUrl ?? cityFallbackImage ?? undefined,
    imageAlt: item.imageAlt ?? `${cityLabel} · ${item.title}`,
    badge: item.category ?? (item.kind === "food_drink" ? "Eten & drinken" : "Uitje"),
    categorySlug: normalizeCitySlug(item.category ?? item.kind ?? "uitje"),
    city: cityLabel,
    citySlug,
    location,
    priceLabel: price ?? undefined,
    priceMin: item.priceMin,
    isFree: item.isFree || item.priceMin === 0,
    ratingValue: item.ratingValue,
    reviewCount: item.reviewCount,
    startAt: item.startAt,
    dateLabel: item.dateText,
    kind: item.kind,
    tags: compactStrings([cityLabel, price, ...item.tags]).slice(0, 5),
    meta: compactStrings([item.kind, location]).join(" - "),
    source: "city-content",
    score,
  };
}

function sortResults(a: GeneralSearchResult, b: GeneralSearchResult) {
  if (a.score !== b.score) return a.score - b.score;
  if (a.source !== b.source) return a.source === "city-content" ? -1 : 1;
  return a.title.localeCompare(b.title, "nl");
}

function uniqueResults(results: GeneralSearchResult[]) {
  const seen = new Set<string>();

  return results.filter((result) => {
    const key = result.href;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getGeneralSearchResults(
  query: string
): Promise<GeneralSearchResultState> {
  const terms = getSearchTerms(query);
  if (terms.length === 0) return { status: "success", results: [] };

  const dummyMatches = inspirationResults
    .map((result) => mapInspirationResult(result, terms))
    .filter((result): result is GeneralSearchResult => Boolean(result));

  let cityContent: CityContentItem[];

  try {
    cityContent = await searchCityContent(query, { throwOnError: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Search city-content request failed:", error);
    }

    return { status: "error" };
  }

  const cityContentMatches = cityContent
    .map((item) => mapCityContentResult(item, terms))
    .filter((result): result is GeneralSearchResult => Boolean(result));

  return {
    status: "success",
    results: uniqueResults([...cityContentMatches, ...dummyMatches]).sort(sortResults),
  };
}
