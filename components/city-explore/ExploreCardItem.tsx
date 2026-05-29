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
    return "text-[#f7b6a6]";
  }

  return "text-[#e8f2d0]";
}

function getImageAccent(index: number) {
  if (index % 4 === 0) {
    return "from-[#cb7328]/34 via-transparent to-[#120804]/72";
  }

  if (index % 4 === 1) {
    return "from-[#d6ae7b]/18 via-transparent to-[#101114]/58";
  }

  if (index % 4 === 2) {
    return "from-[#ec8e27]/28 via-transparent to-[#180c08]/74";
  }

  return "from-[#a38250]/24 via-transparent to-[#111317]/60";
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
      className={`group relative flex items-start gap-3 rounded-[1.05rem] border px-3 py-3 backdrop-blur-xl transition duration-200 sm:gap-5 sm:rounded-[2rem] sm:p-5 ${
        isSelected
          ? "border-[#e8f2d0]/38 bg-white/15 shadow-[0_12px_26px_rgba(0,0,0,0.18)] sm:shadow-[0_28px_58px_rgba(0,0,0,0.24)]"
          : isHighlighted
            ? "border-[#e8f2d0]/34 bg-[#e8f2d0]/12 shadow-[0_12px_26px_rgba(0,0,0,0.15)] hover:border-[#e8f2d0]/46 hover:bg-[#e8f2d0]/16 sm:shadow-[0_24px_54px_rgba(0,0,0,0.2)] sm:hover:-translate-y-1"
            : "border-white/12 bg-white/8 shadow-[0_10px_22px_rgba(0,0,0,0.11)] hover:border-white/22 hover:bg-white/12 sm:bg-white/10 sm:shadow-[0_22px_48px_rgba(0,0,0,0.16)] sm:hover:-translate-y-1 sm:hover:bg-white/14 sm:hover:shadow-[0_30px_68px_rgba(0,0,0,0.22)]"
      }`}
    >
      <Link
        href={card.href}
        onFocus={onSelect}
        onClick={onSelect}
        className="absolute inset-0 z-0 rounded-[1.05rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8f2d0]/80 sm:rounded-[2rem]"
        aria-label={`Bekijk ${card.title}`}
      />

      {isHighlighted ? (
        <div className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-[#e8f2d0]/70 sm:inset-y-5 sm:w-1" />
      ) : null}

      {hasImage ? (
        <div className="pointer-events-none relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-[0.85rem] bg-[#251b15] sm:h-[108px] sm:w-[108px] sm:rounded-[1.6rem]">
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
      ) : null}

      <div className="pointer-events-none relative z-10 min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <div className="inline-flex max-w-full text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.14em] text-[#e8f2d0] sm:rounded-full sm:border sm:border-[#e8f2d0]/30 sm:bg-[#e8f2d0]/14 sm:px-3 sm:py-1 sm:text-[0.62rem] sm:tracking-[0.18em] sm:text-[#f1f7df] sm:backdrop-blur-md">
                {card.label}
              </div>
              {highlightLabel ? (
                <span className="inline-flex rounded-full border border-[#f6e8bf]/35 bg-[#f6e8bf]/18 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.14em] text-[#fff5cf] backdrop-blur-md">
                  {highlightLabel}
                </span>
              ) : null}
            </div>
            <h3 className="mt-1 overflow-hidden text-[1.02rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:mt-3 sm:text-[1.95rem] sm:leading-[0.98] sm:tracking-[-0.055em]">
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
                className="inline-flex max-w-[9.5rem] items-center gap-1 text-xs font-semibold text-white/88 sm:max-w-none sm:rounded-full sm:border sm:border-white/14 sm:bg-white/10 sm:px-3 sm:py-1.5 sm:text-sm sm:text-white sm:backdrop-blur-md"
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

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.78rem] leading-5 text-white/72 sm:mt-2 sm:gap-x-2 sm:text-[0.98rem]">
          <span>{card.time}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/36 sm:h-1 sm:w-1" />
          <span>{card.price || "Prijs volgt"}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/36 sm:h-1 sm:w-1" />
          <span className={getStatusClass(card.status)}>{card.status || "Plan dit moment"}</span>
        </div>

        {locationLine ? (
          <div className="mt-0.5 overflow-hidden text-[0.76rem] leading-5 text-white/58 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] sm:hidden">
            {locationLine}
          </div>
        ) : null}

        {card.description ? (
          <p className="mt-3 hidden max-w-[32rem] text-sm leading-7 text-white/72 sm:block">
            {card.description}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[0.78rem] text-white/74 backdrop-blur-md"
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
