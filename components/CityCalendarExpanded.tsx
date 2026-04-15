"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import CityCalendarDayDetail from "@/components/CityCalendarDayDetail";

type CalendarEventCard = {
  id: number;
  title: string;
  category: string;
  time: string;
  location: string;
  description: string;
  image: string;
  variant: "small" | "feature" | "hero" | "surprise";
  day: number;
  weekdayShort: string;
};

type CityCalendarExpandedProps = {
  cityLabel: string;
  monthLabel?: string;
  accentColor?: string;
  accentSoftColor?: string;
  initialDay?: number;
  onClose?: () => void;
};
const staticCalendarData: CalendarEventCard[] = [
  {
    id: 1,
    title: "Vermeer’s Modern Echo: New Perspectives",
    category: "Art",
    time: "10:00 - 13:00",
    location: "Mauritshuis",
    description:
      "A curated tour exploring the dialogue between Dutch masters and contemporary interpretations.",
    image: "/images/apeldoorn_img.jpg",
    variant: "small",
    day: 9,
    weekdayShort: "WED",
  },
  {
    id: 2,
    title: "Royal Walk: Binnenhof Heritage",
    category: "Culture",
    time: "09:30 - 11:00",
    location: "Binnenhof",
    description:
      "Discover the political heart of the Netherlands through its architectural and historical layers.",
    image: "/images/julianatoren.jpg",
    variant: "small",
    day: 9,
    weekdayShort: "WED",
  },
  {
    id: 3,
    title: "Noon Classical: Strings at the Beach",
    category: "Theatre & Music",
    time: "14:00",
    location: "Scheveningen Pier",
    description:
      "An open-air performance with the North Sea as the backdrop.",
    image: "/images/apeldoorn_img.jpg",
    variant: "feature",
    day: 9,
    weekdayShort: "WED",
  },
  {
    id: 4,
    title: "Surprise speciaal geselecteerd",
    category: "Curated",
    time: "",
    location: "",
    description: "Let us pick your next hour based on your mood.",
    image: "",
    variant: "surprise",
    day: 9,
    weekdayShort: "WED",
  },
  {
    id: 5,
    title: "Jazz Nights: The Main Stage",
    category: "Music Festival",
    time: "20:00 - 23:30",
    location: "Paard, Prinsegracht",
    description:
      "A night of avant-garde fusion and world-class jazz in the heart of the city.",
    image: "/images/julianatoren.jpg",
    variant: "hero",
    day: 9,
    weekdayShort: "WED",
  },
];

const visibleDays = [
  { weekday: "MON", day: 7 },
  { weekday: "TUE", day: 8 },
  { weekday: "WED", day: 9 },
  { weekday: "THU", day: 10 },
  { weekday: "FRI", day: 11 },
  { weekday: "SAT", day: 12 },
  { weekday: "SUN", day: 13 },
];

function ArrowCircleButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Vorige dag" : "Volgende dag"}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black transition hover:bg-white"
    >
      <span className="text-xl leading-none">
        {direction === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[94px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[999px] border text-center transition sm:h-[102px] sm:w-[82px] ${
        active
          ? "border-[#b8ec80] bg-[#b8ec80] text-[#111111] shadow-[0_10px_24px_rgba(184,236,128,0.32)]"
          : "border-black/5 bg-white text-[#111111] hover:border-black/10"
      }`}
    >
      <span className="text-[11px] font-medium tracking-[0.14em] text-black/45">
        {weekday}
      </span>
      <span className="mt-1 text-[2rem] font-semibold leading-none">{day}</span>
    </button>
  );
}

function SectionRail({
  label,
  timeLabel,
}: {
  label: string;
  timeLabel: string;
}) {
  return (
    <div className="hidden lg:flex lg:w-[64px] lg:flex-col lg:items-start">
      <span className="text-[10px] uppercase tracking-[0.18em] text-black/20">
        {label}
      </span>
      <span className="mt-7 text-[12px] font-medium text-black/35">
        {timeLabel}
      </span>
    </div>
  );
}

function SmallEventCard({ item }: { item: CalendarEventCard }) {
  return (
    <article className="grid min-h-[192px] overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.06)] md:grid-cols-[180px_1fr]">
      <div className="relative min-h-[192px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 180px"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-[#111111] shadow-sm">
          {item.category}
        </div>
      </div>

      <div className="flex flex-col justify-between bg-[#eceaf4] p-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-black/55">
            <span>◷</span>
            <span>{item.time}</span>
          </div>

          <h3 className="mt-4 max-w-[22rem] text-[1.9rem] font-semibold leading-[1.05] tracking-tight text-[#111111]">
            {item.title}
          </h3>

          <p className="mt-4 max-w-[28rem] text-[14px] leading-6 text-black/55">
            {item.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-[13px] text-black/55">📍 {item.location}</div>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-lg text-white transition hover:scale-[1.03]"
            aria-label="Bekijk event"
          >
            →
          </button>
        </div>
      </div>
    </article>
  );
}

function FeatureEventCard({ item }: { item: CalendarEventCard }) {
  return (
    <article className="grid overflow-hidden rounded-[2rem] bg-[#d9ecd8] shadow-[0_10px_30px_rgba(17,17,17,0.06)] lg:grid-cols-[1.05fr_1fr]">
      <div className="p-8 sm:p-10">
        <div className="inline-flex rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#111111]">
          {item.category}
        </div>

        <h3 className="mt-6 max-w-[24rem] text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-[#111111]">
          {item.title}
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] text-[#111111]">
          <span>◷ {item.time}</span>
          <span>📍 {item.location}</span>
        </div>

        <p className="mt-6 max-w-[30rem] text-[15px] leading-7 text-black/65">
          {item.description}
        </p>

        <button
          type="button"
          className="mt-8 inline-flex items-center rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Book Tickets
        </button>
      </div>

      <div className="relative min-h-[280px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </article>
  );
}

function SurpriseCard() {
  return (
    <article className="flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] border border-black/6 bg-white px-8 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b8ec80] text-[#111111]">
        ✦
      </div>

      <h3 className="mt-6 text-[1.8rem] font-semibold tracking-tight text-[#111111]">
        Surprise speciaal geselecteerd
      </h3>

      <p className="mt-4 max-w-[17rem] text-[14px] leading-6 text-black/55">
        Let us pick your next hour based on your mood.
      </p>

      <button
        type="button"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[#111111] px-8 text-sm font-medium tracking-[0.18em] text-[#111111] transition hover:bg-[#111111] hover:text-white"
      >
        SURPRISE ME
      </button>
    </article>
  );
}

function HeroEventCard({ item }: { item: CalendarEventCard }) {
  return (
    <article className="relative overflow-hidden rounded-[2.25rem] shadow-[0_20px_60px_rgba(17,17,17,0.18)]">
      <div className="relative min-h-[360px] sm:min-h-[460px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.55))]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <div className="inline-flex rounded-full bg-[#c9f18f] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#111111]">
            {item.category}
          </div>

          <h3 className="mt-5 max-w-[40rem] text-[2.4rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[3.2rem]">
            {item.title}
          </h3>

          <p className="mt-5 max-w-[34rem] text-[15px] leading-7 text-white/78">
            {item.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] bg-[rgba(62,67,108,0.7)] p-5 text-white backdrop-blur-md">
            <div className="space-y-3 text-[15px]">
              <div>◷ {item.time}</div>
              <div>📍 {item.location}</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#b8ec80] px-6 text-base font-medium text-[#111111] transition hover:opacity-95"
          >
            Secure Spot
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CityCalendarExpanded({
  cityLabel,
  monthLabel = "October",
  accentColor = "#b8ec80",
  accentSoftColor = "#f2e7df",
  initialDay = 9,
  onClose,
}: CityCalendarExpandedProps) {
  const [selectedDay, setSelectedDay] = useState(initialDay ?? 9);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const selectedDayItems = useMemo(() => {
    return staticCalendarData.filter((item) => item.day === selectedDay);
  }, [selectedDay]);

  const firstRowItems = selectedDayItems.filter((item) => item.variant === "small");
  const featureItem = selectedDayItems.find((item) => item.variant === "feature");
  const surpriseItem = selectedDayItems.find((item) => item.variant === "surprise");
  const heroItem = selectedDayItems.find((item) => item.variant === "hero");

  if (showDayDetail) {
    return (
      <CityCalendarDayDetail
        cityLabel={cityLabel}
        onBack={() => setShowDayDetail(false)}
      />
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[2.5rem] bg-[#f8f6f2] shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
      <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 border-b border-black/6 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div
              className="inline-flex rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#111111]"
              style={{ backgroundColor: accentColor }}
            >
              Weekly agenda
            </div>

            <h2 className="mt-6 text-[3rem] font-semibold leading-[0.95] tracking-tight text-[#111111] sm:text-[4.2rem] lg:text-[5.4rem]">
              {monthLabel} in{" "}
              <span className="text-[#c5ccb9]">{cityLabel}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start">
            <ArrowCircleButton direction="left" />
            <ArrowCircleButton direction="right" />
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="ml-2 inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-[#111111] transition hover:bg-[#111111] hover:text-white"
              >
                Sluiten
              </button>
            ) : null}
          </div>
        </div>

        <div
          className="mt-8 rounded-[2.25rem] px-4 py-5 sm:px-6 sm:py-6"
          style={{ backgroundColor: accentSoftColor }}
        >
          <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4">
            {visibleDays.map((item) => (
              <DayPill
                key={item.day}
                weekday={item.weekday}
                day={item.day}
                active={selectedDay === item.day}
                onClick={() => {
                  setSelectedDay(item.day);
                  setShowDayDetail(true);
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          <div className="grid gap-6 lg:grid-cols-[64px_1fr]">
            <SectionRail label="Morning set" timeLabel="09:00" />

            <div className="grid gap-6 xl:grid-cols-2">
              {firstRowItems.map((item) => (
                <SmallEventCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[64px_1fr]">
            <SectionRail label="Afternoon" timeLabel="14:00" />

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.72fr]">
              {featureItem ? <FeatureEventCard item={featureItem} /> : null}
              {surpriseItem ? <SurpriseCard /> : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[64px_1fr]">
            <SectionRail label="Evening" timeLabel="20:00" />
            <div>{heroItem ? <HeroEventCard item={heroItem} /> : null}</div>
          </div>
        </div>
      </div>
    </section>
  );
}