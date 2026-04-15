"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import {
  festivalOverviewItems,
  getFestivalDetailHref,
  type FestivalIcon,
} from "./data";

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
      <svg className="h-7 w-7 text-[#849565]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
      <svg className="h-7 w-7 text-[#98a087]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
    <svg className="h-7 w-7 text-[#8fa57b]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
      className="flex w-full items-center justify-between gap-4 rounded-[1.2rem] bg-white px-4 py-4 text-left shadow-[0_8px_20px_rgba(66,85,34,0.06)] transition hover:bg-[#fcfcfa]"
      aria-pressed={active}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eff5e6] text-[#4a6b27]">
          {icon === "music" ? <MusicIcon /> : <TicketIcon />}
        </span>
        <span className="text-sm font-medium text-[#171511]">{label}</span>
      </div>

      <span
        className={`relative inline-flex h-7 w-12 rounded-full transition ${
          active ? "bg-[#4f7628]" : "bg-[#e6e0d8]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_6px_12px_rgba(0,0,0,0.12)] transition ${
            active ? "left-6" : "left-1"
          }`}
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
    <article className="rounded-[1.9rem] border border-[#e9e1d7] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(60,44,23,0.04)] sm:px-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex min-w-0 items-start gap-4 md:flex-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] bg-[#f1eeea]">
            <FestivalGlyph icon={festival.icon} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#85796f]">
              {festival.dateLabel} - {festival.locationLabel}
            </p>
            <h2 className="mt-2 max-w-none text-[clamp(1.8rem,3vw,2.25rem)] leading-[0.98] tracking-[-0.055em] text-[#171511]">
              {festival.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {festival.genres.map((genre) => (
                <span
                  key={`${festival.slug}-${genre}`}
                  className="rounded-full bg-[#f3f0eb] px-3 py-1 text-[11px] font-medium text-[#62584d]"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#efe8de] pt-4 md:min-w-[10rem] md:justify-end md:gap-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="text-left md:text-right">
            <div className="text-[2.3rem] font-semibold leading-none tracking-[-0.08em] text-[#456a24]">
              {festival.matchScore}%
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9b8f83]">
              vibe match
            </p>
          </div>

          <Link
            href={getFestivalDetailHref(festival.slug)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ddd4c8] text-[#171511] transition hover:bg-[#faf8f4]"
            aria-label={`Open ${festival.name}`}
          >
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FestivalsPage() {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] =
    useState<(typeof genreFilters)[number]>("Alle genres");
  const [alerts, setAlerts] = useState(defaultAlerts);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredFestivals = festivalOverviewItems.filter((festival) => {
    const matchesGenre =
      activeGenre === "Alle genres" || festival.genres.includes(activeGenre);

    const matchesQuery =
      deferredQuery.length === 0 ||
      [
        festival.name,
        festival.locationLabel,
        festival.vibe,
        ...festival.genres,
      ]
        .join(" ")
        .toLowerCase()
        .includes(deferredQuery);

    return matchesGenre && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-[#f8f5f0] text-[#171511]">
      <div className="mx-auto max-w-[1220px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="border-b border-[#ebe3d8] pb-10">
          <div className="max-w-[40rem]">
            <h1 className="max-w-none text-[clamp(3rem,8vw,5.4rem)] leading-[0.9] tracking-[-0.075em] text-[#171511]">
              Vind je match
            </h1>
            <p className="mt-5 max-w-[33rem] text-base leading-8 text-[#5d5348] sm:text-[1.05rem]">
              Een minimalistische gids naar festivals die resoneren met jouw
              energie. Gefilterd op kwaliteit, niet op volume.
            </p>
          </div>

          <div className="mt-8 rounded-full border border-[#e5ddd2] bg-white p-2 shadow-[0_10px_24px_rgba(60,44,23,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="festival-search"
                className="flex min-h-14 flex-1 items-center gap-3 rounded-full px-4 text-[#6c6256]"
              >
                <SearchIcon />
                <input
                  id="festival-search"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Zoek op genre, stad of vibe..."
                  className="h-full flex-1 bg-transparent text-sm text-[#171511] outline-none placeholder:text-[#a09386]"
                />
              </label>

              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4c7426] px-8 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(76,116,38,0.22)] transition hover:bg-[#43681f]"
              >
                Zoek
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {genreFilters.map((genre) => {
                const active = activeGenre === genre;

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setActiveGenre(genre)}
                    className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      active
                        ? "bg-[#ddefb1] text-[#3f5e1f]"
                        : "bg-white text-[#6f655a] hover:bg-[#f2eee8]"
                    }`}
                    aria-pressed={active}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <div className="inline-flex rounded-full border border-[#e1d9ce] bg-[#f4efe7] p-1">
              <span className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-[#171511] shadow-[0_8px_18px_rgba(60,44,23,0.08)]">
                Lijst
              </span>
              <span className="inline-flex min-h-10 items-center px-5 text-sm font-medium text-[#8c8175]">
                Kalender
              </span>
              <span className="inline-flex min-h-10 items-center px-5 text-sm font-medium text-[#8c8175]">
                Kaart
              </span>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="space-y-4">
            {filteredFestivals.map((festival) => (
              <FestivalCard key={festival.slug} festival={festival} />
            ))}
          </div>

          {filteredFestivals.length === 0 ? (
            <div className="mt-4 rounded-[1.9rem] border border-[#e9e1d7] bg-white px-6 py-10 text-center text-sm text-[#5d5348]">
              Geen festivals gevonden voor deze selectie.
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[2.4rem] bg-[linear-gradient(135deg,#edf7da,#f2f7e9_45%,#e7f1d3)] px-6 py-8 shadow-[0_20px_50px_rgba(74,89,41,0.08)] sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-[28rem]">
              <div className="inline-flex rounded-full bg-[#4f7628] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Smart alerts
              </div>
              <h2 className="mt-5 max-w-none text-[clamp(2.1rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.055em] text-[#171511]">
                Persoonlijke Meldingen
              </h2>
              <p className="mt-4 max-w-[26rem] text-sm leading-7 text-[#57674b] sm:text-[15px]">
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
              <div className="absolute right-[12%] top-[8%] rounded-full bg-[#4f7628] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(79,118,40,0.18)]">
                Live nu
              </div>
              <div className="grid h-[18rem] w-[18rem] place-items-center rounded-full border border-white/70 bg-white/75 text-[#4f7628] shadow-[0_18px_44px_rgba(79,118,40,0.12)] sm:h-[22rem] sm:w-[22rem]">
                <BellIcon />
              </div>
            </div>
          </div>
        </section>

        <section className="px-2 py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.96] tracking-[-0.055em] text-[#171511]">
            Your Weekly Pulse
          </h2>
          <p className="mx-auto mt-4 max-w-[32rem] text-sm leading-7 text-[#5d5348] sm:text-[15px]">
            De speciaal geselecteerd selecteert. Jij beleeft. Geen ruis, alleen de essentie
            elke donderdag in je inbox.
          </p>

          <div className="mx-auto mt-8 flex max-w-[32rem] flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="E-mailadres"
              className="min-h-14 flex-1 rounded-full border border-[#e7dfd4] bg-white px-5 text-sm outline-none transition placeholder:text-[#a09386] focus:border-[#cfc1af]"
            />
            <button
              type="button"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#171511] px-8 text-sm font-semibold text-white transition hover:bg-[#2b261f]"
            >
              Inschrijven
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
