"use client";
export const runtime = "edge";
import Image from "next/image";
import { useMemo, useState } from "react";
import { getCityConfig } from "@/lib/cityConfig";

type CategoryKey =
  | "restaurants"
  | "kroegen"
  | "uitjes"
  | "evenementen"
  | "kalender"
  | "kaart";

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
};

type PlaceItem = {
  id: number;
  title: string;
  type: string;
  badge: string;
  badgeColor: string;
  description: string;
  location: string;
  image: string;
  category: Exclude<CategoryKey, "kalender" | "kaart">;
  mapX: string;
  mapY: string;
  dateText?: string | null;
  timeText?: string | null;
  sourceUrl?: string | null;
  isFree?: boolean;
};

type CalendarEvent = {
  id: number;
  title: string;
  label: string;
  labelColor: string;
  description: string;
  time: string;
  location: string;
  icon: string;
};

type CityExploreViewProps = {
  city: string;
  events: BackendEvent[];
};

const categories: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "restaurants", label: "Restaurants", icon: "🍽️" },
  { key: "kroegen", label: "Kroegen", icon: "🍺" },
  { key: "uitjes", label: "Uitjes", icon: "🎯" },
  { key: "evenementen", label: "Evenementen", icon: "🎉" },
  { key: "kalender", label: "Kalender", icon: "🗓️" },
  { key: "kaart", label: "Op de kaart", icon: "📍" },
];

const places: PlaceItem[] = [
  {
    id: 1,
    title: "Restaurant De Echoput",
    type: "RESTAURANT",
    badge: "Trendy",
    badgeColor: "bg-violet-500",
    description:
      "Prachtig gelegen sterrenrestaurant midden op de Veluwe. Seizoensgebonden menu met lokale ingrediënten.",
    location: "Hoog Soeren",
    image: "/images/apeldoorn_img.jpg",
    category: "restaurants",
    mapX: "82%",
    mapY: "49%",
  },
  {
    id: 2,
    title: "Lunchroom Hof & de Walansen",
    type: "RESTAURANT",
    badge: "Gezellig",
    badgeColor: "bg-orange-400",
    description:
      "Gezellige lunchroom met huisgemaakte gerechten, taarten en vers geperste sapjes in het centrum.",
    location: "Centrum",
    image: "/images/apeldoorn_img.jpg",
    category: "restaurants",
    mapX: "22%",
    mapY: "74%",
  },
  {
    id: 3,
    title: "Brasserie Cé",
    type: "RESTAURANT",
    badge: "Populair",
    badgeColor: "bg-pink-500",
    description:
      "Moderne brasserie met Frans-Nederlandse keuken en een uitgebreide wijnkaart.",
    location: "Centrum",
    image: "/images/apeldoorn_img.jpg",
    category: "restaurants",
    mapX: "18%",
    mapY: "26%",
  },
  {
    id: 4,
    title: "Biercafé de Graaf",
    type: "KROEG",
    badge: "Levendig",
    badgeColor: "bg-amber-500",
    description:
      "Toegankelijke kroeg met speciaalbier, borrelplanken en een gezellige sfeer.",
    location: "Centrum",
    image: "/images/apeldoorn_img.jpg",
    category: "kroegen",
    mapX: "64%",
    mapY: "36%",
  },
  {
    id: 5,
    title: "Julianatoren",
    type: "UITJE",
    badge: "Familie",
    badgeColor: "bg-emerald-500",
    description:
      "Populair pretpark voor gezinnen met attracties, shows en veel speelplezier.",
    location: "Apeldoorn",
    image: "/images/julianatoren.jpg",
    category: "uitjes",
    mapX: "72%",
    mapY: "68%",
  },
  {
    id: 6,
    title: "Food & Fun Festival",
    type: "EVENEMENT",
    badge: "Nieuw",
    badgeColor: "bg-rose-500",
    description:
      "Lokaal festival met foodtrucks, muziek en activiteiten in het stadscentrum.",
    location: "Marktplein",
    image: "/images/apeldoorn_img.jpg",
    category: "evenementen",
    mapX: "36%",
    mapY: "54%",
  },
];

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Weekmarkt Apeldoorn",
    label: "Markt",
    labelColor: "bg-emerald-500",
    description: "Verse producten, bloemen en streekproducten.",
    time: "09:00 - 15:00",
    location: "Marktplein",
    icon: "🛒",
  },
  {
    id: 2,
    title: "Pubquiz Bar Bonaparte",
    label: "Entertainment",
    labelColor: "bg-violet-500",
    description: "Test je kennis bij de populairste pubquiz.",
    time: "20:00 - 22:30",
    location: "Bar Bonaparte",
    icon: "🧠",
  },
];

const calendarDays = [
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6, dot: "bg-emerald-500" },
  { day: 7, dot: "bg-violet-500" },
  { day: 8, dot: "bg-orange-400" },
  { day: 9, dot: "bg-pink-500" },
  { day: 10, dot: "bg-emerald-500" },
  { day: 11 },
  { day: 12 },
  { day: 13, active: true },
  { day: 14 },
  { day: 15, dot: "bg-orange-400" },
  { day: 16, dot: "bg-pink-500" },
  { day: 17 },
  { day: 18, muted: true },
  { day: 19 },
  { day: 20, dot: "bg-emerald-500" },
  { day: 21, dot: "bg-emerald-500" },
  { day: 22, dot: "bg-emerald-500" },
  { day: 23, dot: "bg-violet-500" },
  { day: 24, dot: "bg-orange-400" },
  { day: 25 },
  { day: 26 },
  { day: 27, dot: "bg-emerald-500" },
  { day: 28, dot: "bg-violet-500" },
  { day: 29 },
  { day: 30 },
  { day: 31 },
];

function formatCityName(city: string) {
  return city
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatVenue(venue: string | null | undefined, cityLabel: string) {
  if (!venue || venue.toLowerCase() === "nan") {
    return cityLabel;
  }

  return venue;
}

function formatTimeRange(startAt: string | null, endAt: string | null) {
  if (!startAt) return null;

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

function getEventBadge(event: BackendEvent) {
  if (event.is_ongoing) {
    return { label: "Bezig", color: "bg-emerald-500" };
  }

  if (event.is_free) {
    return { label: "Gratis", color: "bg-sky-500" };
  }

  if (event.price_min != null) {
    return { label: `Vanaf €${event.price_min}`, color: "bg-amber-500" };
  }

  return { label: "Evenement", color: "bg-violet-500" };
}

function DayCell({
  day,
  dot,
  active = false,
  muted = false,
}: {
  day: number;
  dot?: string;
  active?: boolean;
  muted?: boolean;
}) {
  if (active) {
    return (
      <div className="flex aspect-square items-center justify-center">
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl border-2 border-emerald-400 bg-emerald-500 text-white shadow-sm">
          <span className="text-xl font-semibold">{day}</span>
          <div className="mt-1 flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
          </div>
        </div>
      </div>
    );
  }

  if (muted) {
    return (
      <div className="flex aspect-square items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-xl font-semibold text-slate-900">
          {day}
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-square flex-col items-center justify-center">
      <span className="text-xl font-medium text-slate-900">{day}</span>
      {dot ? <span className={`mt-2 h-2.5 w-2.5 rounded-full ${dot}`} /> : null}
    </div>
  );
}

function CalendarView() {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Vorige maand"
          >
            ‹
          </button>

          <h2 className="text-2xl font-semibold text-slate-900">Maart 2026</h2>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Volgende maand"
          >
            ›
          </button>
        </div>

        <div className="mt-10 grid grid-cols-7 gap-y-6 text-center text-sm text-slate-400">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-7 gap-x-3 gap-y-4">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <DayCell day={1} />

          {calendarDays.slice(1).map((item) => (
            <DayCell
              key={item.day}
              day={item.day}
              dot={item.dot}
              active={item.active}
              muted={item.muted}
            />
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">Vrijdag 13 Maart</h3>

        <div className="mt-6 space-y-4">
          {calendarEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex gap-4">
                <div className="pt-1 text-2xl">{event.icon}</div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white ${event.labelColor}`}
                    >
                      {event.label}
                    </span>
                  </div>

                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">
                    {event.title}
                  </h4>

                  <p className="mt-2 text-base leading-7 text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>🕘 {event.time}</span>
                    <span>📍 {event.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function CityExploreView({
  city,
  events,
}: CityExploreViewProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("evenementen");

  const cityTheme = getCityConfig(city);
  const cityLabel = cityTheme.label;

  const eventItems = useMemo<PlaceItem[]>(() => {
    return (events || []).map((event) => {
      const badge = getEventBadge(event);

      return {
        id: event.id,
        title: event.title || "Onbekend event",
        type: "EVENEMENT",
        badge: badge.label,
        badgeColor: badge.color,
        description:
          event.date_text ||
          "Voor dit event is nog geen extra beschrijving beschikbaar.",
        location: formatVenue(event.venue, cityLabel),
        image: "/images/apeldoorn_img.jpg",
        category: "evenementen",
        mapX: "50%",
        mapY: "50%",
        dateText: event.date_text,
        timeText: formatTimeRange(event.start_at, event.end_at),
        sourceUrl: event.source_url,
        isFree: event.is_free,
      };
    });
  }, [events, cityLabel]);

  const fallbackPlaces = useMemo(() => {
    if (activeCategory === "kalender" || activeCategory === "kaart") {
      return places;
    }

    return places.filter((place) => place.category === activeCategory);
  }, [activeCategory]);

  const filteredPlaces = useMemo(() => {
    if (activeCategory === "kalender" || activeCategory === "kaart") {
      return eventItems.length > 0 ? eventItems : places;
    }

    if (activeCategory === "evenementen") {
      return eventItems.length > 0 ? eventItems : fallbackPlaces;
    }

    return fallbackPlaces;
  }, [activeCategory, eventItems, fallbackPlaces]);

  const hasRealEvents = eventItems.length > 0;
  const isKnownDataCity = city === "apeldoorn" || city === "deventer";

  return (
    <section className="bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Wat is er te doen in {cityLabel}?
            </h1>
        <p className="mt-3 text-lg leading-8 text-slate-500">
  {cityTheme.description}
</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span aria-hidden="true">↗</span>
              Delen
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span aria-hidden="true">🔖</span>
              Bewaren
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
               className={[
  "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition",
  isActive
    ? `${cityTheme.accentClass} border-transparent text-white shadow-sm`
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
].join(" ")}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </div>

        {!hasRealEvents && !isKnownDataCity ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Voor <span className="font-semibold text-slate-900">{cityLabel}</span>{" "}
            is nog geen data beschikbaar. Probeer Apeldoorn of Deventer.
          </div>
        ) : null}

        {activeCategory === "kalender" ? (
          <CalendarView />
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-4">
              {filteredPlaces.map((place, index) => (
                <article
                  key={place.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="absolute -left-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white shadow-md">
                        {index + 1}
                      </div>

                      <div className="relative h-28 w-32 overflow-hidden rounded-2xl">
                        <Image
                          src={place.image}
                          alt={place.title}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold tracking-[0.15em] text-slate-400">
                          {place.type}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white ${place.badgeColor}`}
                        >
                          {place.badge}
                        </span>
                      </div>

                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        {place.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-base leading-7 text-slate-500">
                        {place.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <span aria-hidden="true">📍</span>
                          <span>{place.location}</span>
                        </span>

                        {place.timeText ? (
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden="true">🕘</span>
                            <span>{place.timeText}</span>
                          </span>
                        ) : null}
                      </div>

                      {place.sourceUrl ? (
                        <div className="mt-4">
                          <a
                            href={place.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 underline underline-offset-4"
                          >
                            Bekijk bron
                            <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="relative min-h-[720px] overflow-hidden rounded-2xl bg-[#f3f5f4]">
                <div className="absolute inset-0">
                  <div className="absolute left-[10%] top-0 h-full w-1.5 bg-slate-200/70" />
                  <div className="absolute left-[48%] top-0 h-full w-3 bg-slate-300/60" />
                  <div className="absolute right-[10%] top-0 h-full w-1.5 bg-slate-200/70" />

                  <div className="absolute left-0 top-[30%] h-1.5 w-full bg-slate-200/70" />
                  <div className="absolute left-0 top-[56%] h-3 w-full bg-slate-300/60" />
                  <div className="absolute left-0 top-[80%] h-1.5 w-full bg-slate-200/70" />

                  <div className="absolute left-[8%] top-[18%] h-40 w-16 rounded-2xl bg-emerald-100/40" />
                  <div className="absolute bottom-[14%] right-[0%] h-40 w-36 rounded-3xl bg-emerald-100/40" />
                  <div className="absolute left-[17%] top-[45%] h-14 w-20 rounded-2xl bg-slate-300/60" />
                  <div className="absolute left-[30%] top-[63%] h-18 w-14 rounded-2xl bg-slate-300/60" />
                  <div className="absolute right-[20%] top-[50%] h-12 w-24 rounded-2xl bg-slate-300/60" />
                  <div className="absolute left-[14%] top-[18%] h-[2px] w-[64%] rotate-[45deg] bg-slate-200/70" />
                </div>

                {filteredPlaces.slice(0, 3).map((place, index) => (
                  <div
                    key={place.id}
                    className="absolute z-10"
                    style={{
                      left: place.mapX,
                      top: place.mapY,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                     <div
  className={`flex h-12 w-12 items-center justify-center rounded-full ${cityTheme.accentClass} text-lg font-semibold text-white`}
>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
                  <span aria-hidden="true">📍</span>
                  <span>
                    {cityLabel} · {Math.min(filteredPlaces.length, 3)} locaties
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}