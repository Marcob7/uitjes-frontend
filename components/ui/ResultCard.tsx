"use client";

import Link from "next/link";
import type { ReactNode } from "react";

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
};

function formatReviewSummary(rating?: number | null, reviewCount?: number | null) {
  if (
    typeof rating !== "number" || !Number.isFinite(rating) ||
    typeof reviewCount !== "number" || !Number.isFinite(reviewCount) || reviewCount <= 0
  ) return null;
  const value = new Intl.NumberFormat("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
  const reviews = new Intl.NumberFormat("nl-NL").format(reviewCount);
  return { value, reviews: `${reviews} ${reviewCount === 1 ? "review" : "reviews"}` };
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
  favoriteAction,
  onSelect,
  className = "",
  priority = false,
}: ResultCardProps) {
  const reviewSummary = formatReviewSummary(rating, reviewCount);
  const metadata = [location, date].filter(Boolean).join(" · ");

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
          {category ? <p className="text-sm font-medium leading-5 text-[#1d5a46]">{category}</p> : null}
          <h3 className="mt-2 line-clamp-2 text-[1.22rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#22312a] sm:text-[1.34rem]">{title}</h3>
          {metadata ? <p className="mt-3 truncate text-sm text-[#68746d]">{metadata}</p> : null}
          <div className="mt-4 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#53645a]">
            {reviewSummary ? <span className="font-medium text-[#53645a]"><span className="text-[#b77929]" aria-hidden="true">★</span> {reviewSummary.value} · {reviewSummary.reviews}</span> : null}
            {price ? <span className="font-medium text-[#334d3d]">{price}</span> : null}
          </div>
          <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5a46]">Bekijk <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
        </div>
      </Link>
      {favoriteAction ? <div className="absolute right-3 top-3">{favoriteAction}</div> : null}
    </article>
  );
}
