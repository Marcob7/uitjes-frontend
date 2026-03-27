"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getCityConfig } from "@/lib/cityConfig";
import CityCalendarExpanded from "@/components/CityCalendarExpanded";
import CityCalendarPreview from "@/components/CityCalendarPreview";
import CalendarSection from "@/components/CalendarSection";
type CategoryKey =
  | "events"
  | "attractions"
  | "restaurants"
  | "bars"
  | "thingsToDo";

type BackendEvent = {
  id: number;
  title: string;
  city: string;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  date_text: string | null;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: number | null;
  source_url: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type CityExploreViewProps = {
  city: string;
  events: BackendEvent[];
};

type ExploreCard = {
  id: number;
  title: string;
  label: string;
  time: string;
  location: string;
  image: string;
};

const categoryTabs: { key: CategoryKey; label: string }[] = [
  { key: "events", label: "Events" },
  { key: "attractions", label: "Attractions" },
  { key: "restaurants", label: "Restaurants" },
  { key: "bars", label: "Bars" },
  { key: "thingsToDo", label: "Things to do" },
];

const mockCardsByCategory: Record<CategoryKey, ExploreCard[]> = {
  events: [
    {
      id: 1,
      title: "Royal Academy Art Exhibition",
      label: "ART EXHIBITION",
      time: "10:00 AM",
      location: "City Museum",
      image: "/images/apeldoorn_img.jpg",
    },
    {
      id: 2,
      title: "Summer Beach Festival",
      label: "LIVE EVENT",
      time: "2:30 PM",
      location: "Stadsplein",
      image: "/images/julianatoren.jpg",
    },
    {
      id: 3,
      title: "Evening City Tour",
      label: "CITY TOUR",
      time: "8:00 PM",
      location: "Centrum",
      image: "/images/apeldoorn_img.jpg",
    },
  ],
  attractions: [
    {
      id: 4,
      title: "Historisch Stadscentrum",
      label: "HIGHLIGHT",
      time: "Hele dag",
      location: "Binnenstad",
      image: "/images/apeldoorn_img.jpg",
    },
    {
      id: 5,
      title: "Stedelijk Museum",
      label: "CULTURE",
      time: "11:00 AM",
      location: "Museumkwartier",
      image: "/images/julianatoren.jpg",
    },
    {
      id: 6,
      title: "Skyline Viewpoint",
      label: "VIEWPOINT",
      time: "Sunset",
      location: "Stadsrand",
      image: "/images/apeldoorn_img.jpg",
    },
  ],
  restaurants: [
    {
      id: 7,
      title: "Atelier Bistro",
      label: "RESTAURANT",
      time: "Lunch & Diner",
      location: "Centrum",
      image: "/images/apeldoorn_img.jpg",
    },
    {
      id: 8,
      title: "Canal House Dining",
      label: "LOCAL FAVORITE",
      time: "6:00 PM",
      location: "Oude wijk",
      image: "/images/julianatoren.jpg",
    },
    {
      id: 9,
      title: "Morning Roast Café",
      label: "COFFEE",
      time: "8:00 AM",
      location: "Stationsbuurt",
      image: "/images/apeldoorn_img.jpg",
    },
  ],
  bars: [
    {
      id: 10,
      title: "Nocturne Bar",
      label: "COCKTAILS",
      time: "9:00 PM",
      location: "Binnenstad",
      image: "/images/apeldoorn_img.jpg",
    },
    {
      id: 11,
      title: "Old Town Pub",
      label: "PUB",
      time: "7:00 PM",
      location: "Markt",
      image: "/images/julianatoren.jpg",
    },
    {
      id: 12,
      title: "Rooftop Social",
      label: "NIGHTLIFE",
      time: "10:00 PM",
      location: "Centrum",
      image: "/images/apeldoorn_img.jpg",
    },
  ],
  thingsToDo: [
    {
      id: 13,
      title: "Canal Walk",
      label: "OUTDOOR",
      time: "Middag",
      location: "Stadscentrum",
      image: "/images/apeldoorn_img.jpg",
    },
    {
      id: 14,
      title: "Creative Workshop",
      label: "EXPERIENCE",
      time: "1:00 PM",
      location: "Kunsthuis",
      image: "/images/julianatoren.jpg",
    },
    {
      id: 15,
      title: "Local Market Route",
      label: "LOCAL TIP",
      time: "Ochtend",
      location: "Marktplein",
      image: "/images/apeldoorn_img.jpg",
    },
  ],
};

function formatCityTitle(cityLabel: string) {
  return `${cityLabel} Discovery`;
}

function formatIntro(cityLabel: string, fallbackDescription?: string) {
  if (fallbackDescription) return fallbackDescription;
  return `Ontdek bijzondere plekken, culturele highlights en lokale favorieten in ${cityLabel}.`;
}

function formatVenue(venue: string | null | undefined, cityLabel: string) {
  if (!venue || venue.toLowerCase() === "nan") {
    return cityLabel;
  }
  return venue;
}

function formatTimeRange(startAt: string | null, endAt: string | null) {
  if (!startAt) return "Tijd volgt";

  const start = new Date(startAt);
  const startTime = start.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endAt) return startTime;

  const end = new Date(endAt);
  const endTime = end.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

function sortEventsByStartDate(events: BackendEvent[]) {
  return [...events].sort((a, b) => {
    const aTime = a.start_at
      ? new Date(a.start_at).getTime()
      : Number.POSITIVE_INFINITY;
    const bTime = b.start_at
      ? new Date(b.start_at).getTime()
      : Number.POSITIVE_INFINITY;

    return aTime - bTime;
  });
}

function buildExploreCards(
  activeTab: CategoryKey,
  events: BackendEvent[],
  cityLabel: string,
  fallbackImage: string
): ExploreCard[] {
  if (activeTab !== "events") {
    return mockCardsByCategory[activeTab];
  }

  if (!events?.length) {
    return mockCardsByCategory.events;
  }

  return sortEventsByStartDate(events)
    .slice(0, 6)
    .map((event) => ({
      id: event.id,
      title: event.title || "Onbekend event",
      label: event.is_free ? "FREE EVENT" : "EVENT",
      time: formatTimeRange(event.start_at, event.end_at),
      location: formatVenue(event.venue, cityLabel),
      image: fallbackImage,
    }));
}

function buildIconicCards(
  cityLabel: string,
  heroImage: string,
  fallbackImage: string
) {
  return [
    {
      id: 1,
      title: `Iconisch ${cityLabel}`,
      description: `Ontdek een van de meest herkenbare plekken van ${cityLabel} en ervaar de sfeer van de stad.`,
      cta: "Explore Collection →",
      image: heroImage || fallbackImage,
    },
    {
      id: 2,
      title: "Culturele hotspots",
      description:
        "Van musea en historische gebouwen tot creatieve plekken en stadsverhalen.",
      cta: "Guided Tours →",
      image: fallbackImage,
    },
    {
      id: 3,
      title: "Lokale favorieten",
      description:
        "Sfeervolle plekken, verrassende adressen en stadsdelen die je niet wilt missen.",
      cta: "Ontdek meer →",
      image: fallbackImage,
    },
  ];
}

function HeroSection({
  cityLabel,
  cityTheme,
}: {
  cityLabel: string;
  cityTheme: ReturnType<typeof getCityConfig>;
}) {
  return (
    <section
      className="rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      style={{
        backgroundColor: cityTheme.colors.softSurface || "#efe4dd",
      }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-xl">
          <h1
            className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: cityTheme.colors.heading || "#111111" }}
          >
            {formatCityTitle(cityLabel)}
          </h1>

          <p
            className="mt-5 text-base leading-7 sm:text-lg"
            style={{ color: cityTheme.colors.text || "#4b4b4b" }}
          >
            {formatIntro(cityLabel, cityTheme.description)}
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center rounded-full px-5 py-3 text-sm font-medium shadow-sm transition hover:opacity-95"
            style={{
              backgroundColor: cityTheme.colors.accent,
              color: cityTheme.colors.accentText,
            }}
          >
            Explore Events
          </button>
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-[1.5rem] shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:h-[380px]">
          <Image
            src={cityTheme.heroImage || cityTheme.fallbackImage}
            alt={cityLabel}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
      </div>
    </section>
  );
}

function TabsSection({
  activeCategory,
  setActiveCategory,
  cityTheme,
}: {
  activeCategory: CategoryKey;
  setActiveCategory: (value: CategoryKey) => void;
  cityTheme: ReturnType<typeof getCityConfig>;
}) {
  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-3">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className="rounded-full border px-5 py-3 text-sm font-medium transition"
              style={
                isActive
                  ? {
                      backgroundColor: cityTheme.colors.accent,
                      borderColor: cityTheme.colors.accent,
                      color: cityTheme.colors.accentText,
                    }
                  : {
                      backgroundColor:
                        cityTheme.colors.mutedSurface || "#f4f0eb",
                      borderColor: "transparent",
                      color: "#3a3a3a",
                    }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ExploreCardItem({
  card,
  isSelected,
  onSelect,
}: {
  card: ExploreCard;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-[1.5rem] bg-white p-3 text-left shadow-sm ring-1 transition ${
        isSelected ? "ring-amber-400" : "ring-black/5 hover:ring-black/10"
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {card.label}
        </p>

        <h3 className="mt-1 text-base font-semibold leading-tight text-[#111111] sm:text-lg">
          {card.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{card.time}</span>
          <span>{card.location}</span>
        </div>
      </div>

      <div
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          isSelected
            ? "bg-amber-400 text-slate-900"
            : "bg-[#f4ede7] text-slate-700"
        }`}
      >
        →
      </div>
    </button>
  );
}

function ExploreMap({
  cityLabel,
  events,
  selectedId,
  setSelectedId,
}: {
  cityLabel: string;
  events: BackendEvent[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
}) {
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
      <div ref={mapContainerRef} className="h-[420px] w-full rounded-[1.5rem]" />
    </div>
  );
}

function IconicCardItem({
  card,
}: {
  card: {
    id: number;
    title: string;
    description: string;
    cta: string;
    image: string;
  };
}) {
  return (
    <article className="group">
      <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] shadow-sm ring-1 ring-black/5">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-semibold tracking-tight text-[#111111]">
          {card.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {card.description}
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center text-sm font-medium text-[#111111] transition hover:opacity-70"
        >
          {card.cta}
        </button>
      </div>
    </article>
  );
}

function IconicSection({
  cityLabel,
  cityTheme,
}: {
  cityLabel: string;
  cityTheme: ReturnType<typeof getCityConfig>;
}) {
  const iconicCards = buildIconicCards(
    cityLabel,
    cityTheme.heroImage,
    cityTheme.fallbackImage
  );

  return (
    <section
      className="mt-16 rounded-[2.5rem] px-6 py-10 sm:px-8 sm:py-12 lg:px-10"
      style={{
        backgroundColor: "#d9ead7",
      }}
    >
      <div className="max-w-3xl">
        <h2 className="text-4xl font-semibold tracking-tight text-[#111111]">
          Iconic {cityLabel}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Must-visit landmarks en plekken die de sfeer, geschiedenis en
          identiteit van {cityLabel} laten zien.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {iconicCards.map((card) => (
          <IconicCardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

function StayInLoopSection({ cityLabel }: { cityLabel: string }) {
  return (
    <section className="mb-8 mt-12">
      <div className="rounded-[2.5rem] bg-[#efe2b8] px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-[#111111]">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            Subscribe to the {cityLabel} Digest and receive local highlights,
            events and city tips directly in your inbox.
          </p>

          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-black/5 bg-white px-5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-medium text-white transition hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function CityExploreView({
  city,
  events,
}: CityExploreViewProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("events");
  const [showExpandedCalendar, setShowExpandedCalendar] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(9);

  const cityTheme = getCityConfig(city);
  const cityLabel = cityTheme.label;

  const cards = useMemo(() => {
    return buildExploreCards(
      activeCategory,
      events,
      cityLabel,
      cityTheme.fallbackImage
    );
  }, [activeCategory, events, cityLabel, cityTheme.fallbackImage]);

  const eventsForMap = useMemo(() => {
    return sortEventsByStartDate(events || []).filter(
      (event) =>
        typeof event.latitude === "number" &&
        typeof event.longitude === "number"
    );
  }, [events]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (activeCategory !== "events") {
      setSelectedId(null);
      return;
    }

    if (eventsForMap.length > 0) {
      setSelectedId((current) => current ?? eventsForMap[0].id);
      return;
    }

    if (cards.length > 0) {
      setSelectedId((current) => current ?? cards[0].id);
    }
  }, [activeCategory, eventsForMap, cards]);

  return (
    <section
      className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      style={{ backgroundColor: cityTheme.colors.pageBackground }}
    >
      <div className="mx-auto max-w-7xl">
        <HeroSection cityLabel={cityLabel} cityTheme={cityTheme} />

        <TabsSection
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          cityTheme={cityTheme}
        />

        {!showExpandedCalendar ? (
          <CityCalendarPreview
            accentColor={cityTheme.colors.accent}
            accentTextColor={cityTheme.colors.accentText}
            onDayClick={(day) => {
              setSelectedCalendarDay(day);
              setShowExpandedCalendar(true);
            }}
          />
        ) : (
          <CityCalendarExpanded
            cityLabel={cityLabel}
            accentColor={cityTheme.colors.accent}
            accentSoftColor={cityTheme.colors.softSurface || "#f2e7df"}
            initialDay={selectedCalendarDay}
            onClose={() => setShowExpandedCalendar(false)}
          />
        )}

        <section className="mt-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
                  Wednesday, Oct 9
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Curated picks for {cityLabel}
                </p>
              </div>

              <div className="space-y-4">
                {cards.map((card) => (
                  <ExploreCardItem
                    key={card.id}
                    card={card}
                    isSelected={selectedId === card.id}
                    onSelect={() => setSelectedId(card.id)}
                  />
                ))}
              </div>
            </div>

            <ExploreMap
              cityLabel={cityLabel}
              events={eventsForMap}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
        </section>

        <IconicSection cityLabel={cityLabel} cityTheme={cityTheme} />

        <StayInLoopSection cityLabel={cityLabel} />
      </div>
    </section>
  );
}