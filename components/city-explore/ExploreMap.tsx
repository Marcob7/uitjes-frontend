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
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
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
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    mapPlaces.forEach((place, index) => {
      const markerElement = document.createElement("button");

      markerElement.type = "button";
      markerElement.className =
        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-sm font-bold text-white shadow-md";
      markerElement.textContent = String(index + 1);

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
  }, [mapPlaces, setSelectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const selectedPlace = mapPlaces.find((place) => place.id === selectedId);

    if (selectedPlace) {
      map.flyTo({
        center: [selectedPlace.longitude, selectedPlace.latitude],
        zoom: 14.5,
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
  }, [selectedId, mapPlaces]);

  useEffect(() => {
    if (!selectedId && mapPlaces.length > 0) {
      setSelectedId(mapPlaces[0].id);
    }
  }, [selectedId, mapPlaces, setSelectedId]);

  if (mapPlaces.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[520px] items-center justify-center bg-[#f3f1ec] p-6 text-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Nog geen locaties beschikbaar
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Voor {cityLabel} zijn nog geen resultaten om op de kaart te tonen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlace = mapPlaces.find((place) => place.id === selectedId) || null;
  const hasDummyLocations = mapPlaces.some((place) => place.isDummyLocation);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <div ref={mapContainerRef} className="h-[520px] w-full" />

        <div className="pointer-events-none absolute left-4 top-4 right-4 flex items-start justify-between gap-3">
          <div className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {cityLabel} kaart
          </div>

          {hasDummyLocations ? (
            <div className="rounded-full bg-[#fff7e8]/95 px-4 py-2 text-xs font-medium text-amber-900 shadow-sm ring-1 ring-amber-200 backdrop-blur">
              Dummy locaties actief
            </div>
          ) : null}
        </div>

        {selectedPlace ? (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="max-w-md rounded-[1.5rem] bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-900">
                  {mapPlaces.findIndex((place) => place.id === selectedPlace.id) + 1}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">
                    {selectedPlace.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedPlace.venue || "Locatie volgt nog"}
                  </p>

                  {selectedPlace.date_text ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedPlace.date_text}
                    </p>
                  ) : null}

                  {selectedPlace.isDummyLocation ? (
                    <p className="mt-2 text-xs font-medium text-amber-700">
                      Getoond met dummy kaartpositie
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}