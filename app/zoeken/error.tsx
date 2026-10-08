"use client";

import SearchForm from "@/components/search/SearchForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { normalizeSearchQuery } from "@/lib/searchIntent";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();
  const params = new URLSearchParams(window.location.search);
  const query = normalizeSearchQuery(params.get("query") ?? params.get("q"));

  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#22312a]">
      <section className="search-hero">
        <div className="mx-auto max-w-[1180px] px-4 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7 lg:px-8 lg:pb-10 lg:pt-24">
          <div className="max-w-5xl">
            <h1 className="font-heading text-[clamp(2.3rem,4vw,3.75rem)] leading-[0.92] tracking-[-0.06em] text-[#22312a]">{t("search.title")}</h1>
            <div className="mt-5 max-w-4xl">
              <SearchForm initialQuery={query} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="search-empty-state max-w-2xl" role="alert" aria-labelledby="search-error-heading">
      
          <h2 id="search-error-heading" className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]">
            {t("search.errorTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746d] sm:text-base">
            {t("search.errorIntro")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d5a46] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#164a3a] focus-visible:ring-2 focus-visible:ring-[#005fcc]"
          >
            {t("common.retry")}
          </button>
        </div>
      </section>
    </main>
  );
}
