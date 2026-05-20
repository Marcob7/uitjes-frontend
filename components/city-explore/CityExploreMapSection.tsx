"use client";

import ExploreMap from "./ExploreMap";
import type { BackendEvent } from "./types";

type CityExploreMapSectionProps = {
  cityLabel: string;
  events: BackendEvent[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
};

export default function CityExploreMapSection({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
}: CityExploreMapSectionProps) {
  return (
    <section className="my-6">
      <div className=" mx-auto max-w-[1220px] px-6 pb-12 sm:px-8 lg:px-10 lg:pb-14">
        <ExploreMap
          cityLabel={cityLabel}
          events={events}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>
    </section>
  );
}
