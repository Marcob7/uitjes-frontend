"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cityConfig, getCityConfig } from "@/lib/cityConfig";
import ExploreFiltersSidebar, {
  type ExploreFilters,
} from "@/components/ExploreFiltersSidebar";

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
  priceText?: string | null;
  sortDate?: string | null;
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

type CityTheme = ReturnType<typeof getCityConfig>;

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
    return { label: "Nu bezig", color: "bg-emerald-500" };
  }

  if (event.is_free) {
    return { label: "Gratis", color: "bg-sky-500" };
  }

  if (event.price_min != null) {
    return { label: `Vanaf €${event.price_min}`, color: "bg-amber-500" };
  }

  return { label: "Evenement", color: "bg-violet-500" };
}

function getPriceText(event: BackendEvent) {
  if (event.is_free) {
    return "Gratis toegang";
  }

  if (event.price_min != null) {
    return `Vanaf €${event.price_min}`;
  }

  return "Prijs onbekend";
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

function isSameDay(date: Date, compare: Date) {
  return (
    date.getFullYear() === compare.getFullYear() &&
    date.getMonth() === compare.getMonth() &&
    date.getDate() === compare.getDate()
  );
}

function getStartOfNextWeek(baseDate: Date) {
  const day = baseDate.getDay();
  const diffToNextMonday = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(baseDate);
  nextMonday.setDate(baseDate.getDate() + diffToNextMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
}

function getEndOfNextWeek(startOfNextWeek: Date) {
  const end = new Date(startOfNextWeek);
  end.setDate(startOfNextWeek.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function isThisWeekend(date: Date, now: Date) {
  const todayDay = now.getDay();
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + ((6 - todayDay + 7) % 7));
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  return date >= saturday && date <= sunday;
}

function buildAvailableCities() {
  return Object.values(cityConfig).map((config) => ({
    label: config.label,
    slug: config.slug,
  }));
}

function getHighlightCards(cityTheme: CityTheme) {
  const discovery = cityTheme.discovery || {};

  if (Array.isArray(discovery.highlights) && discovery.highlights.length > 0) {
    return discovery.highlights;
  }

  return [
    {
      title: `${cityTheme.label} Centrum`,
      description: `Ontdek karakteristieke straten, lokale adressen en verrassende plekken in ${cityTheme.label}.`,
      image: cityTheme.heroImage || cityTheme.fallbackImage,
    },
    {
      title: "Culturele hotspots",
      description:
        "Van musea en podia tot tijdelijke expo’s en creatieve locaties.",
      image: cityTheme.fallbackImage,
    },
    {
      title: "Verborgen favorieten",
      description:
        "Kleine cafés, sfeervolle plekken en tips die locals graag delen.",
      image: cityTheme.fallbackImage,
    },
  ];
}

function DayCell({
  day,
  dot,
  active = false,
  muted = false,
  accentColor,
  accentTextColor,
}: {
  day: number;
  dot?: string;
  active?: boolean;
  muted?: boolean;
  accentColor?: string;
  accentTextColor?: string;
}) {
  if (active) {
    return (
      <div className="flex aspect-square items-center justify-center">
        <div
          className="flex h-20 w-20 flex-col items-center justify-center rounded-[1.75rem] border shadow-sm md:h-24 md:w-24"
          style={{
            backgroundColor: accentColor || "#10b981",
            borderColor: accentColor || "#10b981",
            color: accentTextColor || "#ffffff",
          }}
        >
          <span className="text-lg font-semibold md:text-xl">{day}</span>
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
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-100 text-lg font-semibold text-slate-900 md:h-24 md:w-24 md:text-xl">
          {day}
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-[1.5rem] bg-white/70">
      <span className="text-base font-medium text-slate-900 md:text-lg">{day}</span>
      {dot ? <span className={`mt-2 h-2.5 w-2.5 rounded-full ${dot}`} /> : null}
    </div>
  );
}

function CalendarView({ cityTheme }: { cityTheme: CityTheme }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
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
          <DayCell
            day={1}
            accentColor={cityTheme.colors.accent}
            accentTextColor={cityTheme.colors.accentText}
          />

          {calendarDays.slice(1).map((item) => (
            <DayCell
              key={item.day}
              day={item.day}
              dot={item.dot}
              active={item.active}
              muted={item.muted}
              accentColor={cityTheme.colors.accent}
              accentTextColor={cityTheme.colors.accentText}
            />
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">
          Vrijdag 13 Maart
        </h3>

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

function DiscoveryEditorialCalendar({
  cityTheme,
}: {
  cityTheme: CityTheme;
}) {
  const discovery = cityTheme.discovery || {};
  const softSurface = cityTheme.colors.softSurface || "#ebe0c6";

  return (
    <section
      className="rounded-[2rem] p-4 sm:p-6"
      style={{ backgroundColor: softSurface }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#111111] sm:text-2xl">
          Event kalender — {new Date().toLocaleDateString("nl-NL", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white"
            aria-label="Vorige"
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white"
            aria-label="Volgende"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:gap-4">
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {calendarDays.slice(0, 14).map((item) => (
          <DayCell
            key={item.day}
            day={item.day}
            dot={item.dot}
            active={item.active}
            muted={item.muted}
            accentColor={cityTheme.colors.accent}
            accentTextColor={cityTheme.colors.accentText}
          />
        ))}
      </div>

      {discovery.calendarNote ? (
        <p className="mt-4 text-sm text-slate-600">{discovery.calendarNote}</p>
      ) : null}
    </section>
  );
}

function MapPreview({
  cityLabel,
  filteredPlaces,
  cityTheme,
  heightClass = "min-h-[720px]",
}: {
  cityLabel: string;
  filteredPlaces: PlaceItem[];
  cityTheme: CityTheme;
  heightClass?: string;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className={`relative overflow-hidden rounded-2xl bg-[#f3f5f4] ${heightClass}`}>
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg md:h-16 md:w-16">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold md:h-12 md:w-12 md:text-lg"
                style={{
                  backgroundColor: cityTheme.colors.accent,
                  color: cityTheme.colors.accentText,
                }}
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
  );
}

function DefaultPlaceCard({
  place,
  index,
  cityTheme,
}: {
  place: PlaceItem;
  index: number;
  cityTheme: CityTheme;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-0 md:flex-row">
        <div className="relative md:w-[240px]">
          <div
            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-md"
            style={{
              backgroundColor: cityTheme.colors.accent,
              color: cityTheme.colors.accentText,
            }}
          >
            {index + 1}
          </div>

          <div className="relative h-56 w-full md:h-full">
            <Image
              src={place.image}
              alt={place.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold tracking-[0.15em] text-slate-400">
              {place.type}
            </span>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white ${place.badgeColor}`}
            >
              {place.badge}
            </span>
            {place.priceText ? (
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {place.priceText}
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-900 sm:text-[1.75rem]">
            {place.title}
          </h2>

          {place.dateText ? (
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
              {place.dateText}
            </p>
          ) : null}

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {place.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
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
            <div className="mt-6">
              <a
                href={place.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Bekijk bron
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EditorialEventCard({
  place,
  index,
  cityTheme,
}: {
  place: PlaceItem;
  index: number;
  cityTheme: CityTheme;
}) {
  return (
    <article className="flex items-center gap-4 rounded-[1.75rem] bg-white p-3 shadow-sm sm:gap-5 sm:p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] sm:h-28 sm:w-28">
        <Image
          src={place.image}
          alt={place.title}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {place.type}
          </span>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${place.badgeColor}`}
          >
            {place.badge}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-tight text-[#111111] sm:text-2xl">
          {place.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          {place.timeText ? <span>🕘 {place.timeText}</span> : null}
          <span>📍 {place.location}</span>
        </div>

        {place.dateText ? (
          <p className="mt-2 text-sm text-slate-500">{place.dateText}</p>
        ) : null}
      </div>

      <div className="shrink-0">
        {place.sourceUrl ? (
          <a
            href={place.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50"
            aria-label={`Bekijk ${place.title}`}
          >
            ↗
          </a>
        ) : (
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: cityTheme.colors.accent,
              color: cityTheme.colors.accentText,
            }}
          >
            {index + 1}
          </div>
        )}
      </div>
    </article>
  );
}

function DiscoveryHighlightsSection({ cityTheme }: { cityTheme: CityTheme }) {
  const discovery = cityTheme.discovery || {};
  const cards = getHighlightCards(cityTheme);

  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
            {discovery.localSectionTitle || `Iconisch ${cityTheme.label}`}
          </h2>
          <div className="hidden h-px w-40 bg-[#ddd4c8] sm:block" />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium"
          style={{
            backgroundColor: cityTheme.colors.accent,
            color: cityTheme.colors.accentText,
          }}
        >
          {discovery.localSectionCta || "Ontdek alle lokale tips"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((card: any, index: number) => (
          <article
            key={`${card.title}-${index}`}
            className="group relative min-h-[360px] overflow-hidden rounded-[2rem]"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                {card.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DiscoveryNewsletter({ cityTheme }: { cityTheme: CityTheme }) {
  const discovery = cityTheme.discovery || {};

  return (
    <section className="mt-16 rounded-[2rem] bg-[#111111] p-6 text-white sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h3 className="text-2xl font-semibold">
            {discovery.newsletterTitle ||
              `Blijf op de hoogte van ${cityTheme.label}`}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Ontvang nieuwe tips, evenementen en lokale favorieten in je inbox.
          </p>
        </div>

        <form className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <input
            type="email"
            placeholder={discovery.newsletterPlaceholder || "Jouw e-mailadres"}
            className="min-w-[260px] rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full px-5 py-3 text-sm font-medium"
            style={{
              backgroundColor: cityTheme.colors.accent,
              color: cityTheme.colors.accentText,
            }}
          >
            Aanmelden
          </button>
        </form>
      </div>
    </section>
  );
}

function DefaultExploreLayout({
  city,
  cityLabel,
  cityTheme,
  activeCategory,
  setActiveCategory,
  filteredPlaces,
  hasRealEvents,
  isKnownDataCity,
  filters,
  setFilters,
  availableCities,
}: {
  city: string;
  cityLabel: string;
  cityTheme: CityTheme;
  activeCategory: CategoryKey;
  setActiveCategory: (value: CategoryKey) => void;
  filteredPlaces: PlaceItem[];
  hasRealEvents: boolean;
  isKnownDataCity: boolean;
  filters: ExploreFilters;
  setFilters: (filters: ExploreFilters) => void;
  availableCities: { label: string; slug: string }[];
}) {
  return (
    <section
      className="px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: cityTheme.colors.pageBackground }}
    >
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
                    ? "shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                style={
                  isActive
                    ? {
                        backgroundColor: cityTheme.colors.accent,
                        borderColor: cityTheme.colors.accent,
                        color: cityTheme.colors.accentText,
                      }
                    : undefined
                }
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </div>

        {!hasRealEvents && !isKnownDataCity ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Voor{" "}
            <span className="font-semibold text-slate-900">{cityLabel}</span> is
            nog geen data beschikbaar. Probeer een andere stad.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-24 xl:self-start">
            <ExploreFiltersSidebar
              selectedCity={city}
              availableCities={availableCities}
              filters={filters}
              onChange={setFilters}
            />
          </div>

          <div>
            {activeCategory === "kalender" ? (
              <CalendarView cityTheme={cityTheme} />
            ) : (
              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                <div className="space-y-4">
                  {filteredPlaces.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                      Geen resultaten gevonden met deze filters.
                    </div>
                  ) : (
                    filteredPlaces.map((place, index) => (
                      <DefaultPlaceCard
                        key={place.id}
                        place={place}
                        index={index}
                        cityTheme={cityTheme}
                      />
                    ))
                  )}
                </div>

                <MapPreview
                  cityLabel={cityLabel}
                  filteredPlaces={filteredPlaces}
                  cityTheme={cityTheme}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscoveryEditorialLayout({
  city,
  cityLabel,
  cityTheme,
  activeCategory,
  setActiveCategory,
  filteredPlaces,
  filters,
  setFilters,
  availableCities,
}: {
  city: string;
  cityLabel: string;
  cityTheme: CityTheme;
  activeCategory: CategoryKey;
  setActiveCategory: (value: CategoryKey) => void;
  filteredPlaces: PlaceItem[];
  filters: ExploreFilters;
  setFilters: (filters: ExploreFilters) => void;
  availableCities: { label: string; slug: string }[];
}) {
  const discovery = cityTheme.discovery || {};
  const heading = discovery.eyebrow || `${cityLabel} Discovery`;

  return (
    <section
      className="px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: cityTheme.colors.pageBackground }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-24 xl:self-start">
            <ExploreFiltersSidebar
              selectedCity={city}
              availableCities={availableCities}
              filters={filters}
              onChange={setFilters}
            />
          </div>

          <div>
            <header className="max-w-3xl">
              <h1
                className="text-4xl font-semibold tracking-tight sm:text-6xl"
                style={{ color: cityTheme.colors.heading || "#111111" }}
              >
                {heading}
              </h1>

              <p
                className="mt-4 text-lg leading-8"
                style={{ color: cityTheme.colors.text || "#4b4b4b" }}
              >
                {discovery.intro || cityTheme.description}
              </p>
            </header>

            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition"
                    style={
                      isActive
                        ? {
                            backgroundColor: cityTheme.colors.accent,
                            borderColor: cityTheme.colors.accent,
                            color: cityTheme.colors.accentText,
                          }
                        : {
                            backgroundColor: cityTheme.colors.mutedSurface || "#f7f4ed",
                            borderColor: cityTheme.colors.borderSoft || "#e9e2d6",
                            color: "#2f2f2f",
                          }
                    }
                  >
                    <span aria-hidden="true">{category.icon}</span>
                    {category.label}
                  </button>
                );
              })}
            </div>

            {activeCategory === "kalender" ? (
              <div className="mt-8">
                <CalendarView cityTheme={cityTheme} />
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <DiscoveryEditorialCalendar cityTheme={cityTheme} />
                </div>

                <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.95fr]">
                  <div>
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Geselecteerde stad
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-[#111111] sm:text-4xl">
                          {cityLabel}
                        </h2>
                      </div>

                      <Link
                        href={`/ontdek?city=${city}`}
                        className="text-sm font-medium text-slate-700 underline underline-offset-4"
                      >
                        Bekijk alles
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {filteredPlaces.length === 0 ? (
                        <div className="rounded-[1.75rem] bg-white p-6 text-slate-600 shadow-sm">
                          Geen resultaten gevonden met deze filters.
                        </div>
                      ) : (
                        filteredPlaces
                          .slice(0, 3)
                          .map((place, index) => (
                            <EditorialEventCard
                              key={place.id}
                              place={place}
                              index={index}
                              cityTheme={cityTheme}
                            />
                          ))
                      )}
                    </div>
                  </div>

                  <MapPreview
                    cityLabel={cityLabel}
                    filteredPlaces={filteredPlaces}
                    cityTheme={cityTheme}
                    heightClass="min-h-[430px] sm:min-h-[520px]"
                  />
                </div>

                <DiscoveryHighlightsSection cityTheme={cityTheme} />
                <DiscoveryNewsletter cityTheme={cityTheme} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CityExploreView({
  city,
  events,
}: CityExploreViewProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("evenementen");

  const [filters, setFilters] = useState<ExploreFilters>({
    date: "all",
    freeOnly: false,
    distanceKm: 25,
    experienceTypes: [],
  });

  const cityTheme = getCityConfig(city);
  const cityLabel = cityTheme.label;
  const availableCities = buildAvailableCities();

  const eventItems = useMemo<PlaceItem[]>(() => {
    const sortedEvents = sortEventsByStartDate(events || []);

    return sortedEvents.map((event) => {
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
        image: cityTheme.fallbackImage,
        category: "evenementen",
        mapX: "50%",
        mapY: "50%",
        dateText: event.date_text,
        timeText: formatTimeRange(event.start_at, event.end_at),
        sourceUrl: event.source_url,
        isFree: event.is_free,
        priceText: getPriceText(event),
        sortDate: event.start_at,
      };
    });
  }, [events, cityLabel, cityTheme]);

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
      let items = eventItems.length > 0 ? eventItems : fallbackPlaces;

      if (filters.freeOnly) {
        items = items.filter((item) => item.isFree);
      }

      if (filters.date !== "all") {
        const now = new Date();
        const startOfNextWeek = getStartOfNextWeek(now);
        const endOfNextWeek = getEndOfNextWeek(startOfNextWeek);

        items = items.filter((item) => {
          if (!item.sortDate) return false;

          const itemDate = new Date(item.sortDate);

          if (filters.date === "today") {
            return isSameDay(itemDate, now);
          }

          if (filters.date === "weekend") {
            return isThisWeekend(itemDate, now);
          }

          if (filters.date === "nextWeek") {
            return itemDate >= startOfNextWeek && itemDate <= endOfNextWeek;
          }

          return true;
        });
      }

      return items;
    }

    return fallbackPlaces;
  }, [activeCategory, eventItems, fallbackPlaces, filters]);

  const hasRealEvents = eventItems.length > 0;
  const isKnownDataCity = availableCities.some((item) => item.slug === city);

  if (cityTheme.layout === "discoveryEditorial") {
    return (
      <DiscoveryEditorialLayout
        city={city}
        cityLabel={cityLabel}
        cityTheme={cityTheme}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        filteredPlaces={filteredPlaces}
        filters={filters}
        setFilters={setFilters}
        availableCities={availableCities}
      />
    );
  }

  return (
    <DefaultExploreLayout
      city={city}
      cityLabel={cityLabel}
      cityTheme={cityTheme}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      filteredPlaces={filteredPlaces}
      hasRealEvents={hasRealEvents}
      isKnownDataCity={isKnownDataCity}
      filters={filters}
      setFilters={setFilters}
      availableCities={availableCities}
    />
  );
}