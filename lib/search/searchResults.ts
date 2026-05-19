import {
  inspirationResults,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import {
  searchCityContent,
  type CityContentItem,
} from "@/lib/api/cityContent";
import { normalizeCitySlug } from "@/lib/cityConfig";
import { unwrapCssImageUrl } from "@/lib/remoteImage";

export type GeneralSearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  badge: string;
  tags: string[];
  meta: string;
  source: "inspiration" | "city-content";
  score: number;
};

const queryAliases: Record<string, string[]> = {
  museum: ["musea", "cultuur", "expositie", "bibliotheek"],
  musea: ["museum", "cultuur", "expositie"],
  restaurant: ["restaurants", "eten", "drinken", "lunch", "diner", "horeca", "food"],
  restaurants: ["restaurant", "eten", "drinken", "lunch", "diner", "horeca", "food"],
  lunch: ["eten", "drinken", "restaurant", "horeca"],
  kinderen: ["kind", "gezin", "familie", "kids", "workshop"],
  kind: ["kinderen", "gezin", "familie", "kids"],
  date: ["romantisch", "samen", "avond", "diner"],
  regen: ["binnen", "slecht weer", "overdekt", "museum", "workshop"],
  wandelen: ["wandeling", "wandelroute", "route", "buiten", "natuur", "park"],
  wandeling: ["wandelen", "wandelroute", "route", "buiten", "natuur", "park"],
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

  return {
    id: `inspiration:${result.category}:${result.slug}`,
    title: result.title,
    description: result.description,
    href: `/inspiratie/${result.category}/${result.slug}`,
    image: unwrapCssImageUrl(result.image),
    badge: result.categoryLabel,
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

  const cityLabel = item.cityName ?? item.city ?? "Nederland";
  const location = item.venue ?? item.address ?? cityLabel;
  const price = formatPrice(item);

  return {
    id: `city-content:${item.slug ?? item.id ?? item.title}`,
    title: item.title,
    description:
      item.summary ??
      item.description ??
      "Een resultaat uit de lokale city-content collectie.",
    href: getCityContentHref(item),
    image: item.imageUrl ?? undefined,
    badge: item.category ?? (item.kind === "food_drink" ? "Eten & drinken" : "Uitje"),
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

export async function getGeneralSearchResults(query: string) {
  const terms = getSearchTerms(query);
  if (terms.length === 0) return [];

  const dummyMatches = inspirationResults
    .map((result) => mapInspirationResult(result, terms))
    .filter((result): result is GeneralSearchResult => Boolean(result));

  const cityContent = await searchCityContent(query);
  const cityContentMatches = cityContent
    .map((item) => mapCityContentResult(item, terms))
    .filter((result): result is GeneralSearchResult => Boolean(result));

  return uniqueResults([...cityContentMatches, ...dummyMatches]).sort(sortResults);
}
