"use client";

import DiscoverResultsMap from "./DiscoverResultsMap";
import type { ExploreCard } from "./types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type DiscoverResultsMobileMapDialogProps = {
  open: boolean;
  cityLabel: string;
  cards: ExploreCard[];
  selectedId: number | null;
  onSelectCard: (id: number) => void;
  onBackToList: () => void;
};

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export default function DiscoverResultsMobileMapDialog({
  open,
  cityLabel,
  cards,
  selectedId,
  onSelectCard,
  onBackToList,
}: DiscoverResultsMobileMapDialogProps) {
  const { t } = useLocale();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1200] bg-[#F6F5F0] px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t("discover.mapOf", { city: cityLabel })}
    >
      <div className="mb-3 flex flex-col items-start gap-4 px-1">
        <button
          type="button"
          onClick={onBackToList}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#B7C7BE] bg-[#FFFEFA] px-4 py-2.5 text-sm font-bold text-[#1D5A46] shadow-[0_8px_20px_rgba(29,90,70,0.18)] transition hover:bg-[#F1F7F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          <span>{t("discover.backToList")}</span>
        </button>
        <h2 className="px-1 text-sm font-semibold text-[#526159]">
          {t("discover.onMap", { city: cityLabel })}
        </h2>
      </div>
      <div className="h-[calc(100dvh-7.25rem-max(0px,env(safe-area-inset-top)))]">
        <DiscoverResultsMap
          cityLabel={cityLabel}
          cards={cards}
          selectedId={selectedId}
          onSelectCard={onSelectCard}
        />
      </div>
    </div>
  );
}
