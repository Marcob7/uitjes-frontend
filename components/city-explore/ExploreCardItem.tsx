import Image from "next/image";
import type { ExploreCard } from "./types";

type ExploreCardItemProps = {
  card: ExploreCard;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ExploreCardItem({
  card,
  isSelected,
  onSelect,
}: ExploreCardItemProps) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-[1.5rem] bg-white p-3 text-left shadow-sm ring-1 transition ${
        isSelected ? "ring-amber-400" : "ring-black/5 hover:ring-black/10"
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {card.label}
        </p>

        <h3 className="mt-1 text-base font-semibold leading-tight text-[#111111] sm:text-lg">
          {card.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{card.time}</span>
          <span>{card.location}</span>
        </div>
      </div>

      <div
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          isSelected
            ? "bg-amber-400 text-slate-900"
            : "bg-[#f4ede7] text-slate-700"
        }`}
      >
        →
      </div>
    </button>
  );
}