import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import FeaturedNewsCard from "@/components/news/FeaturedNewsCard";
import NewsCard from "@/components/news/NewsCard";
import NewsCategoryFilters from "@/components/news/NewsCategoryFilters";
import { AppSection } from "@/components/ui/app";
import {
  getFeaturedNewsArticle,
  getNewsCategories,
  getNewsCategoryByQueryValue,
  getNewsArticles,
} from "@/lib/newsArticles";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Nieuws & inspiratie | Uitjes",
  description:
    "Lees verhalen, praktische gidsen en updates voor je volgende dagje uit in Nederland.",
  alternates: {
    canonical: "/nieuws",
  },
  openGraph: {
    title: "Nieuws & inspiratie | Uitjes",
    description:
      "Verhalen, praktische gidsen en updates voor je volgende dagje uit in Nederland.",
    url: "/nieuws",
    type: "website",
  },
};

type NewsOverviewPageProps = {
  searchParams?: {
    category?: string | string[];
  };
};

function readCategoryQuery(category?: string | string[]) {
  if (Array.isArray(category)) return category[0];
  return category;
}

export default function NewsOverviewPage({ searchParams }: NewsOverviewPageProps) {
  const rawCategory = readCategoryQuery(searchParams?.category);
  const activeCategory = getNewsCategoryByQueryValue(rawCategory);
  const hasUnknownCategory = Boolean(rawCategory && !activeCategory);
  const articles = hasUnknownCategory ? [] : getNewsArticles(activeCategory ?? undefined);
  const featuredArticle = hasUnknownCategory || activeCategory ? null : getFeaturedNewsArticle();
  const articleCards = featuredArticle
    ? articles.filter((article) => article.slug !== featuredArticle.slug)
    : articles;
  const categories = getNewsCategories();
  const activeCategoryLabel = activeCategory || rawCategory || "deze selectie";

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_92%_5%,rgba(221,235,226,0.7),transparent_27%),linear-gradient(180deg,#F6F7F2_0%,#F4F6F3_52%,#EEF3F0_100%)] pt-24 text-[#29342F] sm:pt-28">
      <AppSection maxWidth="default" spacing="sm" innerClassName="pt-6 pb-14 sm:pt-8 sm:pb-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Nieuws & inspiratie" }]} className="mb-8" />

        <header className="max-w-2xl">
          <h1 className="max-w-none text-[clamp(2.55rem,5vw,4.35rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#29342F]">
            Nieuws & inspiratie
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#65736C] sm:text-lg sm:leading-8">
            Ontdek verhalen, platformupdates en seizoensgebonden inspiratie voor jouw volgende uitje.
          </p>
        </header>

        {featuredArticle ? (
          <section className="mt-9 sm:mt-11" aria-label="Uitgelicht verhaal">
            <FeaturedNewsCard article={featuredArticle} />
          </section>
        ) : null}

        <section className="mt-10 sm:mt-12" aria-labelledby="news-overview-heading">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 id="news-overview-heading" className="text-[clamp(1.8rem,3.4vw,2.65rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#29342F]">
                {activeCategory ? activeCategory : "Voor onderweg, om de hoek en daartussenin"}
              </h2>
            </div>
            <NewsCategoryFilters categories={categories} activeCategory={activeCategory} />
          </div>

          {articles.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {articleCards.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[1.8rem] border border-[#D2E1D8] bg-white/75 px-6 py-10 text-center shadow-[0_14px_34px_rgba(41,52,47,0.06)] sm:px-10">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F2D0] text-xl text-[#315B43]" aria-hidden="true">
                ✦
              </span>
              <h3 className="mx-auto mt-4 max-w-[20ch] text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#29342F]">
                Nog geen verhalen in {activeCategoryLabel}
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#65736C]">
                Kies een andere categorie of bekijk alle verhalen voor meer ideeën en updates.
              </p>
              <Link
                href="/nieuws"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1D5A46] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(29,90,70,0.16)] transition hover:bg-[#174A39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
              >
                Alle artikelen tonen
              </Link>
            </div>
          )}
        </section>
      </AppSection>
    </main>
  );
}
