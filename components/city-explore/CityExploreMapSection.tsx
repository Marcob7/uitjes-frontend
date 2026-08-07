"use client";

import { useEffect, useState } from "react";

import ExploreMap from "./ExploreMap";
import type { BackendEvent, ExploreCard } from "./types";

type CityExploreMapSectionProps = {
  cityLabel: string;
  events: Array<BackendEvent | ExploreCard>;
  selectedId?: number | null;
  setSelectedId?: (id: number) => void;
  layout?: "section" | "embedded";
  fullHeight?: boolean;
};

export default function CityExploreMapSection({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
  layout = "section",
  fullHeight = false,
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
      events={events.map((event) => ({
        id: event.id,
        title: event.title,
        city: "city" in event ? event.city : cityLabel,
        venue: "venue" in event ? event.venue : event.location,
        start_at: "start_at" in event ? event.start_at : event.startAt ?? null,
        end_at: "end_at" in event ? event.end_at : event.endAt ?? null,
        date_text: null,
        is_ongoing: "is_ongoing" in event ? event.is_ongoing : Boolean(event.isOngoing),
        is_free: "is_free" in event ? event.is_free : event.price === "Gratis",
        price_min: null,
        source_url: null,
        latitude: event.latitude ?? null,
        longitude: event.longitude ?? null,
        category_label: "location" in event ? event.label : event.category_label,
        kind: event.kind ?? null,
        tags: event.tags,
      }))}
      selectedId={localSelectedId}
      setSelectedId={handleSelect}
      fullHeight={fullHeight}
    />
  );

  if (layout === "embedded") {
    return <section className={fullHeight ? "h-full" : undefined}>{map}</section>;
  }

  return (
    <section className="my-6">
      <div className=" mx-auto max-w-[1220px] px-6 pb-12 sm:px-8 lg:px-10 lg:pb-14">
        {map}
      </div>
    </section>
  );
}
