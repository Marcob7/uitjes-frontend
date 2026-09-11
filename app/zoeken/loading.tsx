"use client";

import { useSearchParams } from "next/navigation";

import SearchForm from "@/components/search/SearchForm";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export default function SearchLoading() {
  const searchParams = useSearchParams();
  const query = normalizeSearchQuery(searchParams.get("query") ?? searchParams.get("q"));

  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="mt-3 font-heading text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.84] tracking-[-0.07em] text-[#22312a]">Zoeken</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#68746d] sm:text-lg">Vind inspiratie, activiteiten en lokale tips die bij je passen.</p>
            <SearchForm initialQuery={query} className="mt-7 max-w-3xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div role="status" aria-live="polite" className="border-t border-[#dce1dc] pt-8 text-sm font-medium text-[#68746d]">
          {query ? `Zoeken naar “${query}”…` : "Zoeken…"}
        </div>
      </section>
    </main>
  );
}
