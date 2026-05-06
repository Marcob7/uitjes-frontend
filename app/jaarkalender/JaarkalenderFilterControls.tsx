"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  jaarkalenderCategoryMeta,
  jaarkalenderDays,
  type JaarkalenderCalendarItem,
  type JaarkalenderDay,
  type JaarkalenderCategoryKey,
} from "./data";

type FilterModalMode = "city" | "category";

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
const selectedCalendarDay = 10;

function getCityFromLocation(location: string) {
  return location.split(",").at(-1)?.trim() ?? location;
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
              } ${isSelected ? "bg-[#d9efad] text-[#26331a]" : "bg-[#f3eee6] text-[#4f453c]"}`}
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
          muted ? "text-[#7c7166]" : "text-[#2f2923]"
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

export function JaarkalenderInteractiveCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FilterModalMode>("city");
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(JAARKALENDER_DATA_YEAR, JAARKALENDER_DATA_MONTH, 1)
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<JaarkalenderCategoryKey | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const cityOptions = useMemo(() => {
    const cities = jaarkalenderDays.flatMap((day) =>
      day.calendarItems.map((item) => getCityFromLocation(item.locatie))
    );

    return Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b, "nl"));
  }, []);

  const categoryOptions = Object.keys(
    jaarkalenderCategoryMeta
  ) as JaarkalenderCategoryKey[];

  const daysByNumber = useMemo(
    () => new Map(jaarkalenderDays.map((day) => [day.dayNumber, day])),
    []
  );

  const getFilteredItems = (items: JaarkalenderCalendarItem[]) =>
    items.filter((item) => {
      const cityMatches =
        !selectedCity || getCityFromLocation(item.locatie) === selectedCity;
      const categoryMatches =
        !selectedCategory || item.categorie === selectedCategory;

      return cityMatches && categoryMatches;
    });

  const monthCalendarCells = useMemo<MonthCalendarCell[]>(
    () =>
      getMonthGrid(currentMonth).map((date) => {
        const isCurrentMonth = isSameMonth(date, currentMonth);
        const day = getJaarkalenderDayForDate(date, daysByNumber);

        if (!isCurrentMonth || !day) {
          return {
            key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            day: String(date.getDate()),
            monthLabel: isCurrentMonth
              ? undefined
              : MONTH_SHORT_NAMES[date.getMonth()],
            muted: !isCurrentMonth,
          };
        }

        const filteredItems = getFilteredItems(day.calendarItems);

        return {
          key: `day-${day.dayNumber}`,
          day: String(day.dayNumber),
          dayNumber: day.dayNumber,
          href: `/jaarkalender/${day.slug}`,
          eventCount: filteredItems.length,
          eventLabels: filteredItems.slice(0, 2).map((item) => item.title),
        };
      }),
    [currentMonth, daysByNumber, selectedCategory, selectedCity]
  );

  const totalVisibleItems = monthCalendarCells.reduce(
    (total, cell) => total + (cell.eventCount ?? 0),
    0
  );
  const monthTitle = `${
    MONTH_NAMES[currentMonth.getMonth()]
  } ${currentMonth.getFullYear()}`;

  const closeModal = () => {
    setIsOpen(false);
  };

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
      <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[#171511]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#edf7d8] text-[#405028] sm:h-10 sm:w-10">
              <CalendarIcon />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7b6a] sm:text-sm sm:tracking-[0.22em]">
                Overzicht
              </p>
              <h2 className="mt-1 text-[clamp(2rem,3vw,2.8rem)] leading-[0.96] tracking-[-0.05em] text-[#171511]">
                {monthTitle}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
            <MonthNavButton
              label="Vorige maand"
              onClick={() => setCurrentMonth((month) => addMonths(month, -1))}
            />
            <MonthNavButton
              label="Volgende maand"
              onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
            />
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(
                  new Date(today.getFullYear(), today.getMonth(), 1)
                );
              }}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#d9efad] px-4 text-sm font-semibold text-[#2a331d] transition hover:bg-[#cee797] sm:min-h-11 sm:px-5"
            >
              Vandaag
            </button>
          </div>
        </div>

        <div className="xl:max-w-[34rem]">
          <div className="flex flex-wrap gap-3">
            <ControlButton
              icon={<PinIcon />}
              onClick={(event) => openModal("city", event.currentTarget)}
            >
              {selectedCity ?? "Heel Nederland"}
            </ControlButton>
            <ControlButton
              icon={<FilterIcon />}
              onClick={(event) => openModal("category", event.currentTarget)}
            >
              {selectedCategory
                ? jaarkalenderCategoryMeta[selectedCategory].label
                : "Alle categorieen"}
            </ControlButton>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#e6dfd3] bg-white/72 shadow-[0_20px_60px_rgba(66,49,31,0.06)] sm:mt-8 sm:rounded-[2.2rem]">
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
                className={cell.muted ? undefined : "bg-white/84"}
              >
                <CountBlock count={cell.eventCount} muted={cell.muted} />
              </CalendarCell>
            ))}
          </div>
        </div>

        <div className="md:hidden">
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
                      setSelectedCity(null);
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
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        closeModal();
                      }}
                      className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition ${
                        selectedCity === city
                          ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                          : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
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
                          setSelectedCategory(category);
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
