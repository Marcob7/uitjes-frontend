import Link from "next/link";

import type { TimelineCard, TimelineSlot } from "@/app/jaarkalender/data";
import { getJaarkalenderEventHrefForCard } from "@/app/jaarkalender/data";
import { optimizeCssBackground } from "@/lib/remoteImage";

type FeaturedActivityProps = {
  daySlug: string;
  slot: TimelineSlot;
  card: TimelineCard;
};

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageFallback({ category }: { category: string }) {
  return (
    <div className="relative flex h-full min-h-[18rem] items-end overflow-hidden bg-[#27352c] p-7 text-[#f7f5ed] sm:p-9">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(196,229,144,0.36),transparent_33%),radial-gradient(circle_at_82%_80%,rgba(245,209,139,0.23),transparent_36%)]"
      />
      <div className="relative">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#d7e8b6]">
          {category}
        </p>
        <div className="mt-4 h-px w-14 bg-[#d7e8b6]/60" />
      </div>
    </div>
  );
}

export default function FeaturedActivity({
  daySlug,
  slot,
  card,
}: FeaturedActivityProps) {
  const href = getJaarkalenderEventHrefForCard(daySlug, slot, card);
  const category = card.category.toUpperCase();

  return (
    <section aria-labelledby="featured-activity-title">
      <div className="mx-auto max-w-[42rem] text-center">
        <p className="inline-flex rounded-full border border-[#ded7cc] bg-[#fffdf9] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-[#6f844e]">
          Tip voor deze dag
        </p>
        <h2
          id="featured-activity-title"
          style={{ fontFamily: "var(--font-body)" }}
          className="mt-4 max-w-none text-[clamp(2rem,4vw,3.05rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#181612]"
        >
          Uitgelicht op deze dag
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-[#71665a]">
          Een activiteit die vandaag direct de moeite waard is.
        </p>
      </div>

      <Link
        href={href}
        className="group mt-9 grid overflow-hidden rounded-[1.65rem] border border-[#e6ded4] bg-[#fffdf9] shadow-[0_18px_48px_rgba(61,40,22,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(61,40,22,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83aa50] lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="min-h-[18rem] bg-[#dfe5dc] sm:min-h-[22rem] lg:min-h-[28rem]">
          {card.image ? (
            <div
              className="h-full min-h-[18rem] bg-cover bg-center transition duration-500 group-hover:scale-[1.025] sm:min-h-[22rem] lg:min-h-[28rem]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(18, 24, 20, 0.02), rgba(18, 24, 20, 0.18)), ${optimizeCssBackground(
                  card.image,
                  { width: 1400, quality: 68 }
                )}`,
              }}
            />
          ) : (
            <ImageFallback category={category} />
          )}
        </div>

        <div className="flex min-w-0 flex-col items-start px-6 py-7 sm:px-9 sm:py-9 lg:px-10 lg:py-11">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-[#6e884b]">
            {category}
          </p>
          <h3 className="mt-4 max-w-none text-[clamp(2rem,3.4vw,3rem)] leading-[0.96] tracking-[-0.06em] text-[#171511]">
            {card.title}
          </h3>
          {card.location ? (
            <p className="mt-4 text-sm font-medium leading-6 text-[#665c52]">
              {card.location}
            </p>
          ) : null}
          {card.description ? (
            <p className="mt-5 max-w-[31rem] text-[0.98rem] leading-7 text-[#695f55]">
              {card.description}
            </p>
          ) : null}
          <span className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171511] px-5 text-sm font-semibold text-[#fffdf8] transition group-hover:bg-[#2d3328]">
            Bekijk activiteit
            <ArrowRightIcon />
          </span>
        </div>
      </Link>
    </section>
  );
}
