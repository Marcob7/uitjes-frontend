import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { InspirationLocationContext } from "@/components/inspiration/InspirationLocationContext";
import { AppSection } from "@/components/ui/app";
import {
  getInspirationCityLabel,
  getInspirationLocationMode,
  getInspirationResultsByCategory,
  getInspirationStaticParams,
  inspirationCategoryDescriptions,
  inspirationCategoryLabels,
  isInspirationCategorySlug,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import { optimizeCssBackground } from "@/lib/remoteImage";

type PageProps = {
  params: {
    category: string;
  };
  searchParams?: {
    location?: string;
    nearbyCity?: string;
  };
};

export const dynamicParams = false;
export const runtime = "edge";

function buildContextQuery(searchParams?: PageProps["searchParams"]) {
  const params = new URLSearchParams();

  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.nearbyCity) params.set("nearbyCity", searchParams.nearbyCity);

  return params.toString();
}

function withContext(href: string, query: string) {
  return query ? `${href}?${query}` : href;
}

function getLocationContextLabel(
  categoryLabel: string,
  searchParams?: PageProps["searchParams"]
) {
  const mode = getInspirationLocationMode(searchParams?.location);
  const cityLabel = getInspirationCityLabel(
    searchParams?.location,
    searchParams?.nearbyCity
  );

  if (mode === "city" && cityLabel) {
    return `${categoryLabel} in ${cityLabel}`;
  }

  if (mode === "nearby" && cityLabel) {
    return `${categoryLabel} ${cityLabel}`;
  }

  return `${categoryLabel} door meerdere steden`;
}

export function generateStaticParams() {
  return getInspirationStaticParams();
}

export default function InspirationCategoryPage({
  params,
  searchParams,
}: PageProps) {
  if (!isInspirationCategorySlug(params.category)) {
    notFound();
  }

  const categoryLabel = inspirationCategoryLabels[params.category];
  const results = getInspirationResultsByCategory(
    params.category,
    searchParams?.location,
    searchParams?.nearbyCity
  );

  if (results.length === 0) {
    notFound();
  }

  const contextQuery = buildContextQuery(searchParams);
  const locationContextLabel = getLocationContextLabel(categoryLabel, searchParams);
  const quickChoices = results.slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-14">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Inspiratie", href: "/inspiratie" },
              { label: categoryLabel },
            ]}
            className="mb-6"
          />

          <div className="uitjes-liquid-section rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">
            <div className="pointer-events-none absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#c6df9a]/16 blur-3xl" />
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div className="max-w-[42rem]">
                <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                  {categoryLabel}
                </div>

                <h1 className="mt-6 max-w-[11ch] text-[clamp(3rem,8vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                  {locationContextLabel}
                </h1>

                <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/76 sm:text-lg">
                  {inspirationCategoryDescriptions[params.category]}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Suspense fallback={null}>
                <InspirationLocationContext compact />
              </Suspense>
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
              Snelle keuzes
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {quickChoices.map((item) => (
                <Link
                  key={item.slug}
                  href={withContext(
                    `/inspiratie/${params.category}/${item.slug}`,
                    contextQuery
                  )}
                  className="group relative min-h-[190px] overflow-hidden rounded-[1.5rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:rounded-[1.9rem] md:min-h-[230px]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.10)), ${optimizeCssBackground(
                        item.image,
                        {
                          width: 760,
                          quality: 58,
                        }
                      )}`,
                    }}
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#203115]">
                      {item.city}
                    </span>
                    <span className="text-lg font-bold tracking-[-0.03em] text-white md:text-xl">
                      {item.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16 md:pb-20">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                {locationContextLabel}
              </h2>
              <p className="mt-1 text-sm text-[#6d6258]">
                Dummy resultaten gefilterd op categorie en locatiecontext.
              </p>
            </div>

            <Link
              href={withContext("/inspiratie", contextQuery)}
              className="text-xs font-semibold text-[#171511] underline decoration-[#9cc84e] decoration-2 underline-offset-4"
            >
              Bekijk alles
            </Link>
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <ResultCard
                key={item.slug}
                item={item}
                href={withContext(
                  `/inspiratie/${params.category}/${item.slug}`,
                  contextQuery
                )}
              />
            ))}
          </div>
        </div>
      </AppSection>
    </main>
  );
}

function ResultCard({ item, href }: { item: InspirationResult; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <div
          className="aspect-[0.9/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={{
            backgroundImage: optimizeCssBackground(item.image, {
              width: 840,
              quality: 58,
            }),
          }}
        />

        <span className="absolute left-4 top-4 inline-flex rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#203115]">
          {item.city}
        </span>
      </div>

      <div className="pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7b6f64]">
          {item.categoryLabel} - {item.price}
        </p>

        <h3 className="mt-2 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511]">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#665d54]">
          {item.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#405028]">
          <PinIcon />
          <span>{item.location}</span>
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
