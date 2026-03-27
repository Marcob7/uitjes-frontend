"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type DayDetailEvent = {
  id: number;
  hour: string;
  timelineLabel?: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  location: string;
  image: string;
  background: string;
  dark?: boolean;
};

type DayItem = {
  weekday: string;
  day: number;
};

type CityCalendarDayDetailProps = {
  cityLabel: string;
  onBack?: () => void;
};

const visibleDays: DayItem[] = [
  { weekday: "MON", day: 7 },
  { weekday: "TUE", day: 8 },
  { weekday: "WED", day: 9 },
  { weekday: "THU", day: 10 },
  { weekday: "FRI", day: 11 },
  { weekday: "SAT", day: 12 },
  { weekday: "SUN", day: 13 },
];

const staticEventsByDay: Record<number, DayDetailEvent[]> = {
  9: [
    {
      id: 1,
      hour: "10:00",
      timelineLabel: "SUNRISE OVER THE BINNENHOF",
      title: "Vermeer's Modern Echo",
      category: "ART EXHIBITION",
      duration: "3 hours",
      description:
        "Experience the timeless legacy of the Delft master through a contemporary lens. An immersive dialogue between classical Dutch light and modern digital art at the historic Mauritshuis.",
      location: "Mauritshuis, Plein 29",
      image: "/images/apeldoorn_img.jpg",
      background: "#f7f7f7",
    },
    {
      id: 2,
      hour: "14:00",
      timelineLabel: "LUNCH ALONG THE LANGE VOORHOUT",
      title: "Noon Classical: Strings at the Beach",
      category: "LIVE MUSIC",
      duration: "2.5 hours",
      description:
        "An open-air performance where the sound of salt-sprayed violins merges with the North Sea breeze. An ethereal afternoon of Vivaldi and Richter on the iconic pier.",
      location: "Scheveningen Pier",
      image: "/images/julianatoren.jpg",
      background: "#efe2b8",
    },
    {
      id: 3,
      hour: "20:00",
      timelineLabel: "GOLDEN HOUR AT THE PEACE PALACE",
      title: "Den Haag Jazz Nights",
      category: "JAZZ NIGHT",
      duration: "3.5 hours",
      description:
        "The legendary Paard transforms into a subterranean jazz sanctuary. Local virtuosos and international guests explore the boundaries of bebop and contemporary fusion.",
      location: "Paard, Prinsegracht 12",
      image: "/images/apeldoorn_img.jpg",
      background: "#121212",
      dark: true,
    },
  ],
};

function DayPill({
  weekday,
  day,
  active,
  onClick,
}: {
  weekday: string;
  day: number;
  active: boolean;
  onClick: () => void;
}) {
  const activeStyles = {
    7: "#f3e7e0",
    8: "#d8eccf",
    9: "#b8ec80",
    10: "#efe2b8",
    11: "#e7e6f4",
    12: "#c8ec9f",
    13: "#f4ebe5",
  } as Record<number, string>;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[82px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[28px] border transition sm:h-[92px] sm:w-[82px] ${
        active
          ? "border-white/40 shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
          : "border-transparent bg-white hover:border-black/10"
      }`}
      style={{
        backgroundColor: active ? activeStyles[day] || "#b8ec80" : "#ffffff",
      }}
    >
      <span className="text-[11px] font-medium tracking-[0.14em] text-black/40">
        {weekday}
      </span>
      <span className="mt-1 text-[2rem] font-semibold leading-none text-[#111111]">
        {day}
      </span>
    </button>
  );
}

function TopBar({
  cityLabel,
  selectedDay,
  onBack,
}: {
  cityLabel: string;
  selectedDay: number;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-sm text-black/50">
          Wednesday, Oct {selectedDay}
        </p>

        <h2 className="mt-3 text-[3.2rem] font-semibold leading-[0.92] tracking-tight text-[#111111] sm:text-[4.4rem]">
          {cityLabel}
          <br />
          <span className="text-[#4d7a2b]">Daily Pulse</span>
        </h2>

        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/60">
          A curated selection of cultural echoes and coastal rhythms in the city.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-[#111111] transition hover:bg-black hover:text-white"
          >
            Terug
          </button>
        ) : null}

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:bg-black hover:text-white"
          aria-label="Vorige dag"
        >
          ‹
        </button>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:bg-black hover:text-white"
          aria-label="Volgende dag"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function TimelineHour({ value }: { value: string }) {
  return (
    <div className="w-[56px] shrink-0 text-right text-[14px] font-medium text-black/45">
      {value}
    </div>
  );
}

function TimelineSpacer({ hour }: { hour: string }) {
  return (
    <div className="grid grid-cols-[56px_24px_1fr] items-start gap-0">
      <TimelineHour value={hour} />

      <div className="relative flex justify-center">
        <div className="h-20 w-px bg-black/8" />
      </div>

      <div />
    </div>
  );
}

function TimelineEventCard({ item }: { item: DayDetailEvent }) {
  const isDark = Boolean(item.dark);

  return (
    <article
      className="grid overflow-hidden rounded-[2rem] shadow-[0_16px_44px_rgba(0,0,0,0.08)] lg:grid-cols-[180px_1fr]"
      style={{ backgroundColor: item.background }}
    >
      <div className="relative min-h-[220px] lg:min-h-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 180px"
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em]"
            style={{
              backgroundColor: isDark ? "#b8ec80" : "#dff0cc",
              color: "#111111",
            }}
          >
            {item.category}
          </span>

          <span
            className={`text-[12px] ${
              isDark ? "text-white/60" : "text-black/45"
            }`}
          >
            {item.duration}
          </span>
        </div>

        <h3
          className={`mt-5 max-w-3xl text-[2.2rem] font-semibold leading-[1.02] tracking-tight sm:text-[2.8rem] ${
            isDark ? "text-[#b8ec80]" : "text-[#111111]"
          }`}
        >
          {item.title}
        </h3>

        <p
          className={`mt-4 max-w-3xl text-[15px] leading-7 ${
            isDark ? "text-white/78" : "text-black/62"
          }`}
        >
          {item.description}
        </p>

        <p
          className={`mt-5 text-[14px] font-medium ${
            isDark ? "text-white" : "text-[#111111]"
          }`}
        >
          📍 {item.location}
        </p>

        <button
          type="button"
          className={`mt-7 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition ${
            isDark
              ? "bg-[#b8ec80] text-[#111111] hover:opacity-95"
              : "bg-[#b8ec80] text-[#111111] hover:opacity-95"
          }`}
        >
          Add to Calendar
        </button>
      </div>
    </article>
  );
}

function TimelineSection({
  item,
  showTopLabel,
}: {
  item: DayDetailEvent;
  showTopLabel: boolean;
}) {
  return (
    <div>
      {showTopLabel && item.timelineLabel ? (
        <div className="mb-5 grid grid-cols-[56px_24px_1fr] items-center">
          <div />
          <div className="relative flex justify-center">
            <div className="h-6 w-px bg-black/8" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-black/30">
            {item.timelineLabel}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-[56px_24px_1fr] items-start">
        <TimelineHour value={item.hour} />

        <div className="relative flex h-full justify-center">
          <div className="absolute top-0 h-full w-px bg-black/8" />
        </div>

        <div className="pb-12">
          <TimelineEventCard item={item} />
        </div>
      </div>
    </div>
  );
}

function BottomHours() {
  return (
    <div className="space-y-0">
      {["21:00"].map((hour) => (
        <TimelineSpacer key={hour} hour={hour} />
      ))}
    </div>
  );
}

export default function CityCalendarDayDetail({
  cityLabel,
  onBack,
}: CityCalendarDayDetailProps) {
  const [selectedDay, setSelectedDay] = useState(9);

  const events = useMemo(() => {
    return staticEventsByDay[selectedDay] || [];
  }, [selectedDay]);

  return (
    <section className="mt-8 rounded-[2.5rem] bg-[#f7f5f1] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <TopBar cityLabel={cityLabel} selectedDay={selectedDay} onBack={onBack} />

      <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
        {visibleDays.map((item) => (
          <DayPill
            key={item.day}
            weekday={item.weekday}
            day={item.day}
            active={selectedDay === item.day}
            onClick={() => setSelectedDay(item.day)}
          />
        ))}
      </div>

      <div className="mt-10">
        <div className="space-y-0">
          <TimelineSpacer hour="08:00" />
          <TimelineSpacer hour="09:00" />

          {events.map((item, index) => (
            <TimelineSection
              key={item.id}
              item={item}
              showTopLabel={index > 0 || Boolean(item.timelineLabel)}
            />
          ))}

          <BottomHours />
        </div>
      </div>
    </section>
  );
}