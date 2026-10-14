"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CityExploreResultsSection from "@/components/city-explore/CityExploreResultsSection";
import {
  FullscreenChoiceFlow,
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
import { useLocale } from "@/components/i18n/LocaleProvider";
import InspirationChoiceStep from "./InspirationChoiceStep";
import InspirationCityStep from "./InspirationCityStep";
import { InspirationFlowScenery } from "./InspirationFlowScenery";
import InspirationResultsPreview from "./InspirationResultsPreview";

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

type InspirationChoiceOptionDefinition<
  T extends AudienceChoice | MomentChoice | VibeChoice,
> = {
  value: T;
  labelKey: string;
  helperKey: string;
  icon: () => ReactElement;
};

type InspirationQuestionDefinition =
  | {
      id: "audience";
      titleKey: string;
      descriptionKey: string;
      options: ReadonlyArray<InspirationChoiceOptionDefinition<AudienceChoice>>;
    }
  | {
      id: "moment";
      titleKey: string;
      descriptionKey: string;
      options: ReadonlyArray<InspirationChoiceOptionDefinition<MomentChoice>>;
    }
  | {
      id: "vibe";
      titleKey: string;
      descriptionKey: string;
      options: ReadonlyArray<InspirationChoiceOptionDefinition<VibeChoice>>;
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

const INSPIRATION_QUESTION_DEFINITIONS = [
  {
    id: "audience",
    titleKey: "inspiration.audienceTitle",
    descriptionKey: "inspiration.audienceDescription",
    options: [
      { value: "solo", labelKey: "inspiration.solo", helperKey: "inspiration.soloHelper", icon: PersonIcon },
      { value: "date", labelKey: "inspiration.date", helperKey: "inspiration.dateHelper", icon: HeartIcon },
      { value: "gezin", labelKey: "inspiration.family", helperKey: "inspiration.familyHelper", icon: PeopleIcon },
      { value: "vrienden", labelKey: "inspiration.friends", helperKey: "inspiration.friendsHelper", icon: PeopleIcon },
    ],
  },
  {
    id: "moment",
    titleKey: "inspiration.momentTitle",
    descriptionKey: "inspiration.momentDescription",
    options: [
      { value: "nu", labelKey: "inspiration.now", helperKey: "inspiration.nowHelper", icon: BoltIcon },
      { value: "vanavond", labelKey: "inspiration.tonight", helperKey: "inspiration.tonightHelper", icon: MoonIcon },
      { value: "weekend", labelKey: "inspiration.weekend", helperKey: "inspiration.weekendHelper", icon: CalendarIcon },
      { value: "later", labelKey: "inspiration.later", helperKey: "inspiration.laterHelper", icon: ClockIcon },
    ],
  },
  {
    id: "vibe",
    titleKey: "inspiration.vibeTitle",
    descriptionKey: "inspiration.vibeDescription",
    options: [
      { value: "cultureel", labelKey: "inspiration.culture", helperKey: "inspiration.cultureHelper", icon: MuseumIcon },
      { value: "actief", labelKey: "inspiration.active", helperKey: "inspiration.activeHelper", icon: LocationArrowIcon },
      { value: "eten-drinken", labelKey: "inspiration.food", helperKey: "inspiration.foodHelper", icon: CupIcon },
      { value: "relaxed", labelKey: "inspiration.relaxed", helperKey: "inspiration.relaxedHelper", icon: SmileIcon },
    ],
  },
] as const satisfies ReadonlyArray<InspirationQuestionDefinition>;

function getChoiceOptions(
  t: (key: string, values?: Record<string, string | number>) => string,
  options: InspirationQuestionDefinition["options"]
): Array<ChoiceOption<AudienceChoice | MomentChoice | VibeChoice>> {
  return options.map(({ value, labelKey, helperKey, icon: Icon }) => ({
    value,
    label: t(labelKey),
    helper: t(helperKey),
    icon: <Icon />,
  }));
}

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

function getInspirationFlowSteps(
  t: (key: string, values?: Record<string, string | number>) => string
): InspirationFlowStep[] {
  return [
    {
      type: "custom",
      id: "city",
      title: t("inspiration.cityQuestion"),
      description: t("inspiration.cityDescription"),
    },
    ...INSPIRATION_QUESTION_DEFINITIONS.map((definition) => ({
      type: "question" as const,
      id: definition.id,
      title: t(definition.titleKey),
      description: t(definition.descriptionKey),
      options: getChoiceOptions(t, definition.options),
    })),
    { type: "results", id: "results" },
  ];
}

function getQuestionOptionLabel(
  steps: InspirationFlowStep[],
  id: InspirationSelectionKey,
  value?: string
) {
  if (!value) return null;

  const questionStep = steps.find(
    (step): step is QuestionFlowStep => step.type === "question" && step.id === id
  );

  return questionStep?.options.find((option) => option.value === value)?.label ?? null;
}

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
    ratingValue: result.ratingValue,
    reviewCount: result.reviewCount,
    ratingSource: result.ratingSource,
    ratingMax: result.ratingMax,
    reviewsHref: result.reviewsHref ?? null,
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
  const { t } = useLocale();
  const inspirationFlowSteps = getInspirationFlowSteps(t);
  const audienceOptions = getChoiceOptions(t, INSPIRATION_QUESTION_DEFINITIONS[0].options);
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
    getQuestionOptionLabel(inspirationFlowSteps, "audience", selectedAudience),
    getQuestionOptionLabel(inspirationFlowSteps, "moment", selectedMoment),
    getQuestionOptionLabel(inspirationFlowSteps, "vibe", selectedVibe),
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
      if (cityInput.trim()) setCityError(t("inspiration.chooseListedCity"));
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
      setCityError(t("inspiration.locationUnavailable"));
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
        setCityError(t("inspiration.locationUnavailable"));
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

  function viewAllResults() {
    setSelectedAudience(undefined);
    setSelectedMoment(undefined);
    setSelectedVibe(undefined);
    setResultFilters([]);
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
          onViewAllResults={viewAllResults}
          onEditChoices={() => setCurrentStep(1)}
          secondaryAction={selectedCity ? { label: t("inspiration.allResults"), onClick: viewAllResults } : undefined}
          showProgress={({ stepNumber }) => stepNumber > 1}
          showFooter={({ stepNumber }) => stepNumber > 1}
          exitHref="/"
          exitLabel={t("inspiration.backHome")}
          decorativeLayer={({ isResultsStep }) => (
            <InspirationFlowScenery
              variant={isResultsStep ? "subtle" : "default"}
            />
          )}
        >
          {({ stepNumber, isResultsStep }) => {
            const step = inspirationFlowSteps[stepNumber - 1];
            if (isResultsStep) {
              return (
                <InspirationResultsPreview
                  cityLabel={selectedCityLabel ?? ""}
                  previewCards={previewCards}
                  totalPreviewCount={totalPreviewCount}
                  isLoading={isLoadingCity}
                  onEditChoices={() => setCurrentStep(1)}
                />
              );
            }

            if (step.id === "city") {
              return (
                <InspirationCityStep
                  selectedCity={selectedCity}
                  selectedCityLabel={selectedCityLabel}
                  cityInput={cityInput}
                  cityError={cityError}
                  matchingCities={matchingCities}
                  activeCityIndex={activeCityIndex}
                  isCityListOpen={isCityListOpen}
                  isResolvingLocation={isResolvingLocation}
                  cityInputRef={cityInputRef}
                  audienceOptions={audienceOptions}
                  selectedAudience={selectedAudience}
                  onCityInputChange={(nextInput) => {
                    setCityInput(nextInput);
                    setCityError(null);
                    setIsCityListOpen(true);
                    setActiveCityIndex(-1);
                    if (selectedCity && nextInput !== selectedCityLabel) {
                      setSelectedCity(undefined);
                      updateCityUrl();
                    }
                  }}
                  onCityInputKeyDown={(event) => {
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
                  onOpenCityList={() => setIsCityListOpen(true)}
                  onToggleCityList={() => {
                    setIsCityListOpen((open) => !open);
                    setActiveCityIndex(-1);
                    cityInputRef.current?.focus();
                  }}
                  onCityHover={setActiveCityIndex}
                  onCityMouseDown={selectCity}
                  onSelectCityFromInput={selectCityFromInput}
                  onClearCity={clearCity}
                  onRequestLocation={requestLocation}
                  onChooseAudience={chooseAudienceFromIntroduction}
                  onViewAllResults={viewAllResults}
                />
              );
            }

            if (step.type === "question") {
              const selectedValue = step.id === "audience" ? selectedAudience : step.id === "moment" ? selectedMoment : selectedVibe;
              return (
                <InspirationChoiceStep
                  contextLabel={selectedCityLabel ? t("inspiration.inCity", { city: selectedCityLabel }) : undefined}
                  title={step.title}
                  description={step.description}
                  selectedValue={selectedValue}
                  onChoose={chooseQuestion}
                  options={step.options}
                />
              );
            }

            return null;
          }}
        </FullscreenChoiceFlow>
      ) : null}
    </main>
  );
}

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
