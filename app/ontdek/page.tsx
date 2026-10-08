export const runtime = "edge";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CityExplorePage from "@/components/city-explore/page";
import DiscoverCityChoiceFlow from "@/components/city-explore/DiscoverCityChoiceFlow";
import type { BackendEvent } from "@/components/city-explore/types";
import { getEventsWithFallback } from "@/components/city-explore/utils";
import {
  getCityContentByCity,
  type CityContentItem,
} from "@/lib/api/cityContent";
import { isCityContentCity } from "@/lib/cityContentCities";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";
import { localePathname } from "@/lib/i18n/config";

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
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const cityFromQuery = getCitySlugFromQuery(searchParams?.query);
  const city = searchParams?.city
    ? normalizeCity(searchParams.city)
    : cityFromQuery
      ? normalizeCity(cityFromQuery)
      : null;

  if (city) {
    const cityLabel = getDisplayCity(city);
    const localizedPathname = `${pathname}?city=${encodeURIComponent(city)}`;

    return {
      title: `Uitjes in ${cityLabel} | Activiteiten en evenementen`,
      description: `Ontdek activiteiten, evenementen en plekken om uit te gaan in ${cityLabel}. Bekijk wat er vandaag en binnenkort te doen is.`,
      alternates: getLocaleAlternates(localizedPathname, locale),
      openGraph: {
        title: `Uitjes in ${cityLabel} | Activiteiten en evenementen`,
        description: `Ontdek activiteiten, evenementen en plekken om uit te gaan in ${cityLabel}.`,
        ...getLocaleOpenGraph(locale, localizedPathname),
      },
    };
  }

  return {
    title: "Uitjes en activiteiten per stad | Uitjes",
    description: "Ontdek leuke activiteiten, evenementen en adressen in Nederlandse steden. Kies een stad en bekijk wat er te doen is.",
    alternates: getLocaleAlternates(pathname, locale),
    openGraph: {
      title: "Uitjes en activiteiten per stad | Uitjes",
      description: "Ontdek leuke activiteiten, evenementen en adressen in Nederlandse steden.",
      ...getLocaleOpenGraph(locale, pathname),
    },
  };
}

function normalizeCity(value: string | undefined) {
  if (!value) return null;

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
    reviews_href: item.reviewsHref,
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

async function BackendCityExplorePage({
  city,
}: {
  city: string;
}) {
  const events = await getCityContentEvents(city);

  return (
    <CityExplorePage
      city={city}
      events={events}
      useEventFallback={false}
    />
  );
}

export default function OntdekPage({ searchParams }: OntdekPageProps) {
  const query = searchParams?.query?.trim();
  const cityFromQuery = getCitySlugFromQuery(query);

  if (query && !searchParams?.city && !cityFromQuery) {
    redirect(`${localePathname("/zoeken", getRequestLocale())}?query=${encodeURIComponent(query)}`);
  }

  const city = normalizeCity(searchParams?.city ?? cityFromQuery ?? undefined);

  // A city is only selected when it was supplied by the URL (or resolved from
  // the legacy `query` city link). Do not turn a bare /ontdek visit into a
  // city context: the choice flow is the intended starting point.
  if (!city) {
    return <DiscoverCityChoiceFlow />;
  }

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
