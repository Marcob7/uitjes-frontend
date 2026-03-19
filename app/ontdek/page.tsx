export const runtime = 'edge';
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

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function formatCityName(city: string) {
  return city
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getCityEvents(city: string): Promise<{
  events: BackendEvent[];
  error: boolean;
}> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL ontbreekt.");
    return { events: [], error: true };
  }

  try {
    const response = await fetch(`${baseUrl}/api/events/?city=${city}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Events ophalen mislukt:", response.status);
      return { events: [], error: true };
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return { events: data, error: false };
    }

    if (Array.isArray(data.results)) {
      return { events: data.results, error: false };
    }

    return { events: [], error: false };
  } catch (error) {
    console.error("Fout bij ophalen van events:", error);
    return { events: [], error: true };
  }
}

function StateWrapper({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="bg-[#f7f8fa] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {text}
        </p>
      </div>
    </section>
  );
}

export default async function OntdekPage({ searchParams }: OntdekPageProps) {
  const city = normalizeCity(searchParams?.city);
  const cityLabel = formatCityName(city);

  const { events, error } = await getCityEvents(city);

  if (error) {
    return (
      <StateWrapper
        title={`We konden ${cityLabel} nu even niet laden`}
        text="Er ging iets mis bij het ophalen van de evenementen. Probeer het zo nog een keer."
      />
    );
  }

  if (events.length === 0) {
    return (
      <StateWrapper
        title={`Nog geen evenementen gevonden voor ${cityLabel}`}
        text="Voor deze stad hebben we op dit moment nog geen resultaten. Probeer Apeldoorn of Deventer, of kom later nog eens terug."
      />
    );
  }

  return <CityExploreView city={city} events={events} />;
}