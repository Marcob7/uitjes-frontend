"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ExploreCardItem from "@/components/city-explore/ExploreCardItem";
import {
  FullscreenChoiceFlow,
  FullscreenChoiceGrid,
  FullscreenChoiceQuestion,
  FullscreenChoiceResults,
  type FullscreenChoiceFlowStep,
} from "@/components/city-explore/FullscreenChoiceFlow";
import type { ExploreCard } from "@/components/city-explore/types";
import { getCityContentByCity, type CityContentItem } from "@/lib/api/cityContent";
import { CITY_CONTENT_CITY_SLUGS, isCityContentCity } from "@/lib/cityContentCities";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import {
  featuredInspirationCities,
  type InspirationCategorySlug,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import { getInspirationFlowResults } from "@/lib/inspiration/cityContentMapper";
import { InspirationFlowScenery } from "./InspirationFlowScenery";

type AudienceChoice = "solo" | "date" | "gezin" | "vrienden";
type MomentChoice = "nu" | "vanavond" | "weekend" | "later";
type VibeChoice = "cultureel" | "actief" | "eten-drinken" | "relaxed";
type InspirationSelectionKey = "audience" | "moment" | "vibe";

type InspirationChoiceFlowProps = {
  initialCity?: string;
  /** Legacy query support; city is now canonicalized to ?city=. */
  initialLocation?: string;
  initialNearbyCity?: string;
};

type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  helper: string;
  icon: ReactElement;
};

type CityOption = { label: string; value: string };

type CityFlowStep = FullscreenChoiceFlowStep & {
  type: "custom";
  id: "city";
  title: string;
  description: string;
};

type QuestionFlowStep = FullscreenChoiceFlowStep & {
  type: "question";
  id: InspirationSelectionKey;
  title: string;
  description: string;
  options: Array<ChoiceOption<AudienceChoice | MomentChoice | VibeChoice>>;
};

type ResultsFlowStep = FullscreenChoiceFlowStep & { type: "results"; id: "results" };
type InspirationFlowStep = CityFlowStep | QuestionFlowStep | ResultsFlowStep;

const audienceOptions: Array<ChoiceOption<AudienceChoice>> = [
  { value: "solo", label: "Alleen op pad", helper: "Vrij en flexibel", icon: <PersonIcon /> },
  { value: "date", label: "Date", helper: "Samen iets bijzonders", icon: <HeartIcon /> },
  { value: "gezin", label: "Met gezin", helper: "Praktisch met kinderen", icon: <PeopleIcon /> },
  { value: "vrienden", label: "Met vrienden", helper: "Gezellig samen", icon: <PeopleIcon /> },
];

const momentOptions: Array<ChoiceOption<MomentChoice>> = [
  { value: "nu", label: "Nu", helper: "Snel te plannen", icon: <BoltIcon /> },
  { value: "vanavond", label: "Vanavond", helper: "Avondgevoel", icon: <MoonIcon /> },
  { value: "weekend", label: "Dit weekend", helper: "Voor een vrije dag", icon: <CalendarIcon /> },
  { value: "later", label: "Later plannen", helper: "Bewaar inspiratie", icon: <ClockIcon /> },
];

const vibeOptions: Array<ChoiceOption<VibeChoice>> = [
  { value: "cultureel", label: "Cultureel", helper: "Kijken en ontdekken", icon: <MuseumIcon /> },
  { value: "actief", label: "Actief / buiten", helper: "Lucht en beweging", icon: <LocationArrowIcon /> },
  { value: "eten-drinken", label: "Eten & drinken", helper: "Lunch, borrel, diner", icon: <CupIcon /> },
  { value: "relaxed", label: "Relaxed", helper: "Rustig en laagdrempelig", icon: <SmileIcon /> },
];

const supportedCitySlugs = new Set<string>([
  ...featuredInspirationCities.map((city) => city.value),
  ...CITY_CONTENT_CITY_SLUGS,
]);

/** The existing city config remains the source for labels and slug normalization. */
const supportedInspirationCities: CityOption[] = Array.from(supportedCitySlugs)
  .map((value) => {
    const configuredCity = cityOptions.find((city) => city.value === value);
    const featuredCity = featuredInspirationCities.find((city) => city.value === value);
    return configuredCity ?? featuredCity;
  })
  .filter((city): city is CityOption => Boolean(city))
  .sort((a, b) => a.label.localeCompare(b.label, "nl"));

const inspirationFlowSteps: InspirationFlowStep[] = [
  {
    type: "custom",
    id: "city",
    title: "Waar wil je iets leuks doen?",
    description: "We kunnen je helpen kiezen. Kies een stad en vertel wat bij je past voor persoonlijkere suggesties.",
  },
  {
    type: "question",
    id: "audience",
    title: "Met wie ga je op pad?",
    description: "Stem de suggesties af op het gezelschap waarmee je eropuit gaat.",
    options: audienceOptions,
  },
  {
    type: "question",
    id: "moment",
    title: "Wanneer wil je iets doen?",
    description: "Kies het moment dat past bij je plan in de stad.",
    options: momentOptions,
  },
  {
    type: "question",
    id: "vibe",
    title: "Waar heb je zin in?",
    description: "Kies de richting die vandaag het beste voelt. Daarna zetten we je selectie klaar.",
    options: vibeOptions,
  },
  { type: "results", id: "results" },
];

function findSupportedCity(input?: string | null) {
  const normalized = normalizeCitySlug(input ?? "");
  if (!normalized) return undefined;

  return supportedInspirationCities.find(
    (city) => city.value === normalized || normalizeCitySlug(city.label) === normalized
  );
}

function hasCategory(result: InspirationResult, category: InspirationCategorySlug) {
  return result.categories.includes(category);
}

function getResultText(result: InspirationResult) {
  return `${result.title} ${result.categoryLabel} ${result.description} ${result.tags.join(" ")} ${result.type}`.toLowerCase();
}

function matchesAudience(result: InspirationResult, audience?: AudienceChoice) {
  if (!audience) return true;
  if (audience === "solo") return !hasCategory(result, "met-kinderen");
  if (audience === "date") return hasCategory(result, "romantisch") || hasCategory(result, "eten-drinken") || hasCategory(result, "weekend");
  if (audience === "gezin") return hasCategory(result, "met-kinderen");
  return hasCategory(result, "weekend") || hasCategory(result, "eten-drinken") || hasCategory(result, "buiten");
}

function matchesMoment(result: InspirationResult, moment?: MomentChoice) {
  if (!moment) return true;
  if (moment === "nu") return hasCategory(result, "vandaag");
  if (moment === "weekend") return hasCategory(result, "weekend");
  if (moment === "later") return hasCategory(result, "weekend") || hasCategory(result, "buiten") || hasCategory(result, "binnen");
  return hasCategory(result, "romantisch") || hasCategory(result, "eten-drinken") || hasCategory(result, "weekend");
}

function matchesVibe(result: InspirationResult, vibe?: VibeChoice) {
  if (!vibe) return true;
  const text = getResultText(result);
  if (vibe === "cultureel") return hasCategory(result, "binnen") || /cultuur|museum|historisch|boeken/.test(text);
  if (vibe === "actief") return hasCategory(result, "buiten");
  if (vibe === "eten-drinken") return hasCategory(result, "eten-drinken");
  return hasCategory(result, "gratis") || hasCategory(result, "romantisch") || /rustig|laag|wandelen|park|hofjes/.test(text);
}

/** Existing answer matching, now always scoped to the required city first. */
function getFilteredResults({
  selectedCity,
  selectedAudience,
  selectedMoment,
  selectedVibe,
  cityContentItems = [],
}: {
  selectedCity?: string;
  selectedAudience?: AudienceChoice;
  selectedMoment?: MomentChoice;
  selectedVibe?: VibeChoice;
  cityContentItems?: CityContentItem[];
}) {
  if (!selectedCity) return [];

  return getInspirationFlowResults(cityContentItems)
    .filter((result) => result.citySlug === selectedCity)
    .filter((result) => matchesAudience(result, selectedAudience))
    .filter((result) => matchesMoment(result, selectedMoment))
    .filter((result) => matchesVibe(result, selectedVibe))
    .sort((a, b) => a.title.localeCompare(b.title, "nl"));
}

function toExploreCard(result: InspirationResult, index: number): ExploreCard {
  const parsedRating = Number.parseFloat(result.rating.replace(",", "."));
  return {
    id: index + 1,
    title: result.title,
    label: result.categoryLabel,
    time: result.openingHours,
    location: result.location,
    image: null,
    href: result.href ?? `/inspiratie/${result.category}/${result.slug}`,
    description: result.description,
    price: result.price,
    rating: Number.isFinite(parsedRating) ? parsedRating : null,
    tags: result.tags,
    kind: result.type,
  };
}

export function InspirationChoiceFlow({
  initialCity,
  initialLocation,
  initialNearbyCity,
}: InspirationChoiceFlowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resultsHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const hasObservedUrlState = useRef(false);
  const pendingCityUrl = useRef<string | null>(null);
  const legacyCity = initialLocation === "nearby" ? initialNearbyCity : initialLocation;
  const initialSelectedCity = findSupportedCity(initialCity ?? legacyCity);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(initialSelectedCity?.value);
  const [cityInput, setCityInput] = useState(initialSelectedCity?.label ?? "");
  const [cityError, setCityError] = useState<string | null>(null);
  // A new flow starts with no substantive answers. A city from the URL is the
  // sole persisted initial selection; answers remain in state for editing and
  // back navigation within this mounted flow.
  const [selectedAudience, setSelectedAudience] = useState<AudienceChoice | undefined>();
  const [selectedMoment, setSelectedMoment] = useState<MomentChoice | undefined>();
  const [selectedVibe, setSelectedVibe] = useState<VibeChoice | undefined>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFlowOpen, setIsFlowOpen] = useState(true);
  const [cityContentItems, setCityContentItems] = useState<CityContentItem[]>([]);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const urlCity = searchParams.get("city");
  const matchingCities = useMemo(() => {
    const query = normalizeCitySlug(cityInput);
    if (!query) return supportedInspirationCities.slice(0, 8);
    return supportedInspirationCities.filter((city) => {
      const label = normalizeCitySlug(city.label);
      return city.value.includes(query) || label.includes(query);
    });
  }, [cityInput]);

  const filteredResults = useMemo(
    () => getFilteredResults({ selectedCity, selectedAudience, selectedMoment, selectedVibe, cityContentItems }),
    [cityContentItems, selectedAudience, selectedCity, selectedMoment, selectedVibe]
  );
  const previewCards = useMemo(() => filteredResults.slice(0, 6).map(toExploreCard), [filteredResults]);
  const fullCards = useMemo(() => filteredResults.map(toExploreCard), [filteredResults]);
  const selectedCityLabel = supportedInspirationCities.find((city) => city.value === selectedCity)?.label ?? selectedCity;
  const totalPreviewCount = Math.min(filteredResults.length, 6);

  useEffect(() => {
    if (!hasObservedUrlState.current) {
      hasObservedUrlState.current = true;
      return;
    }

    // router.replace updates search params asynchronously. Keep the freshly
    // selected city while that URL update is in flight instead of briefly
    // resetting it to the previous query value.
    if (pendingCityUrl.current === selectedCity && urlCity !== selectedCity) {
      return;
    }

    if (urlCity === pendingCityUrl.current) {
      pendingCityUrl.current = null;
    }

    const nextCity = findSupportedCity(urlCity);
    if (nextCity?.value === selectedCity || (!nextCity && !selectedCity)) return;

    setSelectedCity(nextCity?.value);
    setCityInput(nextCity?.label ?? "");
    setCityError(null);
    setCurrentStep(1);
    setIsFlowOpen(true);
  }, [selectedCity, urlCity]);

  useEffect(() => {
    if (!isCityContentCity(selectedCity)) {
      setCityContentItems([]);
      setIsLoadingCity(false);
      return;
    }

    let isCancelled = false;
    setCityContentItems([]);
    setIsLoadingCity(true);

    getCityContentByCity(selectedCity)
      .then((items) => {
        if (!isCancelled) setCityContentItems(items);
      })
      .catch(() => {
        if (!isCancelled) setCityContentItems([]);
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingCity(false);
      });

    return () => { isCancelled = true; };
  }, [selectedCity]);

  function updateCityUrl(city: string) {
    pendingCityUrl.current = city;
    const params = new URLSearchParams(searchParams.toString());
    params.set("city", city);
    params.delete("location");
    params.delete("nearbyCity");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function selectCity(city: CityOption) {
    setSelectedCity(city.value);
    setCityInput(city.label);
    setCityError(null);
    updateCityUrl(city.value);
  }

  function selectCityFromInput() {
    const city = findSupportedCity(cityInput);
    if (!city) {
      if (cityInput.trim()) setCityError("Kies een stad uit de getoonde lijst.");
      return;
    }
    selectCity(city);
  }

  function chooseQuestion(value: string) {
    const step = inspirationFlowSteps[currentStep - 1];
    if (step?.type !== "question") return;

    if (step.id === "audience") setSelectedAudience(value as AudienceChoice);
    if (step.id === "moment") setSelectedMoment(value as MomentChoice);
    if (step.id === "vibe") setSelectedVibe(value as VibeChoice);
    setCurrentStep((current) => Math.min(current + 1, inspirationFlowSteps.length));
  }

  function chooseAudienceFromIntroduction(value: string) {
    if (!selectedCity) return;
    setSelectedAudience(value as AudienceChoice);
    setCurrentStep(3);
  }

  function viewAllFromIntroduction() {
    setSelectedAudience(undefined);
    setSelectedMoment(undefined);
    setSelectedVibe(undefined);
    finishFlow();
  }

  function finishFlow() {
    setIsFlowOpen(false);
    window.setTimeout(() => resultsHeadingRef.current?.focus({ preventScroll: true }), 0);
  }

  function openFlowAtCityStep() {
    setCurrentStep(1);
    setIsFlowOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#F6F5F0] px-4 pb-16 pt-28 text-[#29342F] sm:px-7 lg:px-10">
      <section aria-hidden={isFlowOpen} className={isFlowOpen ? "invisible" : "mx-auto max-w-[72rem]"}>
        <div className="flex flex-col justify-between gap-5 border-b border-[#DCE1DC] pb-7 sm:flex-row sm:items-end">
          <div>
            <h1 ref={resultsHeadingRef} id="inspiration-results-heading" tabIndex={-1} className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.06em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC]">
              Dit past bij jouw keuzes
            </h1>
            <p className="mt-4 text-base leading-7 text-[#65736C] sm:text-lg">
              {selectedCityLabel ? `${fullCards.length} ${fullCards.length === 1 ? "idee" : "ideeën"} in ${selectedCityLabel}` : "Kies een stad om jouw resultaten te bekijken."}
            </p>
          </div>
          <button type="button" onClick={openFlowAtCityStep} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-[#DCE1DC] bg-white px-5 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">
            Keuzes aanpassen
          </button>
        </div>

        {isLoadingCity ? (
          <p className="py-10 text-base text-[#65736C]" role="status">We vullen je selectie met actuele city-content.</p>
        ) : fullCards.length ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {fullCards.map((card) => <ExploreCardItem key={card.href} card={card} variant="flow" isSelected={false} onSelect={() => undefined} />)}
          </div>
        ) : (
          <div className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 sm:py-10">
            <p className="text-lg font-semibold tracking-[-0.025em]">We vonden nog geen perfecte match{selectedCityLabel ? ` in ${selectedCityLabel}` : ""}.</p>
            <p className="mt-2 text-sm leading-6 text-[#65736C] sm:text-base">Pas je keuzes aan of kies een andere stad.</p>
          </div>
        )}
      </section>

      {isFlowOpen ? (
        <FullscreenChoiceFlow
          steps={inspirationFlowSteps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={finishFlow}
          onEditChoices={() => setCurrentStep(1)}
          secondaryAction={selectedCity ? { label: "Bekijk alle resultaten", onClick: finishFlow } : undefined}
          showProgress={({ stepNumber }) => stepNumber > 1}
          showFooter={({ stepNumber }) => stepNumber > 1}
          exitHref="/"
          exitLabel="Terug naar Home"
          decorativeLayer={({ isResultsStep }) => (
            <InspirationFlowScenery
              variant={isResultsStep ? "subtle" : "default"}
            />
          )}
        >
          {({ stepNumber, isResultsStep }) => {
            const step = inspirationFlowSteps[stepNumber - 1];
            if (isResultsStep) {
              const description = isLoadingCity
                ? "We vullen je selectie met actuele city-content."
                : `${totalPreviewCount} ${totalPreviewCount === 1 ? "idee" : "ideeën"} in ${selectedCityLabel}`;
              return (
                <FullscreenChoiceResults description={description}>
                  {isLoadingCity ? (
                    <p className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 text-sm leading-6 text-[#65736C] sm:text-base" role="status">Een momentje: we verwerken de actuele stadssuggesties.</p>
                  ) : previewCards.length ? (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
                      {previewCards.map((card) => <ExploreCardItem key={card.href} card={card} variant="flow" isSelected={false} onSelect={() => undefined} />)}
                    </div>
                  ) : (
                    <div className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 sm:py-10">
                      <p className="text-lg font-semibold tracking-[-0.025em]">We vonden nog geen perfecte match in {selectedCityLabel}.</p>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#65736C] sm:text-base">Pas je keuzes aan of bekijk alle inspiratie voor deze stad.</p>
                      <button type="button" onClick={() => setCurrentStep(1)} className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[#DCE1DC] bg-white px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">Keuzes aanpassen</button>
                    </div>
                  )}
                </FullscreenChoiceResults>
              );
            }

            if (step.id === "city") {
              return (
                <FullscreenChoiceQuestion
                  title={step.title}
                  description={step.description}
                  primaryAction={selectedCity ? (
                    <button
                      type="button"
                      onClick={viewAllFromIntroduction}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1D5A46] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
                    >
                      Bekijk alle uitjes in {selectedCityLabel} <span className="ml-2" aria-hidden="true">→</span>
                    </button>
                  ) : undefined}
                  transitionLabel={selectedCity ? "Of krijg persoonlijkere suggesties" : undefined}
                >
                  <div className="w-full max-w-2xl rounded-[1.4rem] border border-[#DCE1DC] bg-white/[0.96] p-4 shadow-[0_14px_30px_rgba(41,52,47,0.06)] sm:p-5">
                    <label htmlFor="inspiration-city-search" className="text-sm font-semibold text-[#29342F]">Zoek een stad</label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <input id="inspiration-city-search" value={cityInput} onChange={(event) => { setCityInput(event.target.value); setCityError(null); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); selectCityFromInput(); } }} placeholder="Bijvoorbeeld Nijmegen" autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#B8C5BE] bg-white px-4 text-base text-[#29342F] outline-none placeholder:text-[#65736C] focus:border-[#005FCC] focus:ring-2 focus:ring-[#005FCC]" />
                      <button type="button" onClick={selectCityFromInput} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1D5A46] px-5 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">Selecteer stad</button>
                    </div>
                    <p className="sr-only" aria-live="polite">{matchingCities.length} {matchingCities.length === 1 ? "stad gevonden" : "steden gevonden"}.</p>
                    {cityError ? <p className="mt-3 text-sm font-medium text-[#875B2A]" role="alert">{cityError}</p> : null}
                    <div className={`${selectedCity ? "mt-5 max-h-40 sm:max-h-48" : "mt-5 max-h-72"} overflow-y-auto pr-1`}>
                      <p className="text-xs font-semibold tracking-[0.12em] text-[#65736C]">{cityInput.trim() ? "Zoekresultaten" : "Beschikbare steden"}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {matchingCities.map((city) => {
                          const isSelected = city.value === selectedCity;
                          return <button key={city.value} type="button" aria-pressed={isSelected} onClick={() => selectCity(city)} className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] ${isSelected ? "border-[#1D5A46] bg-[#DDEBE2] text-[#173F31]" : "border-[#DCE1DC] bg-white text-[#29342F] hover:border-[#9DBAAE]"}`}><span>{city.label}</span>{isSelected ? <CheckIcon /> : null}</button>;
                        })}
                      </div>
                      {cityInput.trim() && matchingCities.length === 0 ? <p className="py-3 text-sm leading-6 text-[#65736C]">Deze stad wordt nog niet ondersteund. Kies een stad uit de lijst.</p> : null}
                    </div>
                    {selectedCity ? (
                      <div className="mt-5 border-t border-[#DCE1DC] pt-4">
                        <FullscreenChoiceGrid
                          title="Met wie ga je op pad?"
                          selectedValue={selectedAudience}
                          onChoose={chooseAudienceFromIntroduction}
                          compactMobile
                          options={audienceOptions.map(({ value, label, helper, icon }) => ({ value, label, description: helper, icon }))}
                        />
                      </div>
                    ) : null}
                  </div>
                </FullscreenChoiceQuestion>
              );
            }

            if (step.type === "question") {
              const selectedValue = step.id === "audience" ? selectedAudience : step.id === "moment" ? selectedMoment : selectedVibe;
              return <FullscreenChoiceQuestion contextLabel={selectedCityLabel ? `In ${selectedCityLabel}` : undefined} title={step.title} description={step.description}><FullscreenChoiceGrid title={step.title} selectedValue={selectedValue} onChoose={chooseQuestion} options={step.options.map(({ value, label, helper, icon }) => ({ value, label, description: helper, icon }))} /></FullscreenChoiceQuestion>;
            }

            return null;
          }}
        </FullscreenChoiceFlow>
      ) : null}
    </main>
  );
}

function CheckIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.2 4.2L19.5 6" /></svg>; }
function PersonIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="3" /><path d="M6.5 19a5.5 5.5 0 0 1 11 0" /></svg>; }
function HeartIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>; }
function PeopleIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 19v-1.5a3.5 3.5 0 0 0-7 0V19" /><circle cx="12.5" cy="8" r="3" /><path d="M5 18v-1a3 3 0 0 1 3-3M19 18v-1a3 3 0 0 0-3-3" /></svg>; }
function BoltIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" /></svg>; }
function MoonIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 15.5A8 8 0 0 1 8.5 4 7 7 0 1 0 20 15.5Z" /></svg>; }
function CalendarIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>; }
function ClockIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>; }
function MuseumIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m4 10 8-5 8 5M5 10h14M7 10v8M12 10v8M17 10v8M5 18h14" /></svg>; }
function LocationArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m5 12 14-7-7 14-2-7-5 0Z" /></svg>; }
function CupIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4h10v7a5 5 0 0 1-10 0V4ZM16 7h1.5a2.5 2.5 0 0 1 0 5H16M8 20h6" /></svg>; }
function SmileIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><path d="M8.5 10h.01M15.5 10h.01M8.5 14.5a4.8 4.8 0 0 0 7 0" /></svg>; }
