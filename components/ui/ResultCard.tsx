"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import CompactResultCardFrame from "@/components/ui/CompactResultCardFrame";
import { localeToIntl } from "@/lib/i18n/config";

type ResultCardProps = {
  href: string;
  title: string;
  image?: string | null;
  imageAlt?: string;
  category?: string | null;
  location?: string | null;
  price?: string | null;
  date?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  reviewsHref?: string | null;
  favoriteAction?: ReactNode;
  onSelect?: () => void;
  className?: string;
  priority?: boolean;
  variant?: "tile" | "compact";
  isSelected?: boolean;
  onMouseEnter?: () => void;
  viewLabel?: string;
  viewAriaLabel?: string;
  reviewsAriaLabel?: string;
};

function formatReviewSummary(rating: number | null | undefined, reviewCount: number | null | undefined, locale: "nl" | "en", t: (key: string, values?: Record<string, string | number>) => string) {
  if (
    typeof rating !== "number" || !Number.isFinite(rating) ||
    typeof reviewCount !== "number" || !Number.isFinite(reviewCount) || reviewCount <= 0
  ) return null;
  const value = new Intl.NumberFormat(localeToIntl[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
  const reviews = new Intl.NumberFormat(localeToIntl[locale]).format(reviewCount);
  return { value, reviews: t("search.reviews", { count: reviews }) };
}

/** Canonical result/listing card for activities, events and search results. */
export default function ResultCard({
  href,
  title,
  image,
  imageAlt = "",
  category,
  location,
  price,
  date,
  rating,
  reviewCount,
  reviewsHref,
  favoriteAction,
  onSelect,
  className = "",
  priority = false,
  variant = "tile",
  isSelected = false,
  onMouseEnter,
  viewLabel,
  viewAriaLabel,
  reviewsAriaLabel,
}: ResultCardProps) {
  const { locale, t } = useLocale();
  const reviewSummary = formatReviewSummary(rating, reviewCount, locale, t);
  const primaryMetadata = [category, location].filter(Boolean).join(" · ");
  const secondaryMetadata = [date, price].filter(Boolean).join(" · ");
  const resolvedViewLabel = viewLabel ?? t("search.view");
  const resolvedViewAriaLabel = viewAriaLabel ?? `${resolvedViewLabel} ${title}`;

  if (variant === "compact") {
    return (
      <CompactResultCardFrame
        className={className}
        isSelected={isSelected}
        onMouseEnter={onMouseEnter}
        action={
          <>
            {favoriteAction}
            <Link
              href={href}
              onFocus={onSelect}
              onClick={onSelect}
              aria-label={resolvedViewAriaLabel}
              className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-[#1D5A46] transition hover:bg-[#EEF5EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              {resolvedViewLabel}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </>
        }
      >
        <div className={`grid min-w-0 gap-x-4 ${image ? "grid-cols-[minmax(0,1fr)_4.5rem] sm:grid-cols-[minmax(0,1fr)_5.5rem]" : "grid-cols-1"}`}>
          <div className="min-w-0">
            <Link
              href={href}
              onFocus={onSelect}
              onClick={onSelect}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              <h3 className="line-clamp-2 text-[1.18rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#26352D] sm:text-[1.3rem]">{title}</h3>
            </Link>
            {reviewSummary ? (
              <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm leading-5 text-[#526159]">
                <span className="shrink-0 font-semibold text-[#3C4C43]"><span className="text-[#B7791F]" aria-hidden="true">★</span> {reviewSummary.value}</span>
                <span aria-hidden="true" className="text-[#9AA69E]">·</span>
                {reviewsHref ? (
                  <Link
                    href={reviewsHref}
                    onFocus={onSelect}
                    aria-label={reviewsAriaLabel ?? reviewSummary.reviews}
                    className="truncate underline decoration-[#B8C3BA] underline-offset-4 transition hover:text-[#1D5A46] hover:decoration-[#1D5A46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
                  >
                    {reviewSummary.reviews}
                  </Link>
                ) : <span className="truncate">{reviewSummary.reviews}</span>}
              </div>
            ) : null}
            {primaryMetadata ? <p className="mt-2 truncate text-sm leading-5 text-[#65736C]">{primaryMetadata}</p> : null}
            {secondaryMetadata ? <p className="mt-2 truncate text-xs leading-5 text-[#7A857D]">{secondaryMetadata}</p> : null}
          </div>
          {image ? (
            <Link
              href={href}
              onFocus={onSelect}
              onClick={onSelect}
              aria-label={resolvedViewAriaLabel}
              className="relative row-span-4 block h-[4.5rem] w-[4.5rem] self-center overflow-hidden rounded-[1rem] bg-[#E7EEE7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] sm:h-[5.5rem] sm:w-[5.5rem]"
            >
              <img
                src={image}
                alt={imageAlt}
                loading={priority ? "eager" : "lazy"}
                onError={(event) => { event.currentTarget.style.display = "none"; }}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
              />
            </Link>
          ) : null}
        </div>
      </CompactResultCardFrame>
    );
  }

  return (
    <article className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[1.45rem] border border-[#dce1dc] bg-white shadow-[0_12px_30px_rgba(33,54,43,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(33,54,43,0.1)] ${className}`}>
      <Link
        href={href}
        onFocus={onSelect}
        onClick={onSelect}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005fcc] focus-visible:ring-offset-[-2px]"
      >
        <div className="relative aspect-[1.28] overflow-hidden bg-[#e8eee7]">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
            />
          ) : null}
        </div>
        <div className="flex min-h-[12.5rem] flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <h3 className="line-clamp-2 text-[1.22rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#22312a] sm:text-[1.34rem]">{title}</h3>
          {primaryMetadata ? <p className="mt-3 truncate text-sm text-[#68746d]">{primaryMetadata}</p> : null}
          <div className="mt-4 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#53645a]">
            {reviewSummary ? <span className="font-medium text-[#53645a]"><span className="text-[#b77929]" aria-hidden="true">★</span> {reviewSummary.value} · {reviewSummary.reviews}</span> : null}
            {price ? <span className="font-medium text-[#334d3d]">{price}</span> : null}
          </div>
          <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5a46]">{t("search.view")} <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
        </div>
      </Link>
      {favoriteAction ? <div className="absolute right-3 top-3">{favoriteAction}</div> : null}
    </article>
  );
}
