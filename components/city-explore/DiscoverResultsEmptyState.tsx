"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type DiscoverResultsEmptyStateProps = {
  cityLabel: string;
  hasActiveFilters: boolean;
  chooseCityHref: string;
  onClearAllFilters: () => void;
};

export default function DiscoverResultsEmptyState({
  cityLabel,
  hasActiveFilters,
  chooseCityHref,
  onClearAllFilters,
}: DiscoverResultsEmptyStateProps) {
  const { t } = useLocale();

  return (
    <div className="mt-8 rounded-[2rem] border border-[#d5e1bd] bg-white/78 p-6 text-[#171511] shadow-[0_18px_42px_rgba(75,92,52,0.08)] backdrop-blur-xl sm:p-8">
      <h3 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#171511]">
        {hasActiveFilters
          ? t("discover.noResultsFiltered", { city: cityLabel })
          : t("discover.noResults", { city: cityLabel })}
      </h3>
      <p className="mt-3 max-w-[40rem] text-sm leading-7 text-[#665d54] sm:text-base">
        {hasActiveFilters
          ? t("discover.noResultsFilteredIntro", { city: cityLabel })
          : t("discover.noResultsIntro", { city: cityLabel })}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearAllFilters}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#cfe2a6] bg-[#e8f2d0] px-5 py-2.5 text-sm font-semibold text-[#162016] shadow-[0_12px_28px_rgba(109,144,51,0.12)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
          >
            {t("discover.allCityResults", { city: cityLabel })}
          </button>
        ) : null}
        <a
          href={chooseCityHref}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d6c9b8] bg-white/68 px-5 py-2.5 text-sm font-semibold text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:rounded-full"
        >
          {t("discover.chooseCity")}
        </a>
      </div>
    </div>
  );
}
