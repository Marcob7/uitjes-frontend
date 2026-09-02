"use client";

import SearchForm from "@/components/search/SearchForm";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const query = normalizeSearchQuery(new URLSearchParams(window.location.search).get("query"));

  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8">
          <div className="max-w-4xl">
            <span className="search-section-label">DOEN zoeken</span>
            <h1 className="mt-3 font-heading text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.84] tracking-[-0.07em] text-[#22312a]">Zoeken</h1>
            <div className="mt-7 max-w-3xl">
              <SearchForm initialQuery={query} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="search-empty-state max-w-2xl" role="alert" aria-labelledby="search-error-heading">
          <span className="search-section-label">Zoekresultaten</span>
          <h2 id="search-error-heading" className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">
            We kunnen de resultaten niet laden.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746d] sm:text-base">
            Er ging iets mis tijdens het zoeken. Probeer het nog een keer.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
          >
            Opnieuw proberen
          </button>
        </div>
      </section>
    </main>
  );
}
