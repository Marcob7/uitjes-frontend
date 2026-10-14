"use client";

import type {
  FormEvent as ReactFormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  cityOptions as sharedCityOptions,
  normalizeCitySlug,
} from "@/lib/cityConfig";
import { isCityContentCity } from "@/lib/cityContentCities";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FilterButton } from "@/components/ui";
import { formatDate } from "@/lib/i18n/format";
import {
  addMonths,
  filterCalendarItems,
  getCityFromLocation,
  getJaarkalenderDayForDate,
  getMonthGrid,
  getMonthInputValue,
  hasJaarkalenderDataForMonth,
  isSameDay,
  isSameMonth,
} from "./calendarUtils";

import type { AgendaImportEvent } from "./AgendaImportBanner";
import { JaarkalenderMonthNavigation } from "./JaarkalenderMonthNavigation";
import { JaarkalenderGrid, type MonthCalendarCell } from "./JaarkalenderGrid";
import { JaarkalenderFilterDialog } from "./JaarkalenderFilterDialog";
import {
  jaarkalenderCategoryMeta,
  jaarkalenderDays,
  getJaarkalenderCalendarItemsForDate,
  type JaarkalenderDay,
  type JaarkalenderCategoryKey,
} from "./data";
import {
  useJaarkalenderFilterUrlState,
  type JaarkalenderInitialFilters,
} from "./useJaarkalenderFilterUrlState";

type FilterModalMode = "city" | "category";

type JaarkalenderCityOption = {
  label: string;
  hasCalendarItems: boolean;
  hasBackendContent: boolean;
};

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

export function JaarkalenderInteractiveCalendar({
  initialFilters = {},
}: {
  initialFilters?: JaarkalenderInitialFilters;
}) {
  const { locale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FilterModalMode>("city");
  const [today, setToday] = useState(() => new Date());
  const {
    selectedMonth,
    selectedCity,
    selectedCategory,
    hasActiveFilters,
    setMonthFilter,
    applyMonthInputValue,
    setCityFilter,
    setCategoryFilter,
    clearFilters,
  } = useJaarkalenderFilterUrlState(initialFilters);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cityComboboxRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [activeCityIndex, setActiveCityIndex] = useState(-1);

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
  const monthTitle = formatDate(selectedMonth, locale, { month: "long", year: "numeric" });

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
    modalMode === "city" ? t("yearCalendar.chooseLocation") : t("yearCalendar.chooseCategory");

  return (
    <>
      <form
        className="grid gap-1 rounded-[1.55rem] border border-[#dedbd2] bg-[#fbfaf7]/95 p-2 shadow-[0_20px_60px_rgba(27,42,34,0.12)] backdrop-blur-xl sm:grid-cols-2 sm:gap-0 sm:p-2.5 lg:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={handleFilterSubmit}
      >
        <FilterButton
          onClick={(event) => openModal("city", event.currentTarget)}
          className="group min-h-[4.25rem] min-w-0 rounded-[1.1rem] px-3 text-left hover:bg-[#f0f3ed] focus-visible:outline-[#00784a] sm:border-r sm:border-[#e2dfd6] sm:px-4"
          leadingIcon={<span className="text-[#00784a]"><PinIcon /></span>}
          label={<span className="text-xs font-medium text-[#716e66]">{t("yearCalendar.location")}</span>}
          value={<span className="text-sm font-semibold text-[#292e2a]">{selectedCity ?? t("yearCalendar.wholeNetherlands")}</span>}
          trailingIcon={<span className="text-[#8d938e] group-hover:text-[#00733d]"><ChevronDownIcon /></span>}
        />

        <FilterButton
          onClick={(event) => openModal("category", event.currentTarget)}
          className="group min-h-[4.25rem] min-w-0 rounded-[1.1rem] px-3 text-left hover:bg-[#f0f3ed] focus-visible:outline-[#00784a] sm:px-4 lg:border-r lg:border-[#e2dfd6]"
          leadingIcon={<span className="text-[#00784a]"><FilterIcon /></span>}
          label={<span className="text-xs font-medium text-[#716e66]">{t("yearCalendar.category")}</span>}
          value={<span className="text-sm font-semibold text-[#292e2a]">{selectedCategory ? jaarkalenderCategoryMeta[selectedCategory].label : t("yearCalendar.allEvents")}</span>}
          trailingIcon={<span className="text-[#8d938e] group-hover:text-[#00733d]"><ChevronDownIcon /></span>}
        />

        <label
          className="group flex min-h-[4.25rem] min-w-0 cursor-pointer items-center gap-3 rounded-[1.1rem] px-3 transition hover:bg-[#f0f3ed] focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-[#00784a] sm:border-r sm:border-[#e2dfd6] sm:px-4 lg:border-r-0"
          onClick={openMonthPicker}
        >
          <span className="text-[#00784a]"><CalendarIcon /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-[#716e66]">{t("yearCalendar.date")}</span>
            <input
              ref={dateInputRef}
              type="month"
              name="date"
              aria-label={t("yearCalendar.chooseMonth")}
              value={getMonthInputValue(selectedMonth)}
              onChange={(event) => applyMonthInputValue(event.target.value)}
              className="mt-1 block w-full min-w-0 bg-transparent text-sm font-semibold text-[#292e2a] outline-none"
            />
          </span>
        </label>

        <button
          type="submit"
          aria-label={t("yearCalendar.search")}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#123e2c] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b3121] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] sm:mt-2 lg:mt-2 lg:w-auto"
        >
          <SearchIcon />
          <span>{t("yearCalendar.search")}</span>
        </button>
      </form>

      {hasActiveFilters ? (
        <div className="mt-3 flex justify-end pr-1">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-[#176343] underline decoration-[#176343]/28 underline-offset-4 transition hover:bg-white/65 hover:decoration-[#176343] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] active:bg-white"
          >
            {t("yearCalendar.clearFilters")}
          </button>
        </div>
      ) : null}

      <JaarkalenderMonthNavigation
        title={monthTitle}
        events={visibleImportEvents}
        previousLabel={t("yearCalendar.previousMonth")}
        nextLabel={t("yearCalendar.nextMonth")}
        todayLabel={t("date.today")}
        onPrevious={() => setMonthFilter(addMonths(selectedMonth, -1))}
        onNext={() => setMonthFilter(addMonths(selectedMonth, 1))}
        onToday={goToToday}
      />

      <JaarkalenderGrid
        cells={monthCalendarCells}
        totalVisibleItems={totalVisibleItems}
        selectedCity={selectedCity}
        selectedCategory={selectedCategory}
        monthTitle={monthTitle}
      />



      <JaarkalenderFilterDialog open={isOpen} title={modalTitle} closeLabel={t("yearCalendar.closeFilters")} onClose={closeModal} dialogRef={modalRef}>
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
                    {t("yearCalendar.searchLocation")}
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
                      placeholder={t("yearCalendar.searchLocationPlaceholder")}
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
                        aria-label={t("yearCalendar.clearLocation")}
                        onClick={clearCity}
                        className="absolute inset-y-0 right-1.5 my-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#66594e] transition hover:bg-[#f2e7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]"
                      >
                        <CloseIcon />
                      </button>
                    )}
                  </div>

                  {selectedCity ? (
                    <p className="mt-3 text-sm text-[#5f5145]">
                      {t("yearCalendar.selected")}: <span className="font-semibold text-[#264434]">{selectedCity}</span>
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[#6c5f53]">{t("yearCalendar.searchLocationIntro")}</p>
                  )}

                  {isCityMenuOpen && cityQuery ? (
                    <div
                      id="jaarkalender-city-options"
                      role="listbox"
                      aria-label={t("yearCalendar.foundLocations")}
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
                          {t("yearCalendar.noLocations")}
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
      </JaarkalenderFilterDialog>
    </>
  );
}
