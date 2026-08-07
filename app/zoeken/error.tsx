"use client";

import { AppButton, AppSection } from "@/components/ui/app";
import SearchForm from "@/components/search/SearchForm";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const query = normalizeSearchQuery(new URLSearchParams(window.location.search).get("query"));
  return <main className="min-h-screen bg-[#f8f5f3] text-[#171511]"><AppSection maxWidth="wide" spacing="sm" innerClassName="pt-8 pb-8 sm:pt-12"><div className="max-w-4xl"><h1 className="text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">Zoeken</h1><div className="mt-6"><SearchForm initialQuery={query} /></div></div></AppSection><AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16"><section className="border-t border-[#ded5cb] py-8 sm:py-10" role="alert" aria-labelledby="search-error-heading"><h2 id="search-error-heading" className="text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight tracking-[-0.05em]">Zoeken lukt op dit moment niet.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#665d54] sm:text-base">Probeer het opnieuw.</p><div className="mt-6"><AppButton type="button" variant="dark" onClick={reset}>Opnieuw proberen</AppButton></div></section></AppSection></main>;
}
