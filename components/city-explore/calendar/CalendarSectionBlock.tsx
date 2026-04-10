"use client";

import { useMemo, useState } from "react";
import type {
  CalendarCategory,
  CalendarEvent,
  CalendarView,
} from "../types";
import { MONTH_NAMES } from "../data";
import CalendarDayView from "./CalendarDayView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarViewButton from "./CalendarViewButton";
import CalendarWeekView from "./CalendarWeekView";
import CalendarYearView from "./CalendarYearView";
import { getCityConfig } from "@/lib/cityConfig";

type CalendarSectionBlockProps = {
  cityLabel: string;
  accentColor: string;
  accentTextColor: string;
  calendarEvents: CalendarEvent[];
};

const CALENDAR_CATEGORIES: CalendarCategory[] = [
  "Alle categorieen",
  "Kunst",
  "Muziek",
  "Theater",
  "Culinair",
];

export default function CalendarSectionBlock({
  cityLabel,
  accentColor,
  accentTextColor,
  calendarEvents,
}: CalendarSectionBlockProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [view, setView] = useState<CalendarView>("maand");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedCategory, setSelectedCategory] =
    useState<CalendarCategory>("Alle categorieen");

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "Alle categorieen") return calendarEvents;
    return calendarEvents.filter((event) => event.category === selectedCategory);
  }, [calendarEvents, selectedCategory]);

  const title =
    view === "jaar"
      ? `${currentDate.getFullYear()}`
      : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  function goPrevious() {
    const next = new Date(currentDate);

    if (view === "dag") next.setDate(next.getDate() - 1);
    if (view === "week") next.setDate(next.getDate() - 7);
    if (view === "maand") next.setMonth(next.getMonth() - 1);
    if (view === "jaar") next.setFullYear(next.getFullYear() - 1);

    setCurrentDate(next);
  }

  function goNext() {
    const next = new Date(currentDate);

    if (view === "dag") next.setDate(next.getDate() + 1);
    if (view === "week") next.setDate(next.getDate() + 7);
    if (view === "maand") next.setMonth(next.getMonth() + 1);
    if (view === "jaar") next.setFullYear(next.getFullYear() + 1);

    setCurrentDate(next);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const cityTheme = getCityConfig(cityLabel);

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[620px]">
          <h2
            className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: cityTheme.colors.heading }}
          >
            {cityLabel} <span style={{ color: cityTheme.colors.text }}>Agenda</span>
          </h2>

          <p
            className="mt-5 max-w-[480px] text-base leading-7 sm:text-lg"
            style={{ color: cityTheme.colors.text }}
          >
            Ontdek de meest curator-waardige culturele momenten in {cityLabel}.
          </p>
        </div>

        <div
          className="inline-flex rounded-full p-1"
          style={{ backgroundColor: "#f1e5da" }}
        >
          <CalendarViewButton
            active={view === "dag"}
            label="dag"
            onClick={() => setView("dag")}
          />
          <CalendarViewButton
            active={view === "week"}
            label="week"
            onClick={() => setView("week")}
          />
          <CalendarViewButton
            active={view === "maand"}
            label="maand"
            onClick={() => setView("maand")}
          />
          <CalendarViewButton
            active={view === "jaar"}
            label="jaar"
            onClick={() => setView("jaar")}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full px-5 py-3 text-sm font-medium"
            style={{
              backgroundColor: accentColor,
              color: accentTextColor,
            }}
          >
            {cityLabel}
          </button>

          {CALENDAR_CATEGORIES.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full border px-5 py-3 text-sm font-medium transition"
                style={
                  active
                    ? {
                        backgroundColor: "#171717",
                        color: "#ffffff",
                        borderColor: "#171717",
                      }
                    : {
                        backgroundColor: "#ffffff",
                        color: "#171717",
                        borderColor: "#ddd5cc",
                      }
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="self-start rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-sm font-medium text-[#171717] transition hover:bg-[#F7F3EE]"
        >
          {isExpanded ? "Kalender inklappen" : "Kalender uitklappen"}
        </button>
      </div>

      {isExpanded ? (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
                {title}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevious}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD5CC] bg-white text-[18px] text-[#171717] transition hover:bg-[#F7F3EE]"
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD5CC] bg-white text-[18px] text-[#171717] transition hover:bg-[#F7F3EE]"
                >
                  {">"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={goToToday}
              className="text-sm font-medium text-[#5E5953] underline underline-offset-4"
            >
              Ga naar vandaag
            </button>
          </div>

          {view === "dag" && (
            <CalendarDayView currentDate={currentDate} events={filteredEvents} />
          )}

          {view === "week" && (
            <CalendarWeekView currentDate={currentDate} events={filteredEvents} />
          )}

          {view === "maand" && (
            <CalendarMonthView currentDate={currentDate} events={filteredEvents} />
          )}

          {view === "jaar" && (
            <CalendarYearView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectMonth={(monthIndex) => {
                const next = new Date(currentDate);
                next.setMonth(monthIndex);
                setCurrentDate(next);
                setView("maand");
              }}
            />
          )}
        </>
      ) : (
        <div className="rounded-[2rem] border border-[#ECE6DD] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#918B83]">
                Kalender ingeklapt
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[#171717]">
                {title}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="rounded-full px-5 py-3 text-sm font-medium"
              style={{
                backgroundColor: accentColor,
                color: accentTextColor,
              }}
            >
              Open kalender
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
