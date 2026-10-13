import { IconButton } from "@/components/ui";

import { AgendaImportBanner, type AgendaImportEvent } from "./AgendaImportBanner";

type JaarkalenderMonthNavigationProps = {
  title: string;
  events: AgendaImportEvent[];
  previousLabel: string;
  nextLabel: string;
  todayLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

/** Calendar-specific month controls and agenda export summary. URL and filter state stay with the feature client. */
export function JaarkalenderMonthNavigation({
  title,
  events,
  previousLabel,
  nextLabel,
  todayLabel,
  onPrevious,
  onNext,
  onToday,
}: JaarkalenderMonthNavigationProps) {
  return (
    <div
      id="jaarkalender-overzicht"
      className="mt-12 grid scroll-mt-24 gap-7 sm:mt-16 sm:scroll-mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.68fr)] lg:items-end lg:gap-12"
    >
      <div>
        <h2
          style={{ maxInlineSize: "none" }}
          className="mt-2 text-[clamp(2.8rem,5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.058em] text-[#191b18]"
        >
          {title}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
          <IconButton
            aria-label={previousLabel}
            onClick={onPrevious}
            className="rounded-full border border-[#d8d3c9] bg-[#fbfaf7] text-[#34312c] transition hover:-translate-y-0.5 hover:border-[#aaa397] hover:bg-white focus-visible:outline-[#00784a]"
          >
            <span aria-hidden="true" className="-mt-px text-lg">←</span>
          </IconButton>
          <IconButton
            aria-label={nextLabel}
            onClick={onNext}
            className="rounded-full border border-[#d8d3c9] bg-[#fbfaf7] text-[#34312c] transition hover:-translate-y-0.5 hover:border-[#aaa397] hover:bg-white focus-visible:outline-[#00784a]"
          >
            <span aria-hidden="true" className="-mt-px text-lg">→</span>
          </IconButton>
          <button
            type="button"
            onClick={onToday}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9d4c5] bg-[#e8f1eb] px-5 text-sm font-semibold text-[#176343] transition hover:-translate-y-0.5 hover:border-[#84b299] hover:bg-[#dfece3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a] active:translate-y-0 active:bg-[#d7e7dc]"
          >
            {todayLabel}
          </button>
        </div>
      </div>
      <AgendaImportBanner events={events} />
    </div>
  );
}
