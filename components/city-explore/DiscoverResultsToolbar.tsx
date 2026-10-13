"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type DiscoverResultsToolbarProps = {
  cityLabel: string;
  resultsLabel: string;
  selectionLabels: string[];
  activeFilterCount: number;
  filterButtonRef: React.RefObject<HTMLButtonElement | null>;
  filterModalId: string;
  isFilterModalOpen: boolean;
  onEditChoices: () => void;
  onOpenFilters: () => void;
  onOpenMap: () => void;
};

function FilterIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M7 12h10" /><path d="M10 17h4" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export default function DiscoverResultsToolbar({ cityLabel, resultsLabel, selectionLabels, activeFilterCount, filterButtonRef, filterModalId, isFilterModalOpen, onEditChoices, onOpenFilters, onOpenMap }: DiscoverResultsToolbarProps) {
  const { t } = useLocale();
  const hasResultFilters = activeFilterCount > 0;

  return <>
    <div className="flex flex-col gap-4 border-b border-[#DCE1DC] pb-5 md:flex-row md:items-end md:justify-between">
      <div><h1 id="explore-results-heading" tabIndex={-1} className="text-[clamp(2.25rem,3.2vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#29342F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC]">{t("discover.cityTitle", { city: cityLabel })}</h1><p className="mt-2 text-sm font-medium text-[#65736C] sm:text-base">{resultsLabel}{selectionLabels.length ? ` · ${selectionLabels.join(" · ")}` : ""}</p></div>
      <div className="flex flex-wrap items-center gap-3 md:justify-end"><button type="button" onClick={onEditChoices} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DCE1DC] bg-white px-5 py-2.5 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">{t("discover.editChoices")}</button><button ref={filterButtonRef} type="button" onClick={onOpenFilters} aria-expanded={isFilterModalOpen} aria-controls={filterModalId} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] ${hasResultFilters ? "border-[#9DBAAE] bg-[#DDEBE2] text-[#1D5A46] hover:bg-[#EAF2EC]" : "border-[#DCE1DC] bg-white text-[#355E7A] hover:border-[#355E7A]"}`}><FilterIcon /><span>{t("search.filters")}</span>{hasResultFilters ? <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1D5A46] px-1.5 text-xs font-bold text-white">{activeFilterCount}</span> : null}</button></div>
    </div>
    <button type="button" onClick={onOpenMap} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#9DBAAE] bg-[#DDEBE2] px-5 py-2.5 text-sm font-semibold text-[#1D5A46] lg:hidden"><PinIcon /> {t("discover.mapView")}</button>
  </>;
}
