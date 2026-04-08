"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { BackendEvent } from "./types";

type ExploreMapProps = {
  cityLabel: string;
  events: BackendEvent[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
};

export default function ExploreMap({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
}: ExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<number, maplibregl.Marker>>({});

  const placesWithCoordinates = useMemo(
    () =>
      events.filter(
        (place) =>
          typeof place.latitude === "number" &&
          typeof place.longitude === "number"
      ),
    [events]
  );

  useEffect(() => {
    if (
      !mapContainerRef.current ||
      mapRef.current ||
      placesWithCoordinates.length === 0
    ) {
      return;
    }

    const firstPlace = placesWithCoordinates[0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [firstPlace.longitude as number, firstPlace.latitude as number],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, [placesWithCoordinates]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    placesWithCoordinates.forEach((place) => {
      const markerElement = document.createElement("div");

      markerElement.className =
        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-sm font-bold text-white shadow-md";
      markerElement.textContent = String(place.id);

      const marker = new maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([place.longitude as number, place.latitude as number])
        .addTo(map);

      markerElement.addEventListener("click", () => {
        setSelectedId(place.id);
      });

      markersRef.current[place.id] = marker;
    });
  }, [placesWithCoordinates, setSelectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const selectedPlace = placesWithCoordinates.find(
      (place) => place.id === selectedId
    );

    if (
      selectedPlace &&
      typeof selectedPlace.latitude === "number" &&
      typeof selectedPlace.longitude === "number"
    ) {
      map.flyTo({
        center: [selectedPlace.longitude, selectedPlace.latitude],
        zoom: 15,
        essential: true,
      });
    }

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement();

      if (Number(id) === selectedId) {
        markerEl.className =
          "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-sm font-bold text-slate-900 shadow-lg";
      } else {
        markerEl.className =
          "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-sm font-bold text-white shadow-md";
      }
    });
  }, [selectedId, placesWithCoordinates]);

  if (placesWithCoordinates.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
        <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] bg-[#eef2ef] p-6 text-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Kaart komt later voor {cityLabel}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Voor deze stad zijn nog geen coordinaten beschikbaar. Voorlopig
              richten we eerst de layout netjes in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div
        ref={mapContainerRef}
        className="h-[420px] w-full rounded-[1.5rem]"
      />
    </div>
  );
}