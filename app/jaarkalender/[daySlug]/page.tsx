import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { optimizeCssBackground } from "@/lib/remoteImage";
import {
  generateJaarkalenderStaticParams,
  getJaarkalenderDayBySlug,
  getJaarkalenderEventHrefForCard,
  type TimelineCard,
  type TimelineSlot,
} from "../data";

type PageProps = {
  params: {
    daySlug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return generateJaarkalenderStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const day = getJaarkalenderDayBySlug(params.daySlug);

  if (!day) {
    return {
      title: "Dagagenda | Uitjes NL",
    };
  }

  return {
    title: `${day.weekdayDisplay} ${day.dayNumber} ${day.monthDisplay} | Uitjes NL`,
    description: day.intro,
  };
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 3.333v9.334M3.333 8h9.334"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 14s4-3.6 4-7.333A4 4 0 1 0 4 6.667C4 10.4 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.667" r="1.4" fill="currentColor" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.667 4h10.666M4.667 8h6.666M6.667 12h2.666"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarMiniIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CategoryBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-white/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3e342b]">
      {children}
    </span>
  );
}

function FilterPill({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#e5ddd2] bg-[#faf6ef] px-5 text-sm font-medium text-[#25211c] shadow-[0_10px_25px_rgba(59,39,20,0.04)]">
      {icon}
      {children}
    </div>
  );
}

function PosterTile({ card }: { card: TimelineCard }) {
  if (card.image) {
    return (
      <div
        className="h-[150px] w-[150px] shrink-0 overflow-hidden rounded-[2rem] bg-[#15120f] sm:h-[168px] sm:w-[168px]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(12,12,12,0.15), rgba(12,12,12,0.55)), ${optimizeCssBackground(
            card.image,
            {
              width: 460,
              quality: 56,
            }
          )}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div className="relative flex h-[150px] w-[150px] shrink-0 items-end overflow-hidden rounded-[2rem] bg-[#11110f] p-5 text-[#d8c75f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:h-[168px] sm:w-[168px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,190,65,0.14),_transparent_48%)]" />
      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#efe6a8]">
          {card.category}
        </p>
        <p className="mt-2 max-w-[8ch] text-2xl font-semibold leading-none tracking-[-0.05em] text-[#f4e68b]">
          Cultureel
        </p>
      </div>
    </div>
  );
}

function AddButton({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171511] px-5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(24,18,12,0.16)] transition group-hover:bg-[#26221d]">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#171511]">
        <PlusIcon />
      </span>
      {children}
    </span>
  );
}

function renderFeatureCard(daySlug: string, slot: TimelineSlot, card: TimelineCard) {
  return (
    <Link
      href={getJaarkalenderEventHrefForCard(daySlug, slot, card)}
      className="group block rounded-[2.4rem] bg-[#f4e5d8] p-6 shadow-[0_24px_50px_rgba(61,40,22,0.06)] transition hover:-translate-y-1 sm:p-7"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <PosterTile card={card} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge>{card.category}</CategoryBadge>
            <span className="text-sm text-[#6b5b4d]">{card.label}</span>
          </div>
          <h2 className="mt-4 max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.055em] text-[#171511]">
            {card.title}
          </h2>
          <p className="mt-4 max-w-[34rem] text-base leading-8 text-[#58493d]">
            {card.description}
          </p>
          <div className="mt-6">
            <AddButton>{card.primaryAction ?? "Bekijk event"}</AddButton>
          </div>
        </div>
      </div>
    </Link>
  );
}

function renderGridCard(daySlug: string, slot: TimelineSlot, card: TimelineCard) {
  const toneClasses =
    card.tone === "sand"
      ? "bg-[#f8e8bf]"
      : "bg-[#d7efcf]";

  const dotClasses =
    card.tone === "sand" ? "bg-[#ff7a18]" : "bg-[#0db35d]";

  return (
    <Link
      href={getJaarkalenderEventHrefForCard(daySlug, slot, card)}
      className={`group block rounded-[2.1rem] ${toneClasses} p-5 shadow-[0_20px_40px_rgba(61,40,22,0.05)] transition hover:-translate-y-1`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f2a24]">
          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${dotClasses}`} />
          {card.category}
        </div>
        <h3 className="mt-5 max-w-none text-[2rem] leading-[0.96] tracking-[-0.05em] text-[#171511]">
          {card.title}
        </h3>
        <p className="mt-4 max-w-[26rem] text-sm leading-7 text-[#5a4f45]">
          {card.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          <p className="text-sm font-medium text-[#171511]">{card.location}</p>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/8 text-[#171511] transition group-hover:bg-black/14">
            <CalendarMiniIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

function renderHeroCard(daySlug: string, slot: TimelineSlot, card: TimelineCard) {
  return (
    <Link
      href={getJaarkalenderEventHrefForCard(daySlug, slot, card)}
      className="group relative block overflow-hidden rounded-[2.5rem] bg-[#171511] p-6 text-white shadow-[0_30px_70px_rgba(15,18,23,0.24)] sm:p-9"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14,18,20,0.18), rgba(14,18,20,0.72)), ${optimizeCssBackground(
          card.image ?? "",
          {
            width: 1280,
            quality: 56,
          }
        )}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,13,0.6),rgba(8,10,13,0.18))]" />
      <div className="relative max-w-[40rem]">
        <CategoryBadge>{card.category}</CategoryBadge>
        <h2 className="mt-7 max-w-none text-[clamp(2.4rem,5vw,4.3rem)] leading-[0.92] tracking-[-0.065em] text-white">
          {card.title}
        </h2>
        <p className="mt-4 text-[1.05rem] leading-8 text-white/86">
          {card.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d1f289] px-6 text-sm font-semibold text-[#171511] transition group-hover:bg-[#c2e875]">
            {card.primaryAction ?? "Bekijk event"}
          </span>
          <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 text-sm font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/14">
            <PlusIcon />
            {card.secondaryAction ?? "Meer info"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function renderCompactCard(daySlug: string, slot: TimelineSlot, card: TimelineCard) {
  return (
    <Link
      href={getJaarkalenderEventHrefForCard(daySlug, slot, card)}
      className="group block rounded-[2rem] border border-[#ece3d7] bg-white p-5 shadow-[0_18px_40px_rgba(61,40,22,0.04)] transition hover:-translate-y-1 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe5e4] text-[#f25454]">
            <CalendarMiniIcon />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ef4e4e]">
              {card.metaNote ?? card.category}
            </p>
            <h3 className="mt-2 max-w-none text-[1.8rem] leading-[0.98] tracking-[-0.05em] text-[#171511]">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-[#66594e]">{card.location}</p>
          </div>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#171511] text-white transition group-hover:bg-[#2a241f]">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

function renderSlot(daySlug: string, slot: TimelineSlot) {
  if (slot.display === "feature") {
    return renderFeatureCard(daySlug, slot, slot.cards[0]);
  }

  if (slot.display === "grid") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {slot.cards.map((card) => (
          <div key={`${slot.time}-${card.title}`}>
            {renderGridCard(daySlug, slot, card)}
          </div>
        ))}
      </div>
    );
  }

  if (slot.display === "hero") {
    return renderHeroCard(daySlug, slot, slot.cards[0]);
  }

  return renderCompactCard(daySlug, slot, slot.cards[0]);
}

function SlotAccent({
  accent,
  children,
}: {
  accent: TimelineSlot["accent"];
  children: ReactNode;
}) {
  const accentClass =
    accent === "red"
      ? "bg-[#ef5b5b]"
      : accent === "amber"
        ? "bg-[#ff9f45]"
        : "bg-[#c8ef87]";

  return (
    <div className="relative flex items-center gap-4 md:block">
      <div className="text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-[#171511] sm:text-[2.7rem]">
        {children}
      </div>
      <span className={`inline-flex h-1.5 w-8 rounded-full ${accentClass}`} />
    </div>
  );
}

export default function JaarkalenderDayPage({ params }: PageProps) {
  const day = getJaarkalenderDayBySlug(params.daySlug);

  if (!day) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#171511]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[44rem]">
            <Link
              href="/jaarkalender"
              className="text-sm font-medium uppercase tracking-[0.24em] text-[#8a7c6d] transition hover:text-[#4d433a]"
            >
              Nederland / Agenda
            </Link>
            <h1 className="mt-5 max-w-none text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-[-0.075em] text-[#171511]">
              {day.weekdayDisplay}
              <span className="ml-2">{day.dayNumber}</span>
              <span className="ml-3 text-[#c9ef87]">{day.monthDisplay}</span>
            </h1>
            <p className="mt-5 max-w-[36rem] text-[1.05rem] leading-8 text-[#5e5248]">
              {day.intro}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterPill icon={<PinIcon />}>Stad: {day.filterCity}</FilterPill>
            <FilterPill icon={<FilterIcon />}>
              Categorie: {day.filterCategory}
            </FilterPill>
          </div>
        </div>

        <div className="mt-12 space-y-10">
          {day.timeline.map((slot, index) => (
            <section
              key={`${slot.time}-${index}`}
              className="grid gap-5 md:grid-cols-[8.5rem_1fr] md:gap-8"
            >
              <div className="relative pb-2 md:pb-10">
                <SlotAccent accent={slot.accent}>{slot.time}</SlotAccent>
                {index < day.timeline.length - 1 ? (
                  <div className="absolute left-[0.72rem] top-20 hidden h-[calc(100%+3rem)] w-px bg-[#e8dfd3] md:block" />
                ) : null}
              </div>
              <div>{renderSlot(day.slug, slot)}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
