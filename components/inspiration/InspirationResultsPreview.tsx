"use client";

import ExploreCardItem from "@/components/city-explore/ExploreCardItem";
import { FullscreenChoiceResults } from "@/components/city-explore/FullscreenChoiceFlow";
import type { ExploreCard } from "@/components/city-explore/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type InspirationResultsPreviewProps = {
  cityLabel: string;
  previewCards: ExploreCard[];
  totalPreviewCount: number;
  isLoading: boolean;
  onEditChoices: () => void;
};

/** Renders the existing six-item maximum preview without owning result matching. */
export default function InspirationResultsPreview({
  cityLabel,
  previewCards,
  totalPreviewCount,
  isLoading,
  onEditChoices,
}: InspirationResultsPreviewProps) {
  const { t } = useLocale();
  const description = isLoading
    ? t("inspiration.loadingResults")
    : totalPreviewCount === 1
      ? t("inspiration.ideaInCity", { city: cityLabel })
      : t("inspiration.ideasInCity", { count: totalPreviewCount, city: cityLabel });

  return (
    <FullscreenChoiceResults description={description}>
      {isLoading ? (
        <p className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 text-sm leading-6 text-[#65736C] sm:text-base" role="status">
          {t("inspiration.loadingStatus")}
        </p>
      ) : previewCards.length ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {previewCards.map((card) => (
            <ExploreCardItem key={card.href} card={card} variant="flow" isSelected={false} onSelect={() => undefined} />
          ))}
        </div>
      ) : (
        <div className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 sm:py-10">
          <p className="text-lg font-semibold tracking-[-0.025em]">
            {t("inspiration.noMatch", { city: cityLabel })}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#65736C] sm:text-base">
            {t("inspiration.noMatchIntro")}
          </p>
          <button type="button" onClick={onEditChoices} className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[#DCE1DC] bg-white px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">
            {t("inspiration.editChoices")}
          </button>
        </div>
      )}
    </FullscreenChoiceResults>
  );
}
