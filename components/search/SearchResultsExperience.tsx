"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import SavePlaceButton from "@/components/SavePlaceButton";
import SearchRetryButton from "@/components/search/SearchRetryButton";
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

const SHORTCUTS = [
  { label: "Vandaag", href: "/zoeken?query=vandaag&when=today" },
  { label: "Dit weekend", href: "/zoeken?query=weekend&when=weekend" },
  { label: "Gratis", href: "/zoeken?query=gratis&free=1" },
  { label: "Met kinderen", href: "/zoeken?query=kinderen&category=met-kinderen" },
  { label: "Buiten", href: "/zoeken?query=buiten&category=buiten" },
  { label: "In de buurt", href: "/ontdek" },
];

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("nl-NL")
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

function getCategoryLabel(value: string) {
  return CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function getWhenLabel(value: string) {
  return WHEN_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function formatReviewCount(value: number) {
  return new Intl.NumberFormat("nl-NL").format(value);
}

function formatPriceLabel(value?: string) {
  if (!value) return null;
  return value.replace(/^EUR\s?/i, "€ ");
}

function getFallbackBackground(index: number) {
  const backgrounds = [
    "radial-gradient(circle at 72% 20%, rgba(208, 226, 191, .92), transparent 38%), linear-gradient(140deg, #eef3e9, #d8e7d8)",
    "radial-gradient(circle at 18% 22%, rgba(222, 213, 182, .85), transparent 38%), linear-gradient(140deg, #f4eee2, #dce5dd)",
    "radial-gradient(circle at 70% 12%, rgba(180, 211, 220, .82), transparent 38%), linear-gradient(140deg, #e8f1ed, #d6e1e7)",
  ];

  return backgrounds[index % backgrounds.length];
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

function SearchResultImage({ result, index }: { result: GeneralSearchResult; index: number }) {
  const [imageFailed, setImageFailed] = useState(!result.image);

  return (
    <div className="search-result-image relative aspect-[1.28] overflow-hidden bg-[#e8eee7]" style={{ background: getFallbackBackground(index) }}>
      {!imageFailed && result.image ? (
        <img
          src={result.image}
          alt={result.imageAlt ?? ""}
          loading={index < 3 ? "eager" : "lazy"}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end p-4 sm:p-5">
          <span className="font-heading text-[clamp(2.8rem,6vw,4.4rem)] leading-none tracking-[-0.08em] text-[#1d5a46]/35">
            {result.city.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15291f]/18 via-transparent to-white/10" />
    </div>
  );
}

function SearchResultCard({ result, index }: { result: GeneralSearchResult; index: number }) {
  const priceLabel = formatPriceLabel(result.priceLabel);

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.45rem] border border-[#dce1dc] bg-white shadow-[0_12px_30px_rgba(33,54,43,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(33,54,43,0.1)]">
      <Link href={result.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-[-2px]">
        <SearchResultImage result={result} index={index} />
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex max-w-full items-center rounded-full bg-[#e2eee2] px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.13em] text-[#1d5a46]">
                <span className="truncate">{result.badge}</span>
              </span>
              <h3 className="mt-3 line-clamp-2 text-[1.22rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#22312a] sm:text-[1.34rem]">
                {result.title}
              </h3>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[0.78rem] text-[#68746d]">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
              <path d="M8 14s4-3.7 4-7.2a4 4 0 1 0-8 0C4 10.3 8 14 8 14Z" stroke="currentColor" strokeWidth="1.25" />
              <circle cx="8" cy="6.8" r="1.35" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            <span className="truncate">{result.location || result.city}</span>
          </div>

          <div className="mt-4 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-[#53645a]">
            {result.ratingValue ? (
              <span className="inline-flex items-center gap-1 font-semibold text-[#334d3d]">
                <span className="text-[#b77929]" aria-hidden="true">★</span>
                {result.ratingValue.toFixed(1).replace(".", ",")}
                {typeof result.reviewCount === "number" ? <span className="font-normal text-[#7b847e]">({formatReviewCount(result.reviewCount)})</span> : null}
              </span>
            ) : null}
            {priceLabel ? <span className="font-semibold text-[#334d3d]">{priceLabel}</span> : null}
            {result.dateLabel ? <span>{result.dateLabel}</span> : null}
          </div>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5a46]">
            Bekijk uitje
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>

      <SavePlaceButton
        item={{ id: result.id, title: result.title, href: result.href, meta: result.location, image: result.image }}
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#33493b] shadow-[0_6px_18px_rgba(29,52,39,0.1)] backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
        savedClassName="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1d5a46] bg-[#1d5a46] text-white shadow-[0_6px_18px_rgba(29,52,39,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
        savedChildren={<><HeartIcon filled /><span className="sr-only">Verwijder uit bewaard</span></>}
      >
        <HeartIcon />
        <span className="sr-only">Bewaar {result.title}</span>
      </SavePlaceButton>
    </article>
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

export default function SearchResultsExperience({ query, results, error = false }: SearchResultsExperienceProps) {
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

  const cityOptions = useMemo(() => {
    const cities = new Map<string, string>();
    results.forEach((result) => {
      if (result.citySlug) cities.set(result.citySlug, result.city);
    });
    return [...cities.entries()].sort((a, b) => a[1].localeCompare(b[1], "nl"));
  }, [results]);

  const activeFilters = useMemo(() => {
    const active: Array<{ key: FilterKey; label: string }> = [];
    if (filters.city) active.push({ key: "city", label: getCityLabel(filters.city, results) });
    if (filters.when) active.push({ key: "when", label: getWhenLabel(filters.when) });
    if (filters.category) active.push({ key: "category", label: getCategoryLabel(filters.category) });
    if (filters.free) active.push({ key: "free", label: "Gratis" });
    if (filters.rating) active.push({ key: "rating", label: `${filters.rating}+ sterren` });
    return active;
  }, [filters, results]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => matchesFilterState(result, filters));
  }, [filters, results]);

  const sortedResults = useMemo(() => {
    const next = [...filteredResults];
    if (sort === "rating") {
      next.sort((a, b) => (b.ratingValue ?? -1) - (a.ratingValue ?? -1) || a.title.localeCompare(b.title, "nl"));
    } else if (sort === "price") {
      next.sort((a, b) => (a.priceMin ?? Number.POSITIVE_INFINITY) - (b.priceMin ?? Number.POSITIVE_INFINITY) || a.title.localeCompare(b.title, "nl"));
    } else if (sort === "recent") {
      next.sort((a, b) => {
        const aTime = a.startAt ? new Date(a.startAt).getTime() : 0;
        const bTime = b.startAt ? new Date(b.startAt).getTime() : 0;
        return bTime - aTime || a.title.localeCompare(b.title, "nl");
      });
    }
    return next;
  }, [filteredResults, sort]);

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
    startTransition(() => router.replace(queryString ? `/zoeken?${queryString}` : "/zoeken", { scroll: false }));
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
      <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 lg:px-8" aria-labelledby="search-error-heading">
        <div className="search-empty-state max-w-2xl" role="alert">
          <span className="search-section-label">Zoekresultaten</span>
          <h2 id="search-error-heading" className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">We kunnen de resultaten niet laden.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746d] sm:text-base">Er ging iets mis tijdens het zoeken. Probeer het nog een keer.</p>
          <div className="mt-6"><SearchRetryButton /></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-3 sm:px-6 sm:pt-5 lg:px-8" aria-labelledby="search-results-heading">
      <div className="search-results-toolbar border-y border-[#dce1dc] py-5 sm:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="search-section-label">Zoekresultaten</span>
            <h2 id="search-results-heading" className="mt-2 font-heading text-[clamp(1.8rem,3.5vw,2.75rem)] leading-[1] tracking-[-0.055em] text-[#22312a]">
              {filteredResults.length} {filteredResults.length === 1 ? "resultaat" : "resultaten"} <span className="text-[#68746d]">voor “{query}”</span>
            </h2>
          </div>

          <label className="relative flex min-h-11 shrink-0 items-center gap-3 text-sm text-[#68746d]">
            <span className="whitespace-nowrap">Sorteren op</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(event) => updateUrl({}, event.target.value as SortOption)}
                className="min-h-11 min-w-[10.5rem] appearance-none rounded-full border border-[#d4ddd5] bg-white py-2 pl-4 pr-10 text-sm font-semibold text-[#31483a] outline-none transition hover:border-[#9eb9a5] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
                aria-label="Sorteren op"
              >
                <option value="match">Beste match</option>
                <option value="rating">Hoogst beoordeeld</option>
                <option value="price">Prijs laag naar hoog</option>
                <option value="recent">Nieuw / recent</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#53645a]"><ChevronDownIcon /></span>
            </span>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="search-active-filters flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0" aria-label="Actieve filters">
            {activeFilters.length > 0 ? activeFilters.map((filter) => (
              <button
                key={`${filter.key}-${filter.label}`}
                type="button"
                onClick={() => removeFilter(filter.key)}
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-[#b8d2bd] bg-[#e6f0e5] px-3.5 text-sm font-medium text-[#26563f] outline-none transition hover:border-[#1d5a46] hover:bg-[#dcebdc] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
              >
                {filter.label}
                <span className="text-base leading-none text-[#557565]" aria-hidden="true">×</span>
                <span className="sr-only">Verwijder filter {filter.label}</span>
              </button>
            )) : <span className="text-sm text-[#7a857d]">Verfijn je zoekopdracht met filters.</span>}
          </div>

          <button
            ref={filterButtonRef}
            type="button"
            onClick={() => { setDraftFilters(filters); setSheetOpen(true); }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#1d5a46] bg-[#1d5a46] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(29,90,70,0.12)] outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
              <path d="M2.5 4.25h11M4.5 8h7m-5 3.75h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Filters
            {hasAnyFilters ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dcebdc] px-1 text-[0.68rem] text-[#1d5a46]">{activeFilters.length}</span> : null}
          </button>
        </div>
      </div>

      {sortedResults.length > 0 ? (
        <>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                {isPending ? "Laden…" : "Meer resultaten laden"}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="search-empty-state mt-7" aria-live="polite">
          <span className="search-empty-mark" aria-hidden="true">⌕</span>
          <div className="max-w-2xl">
            <span className="search-section-label">Geen match</span>
            <h3 className="mt-3 font-heading text-[clamp(2rem,4vw,3.1rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">Geen resultaten gevonden</h3>
            <p className="mt-3 text-sm leading-6 text-[#68746d] sm:text-base">Probeer je zoekopdracht iets ruimer te maken of verwijder een filter.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {hasAnyFilters ? <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]">Wis filters</button> : null}
              <button type="button" onClick={() => document.getElementById("site-search")?.focus()} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b5c4b8] bg-white px-5 text-sm font-semibold text-[#1d5a46] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]">Zoek opnieuw</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-14 grid gap-4 rounded-[1.7rem] border border-[#cbdacc] bg-[#e7f0e4] p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8">
        <div>
          <span className="search-section-label text-[#52725e]">Nog aan het rondkijken?</span>
          <h3 className="mt-3 max-w-[22ch] font-heading text-[clamp(1.75rem,3vw,2.55rem)] leading-[1] tracking-[-0.05em] text-[#1e3e2e]">Nog niet gevonden waar je zin in hebt?</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#4e6858]">Laat ons je helpen iets passends te vinden.</p>
        </div>
        <Link href="/inspiratie" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:-translate-y-0.5 hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7f0e4]">Laat je inspireren <span aria-hidden="true">→</span></Link>
      </div>

      <div className="mt-14 border-t border-[#dce1dc] pt-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="search-section-label">Snelle routes</span>
            <h3 className="mt-2 font-heading text-[clamp(1.75rem,3vw,2.45rem)] leading-none tracking-[-0.05em] text-[#22312a]">Verder ontdekken</h3>
          </div>
          <p className="text-sm text-[#7a857d]">Een ander vertrekpunt nodig?</p>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {SHORTCUTS.map((shortcut) => (
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
                <span className="search-section-label">Verfijnen</span>
                <h2 id="filter-sheet-title" className="mt-2 font-heading text-3xl leading-none tracking-[-0.05em] text-[#22312a]">Filters</h2>
                <p className="mt-2 text-sm text-[#68746d]">Maak de selectie passend bij je plan.</p>
              </div>
              <button ref={closeButtonRef} type="button" onClick={() => setSheetOpen(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d1dbd2] bg-white text-[#33483b] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]" aria-label="Sluit filters"><CloseIcon /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {cityOptions.length > 0 ? (
                <fieldset>
                  <legend className="text-sm font-semibold text-[#26392d]">Locatie</legend>
                  <div className="mt-3 grid gap-2">
                    <FilterOption label="Alle locaties" active={!draftFilters.city} onClick={() => setDraftFilters((current) => ({ ...current, city: "" }))} />
                    {cityOptions.slice(0, 8).map(([value, label]) => <FilterOption key={value} label={label} active={draftFilters.city === value} onClick={() => setDraftFilters((current) => ({ ...current, city: current.city === value ? "" : value }))} />)}
                  </div>
                </fieldset>
              ) : null}

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">Wanneer</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label="Elk moment" active={!draftFilters.when} onClick={() => setDraftFilters((current) => ({ ...current, when: "" }))} />
                  {WHEN_OPTIONS.map((option) => <FilterOption key={option.value} label={option.label} active={draftFilters.when === option.value} onClick={() => setDraftFilters((current) => ({ ...current, when: current.when === option.value ? "" : option.value }))} />)}
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">Type uitje</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label="Alle types" active={!draftFilters.category} onClick={() => setDraftFilters((current) => ({ ...current, category: "" }))} />
                  {CATEGORY_OPTIONS.map((option) => <FilterOption key={option.value} label={option.label} active={draftFilters.category === option.value} onClick={() => setDraftFilters((current) => ({ ...current, category: current.category === option.value ? "" : option.value }))} />)}
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-[#dce1dc] pt-6">
                <legend className="text-sm font-semibold text-[#26392d]">Prijs & beoordeling</legend>
                <div className="mt-3 grid gap-2">
                  <FilterOption label="Gratis" active={draftFilters.free} onClick={() => setDraftFilters((current) => ({ ...current, free: !current.free }))} />
                  {["4", "3"].map((rating) => <FilterOption key={rating} label={`${rating}+ sterren`} active={draftFilters.rating === rating} onClick={() => setDraftFilters((current) => ({ ...current, rating: current.rating === rating ? "" : rating }))} />)}
                </div>
              </fieldset>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#dce1dc] bg-[#fbfcf8] px-5 py-4 sm:px-7">
              <button type="button" onClick={() => setDraftFilters({ city: "", when: "", category: "", free: false, rating: "" })} className="min-h-12 rounded-full border border-[#cbd7cd] bg-white px-4 text-sm font-semibold text-[#3a5142] outline-none transition hover:border-[#1d5a46] focus-visible:ring-2 focus-visible:ring-[#005fcc]">Wis alles</button>
              <button type="button" onClick={applyDraftFilters} className="min-h-12 rounded-full bg-[#1d5a46] px-4 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]">Toon {draftResultCount} {draftResultCount === 1 ? "resultaat" : "resultaten"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
