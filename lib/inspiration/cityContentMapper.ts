import type { CityContentItem } from "@/lib/api/cityContent";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import {
  inspirationCategoryLabels,
  inspirationResults,
  type InspirationCategorySlug,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";

const fallbackImage =
  "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')";

function compactStrings(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value?.trim()));
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getCityLabel(item: CityContentItem) {
  const rawCity = item.cityName ?? item.city ?? "Nederland";
  const citySlug = normalizeCitySlug(rawCity);

  return cityOptions.find((city) => city.value === citySlug)?.label ?? rawCity;
}

function getCitySlug(item: CityContentItem) {
  return normalizeCitySlug(item.city ?? item.cityName ?? "");
}

function getSearchableText(item: CityContentItem) {
  return normalizeText(
    compactStrings([
      item.title,
      item.kind,
      item.category,
      item.summary,
      item.description,
      item.venue,
      item.venueAddress,
      item.address,
      item.priceNote,
      item.dateText,
      item.rawDateText,
      item.openingHoursText,
      item.practicalInfo,
      ...item.tags,
    ]).join(" ")
  );
}

function isWeekendDate(value: string | null) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const day = date.getDay();
  return day === 0 || day === 6;
}

function isTodayDate(value: string | null) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getCityContentCategories(item: CityContentItem): InspirationCategorySlug[] {
  const text = getSearchableText(item);
  const categories = new Set<InspirationCategorySlug>();

  if (isTodayDate(item.startAt) || includesAny(text, ["vandaag", "nu", "doorlopend"])) {
    categories.add("vandaag");
  }

  if (
    isWeekendDate(item.startAt) ||
    includesAny(text, ["weekend", "zaterdag", "zondag"])
  ) {
    categories.add("weekend");
  }

  if (
    item.kind === "food_drink" ||
    includesAny(text, [
      "eten",
      "drinken",
      "restaurant",
      "horeca",
      "lunch",
      "diner",
      "cafe",
      "borrel",
    ])
  ) {
    categories.add("eten-drinken");
  }

  if (includesAny(text, ["kind", "kids", "gezin", "familie", "speel", "workshop"])) {
    categories.add("met-kinderen");
  }

  if (item.isFree || item.priceMin === 0 || includesAny(text, ["gratis", "vrij entree"])) {
    categories.add("gratis");
  }

  if (
    includesAny(text, [
      "museum",
      "binnen",
      "indoor",
      "theater",
      "bibliotheek",
      "expositie",
      "workshop",
      "overdekt",
    ])
  ) {
    categories.add("binnen");
  }

  if (
    includesAny(text, [
      "buiten",
      "park",
      "natuur",
      "wandeling",
      "wandel",
      "route",
      "water",
      "strand",
      "haven",
    ])
  ) {
    categories.add("buiten");
  }

  if (includesAny(text, ["romantisch", "date", "samen", "avond", "diner"])) {
    categories.add("romantisch");
  }

  if (categories.size === 0) {
    categories.add(item.kind === "food_drink" ? "eten-drinken" : "vandaag");
  }

  return [...categories];
}

function getPrimaryCategory(categories: InspirationCategorySlug[]) {
  return categories[0] ?? "vandaag";
}

function formatPrice(item: CityContentItem) {
  if (item.priceNote) return item.priceNote;
  if (item.isFree || item.priceMin === 0) return "Gratis";
  if (typeof item.priceMin === "number" && typeof item.priceMax === "number") {
    return `EUR ${item.priceMin.toFixed(2).replace(".", ",")} - EUR ${item.priceMax
      .toFixed(2)
      .replace(".", ",")}`;
  }
  if (typeof item.priceMin === "number") {
    return `Vanaf EUR ${item.priceMin.toFixed(2).replace(".", ",")}`;
  }
  return "Prijs onbekend";
}

function getCityContentHref(item: CityContentItem) {
  const slug = item.slug ?? normalizeCitySlug(item.title ?? `city-content-${item.id ?? ""}`);
  const city = getCitySlug(item);
  const cityParam = city ? `?city=${encodeURIComponent(city)}` : "";

  return `/ontdek/${slug}${cityParam}`;
}

function getBadge(item: CityContentItem, primaryCategory: InspirationCategorySlug) {
  if (item.editorsPick) return "Redactie";
  if (item.hiddenGem) return "Hidden gem";
  if (item.featured) return "Tip";
  return inspirationCategoryLabels[primaryCategory];
}

function getTypeLabel(item: CityContentItem) {
  if (item.kind === "food_drink") return "Eten & drinken";
  if (item.kind === "outings") return "Uitje";
  return item.category ?? item.kind ?? "City-content";
}

export function mapCityContentToInspirationResult(
  item: CityContentItem
): InspirationResult | null {
  if (!item.title) return null;

  const categories = getCityContentCategories(item);
  const primaryCategory = getPrimaryCategory(categories);
  const city = getCityLabel(item);
  const location = item.venue ?? item.address ?? item.venueAddress ?? city;
  const description =
    item.summary ??
    item.description ??
    "Een lokale tip uit de city-content collectie.";
  const practicalInfo =
    item.practicalInfo ||
    compactStrings([item.dateText, item.openingHoursText, item.priceNote]).join(" - ") ||
    "Controleer actuele informatie bij de aanbieder.";

  return {
    slug: item.slug ?? normalizeCitySlug(item.title),
    title: item.title,
    href: getCityContentHref(item),
    city,
    citySlug: getCitySlug(item),
    category: primaryCategory,
    categoryLabel: inspirationCategoryLabels[primaryCategory],
    categories,
    description,
    practicalInfo,
    tags: item.tags,
    price: formatPrice(item),
    location,
    image: item.imageUrl ? `url('${item.imageUrl}')` : fallbackImage,
    detail: item.description ?? description,
    badge: getBadge(item, primaryCategory),
    rating: item.priorityScore ? String(item.priorityScore) : "Nieuw",
    openingHours: item.openingHoursText ?? item.dateText ?? "Check actuele tijden",
    type: getTypeLabel(item),
    reasons: compactStrings([
      item.featured ? "Uitgelicht in lokale city-content" : null,
      item.editorsPick ? "Gekozen door de redactie" : null,
      item.hiddenGem ? "Minder bekende lokale tip" : null,
      item.summary,
      item.venue ? `Te vinden bij ${item.venue}` : null,
    ]).slice(0, 4),
    gallery: item.imageUrl ? [`url('${item.imageUrl}')`] : [fallbackImage],
  };
}

export function mapCityContentToInspirationResults(items: CityContentItem[]) {
  return items
    .map(mapCityContentToInspirationResult)
    .filter((result): result is InspirationResult => Boolean(result));
}

export function getInspirationFlowResults(cityContentItems: CityContentItem[] = []) {
  const mappedResults = mapCityContentToInspirationResults(cityContentItems);

  return mappedResults.length > 0 ? mappedResults : inspirationResults;
}
