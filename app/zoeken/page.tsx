import type { Metadata } from "next";
import Link from "next/link";

import SearchForm from "@/components/search/SearchForm";
import SearchResultsExperience from "@/components/search/SearchResultsExperience";
import { getGeneralSearchResults } from "@/lib/search/searchResults";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export const runtime = "edge";

type SearchPageProps = {
  searchParams?: {
    query?: string;
  };
};

const popularSearches = [
  { label: "vandaag", query: "vandaag" },
  { label: "dit weekend", query: "weekend" },
  { label: "met kinderen", query: "kinderen" },
  { label: "gratis", query: "gratis" },
  { label: "buiten", query: "buiten" },
];

const discoveryLinks = [
  {
    eyebrow: "Vandaag",
    title: "Spontaan op pad",
    description: "Vind iets leuks voor vandaag, dichtbij huis.",
    href: "/zoeken?query=vandaag&when=today",
  },
  {
    eyebrow: "Voor samen",
    title: "Met kinderen",
    description: "Ideeën voor een vrije middag of een heel weekend.",
    href: "/zoeken?query=kinderen&category=met-kinderen",
  },
  {
    eyebrow: "Op ontdekking",
    title: "Kies een stad",
    description: "Bekijk lokale tips en uitjes per stad.",
    href: "/ontdek",
  },
];

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = normalizeSearchQuery(searchParams?.query);

  return query
    ? {
        title: `Zoeken naar ${query} | Uitjes`,
        description: `Bekijk zoekresultaten voor ${query}.`,
        alternates: { canonical: "/zoeken" },
      }
    : {
        title: "Zoeken | Uitjes",
        description: "Vind inspiratie, activiteiten en lokale tips die bij je passen.",
        alternates: { canonical: "/zoeken" },
      };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = normalizeSearchQuery(searchParams?.query);
  const searchState = query
    ? await getGeneralSearchResults(query)
    : { status: "success" as const, results: [] };

  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero" data-navbar-contrast="on-light">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8 lg:pb-14">
          <div className="max-w-4xl">
            <span className="search-section-label">DOEN zoeken</span>
            <h1 className="mt-3 max-w-[10ch] font-heading text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.84] tracking-[-0.07em] text-[#22312a]">
              Zoeken
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#68746d] sm:text-lg">
              Vind inspiratie, activiteiten en lokale tips die bij je passen.
            </p>

            <SearchForm
              initialQuery={query}
              showEmptyFeedback={!query}
              className="mt-7 max-w-3xl"
            />

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#68746d]">
              <span className="font-semibold text-[#3d5146]">Populair:</span>
              {popularSearches.map((item) => (
                <Link
                  key={item.query}
                  href={`/zoeken?query=${encodeURIComponent(item.query)}`}
                  className="rounded-full border border-[#d7e0d7] bg-white/75 px-3 py-1.5 transition hover:border-[#1d5a46] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {query ? (
        <SearchResultsExperience
          query={query}
          results={searchState.status === "success" ? searchState.results : []}
          error={searchState.status === "error"}
        />
      ) : (
        <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8">
          <div className="border-t border-[#dce1dc] pt-7 sm:pt-9">
            <div className="max-w-2xl">
              <span className="search-section-label">Begin hier</span>
              <h2 className="mt-3 font-heading text-[clamp(2.25rem,4.5vw,3.7rem)] leading-[0.94] tracking-[-0.06em] text-[#22312a]">
                Waar heb je zin in?
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#68746d] sm:text-base">
                Zoek op een activiteit, stad of moment. Of kies een vertrekpunt hieronder.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {discoveryLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[1.45rem] border border-[#dce1dc] bg-white p-5 shadow-[0_12px_30px_rgba(33,54,43,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b8d2bd] hover:shadow-[0_18px_36px_rgba(33,54,43,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] sm:p-6"
                >
                  <span className="search-section-label text-[#52725e]">{item.eyebrow}</span>
                  <h3 className="mt-3 font-heading text-[clamp(1.65rem,3vw,2.2rem)] leading-none tracking-[-0.05em] text-[#22312a]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[28ch] text-sm leading-6 text-[#68746d]">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5a46]">
                    Ontdek meer
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
