import type { Metadata } from "next";

import { AppButton, AppEmptyState, AppResultCard, AppSection } from "@/components/ui/app";
import EmptyStateSearchActions from "@/components/search/EmptyStateSearchActions";
import { getGeneralSearchResults } from "@/lib/search/searchResults";

export const runtime = "edge";

type SearchPageProps = {
  searchParams?: {
    query?: string;
  };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams?.query?.trim();

  if (query) {
    return {
      title: `Zoeken naar ${query} | Uitjes`,
      description: `Bekijk zoekresultaten voor ${query}.`,
      alternates: {
        canonical: "/zoeken",
      },
    };
  }

  return {
    title: "Zoeken | Uitjes",
    alternates: {
      canonical: "/zoeken",
    },
  };
}

function getResultCountLabel(count: number) {
  if (count === 1) return "1 resultaat gevonden";
  return `${count} resultaten gevonden`;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.query?.trim() ?? "";
  const results = await getGeneralSearchResults(query);
  const resultCountLabel = getResultCountLabel(results.length);

  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <AppSection maxWidth="wide" spacing="sm" innerClassName="pt-8 pb-10">
        <div className="rounded-[2.2rem] border border-[#e5dccf] bg-[#fffaf4] px-5 py-8 shadow-[0_20px_54px_rgba(69,50,27,0.08)] sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
            Zoekresultaten
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
            Resultaten voor {query ? `"${query}"` : "je zoekterm"}
          </h1>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#665d54] sm:text-base">
              We zoeken in bestaande inspiratie, activiteiten en lokale city-content.
              Steden en festivals blijven hun eigen route gebruiken.
            </p>
            <div className="inline-flex w-fit rounded-full border border-[#ded4c7] bg-white px-4 py-2 text-sm font-semibold text-[#4f463d]">
              {resultCountLabel}
            </div>
          </div>
        </div>
      </AppSection>

      <AppSection maxWidth="wide" spacing="md" innerClassName="pt-0 pb-16">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b7a69]">
              Resultaten
            </p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.05em] text-[#171511]">
              {query ? `Passend bij "${query}"` : "Vul een zoekterm in"}
            </h2>
          </div>
          <p className="text-sm font-medium text-[#665d54]">{resultCountLabel}</p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {results.map((result) => (
              <AppResultCard
                key={result.id}
                title={result.title}
                description={result.description}
                image={result.image}
                href={result.href}
                badge={result.badge}
                tags={result.tags}
                meta={result.meta}
                ctaLabel="Bekijk resultaat"
              />
            ))}
          </div>
        ) : (
          <AppEmptyState
            title={query ? `Geen resultaten voor "${query}"` : "Vul een zoekterm in"}
            description={
              query
                ? "Probeer een andere zoekterm of zoek op een stad."
                : "Zoek op een stad, activiteit of festival om resultaten te vinden."
            }
            className="mx-auto max-w-3xl"
          >
            <EmptyStateSearchActions initialQuery={query} />
          </AppEmptyState>
        )}

        {results.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <AppButton href="/ontdek" variant="dark">
              Kies een stad
            </AppButton>
            <AppButton href="/inspiratie" variant="dark">
              Bekijk inspiratie
            </AppButton>
            <AppButton href="/uitjes" variant="dark">
              Populaire categorieen
            </AppButton>
          </div>
        ) : null}
      </AppSection>
    </main>
  );
}
