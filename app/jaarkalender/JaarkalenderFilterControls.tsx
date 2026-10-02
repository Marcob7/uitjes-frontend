"use client";

import type {
  FormEvent as ReactFormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  cityOptions as sharedCityOptions,
  normalizeCitySlug,
} from "@/lib/cityConfig";
import { isCityContentCity } from "@/lib/cityContentCities";

import {
  AgendaImportBanner,
  type AgendaImportEvent,
} from "./AgendaImportBanner";
import {
  jaarkalenderCategoryMeta,
  jaarkalenderDays,
  getJaarkalenderCalendarItemsForDate,
  type JaarkalenderDay,
  type JaarkalenderCategoryKey,
} from "./data";

type FilterModalMode = "city" | "category";

type JaarkalenderCityOption = {
  label: string;
  hasCalendarItems: boolean;
  hasBackendContent: boolean;
};

type JaarkalenderInitialFilters = {
  category?: string;
  city?: string;
  date?: string;
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

// The available fixture data happens to cover October 2024. It must never
// decide which period visitors see when they open the calendar.
const JAARKALENDER_DATA_YEAR = 2024;
const JAARKALENDER_DATA_MONTH = 9;

function getCityFromLocation(location: string) {
  return location.split(",").at(-1)?.trim() ?? location;
}

function getCityLabelFromUrl(value: string | null) {
  if (!value) return null;

  const normalizedValue = normalizeCitySlug(value);
  return (
    sharedCityOptions.find(
      (city) =>
        city.value === normalizedValue ||
        normalizeCitySlug(city.label) === normalizedValue
    )?.label ?? value
  );
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

function getCurrentLocalMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getMonthFromInputValue(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month] = value.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);

  return year >= 1 && month >= 1 && month <= 12 &&
    monthDate.getFullYear() === year && monthDate.getMonth() === month - 1
    ? monthDate
    : null;
}

function getMonthFromUrl(value: string | null, fallbackMonth: Date) {
  return value ? getMonthFromInputValue(value) ?? fallbackMonth : fallbackMonth;
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
  items: JaarkalenderDay["calendarItems"],
  selectedCity: string | null,
  selectedCategory: JaarkalenderCategoryKey | null
) {
  return items.filter((item) => {
    const cityMatches =
      !selectedCity ||
      normalizeCitySlug(getCityFromLocation(item.locatie)) ===
        normalizeCitySlug(selectedCity);
    const categoryMatches =
      !selectedCategory || item.categorie === selectedCategory;

    return cityMatches && categoryMatches;
  });
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d3c9] bg-[#fbfaf7] text-[#34312c] transition hover:-translate-y-0.5 hover:border-[#aaa397] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]"
    >
      <span aria-hidden="true" className="-mt-px text-lg">
        {label === "Vorige maand" ? "←" : "→"}
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
      <p className="mt-2 text-sm font-medium leading-5 tracking-normal text-[#8c8072]">
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
          <span className="pt-1 text-[11px] font-medium leading-4 tracking-normal text-[#a79d91]">
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
          <span className="text-sm font-medium leading-5 tracking-normal text-[#a19485]">
            {monthLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-1 flex-col">{children}</div>
      {href ? (
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium leading-5 tracking-normal text-[#66594e] transition group-hover:text-[#4f7628]">
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
  const cityQuery = selectedCity
    ? `?city=${encodeURIComponent(normalizeCitySlug(selectedCity))}`
    : "";

  return (
    <div className="border-t border-[#e6dfd3] bg-[#fffaf3] px-5 py-6 text-sm text-[#66594e] sm:px-8">
      <p>
        Geen uitjes gevonden{selectedCity ? ` in ${selectedCity}` : ""} voor
        {` ${monthTitle.toLowerCase()}`}
        {filterText && !selectedCity ? ` met ${filterText}` : ""}.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/ontdek${cityQuery}`}
          className="inline-flex min-h-10 items-center rounded-full bg-[#176343] px-4 font-semibold text-white transition hover:bg-[#104d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]"
        >
          Bekijk uitjes {selectedCity ? `in ${selectedCity}` : ""}
        </Link>
        {selectedCity ? (
          <Link
            href={`/inspiratie${cityQuery}`}
            className="inline-flex min-h-10 items-center rounded-full border border-[#b9d4c5] px-4 font-semibold text-[#176343] transition hover:bg-[#eaf1ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]"
          >
            Inspiratie voor {selectedCity}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function JaarkalenderInteractiveCalendar({
  initialFilters = {},
}: {
  initialFilters?: JaarkalenderInitialFilters;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FilterModalMode>("city");
  const [today, setToday] = useState(() => new Date());
  const [defaultMonth] = useState(() => getCurrentLocalMonth());
  // This is the only month state. The input, URL, heading and calendar grid
  // deliberately all derive from it so they cannot display different months.
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getMonthFromUrl(
      initialFilters.date ??
        (typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("date")),
      getCurrentLocalMonth()
    )
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(() =>
    getCityLabelFromUrl(
      initialFilters.city ??
        (typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("city"))
    )
  );
  const [selectedCategory, setSelectedCategory] =
    useState<JaarkalenderCategoryKey | null>(() => {
      const category =
        initialFilters.category ??
        (typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("category"));
      return category && category in jaarkalenderCategoryMeta
        ? (category as JaarkalenderCategoryKey)
        : null;
    });
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cityComboboxRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [activeCityIndex, setActiveCityIndex] = useState(-1);

  const syncFilterParams = (
    city: string | null,
    category: JaarkalenderCategoryKey | null,
    month: Date
  ) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isDefaultMonth = getMonthInputValue(month) === getMonthInputValue(defaultMonth);

    if (city) url.searchParams.set("city", normalizeCitySlug(city));
    else url.searchParams.delete("city");

    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");

    if (isDefaultMonth) url.searchParams.delete("date");
    else url.searchParams.set("date", getMonthInputValue(month));

    const nextHref = `${url.pathname}${url.search}${url.hash}`;
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextHref !== currentHref) {
      window.history.pushState(null, "", nextHref);
    }
  };

  const setMonthFilter = (month: Date) => {
    const normalizedMonth = getMonthFromInputValue(getMonthInputValue(month));
    if (!normalizedMonth) return;

    setSelectedMonth(normalizedMonth);
    syncFilterParams(selectedCity, selectedCategory, normalizedMonth);
  };

  const applyMonthInputValue = (value: string) => {
    const month = getMonthFromInputValue(value);
    if (month) {
      setMonthFilter(month);
    }
  };

  const handleFilterSubmit = (event: ReactFormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Read the native field at submit time as well. This covers a month picker
    // whose final value is committed together with the form submission.
    applyMonthInputValue(
      dateInputRef.current?.value ?? getMonthInputValue(selectedMonth)
    );
    document
      .getElementById("jaarkalender-overzicht")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setCityFilter = (city: string | null) => {
    setSelectedCity(city);
    syncFilterParams(city, selectedCategory, selectedMonth);
  };

  const setCategoryFilter = (category: JaarkalenderCategoryKey | null) => {
    setSelectedCategory(category);
    syncFilterParams(selectedCity, category, selectedMonth);
  };

  const clearFilters = () => {
    setSelectedCity(null);
    setSelectedCategory(null);
    setSelectedMonth(defaultMonth);
    syncFilterParams(null, null, defaultMonth);
  };

  const hasActiveFilters =
    selectedCity !== null ||
    selectedCategory !== null ||
    getMonthInputValue(selectedMonth) !== getMonthInputValue(defaultMonth);

  useEffect(() => {
    const syncStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");

      setSelectedCity(getCityLabelFromUrl(params.get("city")));
      setSelectedCategory(
        category && category in jaarkalenderCategoryMeta
          ? (category as JaarkalenderCategoryKey)
          : null
      );
      setSelectedMonth(getMonthFromUrl(params.get("date"), defaultMonth));
    };

    // Client components hydrate from the server-rendered fallback, so also
    // apply the URL once after hydration (not only on back/forward).
    syncStateFromUrl();
    window.addEventListener("popstate", syncStateFromUrl);
    return () => window.removeEventListener("popstate", syncStateFromUrl);
  }, [defaultMonth]);

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

  const matchingCityOptions = useMemo(() => {
    const normalizedQuery = normalizeCitySlug(cityQuery);

    if (!normalizedQuery) {
      return [];
    }

    return cityOptions.filter((city) =>
      normalizeCitySlug(city.label).includes(normalizedQuery)
    );
  }, [cityOptions, cityQuery]);

  const categoryOptions = Object.keys(
    jaarkalenderCategoryMeta
  ) as JaarkalenderCategoryKey[];

  const daysByNumber = useMemo(
    () => new Map(jaarkalenderDays.map((day) => [day.dayNumber, day])),
    []
  );

  const monthCalendarCells = useMemo<MonthCalendarCell[]>(
    () =>
      getMonthGrid(selectedMonth).map((date) => {
        const isCurrentMonth = isSameMonth(date, selectedMonth);
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
          getJaarkalenderCalendarItemsForDate(date),
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
    [daysByNumber, selectedCategory, selectedCity, selectedMonth, today]
  );

  const visibleImportEvents = useMemo<AgendaImportEvent[]>(() => {
    if (!hasJaarkalenderDataForMonth(selectedMonth)) {
      return [];
    }

    return jaarkalenderDays.flatMap((day) => {
      const filteredItems = filterCalendarItems(
        getJaarkalenderCalendarItemsForDate(
          new Date(`${day.isoDate}T12:00:00`)
        ),
        selectedCity,
        selectedCategory
      );

      return filteredItems.map((item) => ({
        dayIsoDate: day.isoDate,
        daySlug: day.slug,
        item,
      }));
    });
  }, [selectedCategory, selectedCity, selectedMonth]);

  const totalVisibleItems = useMemo(
    () =>
      monthCalendarCells.reduce(
        (total, cell) => total + (cell.eventCount ?? 0),
        0
      ),
    [monthCalendarCells]
  );
  const monthTitle = `${
    MONTH_NAMES[selectedMonth.getMonth()]
  } ${selectedMonth.getFullYear()}`;

  const closeModal = () => {
    setIsOpen(false);
  };

  const goToToday = () => {
    const nextToday = new Date();
    setToday(nextToday);
    setMonthFilter(new Date(nextToday.getFullYear(), nextToday.getMonth(), 1));
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
      if (event.key === "Escape" && !event.defaultPrevented) {
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

  useEffect(() => {
    if (!isOpen || modalMode !== "city") return;

    const focusTimer = window.setTimeout(() => cityInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen, modalMode]);

  const openModal = (
    mode: FilterModalMode,
    triggerElement: HTMLElement
  ) => {
    triggerRef.current = triggerElement;
    setModalMode(mode);
    if (mode === "city") {
      setCityQuery("");
      setActiveCityIndex(-1);
      setIsCityMenuOpen(false);
    }
    setIsOpen(true);
  };

  const selectCity = (city: JaarkalenderCityOption) => {
    setCityFilter(city.label);
    setCityQuery("");
    setActiveCityIndex(-1);
    setIsCityMenuOpen(false);
    closeModal();
  };

  const clearCity = () => {
    setCityQuery("");
    setActiveCityIndex(-1);
    setIsCityMenuOpen(true);
    if (selectedCity) {
      setCityFilter(null);
    }
    cityInputRef.current?.focus();
  };

  const handleCityInputKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>
  ) => {
    const optionCount = matchingCityOptions.length;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsCityMenuOpen(true);
      if (optionCount) {
        setActiveCityIndex((index) => (index + 1 + optionCount) % optionCount);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsCityMenuOpen(true);
      if (optionCount) {
        setActiveCityIndex((index) =>
          index <= 0 ? optionCount - 1 : index - 1
        );
      }
      return;
    }

    if (event.key === "Enter" && activeCityIndex >= 0) {
      const city = matchingCityOptions[activeCityIndex];
      if (city) {
        event.preventDefault();
        selectCity(city);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setCityQuery("");
      setActiveCityIndex(-1);
      setIsCityMenuOpen(false);
    }
  };

  const openMonthPicker = (event: ReactMouseEvent<HTMLLabelElement>) => {
    const input = dateInputRef.current;
    if (!input || event.target === input) return;

    // A label click otherwise forwards a second click to its control. Preventing
    // that default keeps one picker attempt; direct input clicks stay native.
    event.preventDefault();
    input.focus();

    if (typeof input.showPicker !== "function") return;

    try {
      // Synchronous in the original user click. If a browser refuses it, the
      // focused native control remains available as the fallback.
      input.showPicker();
    } catch {
      // Browsers may reject showPicker despite a user gesture.
    }
  };

  const modalTitle =
    modalMode === "city" ? "Kies een locatie" : "Kies een categorie";

  return (
    <>
      <form
        className="grid gap-1 rounded-[1.55rem] border border-[#dedbd2] bg-[#fbfaf7]/95 p-2 shadow-[0_20px_60px_rgba(27,42,34,0.12)] backdrop-blur-xl sm:grid-cols-2 sm:gap-0 sm:p-2.5 lg:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={handleFilterSubmit}
      >
        <button
          type="button"
          onClick={(event) => openModal("city", event.currentTarget)}
          className="group flex min-h-[4.25rem] min-w-0 items-center gap-3 rounded-[1.1rem] px-3 text-left transition hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00784a] sm:border-r sm:border-[#e2dfd6] sm:px-4"
        >
          <span className="text-[#00784a]"><PinIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-[#716e66]">Locatie</span>
            <span className="mt-1 block truncate text-sm font-semibold text-[#292e2a]">{selectedCity ?? "Heel Nederland"}</span>
          </span>
          <span className="text-[#8d938e] group-hover:text-[#00733d]"><ChevronDownIcon /></span>
        </button>

        <button
          type="button"
          onClick={(event) => openModal("category", event.currentTarget)}
          className="group flex min-h-[4.25rem] min-w-0 items-center gap-3 rounded-[1.1rem] px-3 text-left transition hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00784a] sm:px-4 lg:border-r lg:border-[#e2dfd6]"
        >
          <span className="text-[#00784a]"><FilterIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-[#716e66]">Categorie</span>
            <span className="mt-1 block truncate text-sm font-semibold text-[#292e2a]">
              {selectedCategory ? jaarkalenderCategoryMeta[selectedCategory].label : "Alle evenementen"}
            </span>
          </span>
          <span className="text-[#8d938e] group-hover:text-[#00733d]"><ChevronDownIcon /></span>
        </button>

        <label
          className="group flex min-h-[4.25rem] min-w-0 cursor-pointer items-center gap-3 rounded-[1.1rem] px-3 transition hover:bg-[#f0f3ed] focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-[#00784a] sm:border-r sm:border-[#e2dfd6] sm:px-4 lg:border-r-0"
          onClick={openMonthPicker}
        >
          <span className="text-[#00784a]"><CalendarIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-[#716e66]">Datum</span>
            <input
              ref={dateInputRef}
              type="month"
              name="date"
              aria-label="Kies een maand"
              value={getMonthInputValue(selectedMonth)}
              onChange={(event) => applyMonthInputValue(event.target.value)}
              className="mt-1 block w-full min-w-0 bg-transparent text-sm font-semibold text-[#292e2a] outline-none"
            />
          </span>
        </label>

        <button
          type="submit"
          aria-label="Zoeken in de jaarkalender"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#123e2c] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b3121] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] sm:mt-2 lg:mt-2 lg:w-auto"
        >
          <SearchIcon />
          <span>Zoeken</span>
        </button>
      </form>

      {hasActiveFilters ? (
        <div className="mt-3 flex justify-end pr-1">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-[#176343] underline decoration-[#176343]/28 underline-offset-4 transition hover:bg-white/65 hover:decoration-[#176343] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] active:bg-white"
          >
            Wis filters
          </button>
        </div>
      ) : null}

      <div
        id="jaarkalender-overzicht"
        className="mt-12 grid scroll-mt-24 gap-7 sm:mt-16 sm:scroll-mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.68fr)] lg:items-end lg:gap-12"
      >
        <div>

          <h2
            style={{ maxInlineSize: "none" }}
            className="mt-2 text-[clamp(2.8rem,5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.058em] text-[#191b18]"
          >
            {monthTitle}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
            <MonthNavButton
              label="Vorige maand"
              onClick={() => setMonthFilter(addMonths(selectedMonth, -1))}
            />
            <MonthNavButton
              label="Volgende maand"
              onClick={() => setMonthFilter(addMonths(selectedMonth, 1))}
            />
            <button
              type="button"
              onClick={goToToday}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9d4c5] bg-[#e8f1eb] px-5 text-sm font-semibold text-[#176343] transition hover:-translate-y-0.5 hover:border-[#84b299] hover:bg-[#dfece3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] active:translate-y-0 active:bg-[#d7e7dc]"
            >
              Vandaag
            </button>
          </div>
        </div>
        <AgendaImportBanner events={visibleImportEvents} />
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.4rem] border border-[#dfdbd1] bg-[#fffdf9] shadow-[0_24px_70px_rgba(53,44,31,0.07)] sm:mt-10">
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-b border-[#e6dfd3] bg-[#fffaf3]">
            {["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"].map((day) => (
              <div
                key={day}
                className="px-4 py-4 text-center text-xs font-medium tracking-normal text-[#7e7366]"
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
          className="fixed inset-0 z-[1200] flex items-end justify-center overflow-y-auto bg-[rgba(34,26,20,0.28)] px-3 py-3 backdrop-blur-[6px] sm:items-center sm:px-4 sm:py-8"
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

            <div
              className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
              onClick={(event) => {
                if (
                  modalMode === "city" &&
                  isCityMenuOpen &&
                  !cityComboboxRef.current?.contains(event.target as Node)
                ) {
                  setIsCityMenuOpen(false);
                  setActiveCityIndex(-1);
                }
              }}
            >
              {modalMode === "city" ? (
                <div ref={cityComboboxRef} className="relative">
                  <label
                    htmlFor="jaarkalender-city-search"
                    className="mb-2 block text-sm font-semibold text-[#3e352d]"
                  >
                    Zoek een plaats
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#176343]">
                      <SearchIcon />
                    </span>
                    <input
                      ref={cityInputRef}
                      id="jaarkalender-city-search"
                      type="text"
                      value={cityQuery}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={isCityMenuOpen && Boolean(cityQuery)}
                      aria-controls="jaarkalender-city-options"
                      aria-activedescendant={
                        activeCityIndex >= 0
                          ? `jaarkalender-city-option-${activeCityIndex}`
                          : undefined
                      }
                      placeholder="Zoek een plaats..."
                      onFocus={() => setIsCityMenuOpen(true)}
                      onChange={(event) => {
                        setCityQuery(event.target.value);
                        setActiveCityIndex(-1);
                        setIsCityMenuOpen(true);
                      }}
                      onKeyDown={handleCityInputKeyDown}
                      className="min-h-14 w-full rounded-2xl border border-[#d9d1c6] bg-white py-3 pl-12 pr-12 text-base font-medium text-[#241f19] outline-none transition placeholder:text-[#897c6e] focus:border-[#176343] focus:ring-2 focus:ring-[#176343]/20"
                    />
                    {(cityQuery || selectedCity) && (
                      <button
                        type="button"
                        aria-label="Wis locatie"
                        onClick={clearCity}
                        className="absolute inset-y-0 right-1.5 my-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#66594e] transition hover:bg-[#f2e7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]"
                      >
                        <CloseIcon />
                      </button>
                    )}
                  </div>

                  {selectedCity ? (
                    <p className="mt-3 text-sm text-[#5f5145]">
                      Geselecteerd: <span className="font-semibold text-[#264434]">{selectedCity}</span>
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[#6c5f53]">Zoek op naam om een plaats te kiezen.</p>
                  )}

                  {isCityMenuOpen && cityQuery ? (
                    <div
                      id="jaarkalender-city-options"
                      role="listbox"
                      aria-label="Gevonden plaatsen"
                      className="mt-3 max-h-[min(19rem,calc(100dvh-20rem))] overflow-y-auto rounded-2xl border border-[#e6d9cb] bg-white p-1.5 shadow-[0_16px_34px_rgba(68,49,31,0.12)]"
                    >
                      {matchingCityOptions.length ? (
                        matchingCityOptions.map((city, index) => (
                          <button
                            key={city.label}
                            id={`jaarkalender-city-option-${index}`}
                            type="button"
                            role="option"
                            aria-selected={selectedCity === city.label}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectCity(city)}
                            onMouseMove={() => setActiveCityIndex(index)}
                            className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00784a] ${
                              index === activeCityIndex
                                ? "bg-[#edf4e8] text-[#1e3e2b]"
                                : "text-[#3f352c] hover:bg-[#f8f1e9]"
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
                        ))
                      ) : (
                        <p className="px-3.5 py-4 text-sm font-medium text-[#6c5f53]">
                          Geen plaatsen gevonden
                        </p>
                      )}
                    </div>
                  ) : null}
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
