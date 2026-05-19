export const runtime = "edge";

import CityExplorePage from "@/components/city-explore/page";
import { getEventsWithFallback } from "@/components/city-explore/utils";
import { AppButton, AppEmptyState, AppSection } from "@/components/ui/app";
import {
  getCityContentByCity,
  type CityContentItem,
} from "@/lib/api/cityContent";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";

type OntdekPageProps = {
  searchParams?: {
    city?: string;
    query?: string;
  };
};

type BackendEvent = {
  id: number;
  slug?: string | null;
  title: string;
  city: string;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  date_text: string | null;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: number | null;
  price_note?: string | null;
  source_url: string | null;
  latitude?: number | null;
  longitude?: number | null;
  summary?: string | null;
  image?: string | null;
  category_label?: string | null;
  status?: string | null;
  kind?: string | null;
  tags?: string[];
};

const CITY_CONTENT_CITIES = new Set(["harderwijk", "lelystad"]);

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

function NoResultsForQuery({ query }: { query: string }) {
  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="md" innerClassName="py-12 sm:py-16">
        <div className="rounded-[2.2rem] border border-[#e5dccf] bg-[#fffaf4] px-5 py-8 shadow-[0_20px_54px_rgba(69,50,27,0.08)] sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
            Zoekresultaten
          </p>
          <h1 className="mt-3 text-[clamp(2.3rem,6vw,4.3rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
            Geen resultaten gevonden
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">
            We vonden geen stad of uitje voor "{query}". Probeer een andere
            zoekterm of start vanuit een categorie.
          </p>
        </div>

        <div className="mt-8">
          <AppEmptyState
            title="Geen resultaten gevonden"
            description={`Er zijn geen dummy resultaten voor "${query}". Probeer een andere zoekterm, bekijk inspiratie, kies een stad of bekijk festivals.`}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <AppButton href="/uitjes" variant="dark">
              Andere zoekterm proberen
            </AppButton>
            <AppButton href="/inspiratie" variant="dark">
              Bekijk inspiratie
            </AppButton>
            <AppButton href="/ontdek" variant="dark">
              Kies een stad
            </AppButton>
            <AppButton href="/festivals/lijst" variant="dark">
              Bekijk festivals
            </AppButton>
          </div>
        </div>
      </AppSection>
    </main>
  );
}

function isCityContentCity(city: string) {
  return CITY_CONTENT_CITIES.has(city);
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
    category_label: item.category,
    kind: item.kind,
    tags: item.tags,
    status: isFoodDrink ? "Eten & drinken" : item.startAt ? null : "Plan dit moment",
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
    return <NoResultsForQuery query={query} />;
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
