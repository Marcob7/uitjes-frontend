import Link from "next/link";

import type { TimelineCard, TimelineSlot } from "@/app/jaarkalender/data";
import { getJaarkalenderEventHrefForCard } from "@/app/jaarkalender/data";
import { optimizeCssBackground } from "@/lib/remoteImage";

type ActivityCardProps = {
  daySlug: string;
  slot: TimelineSlot;
  card: TimelineCard;
};

const fallbackTones = {
  peach: "bg-[#efe1d4] text-[#754c36]",
  mint: "bg-[#dcebd6] text-[#41663b]",
  sand: "bg-[#f2e6c4] text-[#765d28]",
  dark: "bg-[#344139] text-[#e9f0d9]",
  light: "bg-[#e8e5dd] text-[#514e47]",
} as const;

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActivityVisual({ card }: { card: TimelineCard }) {
  if (card.image) {
    return (
      <div
        className="aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-[1.025]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(21, 25, 22, 0.02), rgba(21, 25, 22, 0.16)), ${optimizeCssBackground(
            card.image,
            { width: 900, quality: 62 }
          )}`,
        }}
      />
    );
  }

  const tone = fallbackTones[card.tone];

  return (
    <div className={`relative aspect-[4/3] overflow-hidden p-5 sm:p-6 ${tone}`}>
      <div aria-hidden="true" className="absolute -right-7 -top-10 h-40 w-40 rounded-full border border-current opacity-15" />
      <div aria-hidden="true" className="absolute bottom-5 left-5 h-px w-[62%] bg-current opacity-30" />
      <p aria-hidden="true" className="relative text-[0.67rem] font-semibold uppercase tracking-[0.2em] opacity-85">
        {card.category}
      </p>
    </div>
  );
}

export default function ActivityCard({ daySlug, slot, card }: ActivityCardProps) {
  const href = getJaarkalenderEventHrefForCard(daySlug, slot, card);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#e6ded4] bg-[#fffdf9] shadow-[0_12px_34px_rgba(61,40,22,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#cfd9c5] hover:shadow-[0_18px_42px_rgba(61,40,22,0.065)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83aa50]"
    >
      <div className="overflow-hidden"><ActivityVisual card={card} /></div>
      <div className="flex flex-1 flex-col px-5 py-6 sm:px-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#6d884b]">
          {card.category}
        </p>
        <h3 className="mt-3 max-w-none text-[clamp(1.45rem,2.1vw,1.85rem)] leading-[0.98] tracking-[-0.05em] text-[#171511]">
          {card.title}
        </h3>
        {card.location ? (
          <p className="mt-4 text-sm font-medium leading-6 text-[#635b52]">
            {card.location}
          </p>
        ) : null}
        {card.description ? (
          <p className="mt-3 overflow-hidden text-sm leading-6 text-[#756c62] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {card.description}
          </p>
        ) : null}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2e5937] transition group-hover:text-[#173b28]">
          Bekijk activiteit
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}
