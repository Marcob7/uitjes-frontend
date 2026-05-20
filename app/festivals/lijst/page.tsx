"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalHero from "@/components/FestivalHero";
import {
  festivalOverviewItems,
  getFestivalDetailHref,
  type FestivalIcon,
} from "../data";

export const runtime = "edge";

type AlertKey = "jazzAmsterdam" | "budgetFriendly";

type AlertPreference = {
  key: AlertKey;
  label: string;
  icon: "music" | "ticket";
};

const genreFilters = [
  "Alle genres",
  "Techno",
  "Jazz",
  "Culinair",
  "Kunst",
] as const;

const alertPreferences: AlertPreference[] = [
  {
    key: "jazzAmsterdam",
    label: "Jazz events in Amsterdam",
    icon: "music",
  },
  {
    key: "budgetFriendly",
    label: "Tickets onder de EUR 50",
    icon: "ticket",
  },
];

const defaultAlerts: Record<AlertKey, boolean> = {
  jazzAmsterdam: true,
  budgetFriendly: false,
};

type FestivalsPageProps = {
  searchParams?: {
    query?: string;
  };
};

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m14.583 14.584 3.334 3.333M16.25 9.167a7.083 7.083 0 1 1-14.167 0 7.083 7.083 0 0 1 14.167 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
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

function BellIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 10a8 8 0 0 1 8 8v5.143c0 2.21.79 4.347 2.228 6.023L37 32.5H11l2.772-3.334A9.42 9.42 0 0 0 16 23.143V18a8 8 0 0 1 8-8Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 36a3.5 3.5 0 0 0 7 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.333 2.667v7.2a2 2 0 1 1-1.333-1.887V4.267l5.333-1.6v5.866a2 2 0 1 1-1.333-1.886V2.667l-2.667.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.667 5.333a1.333 1.333 0 0 0 0 2.667V10a1.333 1.333 0 0 0 1.333 1.333h8A1.333 1.333 0 0 0 13.333 10V8a1.333 1.333 0 1 0 0-2.667V4A1.333 1.333 0 0 0 12 2.667H4A1.333 1.333 0 0 0 2.667 4v1.333Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 4.667v1.333M6.667 8v1.333"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FestivalGlyph({ icon }: { icon: FestivalIcon }) {
  if (icon === "fork") {
    return (
    <svg className="h-7 w-7 text-[#e8f2d0]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M12 6v10M9 6v6M15 6v6M12 16v10M22 6v20M22 6c2.6 0 4 1.7 4 4.4 0 2.5-1.2 4.1-4 5.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "crown") {
    return (
      <svg className="h-7 w-7 text-[#e8f2d0]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M7 23h18M9 23l2.5-10L16 17l4.5-4L23 23M11 10.5h.01M16 8.5h.01M21 10.5h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="h-7 w-7 text-[#e8f2d0]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M10 22V10M16 26V6M22 20V12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlertRow({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: AlertPreference["icon"];
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="uitjes-liquid-button flex w-full items-center justify-between gap-4 rounded-[1.2rem] px-4 py-4 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
      aria-pressed={active}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eff5e6] text-[#4a6b27]">
          {icon === "music" ? <MusicIcon /> : <TicketIcon />}
        </span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>

      <span
        className={`relative inline-flex h-7 w-12 rounded-full transition ${
          active ? "bg-[#e8f2d0]" : "bg-white/18"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.12)] transition ${
            active ? "left-6" : "left-1"
          } ${active ? "bg-[#171511]" : "bg-white"}`}
        />
      </span>
    </button>
  );
}

function FestivalCard({
  festival,
}: {
  festival: (typeof festivalOverviewItems)[number];
}) {
  return (
    <article className="rounded-[1.9rem] border border-[#21332b] bg-[linear-gradient(135deg,#0d1513_0%,#17271f_56%,#24351d_100%)] px-4 py-4 text-white shadow-[0_18px_44px_rgba(17,21,17,0.2)] sm:px-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex min-w-0 items-start gap-4 md:flex-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] border border-white/14 bg-white/10">
            <FestivalGlyph icon={festival.icon} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/82">
              {festival.dateLabel} - {festival.locationLabel}
            </p>
            <h2 className="mt-2 max-w-none text-[clamp(1.8rem,3vw,2.25rem)] leading-[0.98] tracking-[-0.055em] text-white">
              {festival.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {festival.genres.map((genre) => (
                <span
                  key={`${festival.slug}-${genre}`}
                  className="rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[11px] font-semibold text-white/92"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-4 md:min-w-[10rem] md:justify-end md:gap-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="text-left md:text-right">
            <div className="text-[2.3rem] font-semibold leading-none tracking-[-0.08em] text-[#e8f2d0]">
              {festival.matchScore}%
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
              vibe match
            </p>
          </div>

          <Link
            href={getFestivalDetailHref(festival.slug)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/24 text-white transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full"
            aria-label={`Open ${festival.name}`}
          >
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

function getFestivalSearchTerms(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  const terms = [normalizedQuery];

  if (normalizedQuery.includes("food")) terms.push("culinair");
  if (normalizedQuery.includes("muziek")) {
    terms.push("music", "jazz", "techno", "electronic", "multi-genre");
  }

  const withoutFestival = normalizedQuery
    .replace(/muziekfestival/g, "")
    .replace(/food festival/g, "food")
    .replace(/festivals?/g, "")
    .trim();

  if (withoutFestival) terms.push(withoutFestival);

  return Array.from(new Set(terms));
}

export default function FestivalsPage({ searchParams }: FestivalsPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState(searchParams?.query ?? "");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [activeGenre, setActiveGenre] =
    useState<(typeof genreFilters)[number]>("Alle genres");
  const [alerts, setAlerts] = useState(defaultAlerts);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredFestivals = useMemo(() => {
    const searchTerms = getFestivalSearchTerms(deferredQuery);
    const isGenericFestivalSearch =
      deferredQuery.includes("festival") && searchTerms.length === 1;

    return (
      festivalOverviewItems.filter((festival) => {
        const matchesGenre =
          activeGenre === "Alle genres" || festival.genres.includes(activeGenre);

        const searchableFestival = [
          festival.name,
          festival.locationLabel,
          festival.vibe,
          ...festival.genres,
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          deferredQuery.length === 0 ||
          isGenericFestivalSearch ||
          searchTerms.some((term) => searchableFestival.includes(term));

        return matchesGenre && matchesQuery;
      })
    );
  }, [activeGenre, deferredQuery]);

  function scrollToResults() {
    document.getElementById("festival-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function openNewsletterFlow() {
    const params = new URLSearchParams({
      message:
        "Ik wil graag de festival nieuwsbrief ontvangen met curated tips en updates.",
    });

    if (newsletterEmail.trim()) {
      params.set("email", newsletterEmail.trim());
    }

    router.push(`/feedback?${params.toString()}`);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Lijst" },
          ]}
          className="mb-6"
        />

        <FestivalHero
          eyebrow="Festivalzoeker"
          title="Vind je match"
          currentView="list"
          description={
            <>
              Een minimalistische gids naar festivals die resoneren met jouw
              energie. Gefilterd op kwaliteit, niet op volume.
            </>
          }
          search={
            <div className="rounded-[1.6rem] border border-white/18 bg-white/12 p-2 shadow-[0_24px_60px_rgba(3,10,14,0.18)] backdrop-blur-xl sm:rounded-full">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label
                  htmlFor="festival-search"
                className="flex min-h-12 flex-1 items-center gap-3 rounded-[1.1rem] px-4 text-white/86 sm:rounded-full"
                >
                  <SearchIcon />
                  <input
                    id="festival-search"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Zoek op genre, stad of vibe..."
                    className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/76 focus-visible:ring-2 focus-visible:ring-[#e8f2d0] sm:text-sm"
                  />
                </label>

                <button
                  type="button"
                  onClick={scrollToResults}
                  className="inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-[#e8f2d0]/65 bg-[#e8f2d0] px-6 text-sm font-semibold text-[#162016] shadow-[0_18px_36px_rgba(12,20,12,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full"
                >
                  Zoek
                </button>
              </div>
            </div>
          }
          filters={
            <>
              {genreFilters.map((genre) => {
                const active = activeGenre === genre;

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setActiveGenre(genre)}
                    className={`min-h-11 rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] sm:rounded-full ${
                      active
                        ? "bg-[#e8f2d0] text-[#3f5e1f]"
                        : "bg-white/14 text-white/88 backdrop-blur-xl hover:bg-white/20"
                    }`}
                    aria-pressed={active}
                  >
                    {genre}
                  </button>
                );
              })}
            </>
          }
        />
        <section id="festival-results" className="py-8 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Selectie
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
                Festivals voor jou
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {filteredFestivals.map((festival) => (
              <FestivalCard key={festival.slug} festival={festival} />
            ))}
          </div>

          {filteredFestivals.length === 0 ? (
            <div className="mt-4 rounded-[1.9rem] border border-[#e6dfd3] bg-white/72 px-6 py-10 text-center shadow-[0_18px_36px_rgba(45,37,28,0.06)] backdrop-blur-xl">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                {query.trim()
                  ? `Geen festivals gevonden voor "${query.trim()}"`
                  : "Geen festivals gevonden"}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5145]">
                Probeer een andere festivalzoekterm of open een bredere
                festivalweergave.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveGenre("Alle genres");
                    setQuery("");
                  }}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Bekijk alle festivals
                </button>
                <Link
                  href="/festivals/kalender"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Open festivalkalender
                </Link>
                <Link
                  href="/festivals/kaart"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[#d7cfbf] bg-white px-4 text-xs font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] sm:rounded-full"
                >
                  Bekijk festivalkaart
                </Link>
              </div>
            </div>
          ) : null}
        </section>

        <section className="uitjes-liquid-section mt-8 rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-[28rem]">
              <div className="inline-flex rounded-full bg-[#4f7628] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Smart alerts
              </div>
              <h2 className="mt-5 max-w-none text-[clamp(2.1rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.055em] text-white">
                Persoonlijke Meldingen
              </h2>
              <p className="mt-4 max-w-[26rem] text-sm leading-7 text-white/76 sm:text-[15px]">
                Focus op wat ertoe doet. Krijg alleen bericht over evenementen
                die exact bij jouw profiel aansluiten.
              </p>

              <div className="mt-6 space-y-3">
                {alertPreferences.map((preference) => (
                  <AlertRow
                    key={preference.key}
                    active={alerts[preference.key]}
                    icon={preference.icon}
                    label={preference.label}
                    onClick={() =>
                      setAlerts((current) => ({
                        ...current,
                        [preference.key]: !current[preference.key],
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute right-[10%] top-[8%] hidden rounded-full bg-[#4f7628] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(79,118,40,0.18)] sm:block">
                Live nu
              </div>
              <div className="grid h-[15rem] w-[15rem] place-items-center rounded-full border border-white/18 bg-white/10 text-[#e8f2d0] shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:h-[22rem] sm:w-[22rem]">
                <BellIcon />
              </div>
            </div>
          </div>
        </section>

        <section className="px-2 py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.96] tracking-[-0.055em] text-[#171511]">
            Your Weekly Pulse
          </h2>
          <p className="mx-auto mt-4 max-w-[32rem] text-sm leading-7 text-[#665d54] sm:text-[15px]">
            De curator selecteert. Jij beleeft. Geen ruis, alleen de essentie
            elke donderdag in je inbox.
          </p>

          <div className="mx-auto mt-8 flex max-w-[32rem] flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="E-mailadres"
              className="min-h-14 flex-1 rounded-2xl border border-[#ded8cc] bg-white/82 px-5 text-base text-[#171511] outline-none transition placeholder:text-[#75695f] focus:border-[#9cc84e] focus:ring-4 focus:ring-[#d9f1a6]/45 sm:rounded-full sm:text-sm"
            />
            <button
              type="button"
              onClick={openNewsletterFlow}
              className="uitjes-cta inline-flex min-h-14 items-center justify-center rounded-2xl px-8 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] sm:rounded-full"
            >
              Inschrijven
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
