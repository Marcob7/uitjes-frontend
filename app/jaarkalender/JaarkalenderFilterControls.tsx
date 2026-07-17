"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { cityOptions as sharedCityOptions } from "@/lib/cityConfig";
import { isCityContentCity } from "@/lib/cityContentCities";

import {
  AgendaImportBanner,
  type AgendaImportEvent,
} from "./AgendaImportBanner";
import {
  jaarkalenderCategoryMeta,
  jaarkalenderDays,
  type JaarkalenderDay,
  type JaarkalenderCategoryKey,
} from "./data";

type FilterModalMode = "city" | "category";
type MobileCalendarView = "month" | "week";

type JaarkalenderCityOption = {
  label: string;
  hasCalendarItems: boolean;
  hasBackendContent: boolean;
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
  isToday?: boolean;
};

type MobileWeekDay = {
  date: Date;
  dateKey: string;
  dayLabel: string;
  dayNumber: number;
  isSelected: boolean;
  isToday: boolean;
  itemCount: number;
  routeLabel: string;
};

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

const MONTH_SHORT_NAMES = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

const JAARKALENDER_DATA_YEAR = 2024;
const JAARKALENDER_DATA_MONTH = 9;
const DEFAULT_CALENDAR_MONTH = new Date(
  JAARKALENDER_DATA_YEAR,
  JAARKALENDER_DATA_MONTH,
  1
);

const WEEKDAY_SHORT_LABELS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

function getCityFromLocation(location: string) {
  return location.split(",").at(-1)?.trim() ?? location;
}

function isSameMonth(date: Date, monthDate: Date) {
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function isSameDay(date: Date, dayDate: Date) {
  return (
    date.getFullYear() === dayDate.getFullYear() &&
    date.getMonth() === dayDate.getMonth() &&
    date.getDate() === dayDate.getDate()
  );
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function getWeekDates(date: Date) {
  const dayIndex = (date.getDay() + 6) % 7;
  const monday = addDays(date, -dayIndex);

  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function formatWeekPeriod(weekDates: Date[]) {
  const firstDate = weekDates[0];
  const lastDate = weekDates[weekDates.length - 1];
  const firstMonth = MONTH_SHORT_NAMES[firstDate.getMonth()];
  const lastMonth = MONTH_SHORT_NAMES[lastDate.getMonth()];

  if (firstDate.getFullYear() !== lastDate.getFullYear()) {
    return `${firstDate.getDate()} ${firstMonth} ${firstDate.getFullYear()} - ${lastDate.getDate()} ${lastMonth} ${lastDate.getFullYear()}`;
  }

  if (firstDate.getMonth() !== lastDate.getMonth()) {
    return `${firstDate.getDate()} ${firstMonth} - ${lastDate.getDate()} ${lastMonth} ${lastDate.getFullYear()}`;
  }

  return `${firstDate.getDate()} - ${lastDate.getDate()} ${lastMonth} ${lastDate.getFullYear()}`;
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

function getMonthInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthFromUrl(value: string | null) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return DEFAULT_CALENDAR_MONTH;
  }

  const [year, month] = value.split("-").map(Number);
  return year && month >= 1 && month <= 12
    ? new Date(year, month - 1, 1)
    : DEFAULT_CALENDAR_MONTH;
}

function hasJaarkalenderDataForMonth(date: Date) {
  return (
    date.getFullYear() === JAARKALENDER_DATA_YEAR &&
    date.getMonth() === JAARKALENDER_DATA_MONTH
  );
}

function getJaarkalenderDayForDate(
  date: Date,
  daysByNumber: Map<number, JaarkalenderDay>
) {
  if (!hasJaarkalenderDataForMonth(date)) {
    return null;
  }

  return daysByNumber.get(date.getDate()) ?? null;
}

function filterCalendarItems(
  day: JaarkalenderDay,
  selectedCity: string | null,
  selectedCategory: JaarkalenderCategoryKey | null
) {
  return day.calendarItems.filter((item) => {
    const cityMatches =
      !selectedCity || getCityFromLocation(item.locatie) === selectedCity;
    const categoryMatches =
      !selectedCategory || item.categorie === selectedCategory;

    return cityMatches && categoryMatches;
  });
}

function getCalendarItemTime(item: JaarkalenderDay["calendarItems"][number]) {
  return item.datum.split(/(?:Â·|·)/).at(-1)?.trim() || "Tijd volgt";
}

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

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.75" cy="8.75" r="4.75" stroke="currentColor" strokeWidth="1.7" />
      <path d="m12.25 12.25 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getMonthlySelectionItems() {
  const selection = [
    { dayNumber: 10, itemIndex: 0, reason: "Rustige start" },
    { dayNumber: 17, itemIndex: 2, reason: "Middagplan" },
    { dayNumber: 24, itemIndex: 4, reason: "Avond vooruit" },
  ];

  return selection.flatMap(({ dayNumber, itemIndex, reason }) => {
    const day = jaarkalenderDays.find((calendarDay) => calendarDay.dayNumber === dayNumber);
    const item = day?.calendarItems[itemIndex];

    return day && item ? [{ day, item, reason }] : [];
  });
}


function PinIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.667 4h10.666M4.667 8h6.666M6.667 12h2.666"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MonthNavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white/88 text-[#4d433a] shadow-[0_8px_18px_rgba(60,44,23,0.05)] transition hover:-translate-y-0.5 hover:border-[#c7bea8] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
    >
      <span aria-hidden="true" className="text-lg">
        {label === "Vorige maand" ? "<" : ">"}
      </span>
    </button>
  );
}

function ControlButton({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dfd7c9] bg-white/80 px-5 text-sm font-medium text-[#2c2925] transition hover:border-[#c9bea9] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
    >
      {icon}
      {children}
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
    return <div className="mt-auto text-sm text-[#aaa093]">Geen items</div>;
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
  const isToday = cell.isToday;

  const content = (
    <>
      <div className="flex items-start justify-between gap-1">
        <div
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[12px] font-semibold leading-none ${
            isToday
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
              } ${isToday ? "bg-[#d9efad] text-[#26331a]" : "bg-[#f3eee6] text-[#4f453c]"}`}
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
      : isToday
        ? "bg-[#fbf7ed]"
        : "bg-white/84"
  }`;

  if (cell.href) {
    return (
      <Link
        href={cell.href}
        className={`${className} block`}
        aria-label={`${cell.day} openen`}
      >
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
  isToday = false,
  className = "",
  href,
  children,
}: {
  day: string;
  monthLabel?: string;
  muted?: boolean;
  isToday?: boolean;
  className?: string;
  href?: string;
  children?: ReactNode;
}) {
  const content = (
    <>
      <div
        className={`flex items-baseline gap-2 text-sm font-medium ${
          muted ? "text-[#7c7166]" : "text-[#2f2923]"
        }`}
      >
        <span
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-lg font-semibold tracking-[-0.03em] ${
            isToday ? "bg-[#171511] text-white" : ""
          }`}
        >
          {day}
        </span>
        {monthLabel ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a19485]">
            {monthLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-1 flex-col">{children}</div>
      {href ? (
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66594e] transition group-hover:text-[#4f7628]">
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
        className={`group relative flex min-h-[168px] flex-col border-b border-r border-[#e6dfd3] px-5 py-5 transition duration-200 hover:bg-[#fffdf9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
          muted ? "bg-[#eee9e2] text-[#7c7166]" : "bg-white/84 text-[#171511]"
        } ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`relative flex min-h-[168px] flex-col border-b border-r border-[#e6dfd3] px-5 py-5 ${
        muted ? "bg-[#eee9e2] text-[#7c7166]" : "bg-white/84 text-[#171511]"
      } ${className}`}
    >
      {content}
    </div>
  );
}

function EmptyState({
  selectedCity,
  selectedCategory,
  monthTitle,
}: {
  selectedCity: string | null;
  selectedCategory: JaarkalenderCategoryKey | null;
  monthTitle: string;
}) {
  const categoryLabel = selectedCategory
    ? jaarkalenderCategoryMeta[selectedCategory].label
    : null;
  const filterText = [selectedCity, categoryLabel].filter(Boolean).join(" en ");

  return (
    <div className="border-t border-[#e6dfd3] bg-[#fffaf3] px-5 py-6 text-sm text-[#66594e] sm:px-8">
      Geen activiteiten gevonden voor {monthTitle.toLowerCase()}
      {filterText ? ` met ${filterText}` : ""}. Kies een
      andere stad of categorie om de dummy kalender opnieuw te vullen.
    </div>
  );
}

function MobileWeekView({
  weekPeriod,
  weekDays,
  selectedDay,
  selectedItems,
  selectedCity,
  selectedCategory,
  onPreviousWeek,
  onNextWeek,
  onSelectDate,
}: {
  weekPeriod: string;
  weekDays: MobileWeekDay[];
  selectedDay: JaarkalenderDay | null;
  selectedItems: JaarkalenderDay["calendarItems"];
  selectedCity: string | null;
  selectedCategory: JaarkalenderCategoryKey | null;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: Date) => void;
}) {
  const categoryLabel = selectedCategory
    ? jaarkalenderCategoryMeta[selectedCategory].label
    : null;
  const filterText = [selectedCity, categoryLabel].filter(Boolean).join(" en ");
  const selectedDayLabel = selectedDay
    ? `${selectedDay.weekdayDisplay} ${selectedDay.dayNumber} ${selectedDay.monthDisplay}`
    : "Deze dag";

  return (
    <div className="bg-[#fffdf9]">
      <div className="flex items-center justify-between gap-3 border-b border-[#e6dfd3] px-3 py-3">
        <button
          type="button"
          aria-label="Vorige week"
          onClick={onPreviousWeek}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ded8cc] bg-white text-base font-semibold text-[#4d433a] transition hover:bg-[#f7f1e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
        >
          <span aria-hidden="true">{"<"}</span>
        </button>

        <div className="min-w-0 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b7a69]">
            Week
          </p>
          <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-[#171511]">
            {weekPeriod}
          </h3>
        </div>

        <button
          type="button"
          aria-label="Volgende week"
          onClick={onNextWeek}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ded8cc] bg-white text-base font-semibold text-[#4d433a] transition hover:bg-[#f7f1e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
        >
          <span aria-hidden="true">{">"}</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 border-b border-[#e6dfd3] bg-[#fffaf3] px-2 py-2">
        {weekDays.map((day) => {
          return (
            <button
              key={day.dateKey}
              type="button"
              aria-label={`${day.routeLabel} selecteren`}
              aria-pressed={day.isSelected}
              aria-current={day.isToday ? "date" : undefined}
              onClick={() => onSelectDate(day.date)}
              className={`min-h-14 rounded-xl px-1 py-1.5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                day.isSelected
                  ? "bg-[#171511] text-white shadow-[0_8px_18px_rgba(35,28,20,0.16)]"
                  : day.isToday
                    ? "bg-[#edf7d8] text-[#26331a]"
                    : "bg-white/70 text-[#3b332b]"
              }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] opacity-75">
                {day.dayLabel}
              </span>
              <span className="mt-0.5 block text-base font-semibold leading-none">
                {day.dayNumber}
              </span>
              <span
                className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${
                  day.itemCount > 0
                    ? day.isSelected
                      ? "bg-[#d9efad]"
                      : "bg-[#77994a]"
                    : "bg-transparent"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="px-3 py-3">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h4 className="min-w-0 truncate text-sm font-semibold text-[#241f19]">
            {selectedDayLabel}
          </h4>
          <span className="shrink-0 text-xs font-medium text-[#827568]">
            {selectedItems.length} items
          </span>
        </div>

        {selectedItems.length === 0 ? (
          <div className="rounded-2xl border border-[#eee4d8] bg-[#f8f2ea] px-4 py-4 text-sm leading-6 text-[#66594e]">
            Geen activiteiten op deze dag
            {filterText ? ` met ${filterText}` : ""}.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item, index) => {
              const meta = jaarkalenderCategoryMeta[item.categorie];

              return (
                <Link
                  key={`${item.title}-${item.locatie}-${index}`}
                  href={`/jaarkalender/${selectedDay?.slug}`}
                  aria-label={`Bekijk dag ${selectedDayLabel} voor ${item.title}`}
                  className="rounded-2xl border border-[#eee4d8] bg-white px-3.5 py-3 shadow-[0_8px_22px_rgba(66,49,31,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="min-w-0 text-sm font-semibold leading-5 text-[#1f1a15]">
                      {item.title}
                    </h5>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-[#75695d]">
                    <span>{getCalendarItemTime(item)}</span>
                    <span>{getCityFromLocation(item.locatie)}</span>
                    <span>{item.prijs}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function JaarkalenderInteractiveCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FilterModalMode>("city");
  const [today, setToday] = useState(() => new Date());
  const [mobileView, setMobileView] = useState<MobileCalendarView>("month");
  const [currentMonth, setCurrentMonth] = useState(() =>
    getMonthFromUrl(
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("date")
    )
  );
  const [selectedWeekDate, setSelectedWeekDate] = useState(
    () => new Date(JAARKALENDER_DATA_YEAR, JAARKALENDER_DATA_MONTH, 1)
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("city")
  );
  const [selectedCategory, setSelectedCategory] =
    useState<JaarkalenderCategoryKey | null>(() => {
      if (typeof window === "undefined") return null;

      const category = new URLSearchParams(window.location.search).get("category");
      return category && category in jaarkalenderCategoryMeta
        ? (category as JaarkalenderCategoryKey)
        : null;
    });
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const syncFilterParams = (
    city: string | null,
    category: JaarkalenderCategoryKey | null,
    month: Date
  ) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isDefaultMonth = getMonthInputValue(month) === getMonthInputValue(DEFAULT_CALENDAR_MONTH);

    if (city) url.searchParams.set("city", city);
    else url.searchParams.delete("city");

    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");

    if (isDefaultMonth) url.searchParams.delete("date");
    else url.searchParams.set("date", getMonthInputValue(month));

    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const setMonthFilter = (month: Date) => {
    setCurrentMonth(month);
    syncFilterParams(selectedCity, selectedCategory, month);
  };

  const setCityFilter = (city: string | null) => {
    setSelectedCity(city);
    syncFilterParams(city, selectedCategory, currentMonth);
  };

  const setCategoryFilter = (category: JaarkalenderCategoryKey | null) => {
    setSelectedCategory(category);
    syncFilterParams(selectedCity, category, currentMonth);
  };

  const clearFilters = () => {
    setSelectedCity(null);
    setSelectedCategory(null);
    setCurrentMonth(DEFAULT_CALENDAR_MONTH);
    syncFilterParams(null, null, DEFAULT_CALENDAR_MONTH);
  };

  const hasActiveFilters =
    selectedCity !== null ||
    selectedCategory !== null ||
    getMonthInputValue(currentMonth) !== getMonthInputValue(DEFAULT_CALENDAR_MONTH);

  useEffect(() => {
    const syncStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");

      setSelectedCity(params.get("city"));
      setSelectedCategory(
        category && category in jaarkalenderCategoryMeta
          ? (category as JaarkalenderCategoryKey)
          : null
      );
      setCurrentMonth(getMonthFromUrl(params.get("date")));
    };

    window.addEventListener("popstate", syncStateFromUrl);
    return () => window.removeEventListener("popstate", syncStateFromUrl);
  }, []);

  const cityOptions = useMemo(() => {
    const cities = jaarkalenderDays.flatMap((day) =>
      day.calendarItems.map((item) => getCityFromLocation(item.locatie))
    );

    const calendarCities = new Set(cities);

    return sharedCityOptions.map<JaarkalenderCityOption>((city) => ({
      label: city.label,
      hasCalendarItems: calendarCities.has(city.label),
      hasBackendContent: isCityContentCity(city.value),
    }));
  }, []);

  const categoryOptions = Object.keys(
    jaarkalenderCategoryMeta
  ) as JaarkalenderCategoryKey[];

  const daysByNumber = useMemo(
    () => new Map(jaarkalenderDays.map((day) => [day.dayNumber, day])),
    []
  );

  const monthCalendarCells = useMemo<MonthCalendarCell[]>(
    () =>
      getMonthGrid(currentMonth).map((date) => {
        const isCurrentMonth = isSameMonth(date, currentMonth);
        const isToday = isCurrentMonth && isSameDay(date, today);
        const day = getJaarkalenderDayForDate(date, daysByNumber);

        if (!isCurrentMonth || !day) {
          return {
            key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            day: String(date.getDate()),
            dayNumber: isCurrentMonth ? date.getDate() : undefined,
            monthLabel: isCurrentMonth
              ? undefined
              : MONTH_SHORT_NAMES[date.getMonth()],
            muted: !isCurrentMonth,
            isToday,
          };
        }

        const filteredItems = filterCalendarItems(
          day,
          selectedCity,
          selectedCategory
        );

        return {
          key: `day-${day.dayNumber}`,
          day: String(day.dayNumber),
          dayNumber: day.dayNumber,
          href: `/jaarkalender/${day.slug}`,
          eventCount: filteredItems.length,
          eventLabels: filteredItems.slice(0, 2).map((item) => item.title),
          isToday,
        };
      }),
    [currentMonth, daysByNumber, selectedCategory, selectedCity, today]
  );

  const visibleImportEvents = useMemo<AgendaImportEvent[]>(() => {
    if (!hasJaarkalenderDataForMonth(currentMonth)) {
      return [];
    }

    return jaarkalenderDays.flatMap((day) => {
      const filteredItems = filterCalendarItems(
        day,
        selectedCity,
        selectedCategory
      );

      return filteredItems.map((item) => ({
        dayIsoDate: day.isoDate,
        daySlug: day.slug,
        item,
      }));
    });
  }, [currentMonth, selectedCategory, selectedCity]);

  const totalVisibleItems = useMemo(
    () =>
      monthCalendarCells.reduce(
        (total, cell) => total + (cell.eventCount ?? 0),
        0
      ),
    [monthCalendarCells]
  );
  const monthTitle = `${
    MONTH_NAMES[currentMonth.getMonth()]
  } ${currentMonth.getFullYear()}`;

  const weekDates = useMemo(() => getWeekDates(selectedWeekDate), [
    selectedWeekDate,
  ]);
  const weekPeriod = useMemo(() => formatWeekPeriod(weekDates), [weekDates]);
  const mobileWeekDays = useMemo<MobileWeekDay[]>(
    () =>
      weekDates.map((date, index) => {
        const day = getJaarkalenderDayForDate(date, daysByNumber);
        const itemCount = day
          ? filterCalendarItems(day, selectedCity, selectedCategory).length
          : 0;
        const routeLabel = day
          ? `${day.weekday} ${day.dayNumber} ${day.monthDisplay.toLowerCase()} ${day.year}`
          : `${WEEKDAY_SHORT_LABELS[index]} ${date.getDate()} ${
              MONTH_NAMES[date.getMonth()]
            } ${date.getFullYear()}`;

        return {
          date,
          dateKey: getDateKey(date),
          dayLabel: WEEKDAY_SHORT_LABELS[index],
          dayNumber: date.getDate(),
          isSelected: isSameDay(date, selectedWeekDate),
          isToday: isSameDay(date, today),
          itemCount,
          routeLabel,
        };
      }),
    [daysByNumber, selectedCategory, selectedCity, selectedWeekDate, today, weekDates]
  );
  const selectedWeekDay = useMemo(
    () => getJaarkalenderDayForDate(selectedWeekDate, daysByNumber),
    [daysByNumber, selectedWeekDate]
  );
  const selectedWeekItems = useMemo(
    () =>
      selectedWeekDay
        ? filterCalendarItems(selectedWeekDay, selectedCity, selectedCategory)
        : [],
    [selectedCategory, selectedCity, selectedWeekDay]
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const goToToday = () => {
    const nextToday = new Date();
    setToday(nextToday);
    setMonthFilter(new Date(nextToday.getFullYear(), nextToday.getMonth(), 1));
  };

  useEffect(() => {
    setSelectedWeekDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    );
  }, [currentMonth]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const getFocusableElements = () => {
      const modal = modalRef.current;
      if (!modal) return [];

      return Array.from(
        modal.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => {
      const firstFocusableElement = getFocusableElements()[0];
      firstFocusableElement?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const openModal = (
    mode: FilterModalMode,
    triggerElement: HTMLElement
  ) => {
    triggerRef.current = triggerElement;
    setModalMode(mode);
    setIsOpen(true);
  };

  const modalTitle =
    modalMode === "city" ? "Kies een locatie" : "Kies een categorie";

  return (
    <>
      <form
        className="grid gap-1 rounded-2xl border border-[#e0e9e5] bg-white p-2 shadow-[0_16px_42px_rgba(20,54,40,0.08)] sm:grid-cols-2 sm:gap-0 sm:p-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          document
            .getElementById("jaarkalender-overzicht")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        <button
          type="button"
          onClick={(event) => openModal("city", event.currentTarget)}
          className="group flex min-h-16 min-w-0 items-center gap-3 rounded-xl px-3 text-left transition hover:bg-[#f5faf7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#008247] sm:border-r sm:border-[#e6eeea] sm:px-4"
        >
          <span className="text-[#008247]"><PinIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#587068]">Locatie</span>
            <span className="mt-0.5 block truncate text-sm font-medium text-[#26352f]">{selectedCity ?? "Heel Nederland"}</span>
          </span>
          <span className="text-[#789087] group-hover:text-[#00733d]"><ChevronDownIcon /></span>
        </button>

        <button
          type="button"
          onClick={(event) => openModal("category", event.currentTarget)}
          className="group flex min-h-16 min-w-0 items-center gap-3 rounded-xl px-3 text-left transition hover:bg-[#f5faf7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#008247] sm:px-4 lg:border-r lg:border-[#e6eeea]"
        >
          <span className="text-[#008247]"><FilterIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#587068]">Categorie</span>
            <span className="mt-0.5 block truncate text-sm font-medium text-[#26352f]">
              {selectedCategory ? jaarkalenderCategoryMeta[selectedCategory].label : "Alle evenementen"}
            </span>
          </span>
          <span className="text-[#789087] group-hover:text-[#00733d]"><ChevronDownIcon /></span>
        </button>

        <label
          className="group flex min-h-16 min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 transition hover:bg-[#f5faf7] focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-[#008247] sm:border-r sm:border-[#e6eeea] sm:px-4 lg:border-r-0"
          onClick={() => {
            const input = dateInputRef.current;
            input?.focus();
            input?.showPicker?.();
          }}
        >
          <span className="text-[#008247]"><CalendarIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#587068]">Datum</span>
            <input
              ref={dateInputRef}
              type="month"
              aria-label="Kies een maand"
              value={getMonthInputValue(currentMonth)}
              onChange={(event) => {
                const [year, month] = event.target.value.split("-").map(Number);
                if (year && month) setMonthFilter(new Date(year, month - 1, 1));
              }}
              className="mt-0.5 block w-full min-w-0 bg-transparent text-sm font-medium text-[#26352f] outline-none"
            />
          </span>
        </label>

        <button
          type="submit"
          aria-label="Zoeken in de jaarkalender"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#00733d] text-white transition hover:bg-[#005f33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008247] sm:mt-2 sm:w-12 lg:mt-0"
        >
          <SearchIcon />
        </button>
      </form>

      {hasActiveFilters ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#cbd8d4] bg-white px-4 text-sm font-semibold text-[#00733d] transition hover:border-[#8ebba4] hover:bg-[#f6fbf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008247] active:bg-[#eaf5ee]"
          >
            Wis filters
          </button>
        </div>
      ) : null}

      <div className="mb-4 mt-6 sm:mb-6 sm:mt-8">
        <AgendaImportBanner events={visibleImportEvents} />
      </div>

      <div id="jaarkalender-overzicht" className="flex flex-col gap-4 scroll-mt-6 sm:gap-6 sm:scroll-mt-8">
        <div>
          <div className="flex items-center gap-3 text-[#171511]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#edf7d8] text-[#405028] sm:h-10 sm:w-10">
              <CalendarIcon />
            </span>
            <div>
          
              <h2 className="mt-1 text-[clamp(2rem,3vw,2.8rem)] leading-[0.96] tracking-[-0.05em] text-[#171511]">
                {monthTitle}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
            <MonthNavButton
              label="Vorige maand"
              onClick={() => setMonthFilter(addMonths(currentMonth, -1))}
            />
            <MonthNavButton
              label="Volgende maand"
              onClick={() => setMonthFilter(addMonths(currentMonth, 1))}
            />
            <button
              type="button"
              onClick={goToToday}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#b8d9c8] bg-[#edf7f0] px-5 text-sm font-semibold text-[#00733d] transition hover:-translate-y-0.5 hover:border-[#8ebba4] hover:bg-[#e0f0e6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008247] active:translate-y-0 active:bg-[#d5eadc]"
            >
              Vandaag
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#e6dfd3] bg-white/72 shadow-[0_20px_60px_rgba(66,49,31,0.06)] sm:mt-8">
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-[#fffaf3]">
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
                isToday={cell.isToday}
                className={
                  cell.muted
                    ? undefined
                    : cell.isToday
                      ? "bg-[#fbf7ed] ring-1 ring-inset ring-[#cfe89d]"
                      : "bg-white/84"
                }
              >
                <CountBlock count={cell.eventCount} muted={cell.muted} />
              </CalendarCell>
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <div className="border-b border-[#e6dfd3] bg-[#fffaf3] px-3 py-2">
            <div
              className="grid grid-cols-2 rounded-full bg-[#ebe3d8] p-1"
              role="group"
              aria-label="Kalenderweergave"
            >
              <button
                type="button"
                aria-pressed={mobileView === "month"}
                onClick={() => setMobileView("month")}
                className={`min-h-10 rounded-full px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                  mobileView === "month"
                    ? "bg-white text-[#171511] shadow-[0_6px_14px_rgba(66,49,31,0.08)]"
                    : "text-[#66594e]"
                }`}
              >
                Maand
              </button>
              <button
                type="button"
                aria-pressed={mobileView === "week"}
                onClick={() => setMobileView("week")}
                className={`min-h-10 rounded-full px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                  mobileView === "week"
                    ? "bg-white text-[#171511] shadow-[0_6px_14px_rgba(66,49,31,0.08)]"
                    : "text-[#66594e]"
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {mobileView === "month" ? (
            <>
              <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-[#fffaf3]">
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
            </>
          ) : (
            <MobileWeekView
              weekPeriod={weekPeriod}
              weekDays={mobileWeekDays}
              selectedDay={selectedWeekDay}
              selectedItems={selectedWeekItems}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              onPreviousWeek={() =>
                setSelectedWeekDate((date) => addDays(date, -7))
              }
              onNextWeek={() =>
                setSelectedWeekDate((date) => addDays(date, 7))
              }
              onSelectDate={setSelectedWeekDate}
            />
          )}
        </div>

        {totalVisibleItems === 0 ? (
          <EmptyState
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            monthTitle={monthTitle}
          />
        ) : null}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[rgba(34,26,20,0.28)] px-3 py-3 backdrop-blur-[6px] sm:items-center sm:px-4 sm:py-8"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="jaarkalender-filter-title"
            tabIndex={-1}
            className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.4rem] border border-white/65 bg-[linear-gradient(180deg,#f9f5ee_0%,#f7f2ea_100%)] shadow-[0_28px_100px_rgba(52,38,25,0.22)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0e2d6] px-5 py-5 sm:px-7 sm:py-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8f7b68]">
                  Jaarkalender
                </p>
                <h3
                  id="jaarkalender-filter-title"
                  className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#171511] sm:text-4xl"
                >
                  {modalTitle}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Sluit filter modal"
                onClick={closeModal}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#4f4339] transition hover:bg-[#eddccd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {modalMode === "city" ? (
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCityFilter(null);
                      closeModal();
                    }}
                    className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition ${
                      selectedCity === null
                        ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                        : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"
                    }`}
                  >
                    Heel Nederland
                  </button>
                  {cityOptions.map((city) => (
                    <button
                      key={city.label}
                      type="button"
                      onClick={() => {
                        setCityFilter(city.label);
                        closeModal();
                      }}
                      className={`flex min-h-12 items-center justify-between gap-3 rounded-full border px-5 text-left text-sm font-semibold transition ${
                        selectedCity === city.label
                          ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                          : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"
                      }`}
                    >
                      <span className="min-w-0 truncate">{city.label}</span>
                      {city.hasBackendContent ? (
                        <span className="shrink-0 rounded-full bg-[#d9efad] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#33421f]">
                          Live
                        </span>
                      ) : city.hasCalendarItems ? null : (
                        <span className="shrink-0 rounded-full bg-[#efe5d8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c6b59]">
                          Binnenkort
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter(null);
                      closeModal();
                    }}
                    className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition ${
                      selectedCategory === null
                        ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                        : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"
                    }`}
                  >
                    Alle categorieen
                  </button>
                  {categoryOptions.map((category) => {
                    const meta = jaarkalenderCategoryMeta[category];

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(category);
                          closeModal();
                        }}
                        className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition ${
                          selectedCategory === category
                            ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                            : `${meta.badgeClass} border-transparent hover:opacity-90`
                        }`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
