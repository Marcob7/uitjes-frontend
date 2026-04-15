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
  monthLabel?: string;
  muted?: boolean;
  href?: string;
  eventCount?: number;
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
      href: getJaarkalenderHref(dayNumber),
      eventCount: day?.calendarSummary.displayCount,
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

const mobileAgenda = [3, 5, 10, 15].flatMap((dayNumber) => {
  const day = getJaarkalenderDayByNumber(dayNumber);

  if (!day) {
    return [];
  }

  return [
    {
      day: `${dayNumber} oktober`,
      eventCount: day.calendarSummary.displayCount,
      href: getJaarkalenderHref(dayNumber),
    },
  ];
});

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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white text-[#1a1713] transition hover:-translate-y-0.5 hover:border-[#c7bea8]"
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
          muted ? "text-[#9d9489]" : "text-[#2b261f]"
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
        className={`group relative flex min-h-[168px] flex-col border-b border-r border-[#e7dfd3] px-5 py-5 transition duration-200 hover:bg-[#fffdf9] ${
          muted ? "bg-[#eee9e2] text-[#a39a8d]" : "bg-[#fbfaf7] text-[#15120f]"
        } ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`relative flex min-h-[168px] flex-col border-b border-r border-[#e7dfd3] px-5 py-5 ${
        muted ? "bg-[#eee9e2] text-[#a39a8d]" : "bg-[#fbfaf7] text-[#15120f]"
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
          <div className="mb-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#504538]">
            {badge}
          </div>
        ) : null}
        <h3
          className={`max-w-[12ch] text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] ${
            dark ? "text-[#15120f]" : "text-[#171511]"
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
    <main className="min-h-screen overflow-hidden bg-[#f6f1e8] text-[#171511]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(213,241,174,0.55),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(244,223,192,0.75),_transparent_42%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[2.4rem] border border-white/70 bg-[#f3e5d9] shadow-[0_24px_80px_rgba(73,52,31,0.08)]">
          <div className="grid gap-10 px-6 py-7 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-11 lg:py-12">
            <div className="max-w-[38rem]">
              <div className="inline-flex rounded-full border border-white/70 bg-white/45 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#705848]">
                Nieuwe route
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.3rem,8vw,5.8rem)] leading-[0.9] tracking-[-0.07em] text-[#171511]">
                De Jaarkalender van Nederland
              </h1>
              <p className="mt-6 max-w-[32rem] text-base leading-8 text-[#5f4c3f] sm:text-lg">
                Ontdek de rijkdom van de Nederlandse cultuur, van intieme
                stadsevenementen tot grootschalige festivals.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/ontdek"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#c9f07e] px-7 text-sm font-semibold text-[#1c1b15] shadow-[0_14px_36px_rgba(155,192,72,0.24)] transition hover:-translate-y-0.5 hover:bg-[#bde86d]"
                >
                  Plan mijn jaar
                  <ArrowIcon />
                </Link>
                <Link
                  href="/festivals"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#d8c7b7] px-7 text-sm font-semibold text-[#5f4c3f] transition hover:border-[#bea58c] hover:bg-white/45"
                >
                  Bekijk festivals
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div className="rounded-full bg-white/55 px-4 py-2 text-sm text-[#5b483b]">
                  Culturele weekenden
                </div>
                <div className="rounded-full bg-white/40 px-4 py-2 text-sm text-[#5b483b]">
                  Landelijke hoogtepunten
                </div>
                <div className="rounded-full bg-white/40 px-4 py-2 text-sm text-[#5b483b]">
                  Slim plannen per seizoen
                </div>
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-[2.2rem] bg-[#f7ecdf] p-6 lg:min-h-[360px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,_rgba(202,240,126,0.45),_transparent_24%),radial-gradient(circle_at_84%_20%,_rgba(15,18,23,0.08),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.6),_rgba(255,255,255,0))]" />
              <div className="relative flex h-full items-end justify-between gap-6">
                <div className="max-w-[15rem] self-start rounded-[1.6rem] bg-white/75 p-5 shadow-[0_18px_40px_rgba(64,46,31,0.08)] backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6f5a49]">
                    Trending nu
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#171511]">
                    ADE Amsterdam
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#655245]">
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

                  <div className="absolute -bottom-4 -left-6 w-[168px] rotate-[-4deg] rounded-[1.5rem] bg-white px-5 py-4 text-[#171511] shadow-[0_20px_30px_rgba(39,27,16,0.14)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6d7f49]">
                      Trending
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">
                      ADE Amsterdam
                    </p>
                    <p className="text-sm text-[#5d5147]">2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <AgendaImportBanner />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#1a1713]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf7d8] text-[#405028]">
                  <CalendarIcon />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8a7b6a]">
                    Overzicht
                  </p>
                  <h2 className="mt-1 text-[clamp(2rem,3vw,2.8rem)] leading-[0.96] tracking-[-0.05em] text-[#171511]">
                    Oktober 2024
                  </h2>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <MonthNavButton label="<" />
                <MonthNavButton label=">" />
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d9efad] px-5 text-sm font-semibold text-[#2a331d] transition hover:bg-[#cee797]"
                >
                  Vandaag
                </button>
              </div>
            </div>

            <JaarkalenderFilterControls />
          </div>

          <div className="mt-8 overflow-hidden rounded-[2.2rem] border border-[#e4ddd2] bg-[#f8f6f1] shadow-[0_20px_60px_rgba(66,49,31,0.06)]">
            <div className="hidden md:block">
              <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-[#fcfbf8]">
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
                    className={
                      cell.muted
                        ? undefined
                        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,245,239,0.98))]"
                    }
                  >
                    <CountBlock count={cell.eventCount} muted={cell.muted} />
                  </CalendarCell>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {mobileAgenda.map((item) => (
                <Link
                  key={item.day}
                  href={item.href}
                  className="block rounded-[1.6rem] border border-[#e5dccf] bg-[#fbfaf7] p-5 shadow-[0_12px_28px_rgba(55,39,24,0.05)]"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7f72]">
                        {item.day}
                      </p>
                      <p className="mt-3 text-[2.6rem] font-semibold leading-none tracking-[-0.08em] text-[#171511]">
                        +{item.eventCount}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7f72]">
                        activiteiten
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#66764b]">
                      Open
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
                Redactie
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] leading-[0.95] tracking-[-0.05em] text-[#171511]">
                Seizoensfavorieten
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
            <article className="relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#d7f1c9,#eff7d6_58%,#d7f0c4)] p-7 shadow-[0_20px_60px_rgba(73,52,31,0.06)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.45),_transparent_34%),radial-gradient(circle_at_70%_25%,_rgba(229,255,202,0.8),_transparent_32%)]" />
              <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
              <div className="relative z-10 max-w-[20rem]">
                <div className="inline-flex rounded-full bg-white/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#536144]">
                  Collectie
                </div>
                <h3 className="mt-5 max-w-none text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.94] tracking-[-0.06em] text-[#171511]">
                  Herfstwandelingen door de Veluwe
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#47553d]">
                  Beleef de natuur op haar mooist met onze samengestelde routes,
                  stops voor koffie en plekken waar het licht perfect valt.
                </p>
                <Link
                  href="/inspiratie"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#171511] px-5 text-sm font-semibold text-[#f7f2ea] transition hover:bg-[#2a241f]"
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
