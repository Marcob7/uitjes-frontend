import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SavePlaceButton from "@/components/SavePlaceButton";
import { AppCard, AppSection } from "@/components/ui/app";
import {
  buildActionSearchHref,
  buildMapsSearchHref,
} from "@/lib/actionLinks";
import {
  getInspirationCityLabel,
  getInspirationDetailStaticParams,
  getInspirationLocationMode,
  getInspirationResultBySlug,
  getSimilarInspirationResults,
  inspirationCategoryLabels,
  isInspirationCategorySlug,
} from "@/lib/dummy/inspirationResults";
import { optimizeCssBackground } from "@/lib/remoteImage";

type PageProps = {
  params: {
    category: string;
    slug: string;
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

function getResultCategoryForRoute(
  routeCategory: string,
  categories: string[],
  fallbackCategory: string
) {
  return categories.includes(routeCategory) ? routeCategory : fallbackCategory;
}

function getLocationContextLabel(searchParams?: PageProps["searchParams"]) {
  const mode = getInspirationLocationMode(searchParams?.location);
  const cityLabel = getInspirationCityLabel(
    searchParams?.location,
    searchParams?.nearbyCity
  );

  if (mode === "city" && cityLabel) return `Meer in ${cityLabel}`;
  if (mode === "nearby" && cityLabel) return `Meer ${cityLabel}`;
  return "Brede inspiratie";
}

export function generateStaticParams() {
  return getInspirationDetailStaticParams();
}

export default function InspirationDetailPage({
  params,
  searchParams,
}: PageProps) {
  if (!isInspirationCategorySlug(params.category)) {
    notFound();
  }

  const result = getInspirationResultBySlug(params.category, params.slug);

  if (!result) {
    notFound();
  }

  const categoryLabel = inspirationCategoryLabels[params.category];
  const contextQuery = buildContextQuery(searchParams);
  const locationContextLabel = getLocationContextLabel(searchParams);
  const reserveHref = buildActionSearchHref({
    title: result.title,
    location: result.location,
    actionLabel: "reserveer",
  });
  const routeHref = buildMapsSearchHref(result.location);
  const savedPlace = {
    id: `inspiratie:${params.category}/${result.slug}`,
    title: result.title,
    href: withContext(`/inspiratie/${params.category}/${result.slug}`, contextQuery),
    meta: `${result.city} - ${categoryLabel} - ${result.rating}`,
    image: result.image,
  };
  const similar = getSimilarInspirationResults(result);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-12">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Inspiratie", href: "/inspiratie" },
              {
                label: categoryLabel,
                href: withContext(`/inspiratie/${params.category}`, contextQuery),
              },
              { label: result.title },
            ]}
            className="mb-6"
          />

          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div
              className="min-h-[420px] w-full bg-cover bg-center md:min-h-[560px]"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.12)), ${optimizeCssBackground(
                  result.image,
                  {
                    width: 1280,
                    quality: 58,
                  }
                )}`,
              }}
              aria-label={result.title}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(7,19,26,0.08),rgba(7,19,26,0.58))]" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur-xl">
                  {categoryLabel}
                </span>
                <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur-xl">
                  {result.city}
                </span>
                <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur-xl">
                  {locationContextLabel}
                </span>
              </div>

              <h1 className="max-w-[760px] text-[clamp(3rem,8vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                {result.title}
              </h1>

              <p className="mt-3 text-sm font-medium text-white/90 md:text-base">
                {result.city} - {result.categoryLabel} - {result.price} - {result.rating}
              </p>
            </div>
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-0 pb-8 md:pb-12">
        <div>
          <div className="mb-6 flex flex-wrap gap-3">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full border border-[#d7cfbf] bg-white/82 px-4 py-2 text-xs font-semibold text-[#3f362f] shadow-[0_10px_24px_rgba(60,44,23,0.05)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.85fr]">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                Waarom dit een goede keuze is
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {result.reasons.map((reason) => (
                  <AppCard
                    key={reason}
                    variant="soft"
                    padding="sm"
                    className="flex items-start gap-3 rounded-[1.4rem] border-[#ded8cc] bg-white/78 text-[#2f2a24] shadow-[0_16px_34px_rgba(60,44,23,0.08)]"
                  >
                    <div className="mt-0.5 text-[#355226]">
                      <LeafIcon />
                    </div>
                    <p className="text-sm text-[#4d443b]">{reason}</p>
                  </AppCard>
                ))}
              </div>

              <AppCard
                variant="glass"
                padding="lg"
                className="mt-10 rounded-[2.1rem] border-[#ded8cc] bg-white/80 text-[#2f2a24] shadow-[0_18px_42px_rgba(60,44,23,0.1)]"
              >
                <h3 className="text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#171511]">
                  Over deze plek
                </h3>

                <div className="mt-6 space-y-5 text-sm leading-7 text-[#5a5047] md:text-[15px]">
                  <p>{result.description}</p>
                  <p>{result.practicalInfo}</p>
                  <p>
                    Deze pagina gebruikt nu dummy result-data met velden voor
                    titel, stad, categorie, beschrijving, praktische info, tags,
                    prijs en locatie. De vorm is bewust service-achtig gehouden.
                  </p>
                </div>
              </AppCard>
            </div>

            <aside className="space-y-5">
              <AppCard
                variant="elevated"
                padding="md"
                className="rounded-[1.8rem] border-[#ded8cc] bg-white/82 text-[#2f2a24] shadow-[0_24px_58px_rgba(60,44,23,0.12)]"
              >
                <div className="flex flex-col gap-3">
                  <Link
                    href={withContext(`/inspiratie/${params.category}`, contextQuery)}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b7cc82] bg-[#edf5d8] px-5 text-center text-sm font-semibold text-[#25341c] transition hover:bg-[#f3f8e6]"
                  >
                    {locationContextLabel}
                  </Link>
                  <a
                    href={reserveHref}
                    target="_blank"
                    rel="noreferrer"
                    className="uitjes-cta inline-flex h-14 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:-translate-y-0.5"
                  >
                    Reserveer nu
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={routeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d7cfbf] bg-white/76 text-sm font-semibold text-[#3f362f] transition hover:bg-white"
                    >
                      <MapIcon />
                      Bekijk route
                    </a>

                    <SavePlaceButton
                      item={savedPlace}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d7cfbf] bg-white/76 text-sm font-semibold text-[#3f362f] transition hover:bg-white"
                      savedClassName="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#b7cc82] bg-[#edf5d8] text-sm font-semibold text-[#25341c] transition hover:bg-[#f3f8e6]"
                      savedChildren={
                        <>
                          <SaveIcon />
                          Opgeslagen
                        </>
                      }
                    >
                      <SaveIcon />
                      Sla op
                    </SavePlaceButton>
                  </div>
                </div>
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="rounded-[1.8rem] border-[#ded8cc] bg-white/82 text-[#2f2a24] shadow-[0_18px_42px_rgba(60,44,23,0.1)]"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#171511]">
                  Praktisch
                </h3>

                <div className="mt-6 space-y-5">
                  <InfoRow icon={<PinIcon />} label="Locatie" value={result.location} />
                  <InfoRow icon={<ClockIcon />} label="Openingstijden" value={result.openingHours} />
                  <InfoRow icon={<TagIcon />} label="Type" value={result.type} />
                  <InfoRow icon={<MoneyIcon />} label="Prijs" value={result.price} />
                </div>
              </AppCard>
            </aside>
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-0 pb-12 md:pb-16">
        <div>
          <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
            In beeld
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {result.gallery.map((galleryImage, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.5rem] border border-white/14 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
              >
                <div
                  className="aspect-[0.88/1] w-full bg-cover bg-center"
                  style={{
                    backgroundImage: optimizeCssBackground(galleryImage, {
                      width: 640,
                      quality: 56,
                    }),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16 md:pb-24">
        <div>
          <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
            Vergelijkbare plekken
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((item) => (
              <Link
                key={item.slug}
                href={withContext(
                  `/inspiratie/${getResultCategoryForRoute(
                    params.category,
                    item.categories,
                    item.category
                  )}/${item.slug}`,
                  contextQuery
                )}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-[1.7rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <div
                    className="aspect-[0.95/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: optimizeCssBackground(item.image, {
                        width: 760,
                        quality: 56,
                      }),
                    }}
                  />

                  <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#25341c] backdrop-blur-md">
                    {item.city}
                  </span>
                </div>

                <div className="pt-4">
                  <h3 className="text-[1.7rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#665d54]">
                    {item.categoryLabel} - {item.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AppSection>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#355226]">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#2f2a24]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#5a5047]">{value}</p>
      </div>
    </div>
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

function ClockIcon() {
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
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function TagIcon() {
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
      <path d="M20 10 12 2H5a3 3 0 0 0-3 3v7l8 8a3 3 0 0 0 4.2 0l5.8-5.8a3 3 0 0 0 0-4.2Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  );
}

function MoneyIcon() {
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
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 10h.01M17 14h.01" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 4c-7 0-12 4-12 10a6 6 0 0 0 6 6c6 0 8-7 8-16Z" />
      <path d="M8 14c2-1 4-3 6-6" />
    </svg>
  );
}

function MapIcon() {
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
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}

function SaveIcon() {
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
      <path d="M6 4h12v17l-6-3-6 3V4Z" />
    </svg>
  );
}
