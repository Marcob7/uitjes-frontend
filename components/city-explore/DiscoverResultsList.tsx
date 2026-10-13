"use client";

import ExploreCardItem from "./ExploreCardItem";
import type { ExploreCard } from "./types";

type DiscoverResultsListProps = {
  cards: ExploreCard[];
  selectedId: number | null;
  isLoading: boolean;
  onSelectCard: (id: number) => void;
  loadingLabel: string;
};

/** Presentational list for the existing /ontdek result-card family. */
export default function DiscoverResultsList({
  cards,
  selectedId,
  isLoading,
  onSelectCard,
  loadingLabel,
}: DiscoverResultsListProps) {
  if (isLoading) {
    return (
      <div className="border-y border-[#DCE1DC] py-10 text-sm leading-6 text-[#65736C]" role="status">
        {loadingLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-5 border-y border-[#DCE1DC] py-5 sm:grid-cols-2">
      {cards.map((card) => (
        <ExploreCardItem
          key={card.id}
          card={card}
          isSelected={selectedId === card.id}
          onSelect={() => onSelectCard(card.id)}
          variant="flow"
        />
      ))}
    </div>
  );
}
