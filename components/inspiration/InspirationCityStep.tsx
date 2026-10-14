"use client";

import type { KeyboardEventHandler, ReactElement, RefObject } from "react";

import {
  FullscreenChoiceGrid,
  FullscreenChoiceQuestion,
} from "@/components/city-explore/FullscreenChoiceFlow";
import { useLocale } from "@/components/i18n/LocaleProvider";

type CityOption = { label: string; value: string };
type AudienceOption = { value: string; label: string; helper: string; icon: ReactElement };

type InspirationCityStepProps = {
  selectedCity?: string;
  selectedCityLabel?: string;
  cityInput: string;
  cityError: string | null;
  matchingCities: CityOption[];
  activeCityIndex: number;
  isCityListOpen: boolean;
  isResolvingLocation: boolean;
  cityInputRef: RefObject<HTMLInputElement | null>;
  audienceOptions: AudienceOption[];
  selectedAudience?: string;
  onCityInputChange: (value: string) => void;
  onCityInputKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onOpenCityList: () => void;
  onToggleCityList: () => void;
  onCityHover: (index: number) => void;
  onCityMouseDown: (city: CityOption) => void;
  onSelectCityFromInput: () => void;
  onClearCity: () => void;
  onRequestLocation: () => void;
  onChooseAudience: (value: string) => void;
  onViewAllResults: () => void;
};

function CheckIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.2 4.2L19.5 6" /></svg>; }
function ChevronIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 10 5 5 5-5" /></svg>; }

/** City selection and its existing introductory audience shortcut. */
export default function InspirationCityStep({
  selectedCity,
  selectedCityLabel,
  cityInput,
  cityError,
  matchingCities,
  activeCityIndex,
  isCityListOpen,
  isResolvingLocation,
  cityInputRef,
  audienceOptions,
  selectedAudience,
  onCityInputChange,
  onCityInputKeyDown,
  onOpenCityList,
  onToggleCityList,
  onCityHover,
  onCityMouseDown,
  onSelectCityFromInput,
  onClearCity,
  onRequestLocation,
  onChooseAudience,
  onViewAllResults,
}: InspirationCityStepProps) {
  const { t } = useLocale();
  const title = selectedCityLabel
    ? t("inspiration.cityTitle", { city: selectedCityLabel })
    : t("inspiration.introTitle");
  const description = selectedCityLabel
    ? t("inspiration.introHelp")
    : t("inspiration.introDescription");

  return (
    <FullscreenChoiceQuestion
      title={title}
      description={description}
      introNote={selectedCity ? undefined : t("inspiration.citySelectionIntro")}
      primaryAction={selectedCity ? (
        <button type="button" onClick={onViewAllResults} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1D5A46] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">
          {t("inspiration.allOutings", { city: selectedCityLabel ?? "" })} <span className="ml-2" aria-hidden="true">→</span>
        </button>
      ) : undefined}
    >
      <div className={`w-full max-w-2xl ${selectedCity ? "border-0 bg-transparent p-0 shadow-none sm:rounded-[1.4rem] sm:border sm:border-[#DCE1DC] sm:bg-white/[0.96] sm:p-5 sm:shadow-[0_14px_30px_rgba(41,52,47,0.06)]" : "rounded-[1.4rem] border border-[#DCE1DC] bg-white/[0.96] p-4 shadow-[0_14px_30px_rgba(41,52,47,0.06)] sm:p-5"}`}>
        <div className={selectedCity ? "hidden sm:block" : undefined}>
          <label htmlFor="inspiration-city-search" className="text-sm font-semibold text-[#29342F]">
            {selectedCity ? t("inspiration.searchCity") : t("inspiration.cityQuestion")}
          </label>
          <div className="relative mt-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex min-h-12 min-w-0 flex-1 items-center rounded-xl border border-[#B8C5BE] bg-white transition focus-within:border-[#005FCC] focus-within:ring-2 focus-within:ring-[#005FCC]">
                <input
                  ref={cityInputRef}
                  id="inspiration-city-search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isCityListOpen}
                  aria-controls="inspiration-city-listbox"
                  aria-activedescendant={activeCityIndex >= 0 && activeCityIndex < matchingCities.length ? `inspiration-city-option-${matchingCities[activeCityIndex].value}` : undefined}
                  value={cityInput}
                  onChange={(event) => onCityInputChange(event.target.value)}
                  onFocus={onOpenCityList}
                  onKeyDown={onCityInputKeyDown}
                  placeholder={t("inspiration.cityPlaceholder")}
                  autoComplete="off"
                  inputMode="search"
                  spellCheck={false}
                  className="min-h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-base text-[#29342F] outline-none placeholder:text-[#65736C]"
                />
                {cityInput ? <button type="button" onClick={onClearCity} aria-label={t("inspiration.clearCity")} className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#65736C] transition hover:bg-[#F1F4F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">×</button> : null}
                <button type="button" onClick={onToggleCityList} aria-label={isCityListOpen ? t("inspiration.closeCities") : t("inspiration.showCities")} aria-expanded={isCityListOpen} aria-controls="inspiration-city-listbox" className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#29342F] transition hover:bg-[#F1F4F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"><ChevronIcon /></button>
              </div>
              <button type="button" onClick={onSelectCityFromInput} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1D5A46] px-5 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">{t("inspiration.selectCity")}</button>
            </div>
            {isCityListOpen ? (
              <div id="inspiration-city-listbox" role="listbox" aria-label={t("inspiration.availableCities")} className="absolute z-20 mt-2 max-h-[min(18rem,45vh)] w-full overflow-y-auto rounded-xl border border-[#DCE1DC] bg-white p-1.5 shadow-[0_20px_45px_rgba(41,52,47,0.16)]">
                {matchingCities.map((city, index) => (
                  <button key={city.value} id={`inspiration-city-option-${city.value}`} role="option" aria-selected={city.value === selectedCity} type="button" onMouseEnter={() => onCityHover(index)} onMouseDown={(event) => { event.preventDefault(); onCityMouseDown(city); }} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005FCC] ${index === activeCityIndex ? "bg-[#EEF5F0] text-[#173F31]" : "text-[#29342F] hover:bg-[#F4F6F4]"}`}><span>{city.label}</span>{city.value === selectedCity ? <CheckIcon /> : null}</button>
                ))}
                {matchingCities.length === 0 ? <p className="px-3 py-3 text-sm leading-6 text-[#65736C]">{t("inspiration.unsupportedCity")}</p> : null}
              </div>
            ) : null}
          </div>
          <p className="sr-only" aria-live="polite">{matchingCities.length === 1 ? t("inspiration.cityFound", { count: matchingCities.length }) : t("inspiration.citiesFound", { count: matchingCities.length })}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={onRequestLocation} disabled={isResolvingLocation} className="min-h-11 text-sm font-semibold text-[#355E7A] underline decoration-[#B8C5BE] underline-offset-4 transition hover:text-[#173F31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] disabled:cursor-wait disabled:opacity-70">{isResolvingLocation ? t("inspiration.locating") : t("inspiration.useLocation")}</button>
            {cityError ? <p className="text-sm font-medium text-[#875B2A]" role="alert">{cityError}</p> : null}
          </div>
        </div>
        {selectedCity ? (
          <div className="mt-0 border-t-0 pt-0 sm:mt-5 sm:border-t sm:border-[#DCE1DC] sm:pt-4">
            <FullscreenChoiceGrid title={t("inspiration.audienceTitle")} selectedValue={selectedAudience} onChoose={onChooseAudience} options={audienceOptions.map(({ value, label, helper, icon }) => ({ value, label, description: helper, icon }))} />
          </div>
        ) : null}
      </div>
    </FullscreenChoiceQuestion>
  );
}
