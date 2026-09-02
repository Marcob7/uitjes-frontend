"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ExploreCardItem from "@/components/city-explore/ExploreCardItem";
import CityExploreResultsSection from "@/components/city-explore/CityExploreResultsSection";
import {
  FullscreenChoiceFlow,
  FullscreenChoiceGrid,
  FullscreenChoiceQuestion,
  FullscreenChoiceResults,
  type FullscreenChoiceFlowStep,
} from "@/components/city-explore/FullscreenChoiceFlow";
import type { ExploreCard, ResultFilterKey } from "@/components/city-explore/types";
import { filterCardsByResultFilters } from "@/components/city-explore/utils";
import { getCityContentByCity, type CityContentItem } from "@/lib/api/cityContent";
import { CITY_CONTENT_CITY_SLUGS, isCityContentCity } from "@/lib/cityContentCities";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import {
  featuredInspirationCities,
  resolveNearestInspirationCityFromCoordinates,
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
    latitude: result.latitude ?? null,
    longitude: result.longitude ?? null,
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
  const resultsRef = useRef<HTMLElement | null>(null);
  const hasObservedUrlState = useRef(false);
  const pendingCityUrl = useRef<string | null | undefined>(null);
  const legacyCity = initialLocation === "nearby" ? initialNearbyCity : initialLocation;
  const initialSelectedCity = findSupportedCity(initialCity ?? legacyCity);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(initialSelectedCity?.value);
  const [cityInput, setCityInput] = useState(initialSelectedCity?.label ?? "");
  const [cityError, setCityError] = useState<string | null>(null);
  const [isCityListOpen, setIsCityListOpen] = useState(false);
  const [activeCityIndex, setActiveCityIndex] = useState(-1);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resultFilters, setResultFilters] = useState<ResultFilterKey[]>([]);

  const urlCity = searchParams.get("city");
  const matchingCities = useMemo(() => {
    const query = normalizeCitySlug(cityInput);
    if (!query) return supportedInspirationCities;
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
  const filteredCards = useMemo(
    () => filterCardsByResultFilters(fullCards, resultFilters),
    [fullCards, resultFilters]
  );
  const selectedCityLabel = supportedInspirationCities.find((city) => city.value === selectedCity)?.label ?? selectedCity;
  const totalPreviewCount = Math.min(filteredResults.length, 6);
  const selectionLabels = [
    selectedAudience ? audienceOptions.find((option) => option.value === selectedAudience)?.label : null,
    selectedMoment ? momentOptions.find((option) => option.value === selectedMoment)?.label : null,
    selectedVibe ? vibeOptions.find((option) => option.value === selectedVibe)?.label : null,
  ].filter((label): label is string => Boolean(label));

  useEffect(() => {
    if (!hasObservedUrlState.current) {
      hasObservedUrlState.current = true;
      return;
    }

    if (pendingCityUrl.current === undefined && urlCity === null) {
      pendingCityUrl.current = null;
    }

    // URL updates are asynchronous. Keep the freshly selected (or cleared)
    // city while the previous query string is still rendered.
    if (pendingCityUrl.current !== null && pendingCityUrl.current === selectedCity && urlCity !== selectedCity) {
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

  function updateCityUrl(city?: string) {
    pendingCityUrl.current = city;
    const params = new URLSearchParams(searchParams.toString());
    if (city) {
      params.set("city", city);
    } else {
      params.delete("city");
    }
    params.delete("location");
    params.delete("nearbyCity");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function selectCity(city: CityOption) {
    setSelectedCity(city.value);
    setCityInput(city.label);
    setCityError(null);
    setIsCityListOpen(false);
    setActiveCityIndex(-1);
    updateCityUrl(city.value);
  }

  function selectCityFromInput(preferredIndex = activeCityIndex) {
    const city = findSupportedCity(cityInput) ?? matchingCities[preferredIndex] ?? matchingCities[0];
    if (!city) {
      if (cityInput.trim()) setCityError("Kies een stad uit de getoonde lijst.");
      return;
    }
    selectCity(city);
  }

  function clearCity() {
    setSelectedCity(undefined);
    setCityInput("");
    setCityError(null);
    setIsCityListOpen(false);
    setActiveCityIndex(-1);
    updateCityUrl();
    cityInputRef.current?.focus();
  }

  function requestLocation() {
    setCityError(null);
    if (!("geolocation" in navigator)) {
      setCityError("We konden je locatie niet bepalen. Kies zelf een stad.");
      return;
    }

    setIsResolvingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const city = findSupportedCity(resolveNearestInspirationCityFromCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsResolvingLocation(false);
        if (city) selectCity(city);
      },
      () => {
        setIsResolvingLocation(false);
        setCityError("We konden je locatie niet bepalen. Kies zelf een stad.");
      },
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
    );
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
    window.setTimeout(() => {
      resultsRef.current
        ?.querySelector<HTMLElement>("#explore-results-heading")
        ?.focus({ preventScroll: true });
    }, 0);
  }

  function openFlowAtCityStep() {
    setCurrentStep(1);
    setIsFlowOpen(true);
  }

  function handleToggleResultFilter(filter: ResultFilterKey) {
    setResultFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  }

  function handleClearResultFilters() {
    setResultFilters([]);
  }

  function handleClearAllFilters() {
    setResultFilters([]);
    setSelectedAudience(undefined);
    setSelectedMoment(undefined);
    setSelectedVibe(undefined);
  }

  useEffect(() => {
    const firstAvailableId = filteredCards[0]?.id ?? null;
    setSelectedId((current) =>
      current && filteredCards.some((card) => card.id === current)
        ? current
        : firstAvailableId
    );
  }, [filteredCards]);

  return (
    <main className="min-h-screen bg-[#F6F5F0] pb-16 pt-32 text-[#29342F] lg:pt-48">
      <div aria-hidden={isFlowOpen} className={isFlowOpen ? "invisible" : undefined}>
        <CityExploreResultsSection
          cityLabel={selectedCityLabel ?? "Nederland"}
          filteredCards={filteredCards}
          selectedId={selectedId}
          onSelectCard={setSelectedId}
          sectionRef={resultsRef}
          selectionLabels={selectionLabels}
          hasPlannerSelections={selectionLabels.length > 0}
          isLoading={isLoadingCity}
          onEditSelection={openFlowAtCityStep}
          resultFilters={resultFilters}
          onToggleResultFilter={handleToggleResultFilter}
          onClearResultFilters={handleClearResultFilters}
          onClearAllFilters={handleClearAllFilters}
        />
      </div>

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
                          onChange={(event) => {
                            const nextInput = event.target.value;
                            setCityInput(nextInput);
                            setCityError(null);
                            setIsCityListOpen(true);
                            setActiveCityIndex(-1);
                            if (selectedCity && nextInput !== selectedCityLabel) {
                              setSelectedCity(undefined);
                              updateCityUrl();
                            }
                          }}
                          onFocus={() => setIsCityListOpen(true)}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowDown") {
                              event.preventDefault();
                              setIsCityListOpen(true);
                              setActiveCityIndex((index) => Math.min(index + 1, matchingCities.length - 1));
                            } else if (event.key === "ArrowUp") {
                              event.preventDefault();
                              setIsCityListOpen(true);
                              setActiveCityIndex((index) => Math.max(index - 1, 0));
                            } else if (event.key === "Enter") {
                              event.preventDefault();
                              selectCityFromInput();
                            } else if (event.key === "Escape") {
                              event.preventDefault();
                              setIsCityListOpen(false);
                              setActiveCityIndex(-1);
                            }
                          }}
                          placeholder="Bijvoorbeeld Nijmegen"
                          autoComplete="off"
                          inputMode="search"
                          spellCheck={false}
                          className="min-h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-base text-[#29342F] outline-none placeholder:text-[#65736C]"
                          />
                          {cityInput ? <button type="button" onClick={clearCity} aria-label="Geselecteerde stad wissen" className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#65736C] transition hover:bg-[#F1F4F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">×</button> : null}
                          <button type="button" onClick={() => { setIsCityListOpen((open) => !open); setActiveCityIndex(-1); cityInputRef.current?.focus(); }} aria-label={isCityListOpen ? "Steden sluiten" : "Steden tonen"} aria-expanded={isCityListOpen} aria-controls="inspiration-city-listbox" className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#29342F] transition hover:bg-[#F1F4F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"><ChevronIcon /></button>
                        </div>
                        <button type="button" onClick={() => selectCityFromInput()} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1D5A46] px-5 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]">Selecteer stad</button>
                      </div>
                      {isCityListOpen ? (
                        <div id="inspiration-city-listbox" role="listbox" aria-label="Beschikbare steden" className="absolute z-20 mt-2 max-h-[min(18rem,45vh)] w-full overflow-y-auto rounded-xl border border-[#DCE1DC] bg-white p-1.5 shadow-[0_20px_45px_rgba(41,52,47,0.16)]">
                          {matchingCities.map((city, index) => (
                            <button
                              key={city.value}
                              id={`inspiration-city-option-${city.value}`}
                              role="option"
                              aria-selected={city.value === selectedCity}
                              type="button"
                              onMouseEnter={() => setActiveCityIndex(index)}
                              onMouseDown={(event) => { event.preventDefault(); selectCity(city); }}
                              className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005FCC] ${index === activeCityIndex ? "bg-[#EEF5F0] text-[#173F31]" : "text-[#29342F] hover:bg-[#F4F6F4]"}`}
                            ><span>{city.label}</span>{city.value === selectedCity ? <CheckIcon /> : null}</button>
                          ))}
                          {matchingCities.length === 0 ? <p className="px-3 py-3 text-sm leading-6 text-[#65736C]">Deze stad wordt nog niet ondersteund. Kies een andere stad.</p> : null}
                        </div>
                      ) : null}
                    </div>
                    <p className="sr-only" aria-live="polite">{matchingCities.length} {matchingCities.length === 1 ? "stad gevonden" : "steden gevonden"}.</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button type="button" onClick={requestLocation} disabled={isResolvingLocation} className="min-h-11 text-sm font-semibold text-[#355E7A] underline decoration-[#B8C5BE] underline-offset-4 transition hover:text-[#173F31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] disabled:cursor-wait disabled:opacity-70">{isResolvingLocation ? "Locatie bepalen…" : "Gebruik mijn locatie"}</button>
                      {cityError ? <p className="text-sm font-medium text-[#875B2A]" role="alert">{cityError}</p> : null}
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
function ChevronIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 10 5 5 5-5" /></svg>; }
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
