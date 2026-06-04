"use client";

import Image from "next/image";
import Link from "next/link";

import FavouriteButton from "@/components/FavouriteButton";
import { optimizeRemoteImageUrl } from "@/lib/remoteImage";

import type { ExploreCard } from "./types";

type ExploreCardItemProps = {
  card: ExploreCard;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
};

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="m12 3.6 2.44 4.94 5.45.79-3.94 3.84.93 5.43L12 16.03 7.12 18.6l.93-5.43L4.11 9.33l5.45-.79L12 3.6Z" />
    </svg>
  );
}

function getStatusClass(status: string | undefined) {
  const normalizedStatus = status?.toLowerCase() || "";

  if (
    normalizedStatus.includes("sluit") ||
    normalizedStatus.includes("gesloten") ||
    normalizedStatus.includes("afgelopen")
  ) {
    return "text-[#a7523f]";
  }

  return "text-[#526f2f]";
}

function getImageAccent(index: number) {
  if (index % 4 === 0) {
    return "from-[#f7e7c8]/22 via-transparent to-[#2a1b12]/34";
  }

  if (index % 4 === 1) {
    return "from-[#deeddc]/24 via-transparent to-[#182615]/30";
  }

  if (index % 4 === 2) {
    return "from-[#f6d9d2]/24 via-transparent to-[#2d1510]/30";
  }

  return "from-[#e4ebf5]/24 via-transparent to-[#161f2c]/30";
}

function buildTags(card: ExploreCard) {
  return [card.distance, card.location].filter(
    (value, index, items): value is string =>
      Boolean(value) && items.indexOf(value) === index
  );
}

function buildLocationLine(card: ExploreCard) {
  return [card.location, card.distance].filter(Boolean).join(" / ");
}

function formatRatingValue(value: number, maxValue?: number | null) {
  const formattedValue = new Intl.NumberFormat("nl-NL", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);

  if (typeof maxValue === "number" && Number.isFinite(maxValue) && maxValue !== 5) {
    return `${formattedValue}/${new Intl.NumberFormat("nl-NL", {
      maximumFractionDigits: 1,
    }).format(maxValue)}`;
  }

  return formattedValue;
}

function formatReviewCount(value: number) {
  const formattedValue = new Intl.NumberFormat("nl-NL").format(value);
  return value === 1 ? `${formattedValue} review` : `${formattedValue} reviews`;
}

function buildReviewMeta(card: ExploreCard) {
  const rating =
    typeof card.ratingValue === "number" && Number.isFinite(card.ratingValue)
      ? card.ratingValue
      : typeof card.rating === "number" && Number.isFinite(card.rating)
        ? card.rating
        : null;
  const reviewCount =
    typeof card.reviewCount === "number" && Number.isFinite(card.reviewCount)
      ? card.reviewCount
      : null;
  const parts = [
    rating == null ? null : formatRatingValue(rating, card.ratingMax),
    reviewCount == null ? null : formatReviewCount(reviewCount),
  ].filter((part): part is string => Boolean(part));

  if (parts.length === 0) return null;

  const label = parts.join(" · ");

  return {
    hasRating: rating != null,
    label,
    title: card.ratingSource ? `${label} via ${card.ratingSource}` : label,
  };
}

function isHighlightedCard(card: ExploreCard) {
  return Boolean(
    card.featured ||
      card.editorsPick ||
      card.hiddenGem ||
      (typeof card.priorityScore === "number" && card.priorityScore >= 80)
  );
}

function getHighlightLabel(card: ExploreCard) {
  if (card.editorsPick) return "Redactietip";
  if (card.featured) return "Uitgelicht";
  if (card.hiddenGem) return "Verborgen tip";
  if (typeof card.priorityScore === "number" && card.priorityScore >= 80) {
    return "Aanrader";
  }

  return null;
}

export default function ExploreCardItem({
  card,
  index,
  isSelected,
  onSelect,
}: ExploreCardItemProps) {
  const tags = buildTags(card);
  const imageSrc = card.image?.trim() || null;
  const hasImage = Boolean(imageSrc);
  const locationLine = buildLocationLine(card);
  const highlightLabel = getHighlightLabel(card);
  const isHighlighted = isHighlightedCard(card);
  const reviewMeta = buildReviewMeta(card);
  const eventId =
    typeof card.eventId === "number" && Number.isFinite(card.eventId) && card.eventId > 0
      ? card.eventId
      : null;

  return (
    <article
      onMouseEnter={onSelect}
      className={`group relative flex items-start gap-3 overflow-hidden rounded-[1.05rem] border px-3 py-3 backdrop-blur-xl transition duration-200 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_14%_0%,rgba(255,255,255,0.78),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,250,242,0.16))] before:opacity-80 before:transition-opacity sm:gap-5 sm:rounded-[1.8rem] sm:p-5 ${
        isSelected
          ? "border-[#b8df71]/72 bg-[#fbfdf5]/82 shadow-[0_16px_34px_rgba(109,144,51,0.14)] sm:shadow-[0_24px_52px_rgba(109,144,51,0.16)]"
          : isHighlighted
            ? "border-[#cfe2a6] bg-[#f5f9e9]/78 shadow-[0_14px_30px_rgba(109,144,51,0.12)] hover:border-[#b8df71] hover:bg-[#fbfff1]/88 sm:shadow-[0_22px_46px_rgba(109,144,51,0.14)] sm:hover:-translate-y-1"
            : "border-[#e2d6c8] bg-white/62 shadow-[0_12px_26px_rgba(83,65,45,0.08)] hover:border-[#d2c2b0] hover:bg-white/82 sm:shadow-[0_18px_42px_rgba(83,65,45,0.09)] sm:hover:-translate-y-1 sm:hover:shadow-[0_24px_54px_rgba(83,65,45,0.12)]"
      }`}
    >
      <Link
        href={card.href}
        onFocus={onSelect}
        onClick={onSelect}
        className="absolute inset-0 z-0 rounded-[1.05rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8aa449]/80 sm:rounded-[1.8rem]"
        aria-label={`Bekijk ${card.title}`}
      />

      {isHighlighted ? (
        <div className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-[#b8df71]/80 sm:inset-y-5 sm:w-1" />
      ) : null}

      {hasImage ? (
        <div className="pointer-events-none relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-[0.85rem] border border-white/62 bg-[#efe5d8] shadow-[0_12px_26px_rgba(83,65,45,0.12)] sm:h-[108px] sm:w-[108px] sm:rounded-[1.45rem]">
          <Image
            src={optimizeRemoteImageUrl(imageSrc ?? "", { width: 420 })}
            alt={card.imageAlt || card.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 56px, 108px"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getImageAccent(index)}`}
          />
        </div>
      ) : (
        <div className="pointer-events-none relative z-10 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[0.85rem] border border-[#e2d6c8] bg-[radial-gradient(circle_at_20%_0%,rgba(232,242,208,0.78),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.86),rgba(239,229,216,0.64))] text-lg font-semibold uppercase text-[#667b36] shadow-[0_12px_26px_rgba(83,65,45,0.08)] sm:h-[108px] sm:w-[108px] sm:rounded-[1.45rem] sm:text-3xl">
          {card.label.charAt(0)}
        </div>
      )}

      <div className="pointer-events-none relative z-10 min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <div className="inline-flex max-w-full rounded-full border border-[#d7e7b6] bg-[#f5f9e9]/86 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase leading-4 tracking-[0.14em] text-[#405028] backdrop-blur-md sm:px-3 sm:py-1 sm:text-[0.62rem] sm:tracking-[0.18em]">
                {card.label}
              </div>
              {highlightLabel ? (
                <span className="inline-flex rounded-full border border-[#e2c47d]/70 bg-[#f7e7c8]/76 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.14em] text-[#4b3718] backdrop-blur-md">
                  {highlightLabel}
                </span>
              ) : null}
            </div>
            <h3 className="mt-1 overflow-hidden text-[1.02rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#171511] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:mt-3 sm:text-[1.78rem] sm:leading-[1] sm:tracking-[-0.05em]">
              {card.title}
            </h3>
          </div>

          <div className="pointer-events-auto relative z-20 flex shrink-0 flex-col items-end gap-2">
            {eventId ? (
              <div className="hidden sm:block">
                <FavouriteButton eventId={eventId} variant="compact" />
              </div>
            ) : null}
            {reviewMeta ? (
              <div
                className="inline-flex max-w-[9.5rem] items-center gap-1 text-xs font-semibold text-[#526f2f] sm:max-w-none sm:rounded-full sm:border sm:border-[#d7e7b6] sm:bg-[#f5f9e9]/74 sm:px-3 sm:py-1.5 sm:text-sm sm:backdrop-blur-md"
                title={reviewMeta.title}
              >
                {reviewMeta.hasRating ? <StarIcon /> : null}
                <span className="truncate">{reviewMeta.label}</span>
              </div>
            ) : null}
          </div>
        </div>

        {eventId ? (
          <div className="pointer-events-auto relative z-20 mt-2 sm:hidden">
            <div className="max-w-max">
              <FavouriteButton eventId={eventId} variant="compact" />
            </div>
          </div>
        ) : null}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.78rem] leading-5 text-[#665d54] sm:mt-2 sm:gap-x-2 sm:text-[0.95rem]">
          <span>{card.time}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-[#b9aa99] sm:h-1 sm:w-1" />
          <span>{card.price || "Prijs volgt"}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-[#b9aa99] sm:h-1 sm:w-1" />
          <span className={getStatusClass(card.status)}>{card.status || "Plan dit moment"}</span>
        </div>

        {locationLine ? (
          <div className="mt-0.5 overflow-hidden text-[0.76rem] leading-5 text-[#7f746a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] sm:hidden">
            {locationLine}
          </div>
        ) : null}

        {card.description ? (
          <p className="mt-3 hidden max-w-[32rem] text-sm leading-7 text-[#665d54] sm:block">
            {card.description}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#dfd4c6] bg-white/58 px-3 py-1 text-[0.78rem] text-[#665d54] backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
