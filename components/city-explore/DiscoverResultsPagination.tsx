"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type DiscoverResultsPaginationProps = {
  visibleResultCount: number;
  totalResultCount: number;
  hasMoreResults: boolean;
  onShowMore: () => void;
};

export default function DiscoverResultsPagination({
  visibleResultCount,
  totalResultCount,
  hasMoreResults,
  onShowMore,
}: DiscoverResultsPaginationProps) {
  const { t } = useLocale();

  return (
    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-[#786d63]">
        {t("discover.visibleCount", { visible: visibleResultCount, total: totalResultCount })}
      </p>
      {hasMoreResults ? (
        <button
          type="button"
          onClick={onShowMore}
          className="inline-flex w-full items-center justify-center rounded-full border border-[#d6c9b8] bg-white/68 px-4 py-2.5 text-sm font-medium text-[#4b3a28] shadow-[0_12px_28px_rgba(83,65,45,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8aa449] sm:w-auto"
        >
          {t("discover.showMore")}
        </button>
      ) : (
        <p className="text-sm font-medium text-[#786d63]">
          {t("discover.allShown")}
        </p>
      )}
    </div>
  );
}
