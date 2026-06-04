"use client";

import { useEffect, useState } from "react";

import ExploreMap from "./ExploreMap";
import type { BackendEvent } from "./types";

type CityExploreMapSectionProps = {
  cityLabel: string;
  events: BackendEvent[];
  selectedId?: number | null;
  setSelectedId?: (id: number) => void;
  layout?: "section" | "embedded";
};

export default function CityExploreMapSection({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
  layout = "section",
}: CityExploreMapSectionProps) {
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(
    selectedId ?? events[0]?.id ?? null
  );

  useEffect(() => {
    if (typeof selectedId !== "undefined") {
      setLocalSelectedId(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!events.some((event) => event.id === localSelectedId)) {
      setLocalSelectedId(events[0]?.id ?? null);
    }
  }, [events, localSelectedId]);

  function handleSelect(id: number) {
    setLocalSelectedId(id);
    setSelectedId?.(id);
  }

  const map = (
    <ExploreMap
      cityLabel={cityLabel}
      events={events}
      selectedId={localSelectedId}
      setSelectedId={handleSelect}
    />
  );

  if (layout === "embedded") {
    return <section>{map}</section>;
  }

  return (
    <section className="my-6">
      <div className=" mx-auto max-w-[1220px] px-6 pb-12 sm:px-8 lg:px-10 lg:pb-14">
        {map}
      </div>
    </section>
  );
}
