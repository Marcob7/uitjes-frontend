"use client";

import Link from "next/link";
import * as React from "react";

import { AppButton, AppEmptyState, AppFilterChip, AppInput, AppSection } from "@/components/ui/app";
import { getCityContentByCity, type CityContentItem } from "@/lib/api/cityContent";
import { isCityContentCity } from "@/lib/cityContentCities";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import {
  getInspirationCityLabel,
  getNearbyInspirationCitySlug,
  isInspirationCategorySlug,
  resolveNearestInspirationCityFromCoordinates,
  type InspirationCategorySlug,
  type InspirationResult,
} from "@/lib/dummy/inspirationResults";
import { getInspirationFlowResults } from "@/lib/inspiration/cityContentMapper";
import { optimizeCssBackground } from "@/lib/remoteImage";
import { cn } from "@/lib/utils";
import { InspirationValleyScenery } from "./InspirationValleyScenery";
import { SquirrelScreenWalker } from "./SquirrelScreenWalker";

type LocationMode = "nearby" | "city" | "surprise";
type AudienceChoice = "solo" | "date" | "gezin" | "vrienden";
type MomentChoice = "nu" | "vanavond" | "weekend" | "later";
type VibeChoice = "cultureel" | "actief" | "eten-drinken" | "relaxed";

type InspirationChoiceFlowProps = {
  initialCategory?: string;
  initialLocation?: string;
  initialNearbyCity?: string;
};

type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  helper: string;
};

type WizardStep = 1 | 2 | 3 | 4;

const audienceOptions: Array<ChoiceOption<AudienceChoice>> = [
  { value: "solo", label: "Alleen", helper: "Vrij en flexibel" },
  { value: "date", label: "Date", helper: "Samen iets bijzonders" },
  { value: "gezin", label: "Gezin", helper: "Praktisch met kinderen" },
  { value: "vrienden", label: "Vrienden", helper: "Gezellig samen" },
];

const momentOptions: Array<ChoiceOption<MomentChoice>> = [
  { value: "nu", label: "Nu", helper: "Snel te plannen" },
  { value: "vanavond", label: "Vanavond", helper: "Avondgevoel" },
  { value: "weekend", label: "Dit weekend", helper: "Voor een vrije dag" },
  { value: "later", label: "Later plannen", helper: "Bewaar inspiratie" },
];

const vibeOptions: Array<ChoiceOption<VibeChoice>> = [
  { value: "cultureel", label: "Cultureel", helper: "Kijken en ontdekken" },
  { value: "actief", label: "Actief / buiten", helper: "Lucht en beweging" },
  { value: "eten-drinken", label: "Eten & drinken", helper: "Lunch, borrel, diner" },
  { value: "relaxed", label: "Relaxed", helper: "Rustig en laagdrempelig" },
];

function findCity(input: string) {
  const normalized = normalizeCitySlug(input);

  return cityOptions.find(
    (city) =>
      city.value === normalized ||
      normalizeCitySlug(city.label) === normalized
  );
}

function getInitialCityInput(location?: string) {
  if (!location || location === "nearby" || location === "surprise") return "";

  return cityOptions.find((city) => city.value === location)?.label ?? location;
}

function getInitialLocationMode(location?: string): LocationMode | undefined {
  if (location === "nearby" || location === "surprise") return location;
  if (location) return "city";
  return undefined;
}

function getInitialSelectedCity(location?: string, nearbyCity?: string) {
  if (location === "nearby") return getNearbyInspirationCitySlug(nearbyCity);
  if (location && location !== "surprise") return location;
  return undefined;
}

function getCategoryDefaults(category?: string): {
  audience?: AudienceChoice;
  moment?: MomentChoice;
  vibe?: VibeChoice;
} {
  if (!category || !isInspirationCategorySlug(category)) return {};

  switch (category) {
    case "met-kinderen":
      return { audience: "gezin" };
    case "romantisch":
      return { audience: "date" };
    case "vandaag":
      return { moment: "nu" };
    case "weekend":
      return { moment: "weekend" };
    case "eten-drinken":
      return { vibe: "eten-drinken" };
    case "buiten":
      return { vibe: "actief" };
    case "binnen":
      return { vibe: "cultureel" };
    case "gratis":
      return { vibe: "relaxed" };
    default:
      return {};
  }
}

function hasCategory(result: InspirationResult, category: InspirationCategorySlug) {
  return result.categories.includes(category);
}

function getResultText(result: InspirationResult) {
  return `${result.title} ${result.categoryLabel} ${result.description} ${result.tags.join(
    " "
  )} ${result.type}`.toLowerCase();
}

function matchesAudience(result: InspirationResult, audience?: AudienceChoice) {
  if (!audience) return true;
  if (audience === "solo") return !hasCategory(result, "met-kinderen");
  if (audience === "date") {
    return (
      hasCategory(result, "romantisch") ||
      hasCategory(result, "eten-drinken") ||
      hasCategory(result, "weekend")
    );
  }
  if (audience === "gezin") return hasCategory(result, "met-kinderen");

  return (
    hasCategory(result, "weekend") ||
    hasCategory(result, "eten-drinken") ||
    hasCategory(result, "buiten")
  );
}

function matchesMoment(result: InspirationResult, moment?: MomentChoice) {
  if (!moment) return true;
  if (moment === "nu") return hasCategory(result, "vandaag");
  if (moment === "weekend") return hasCategory(result, "weekend");
  if (moment === "later") {
    return (
      hasCategory(result, "weekend") ||
      hasCategory(result, "buiten") ||
      hasCategory(result, "binnen")
    );
  }

  return (
    hasCategory(result, "romantisch") ||
    hasCategory(result, "eten-drinken") ||
    hasCategory(result, "weekend")
  );
}

function matchesVibe(result: InspirationResult, vibe?: VibeChoice) {
  if (!vibe) return true;
  const text = getResultText(result);

  if (vibe === "cultureel") {
    return hasCategory(result, "binnen") || /cultuur|museum|historisch|boeken/.test(text);
  }
  if (vibe === "actief") return hasCategory(result, "buiten");
  if (vibe === "eten-drinken") return hasCategory(result, "eten-drinken");

  return (
    hasCategory(result, "gratis") ||
    hasCategory(result, "romantisch") ||
    /rustig|laag|wandelen|park|hofjes/.test(text)
  );
}

function sortByLocation(result: InspirationResult, selectedCity?: string) {
  if (!selectedCity) return 0;
  return result.citySlug === selectedCity ? 0 : 1;
}

function getFilteredResults({
  selectedLocation,
  selectedCity,
  selectedAudience,
  selectedMoment,
  selectedVibe,
  cityContentItems = [],
}: {
  selectedLocation?: LocationMode;
  selectedCity?: string;
  selectedAudience?: AudienceChoice;
  selectedMoment?: MomentChoice;
  selectedVibe?: VibeChoice;
  cityContentItems?: CityContentItem[];
}) {
  const inspirationFlowResults = getInspirationFlowResults(cityContentItems);
  const locationFiltered =
    selectedLocation === "city" && selectedCity
      ? inspirationFlowResults.filter((result) => result.citySlug === selectedCity)
      : selectedLocation === "nearby" && selectedCity
        ? inspirationFlowResults.filter((result) => result.citySlug === selectedCity)
        : inspirationFlowResults;

  return locationFiltered
    .filter((result) => matchesAudience(result, selectedAudience))
    .filter((result) => matchesMoment(result, selectedMoment))
    .filter((result) => matchesVibe(result, selectedVibe))
    .sort(
      (a, b) =>
        sortByLocation(a, selectedCity) - sortByLocation(b, selectedCity) ||
        a.title.localeCompare(b.title, "nl")
    )
    .slice(0, 9);
}

function getResultsTitle(selectedLocation?: LocationMode, selectedCity?: string) {
  if (selectedLocation === "city" && selectedCity) {
    return `Resultaten in ${getInspirationCityLabel(selectedCity)}`;
  }
  if (selectedLocation === "nearby" && selectedCity) {
    return `Resultaten ${getInspirationCityLabel("nearby", selectedCity)}`;
  }

  return "Resultaten voor je keuzes";
}

function getLocationSummary(selectedLocation?: LocationMode, selectedCity?: string) {
  if (selectedLocation === "city" && selectedCity) {
    return getInspirationCityLabel(selectedCity) ?? selectedCity;
  }
  if (selectedLocation === "nearby" && selectedCity) {
    return getInspirationCityLabel("nearby", selectedCity) ?? "In de buurt";
  }
  if (selectedLocation === "surprise") return "Maakt niet uit";
  return undefined;
}

function scrollToElementWithHeaderOffset(element: HTMLElement | null) {
  if (!element || typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const stickyHeaderOffset = window.matchMedia("(max-width: 640px)").matches
    ? 120
    : 112;
  const top =
    element.getBoundingClientRect().top + window.scrollY - stickyHeaderOffset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function getInitialWizardStep({
  selectedLocation,
  selectedCity,
  selectedAudience,
  selectedMoment,
  selectedVibe,
}: {
  selectedLocation?: LocationMode;
  selectedCity?: string;
  selectedAudience?: AudienceChoice;
  selectedMoment?: MomentChoice;
  selectedVibe?: VibeChoice;
}): WizardStep {
  const hasLocation =
    selectedLocation === "surprise" ||
    Boolean(selectedLocation && selectedCity);

  if (!hasLocation) return 1;
  if (!selectedAudience) return 2;
  if (!selectedMoment) return 3;
  if (!selectedVibe) return 4;
  return 4;
}

function getStepLabel(step: WizardStep) {
  return ["Locatie", "Gezelschap", "Moment", "Sfeer"][step - 1];
}

function getStepTitle(step: WizardStep) {
  return ["Waar gaan we heen?", "Met wie?", "Wanneer?", "Waar heb je zin in?"][
    step - 1
  ];
}

function getStepPrompt(step: WizardStep) {
  switch (step) {
    case 2:
      return "Kies je gezelschap om verder te gaan.";
    case 3:
      return "Kies een moment om de sfeer te bepalen.";
    case 4:
      return "Kies een sfeer om je suggesties te tonen.";
    default:
      return "Kies een locatie om verder te gaan.";
  }
}

function getStepColorClasses(step: WizardStep) {
  switch (step) {
    case 2:
      return {
        panel:
          "bg-[radial-gradient(circle_at_88%_0%,rgba(246,217,210,0.24),transparent_34%),linear-gradient(180deg,rgba(255,251,247,0.48),rgba(249,241,237,0.32))]",
        active:
          "border-[#e5b7aa] bg-[linear-gradient(180deg,#fff7f3,#f7ddd6)] text-[#4b241f] shadow-[0_12px_28px_rgba(154,80,62,0.12)]",
        option:
          "border-[#e5b7aa] bg-[linear-gradient(180deg,#fff9f6,#f8e3dd)] text-[#4b241f] shadow-[0_12px_28px_rgba(154,80,62,0.12)]",
        focus: "focus-visible:outline-[#c97361]",
      };
    case 3:
      return {
        panel:
          "bg-[radial-gradient(circle_at_88%_0%,rgba(247,231,200,0.3),transparent_34%),linear-gradient(180deg,rgba(255,252,245,0.52),rgba(250,244,231,0.34))]",
        active:
          "border-[#e2c47d] bg-[linear-gradient(180deg,#fff9e8,#f6e7bd)] text-[#4b3718] shadow-[0_12px_28px_rgba(139,98,26,0.12)]",
        option:
          "border-[#e2c47d] bg-[linear-gradient(180deg,#fffaf0,#f6e9c7)] text-[#4b3718] shadow-[0_12px_28px_rgba(139,98,26,0.12)]",
        focus: "focus-visible:outline-[#b48624]",
      };
    case 4:
      return {
        panel:
          "bg-[radial-gradient(circle_at_88%_0%,rgba(220,235,231,0.34),transparent_34%),linear-gradient(180deg,rgba(248,253,249,0.52),rgba(237,247,241,0.38))]",
        active:
          "border-[#a7cdb4] bg-[linear-gradient(180deg,#f4fbf4,#dff0e5)] text-[#243f2b] shadow-[0_12px_28px_rgba(57,111,72,0.12)]",
        option:
          "border-[#a7cdb4] bg-[linear-gradient(180deg,#f7fcf7,#e2f2e7)] text-[#243f2b] shadow-[0_12px_28px_rgba(57,111,72,0.12)]",
        focus: "focus-visible:outline-[#4f8b5f]",
      };
    default:
      return {
        panel:
          "bg-[radial-gradient(circle_at_88%_0%,rgba(198,223,154,0.28),transparent_34%),linear-gradient(180deg,rgba(251,255,244,0.52),rgba(242,248,231,0.36))]",
        active:
          "border-[#b8df71] bg-[linear-gradient(180deg,#f8fdec,#e8f6cf)] text-[#344125] shadow-[0_12px_28px_rgba(109,144,51,0.12)]",
        option:
          "border-[#b8df71] bg-[linear-gradient(180deg,#f8fdec,#e8f6cf)] text-[#344125] shadow-[0_12px_28px_rgba(109,144,51,0.12)]",
        focus: "focus-visible:outline-[#7aa33b]",
      };
  }
}

export function InspirationChoiceFlow({
  initialCategory,
  initialLocation,
  initialNearbyCity,
}: InspirationChoiceFlowProps) {
  const defaults = React.useMemo(
    () => getCategoryDefaults(initialCategory),
    [initialCategory]
  );
  const [selectedLocation, setSelectedLocation] = React.useState<
    LocationMode | undefined
  >(() => getInitialLocationMode(initialLocation));
  const [selectedCity, setSelectedCity] = React.useState<string | undefined>(() =>
    getInitialSelectedCity(initialLocation, initialNearbyCity)
  );
  const [selectedAudience, setSelectedAudience] = React.useState<
    AudienceChoice | undefined
  >(defaults.audience);
  const [selectedMoment, setSelectedMoment] = React.useState<
    MomentChoice | undefined
  >(defaults.moment);
  const [selectedVibe, setSelectedVibe] = React.useState<VibeChoice | undefined>(
    defaults.vibe
  );
  const [isPickingCity, setIsPickingCity] = React.useState(
    Boolean(initialLocation && initialLocation !== "nearby" && initialLocation !== "surprise")
  );
  const [cityInput, setCityInput] = React.useState(getInitialCityInput(initialLocation));
  const [isResolvingLocation, setIsResolvingLocation] = React.useState(false);
  const [locationStatus, setLocationStatus] = React.useState<string | null>(() => {
    if (initialLocation !== "nearby" || !initialNearbyCity) return null;
    return `We tonen resultaten op basis van je locatie, voorlopig gemapt naar ${getInspirationCityLabel(
      initialNearbyCity
    )}.`;
  });
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const nearbyRequestId = React.useRef(0);
  const [currentStep, setCurrentStep] = React.useState<WizardStep>(() =>
    getInitialWizardStep({
      selectedLocation: getInitialLocationMode(initialLocation),
      selectedCity: getInitialSelectedCity(initialLocation, initialNearbyCity),
      selectedAudience: defaults.audience,
      selectedMoment: defaults.moment,
      selectedVibe: defaults.vibe,
    })
  );
  const [areResultsVisible, setAreResultsVisible] = React.useState(() =>
    Boolean(
      getLocationSummary(
        getInitialLocationMode(initialLocation),
        getInitialSelectedCity(initialLocation, initialNearbyCity)
      ) &&
        defaults.audience &&
        defaults.moment &&
        defaults.vibe
    )
  );
  const wizardRef = React.useRef<HTMLDivElement | null>(null);
  const resultsRef = React.useRef<HTMLDivElement | null>(null);
  const shouldScrollToResultsRef = React.useRef(false);
  const [cityContentItems, setCityContentItems] = React.useState<CityContentItem[]>([]);

  const filteredResults = React.useMemo(
    () =>
      getFilteredResults({
        selectedLocation,
        selectedCity,
        selectedAudience,
        selectedMoment,
        selectedVibe,
        cityContentItems,
      }),
    [
      cityContentItems,
      selectedAudience,
      selectedCity,
      selectedLocation,
      selectedMoment,
      selectedVibe,
    ]
  );

  React.useEffect(() => {
    const city =
      (selectedLocation === "city" || selectedLocation === "nearby") && selectedCity
        ? selectedCity
        : null;

    if (!isCityContentCity(city)) {
      setCityContentItems([]);
      return;
    }

    let isCancelled = false;
    setCityContentItems([]);

    getCityContentByCity(city)
      .then((items) => {
        if (isCancelled) return;
        setCityContentItems(items);
      })
      .catch(() => {
        if (isCancelled) return;
        setCityContentItems([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity, selectedLocation]);

  function cancelPendingNearby() {
    nearbyRequestId.current += 1;
    setIsResolvingLocation(false);
  }

  function handleLocationSelect(mode: LocationMode) {
    setLocationStatus(null);
    setLocationError(null);
    setAreResultsVisible(false);

    if (mode !== "nearby") cancelPendingNearby();

    if (mode === "city") {
      setSelectedLocation("city");
      setIsPickingCity(true);
      setCurrentStep(1);
      return;
    }

    setIsPickingCity(false);

    if (mode === "surprise") {
      setSelectedLocation("surprise");
      setSelectedCity(undefined);
      setCurrentStep(2);
      return;
    }

    if (!("geolocation" in navigator)) {
      setSelectedLocation(undefined);
      setLocationError(
        "Je browser ondersteunt locatie ophalen niet. Kies een stad of gebruik 'Maakt niet uit'."
      );
      return;
    }

    setSelectedLocation("nearby");
    setIsResolvingLocation(true);
    nearbyRequestId.current += 1;
    const requestId = nearbyRequestId.current;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== nearbyRequestId.current) return;

        const nearbyCitySlug = resolveNearestInspirationCityFromCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const cityLabel = getInspirationCityLabel(nearbyCitySlug);

        setSelectedLocation("nearby");
        setSelectedCity(nearbyCitySlug);
        setLocationStatus(
          `We tonen resultaten op basis van je locatie, voorlopig gemapt naar ${cityLabel}.`
        );
        setIsResolvingLocation(false);
        setCurrentStep(2);
      },
      () => {
        if (requestId !== nearbyRequestId.current) return;

        setSelectedLocation(undefined);
        setLocationError(
          "Locatie ophalen is niet gelukt. Kies een stad of gebruik 'Maakt niet uit' om verder te gaan."
        );
        setIsResolvingLocation(false);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 10000,
      }
    );
  }

  function confirmCity() {
    const trimmed = cityInput.trim();
    if (trimmed.length < 2) return;

    cancelPendingNearby();
    setAreResultsVisible(false);
    setSelectedLocation("city");
    setSelectedCity(findCity(trimmed)?.value ?? normalizeCitySlug(trimmed));
    setLocationStatus(null);
    setLocationError(null);
    setIsPickingCity(false);
    setCurrentStep(2);
  }

  function resetFilters() {
    cancelPendingNearby();
    shouldScrollToResultsRef.current = false;
    setAreResultsVisible(false);
    setSelectedLocation(undefined);
    setSelectedCity(undefined);
    setSelectedAudience(undefined);
    setSelectedMoment(undefined);
    setSelectedVibe(undefined);
    setIsPickingCity(false);
    setCityInput("");
    setLocationStatus(null);
    setLocationError(null);
    setCurrentStep(1);
  }

  function handleAudienceSelect(value: AudienceChoice | undefined) {
    setAreResultsVisible(false);
    setSelectedAudience(value);
    if (value) setCurrentStep(3);
  }

  function handleMomentSelect(value: MomentChoice | undefined) {
    setAreResultsVisible(false);
    setSelectedMoment(value);
    if (value) setCurrentStep(4);
  }

  function handleVibeSelect(value: VibeChoice | undefined) {
    if (value) {
      shouldScrollToResultsRef.current = true;
    }
    setAreResultsVisible(Boolean(value));
    setSelectedVibe(value);
  }

  const locationSummary = getLocationSummary(selectedLocation, selectedCity);
  const audienceSummary = audienceOptions.find(
    (option) => option.value === selectedAudience
  )?.label;
  const momentSummary = momentOptions.find(
    (option) => option.value === selectedMoment
  )?.label;
  const vibeSummary = vibeOptions.find((option) => option.value === selectedVibe)?.label;
  const isWizardComplete = Boolean(locationSummary && selectedAudience && selectedMoment && selectedVibe);
  const shouldShowResults = isWizardComplete && areResultsVisible;

  React.useEffect(() => {
    if (!shouldShowResults || !shouldScrollToResultsRef.current) return;

    shouldScrollToResultsRef.current = false;
    const frameId = window.requestAnimationFrame(() => {
      const resultsElement = resultsRef.current;
      if (!resultsElement) return;

      scrollToElementWithHeaderOffset(resultsElement);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [shouldShowResults, selectedVibe]);

  return (
    <main className="mt-14 min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_15%_6%,rgba(198,223,154,0.2),transparent_26%),radial-gradient(circle_at_84%_10%,rgba(247,231,200,0.34),transparent_24%),linear-gradient(180deg,#fbf7ef,#f8f5f3_46%,#f6f1ea)] text-[#171511]">
      <section className="relative isolate overflow-hidden">
        <InspirationValleyScenery />
        <div className="relative z-10">
          <AppSection maxWidth="default" spacing="sm" horizontalPadding={false} innerClassName="px-4 pt-20 pb-7 min-[520px]:px-6 sm:pt-24 md:px-0 md:pt-[7.5rem] lg:pt-28 lg:pb-10">
            <div className="mx-auto grid max-w-[1240px] gap-7 md:gap-4">
          <div className="mt-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[42rem]">
            
              <h1 className="mt-2 max-w-[42rem] text-[clamp(2.2rem,10.8vw,2.65rem)] font-semibold leading-[1] tracking-[-0.045em] text-[#171511] md:mt-1 md:text-[clamp(2.8rem,4.5vw,3.75rem)] md:leading-[0.95]">
                Waar wil je inspiratie voor?
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#665d54] sm:text-base">
                Kies stap voor stap wat past. Ontdek unieke plekjes en activiteiten op basis van jouw persoonlijke voorkeuren. Na de vierde keuze tonen we je suggesties.
              </p>
            </div>
            <AppButton
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="self-start border-transparent bg-transparent text-[#2f4f34] shadow-none hover:border-[#d6c9b8] hover:bg-white/70 sm:mt-1"
            >
              Wis keuzes
            </AppButton>
          </div>

          <SquirrelScreenWalker />

          <div
            ref={wizardRef}
            tabIndex={-1}
            className="grid gap-4 focus:outline-none md:gap-3"
          >
            <div className="md:hidden">
              <MobileStepProgress
                currentStep={currentStep}
                title={getStepTitle(currentStep)}
                onPrevious={
                  currentStep > 1
                    ? () => setCurrentStep((currentStep - 1) as WizardStep)
                    : undefined
                }
              />
            </div>

            <div className="hidden md:block">
              <WizardProgress
                currentStep={currentStep}
                summaries={[locationSummary, audienceSummary, momentSummary, vibeSummary]}
                onStepSelect={setCurrentStep}
              />
            </div>

            <div>
              {currentStep === 1 ? (
                <WizardPanel
                  tone={1}
                  step="Stap 1 van 4"
                  title="Waar gaan we heen?"
                  description="Kies eerst je locatiecontext zodat we de meest relevante plekken voor je kunnen vinden."
                >
                  <div className="grid gap-4 min-[560px]:grid-cols-3">
                    <button
                      type="button"
                      aria-pressed={selectedLocation === "nearby"}
                      onClick={() => handleLocationSelect("nearby")}
                      disabled={isResolvingLocation}
                      className={cn(
                        "group grid min-h-[168px] content-center justify-items-center rounded-[1.25rem] border bg-white px-5 py-6 text-center shadow-[0_18px_36px_rgba(35,48,38,0.06)] transition active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007a3d] disabled:cursor-wait disabled:opacity-70 motion-safe:hover:-translate-y-0.5",
                        selectedLocation === "nearby"
                          ? "border-[#007a3d] text-[#004c29]"
                          : "border-[#ece8df] text-[#171511] hover:border-[#b8df71]"
                      )}
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e9f4ec] text-[#007a3d] transition group-hover:scale-105">
                        <LocationArrowIcon />
                      </span>
                      <span className="mt-6 text-lg font-semibold leading-tight">
                        {isResolvingLocation
                          ? "Locatie ophalen..."
                          : "In de buurt van mij"}
                      </span>
                      <span className="mt-2 text-xs font-medium leading-5 text-[#665d54]">
                        Gebruik je huidige locatie
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={selectedLocation === "city" || isPickingCity}
                      onClick={() => handleLocationSelect("city")}
                      className={cn(
                        "group grid min-h-[168px] content-center justify-items-center rounded-[1.25rem] border bg-white px-5 py-6 text-center shadow-[0_18px_36px_rgba(35,48,38,0.06)] transition active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007a3d] motion-safe:hover:-translate-y-0.5",
                        selectedLocation === "city" || isPickingCity
                          ? "border-[#007a3d] text-[#004c29]"
                          : "border-[#ece8df] text-[#171511] hover:border-[#b8df71]"
                      )}
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e9f4ec] text-[#007a3d] transition group-hover:scale-105">
                        <CityIcon />
                      </span>
                      <span className="mt-6 text-lg font-semibold leading-tight">
                        Kies een stad
                      </span>
                      <span className="mt-2 text-xs font-medium leading-5 text-[#665d54]">
                        Zoek specifiek in Nederland
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={selectedLocation === "surprise"}
                      onClick={() => handleLocationSelect("surprise")}
                      className={cn(
                        "group grid min-h-[168px] content-center justify-items-center rounded-[1.25rem] border bg-white px-5 py-6 text-center shadow-[0_18px_36px_rgba(35,48,38,0.06)] transition active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007a3d] motion-safe:hover:-translate-y-0.5",
                        selectedLocation === "surprise"
                          ? "border-[#007a3d] text-[#004c29]"
                          : "border-[#ece8df] text-[#171511] hover:border-[#b8df71]"
                      )}
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e9f4ec] text-[#007a3d] transition group-hover:scale-105">
                        <CompassIcon />
                      </span>
                      <span className="mt-6 text-lg font-semibold leading-tight">
                        Maakt niet uit
                      </span>
                      <span className="mt-2 text-xs font-medium leading-5 text-[#665d54]">
                        Ik sta open voor alles
                      </span>
                    </button>
                  </div>

                  {isResolvingLocation ? (
                    <p className="text-sm font-medium text-[#665d54]" role="status">
                      We vragen je browser om locatie-toestemming.
                    </p>
                  ) : null}

                  {locationStatus ? (
                    <p className="text-sm font-medium text-[#405028]" role="status">
                      {locationStatus}
                    </p>
                  ) : null}

                  {locationError ? (
                    <p
                      className="rounded-2xl bg-white/64 px-4 py-3 text-sm font-medium text-[#3f362f] shadow-[inset_0_0_0_1px_rgba(214,201,184,0.48)]"
                      role="alert"
                    >
                      {locationError}
                    </p>
                  ) : null}

                  {isPickingCity ? (
                    <div className="mx-auto grid w-full max-w-[40rem] gap-3 rounded-[1.25rem] bg-white/72 p-4 shadow-[inset_0_0_0_1px_rgba(214,201,184,0.42)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <AppInput
                        label="Stad"
                        name="inspiration-local-city"
                        list="inspiration-local-city-options"
                        value={cityInput}
                        onChange={(event) => setCityInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            confirmCity();
                          }
                        }}
                        placeholder="Bijvoorbeeld Apeldoorn"
                        className="min-h-11"
                      />
                      <datalist id="inspiration-local-city-options">
                        {cityOptions.map((city) => (
                          <option key={city.value} value={city.label} />
                        ))}
                      </datalist>
                      <AppButton
                        onClick={confirmCity}
                        disabled={cityInput.trim().length < 2}
                        className="bg-[#e8f2d0] text-[#162016] shadow-[0_12px_28px_rgba(109,144,51,0.12)] hover:bg-[#f2f8df] sm:min-w-[8.5rem]"
                      >
                        Gebruik stad
                      </AppButton>
                    </div>
                  ) : null}
                </WizardPanel>
              ) : null}

              {currentStep === 2 ? (
                <WizardPanel
                  tone={2}
                  step="Stap 2 van 4"
                  title="Met wie?"
                  description="Stem de suggesties af op je gezelschap."
                >
                  <ChoiceGrid
                    tone={2}
                    options={audienceOptions}
                    selected={selectedAudience}
                    onSelect={handleAudienceSelect}
                  />
                </WizardPanel>
              ) : null}

              {currentStep === 3 ? (
                <WizardPanel
                  tone={3}
                  step="Stap 3 van 4"
                  title="Wanneer?"
                  description="Kies het moment dat past bij je plan."
                >
                  <ChoiceGrid
                    tone={3}
                    options={momentOptions}
                    selected={selectedMoment}
                    onSelect={handleMomentSelect}
                  />
                </WizardPanel>
              ) : null}

              {currentStep === 4 ? (
                <WizardPanel
                  tone={4}
                  step="Stap 4 van 4"
                  title="Waar heb je zin in?"
                  description="Maak de selectie specifieker op sfeer."
                >
                  <ChoiceGrid
                    tone={4}
                    options={vibeOptions}
                    selected={selectedVibe}
                    onSelect={handleVibeSelect}
                  />
                </WizardPanel>
              ) : null}
            </div>
          </div>
            </div>
          </AppSection>
        </div>
      </section>

      <AppSection maxWidth="default" spacing="md" innerClassName="pt-1 pb-16 md:pb-20">
        <div ref={resultsRef} className="mx-auto max-w-[1080px] scroll-mt-28">
          {!shouldShowResults ? (
            <div className="mx-auto max-w-[980px] px-1 text-sm font-medium leading-6 text-[#665d54] sm:px-0">
              {getStepPrompt(currentStep)}
            </div>
          ) : null}

          {shouldShowResults ? (
          <>
          <div className="mb-8 flex flex-col gap-4 bg-[linear-gradient(90deg,rgba(242,248,231,0.54),rgba(255,250,240,0.24),transparent)] py-3 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667b36]">
                Resultaten
              </p>
              <h2 className="mt-2 text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#171511]">
                {getResultsTitle(selectedLocation, selectedCity)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d54] md:text-base">
                {filteredResults.length === 0
                  ? "Deze combinatie levert nog geen passende inspiratie op."
                  : `${filteredResults.length} suggesties op basis van je huidige keuzes.`}
              </p>
            </div>

            <ActiveSummary
              selectedLocation={selectedLocation}
              selectedCity={selectedCity}
              selectedAudience={selectedAudience}
              selectedMoment={selectedMoment}
              selectedVibe={selectedVibe}
            />
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.slug}
                  result={result}
                  href={result.href ?? `/inspiratie/${result.category}/${result.slug}`}
                />
              ))}
            </div>
          ) : (
            <AppEmptyState
              title="Geen suggesties gevonden"
              description="Deze combinatie levert nog geen passende inspiratie op. Pas je keuzes aan of begin opnieuw."
              className="mx-auto max-w-3xl bg-[#fbf8f4]/92"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                <AppButton
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full sm:w-auto"
                >
                  Wis keuzes
                </AppButton>
                <AppButton
                  href="/"
                  variant="ghost"
                  size="sm"
                  className="w-full border-[#d6c9b8] bg-white text-[#4b3a28] shadow-none hover:border-[#c9b693] hover:bg-[#fffaf4] sm:w-auto"
                >
                  Probeer opnieuw te zoeken
                </AppButton>
              </div>
            </AppEmptyState>
          )}
          </>
          ) : null}
        </div>
      </AppSection>
    </main>
  );
}

function WizardPanel({
  tone,
  step,
  title,
  description,
  children,
}: {
  tone: WizardStep;
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const toneClasses = getStepColorClasses(tone);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.1rem] px-3 py-4 text-center transition motion-safe:animate-[wizardIn_220ms_ease-out] md:rounded-[1.35rem] md:px-6 md:py-6 lg:px-10",
        toneClasses.panel
      )}
    >
      <div className="mx-auto mb-9 hidden max-w-[40rem] md:mb-4 md:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#667b36]">
          {step}
        </p>
        <h2 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#171511]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[30rem] text-sm leading-6 text-[#665d54]">
          {description}
        </p>
      </div>
      <div className="grid min-w-0 content-start gap-6 md:gap-4">{children}</div>
    </section>
  );
}

function MobileStepProgress({
  currentStep,
  title,
  onPrevious,
}: {
  currentStep: WizardStep;
  title: string;
  onPrevious?: () => void;
}) {
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="rounded-[1.1rem] border border-[#e2d8c8] bg-white/72 px-4 py-3 text-[#171511] shadow-[0_14px_34px_rgba(49,58,41,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667b36]">
            Stap {currentStep} van {totalSteps}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-[#171511]">
            {title}
          </h2>
        </div>

        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[#d6c9b8] bg-white/82 px-4 text-sm font-semibold text-[#405028] shadow-[0_8px_18px_rgba(49,58,41,0.06)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
          >
            Vorige
          </button>
        ) : null}
      </div>

      <div
        role="progressbar"
        aria-label={`Stap ${currentStep} van ${totalSteps}`}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9dfcf]"
      >
        <div
          className="h-full rounded-full bg-[#007a3d] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function WizardProgress({
  currentStep,
  summaries,
  onStepSelect,
}: {
  currentStep: WizardStep;
  summaries: Array<string | undefined>;
  onStepSelect: (step: WizardStep) => void;
}) {
  return (
    <div className="grid gap-4 md:gap-3">
      <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 md:gap-2.5 lg:grid-cols-4 lg:gap-3">
        {([1, 2, 3, 4] as WizardStep[]).map((step) => {
          const isActive = currentStep === step;
          const isComplete = Boolean(summaries[step - 1]);
          const canOpen = isComplete || step <= currentStep;
          const toneClasses = getStepColorClasses(step);
          const status = isActive
            ? "Huidige stap"
            : summaries[step - 1] ?? "Nog te kiezen";

          return (
            <button
              key={step}
              type="button"
              disabled={!canOpen}
              onClick={() => onStepSelect(step)}
              className={cn(
                "grid min-h-[126px] grid-cols-[1fr_auto] content-between rounded-[1.35rem] border px-7 py-6 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-[88px] md:rounded-[1.15rem] md:px-5 md:py-3 lg:min-h-[84px]",
                isActive
                  ? "border-[#007a3d] bg-white text-[#00542f] shadow-[0_18px_42px_rgba(36,78,46,0.08)]"
                  : isComplete
                    ? "border-[#d5e5b6] bg-white/78 text-[#405028] hover:bg-white"
                    : "border-[#ede9e1] bg-white/34 text-[#8b8d87]",
                toneClasses.focus
              )}
            >
              <span>
                <span className="block text-[12px] font-semibold uppercase tracking-[0.18em]">
                  0{step}
                </span>
                <span className="mt-6 block text-sm font-semibold text-[#171511] md:mt-2">
                  {getStepLabel(step)}
                </span>
                <span className="mt-1 block text-xs font-medium text-[#9a9e99]">
                  {status}
                </span>
              </span>
              <span
                className={cn(
                  "mt-0.5 grid h-7 w-7 place-items-center rounded-full md:h-6 md:w-6",
                  isActive || isComplete
                    ? "bg-[#007a3d] text-white"
                    : "text-[#9a9e99]"
                )}
              >
                <StepIcon step={step} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {summaries.map((summary, index) =>
          summary ? (
            <button
              key={`${summary}-${index}`}
              type="button"
              onClick={() => onStepSelect((index + 1) as WizardStep)}
              className="inline-flex min-h-9 items-center rounded-full bg-[#f5f9e9]/86 px-3.5 text-xs font-semibold text-[#405028] shadow-[inset_0_0_0_1px_rgba(184,223,113,0.42)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
            >
              {getStepLabel((index + 1) as WizardStep)}: {summary}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}

function ChoiceGrid<T extends string>({
  tone,
  options,
  selected,
  onSelect,
}: {
  tone: WizardStep;
  options: Array<ChoiceOption<T>>;
  selected?: T;
  onSelect: (value: T | undefined) => void;
}) {
  const toneClasses = getStepColorClasses(tone);

  return (
    <div className="grid gap-4 min-[520px]:grid-cols-2 lg:grid-cols-4">
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? undefined : option.value)}
            className={cn(
              "group grid min-h-[168px] w-full content-center justify-items-center rounded-[1.25rem] border bg-white px-5 py-6 text-center shadow-[0_18px_36px_rgba(35,48,38,0.06)] transition active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:-translate-y-0.5",
              isSelected
                ? "border-[#007a3d] text-[#004c29]"
                : "border-[#ece8df] text-[#171511] hover:border-[#b8df71]",
              toneClasses.focus
            )}
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e9f4ec] text-[#007a3d] transition group-hover:scale-105">
              <ChoiceIcon tone={tone} value={option.value} />
            </span>
            <span className="mt-6 text-lg font-semibold leading-tight">
              {option.label}
            </span>
            <span className="mt-2 text-xs font-medium leading-5 text-[#665d54]">
              {option.helper}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StepIcon({ step }: { step: WizardStep }) {
  if (step === 1) return <PinIcon />;
  if (step === 2) return <PeopleIcon />;
  if (step === 3) return <ClockIcon />;
  return <SmileIcon />;
}

function ChoiceIcon({ tone, value }: { tone: WizardStep; value: string }) {
  if (tone === 2) {
    if (value === "solo") return <PersonIcon />;
    if (value === "date") return <HeartIcon />;
    return <PeopleIcon />;
  }
  if (tone === 3) {
    if (value === "nu") return <BoltIcon />;
    if (value === "vanavond") return <MoonIcon />;
    if (value === "weekend") return <CalendarIcon />;
    return <ClockIcon />;
  }
  if (value === "cultureel") return <MuseumIcon />;
  if (value === "actief") return <LocationArrowIcon />;
  if (value === "eten-drinken") return <CupIcon />;
  return <SmileIcon />;
}

function ActiveSummary({
  selectedLocation,
  selectedCity,
  selectedAudience,
  selectedMoment,
  selectedVibe,
}: {
  selectedLocation?: LocationMode;
  selectedCity?: string;
  selectedAudience?: AudienceChoice;
  selectedMoment?: MomentChoice;
  selectedVibe?: VibeChoice;
}) {
  const chips = [
    selectedLocation
      ? selectedLocation === "city" && selectedCity
        ? `Stad: ${getInspirationCityLabel(selectedCity)}`
        : selectedLocation === "nearby" && selectedCity
          ? getInspirationCityLabel("nearby", selectedCity)
          : "Locatie maakt niet uit"
      : undefined,
    audienceOptions.find((option) => option.value === selectedAudience)?.label,
    momentOptions.find((option) => option.value === selectedMoment)?.label,
    vibeOptions.find((option) => option.value === selectedVibe)?.label,
  ].filter(Boolean);

  if (chips.length === 0) {
    return (
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6258]">
        Nog geen filters actief
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <AppFilterChip key={chip} active>
          {chip}
        </AppFilterChip>
      ))}
    </div>
  );
}

function ResultCard({ result, href }: { result: InspirationResult; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/14 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <div
          className="aspect-[0.9/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={{
            backgroundImage: optimizeCssBackground(result.image, {
              width: 840,
              quality: 58,
            }),
          }}
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {result.badge ? (
            <span className="inline-flex rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#203115]">
              {result.badge}
            </span>
          ) : null}
          <span className="inline-flex rounded-full bg-white/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#25341c] backdrop-blur-md">
            {result.city}
          </span>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7b6f64]">
          {result.categoryLabel} - {result.price}
        </p>

        <h3 className="mt-2 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511]">
          {result.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#665d54]">
          {result.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#405028]">
          <PinIcon />
          <span>{result.location}</span>
        </div>
      </div>
    </Link>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function LocationArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 14-7-7 14-2-7-5-0Z" />
    </svg>
  );
}

function CityIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V9l5-3v15" />
      <path d="M9 21V3l8 4v14" />
      <path d="M17 21v-8l3 2v6" />
      <path d="M7 11h.01M7 15h.01M12 9h.01M12 13h.01M12 17h.01" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-7 0V19" />
      <circle cx="12.5" cy="8" r="3" />
      <path d="M5 18v-1a3 3 0 0 1 3-3" />
      <path d="M19 18v-1a3 3 0 0 0-3-3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 10h.01M15.5 10h.01" />
      <path d="M8.5 14.5a4.8 4.8 0 0 0 7 0" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 15.5A8 8 0 0 1 8.5 4 7 7 0 1 0 20 15.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function MuseumIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 10 8-5 8 5" />
      <path d="M5 10h14M7 10v8M12 10v8M17 10v8M5 18h14" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h10v7a5 5 0 0 1-10 0V4Z" />
      <path d="M16 7h1.5a2.5 2.5 0 0 1 0 5H16M8 20h6" />
    </svg>
  );
}
