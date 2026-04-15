import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  };
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

function TicketCard({ tier }: { tier: FestivalTicketTier }) {
  const toneClass =
    tier.tone === "lime"
      ? "bg-[#dff4b8]"
      : tier.tone === "mist"
        ? "bg-[#ececf5]"
        : "bg-[#f3e7de]";

  return (
    <article className={`rounded-[1.8rem] ${toneClass} p-5`}>
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
            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/75 text-[#4e6c29]">
              <CheckIcon />
            </span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#171511] px-5 text-sm font-semibold text-white transition hover:bg-[#2a241e]"
      >
        Purchase
      </button>
    </article>
  );
}

function InfoCard({ card }: { card: FestivalInfoCard }) {
  const toneClass =
    card.tone === "mint"
      ? "bg-[#dff0dc]"
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
    <article className={`rounded-[1.7rem] ${toneClass} px-5 py-6`}>
      <div className="text-[#171511]">{icon}</div>
      <h3 className="mt-5 max-w-none text-xl leading-none tracking-[-0.04em] text-[#171511]">
        {card.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#5a5046]">{card.description}</p>
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

  return (
    <main className="min-h-screen bg-[#f8f4ed] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section
          className="relative overflow-hidden rounded-[2rem] bg-[#181614] px-5 py-5 text-white shadow-[0_24px_60px_rgba(26,21,16,0.22)] sm:px-6 sm:py-6"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(9,12,12,0.18), rgba(9,12,12,0.58)), ${optimizeCssBackground(
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02),rgba(10,10,10,0.5))]" />
          <div className="relative flex min-h-[18rem] flex-col justify-end sm:min-h-[24rem] lg:min-h-[31rem]">
            <div className="inline-flex w-fit rounded-full bg-[#ddefb1] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#38571a]">
              {festival.matchScore}% Match
            </div>
            <h1 className="mt-4 max-w-none text-[clamp(2.7rem,8vw,5.3rem)] leading-[0.9] tracking-[-0.08em] text-white">
              {festival.name}
            </h1>
            <HeroMeta festival={festival} />
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <h2 className="max-w-none text-[clamp(2.1rem,5vw,3.3rem)] leading-[0.95] tracking-[-0.06em] text-[#171511]">
              {festival.benchmarkPrefix}{" "}
              <span className="bg-[#d8ef99] px-2 text-[#171511]">
                {festival.benchmarkHighlight}
              </span>{" "}
              {festival.benchmarkSuffix}
            </h2>

            <div className="mt-6 max-w-[36rem] space-y-5 text-[15px] leading-8 text-[#584e44]">
              {festival.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            className="min-h-[18rem] overflow-hidden rounded-[1.8rem] bg-[#161412] shadow-[0_18px_40px_rgba(27,20,14,0.18)]"
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

        <section className="rounded-[2rem] bg-[#f8edcf] px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="max-w-none text-[clamp(1.9rem,4vw,2.8rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
                Daily Lineup
              </h2>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8a75]">
              Amsterdam 2024
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {festival.lineupDays.map((day) => (
              <article
                key={day.label}
                className={`rounded-[1.6rem] px-5 py-5 shadow-[0_10px_24px_rgba(52,38,22,0.06)] ${
                  day.featured ? "bg-[#d8f3a8]" : "bg-white/88"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f816f]">
                      {day.label}
                    </p>
                    <h3 className="mt-2 max-w-none text-[1.8rem] leading-none tracking-[-0.05em] text-[#171511]">
                      {day.dateLabel}
                    </h3>
                  </div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/75 text-[#171511]">
                    <CalendarMiniIcon />
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {day.acts.map((act) => (
                    <div key={act.name} className="border-b border-black/8 pb-4 last:border-b-0 last:pb-0">
                      <p className="text-base font-medium text-[#171511]">{act.name}</p>
                      <p className="mt-1 text-[13px] text-[#655a4f]">{act.genre}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
                    day.featured
                      ? "bg-[#171511] text-white hover:bg-[#2a241d]"
                      : "border border-[#e2dacf] bg-white text-[#171511] hover:bg-[#faf7f2]"
                  }`}
                >
                  Add to Calendar
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="text-center">
            <h2 className="max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
              Choose Your Access
            </h2>
            <p className="mt-2 text-sm text-[#7a6f63]">
              Limited tiers remaining. Secure your journey into sound.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {festival.ticketTiers.map((tier) => (
              <TicketCard key={tier.name} tier={tier} />
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
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d9cc] bg-white text-[#8f8171]">
                <ArrowIcon />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d9cc] bg-white text-[#8f8171]">
                <ArrowIcon />
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {discoverMore.map((item) => (
              <Link
                key={item.slug}
                href={getFestivalDetailHref(item.slug)}
                className="group relative block overflow-hidden rounded-[1.5rem] bg-[#171511] text-white shadow-[0_16px_32px_rgba(24,18,12,0.16)]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.08), rgba(8,8,8,0.72)), ${optimizeCssBackground(
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
                  <p className="mt-2 text-sm text-white/78">
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
