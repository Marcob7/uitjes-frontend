export const runtime = "edge";

import CityExplorePage from "@/components/city-explore/page";
import { getEventsWithFallback } from "@/components/city-explore/utils";
import { AppButton, AppEmptyState, AppSection } from "@/components/ui/app";

type OntdekPageProps = {
  searchParams?: {
    city?: string;
    query?: string;
  };
};

type BackendEvent = {
  id: number;
  title: string;
  city: string;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  date_text: string | null;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: number | null;
  source_url: string | null;
};

function normalizeCity(value: string | undefined) {
  if (!value) return "apeldoorn";

  return value.trim().toLowerCase().replace(/\s+/g, "-");
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

function shouldUseDummyData(city: string) {
  if (process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "1") {
    return true;
  }

  return getEventsWithFallback(city, []).length > 0;
}

async function getCityEvents(city: string): Promise<BackendEvent[]> {
  if (shouldUseDummyData(city)) {
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
 
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL ontbreekt.");
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/api/events/?city=${city}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Events ophalen mislukt:", response.status);
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  } catch (error) {
    console.error("Fout bij ophalen van events:", error);
    return [];
  }
}

export default async function OntdekPage({ searchParams }: OntdekPageProps) {
  const query = searchParams?.query?.trim();

  if (query && !searchParams?.city) {
    return <NoResultsForQuery query={query} />;
  }

  const city = normalizeCity(searchParams?.city);
  const events = await getCityEvents(city);

  return <CityExplorePage city={city} events={events} />;
}
