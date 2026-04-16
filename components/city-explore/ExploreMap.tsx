"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { BackendEvent } from "./types";

type ExploreMapProps = {
  cityLabel: string;
  events: BackendEvent[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
};

type MapPlace = BackendEvent & {
  latitude: number;
  longitude: number;
  isDummyLocation: boolean;
};

type MarkerKind = "fork" | "drink" | "spot";

const CITY_CENTERS: Record<string, [number, number]> = {
  apeldoorn: [5.9699, 52.2118],
  amsterdam: [4.9041, 52.3676],
  rotterdam: [4.4777, 51.9244],
  utrecht: [5.1214, 52.0907],
  haarlem: [4.6462, 52.3874],
  deventer: [6.1639, 52.255],
  zwolle: [6.0944, 52.5168],
  "den-haag": [4.3007, 52.0705],
  groningen: [6.5665, 53.2194],
  eindhoven: [5.4697, 51.4416],
};

function normalizeCityKey(cityLabel: string) {
  return cityLabel.trim().toLowerCase().replace(/\s+/g, "-");
}

function getCityCenter(cityLabel: string): [number, number] {
  const key = normalizeCityKey(cityLabel);
  return CITY_CENTERS[key] || [5.1214, 52.0907];
}

function createDummyCoordinates(
  cityLabel: string,
  index: number
): { longitude: number; latitude: number } {
  const [baseLng, baseLat] = getCityCenter(cityLabel);

  const offsets = [
    { lng: 0, lat: 0 },
    { lng: 0.012, lat: 0.006 },
    { lng: -0.01, lat: 0.008 },
    { lng: 0.008, lat: -0.01 },
    { lng: -0.014, lat: -0.004 },
    { lng: 0.016, lat: 0.012 },
  ];

  const offset = offsets[index % offsets.length];

  return {
    longitude: baseLng + offset.lng,
    latitude: baseLat + offset.lat,
  };
}

function getMarkerKind(place: BackendEvent): MarkerKind {
  const text = `${place.title} ${place.venue || ""} ${place.category_label || ""}`.toLowerCase();

  if (
    text.includes("cocktail") ||
    text.includes("bar") ||
    text.includes("drank") ||
    text.includes("wijn") ||
    text.includes("jazz")
  ) {
    return "drink";
  }

  if (
    text.includes("restaurant") ||
    text.includes("brasserie") ||
    text.includes("food") ||
    text.includes("diner") ||
    text.includes("culinair")
  ) {
    return "fork";
  }

  return "spot";
}

function getMarkerSvg(kind: MarkerKind) {
  if (kind === "drink") {
    return `
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 5h10l-1.1 4.53A4 4 0 0 1 12 12.5a4 4 0 0 1-3.9-2.97L7 5Z"></path>
        <path d="M12 12.5V19"></path>
        <path d="M9.5 19h5"></path>
      </svg>
    `;
  }

  if (kind === "fork") {
    return `
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 4v7"></path>
        <path d="M11 4v7"></path>
        <path d="M8 8.5h3"></path>
        <path d="M9.5 11v8"></path>
        <path d="M15.5 4v15"></path>
        <path d="M15.5 4c2 0 3.5 1.8 3.5 4v2h-3.5"></path>
      </svg>
    `;
  }

  return `
    <svg aria-hidden="true" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10Z"></path>
      <circle cx="12" cy="10" r="2.5"></circle>
    </svg>
  `;
}

function applyMarkerState(
  element: HTMLButtonElement,
  kind: MarkerKind,
  selected: boolean
) {
  element.className = selected
    ? "flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#2e4a14] text-white shadow-[0_18px_32px_rgba(44,67,18,0.26)] ring-4 ring-white/40"
    : "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#5c7d2c] text-white shadow-[0_14px_28px_rgba(44,67,18,0.22)]";
  element.innerHTML = getMarkerSvg(kind);
}

export default function ExploreMap({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
}: ExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<number, maplibregl.Marker>>({});

  const mapPlaces = useMemo<MapPlace[]>(() => {
    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event, index) => {
      const hasRealCoordinates =
        typeof event.latitude === "number" && typeof event.longitude === "number";

      if (hasRealCoordinates) {
        return {
          ...event,
          latitude: event.latitude as number,
          longitude: event.longitude as number,
          isDummyLocation: false,
        };
      }

      const dummyCoordinates = createDummyCoordinates(cityLabel, index);

      return {
        ...event,
        latitude: dummyCoordinates.latitude,
        longitude: dummyCoordinates.longitude,
        isDummyLocation: true,
      };
    });
  }, [events, cityLabel]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || mapPlaces.length === 0) {
      return;
    }

    const firstPlace = mapPlaces[0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [firstPlace.longitude, firstPlace.latitude],
      zoom: 12,
      attributionControl: false,
    });

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, [mapPlaces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapPlaces.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    mapPlaces.forEach((place) => {
      bounds.extend([place.longitude, place.latitude]);
    });

    map.fitBounds(bounds, {
      padding: 72,
      maxZoom: mapPlaces.length === 1 ? 14 : 13,
      duration: 0,
    });
  }, [mapPlaces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    mapPlaces.forEach((place) => {
      const markerElement = document.createElement("button");
      const markerKind = getMarkerKind(place);

      markerElement.type = "button";
      markerElement.dataset.markerKind = markerKind;
      markerElement.setAttribute("aria-label", `Toon ${place.title} op kaart`);

      applyMarkerState(markerElement, markerKind, selectedId === place.id);

      markerElement.addEventListener("click", () => {
        setSelectedId(place.id);
      });

      const marker = new maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      markersRef.current[place.id] = marker;
    });
  }, [mapPlaces, selectedId, setSelectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const selectedPlace = mapPlaces.find((place) => place.id === selectedId);

    if (selectedPlace) {
      map.flyTo({
        center: [selectedPlace.longitude, selectedPlace.latitude],
        zoom: 14.2,
        essential: true,
      });
    }

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement() as HTMLButtonElement;
      const markerKind = (markerEl.dataset.markerKind as MarkerKind) || "spot";

      applyMarkerState(markerEl, markerKind, Number(id) === selectedId);
    });
  }, [selectedId, mapPlaces]);

  useEffect(() => {
    if (!selectedId && mapPlaces.length > 0) {
      setSelectedId(mapPlaces[0].id);
    }
  }, [selectedId, mapPlaces, setSelectedId]);

  const selectedPlace = mapPlaces.find((place) => place.id === selectedId) || null;
  const hasDummyLocations = mapPlaces.some((place) => place.isDummyLocation);

  function focusSelectedPlace() {
    if (!selectedPlace || !mapRef.current) {
      return;
    }

    mapRef.current.flyTo({
      center: [selectedPlace.longitude, selectedPlace.latitude],
      zoom: 14.6,
      essential: true,
    });
  }

  if (mapPlaces.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2.8rem] bg-[#f2e6d6] shadow-[0_36px_70px_rgba(52,37,22,0.12)]">
        <div className="flex min-h-[320px] items-center justify-center px-6 py-10 text-center">
          <div className="max-w-[28rem] rounded-[2rem] bg-white/88 px-7 py-8 text-[#5d5148] shadow-[0_28px_60px_rgba(51,35,21,0.15)]">
            <h3 className="text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#151515]">
              Nog geen locaties beschikbaar
            </h3>
            <p className="mt-3 text-sm leading-7">
              Voor {cityLabel} zijn nog geen resultaten om op de kaart te tonen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.8rem] bg-[#f2e6d6] shadow-[0_36px_70px_rgba(52,37,22,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.58),transparent_34%),linear-gradient(135deg,rgba(244,219,183,0.92),rgba(196,214,190,0.88))]" />

      <div
        ref={mapContainerRef}
        className="relative h-[320px] w-full sm:h-[380px] lg:h-[420px] [filter:saturate(0.82)_contrast(0.95)_sepia(0.08)]"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,249,244,0.14)_0%,rgba(236,224,210,0.2)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.34),transparent_26%)]" />

      <div className="pointer-events-none absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-full bg-white/92 px-4 py-2 text-sm font-medium text-[#2a231f] shadow-[0_10px_24px_rgba(51,35,21,0.12)] ring-1 ring-black/5 backdrop-blur">
          {cityLabel} kaart
        </div>

        {hasDummyLocations ? (
          <div className="rounded-full bg-[#fff7e8]/94 px-4 py-2 text-xs font-medium text-[#7a5b1d] shadow-[0_10px_24px_rgba(51,35,21,0.12)] ring-1 ring-[#ead3a2] backdrop-blur">
            Dummy locaties actief
          </div>
        ) : null}
      </div>

      {selectedPlace ? (
        <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-[320px]">
          <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_28px_60px_rgba(51,35,21,0.18)]">
            <h3 className="text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#151515]">
              Verken op de kaart
            </h3>

            <p className="mt-3 text-[0.96rem] leading-7 text-[#5d5148]">
              Bekijk waar je top matches zich bevinden ten opzichte van elkaar in
              de binnenstad.
            </p>

            <div className="mt-5 rounded-[1.4rem] bg-[#faf6f0] px-4 py-4 ring-1 ring-black/5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#6f644f]">
                Geselecteerde locatie
              </div>
              <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#181615]">
                {selectedPlace.title}
              </div>
              <div className="mt-1 text-sm text-[#5c5046]">
                {selectedPlace.venue || cityLabel}
              </div>
              {selectedPlace.date_text ? (
                <div className="mt-1 text-sm text-[#6e6258]">
                  {selectedPlace.date_text}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={focusSelectedPlace}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#181615] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,22,21,0.18)] hover:-translate-y-0.5"
            >
              Kaart openen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
