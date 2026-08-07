import type { Metadata } from "next";

import { AppButton, AppResultCard, AppSection } from "@/components/ui/app";
import SearchForm from "@/components/search/SearchForm";
import SearchRetryButton from "@/components/search/SearchRetryButton";
import { getGeneralSearchResults } from "@/lib/search/searchResults";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export const runtime = "edge";

type SearchPageProps = { searchParams?: { query?: string } };

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = normalizeSearchQuery(searchParams?.query);
  return query
    ? { title: `Zoeken naar ${query} | Uitjes`, description: `Bekijk zoekresultaten voor ${query}.`, alternates: { canonical: "/zoeken" } }
    : { title: "Zoeken | Uitjes", alternates: { canonical: "/zoeken" } };
}

function getResultCountLabel(count: number) {
  return count === 1 ? "1 resultaat" : `${count} resultaten`;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normalizeSearchQuery(searchParams?.query);
  const searchState = query
    ? await getGeneralSearchResults(query)
    : { status: "success" as const, results: [] };

  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-8 pb-8 sm:pt-12">
        <div className="max-w-4xl">
          <h1 className="text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">Zoeken</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">Vind inspiratie, activiteiten en lokale tips die bij je passen.</p>
          <div className="mt-6"><SearchForm initialQuery={query} showEmptyFeedback={!query} /></div>
        </div>
      </AppSection>

      {query ? (
        <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16">
          <section className="border-t border-[#ded5cb] pt-7 sm:pt-9" aria-labelledby="search-results-heading">
            {searchState.status === "error" ? (
              <div className="max-w-2xl py-3 sm:py-6" role="alert" aria-labelledby="search-error-heading">
                <h2 id="search-error-heading" className="text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight tracking-[-0.05em]">Zoeken lukt op dit moment niet.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#665d54] sm:text-base">Probeer het opnieuw.</p>
                <div className="mt-6"><SearchRetryButton /></div>
              </div>
            ) : searchState.results.length > 0 ? (
              <>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <h2 id="search-results-heading" className="max-w-[26ch] text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight tracking-[-0.05em]">Resultaten voor &quot;{query}&quot;</h2>
                  <p className="text-sm font-medium text-[#665d54]" aria-live="polite">{getResultCountLabel(searchState.results.length)}</p>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {searchState.results.map((result) => <AppResultCard key={result.id} {...result} ctaLabel="Bekijk resultaat" />)}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <AppButton href="/ontdek" variant="dark">Kies een stad</AppButton>
                  <AppButton href="/inspiratie" variant="dark">Bekijk inspiratie</AppButton>
                  <AppButton href="/uitjes" variant="dark">Populaire categorieën</AppButton>
                </div>
              </>
            ) : (
              <div className="max-w-2xl py-3 sm:py-6" aria-live="polite">
                <h2 id="search-results-heading" className="text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight tracking-[-0.05em]">Geen resultaten voor &quot;{query}&quot;</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#665d54] sm:text-base">Controleer de spelling, probeer een andere zoekterm of ontdek activiteiten per stad.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <AppButton href="/ontdek" variant="dark">Ontdek activiteiten</AppButton>
                  <AppButton href="/inspiratie" variant="outline">Bekijk inspiratie</AppButton>
                </div>
              </div>
            )}
          </section>
        </AppSection>
      ) : null}
    </main>
  );
}
