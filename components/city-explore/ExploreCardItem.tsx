"use client";

import Link from "next/link";

import FavouriteButton from "@/components/FavouriteButton";

import type { ExploreCard } from "./types";

type ExploreCardItemProps = {
  card: ExploreCard;
  isSelected: boolean;
  onSelect: () => void;
  variant?: "default" | "flow";
};

type ActivityIconName =
  | "utensils"
  | "landmark"
  | "trees"
  | "family"
  | "active"
  | "water"
  | "music"
  | "theater"
  | "market"
  | "paw"
  | "calendar"
  | "sparkles"
  | "home"
  | "compass";

/** Chooses a presentational icon from the same card data used throughout /ontdek. */
function getExploreActivityIcon(card: ExploreCard): ActivityIconName {
  const text = [card.label, card.kind, ...(card.tags ?? []), card.title]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("nl-NL");

  if (/eten|restaurant|cafe|café|food|drank|diner|lunch|borrel/.test(text)) return "utensils";
  if (/museum|cultuur|kunst|expositie|galerie|histor/.test(text)) return "landmark";
  if (/wandeling|natuur|park|bos|tuin|route/.test(text)) return "trees";
  if (/kind|gezin|familie|speel/.test(text)) return "family";
  if (/sport|actief|fitness|klim|fiets/.test(text)) return "active";
  if (/zwem|water|boot|safari|vaart/.test(text)) return "water";
  if (/muziek|concert|live.?set|jazz/.test(text)) return "music";
  if (/theater|voorstelling|toneel|film|bioscoop/.test(text)) return "theater";
  if (/markt|winkel|shop/.test(text)) return "market";
  if (/dier|zoo|zoö/.test(text)) return "paw";
  if (/festival|evenement|event/.test(text)) return "calendar";
  if (/wellness|ontspan|relax|spa/.test(text)) return "sparkles";
  if (/binnen|indoor/.test(text)) return "home";
  return "compass";
}

function ActivityIcon({ name }: { name: ActivityIconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<ActivityIconName, React.ReactNode> = {
    utensils: <><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M16.5 3v18M16.5 3c3 1 3 6 0 7" /></>,
    landmark: <><path d="m3 9 9-5 9 5M5 10h14M6 20h12M8 10v7M12 10v7M16 10v7" /></>,
    trees: <><path d="M12 21v-7M7 21v-5M17 21v-5M12 3 7 12h10L12 3ZM7 7l-4 8h8L7 7Zm10 0-4 8h8l-4-8Z" /></>,
    family: <><circle cx="9" cy="8" r="2.5" /><circle cx="16" cy="9" r="2" /><path d="M4.5 20c.3-4 2.1-6 4.5-6s4.2 2 4.5 6M13 20c.2-3 1.4-4.5 3.2-4.5 1.7 0 3 1.5 3.3 4.5" /></>,
    active: <><path d="M4 8v8M7 6v12M17 6v12M20 8v8M4 10h3M17 10h3M4 14h3M17 14h3M7 12h10" /></>,
    water: <><path d="M3 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M3 14c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" /></>,
    music: <><path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-2-2.4M19 16a2.5 2.5 0 1 1-2-2.4M9 10l10-2" /></>,
    theater: <><path d="M5 4h14v13H5zM8 9c1 1 2 1 3 0M13 9c1 1 2 1 3 0M8 13c2 2 6 2 8 0M7 20h10" /></>,
    market: <><path d="M4 9h16l-1-5H5L4 9ZM5 9v10h14V9M9 19v-6h6v6" /></>,
    paw: <><circle cx="8" cy="8" r="1.5" /><circle cx="16" cy="8" r="1.5" /><circle cx="6" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /><path d="M12 12c-3 0-4.5 2.4-4.5 4.5 0 1.2 1 2 2.2 1.7l2.3-.8 2.3.8c1.2.3 2.2-.5 2.2-1.7C16.5 14.4 15 12 12 12Z" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M9 14h.01M15 14h.01M9 17h.01M15 17h.01" /></>,
    sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
    home: <><path d="m3 11 9-7 9 7v9H3v-9ZM9 20v-5h6v5" /></>,
    compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" {...common}>{paths[name]}</svg>;
}

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="m12 3.6 2.44 4.94 5.45.79-3.94 3.84.93 5.43L12 16.03 7.12 18.6l.93-5.43L4.11 9.33l5.45-.79L12 3.6Z" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.7 7-12a7 7 0 1 0-14 0c0 6.3 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></svg>;
}

function ClockIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>;
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h13M13 7l5 5-5 5" /></svg>;
}

function formatRating(card: ExploreCard) {
  const value = card.ratingValue ?? card.rating;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rating = new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  const reviews = typeof card.reviewCount === "number" && Number.isFinite(card.reviewCount)
    ? ` · ${new Intl.NumberFormat("nl-NL").format(card.reviewCount)}`
    : "";
  return { label: `${rating}${reviews}`, title: card.ratingSource ? `${rating}${reviews} via ${card.ratingSource}` : `${rating}${reviews}` };
}

function getHighlightLabel(card: ExploreCard) {
  if (card.editorsPick) return "Redactietip";
  if (card.featured) return "Uitgelicht";
  if (card.hiddenGem) return "Verborgen tip";
  if ((card.priorityScore ?? 0) >= 80) return "Aanrader";
  return null;
}

export default function ExploreCardItem({
  card,
  isSelected,
  onSelect,
  variant = "default",
}: ExploreCardItemProps) {
  const rating = formatRating(card);
  const highlight = getHighlightLabel(card);
  const eventId = typeof card.eventId === "number" && card.eventId > 0 ? card.eventId : null;
  const activityIcon = getExploreActivityIcon(card);
  const metadata = [
    card.location,
    card.time && card.time !== "Tijd volgt" ? card.time : null,
    rating ? `★ ${rating.label}` : null,
  ].filter(Boolean);

  const isFlowVariant = variant === "flow";

  return (
    <article
      onMouseEnter={onSelect}
      className={`group relative ${
        isFlowVariant
          ? "overflow-hidden rounded-[1.5rem] border border-[#DCE1DC] bg-white/82 shadow-[0_14px_30px_rgba(41,52,47,0.06)]"
          : `border-b border-[#DCE1DC] last:border-b-0 ${
              isSelected ? "bg-white/72" : "bg-transparent"
            }`
      }`}
    >
      <Link
        href={card.href}
        onFocus={onSelect}
        onClick={onSelect}
        aria-label={`Bekijk ${card.title}`}
        className={`grid min-h-30 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-x-3 gap-y-2 py-5 pr-14 transition sm:min-h-28 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(6rem,auto)_2.75rem] sm:gap-x-5 sm:pr-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005FCC] ${
          isFlowVariant
          ? "min-h-36 px-5 py-6 hover:bg-[#F7FAF6] sm:px-6"
            : "sm:px-3 sm:hover:bg-white/70"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDEBE2] text-[#1D5A46]" aria-hidden="true">
          <ActivityIcon name={activityIcon} />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-semibold tracking-[0.13em] text-[#1D5A46]">
              {card.label}
            </span>
            {highlight ? (
              <span className="rounded-full bg-[#DDEBE2] px-2 py-0.5 text-[0.65rem] font-semibold text-[#1D5A46]">
                {highlight}
              </span>
            ) : null}
          </span>
          <span className="mt-1 block truncate text-lg font-semibold tracking-[-0.025em] text-[#29342F] sm:text-xl">
            {card.title}
          </span>
          {metadata.length ? (
            <span
              title={rating?.title}
              className="mt-1 block truncate text-sm text-[#65736C]"
            >
              {metadata.join(" · ")}
            </span>
          ) : null}
        </span>
        {card.price ? (
          <span className="col-start-2 text-sm font-semibold text-[#1D5A46] sm:col-start-auto sm:text-right">
            {card.price}
          </span>
        ) : null}
        <span className="col-start-3 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#1D5A46] text-white transition group-hover:bg-[#355E7A]" aria-hidden="true">
          <ArrowIcon />
        </span>
      </Link>
      {eventId ? (
        <div className="absolute right-14 top-5 z-10 sm:right-[4.75rem]">
          <FavouriteButton eventId={eventId} variant="compact" />
        </div>
      ) : null}
    </article>
  );
}
