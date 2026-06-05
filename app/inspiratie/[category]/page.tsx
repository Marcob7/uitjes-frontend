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

const inspirationRouteConfig = {
  "snel-ontdekken": {
    category: "vandaag",
    label: "Snel ontdekken",
    description:
      "Laagdrempelige inspiratie voor als je snel een richting wilt kiezen, zonder eerst een volledig plan te maken.",
  },
  "buiten-genieten": {
    category: "buiten",
    label: "Buiten genieten",
    description:
      "Ideeen met lucht, groen, water of ruimte om te dwalen. Fijn voor een wandeling, parkmoment of frisse pauze.",
  },
  regenproof: {
    category: "binnen",
    label: "Regenproof",
    description:
      "Binneninspiratie voor wisselvallige dagen: cultuur, makersplekken en rustige plekken waar het weer geen spelbreker is.",
  },
  "voor-vanavond": {
    category: "weekend",
    label: "Voor vanavond",
    description:
      "Ideeen met avondgevoel: iets eten, live muziek, samen op pad of een plan dat niet te veel voorbereiding vraagt.",
  },
} as const;

function getRouteCategory(category: string) {
  if (category in inspirationRouteConfig) {
    return inspirationRouteConfig[category as keyof typeof inspirationRouteConfig];
  }

  if (isInspirationCategorySlug(category)) {
    return {
      category,
      label: inspirationCategoryLabels[category],
      description: inspirationCategoryDescriptions[category],
    };
  }

  return undefined;
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
  return [
    ...getInspirationStaticParams(),
    ...Object.keys(inspirationRouteConfig).map((category) => ({ category })),
  ];
}

export function generateMetadata({ params }: PageProps) {
  const routeCategory = getRouteCategory(params.category);

  if (!routeCategory) {
    return {
      title: "Inspiratie | Uitjes",
      alternates: {
        canonical: `/inspiratie/${encodeURIComponent(params.category)}`,
      },
    };
  }

  return {
    title: `${routeCategory.label} | Uitjes`,
    description: routeCategory.description,
    alternates: {
      canonical: `/inspiratie/${encodeURIComponent(params.category)}`,
    },
  };
}

export default function InspirationCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const routeCategory = getRouteCategory(params.category);

  if (!routeCategory) {
    notFound();
  }

  const categoryLabel = routeCategory.label;
  const results = getInspirationResultsByCategory(
    routeCategory.category,
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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_6%,rgba(198,223,154,0.2),transparent_26%),radial-gradient(circle_at_84%_10%,rgba(247,231,200,0.34),transparent_24%),linear-gradient(180deg,#fbf7ef,#f8f5f3_46%,#f6f1ea)] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-5 pb-8 sm:pt-7 sm:pb-10 lg:pt-8 lg:pb-14">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Inspiratie", href: "/inspiratie" },
              { label: categoryLabel },
            ]}
            className="mb-6"
          />

          <div className="uitjes-liquid-section rounded-[2rem] px-5 py-7 sm:rounded-[2.4rem] sm:px-8 sm:py-10 lg:px-11 lg:py-12">
            <div className="pointer-events-none absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#c6df9a]/16 blur-3xl" />
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div className="max-w-[42rem]">
                <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                  Inspiratie
                </div>

                <h1 className="mt-5 max-w-[12ch] text-[clamp(2.55rem,8vw,5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:mt-6">
                  {locationContextLabel}
                </h1>

                <p className="mt-5 max-w-[34rem] text-base leading-7 text-white/76 sm:mt-6 sm:text-lg sm:leading-8">
                  {routeCategory.description}
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/14 bg-white/10 p-4 text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/64">
                  Volgende stap
                </p>
                <p className="mt-2 text-sm leading-6 text-white/76">
                  Verfijn op locatie of spring direct naar de resultaten die bij deze inspiratie passen.
                </p>
                <a
                  href="#resultaten"
                  className="mt-4 inline-flex min-h-10 items-center rounded-full border border-[#e8f2d0]/70 bg-[#e8f2d0] px-4 text-sm font-semibold text-[#162016] transition hover:bg-[#f2f8df]"
                >
                  Bekijk resultaten
                </a>
              </div>
            </div>

            <div className="mt-8">
              <Suspense fallback={null}>
                <InspirationLocationContext compact />
              </Suspense>
            </div>
          </div>

          <div className="mt-9 sm:mt-12">
            <h2 className="text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-[#171511]">
              Snelle keuzes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">
              Een paar compacte suggesties om meteen door te klikken binnen dezelfde inspiratieflow.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {quickChoices.map((item) => (
                <Link
                  key={item.slug}
                  href={withContext(
                    `/inspiratie/${item.category}/${item.slug}`,
                    contextQuery
                  )}
                  className="group relative min-h-[174px] overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/50 shadow-[0_18px_44px_rgba(72,56,38,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:rounded-[1.7rem] md:min-h-[220px]"
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
        <div id="resultaten" className="scroll-mt-28">
          <div className="flex flex-col gap-4 bg-[linear-gradient(90deg,rgba(242,248,231,0.54),rgba(255,250,240,0.24),transparent)] py-3 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667b36]">
                Resultaten
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                {locationContextLabel}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">
                {results.length} suggesties op basis van deze inspiratiecategorie en je locatiecontext.
              </p>
            </div>

            <Link
              href={withContext("/inspiratie", contextQuery)}
              className="inline-flex min-h-10 w-fit items-center rounded-full border border-[#d6c9b8] bg-white/78 px-4 text-sm font-semibold text-[#4b3a28] shadow-[0_12px_28px_rgba(72,56,38,0.08)] transition hover:bg-white"
            >
              Naar keuzehulp
            </Link>
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <ResultCard
                key={item.slug}
                item={item}
                href={withContext(
                  `/inspiratie/${item.category}/${item.slug}`,
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
