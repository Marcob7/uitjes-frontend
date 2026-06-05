import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import CityExploreMapSection from "@/components/city-explore/CityExploreMapSection";
import type { BackendEvent } from "@/components/city-explore/types";
import FavouriteButton from "@/components/FavouriteButton";
import { AppCard, AppSection } from "@/components/ui/app";
import {
  buildActionSearchHref,
  buildMapsSearchHref,
} from "@/lib/actionLinks";
import {
  getAllExploreDetailSlugs,
  getExploreDetailBySlug,
  getFallbackExploreTitle,
  mapCityContentToExploreDetail,
} from "@/lib/exploreDetailData";
import { getCityContentBySlug } from "@/lib/api/cityContent";
import { normalizeCitySlug } from "@/lib/cityConfig";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    city?: string;
  };
};

export const dynamicParams = true;
export const runtime = "edge";

export function generateStaticParams() {
  return getAllExploreDetailSlugs().map((slug) => ({
    slug,
  }));
}

function cleanMetadataText(value?: string | null) {
  const cleaned = value?.trim();

  if (!cleaned || ["undefined", "null", "nan"].includes(cleaned.toLowerCase())) {
    return null;
  }

  return cleaned;
}

function getMetadataDescription(item: NonNullable<Awaited<ReturnType<typeof getExploreDetail>>>) {
  return (
    cleanMetadataText(item.description) ||
    cleanMetadataText(item.aboutText) ||
    `${item.title} is een uitje in ${item.city}.`
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const item = await getExploreDetail(params.slug);

    if (!item) {
      return {
        title: "Uitje niet gevonden | Uitjes",
        description:
          "Dit uitje is niet beschikbaar. Ontdek andere activiteiten en plekken in Nederland.",
      };
    }

    const title = cleanMetadataText(item.title) || getFallbackExploreTitle(params.slug);
    const city = cleanMetadataText(item.city) || "Nederland";

    return {
      title: `${title} in ${city} | Uitjes`,
      description: getMetadataDescription(item),
      alternates: {
        canonical: `/ontdek/${encodeURIComponent(params.slug)}`,
      },
    };
  } catch {
    return {
      title: `${getFallbackExploreTitle(params.slug)} | Uitjes`,
      description: "Bekijk dit uitje en ontdek meer activiteiten in Nederland.",
      alternates: {
        canonical: `/ontdek/${encodeURIComponent(params.slug)}`,
      },
    };
  }
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3.5 8.2 2.7 2.7 6.3-6.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompactInfo({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string | null;
}) {
  if (!value) return null;

  const content = href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[#2f491a] underline decoration-[#b8cf79] underline-offset-4 transition hover:text-[#171511]"
    >
      {value}
    </a>
  ) : (
    value
  );

  return (
    <div className="border-t border-[#d9cec1]/70 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#746355]">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-[#211a14]">{content}</dd>
    </div>
  );
}

function getSafeExternalUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function hasFreePricingLabel(value?: string | null) {
  return value?.toLowerCase().includes("gratis") ?? false;
}

function getPrimaryCtaLabel({
  hasTicket,
  hasReservation,
  hasSource,
  isFree,
  fallbackLabel,
}: {
  hasTicket: boolean;
  hasReservation: boolean;
  hasSource: boolean;
  isFree: boolean;
  fallbackLabel: string;
}) {
  if (hasTicket) return "Bekijk tickets";
  if (hasReservation) return "Reserveer";
  if (hasSource) return isFree ? "Meer informatie" : "Bekijk officiele website";
  return fallbackLabel;
}

function getUsableHeroImage(value?: string | null) {
  const image = value?.trim();

  if (!image || image === "/images/apeldoorn_img.jpg") {
    return null;
  }

  return image;
}

function parseCoordinates(value?: string | null) {
  if (!value) return null;

  const [latitudeValue, longitudeValue] = value
    .split(",")
    .map((part) => Number(part.trim()));

  if (!Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue)) {
    return null;
  }

  return { latitude: latitudeValue, longitude: longitudeValue };
}

function formatRating(item: NonNullable<Awaited<ReturnType<typeof getExploreDetail>>>) {
  if (typeof item.ratingValue !== "number") return null;

  const max = typeof item.ratingMax === "number" ? item.ratingMax : 5;
  const reviews =
    typeof item.reviewCount === "number"
      ? ` (${new Intl.NumberFormat("nl-NL").format(item.reviewCount)} reviews)`
      : "";
  const source = item.ratingSource ? ` via ${item.ratingSource}` : "";

  return `${item.ratingValue.toFixed(1).replace(".", ",")} / ${max}${reviews}${source}`;
}

function buildMapEvent(
  item: NonNullable<Awaited<ReturnType<typeof getExploreDetail>>>
): BackendEvent | null {
  const parsedCoordinates = parseCoordinates(item.practical.coordinates);
  const latitude =
    typeof item.latitude === "number" ? item.latitude : parsedCoordinates?.latitude;
  const longitude =
    typeof item.longitude === "number" ? item.longitude : parsedCoordinates?.longitude;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  return {
    id: item.eventId ?? 0,
    slug: item.slug,
    title: item.title,
    city: item.city,
    venue: item.practical.venue || item.practical.address || null,
    start_at: null,
    end_at: null,
    date_text: item.practical.openingHours || null,
    is_ongoing: false,
    is_free: item.practical.pricing?.toLowerCase().includes("gratis") ?? false,
    price_min: null,
    price_note: item.practical.pricing || null,
    source_url: item.links?.sourceUrl || null,
    latitude,
    longitude,
    summary: item.description || item.aboutText,
    rating_value: item.ratingValue ?? null,
    review_count: item.reviewCount ?? null,
    rating_source: item.ratingSource ?? null,
    rating_max: item.ratingMax ?? null,
    category_label: item.category,
    kind: item.kind || null,
    tags: item.tags,
  };
}

async function getExploreDetail(slug: string) {
  const fallbackItem = getExploreDetailBySlug(slug);

  if (fallbackItem) {
    return fallbackItem;
  }

  const cityContentItem = await getCityContentBySlug(slug);

  if (!cityContentItem) {
    return null;
  }

  return mapCityContentToExploreDetail(cityContentItem, slug);
}

function getExploreBackHref(item: Awaited<ReturnType<typeof getExploreDetail>>, city?: string) {
  const citySlug = normalizeCitySlug(city || item?.citySlug || item?.city);

  return citySlug ? `/ontdek?city=${encodeURIComponent(citySlug)}` : "/ontdek";
}

export default async function ExploreDetailPage({ params, searchParams }: PageProps) {
  const item = await getExploreDetail(params.slug);

  if (!item) {
    notFound();
  }

  const exploreBackHref = getExploreBackHref(item, searchParams?.city);

  const locationQuery = [item.practical.venue, item.practical.address, item.city]
    .filter(Boolean)
    .join(", ");
  const heroImage = getUsableHeroImage(item.heroImage);
  const ratingLabel = formatRating(item);
  const mapEvent = buildMapEvent(item);
  const mapEvents = mapEvent ? [mapEvent] : [];
  const ticketHref = getSafeExternalUrl(item.links?.ticketUrl);
  const reservationHref = getSafeExternalUrl(item.links?.reservationUrl);
  const sourceHref = getSafeExternalUrl(item.links?.sourceUrl);
  const isFree = hasFreePricingLabel(item.practical.pricing);
  const reserveHref =
    ticketHref ||
    reservationHref ||
    sourceHref ||
    buildActionSearchHref({
      title: item.title,
      location: locationQuery,
      actionLabel: item.actions.reserveLabel,
    });
  const primaryCtaLabel = getPrimaryCtaLabel({
    hasTicket: Boolean(ticketHref),
    hasReservation: Boolean(reservationHref),
    hasSource: Boolean(sourceHref),
    isFree,
    fallbackLabel: item.actions.reserveLabel,
  });
  const routeHref = locationQuery ? buildMapsSearchHref(locationQuery) : null;
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(198,223,154,0.2),transparent_24%),radial-gradient(circle_at_86%_8%,rgba(247,231,200,0.35),transparent_26%),linear-gradient(180deg,#fbf7ef,#f8f5f3_45%,#f6f1ea)] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-6 pb-10 lg:pt-8 lg:pb-12">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Ontdek", href: exploreBackHref },
              { label: item.title },
            ]}
            className="mb-6"
          />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
            <div className="min-w-0">
              <AppCard
                variant="glass"
                padding="lg"
                className="rounded-[2rem] border-[#d9cec1]/70 bg-white/76 text-[#211a14] shadow-[0_22px_58px_rgba(66,49,31,0.12)]"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#d9cec1]/80 bg-[#fbf8f3] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#4b4036]">
                    {item.category}
                  </span>
                  <span className="rounded-full border border-[#bfd58d]/80 bg-[#e8f2d0] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#162016]">
                    {item.status}
                  </span>
                </div>

                <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#746355]">
                      {item.city}
                    </p>
                    <h1 className="mt-3 max-w-[13ch] text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-[#171511]">
                      {item.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-[#4b4036] md:text-lg">
                      {item.subtitle}
                    </p>
                  </div>

                  {heroImage ? (
                    <div className="relative min-h-[220px] overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/55 shadow-[0_18px_42px_rgba(66,49,31,0.12)] xl:min-h-[310px]">
                      <Image
                        src={heroImage}
                        alt={item.heroImageAlt || item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 100vw, 340px"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="rounded-[1.6rem] border border-[#d9cec1]/80 bg-[#fbf8f3]/76 p-5 text-sm leading-6 text-[#66584a]">
                      <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#746355]">
                        Geen beeld
                      </div>
                      <p className="mt-2">
                        De beschikbare informatie staat hier centraal; er is geen
                        grote fotosectie nodig om dit moment te beoordelen.
                      </p>
                    </div>
                  )}
                </div>
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="mt-6 rounded-[2rem] border-[#d9cec1]/70 bg-white/80 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.1)]"
              >
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  {item.aboutTitle}
                </h2>
                <p className="mt-5 max-w-4xl text-base leading-8 text-[#3f3429] md:text-lg">
                  {item.aboutText}
                </p>

                {item.description ? (
                  <p className="mt-6 max-w-4xl border-t border-[#d9cec1]/70 pt-6 text-sm leading-7 text-[#5b4c3e] md:text-base">
                    {item.description}
                  </p>
                ) : null}
              </AppCard>

              {item.reasons.length > 0 ? (
                <AppCard
                  variant="glass"
                  padding="lg"
                  className="mt-6 rounded-[2rem] border-[#d9cec1]/70 bg-white/72 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.1)]"
                >
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                    Waarom dit past
                  </h2>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {item.reasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-3 text-sm leading-6 text-[#2d241c]">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f2d0] text-[#162016]">
                          <CheckIcon />
                        </span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </AppCard>
              ) : null}

              {item.tags && item.tags.length > 0 ? (
                <AppCard
                  variant="glass"
                  padding="lg"
                  className="mt-6 rounded-[2rem] border-[#d9cec1]/70 bg-white/72 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.1)]"
                >
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                    Tags en categorie
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[item.category, ...item.tags].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#d9cec1]/80 bg-[#fbf8f3] px-3 py-1.5 text-xs font-semibold text-[#4b4036]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </AppCard>
              ) : null}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-8">
              <AppCard
                variant="elevated"
                padding="md"
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.12)]"
              >
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noreferrer"
                  className="uitjes-cta mb-3 inline-flex min-h-14 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  {primaryCtaLabel}
                </a>

                <div className={`grid gap-3 ${routeHref ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                  {routeHref ? (
                    <a
                      href={routeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9aa98]/70 bg-[#f7f1e8] px-4 text-sm font-medium text-[#211a14] transition hover:bg-[#efe4d7]"
                    >
                      {item.actions.routeLabel}
                    </a>
                  ) : null}
                  {typeof item.eventId === "number" ? (
                    <FavouriteButton eventId={item.eventId} />
                  ) : (
                    <div className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9cec1]/80 bg-white/55 px-4 text-sm font-medium text-[#746355]">
                      Bewaren binnenkort beschikbaar
                    </div>
                  )}
                </div>

                {sourceHref && reserveHref !== sourceHref ? (
                  <a
                    href={sourceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#d9cec1]/80 bg-white/70 px-4 text-sm font-medium text-[#4b4036] transition hover:bg-[#fbf8f3]"
                  >
                    Open website
                  </a>
                ) : null}
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.12)]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                  Praktisch
                </h3>

                <dl className="mt-5">
                  <CompactInfo label="Locatie" value={item.practical.venue} />
                  <CompactInfo label="Stad" value={item.city} />
                  <CompactInfo label="Adres" value={item.practical.address} />
                  <CompactInfo label="Datum en tijd" value={item.practical.openingHours} />
                  <CompactInfo label="Prijs" value={item.practical.pricing} />
                  <CompactInfo label="Categorie/type" value={item.practical.cuisine || item.kind} />
                  <CompactInfo label="Reviews" value={ratingLabel} />
                  <CompactInfo
                    label={ticketHref ? "Tickets" : sourceHref ? "Bron" : "Website"}
                    value={ticketHref ? "Bekijk tickets" : sourceHref ? "Open bron" : null}
                    href={ticketHref || sourceHref}
                  />
                  <CompactInfo label="Praktische info" value={item.practical.practicalInfo} />
                </dl>
              </AppCard>

              {mapEvents.length > 0 ? (
                <CityExploreMapSection
                  cityLabel={item.city}
                  events={mapEvents}
                  layout="embedded"
                />
              ) : locationQuery ? (
                <div className="rounded-[1.8rem] border border-[#d9cec1]/70 bg-white/66 p-5 text-sm leading-6 text-[#66584a] shadow-[0_14px_34px_rgba(66,49,31,0.08)] backdrop-blur-xl">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#746355]">
                    Kaart niet beschikbaar
                  </div>
                  <p className="mt-2">
                    Er zijn nog geen bruikbare coordinaten voor deze locatie.
                    Gebruik de routeknop voor een zoekroute.
                  </p>
                </div>
              ) : null}
            </aside>
          </section>
        </div>
      </AppSection>
    </main>
  );
}
