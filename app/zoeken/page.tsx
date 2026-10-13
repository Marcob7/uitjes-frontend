import type { Metadata } from "next";
import Link from "next/link";

import SearchForm from "@/components/search/SearchForm";
import SearchResultsExperience from "@/components/search/SearchResultsExperience";
import { getGeneralSearchResults } from "@/lib/search/searchResults";
import { normalizeSearchQuery } from "@/lib/searchIntent";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";
import { localePathname } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/messages";

export const runtime = "edge";

type SearchPageProps = {
  searchParams?: {
    query?: string;
    q?: string;
  };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const query = normalizeSearchQuery(searchParams?.query ?? searchParams?.q);
  const title = query
    ? `${translate(locale, "search.title")} ${query} | Uitjes`
    : `${translate(locale, "search.title")} | Uitjes`;
  const description = translate(locale, "search.intro");

  return {
    title,
    description,
    alternates: getLocaleAlternates(pathname, locale),
    openGraph: { title, description, ...getLocaleOpenGraph(locale, pathname) },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = getRequestLocale();
  const t = (key: string, values?: Record<string, string | number>) => translate(locale, key, values);
  const query = normalizeSearchQuery(searchParams?.query ?? searchParams?.q);
  const popularSearches = [
    { label: t("search.popularToday"), query: "vandaag" },
    { label: t("search.popularWeekend"), query: "weekend" },
    { label: t("search.popularChildren"), query: "kinderen" },
    { label: t("search.popularFree"), query: "gratis" },
    { label: t("search.popularOutdoor"), query: "buiten" },
  ];
  const discoveryLinks = [
    { eyebrow: t("search.linkTodayEyebrow"), title: t("search.linkTodayTitle"), description: t("search.linkTodayDescription"), href: `${localePathname("/zoeken", locale)}?query=vandaag&when=today` },
    { eyebrow: t("search.linkFamilyEyebrow"), title: t("search.linkFamilyTitle"), description: t("search.linkFamilyDescription"), href: `${localePathname("/zoeken", locale)}?query=kinderen&category=met-kinderen` },
    { eyebrow: t("search.linkCityEyebrow"), title: t("search.linkCityTitle"), description: t("search.linkCityDescription"), href: localePathname("/ontdek", locale) },
  ];
  const searchState = query
    ? await getGeneralSearchResults(query)
    : { status: "empty" as const, results: [] };
  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero" data-navbar-contrast="on-light">
        <div className="mx-auto max-w-[1214px] px-4 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7 lg:px-8 lg:pb-10 lg:pt-24">
          <div className="max-w-5xl">
            <h1 className="font-heading text-[clamp(2.3rem,4vw,3.75rem)] leading-[0.92] tracking-[-0.06em] text-[#22312a]">
              {t("search.title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68746d] sm:text-base">
              {t("search.intro")}
            </p>

            <SearchForm
              initialQuery={query}
              className="mt-5 max-w-4xl"
            />

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#68746d]">
              <span className="font-semibold text-[#3d5146]">{t("search.popular")}</span>
              {popularSearches.map((item) => (
                <Link
                  key={item.query}
                  href={`${localePathname("/zoeken", locale)}?query=${encodeURIComponent(item.query)}`}
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
          results={searchState.status === "success" || searchState.status === "partial" ? searchState.results : []}
          error={searchState.status === "error"}
          partial={searchState.status === "partial"}
        />
      ) : (
        <section className="mx-auto max-w-[1214px] px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8">
          <div className="border-t border-[#dce1dc] pt-7 sm:pt-9">
            <div className="max-w-2xl">
    
              <h2 className="mt-3 font-heading text-[clamp(2.25rem,4.5vw,3.7rem)] leading-[0.94] tracking-[-0.06em] text-[#22312a]">
                {t("search.startingPoint")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#68746d] sm:text-base">
                {t("search.startingPointIntro")}
              </p>
            </div>

            <div className="mt-8 grid divide-y divide-[#dce1dc] md:grid-cols-3 md:divide-x md:divide-y-0">
              {discoveryLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group py-6 transition duration-300 first:pt-0 hover:pl-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] md:px-6 md:py-0 md:first:pl-0 md:hover:pl-8"
                >
                
                  <h3 className="mt-3 font-heading text-[clamp(1.65rem,3vw,2.2rem)] leading-none tracking-[-0.05em] text-[#22312a]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[28ch] text-sm leading-6 text-[#68746d]">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5a46]">
                    {t("search.discoverMore")}
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
