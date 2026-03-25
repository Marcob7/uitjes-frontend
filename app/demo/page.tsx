"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type ApiEvent = {
  id: number;
  title: string;
  city: string;
  venue: string | null;
  start_at: string;
  end_at: string | null;
  date_text: string;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: string | null;
  source_url: string;
  latitude?: number | null;
  longitude?: number | null;
};

type EventsResponse = {
  count: number;
  limit: number;
  offset: number;
  next_offset: number | null;
  has_more: boolean;
  results: ApiEvent[];
};

export default function DemoMapPage() {
  const [places, setPlaces] = useState<ApiEvent[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<number, maplibregl.Marker>>({});

  useEffect(() => {
    async function loadPlaces() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://uitjes-backend.onrender.com/api/events/?city=apeldoorn",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Kon evenementen niet ophalen");
        }

        const data: EventsResponse = await response.json();

        setPlaces(data.results);

        if (data.results.length > 0) {
          setSelectedId(data.results[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Er ging iets mis bij het ophalen van de evenementen.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [5.9699, 52.2118],
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
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const placesWithCoordinates = places.filter(
      (place) =>
        typeof place.latitude === "number" && typeof place.longitude === "number"
    );

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
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const selectedPlace = places.find((place) => place.id === selectedId);
    if (!selectedPlace) return;

    if (
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
  }, [selectedId, places]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Demo map pagina
          </h1>
          <p className="mt-2 text-slate-600">
            Echte data uit de backend voor Apeldoorn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {isLoading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                Evenementen laden...
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && places.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                Geen resultaten gevonden.
              </div>
            )}

            {!isLoading &&
              !error &&
              places.map((place) => {
                const isSelected = selectedId === place.id;

                return (
                  <button
                    key={place.id}
                    type="button"
                    onMouseEnter={() => setSelectedId(place.id)}
                    onFocus={() => setSelectedId(place.id)}
                    onClick={() => setSelectedId(place.id)}
                    className={`w-full rounded-2xl border bg-white p-5 text-left transition ${
                      isSelected
                        ? "border-amber-400 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                              isSelected
                                ? "bg-amber-400 text-slate-900"
                                : "bg-slate-900 text-white"
                            }`}
                          >
                            {place.id}
                          </span>

                          <h2 className="text-lg font-semibold text-slate-900">
                            {place.title}
                          </h2>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {place.date_text}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {place.venue || "Locatie volgt nog"}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {place.is_free
                            ? "Gratis"
                            : place.price_min
                            ? `Vanaf €${place.price_min}`
                            : "Prijs onbekend"}
                        </p>

                        {typeof place.latitude !== "number" ||
                        typeof place.longitude !== "number" ? (
                          <p className="mt-3 text-xs font-medium text-amber-700">
                            Nog geen kaartlocatie beschikbaar
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div ref={mapContainerRef} className="h-[650px] w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}