"use client";

import Link from "next/link";

import FavouriteButton from "@/components/FavouriteButton";

import type { ExploreCard } from "./types";

type ExploreCardItemProps = {
  card: ExploreCard;
  isSelected: boolean;
  onSelect: () => void;
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

export default function ExploreCardItem({ card, isSelected, onSelect }: ExploreCardItemProps) {
  const rating = formatRating(card);
  const highlight = getHighlightLabel(card);
  const eventId = typeof card.eventId === "number" && card.eventId > 0 ? card.eventId : null;
  const activityIcon = getExploreActivityIcon(card);

  return (
    <article onMouseEnter={onSelect} className={`group relative flex min-w-0 flex-col rounded-[1.45rem] border p-4 transition duration-200 sm:p-5 ${isSelected ? "border-[#a8ca62] bg-[#fbfff4] shadow-[0_18px_38px_rgba(109,144,51,0.18)]" : "border-white/80 bg-white/76 shadow-[0_14px_32px_rgba(75,92,52,0.08)] hover:-translate-y-1 hover:border-[#d1e6aa] hover:bg-white hover:shadow-[0_20px_42px_rgba(75,92,52,0.12)]"}`}>
      <Link href={card.href} onFocus={onSelect} onClick={onSelect} className="absolute inset-0 z-0 rounded-[1.45rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f923e]" aria-label={`Bekijk ${card.title}`} />

      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f3c9] text-[#2f7046] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <ActivityIcon name={activityIcon} />
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {rating ? <span title={rating.title} className="inline-flex items-center gap-1 rounded-full border border-[#edf0df] bg-white/84 px-2.5 py-1 text-xs font-semibold text-[#5d654f]"><StarIcon />{rating.label}</span> : null}
          {eventId ? <div className="pointer-events-auto relative z-20"><FavouriteButton eventId={eventId} variant="compact" /></div> : null}
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mt-4 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#4d914f]">{card.label}</span>
          {highlight ? <span className="rounded-full bg-[#eff7d8] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#586d29]">{highlight}</span> : null}
        </div>
        <h3 className="mt-2 text-[1.12rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#273229] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">{card.title}</h3>
        <p className="mt-2 min-h-[3rem] text-sm leading-5 text-[#687164] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">{card.description || "Een zorgvuldig geselecteerd moment in de stad."}</p>
      </div>

      <div className="pointer-events-none relative z-10 mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#ebeee4] pt-3 text-xs text-[#737c70]">
        <span className="flex min-w-0 items-center gap-1.5 truncate"><PinIcon />{card.location}</span>
        <span className="flex min-w-0 items-center gap-1.5 truncate"><ClockIcon />{card.time}</span>
        <span className="font-medium text-[#586751]">{card.price || "Prijs volgt"}</span>
        <span className="flex items-center justify-end gap-1 font-semibold text-[#4d914f]">Bekijk details <ArrowIcon /></span>
      </div>
    </article>
  );
}
