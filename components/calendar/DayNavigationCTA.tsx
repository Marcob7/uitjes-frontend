import Link from "next/link";

import type { JaarkalenderDay } from "@/app/jaarkalender/data";

type DayNavigationCTAProps = {
  day: JaarkalenderDay;
  previousDay?: JaarkalenderDay;
  nextDay?: JaarkalenderDay;
  previousDayHref: string;
  nextDayHref: string;
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
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function dateLabel(day?: JaarkalenderDay) {
  return day
    ? `${day.weekdayDisplay} ${day.dayNumber} ${day.monthDisplay.toLowerCase()}`
    : "Naar de jaarkalender";
}

export default function DayNavigationCTA({
  day,
  previousDay,
  nextDay,
  previousDayHref,
  nextDayHref,
}: DayNavigationCTAProps) {
  const monthLabel = `${day.monthDisplay} ${day.year}`;

  return (
    <section className="relative isolate overflow-hidden border-y border-[#ddd9d1] bg-[#edf0e8] py-12 sm:py-16 lg:py-[4.6rem]" aria-labelledby="day-navigation-title">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-[#d7ddd1] sm:left-[max(1.75rem,calc((100%_-_1280px)/2))]" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-[#d7ddd1] sm:right-[max(1.75rem,calc((100%_-_1280px)/2))]" />
      <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-16 border-b border-[#d7ddd1]/75" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-[46rem] text-center">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.2em] text-[#617846]">
            Verder kijken
          </p>
          <h2 id="day-navigation-title" className="mt-4 text-[clamp(2.15rem,4.2vw,4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#1c251d]">
            Meer ontdekken rond deze dag.
          </h2>
          <p className="mx-auto mt-4 max-w-[35rem] text-[15px] leading-6 text-[#5c6659]">
            Bekijk een andere dag of ga terug naar het maandoverzicht.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-[67rem] gap-3 sm:grid-cols-2 lg:mt-11 lg:grid-cols-3 lg:gap-4">
          <Link href={previousDayHref} className="group flex min-h-[10.25rem] flex-col justify-between rounded-[1.25rem] border border-[#d5dacf] bg-[#f8f8f3]/80 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#b8c6aa] hover:bg-[#fbfbf7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d9145] sm:p-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e4930]">
              <ArrowLeftIcon />
              Vorige dag
            </span>
            <span className="mt-8 block text-[1.35rem] font-medium leading-[1.05] tracking-[-0.045em] text-[#252b24]">
              {dateLabel(previousDay)}
            </span>
          </Link>

          <Link href="/jaarkalender" className="group relative flex min-h-[10.25rem] flex-col justify-between overflow-hidden rounded-[1.25rem] border border-[#95aa79] bg-[#2b3c2e] p-5 text-[#f7f8f0] shadow-[0_14px_30px_rgba(43,60,46,0.11)] transition duration-300 hover:-translate-y-0.5 hover:border-[#bfd09e] hover:bg-[#354a37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d9145] sm:p-6">
            <span aria-hidden="true" className="absolute -right-7 -top-10 h-32 w-32 rounded-full border border-[#e4efcc]/15" />
            <span className="relative inline-flex items-center gap-2 text-sm font-semibold text-[#e0edc4]">
              <CalendarIcon />
              Maandoverzicht
            </span>
            <span className="relative mt-8 flex items-end justify-between gap-3">
              <span className="text-[1.35rem] font-medium leading-[1.05] tracking-[-0.045em]">
                {monthLabel}
              </span>
              <ArrowRightIcon />
            </span>
          </Link>

          <Link href={nextDayHref} className="group flex min-h-[10.25rem] flex-col justify-between rounded-[1.25rem] border border-[#d5dacf] bg-[#f8f8f3]/80 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#b8c6aa] hover:bg-[#fbfbf7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d9145] sm:col-span-2 sm:p-6 lg:col-span-1">
            <span className="inline-flex items-center justify-between gap-2 text-sm font-semibold text-[#2e4930]">
              Volgende dag
              <ArrowRightIcon />
            </span>
            <span className="mt-8 block text-[1.35rem] font-medium leading-[1.05] tracking-[-0.045em] text-[#252b24] lg:text-right">
              {dateLabel(nextDay)}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
