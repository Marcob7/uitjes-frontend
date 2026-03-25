"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const places = [
  {
    id: 1,
    title: "Lunchroom Hof & de Walansen",
    description: "Gezellige lunchplek in Apeldoorn",
    lat: 52.2118,
    lng: 5.9699,
  },
  {
    id: 2,
    title: "Restaurant Poppe",
    description: "Bekende plek in Apeldoorn",
    lat: 52.2145,
    lng: 5.9625,
  },
  {
    id: 3,
    title: "Blue Sakura Apeldoorn",
    description: "Sushi en shared dining",
    lat: 52.2152,
    lng: 5.9708,
  },
];

export default function DemoMapPage() {
  const [selectedId, setSelectedId] = useState<number | null>(places[0].id);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<number, maplibregl.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [5.9699, 52.2118],
      zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    map.on("load", () => {
      places.forEach((place) => {
        const markerElement = document.createElement("div");
        markerElement.className =
          "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-sm font-bold text-white shadow-md";

        markerElement.textContent = String(place.id);

        const marker = new maplibregl.Marker({
          element: markerElement,
        })
          .setLngLat([place.lng, place.lat])
          .addTo(map);

        markerElement.addEventListener("click", () => {
          setSelectedId(place.id);
        });

        markersRef.current[place.id] = marker;
      });
    });

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;

    const selectedPlace = places.find((place) => place.id === selectedId);
    if (!selectedPlace) return;

    map.flyTo({
      center: [selectedPlace.lng, selectedPlace.lat],
      zoom: 15,
      essential: true,
    });

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
  }, [selectedId]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Demo map pagina
          </h1>
          <p className="mt-2 text-slate-600">
            Hover of klik op een restaurant links om de locatie op de kaart te
            bekijken.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {places.map((place) => {
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
                        {place.description}
                      </p>
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