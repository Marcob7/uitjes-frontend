"use client";

import Image from "next/image";
import Link from "next/link";

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

export default function ExploreCardItem({
  card,
  index,
  isSelected,
  onSelect,
}: ExploreCardItemProps) {
  const tags = buildTags(card);

  return (
    <Link
      href={card.href}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`group flex flex-col gap-5 rounded-[2rem] border p-5 backdrop-blur-xl transition duration-200 sm:flex-row sm:items-start ${
        isSelected
          ? "border-[#e8f2d0]/42 bg-white/16 shadow-[0_28px_58px_rgba(0,0,0,0.24)]"
          : "border-white/14 bg-white/10 shadow-[0_22px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:border-white/22 hover:bg-white/14 hover:shadow-[0_30px_68px_rgba(0,0,0,0.22)]"
      }`}
    >
      <div className="relative h-[108px] w-full shrink-0 overflow-hidden rounded-[1.6rem] bg-[#2b1b12] sm:w-[108px]">
        <Image
          src={optimizeRemoteImageUrl(card.image, { width: 420 })}
          alt={card.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.04]"
          sizes="108px"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getImageAccent(index)}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-[#e8f2d0]/36 bg-[#e8f2d0]/18 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#f1f7df] backdrop-blur-md">
              {card.label}
            </div>
            <h3 className="mt-3 text-[1.95rem] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
              {card.title}
            </h3>
          </div>

          {typeof card.rating === "number" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
              <StarIcon />
              <span>{card.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.98rem] text-white/72">
          <span>{card.time}</span>
          <span className="h-1 w-1 rounded-full bg-white/36" />
          <span>{card.price || "Prijs volgt"}</span>
          <span className="h-1 w-1 rounded-full bg-white/36" />
          <span className={getStatusClass(card.status)}>{card.status || "Plan dit moment"}</span>
        </div>

        {card.description ? (
          <p className="mt-3 max-w-[32rem] text-sm leading-7 text-white/72">
            {card.description}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
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
    </Link>
  );
}
