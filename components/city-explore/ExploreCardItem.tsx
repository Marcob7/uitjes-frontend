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
    return "text-[#c95437]";
  }

  return "text-[#4a7a24]";
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
      className={`group flex flex-col gap-5 rounded-[2rem] p-5 ring-1 transition duration-200 sm:flex-row sm:items-start ${
        isSelected
          ? "bg-white shadow-[0_24px_44px_rgba(67,86,27,0.12)] ring-[#86ae49]/40"
          : "bg-[#fbf8f4] shadow-[0_24px_44px_rgba(40,30,20,0.05)] ring-black/[0.04] hover:-translate-y-1 hover:bg-white"
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
            <div className="inline-flex rounded-full bg-[#dff1c5] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#66873e]">
              {card.label}
            </div>
            <h3 className="mt-3 text-[1.95rem] font-semibold leading-[0.98] tracking-[-0.055em] text-[#151515]">
              {card.title}
            </h3>
          </div>

          {typeof card.rating === "number" ? (
            <div className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[#111111]">
              <StarIcon />
              <span>{card.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.98rem] text-[#5d5248]">
          <span>{card.time}</span>
          <span className="h-1 w-1 rounded-full bg-[#b8aa9b]" />
          <span>{card.price || "Prijs volgt"}</span>
          <span className="h-1 w-1 rounded-full bg-[#b8aa9b]" />
          <span className={getStatusClass(card.status)}>{card.status || "Plan dit moment"}</span>
        </div>

        {card.description ? (
          <p className="mt-3 max-w-[32rem] text-sm leading-7 text-[#605347]">
            {card.description}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d9cfc4] bg-white px-3 py-1 text-[0.78rem] text-[#5a5047]"
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
