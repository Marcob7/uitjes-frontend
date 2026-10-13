"use client";

import CityExploreMapSection from "./CityExploreMapSection";
import type { ExploreCard } from "./types";

type DiscoverResultsMapProps = {
  cityLabel: string;
  cards: ExploreCard[];
  selectedId: number | null;
  onSelectCard: (id: number) => void;
};

/** Desktop map adapter; selection ownership remains with the results flow. */
export default function DiscoverResultsMap({
  cityLabel,
  cards,
  selectedId,
  onSelectCard,
}: DiscoverResultsMapProps) {
  return (
    <CityExploreMapSection
      cityLabel={cityLabel}
      events={cards}
      selectedId={selectedId}
      setSelectedId={onSelectCard}
      layout="embedded"
      fullHeight
    />
  );
}
