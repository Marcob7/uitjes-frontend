"use client";

import Link from "next/link";
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

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function ExploreCardItem({
  card,
  index,
  isSelected,
  onSelect,
}: ExploreCardItemProps) {
  return (
    <Link
      href={card.href}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`block rounded-[1.8rem] border px-5 py-5 text-left transition ${
        isSelected
          ? "border-[#6d9c35] bg-white shadow-[0_18px_44px_rgba(63,76,27,0.12)]"
          : "border-black/6 bg-[#fbf7f1] hover:border-black/12 hover:bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            isSelected ? "bg-[#b8ea72] text-[#23321a]" : "bg-white text-[#292929]"
          }`}
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b735f]">
                {card.label}
              </p>
              <h3 className="mt-2 text-[1.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111111]">
                {card.title}
              </h3>
            </div>

            {typeof card.rating === "number" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f4efdd] px-2.5 py-1 text-xs font-semibold text-[#373122]">
                <span>{card.rating.toFixed(1)}</span>
                <StarIcon />
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#60574a]">
            <span>{card.time}</span>
            {card.price ? <span>{card.price}</span> : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#60574a]">
            <span>{card.distance || card.location}</span>
            <span>{card.location}</span>
          </div>

          {card.description ? (
            <p className="mt-4 max-w-[32rem] text-sm leading-6 text-[#5e5548]">
              {card.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="rounded-full bg-[#d9efb3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#365020]">
              {card.status || "Plan dit moment"}
            </span>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111]">
              Bekijk
              <ArrowIcon />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
