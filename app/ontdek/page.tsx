export const runtime = "edge";

import CityExploreView from "@/components/CityExploreView";

type OntdekPageProps = {
  searchParams?: {
    city?: string;
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

async function getCityEvents(city: string): Promise<BackendEvent[]> {
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
  const city = normalizeCity(searchParams?.city);
  const events = await getCityEvents(city);

  return <CityExploreView city={city} events={events} />;
}