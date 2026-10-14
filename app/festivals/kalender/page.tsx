"use client";

import type { FormEvent } from "react";
import { Suspense, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FestivalHero from "@/components/FestivalHero";
import FestivalPageScenery from "@/components/festivals/FestivalPageScenery";
import { NewsLetterSection } from "@/components/NewsLetterSection";
import { normalizeSearchQuery } from "@/lib/searchIntent";
import FestivalGenreFilters, {
  DEFAULT_FESTIVAL_GENRE,
  matchesFestivalGenre,
} from "../FestivalGenreFilters";
import {
  parseFestivalGenre,
  type FestivalGenreFilter,
} from "../festivalFilterConfig";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatDate } from "@/lib/i18n/format";
import {
  FESTIVAL_CALENDAR_EVENTS,
  FESTIVAL_CALENDAR_TONE_CLASSES,
  FESTIVAL_CALENDAR_WEEKDAY_LABELS,
  type FestivalCalendarEvent,
} from "./festivalCalendarData";
import {
  addMonths,
  buildFestivalCalendarCells,
  matchesFestivalCalendarSearch,
} from "./festivalCalendarUtils";

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

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
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

function CalendarPill({ event }: { event: FestivalCalendarEvent }) {
  const { t } = useLocale();
  const classes = `block truncate rounded-full px-3 py-1 text-[11px] font-semibold ${FESTIVAL_CALENDAR_TONE_CLASSES[event.tone]}`;

  if (event.href) {
    return (
      <Link
        href={event.href}
        aria-label={t("festival.openDetail", { title: event.label })}
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
  return parseFestivalGenre(searchParams.get("genre"));
}

function serializeFestivalSearchParams(params: URLSearchParams) {
  return Array.from(params.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

function FestivalsCalendarContent() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchErrorId = "festival-search-error";
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2024, 6, 1));
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("query") ?? ""
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeQuery = normalizeSearchQuery(
    new URLSearchParams(searchParamString).get("query")
  );
  const activeGenre = useMemo(
    () => getFestivalGenreFromSearchParams(new URLSearchParams(searchParamString)),
    [searchParamString]
  );
  const filteredCalendarEvents = useMemo(
    () =>
      FESTIVAL_CALENDAR_EVENTS.filter((event) =>
        matchesFestivalGenre(event.genres, activeGenre)
      ).filter((event) =>
        matchesFestivalCalendarSearch(event, activeQuery)
      ),
    [activeGenre, activeQuery]
  );
  const calendarCells = useMemo(
    () => buildFestivalCalendarCells(currentMonth, filteredCalendarEvents),
    [currentMonth, filteredCalendarEvents]
  );
  const mobileCalendarDays = calendarCells.filter(
    (cell) => !cell.muted && (cell.events?.length ?? 0) > 0
  );
  const monthTitle = formatDate(currentMonth, locale, { month: "long", year: "numeric" });
  const monthName = formatDate(currentMonth, locale, { month: "long" });

  useEffect(() => {
    setSearchValue(new URLSearchParams(searchParamString).get("query") ?? "");
    setSearchError(null);
  }, [searchParamString]);

  function pushFestivalSearchParams(params: URLSearchParams) {
    const queryString = serializeFestivalSearchParams(params);

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = normalizeSearchQuery(searchValue);

    if (!normalizedQuery) {
      setSearchError(t("search.emptyQuery"));
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("query", normalizedQuery);
    setSearchError(null);
    setSearchValue(normalizedQuery);
    pushFestivalSearchParams(params);
  }

  function clearSearchQuery() {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    setSearchError(null);
    setSearchValue("");
    pushFestivalSearchParams(params);
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  }

  function setActiveGenre(nextGenre: FestivalGenreFilter) {
    const params = new URLSearchParams(searchParams);

    if (nextGenre === DEFAULT_FESTIVAL_GENRE) {
      params.delete("genre");
    } else {
      params.set("genre", nextGenre);
    }

    pushFestivalSearchParams(params);
  }

  return (
    <main className="festival-calendar-page relative min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <FestivalPageScenery />
      <div className="relative z-10">
      <div className="mx-auto mt-0 w-full max-w-7xl px-4 py-8 sm:px-6 lg:mt-18 lg:px-8 lg:py-10">
        <FestivalHero
          title={t("festival.calendarTitle")}
          description={
            <>
        {t("festival.calendarIntro")}
            </>
          }
          search={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1 sm:w-[32rem]">
                <form
                  action="/festivals/kalender"
                  role="search"
                  onSubmit={handleSearchSubmit}
                  className="min-w-0"
                >
                  <label htmlFor="festival-search" className="sr-only">
                    {t("festival.searchLabel")}
                  </label>
                  <div className="flex min-h-11 items-center gap-2 rounded-full border border-white/34 bg-white/14 px-3 text-white shadow-[0_18px_46px_rgba(3,10,14,0.16)] backdrop-blur-xl">
                    <SearchIcon />
                    <input
                      ref={searchInputRef}
                      id="festival-search"
                      name="query"
                      type="search"
                      value={searchValue}
                      onChange={(event) => {
                        setSearchValue(event.target.value);
                        setSearchError(null);
                      }}
                      placeholder={t("festival.searchPlaceholder")}
                      aria-invalid={Boolean(searchError)}
                      aria-describedby={searchError ? searchErrorId : undefined}
                      enterKeyHint="search"
                      inputMode="search"
                      autoComplete="off"
                      spellCheck={false}
                      className="min-h-11 min-w-0 flex-1 bg-transparent text-base font-medium text-white outline-none placeholder:text-white/82 sm:text-sm"
                    />
                    {searchValue ? (
                      <button
                        type="button"
                        onClick={clearSearchQuery}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/88 transition hover:bg-white/14 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
                        aria-label={t("festival.clearSearch", { query: searchValue })}
                      >
                        <XIcon />
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f2d0] text-[#324d17] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0] disabled:cursor-not-allowed disabled:opacity-70"
                      aria-label={t("festival.searchLabel")}
                    >
                      <SearchIcon />
                    </button>
                  </div>
                </form>
                {searchError ? (
                  <p
                    id={searchErrorId}
                    role="status"
                    aria-live="polite"
                    className="mt-2 rounded-2xl bg-white/92 px-4 py-2 text-sm font-semibold leading-5 text-[#231f1a] shadow-sm"
                  >
                    {searchError}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0 sm:pt-0">
                <FestivalGenreFilters
                  activeGenre={activeGenre}
                  onChange={setActiveGenre}
                />
              </div>
            </div>
          }
          controls={
            <>
              <button
                type="button"
                onClick={() => setCurrentMonth((month) => addMonths(month, -1))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
                aria-label={t("festival.previousMonth")}
              >
                <ArrowLeftIcon />
              </button>
              <span className="text-lg font-medium text-white">{monthTitle}</span>
              <button
                type="button"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
                aria-label={t("festival.nextMonth")}
              >
                <ArrowRightIcon />
              </button>
            </>
          }
        />
        <section className="mt-8 overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/55 shadow-[0_20px_60px_rgba(66,49,31,0.08)] backdrop-blur-xl">
          <div className="hidden grid-cols-7 bg-[#fffaf3] sm:grid">
            {FESTIVAL_CALENDAR_WEEKDAY_LABELS.map((label) => (
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
                        {monthName}
                      </div>
                      <p className="mt-1 text-sm text-[#7e7366]">
                        {t("festival.eventMoments", { count: cell.events?.length ?? 0 })}
                      </p>
                    </div>
                    <span className="rounded-2xl bg-[#f7ede2] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7065]">
                      {t("festival.day", { day: cell.dayNumber })}
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
                {activeQuery
                  ? t("festival.emptyQuery", { query: activeQuery })
                  : t("festival.emptyMonth", { month: monthTitle })}
                {activeQuery ? (
                  <button
                    type="button"
                    onClick={clearSearchQuery}
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#d7cfbf] bg-white px-4 text-sm font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
                  >
                    {t("festival.clearSearchAction")}
                  </button>
                ) : null}
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
              {activeQuery
                ? t("festival.emptyQuery", { query: activeQuery })
                : t("festival.emptyMonth", { month: monthTitle })}
              {activeQuery ? (
                <button
                  type="button"
                  onClick={clearSearchQuery}
                  className="ml-0 mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#d7cfbf] bg-white px-4 text-sm font-semibold text-[#3f362f] transition hover:bg-[#f8f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] sm:ml-3 sm:mt-0"
                >
                  {t("festival.clearSearchAction")}
                </button>
              ) : null}
            </div>
          ) : null}
        </section>

        <NewsLetterSection
          source="festivals"
          interests={["festivals", "events"]}
          className="mt-8 ml-[calc(50%-50vw)] w-screen"
        />
      </div>
      </div>
    </main>
  );
}

export default function FestivalsCalendarPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f5f3] text-[#171511]" />
      }
    >
      <FestivalsCalendarContent />
    </Suspense>
  );
}
