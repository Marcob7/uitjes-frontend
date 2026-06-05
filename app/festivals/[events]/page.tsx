import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import {
  buildGoogleCalendarHref,
  buildTicketSearchHref,
} from "@/lib/actionLinks";
import { optimizeCssBackground } from "@/lib/remoteImage";
import {
  generateFestivalStaticParams,
  getDiscoverMoreFestivals,
  getFestivalBySlug,
  getFestivalDetailHref,
  type FestivalDetail,
  type FestivalInfoCard,
  type FestivalTicketTier,
} from "../data";

type PageProps = {
  params: {
    events: string;
  };
};

const FESTIVAL_YEAR = 2024;
const MONTH_INDEX_BY_NAME: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return generateFestivalStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const festival = getFestivalBySlug(params.events);

  if (!festival) {
    return {
      title: "Festival | Uitjes NL",
    };
  }

  return {
    title: `${festival.name} | Uitjes NL`,
    description: `${festival.dateLabel} in ${festival.locationLabel}.`,
    alternates: {
      canonical: `/festivals/${encodeURIComponent(params.events)}`,
    },
  };
}

function getFestivalDayDate(dateLabel: string) {
  const [monthName, dayValue] = dateLabel.split(" ");
  const monthIndex = MONTH_INDEX_BY_NAME[monthName.toLowerCase()];
  const day = Number.parseInt(dayValue, 10);

  return new Date(Date.UTC(FESTIVAL_YEAR, monthIndex, day, 12, 0, 0));
}

function CalendarMiniIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14s4-3.6 4-7.333A4 4 0 1 0 4 6.667C4 10.4 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.667" r="1.4" fill="currentColor" />
    </svg>
  );
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

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccessibilityIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="3.75" r="1.75" fill="currentColor" />
      <path
        d="M5.5 7.5h9M10 7.5v8.75M7.25 16.25 10 12.5l2.75 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacilityIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3.75v12.5M6.25 6.25h7.5M6.25 10h7.5M6.25 13.75h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="8.5"
        width="10"
        height="7.5"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8.5V6.75A3 3 0 0 1 10 3.75a3 3 0 0 1 3 3v1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroMeta({ festival }: { festival: FestivalDetail }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/88">
      <span className="inline-flex items-center gap-2">
        <CalendarMiniIcon />
        {festival.dateLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <PinIcon />
        {festival.locationLabel}
      </span>
    </div>
  );
}

function TicketCard({
  tier,
  ticketHref,
}: {
  tier: FestivalTicketTier;
  ticketHref: string;
}) {
  const toneClass =
    tier.tone === "lime"
      ? "bg-[#dff4b8]"
      : tier.tone === "mist"
        ? "bg-[#ececf5]"
        : "bg-[#f3e7de]";

  return (
    <article className={`rounded-[1.8rem] border border-white/20 ${toneClass} p-5 shadow-[0_18px_44px_rgba(0,0,0,0.14)]`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-medium text-[#171511]">{tier.name}</p>
          <p className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#171511]">
            {tier.priceLabel}
          </p>
        </div>
        {tier.badge ? (
          <span className="rounded-full bg-[#d7f08e] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#496628]">
            {tier.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {tier.bullets.map((bullet) => (
          <div key={bullet} className="flex items-start gap-2 text-sm text-[#4f463d]">
            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-[#4e6c29]">
              <CheckIcon />
            </span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      <a
        href={ticketHref}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#171511] px-5 text-sm font-semibold text-white transition hover:bg-[#2a241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4e6c29]"
      >
        Purchase
      </a>
    </article>
  );
}

function InfoCard({ card }: { card: FestivalInfoCard }) {
  const toneClass =
    card.tone === "mint"
      ? "bg-white/12"
      : card.tone === "rose"
        ? "bg-[#f2e6dd]"
        : "bg-[#f6ebd6]";

  const icon =
    card.title === "Accessibility" ? (
      <AccessibilityIcon />
    ) : card.title === "Facilities" ? (
      <FacilityIcon />
    ) : (
      <LockIcon />
    );

  return (
    <article className={`rounded-[1.7rem] border border-white/18 ${toneClass} px-5 py-6 shadow-[0_18px_44px_rgba(0,0,0,0.12)]`}>
      <div className="text-[#496628]">{icon}</div>
      <h3 className="mt-5 max-w-none text-xl leading-none tracking-[-0.04em] text-[#171511]">
        {card.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#5d5145]">{card.description}</p>
      <p className="mt-5 text-xs font-medium text-[#6a5f54]">{card.cta}</p>
    </article>
  );
}

export default function FestivalDetailPage({ params }: PageProps) {
  const festival = getFestivalBySlug(params.events);

  if (!festival) {
    notFound();
  }

  const discoverMore = getDiscoverMoreFestivals(festival.slug);
  const ticketSearchHref = buildTicketSearchHref(
    festival.name,
    festival.locationLabel
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: festival.name },
          ]}
          className="mb-6"
        />

        <section
          className="relative overflow-hidden rounded-[2.4rem] border border-white/14 bg-[#181614] px-5 py-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.26)] sm:px-6 sm:py-6"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(9,12,12,0.34), rgba(9,12,12,0.76)), ${optimizeCssBackground(
              festival.heroImage,
              {
                width: 1600,
                quality: 60,
              }
            )}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(198,223,154,0.18),transparent_24%),linear-gradient(180deg,rgba(7,19,26,0.06),rgba(7,19,26,0.66))]" />
          <div className="relative flex min-h-[20rem] flex-col justify-end sm:min-h-[26rem] lg:min-h-[34rem]">
            <div className="inline-flex w-fit rounded-full border border-white/28 bg-[#07131a]/44 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
              {festival.matchScore}% Match
            </div>
            <h1 className="mt-5 max-w-[11ch] text-[clamp(3rem,8vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">
              {festival.name}
            </h1>
            <HeroMeta festival={festival} />
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <h2 className="max-w-none text-[clamp(2.1rem,5vw,3.3rem)] leading-[0.95] tracking-[-0.06em] text-[#171511]">
              {festival.benchmarkPrefix}{" "}
              <span className="rounded-xl bg-[#e8f2d0] px-2 text-[#162016]">
                {festival.benchmarkHighlight}
              </span>{" "}
              {festival.benchmarkSuffix}
            </h2>

            <div className="mt-6 max-w-[36rem] space-y-5 text-[15px] leading-8 text-[#665d54]">
              {festival.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            className="min-h-[18rem] overflow-hidden rounded-[1.8rem] border border-white/14 bg-[#161412] shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(7,7,7,0.06), rgba(7,7,7,0.24)), ${optimizeCssBackground(
                festival.sideImage,
                {
                  width: 920,
                  quality: 58,
                }
              )}`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </section>

        <section className="uitjes-liquid-section rounded-[2.2rem] px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="max-w-none text-[clamp(1.9rem,4vw,2.8rem)] leading-[0.98] tracking-[-0.05em] text-white">
                Daily Lineup
              </h2>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/82">
              Amsterdam 2024
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {festival.lineupDays.map((day) => {
              const calendarStart = getFestivalDayDate(day.dateLabel);
              const calendarHref = buildGoogleCalendarHref({
                title: `${festival.name} - ${day.label}`,
                details: day.acts
                  .map((act) => `${act.name} (${act.genre})`)
                  .join(", "),
                location: festival.locationLabel,
                start: calendarStart,
                end: new Date(calendarStart.getTime() + 8 * 60 * 60 * 1000),
              });

              return (
                <article
                  key={day.label}
                  className={`rounded-[1.6rem] border px-5 py-5 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl ${
                    day.featured
                      ? "border-[#e8f2d0]/54 bg-[#e8f2d0] text-[#171511]"
                      : "border-white/14 bg-white/10 text-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${day.featured ? "text-[#445b24]" : "text-white/84"}`}>
                        {day.label}
                      </p>
                      <h3 className={`mt-2 max-w-none text-[1.8rem] leading-none tracking-[-0.05em] ${day.featured ? "text-[#171511]" : "text-white"}`}>
                        {day.dateLabel}
                      </h3>
                    </div>
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${day.featured ? "bg-[#171511] text-white" : "bg-white/16 text-white"}`}>
                      <CalendarMiniIcon />
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {day.acts.map((act) => (
                      <div key={act.name} className="border-b border-[#23170f]/8 pb-4 last:border-b-0 last:pb-0">
                        <p className={`text-base font-medium ${day.featured ? "text-[#171511]" : "text-white"}`}>{act.name}</p>
                        <p className={`mt-1 text-[13px] ${day.featured ? "text-[#4f463d]" : "text-white/82"}`}>{act.genre}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] ${
                      day.featured
                        ? "bg-[#171511] text-white hover:bg-[#2a241d]"
                        : "border border-white/28 bg-white/16 backdrop-blur-xl text-white hover:bg-white/22"
                    }`}
                  >
                    Add to Calendar
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-12">
          <div className="text-center">
            <h2 className="max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
              Choose Your Access
            </h2>
            <p className="mt-2 text-sm text-[#665d54]">
              Limited tiers remaining. Secure your journey into sound.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {festival.ticketTiers.map((tier) => (
              <TicketCard key={tier.name} tier={tier} ticketHref={ticketSearchHref} />
            ))}
          </div>
        </section>

        <section className="pb-12">
          <h2 className="max-w-none text-[clamp(1.9rem,4vw,2.7rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
            Practical Info
          </h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {festival.infoCards.map((card) => (
              <InfoCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="pb-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="max-w-none text-[clamp(1.9rem,4vw,2.7rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
              Discover More
            </h2>
            <div className="flex gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d9cc] bg-white/10 backdrop-blur-xl text-[#8f8171]">
                <ArrowIcon />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d9cc] bg-white/10 backdrop-blur-xl text-[#8f8171]">
                <ArrowIcon />
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {discoverMore.map((item) => (
              <Link
                key={item.slug}
                href={getFestivalDetailHref(item.slug)}
              className="group relative block overflow-hidden rounded-[1.5rem] bg-[#171511] text-white shadow-[0_16px_32px_rgba(24,18,12,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9cc84e]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.2), rgba(8,8,8,0.82)), ${optimizeCssBackground(
                    item.heroImage,
                    {
                      width: 720,
                      quality: 56,
                    }
                  )}`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex min-h-[15rem] flex-col justify-end p-5">
                  <h3 className="max-w-none text-[1.8rem] leading-none tracking-[-0.05em] text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/88">
                    {item.locationLabel} - {item.dateLabel}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
