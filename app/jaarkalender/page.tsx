import type { ReactNode } from "react";
import Link from "next/link";

import { AgendaImportBanner } from "./AgendaImportBanner";
import { JaarkalenderFilterControls } from "./JaarkalenderFilterControls";
import { getJaarkalenderDayByNumber, getJaarkalenderHref } from "./data";

export const metadata = {
  title: "Jaarkalender van Nederland | Uitjes NL",
  description:
    "Ontdek culturele hoogtepunten, festivals en seizoensfavorieten in de jaarkalender van Nederland.",
};

type MonthCalendarCell = {
  key: string;
  day: string;
  dayNumber?: number;
  monthLabel?: string;
  muted?: boolean;
  href?: string;
  eventCount?: number;
  eventLabels?: string[];
};

const monthCalendarCells: MonthCalendarCell[] = [
  {
    key: "prev-30",
    day: "30",
    monthLabel: "sep",
    muted: true,
  },
  ...Array.from({ length: 31 }, (_, index) => {
    const dayNumber = index + 1;
    const day = getJaarkalenderDayByNumber(dayNumber);

    return {
      key: `day-${dayNumber}`,
      day: String(dayNumber),
      dayNumber,
      href: getJaarkalenderHref(dayNumber),
      eventCount: day?.calendarSummary.displayCount,
      eventLabels: day?.calendarItems.slice(0, 2).map((item) => item.title),
    };
  }),
  {
    key: "next-1",
    day: "1",
    monthLabel: "nov",
    muted: true,
  },
  {
    key: "next-2",
    day: "2",
    monthLabel: "nov",
    muted: true,
  },
  {
    key: "next-3",
    day: "3",
    monthLabel: "nov",
    muted: true,
  },
];

const selectedCalendarDay = 10;

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3.25"
        y="4.75"
        width="13.5"
        height="12"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.25 2.75v4M13.75 2.75v4M3.5 8.25h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MonthNavButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white/10 backdrop-blur-xl text-white transition hover:-translate-y-0.5 hover:border-[#c7bea8]"
    >
      <span aria-hidden="true" className="text-lg">
        {label}
      </span>
    </button>
  );
}

function CountBlock({
  count,
  muted = false,
}: {
  count?: number;
  muted?: boolean;
}) {
  if (muted || !count) {
    return (
      <div className="mt-auto text-sm text-[#aaa093]">Geen telling</div>
    );
  }

  return (
    <div className="mt-auto">
      <div className="text-[clamp(2.4rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.08em] text-[#1b1712]">
        +{count}
      </div>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c8072]">
        activiteiten
      </p>
    </div>
  );
}

function MobileCalendarCell({ cell }: { cell: MonthCalendarCell }) {
  const eventLabels = cell.eventLabels ?? [];
  const visibleLabels = eventLabels.slice(0, 2);
  const hiddenCount = Math.max((cell.eventCount ?? 0) - visibleLabels.length, 0);
  const isSelected = cell.dayNumber === selectedCalendarDay;

  const content = (
    <>
      <div className="flex items-start justify-between gap-1">
        <div
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[12px] font-semibold leading-none ${
            isSelected
              ? "bg-[#171511] text-white"
              : cell.muted
                ? "text-[#a79d91]"
                : "text-[#221d17]"
          }`}
        >
          {cell.day}
        </div>
        {cell.monthLabel ? (
          <span className="pt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a79d91]">
            {cell.monthLabel}
          </span>
        ) : null}
      </div>

      {!cell.muted && visibleLabels.length > 0 ? (
        <div className="mt-1.5 space-y-1">
          {visibleLabels.map((label, index) => (
            <div
              key={`${cell.key}-${label}-${index}`}
              className={`truncate rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-3 ${
                index === 1 ? "hidden min-[390px]:block" : ""
              } ${isSelected ? "bg-[#d9efad] text-[#26331a]" : "bg-white/10 text-[#5f5246]"}`}
            >
              {label}
            </div>
          ))}
          {hiddenCount > 0 ? (
            <div className="text-[9px] font-semibold leading-none text-[#71804f]">
              +{hiddenCount}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const className = `min-h-[74px] border-b border-r border-[#e5ded2] p-1.5 ${
    cell.muted
      ? "bg-[#eee9e2]"
      : isSelected
        ? "bg-[#fbf7ed]"
        : "bg-white/8"
  }`;

  if (cell.href) {
    return (
      <Link href={cell.href} className={`${className} block`} aria-label={`${cell.day} oktober openen`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function CalendarCell({
  day,
  monthLabel,
  muted = false,
  className = "",
  href,
  children,
}: {
  day: string;
  monthLabel?: string;
  muted?: boolean;
  className?: string;
  href?: string;
  children?: ReactNode;
}) {
  const content = (
    <>
      <div
        className={`flex items-baseline gap-2 text-sm font-medium ${
          muted ? "text-[#9d9489]" : "text-white/88"
        }`}
      >
        <span className="text-lg font-semibold tracking-[-0.03em]">{day}</span>
        {monthLabel ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a19485]">
            {monthLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-1 flex-col">{children}</div>
      {href ? (
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7f72] transition group-hover:text-[#5c6d3e]">
          Open
          <ArrowIcon />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`group relative flex min-h-[168px] flex-col border-b border-r border-white/12 px-5 py-5 transition duration-200 hover:bg-[#fffdf9] ${
          muted ? "bg-[#eee9e2] text-[#a39a8d]" : "bg-white/8 text-white"
        } ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`relative flex min-h-[168px] flex-col border-b border-r border-white/12 px-5 py-5 ${
        muted ? "bg-[#eee9e2] text-[#a39a8d]" : "bg-white/8 text-white"
      } ${className}`}
    >
      {content}
    </div>
  );
}

function SeasonalCard({
  title,
  description,
  className,
  badge,
  dark = false,
}: {
  title: string;
  description: string;
  className: string;
  badge?: string;
  dark?: boolean;
}) {
  return (
    <article className={`relative overflow-hidden rounded-[2rem] p-6 ${className}`}>
      <div className="relative z-10">
        {badge ? (
          <div className="mb-4 inline-flex rounded-full bg-white/10 backdrop-blur-xl px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#504538]">
            {badge}
          </div>
        ) : null}
        <h3
          className={`max-w-[12ch] text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] ${
            dark ? "text-white" : "text-white"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-4 max-w-[28ch] text-sm leading-7 ${
            dark ? "text-[#433a31]" : "text-[#51463b]"
          }`}
        >
          {description}
        </p>
      </div>
    </article>
  );
}

export default function JaarkalenderPage() {
  return (
    <main className="uitjes-surface min-h-screen overflow-hidden bg-[#07131a] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(213,241,174,0.55),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(244,223,192,0.75),_transparent_42%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="uitjes-liquid-section rounded-[2.4rem]">
          <div className="grid gap-10 px-6 py-7 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-11 lg:py-12">
            <div className="max-w-[38rem]">
              <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                Nieuwe route
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.3rem,8vw,5.8rem)] leading-[0.9] tracking-[-0.07em] text-white">
                De Jaarkalender van Nederland
              </h1>
              <p className="mt-6 max-w-[32rem] text-base leading-8 text-white/76 sm:text-lg">
                Ontdek de rijkdom van de Nederlandse cultuur, van intieme
                stadsevenementen tot grootschalige festivals.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/ontdek"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e8f2d0] px-7 text-sm font-semibold text-[#1c1b15] shadow-[0_14px_36px_rgba(155,192,72,0.24)] transition hover:-translate-y-0.5 hover:bg-[#bde86d]"
                >
                  Plan mijn jaar
                  <ArrowIcon />
                </Link>
                <Link
                  href="/festivals"
                  className="uitjes-liquid-button inline-flex min-h-14 items-center justify-center rounded-full px-7 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  Bekijk festivals
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl">
                  Culturele weekenden
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl">
                  Landelijke hoogtepunten
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-xl">
                  Slim plannen per seizoen
                </div>
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/10 p-6 backdrop-blur-xl lg:min-h-[360px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,_rgba(202,240,126,0.45),_transparent_24%),radial-gradient(circle_at_84%_20%,_rgba(15,18,23,0.08),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.6),_rgba(255,255,255,0))]" />
              <div className="relative flex h-full items-end justify-between gap-6">
                <div className="max-w-[15rem] self-start rounded-[1.6rem] bg-white/10 backdrop-blur-xl p-5 shadow-[0_18px_40px_rgba(64,46,31,0.08)] backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/64">
                    Trending nu
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    ADE Amsterdam
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Elektronische muziek, talks en creatieve nachten in oktober.
                  </p>
                </div>

                <div className="relative ml-auto flex h-[220px] w-[190px] items-end justify-center rounded-[2rem] bg-[#111318] shadow-[0_30px_60px_rgba(15,17,24,0.28)] sm:h-[250px] sm:w-[220px]">
                  <div className="absolute inset-x-5 top-5 h-[120px] rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
                  <svg
                    className="absolute left-7 right-7 top-9 h-[88px] text-[#efe2cf]"
                    viewBox="0 0 180 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 68h136"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M35 66V36l18-7 18 7v30M89 66V26l16-6 15 6v40M58 66V20l12 6v40M125 66V31l13-5 13 5v35"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M41 41h5M59 41h5M95 36h5M128 41h4M141 41h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute -bottom-4 -left-6 w-[168px] rotate-[-4deg] rounded-[1.5rem] bg-white/10 backdrop-blur-xl px-5 py-4 text-white shadow-[0_20px_30px_rgba(39,27,16,0.14)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8f2d0]">
                      Trending
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">
                      ADE Amsterdam
                    </p>
                    <p className="text-sm text-white/68">2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 sm:mt-10">
          <div className="mb-4 sm:mb-6">
            <AgendaImportBanner />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#edf7d8] text-[#405028] sm:h-10 sm:w-10">
                  <CalendarIcon />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7b6a] sm:text-sm sm:tracking-[0.22em]">
                    Overzicht
                  </p>
                  <h2 className="mt-1 text-[clamp(2rem,3vw,2.8rem)] leading-[0.96] tracking-[-0.05em] text-white">
                    Oktober 2024
                  </h2>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
                <MonthNavButton label="<" />
                <MonthNavButton label=">" />
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#d9efad] px-4 text-sm font-semibold text-[#2a331d] transition hover:bg-[#cee797] sm:min-h-11 sm:px-5"
                >
                  Vandaag
                </button>
              </div>
            </div>

            <JaarkalenderFilterControls />
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/14 bg-white/8 shadow-[0_20px_60px_rgba(66,49,31,0.06)] sm:mt-8 sm:rounded-[2.2rem]">
            <div className="hidden md:block">
              <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-white/8">
                {["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"].map((day) => (
                  <div
                    key={day}
                    className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7e7366]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthCalendarCells.map((cell) => (
                  <CalendarCell
                    key={cell.key}
                    day={cell.day}
                    monthLabel={cell.monthLabel}
                    muted={cell.muted}
                    href={cell.href}
                    className={cell.muted ? undefined : "bg-white/8"}
                  >
                    <CountBlock count={cell.eventCount} muted={cell.muted} />
                  </CalendarCell>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-white/8">
                {["ma", "di", "wo", "do", "vr", "za", "zo"].map((day) => (
                  <div
                    key={day}
                    className="px-1 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7e7366]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthCalendarCells.map((cell) => (
                  <MobileCalendarCell key={cell.key} cell={cell} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Redactie
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] leading-[0.95] tracking-[-0.05em] text-white">
                Seizoensfavorieten
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
            <article className="uitjes-liquid-section rounded-[2.2rem] p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.45),_transparent_34%),radial-gradient(circle_at_70%_25%,_rgba(229,255,202,0.8),_transparent_32%)]" />
              <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
              <div className="relative z-10 max-w-[20rem]">
                <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/76 backdrop-blur-xl">
                  Collectie
                </div>
                <h3 className="mt-5 max-w-none text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.94] tracking-[-0.06em] text-white">
                  Herfstwandelingen door de Veluwe
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  Beleef de natuur op haar mooist met onze samengestelde routes,
                  stops voor koffie en plekken waar het licht perfect valt.
                </p>
                <Link
                  href="/inspiratie"
                  className="uitjes-cta mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  Bekijk gids
                </Link>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <SeasonalCard
                title="Jazz Nights Amsterdam"
                description="Elke donderdagavond in de Jordaan, met intieme clubs en late sets."
                badge="Populair"
                className="min-h-[16rem] bg-[#dfe0ef] sm:col-span-2"
                dark
              />
              <SeasonalCard
                title="De Beste Warme Choco Spots"
                description="Onze selectie voor koude middagen, museumdagen en rustige regenwandelingen."
                className="min-h-[13rem] bg-[#f6e5bb]"
              />
              <SeasonalCard
                title="Museum Nacht Overzicht"
                description="Plan slim per stad en kies meteen je favorieten voor de avond."
                className="min-h-[13rem] bg-[#c9f08f]"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
