import Link from "next/link";
import type { ReactNode } from "react";

import type { JaarkalenderDay } from "@/app/jaarkalender/data";

type DayHeroProps = {
  day: JaarkalenderDay;
  previousDayHref: string;
  nextDayHref: string;
  todayDayHref: string;
  isToday: boolean;
};

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M12.667 8H3.333M7.333 12 3.333 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 14s4-3.6 4-7.333A4 4 0 1 0 4 6.667C4 10.4 8 14 8 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="6.667" r="1.4" fill="currentColor" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.667 4h10.666M4.667 8h6.666M6.667 12h2.666" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoftControl({
  icon,
  children,
  className = "",
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white/72 px-4 text-[13px] font-medium text-[#36342f] shadow-[0_5px_18px_rgba(46,42,36,0.045)] backdrop-blur-[2px] ${className}`}>
      {icon ? <span className="text-[#77756f]">{icon}</span> : null}
      {children}
    </span>
  );
}

function FilterControl({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <SoftControl icon={icon}>
      <span className="text-[#77756f]">{label}</span>
      <span className="font-semibold text-[#302e2a]">{value}</span>
      <ChevronDownIcon />
    </SoftControl>
  );
}

export default function DayHero({
  day,
  previousDayHref,
  nextDayHref,
  todayDayHref,
  isToday,
}: DayHeroProps) {
  const activityCount = day.calendarSummary.displayCount;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#fbfaf8] pb-10 pt-24 sm:pb-12 sm:pt-28 lg:pt-28"
      aria-labelledby="day-hero-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 48% 54% at 18% 68%, rgba(255, 221, 211, 0.8), transparent 72%), radial-gradient(ellipse 45% 56% at 53% 78%, rgba(255, 243, 190, 0.74), transparent 72%), radial-gradient(ellipse 52% 62% at 86% 79%, rgba(207, 235, 251, 0.76), transparent 74%), linear-gradient(180deg, #fbfaf8 0%, #fbfaf7 35%, #f7faf8 100%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/85" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-7 lg:px-8">
        <Link
          href="/jaarkalender"
          className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-[#65625d] transition hover:bg-white/65 hover:text-[#25231f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81a84e] sm:absolute sm:left-7 sm:top-0 lg:left-8"
        >
          <ArrowLeftIcon />
          Terug naar jaarkalender
        </Link>

        <div className="mx-auto mt-9 flex max-w-[58rem] flex-col items-center text-center sm:mt-0">
  
          <h1
            id="day-hero-title"
            style={{ fontFamily: "var(--font-body)" }}
            className="mt-2 max-w-none text-[clamp(3rem,6vw,5.7rem)] font-medium leading-[0.94] tracking-[-0.075em] text-[#171715]"
          >
            <span className="block">{day.weekdayDisplay} {day.dayNumber}</span>
            <span className="block">{day.monthDisplay}</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#65635e] sm:text-[15px]">
            {activityCount} activiteiten door heel Nederland
          </p>

          <div className="mt-7 flex max-w-full flex-wrap justify-center gap-2 sm:mt-8">
            <Link
              href={previousDayHref}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white/72 px-4 text-[13px] font-medium text-[#36342f] shadow-[0_5px_18px_rgba(46,42,36,0.045)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81a84e]"
              aria-label="Ga naar de vorige dag"
            >
              <ArrowLeftIcon />
              Vorige dag
            </Link>
            <Link
              href={todayDayHref}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81a84e] ${
                isToday
                  ? "bg-[#171715] text-[#fdfcf8] shadow-[0_8px_20px_rgba(23,23,21,0.14)]"
                  : "border border-black/[0.08] bg-white/72 text-[#36342f] shadow-[0_5px_18px_rgba(46,42,36,0.045)] hover:-translate-y-0.5 hover:bg-white"
              }`}
            >
              <CalendarIcon />
              Vandaag
            </Link>
            <Link
              href={nextDayHref}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white/72 px-4 text-[13px] font-medium text-[#36342f] shadow-[0_5px_18px_rgba(46,42,36,0.045)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81a84e]"
              aria-label="Ga naar de volgende dag"
            >
              Volgende dag
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="mt-3 flex max-w-full flex-wrap justify-center gap-2">
            <FilterControl icon={<MapPinIcon />} label="Stad" value="Alle steden" />
            <FilterControl icon={<FilterIcon />} label="Categorie" value="Alle categorieën" />
          </div>
        </div>
      </div>
    </section>
  );
}
