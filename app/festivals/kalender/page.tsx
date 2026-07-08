"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalHero from "@/components/FestivalHero";
import WeeklyPulseSignupSection from "@/components/festivals/WeeklyPulseSignupSection";
import FestivalGenreFilters, {
  DEFAULT_FESTIVAL_GENRE,
  FESTIVAL_GENRES,
  matchesFestivalGenre,
  type FestivalGenreFilter,
} from "../FestivalGenreFilters";
import { getFestivalDetailHref } from "../data";

type CalendarTone = "lime" | "pink" | "blue" | "amber" | "violet";

type CalendarEvent = {
  label: string;
  tone: CalendarTone;
  date: string;
  genres: string[];
  href?: string;
};

type CalendarCell = {
  key: string;
  dayNumber: string;
  muted?: boolean;
  events?: CalendarEvent[];
};

const weekdayLabels = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

const FESTIVAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    label: "North Sea Jazz",
    tone: "lime",
    date: "2024-07-01",
    genres: ["Jazz"],
    href: getFestivalDetailHref("north-sea-jazz"),
  },
  { label: "Vondelpark Openlucht", tone: "pink", date: "2024-07-03", genres: [] },
  { label: "Down The Rabbit Hole", tone: "violet", date: "2024-07-05", genres: [] },
  { label: "Gentle Giant Expo", tone: "blue", date: "2024-07-05", genres: ["Kunst"] },
  { label: "Awakenings Summer", tone: "pink", date: "2024-07-06", genres: ["Techno"] },
  { label: "Bospop Week", tone: "pink", date: "2024-07-06", genres: [] },
  { label: "+4 more", tone: "lime", date: "2024-07-06", genres: [] },
  { label: "Awakenings Final", tone: "pink", date: "2024-07-07", genres: ["Techno"] },
  { label: "Gouden Carolus Food", tone: "amber", date: "2024-07-09", genres: ["Culinair"] },
  {
    label: "Dekmantel Festival",
    tone: "pink",
    date: "2024-07-12",
    genres: ["Techno"],
    href: getFestivalDetailHref("dekmantel-festival"),
  },
  { label: "Wildeburg Day 2", tone: "pink", date: "2024-07-13", genres: [] },
  { label: "Theater aan Zee", tone: "violet", date: "2024-07-13", genres: ["Kunst"] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-16", genres: [] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-17", genres: [] },
  { label: "Zwarte Cross", tone: "pink", date: "2024-07-18", genres: [] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-18", genres: [] },
  { label: "Zwarte Cross", tone: "pink", date: "2024-07-19", genres: [] },
  { label: "Welcome to the Village", tone: "pink", date: "2024-07-19", genres: [] },
  { label: "Zwarte Cross Final", tone: "pink", date: "2024-07-20", genres: [] },
  { label: "+2 more", tone: "lime", date: "2024-07-20", genres: [] },
];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameMonth(date: Date, monthDate: Date) {
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();
  const dates: Date[] = [];

  for (let index = startDay; index > 0; index -= 1) {
    dates.push(new Date(year, month, 1 - index));
  }

  for (let day = 1; day <= totalDays; day += 1) {
    dates.push(new Date(year, month, day));
  }

  while (dates.length % 7 !== 0) {
    const nextDay = dates.length - (startDay + totalDays) + 1;
    dates.push(new Date(year, month + 1, nextDay));
  }

  return dates;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarCells(currentMonth: Date, events: CalendarEvent[]) {
  const eventsByDate = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const dateEvents = eventsByDate.get(event.date) ?? [];
    dateEvents.push(event);
    eventsByDate.set(event.date, dateEvents);
  }

  return getMonthGrid(currentMonth).map<CalendarCell>((date) => {
    const dateKey = formatDateKey(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return {
      key: dateKey,
      dayNumber: String(date.getDate()),
      muted: !isCurrentMonth,
      events: isCurrentMonth ? eventsByDate.get(dateKey) : undefined,
    };
  });
}

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

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.667 8H3.333M7.333 12 3.333 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 4 12.667 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function toneClass(tone: CalendarTone) {
  if (tone === "lime") {
    return "bg-[#e8f2d0] text-[#344c18]";
  }

  if (tone === "pink") {
    return "bg-[#f7d8de] text-[#7a213a]";
  }

  if (tone === "blue") {
    return "bg-[#d9e6ff] text-[#294987]";
  }

  if (tone === "amber") {
    return "bg-[#ffe9b6] text-[#704800]";
  }

  return "bg-[#e6ddff] text-[#4b2e91]";
}

function CalendarPill({ event }: { event: CalendarEvent }) {
  const classes = `block truncate rounded-full px-3 py-1 text-[11px] font-semibold ${toneClass(
    event.tone
  )}`;

  if (event.href) {
    return (
      <Link
        href={event.href}
        aria-label={`Open festivaldetailpagina: ${event.label}`}
        className={`${classes} transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]`}
      >
        {event.label}
      </Link>
    );
  }

  return <span className={classes}>{event.label}</span>;
}

function getFestivalGenreFromSearchParams(
  searchParams: URLSearchParams
): FestivalGenreFilter {
  const genreParam = searchParams.get("genre")?.toLowerCase();
  const selectedGenre = FESTIVAL_GENRES.find(
    (genre) => genre.value === genreParam
  );

  return selectedGenre?.value ?? DEFAULT_FESTIVAL_GENRE;
}

export default function FestivalsCalendarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2024, 6, 1));
  const activeGenre = useMemo(
    () => getFestivalGenreFromSearchParams(new URLSearchParams(searchParams)),
    [searchParams]
  );
  const filteredCalendarEvents = useMemo(
    () =>
      FESTIVAL_CALENDAR_EVENTS.filter((event) =>
        matchesFestivalGenre(event.genres, activeGenre)
      ),
    [activeGenre]
  );
  const calendarCells = useMemo(
    () => buildCalendarCells(currentMonth, filteredCalendarEvents),
    [currentMonth, filteredCalendarEvents]
  );
  const mobileCalendarDays = calendarCells.filter(
    (cell) => !cell.muted && (cell.events?.length ?? 0) > 0
  );
  const monthTitle = `${
    MONTH_NAMES[currentMonth.getMonth()]
  } ${currentMonth.getFullYear()}`;
  const preservedSearchFields = Array.from(searchParams.entries()).filter(
    ([key]) => key !== "query"
  );

  function setActiveGenre(nextGenre: FestivalGenreFilter) {
    const params = new URLSearchParams(searchParams);

    if (nextGenre === DEFAULT_FESTIVAL_GENRE) {
      params.delete("genre");
    } else {
      params.set("genre", nextGenre);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Kalender" },
          ]}
          className="mb-6"
        />

        <FestivalHero
          eyebrow="Festivalagenda"
          title="Festival kalender Nederland"
          description={
            <>
          Ontdek de culturele vibe van heel Nederland. Van rauwe underground techno in Amsterdam tot relaxte jazz aan zee.
            </>
          }
          search={
            <form
              action="/festivals/kalender"
              className="rounded-[1.6rem] border border-white/18 bg-white/12 p-2 shadow-[0_24px_60px_rgba(3,10,14,0.18)] backdrop-blur-xl sm:rounded-full"
            >
              {preservedSearchFields.map(([key, value], index) => (
                <input
                  key={`${key}-${value}-${index}`}
                  type="hidden"
                  name={key}
                  value={value}
                />
              ))}
              <label
                htmlFor="calendar-search"
                className="flex min-h-12 items-center gap-3 rounded-[1.1rem] px-4 text-white/86 sm:rounded-full"
              >
                <SearchIcon />
                <input
                  id="calendar-search"
                  name="query"
                  type="text"
                  defaultValue={searchParams.get("query") ?? ""}
                  placeholder="Zoek naar festivals..."
                  enterKeyHint="search"
                  inputMode="search"
                  className="h-full flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/76 focus-visible:ring-2 focus-visible:ring-[#e8f2d0] sm:text-sm"
                />
              </label>
            </form>
          }
          controls={
            <>
              <button
                type="button"
                onClick={() => setCurrentMonth((month) => addMonths(month, -1))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
                aria-label="Vorige maand"
              >
                <ArrowLeftIcon />
              </button>
              <span className="text-lg font-medium text-white">{monthTitle}</span>
              <button
                type="button"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
                aria-label="Volgende maand"
              >
                <ArrowRightIcon />
              </button>
            </>
          }
          filters={
            <FestivalGenreFilters
              activeGenre={activeGenre}
              onChange={setActiveGenre}
            />
          }
        />
        <section className="mt-8 overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/55 shadow-[0_20px_60px_rgba(66,49,31,0.08)] backdrop-blur-xl">
          <div className="hidden grid-cols-7 bg-[#fffaf3] sm:grid">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="border-r border-[#e6dfd3] px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7e7366] last:border-r-0"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:hidden">
            {mobileCalendarDays.length > 0 ? (
              mobileCalendarDays.map((cell) => (
                <div
                  key={cell.key}
                  className="border-t border-[#e6dfd3] px-4 py-4 first:border-t-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium text-[#171511]">
                        {cell.dayNumber}{" "}
                        {MONTH_NAMES[currentMonth.getMonth()].toLowerCase()}
                      </div>
                      <p className="mt-1 text-sm text-[#7e7366]">
                        {cell.events?.length} festivalmomenten
                      </p>
                    </div>
                    <span className="rounded-2xl bg-[#f7ede2] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7065]">
                      Dag {cell.dayNumber}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {cell.events?.map((event) => (
                      <CalendarPill
                        key={`${cell.key}-${event.label}`}
                        event={event}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="border-t border-[#e6dfd3] px-4 py-6 text-sm text-[#66594e] first:border-t-0">
                Geen festivals gevonden voor {monthTitle.toLowerCase()}.
              </div>
            )}
          </div>

          <div className="hidden sm:grid sm:grid-cols-7">
            {calendarCells.map((cell) => (
              <div
                key={cell.key}
                className={`min-h-[7.8rem] border-r border-t border-[#e6dfd3] px-3 py-3 sm:min-h-[9rem] lg:min-h-[10rem] ${
                  cell.muted ? "bg-[#eee9e2] text-[#7c6f63]" : "bg-white/46 text-[#171511]"
                }`}
              >
                <div className={`text-lg font-medium ${cell.muted ? "text-[#74685e]" : "text-[#171511]"}`}>
                  {cell.dayNumber}
                </div>
                <div className="mt-3 space-y-2">
                  {cell.events?.map((event) => (
                    <CalendarPill key={`${cell.key}-${event.label}`} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {mobileCalendarDays.length === 0 ? (
            <div className="hidden border-t border-[#e6dfd3] bg-[#fffaf3] px-5 py-6 text-sm text-[#66594e] sm:block sm:px-8">
              Geen festivals gevonden voor {monthTitle.toLowerCase()}.
            </div>
          ) : null}
        </section>

        <WeeklyPulseSignupSection className="mt-8" />
      </div>
    </main>
  );
}
