import Link from "next/link";
import { Suspense } from "react";
import { InspirationLocationContext } from "@/components/inspiration/InspirationLocationContext";
import { AppSection } from "@/components/ui/app";
import {
  featuredInspirationCities,
  getInspirationCityLabel,
  getInspirationLocationMode,
  getInspirationResults,
  inspirationCategoryLabels,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import { optimizeCssBackground } from "@/lib/remoteImage";

type PageProps = {
  searchParams?: {
    location?: string;
    nearbyCity?: string;
  };
};

type CityCard = {
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

export const runtime = "edge";

const popularCities: CityCard[] = [
  {
    name: "Apeldoorn",
    subtitle: "VELUWE & STADSRUST",
    href: "/inspiratie?location=apeldoorn",
    image:
      "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
  },
  {
    name: "Deventer",
    subtitle: "IJSSEL & HISTORIE",
    href: "/inspiratie?location=deventer",
    image:
      "url('https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=80')",
  },
  {
    name: "Amersfoort",
    subtitle: "POORTEN & HOFJES",
    href: "/inspiratie?location=amersfoort",
    image:
      "url('https://images.unsplash.com/photo-1576924542622-772281a13f0c?auto=format&fit=crop&w=1200&q=80')",
  },
];

function buildContextQuery(searchParams?: PageProps["searchParams"]) {
  const params = new URLSearchParams();

  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.nearbyCity) params.set("nearbyCity", searchParams.nearbyCity);

  return params.toString();
}

function withContext(href: string, query: string) {
  return query ? `${href}?${query}` : href;
}

function getResultsTitle(location?: string, nearbyCity?: string) {
  const mode = getInspirationLocationMode(location);
  const cityLabel = getInspirationCityLabel(location, nearbyCity);

  if (mode === "city" && cityLabel) return `Resultaten in ${cityLabel}`;
  if (mode === "nearby" && cityLabel) return `Resultaten ${cityLabel}`;
  return "Brede inspiratie-resultaten";
}

function getResultsDescription(location?: string, nearbyCity?: string) {
  const mode = getInspirationLocationMode(location);
  const cityLabel = getInspirationCityLabel(location, nearbyCity);

  if (mode === "city" && cityLabel) {
    return `Dummy resultaten gefilterd op ${cityLabel}. Later kan deze selectie uit de service-laag komen.`;
  }

  if (mode === "nearby") {
    return `Deze dummy resultaten worden getoond op basis van je browserlocatie. Voor nu mappen we coordinaten tijdelijk naar ${cityLabel ?? "een demo stad"}.`;
  }

  return "Een gemixte set uit meerdere steden, zodat de pagina niet vastzit aan een plaats.";
}

export default function InspiratiePage({ searchParams }: PageProps) {
  const contextQuery = buildContextQuery(searchParams);
  const results = getInspirationResults({
    location: searchParams?.location,
    nearbyCity: searchParams?.nearbyCity,
    limit: 9,
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-14">
        <div className="uitjes-liquid-section rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="pointer-events-none absolute -right-16 top-6 h-56 w-56 rounded-full bg-[#c6df9a]/18 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-[42rem]">
              <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                Inspiratiegids
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.2rem,8vw,5.7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                Begeleide ontdekkingsreis
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/76 sm:text-lg">
                Kies een locatiecontext en bekijk echte resultaatkaarten met
                dummy data die later uit de backend kan komen.
              </p>
            </div>
          </div>

          <Suspense fallback={null}>
            <InspirationLocationContext compact className="mt-8" />
          </Suspense>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16 md:pb-20">
        <div>
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Resultaten
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#171511]">
                {getResultsTitle(searchParams?.location, searchParams?.nearbyCity)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d54] md:text-base">
                {getResultsDescription(
                  searchParams?.location,
                  searchParams?.nearbyCity
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(inspirationCategoryLabels).map(([slug, label]) => (
                <Link
                  key={slug}
                  href={withContext(`/inspiratie/${slug}`, contextQuery)}
                  className="inline-flex min-h-10 items-center rounded-full border border-[#d7cfbf] bg-white/72 px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => (
              <ResultCard
                key={result.slug}
                result={result}
                href={withContext(
                  `/inspiratie/${result.category}/${result.slug}`,
                  contextQuery
                )}
              />
            ))}
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" className="bg-white/5">
        <div>
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Steden
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#171511]">
                Kies een stad
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#665d54] md:text-base">
                Deze dummy steden laten de resultaten zichtbaar veranderen.
              </p>
            </div>

            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6258]">
              {featuredInspirationCities.length} demo steden
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl"
              >
                <div
                  className="min-h-[290px] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03] md:min-h-[340px]"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.58), rgba(0,0,0,0.06)), ${optimizeCssBackground(
                      city.image,
                      {
                        width: 960,
                        quality: 58,
                      }
                    )}`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-white">
                    {city.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                    {city.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="lg" innerClassName="pt-10">
        <div>
          <div className="grid gap-8 overflow-hidden rounded-[2.2rem] border border-[#ded8cc] bg-white/72 px-6 py-8 shadow-[0_24px_70px_rgba(60,44,23,0.12)] backdrop-blur-xl md:grid-cols-[1.2fr_0.9fr] md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6f5f4e]">
                UITJES COMMUNITY
              </p>

              <h2 className="mt-4 max-w-[520px] text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[#171511] md:text-5xl">
                Ontvang wekelijks de beste speciaal geselecteerd-tips.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#5f554b] md:text-base">
                Geen spam, alleen de meest unieke plekjes en evenementen die je
                echt niet wilt missen.
              </p>

              <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Je e-mailadres"
                  className="h-14 flex-1 rounded-full border border-[#ded8cc] bg-white/78 px-5 text-sm text-[#171511] outline-none backdrop-blur-xl placeholder:text-[#7c7168]"
                />
                <button
                  type="submit"
                  className="uitjes-cta inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  Aanmelden
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4 md:items-center">
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage: optimizeCssBackground(
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
                    {
                      width: 720,
                      quality: 56,
                    }
                  ),
                }}
              />
              <div
                className="aspect-[0.9/1] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage: optimizeCssBackground(
                    "https://images.unsplash.com/photo-1612196808214-b7e239e5e7f1?auto=format&fit=crop&w=900&q=80",
                    {
                      width: 720,
                      quality: 56,
                    }
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </AppSection>
    </main>
  );
}

function ResultCard({ result, href }: { result: InspirationResult; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <div
          className="aspect-[0.9/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={{
            backgroundImage: optimizeCssBackground(result.image, {
              width: 840,
              quality: 58,
            }),
          }}
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {result.badge ? (
            <span className="inline-flex rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#203115]">
              {result.badge}
            </span>
          ) : null}
          <span className="inline-flex rounded-full bg-white/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#25341c] backdrop-blur-md">
            {result.city}
          </span>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7b6f64]">
          {result.categoryLabel} - {result.price}
        </p>

        <h3 className="mt-2 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511]">
          {result.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#665d54]">
          {result.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#405028]">
          <PinIcon />
          <span>{result.location}</span>
        </div>
      </div>
    </Link>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
