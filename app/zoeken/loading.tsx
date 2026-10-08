"use client";

import { useSearchParams } from "next/navigation";

import SearchForm from "@/components/search/SearchForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export default function SearchLoading() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const query = normalizeSearchQuery(searchParams.get("query") ?? searchParams.get("q"));

  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero">
        <div className="mx-auto max-w-[1180px] px-4 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7 lg:px-8 lg:pb-10 lg:pt-24">
          <div className="max-w-5xl">
            <h1 className="font-heading text-[clamp(2.3rem,4vw,3.75rem)] leading-[0.92] tracking-[-0.06em] text-[#22312a]">{t("search.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68746d] sm:text-base">{t("search.intro")}</p>
            <SearchForm initialQuery={query} className="mt-5 max-w-4xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div role="status" aria-live="polite" className="rounded-[1.45rem] border border-[#d7e2d8] bg-[#fdfefd] p-5 shadow-[0_14px_34px_rgba(33,54,43,0.045)] sm:p-6">
          <p className="text-sm font-semibold text-[#31483a]">{query ? `${t("search.title")} “${query}”…` : t("search.pending")}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => <span key={item} className="h-32 animate-pulse rounded-[1.25rem] bg-[#eaf0e9]" />)}
          </div>
        </div>
      </section>
    </main>
  );
}
