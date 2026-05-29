export const runtime = "edge";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CityExplorePage from "@/components/city-explore/page";
import type { BackendEvent } from "@/components/city-explore/types";
import { getEventsWithFallback } from "@/components/city-explore/utils";
import {
  getCityContentByCity,
  type CityContentItem,
} from "@/lib/api/cityContent";
import { isCityContentCity } from "@/lib/cityContentCities";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

type OntdekPageProps = {
  searchParams?: {
    city?: string;
    query?: string;
  };
};

function getDisplayCity(city: string) {
  const normalizedCity = normalizeCitySlug(city);
  const matchedCity = cityOptions.find((option) => option.value === normalizedCity);

  return matchedCity?.label ?? "Nederland";
}

export function generateMetadata({ searchParams }: OntdekPageProps): Metadata {
  const cityFromQuery = getCitySlugFromQuery(searchParams?.query);
  const city = searchParams?.city
    ? normalizeCity(searchParams.city)
    : cityFromQuery
      ? normalizeCity(cityFromQuery)
      : null;

  if (city) {
    const cityLabel = getDisplayCity(city);

    return {
      title: `Wat te doen in ${cityLabel} | Uitjes en activiteiten`,
      description: `Ontdek uitjes, activiteiten, evenementen en restaurants in ${cityLabel}.`,
    };
  }

  return {
    title: "Ontdek uitjes in Nederland",
    description: "Zoek leuke activiteiten, evenementen en restaurants per stad.",
  };
}

function normalizeCity(value: string | undefined) {
  if (!value) return "apeldoorn";

  return normalizeCitySlug(value);
}

function getCitySlugFromQuery(query: string | undefined) {
  const normalizedQuery = normalizeCitySlug(query);
  if (!normalizedQuery) return null;

  const matchedCity = cityOptions.find(
    (city) =>
      city.value === normalizedQuery ||
      normalizeCitySlug(city.label) === normalizedQuery
  );

  return matchedCity?.value ?? null;
}

function logCityContentFallback(city: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`${city} city-content fallback gebruikt:`, error);
  }
}

function mapCityContentToBackendEvent(
  item: CityContentItem,
  fallbackCity: string
): BackendEvent {
  const isFoodDrink = item.kind === "food_drink";

  return {
    id: item.id ?? 0,
    slug: item.slug,
    title: item.title ?? "Onbekende plek",
    city: item.city ?? fallbackCity,
    venue: item.venue,
    start_at: isFoodDrink ? null : item.startAt,
    end_at: isFoodDrink ? null : item.endAt,
    date_text: null,
    is_ongoing: false,
    is_free: item.isFree,
    price_min: null,
    price_note: item.priceNote,
    source_url: item.sourceUrl,
    latitude: item.latitude,
    longitude: item.longitude,
    summary: item.summary,
    image: item.imageUrl,
    imageAlt: item.imageAlt,
    priority_score: item.priorityScore,
    rating_value: item.ratingValue,
    review_count: item.reviewCount,
    rating_source: item.ratingSource,
    rating_max: item.ratingMax,
    featured: item.featured,
    editors_pick: item.editorsPick,
    hidden_gem: item.hiddenGem,
    category_label: item.category,
    kind: item.kind,
    tags: item.tags,
    status:
      item.statusOverride ||
      (isFoodDrink ? "Eten & drinken" : item.startAt ? null : "Plan dit moment"),
  };
}

async function getCityContentEvents(city: string): Promise<BackendEvent[]> {
  try {
    const cityContent = await getCityContentByCity(city);

    return cityContent.map((item) => mapCityContentToBackendEvent(item, city));
  } catch (error) {
    logCityContentFallback(city, error);
    return [];
  }
}

async function BackendCityExplorePage({ city }: { city: string }) {
  const events = await getCityContentEvents(city);

  return <CityExplorePage city={city} events={events} useEventFallback={false} />;
}

export default function OntdekPage({ searchParams }: OntdekPageProps) {
  const query = searchParams?.query?.trim();
  const cityFromQuery = getCitySlugFromQuery(query);

  if (query && !searchParams?.city && !cityFromQuery) {
    redirect(`/zoeken?query=${encodeURIComponent(query)}`);
  }

  const city = normalizeCity(searchParams?.city ?? cityFromQuery ?? undefined);

  if (isCityContentCity(city)) {
    return <BackendCityExplorePage city={city} />;
  }

  const dummyEvents = getEventsWithFallback(city, []);

  return (
    <CityExplorePage
      city={city}
      events={dummyEvents}
      useEventFallback
    />
  );
}
