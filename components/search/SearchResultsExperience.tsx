"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import SavePlaceButton from "@/components/SavePlaceButton";
import SearchRetryButton from "@/components/search/SearchRetryButton";
import ResultCard from "@/components/ui/ResultCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname, localeToIntl } from "@/lib/i18n/config";
import type { GeneralSearchResult } from "@/lib/search/searchResults";

type SortOption = "match" | "rating" | "price" | "recent";
type FilterKey = "city" | "when" | "category" | "free" | "rating";

type FilterState = {
  city: string;
  when: string;
  category: string;
  free: boolean;
  rating: string;
};

type SearchResultsExperienceProps = {
  query: string;
  results: GeneralSearchResult[];
  error?: boolean;
  partial?: boolean;
};

type SearchParamsLike = {
  get: (name: string) => string | null;
  toString: () => string;
};

const CATEGORY_OPTIONS = [
  { value: "buiten", label: "Buiten", terms: ["buiten", "natuur", "park", "wandeling", "route"] },
  { value: "binnen", label: "Binnen", terms: ["binnen", "museum", "cultuur", "workshop", "overdekt"] },
  { value: "met-kinderen", label: "Met kinderen", terms: ["met-kinderen", "kinderen", "gezin", "familie", "kids"] },
  { value: "eten-drinken", label: "Eten & drinken", terms: ["eten-drinken", "eten", "drinken", "restaurant", "horeca"] },
];

const WHEN_OPTIONS = [
  { value: "today", label: "Vandaag", terms: ["vandaag", "nu", "doorlopend", "actueel"] },
  { value: "weekend", label: "Dit weekend", terms: ["weekend", "zaterdag", "zondag"] },
];

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function readFilters(params: SearchParamsLike): FilterState {
  return {
    city: params.get("city") ?? "",
    when: params.get("when") ?? "",
    category: params.get("category") ?? "",
    free: params.get("free") === "1",
    rating: params.get("rating") ?? "",
  };
}

function getSort(params: SearchParamsLike): SortOption {
  const value = params.get("sort");
  return value === "rating" || value === "price" || value === "recent" ? value : "match";
}

function resultSearchText(result: GeneralSearchResult) {
  return normalize(
    [
      result.title,
      result.badge,
      result.categorySlug,
      result.city,
      result.location,
      result.priceLabel,
      result.dateLabel,
      result.kind,
      ...result.tags,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function matchesFilterState(result: GeneralSearchResult, filters: FilterState) {
  const text = resultSearchText(result);
  if (filters.city && result.citySlug !== filters.city) return false;
  if (filters.free && !result.isFree && !text.includes("gratis")) return false;
  if (filters.rating && (result.ratingValue ?? 0) < Number(filters.rating)) return false;

  if (filters.when) {
    const when = WHEN_OPTIONS.find((option) => option.value === filters.when);
    if (when && !when.terms.some((term) => text.includes(normalize(term)))) return false;
  }

  if (filters.category) {
    const category = CATEGORY_OPTIONS.find((option) => option.value === filters.category);
    if (category && !category.terms.some((term) => text.includes(normalize(term)))) return false;
  }

  return true;
}

function getCityLabel(citySlug: string, results: GeneralSearchResult[]) {
  const matchingResult = results.find((result) => result.citySlug === citySlug);
  return matchingResult?.city ?? citySlug.replace(/-/g, " ");
}

function getCategoryLabel(value: string, t: (key: string) => string) {
  const key = { buiten: "search.categoryOutdoor", binnen: "search.categoryIndoor", "met-kinderen": "search.categoryChildren", "eten-drinken": "search.categoryFood" }[value];
  return key ? t(key) : value;
}

function getWhenLabel(value: string, t: (key: string) => string) {
  const key = { today: "search.whenToday", weekend: "search.whenWeekend" }[value];
  return key ? t(key) : value;
}

function formatPriceLabel(value?: string) {
  if (!value) return null;
  return value.replace(/^EUR\s?/i, "€ ");
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        d="M10 17.25S3.25 13.1 3.25 7.75A3.5 3.5 0 0 1 10 6.1a3.5 3.5 0 0 1 6.75 1.65C16.75 13.1 10 17.25 10 17.25Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchResultCard({ result, index }: { result: GeneralSearchResult; index: number }) {
  const { locale, t } = useLocale();
  const priceLabel = formatPriceLabel(result.priceLabel);

  return (
    <ResultCard
      href={localePathname(result.href, locale)}
      title={result.title}
      image={result.image}
      imageAlt={result.imageAlt}
      category={result.badge}
      location={result.location || result.city}
      date={result.dateLabel}
      price={priceLabel}
      rating={result.ratingValue}
      reviewCount={result.reviewCount}
      reviewsHref={result.reviewsHref}
      priority={index < 3}
      variant="compact"
      favoriteAction={<SavePlaceButton item={{ id: result.id, title: result.title, href: localePathname(result.href, locale), meta: result.location, image: result.image }} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#D5DED6] bg-white px-3 text-xs font-semibold text-[#31483A] transition hover:border-[#8FAA94] hover:bg-[#F7FAF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005FCC] disabled:cursor-not-allowed disabled:opacity-70" savedClassName="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#B9D7B7] bg-[#EEF6EA] px-3 text-xs font-semibold text-[#285239] transition hover:bg-[#E5F0E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005FCC] disabled:cursor-not-allowed disabled:opacity-70" savedChildren={<><HeartIcon filled /><span aria-hidden="true">{t("discover.saved")}</span><span className="sr-only">{t("search.removeSaved")}</span></>}><HeartIcon /><span aria-hidden="true">{t("discover.save")}</span><span className="sr-only">{t("search.save", { title: result.title })}</span></SavePlaceButton>}
    />
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] ${
        active ? "border-[#1d5a46] bg-[#e5f0e6] font-semibold text-[#1d5a46]" : "border-[#dce1dc] bg-white text-[#33413a] hover:border-[#9eb9a5] hover:bg-[#f7faf6]"
      }`}
    >
      <span>{label}</span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-[#1d5a46] bg-[#1d5a46] text-white" : "border-[#bfcac2] text-transparent"}`} aria-hidden="true">
        ✓
      </span>
    </button>
  );
}

export default function SearchResultsExperience({ query, results, error = false, partial = false }: SearchResultsExperienceProps) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterState>(() => readFilters(searchParams));
  const [visibleCount, setVisibleCount] = useState(12);
  const [isPending, startTransition] = useTransition();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterSignature = searchParams.toString();
  const filters = readFilters(searchParams);
  const sort = getSort(searchParams);
  const categoryOptions = CATEGORY_OPTIONS.map((option) => ({
    ...option,
    label: getCategoryLabel(option.value, t),
  }));
  const whenOptions = WHEN_OPTIONS.map((option) => ({ ...option, label: getWhenLabel(option.value, t) }));
  const shortcuts = [
    { label: t("search.whenToday"), href: `${localePathname("/zoeken", locale)}?query=vandaag&when=today` },
    { label: t("search.whenWeekend"), href: `${localePathname("/zoeken", locale)}?query=weekend&when=weekend` },
    { label: t("search.free"), href: `${localePathname("/zoeken", locale)}?query=gratis&free=1` },
    { label: t("search.categoryChildren"), href: `${localePathname("/zoeken", locale)}?query=kinderen&category=met-kinderen` },
    { label: t("search.categoryOutdoor"), href: `${localePathname("/zoeken", locale)}?query=buiten&category=buiten` },
    { label: t("search.nearby"), href: localePathname("/ontdek", locale) },
  ];

  const cityOptions = useMemo(() => {
    const cities = new Map<string, string>();
    results.forEach((result) => {
      if (result.citySlug) cities.set(result.citySlug, result.city);
    });
    return [...cities.entries()].sort((a, b) => a[1].localeCompare(b[1], localeToIntl[locale]));
  }, [locale, results]);

  const activeFilters = useMemo(() => {
    const active: Array<{ key: FilterKey; label: string }> = [];
    if (filters.city) active.push({ key: "city", label: getCityLabel(filters.city, results) });
    if (filters.when) active.push({ key: "when", label: getWhenLabel(filters.when, t) });
    if (filters.category) active.push({ key: "category", label: getCategoryLabel(filters.category, t) });
    if (filters.free) active.push({ key: "free", label: t("search.free") });
    if (filters.rating) active.push({ key: "rating", label: t("search.stars", { rating: filters.rating }) });
    return active;
  }, [filters, results, t]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => matchesFilterState(result, filters));
  }, [filters, results]);

  const sortedResults = useMemo(() => {
    const next = [...filteredResults];
    if (sort === "rating") {
      next.sort((a, b) => (b.ratingValue ?? -1) - (a.ratingValue ?? -1) || a.title.localeCompare(b.title, localeToIntl[locale]));
    } else if (sort === "price") {
      next.sort((a, b) => (a.priceMin ?? Number.POSITIVE_INFINITY) - (b.priceMin ?? Number.POSITIVE_INFINITY) || a.title.localeCompare(b.title, localeToIntl[locale]));
    } else if (sort === "recent") {
      next.sort((a, b) => {
        const aTime = a.startAt ? new Date(a.startAt).getTime() : 0;
        const bTime = b.startAt ? new Date(b.startAt).getTime() : 0;
        return bTime - aTime || a.title.localeCompare(b.title, localeToIntl[locale]);
      });
    }
    return next;
  }, [filteredResults, locale, sort]);

  const visibleResults = sortedResults.slice(0, visibleCount);
  const hasMore = visibleResults.length < sortedResults.length;
  const hasAnyFilters = activeFilters.length > 0;
  const draftResultCount = useMemo(
    () => results.filter((result) => matchesFilterState(result, draftFilters)).length,
    [draftFilters, results],
  );

  useEffect(() => {
    if (!sheetOpen) setDraftFilters(filters);
  }, [filterSignature, sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [sheetOpen]);

  useEffect(() => {
    setVisibleCount(12);
  }, [filterSignature, sort]);

  function updateUrl(nextFilters: Partial<FilterState>, nextSort?: SortOption) {
    const next = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...nextFilters };

    if (merged.city) next.set("city", merged.city);
    else next.delete("city");
    if (merged.when) next.set("when", merged.when);
    else next.delete("when");
    if (merged.category) next.set("category", merged.category);
    else next.delete("category");
    if (merged.free) next.set("free", "1");
    else next.delete("free");
    if (merged.rating) next.set("rating", merged.rating);
    else next.delete("rating");

    if (nextSort && nextSort !== "match") next.set("sort", nextSort);
    else if (nextSort === "match") next.delete("sort");

    const queryString = next.toString();
    const searchPath = localePathname("/zoeken", locale);
    startTransition(() => router.replace(queryString ? `${searchPath}?${queryString}` : searchPath, { scroll: false }));
  }

  function removeFilter(key: FilterKey) {
    updateUrl(key === "free" ? { free: false } : { [key]: "" });
  }

  function clearFilters() {
    updateUrl({ city: "", when: "", category: "", free: false, rating: "" });
  }

  function applyDraftFilters() {
    updateUrl(draftFilters);
    setSheetOpen(false);
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-7 sm:px-6 sm:pt-9 lg:px-8" aria-labelledby="search-error-heading">
        <div className="search-empty-state max-w-2xl" role="alert">
        
          <h2 id="search-error-heading" className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">{t("search.errorTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746d] sm:text-base">{t("search.errorIntro")}</p>
          <div className="mt-6"><SearchRetryButton /></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8" aria-labelledby="search-results-heading">
      <div className="rounded-[1.45rem] border border-[#d7e2d8] bg-[#fdfefd] p-4 shadow-[0_14px_34px_rgba(33,54,43,0.045)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 id="search-results-heading" className="font-heading text-[clamp(1.85rem,3vw,2.65rem)] leading-[1] tracking-[-0.055em] text-[#22312a]">
              {filteredResults.length === 1 ? t("search.resultFor", { count: 1, query }) : t("search.resultsFor", { count: filteredResults.length, query })}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              ref={filterButtonRef}
              type="button"
              onClick={() => { setDraftFilters(filters); setSheetOpen(true); }}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d5a46] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(29,90,70,0.12)] outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                <path d="M2.5 4.25h11M4.5 8h7m-5 3.75h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {t("search.filters")}
              {hasAnyFilters ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dcebdc] px-1 text-[0.68rem] text-[#1d5a46]">{activeFilters.length}</span> : null}
            </button>
            <label className="relative flex min-h-11 shrink-0 items-center gap-2 text-sm text-[#68746d]">
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("search.sort")}</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(event) => updateUrl({}, event.target.value as SortOption)}
                className="min-h-11 min-w-[10.5rem] appearance-none rounded-full border border-[#d4ddd5] bg-white py-2 pl-4 pr-10 text-sm font-semibold text-[#31483a] outline-none transition hover:border-[#9eb9a5] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
                aria-label={t("search.sort")}
              >
                <option value="match">{t("search.bestMatch")}</option>
                <option value="rating">{t("search.highestRated")}</option>
                <option value="price">{t("search.priceLowHigh")}</option>
                <option value="recent">{t("search.recent")}</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#53645a]"><ChevronDownIcon /></span>
            </span>
            </label>
          </div>
        </div>

        <div className="mt-4 border-t border-[#e5ece5] pt-3">
          <div className="search-active-filters flex min-w-0 items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0" aria-label={t("search.activeFilters")}>
            {activeFilters.length > 0 ? activeFilters.map((filter) => (
              <button
                key={`${filter.key}-${filter.label}`}
                type="button"
                onClick={() => removeFilter(filter.key)}
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-[#b8d2bd] bg-[#e6f0e5] px-3.5 text-sm font-medium text-[#26563f] outline-none transition hover:border-[#1d5a46] hover:bg-[#dcebdc] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
              >
                {filter.label}
                <span className="text-base leading-none text-[#557565]" aria-hidden="true">×</span>
                <span className="sr-only">{t("search.removeFilter", { filter: filter.label })}</span>
              </button>
            )) : <span className="text-sm text-[#7a857d]">{t("search.refine")}</span>}
          </div>
        </div>
      </div>

      {partial ? (
        <p role="status" className="mt-4 rounded-xl border border-[#e2d7a8] bg-[#fffbea] px-4 py-3 text-sm leading-5 text-[#685b2a]">
          {t("search.partialNotice")}
        </p>
      ) : null}

      {sortedResults.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
            {visibleResults.map((result, index) => <SearchResultCard key={result.id} result={result} index={index} />)}
          </div>

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setVisibleCount((count) => count + 12)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b5c4b8] bg-white px-6 text-sm font-semibold text-[#1d5a46] outline-none transition hover:-translate-y-0.5 hover:border-[#1d5a46] hover:bg-[#f6faf5] focus-visible:ring-2 focus-visible:ring-[#005fcc] disabled:opacity-60"
              >
                {isPending ? t("common.loading") : t("search.loadMore")}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="search-empty-state mt-6" aria-live="polite">
          <span className="search-empty-mark" aria-hidden="true">⌕</span>
          <div className="max-w-2xl">
        
            <h3 className="mt-3 font-heading text-[clamp(2rem,4vw,3.1rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">{t("search.emptyTitle", { query })}</h3>
            <p className="mt-3 text-sm leading-6 text-[#68746d] sm:text-base">{t("search.emptyIntro")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {hasAnyFilters ? <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]">{t("search.clearFilters")}</button> : null}
              <button type="button" onClick={() => document.getElementById("site-search")?.focus()} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b5c4b8] bg-white px-5 text-sm font-semibold text-[#1d5a46] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]">{t("search.searchAgain")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-4 rounded-[1.7rem] border border-[#cbdacc] bg-[#e7f0e4] p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8">
        <div>
    
          <h3 className="mt-3 max-w-[22ch] font-heading text-[clamp(1.75rem,3vw,2.55rem)] leading-[1] tracking-[-0.05em] text-[#1e3e2e]">{t("search.inspireTitle")}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#4e6858]">{t("search.inspireIntro")}</p>
        </div>
        <Link href={localePathname("/inspiratie", locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:-translate-y-0.5 hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7f0e4]">{t("search.inspireAction")} <span aria-hidden="true">→</span></Link>
      </div>

      <div className="mt-12 border-t border-[#dce1dc] pt-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
         
            <h3 className="mt-2 font-heading text-[clamp(1.75rem,3vw,2.45rem)] leading-none tracking-[-0.05em] text-[#22312a]">{t("search.continueTitle")}</h3>
          </div>
          <p className="text-sm text-[#7a857d]">{t("search.continueIntro")}</p>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {shortcuts.map((shortcut) => (
            <Link key={shortcut.label} href={shortcut.href} className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-[#d0dbd2] bg-white px-4 text-sm font-medium text-[#3e5848] outline-none transition hover:border-[#1d5a46] hover:bg-[#f5faf4] focus-visible:ring-2 focus-visible:ring-[#005fcc]">{shortcut.label}<span aria-hidden="true" className="ml-2 text-[#77917d]">→</span></Link>
          ))}
        </div>
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-[1200] bg-[#12231b]/35 backdrop-blur-[2px]" onMouseDown={() => setSheetOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col border-l border-[#d8e1d9] bg-[#fbfcf8] shadow-[-18px_0_50px_rgba(24,50,35,0.16)]"
          >
            <div className="flex items-start justify-between gap-5 border-b border-[#dce1dc] px-5 py-5 sm:px-7">
              <div>
            
                <h2 id="filter-sheet-title" className="mt-2 font-heading text-3xl leading-none tracking-[-0.05em] text-[#22312a]">{t("search.filters")}</h2>
                <p className="mt-2 text-sm text-[#68746d]">{t("search.filterIntro")}</p>
              </div>
              <button ref={closeButtonRef} type="button" onClick={() => setSheetOpen(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d1dbd2] bg-white text-[#33483b] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]" aria-label={t("search.closeFilters")}><CloseIcon /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {cityOptions.length > 0 ? (
                <fieldset>
                  <legend className="text-sm font-semibold text-[#26392d]">{t("search.location")}</legend>
                  <div className="mt-3 grid gap-2">
                    <FilterOption label={t("search.allLocations")} active={!draftFilters.city} onClick={() => setDraftFilters((current) => ({ ...current, city: "" }))} />
                    {cityOptions.slice(0, 8).map(([value, label]) => <FilterOption key={value} label={label} active={draftFilters.city === value} onClick={() => setDraftFilters((current) => ({ ...current, city: current.city === value ? "" : value }))} />)}
                  </div>
                </fieldset>
              ) : null}

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">{t("search.when")}</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label={t("search.anyTime")} active={!draftFilters.when} onClick={() => setDraftFilters((current) => ({ ...current, when: "" }))} />
                  {whenOptions.map((option) => <FilterOption key={option.value} label={option.label} active={draftFilters.when === option.value} onClick={() => setDraftFilters((current) => ({ ...current, when: current.when === option.value ? "" : option.value }))} />)}
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">{t("search.type")}</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label={t("search.allTypes")} active={!draftFilters.category} onClick={() => setDraftFilters((current) => ({ ...current, category: "" }))} />
                  {categoryOptions.map((option) => <FilterOption key={option.value} label={option.label} active={draftFilters.category === option.value} onClick={() => setDraftFilters((current) => ({ ...current, category: current.category === option.value ? "" : option.value }))} />)}
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">{t("search.priceRating")}</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label={t("search.free")} active={draftFilters.free} onClick={() => setDraftFilters((current) => ({ ...current, free: !current.free }))} />
                  {["4", "3"].map((rating) => <FilterOption key={rating} label={t("search.stars", { rating })} active={draftFilters.rating === rating} onClick={() => setDraftFilters((current) => ({ ...current, rating: current.rating === rating ? "" : rating }))} />)}
                </div>
              </fieldset>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#dce1dc] bg-[#fbfcf8] px-5 py-4 sm:px-7">
              <button type="button" onClick={() => setDraftFilters({ city: "", when: "", category: "", free: false, rating: "" })} className="min-h-12 rounded-full border border-[#cbd7cd] bg-white px-4 text-sm font-semibold text-[#3a5142] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]">{t("search.clearAll")}</button>
              <button type="button" onClick={applyDraftFilters} className="min-h-12 rounded-full bg-[#1d5a46] px-4 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]">{draftResultCount === 1 ? t("search.showResult") : t("search.showResults", { count: draftResultCount })}</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
