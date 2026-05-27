import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
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
      const fallbackTitle = getFallbackExploreTitle(params.slug);

      return {
        title: `${fallbackTitle} | Uitjes`,
        description: "Bekijk dit uitje en ontdek meer activiteiten in Nederland.",
      };
    }

    const title = cleanMetadataText(item.title) || getFallbackExploreTitle(params.slug);
    const city = cleanMetadataText(item.city) || "Nederland";

    return {
      title: `${title} in ${city} | Uitjes`,
      description: getMetadataDescription(item),
    };
  } catch {
    return {
      title: `${getFallbackExploreTitle(params.slug)} | Uitjes`,
      description: "Bekijk dit uitje en ontdek meer activiteiten in Nederland.",
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

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#746355]">
        {label}
      </div>
      <div className="mt-1 text-sm leading-6 text-[#211a14]">{value}</div>
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
  const ticketHref = getSafeExternalUrl(item.links?.ticketUrl);
  const reservationHref = getSafeExternalUrl(item.links?.reservationUrl);
  const sourceHref = getSafeExternalUrl(item.links?.sourceUrl);
  const reserveHref =
    ticketHref ||
    reservationHref ||
    buildActionSearchHref({
      title: item.title,
      location: locationQuery,
      actionLabel: item.actions.reserveLabel,
    });
  const routeHref = locationQuery ? buildMapsSearchHref(locationQuery) : null;
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
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

          <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/50 shadow-[0_28px_80px_rgba(66,49,31,0.16)]">
            <div className="relative h-[430px] w-full md:h-[580px]">
              <Image
                src={item.heroImage}
                alt={item.heroImageAlt || item.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(7,19,26,0.08),rgba(7,19,26,0.68))]" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e8f2d0]/30 bg-[#152017]/72 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f7f4ed] backdrop-blur-xl">
                    {item.category}
                  </span>
                  <span className="rounded-full border border-[#e8f2d0]/50 bg-[#e8f2d0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#162016]">
                    {item.status}
                  </span>
                </div>

                <h1 className="max-w-[12ch] text-[clamp(3rem,8vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">
                  {item.title}
                </h1>

                <p className="mt-4 max-w-[42rem] text-sm leading-6 text-white/88 md:text-base">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_360px]">
            <div>
              <AppCard
                variant="glass"
                padding="lg"
                className="grid gap-7 rounded-[2.1rem] border-[#d9cec1]/70 bg-white/78 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)] md:grid-cols-[0.9fr_1.1fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#746355]">
                    Redactie
                  </p>
                  <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                    Waarom dit een goede keuze is
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {item.reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-start gap-3 rounded-[1.3rem] border border-[#d9cec1]/70 bg-[#fbf8f3]/82 p-4"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f2d0] text-[#162016]">
                        <CheckIcon />
                      </span>
                      <span className="text-sm leading-6 text-[#2d241c]">{reason}</span>
                    </div>
                  ))}
                </div>
              </AppCard>

              <AppCard
                variant="glass"
                padding="lg"
                className="mt-8 rounded-[2.1rem] border-[#d9cec1]/70 bg-white/78 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  {item.aboutTitle}
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#3f3429] md:text-base">
                  {item.aboutText}
                </p>

                {item.description ? (
                  <p className="mt-5 max-w-3xl border-t border-[#d9cec1]/70 pt-5 text-sm leading-7 text-[#5b4c3e]">
                    {item.description}
                  </p>
                ) : null}
              </AppCard>

              <div className="mt-8">
                <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  In beeld
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                  {item.gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-[0.88/1] overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/50 shadow-[0_14px_34px_rgba(66,49,31,0.1)]"
                    >
                      <Image
                        src={image}
                        alt={`${item.title} sfeerbeeld ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {item.tags && item.tags.length > 0 ? (
                <AppCard
                  variant="glass"
                  padding="lg"
                  className="mt-8 rounded-[2.1rem] border-[#d9cec1]/70 bg-white/78 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
                >
                  <h2 className="text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[#171511]">
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

              {item.similarPlaces.length > 0 ? (
                <div className="mt-14">
                  <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                    Vergelijkbare plekken
                  </h2>

                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {item.similarPlaces.map((place) => (
                      <article key={place.title} className="group">
                        <div className="relative aspect-[0.88/1] overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/50 shadow-[0_18px_44px_rgba(66,49,31,0.1)]">
                          <Image
                            src={place.image}
                            alt={place.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />

                          <span className="absolute left-3 top-3 rounded-full border border-[#e8f2d0]/35 bg-[#152017]/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f4ed] backdrop-blur-xl">
                            {place.badge}
                          </span>
                        </div>

                        <div className="pt-4">
                          <h3 className="text-2xl font-semibold leading-none tracking-[-0.04em] text-[#171511]">
                            {place.title}
                          </h3>
                          <p className="mt-2 text-sm text-[#665d54]">
                            {place.subtitle}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <AppCard
                variant="elevated"
                padding="md"
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noreferrer"
                  className="uitjes-cta mb-3 inline-flex min-h-14 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  {ticketHref
                    ? "Bekijk tickets"
                    : reservationHref
                      ? "Reserveer"
                      : item.actions.reserveLabel}
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

                {sourceHref ? (
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
                className="rounded-[1.8rem] border-[#d9cec1]/70 bg-white/82 text-[#211a14] shadow-[0_18px_42px_rgba(66,49,31,0.14)]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                  Praktisch
                </h3>

                <div className="mt-5 space-y-5">
                  <DetailRow label="Locatie" value={item.practical.venue} />
                  <DetailRow label="Adres" value={item.practical.address} />
                  <DetailRow label="Datum en tijd" value={item.practical.openingHours} />
                  <DetailRow label="Type" value={item.practical.cuisine} />
                  <DetailRow label="Prijs" value={item.practical.pricing} />
                  <DetailRow label="Coordinaten" value={item.practical.coordinates} />
                  <DetailRow label="Praktische info" value={item.practical.practicalInfo} />
                </div>
              </AppCard>
            </aside>
          </section>
        </div>
      </AppSection>
    </main>
  );
}
