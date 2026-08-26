"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

import ExploreCardItem from "./ExploreCardItem";
import { InspirationFlowScenery } from "../inspiration/InspirationFlowScenery";
import {
  FullscreenChoiceFlow,
  FullscreenChoiceGrid,
  FullscreenChoiceQuestion,
  FullscreenChoiceResults,
  type FullscreenChoiceFlowStep,
} from "./FullscreenChoiceFlow";
import type {
  ExploreCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";

type PlannerSelectionKey = keyof PlannerSelections;
type PlannerSelectionValue = PlannerSelections[PlannerSelectionKey];

type FlowOption = {
  value: PlannerSelectionValue;
  label: string;
  description: string;
  icon: (props: { className?: string }) => ReactElement;
};

type QuestionFlowStep = FullscreenChoiceFlowStep & {
  type: "question";
  id: PlannerSelectionKey;
  title: string;
  description: string;
  options: FlowOption[];
};

type ResultsFlowStep = FullscreenChoiceFlowStep & { type: "results"; id: "results" };
type FlowStep = QuestionFlowStep | ResultsFlowStep;

type DiscoverFlowProps = {
  cityLabel: string;
  selections: PlannerSelections;
  currentStep: number;
  onStepChange: (step: number) => void;
  onSelectionChange: (key: PlannerSelectionKey, value: PlannerSelectionValue) => void;
  previewCards: ExploreCard[];
  onComplete: () => void;
  onViewAllResults: () => void;
};

const FLOW_STEPS: FlowStep[] = [
  {
    type: "question",
    id: "companion",
    title: "Vind iets leuks in {city}",
    description: "We kunnen je helpen kiezen. Vertel met wie je op pad gaat voor suggesties die beter bij je passen.",
    options: [
      { value: "solo" satisfies PlannerCompanion, label: "Alleen op pad", description: "Ontdek plekken en activiteiten die je makkelijk zelf kunt doen.", icon: SoloIcon },
      { value: "date" satisfies PlannerCompanion, label: "Date", description: "Vind iets dat leuk voelt om samen te doen in deze stad.", icon: HeartIcon },
      { value: "gezin" satisfies PlannerCompanion, label: "Met gezin", description: "Activiteiten die passen bij kinderen, gemak en samen op pad.", icon: FamilyIcon },
      { value: "vrienden" satisfies PlannerCompanion, label: "Met vrienden", description: "Ideeën voor een gezellige middag of avond samen.", icon: FriendsIcon },
    ],
  },
  {
    type: "question",
    id: "moment",
    title: "Wanneer wil je iets doen?",
    description: "Zoeken we iets voor nu, later vandaag of een moment om naar uit te kijken?",
    options: [
      { value: "nu" satisfies PlannerMoment, label: "Nu", description: "Suggesties die nu of op korte termijn interessant zijn.", icon: LightningIcon },
      { value: "vanavond" satisfies PlannerMoment, label: "Vanavond", description: "Ideeën voor een spontane avond in deze stad.", icon: MoonIcon },
      { value: "morgen" satisfies PlannerMoment, label: "Later plannen", description: "Bewaar inspiratie voor een later moment.", icon: SunIcon },
      { value: "weekend" satisfies PlannerMoment, label: "Dit weekend", description: "Dingen om dit weekend te doen.", icon: CalendarIcon },
    ],
  },
  {
    type: "question",
    id: "vibe",
    title: "Waar heb je zin in?",
    description: "Kies de richting die vandaag het beste voelt. Daarna zetten we je selectie klaar.",
    options: [
      { value: "cultureel" satisfies PlannerVibe, label: "Cultureel", description: "Musea, theater, erfgoed en bijzondere plekken in deze stad.", icon: SparkIcon },
      { value: "actief" satisfies PlannerVibe, label: "Actief", description: "Buiten, bewegen, ontdekken of iets doen met energie.", icon: RouteIcon },
      { value: "eten-drinken" satisfies PlannerVibe, label: "Eten & drinken", description: "Terrassen, restaurants, proeverijen of foodspots.", icon: ForkKnifeIcon },
      { value: "relaxed" satisfies PlannerVibe, label: "Relaxed", description: "Rustige plekken, wandelen, rondkijken of laagdrempelig genieten.", icon: LeafIcon },
    ],
  },
  { type: "results", id: "results" },
];

/** Fullscreen UI for the existing three-field city planner. No answers live here. */
export default function DiscoverFlow({
  cityLabel,
  selections,
  currentStep,
  onStepChange,
  onSelectionChange,
  previewCards,
  onComplete,
  onViewAllResults,
}: DiscoverFlowProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSteps = FLOW_STEPS.length;
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const step = FLOW_STEPS[safeStep - 1];
  const visiblePreviewCards = useMemo(() => previewCards.slice(0, 6), [previewCards]);
  const isIntroductionStep = safeStep === 1;

  useEffect(() => setIsTransitioning(false), [safeStep]);

  function chooseOption(value: string) {
    if (step.type !== "question" || isTransitioning) return;

    onSelectionChange(step.id, value as PlannerSelectionValue);
    setIsTransitioning(true);
    window.setTimeout(() => onStepChange(safeStep + 1), 160);
  }

  return (
    <FullscreenChoiceFlow
      steps={FLOW_STEPS}
      currentStep={currentStep}
      onStepChange={onStepChange}
      onComplete={onComplete}
      onEditChoices={() => onStepChange(1)}
      secondaryAction={{ label: "Bekijk alle resultaten", onClick: onViewAllResults }}
      showProgress={({ stepNumber }) => stepNumber > 1}
      showFooter={({ stepNumber }) => stepNumber > 1}
      exitHref="/"
      exitLabel="Terug naar Home"
      decorativeLayer={({ isResultsStep }) => (
        <InspirationFlowScenery variant={isResultsStep ? "subtle" : "default"} />
      )}
    >
      {({ isResultsStep }) =>
        isResultsStep ? (
          <FullscreenChoiceResults
            description={`${visiblePreviewCards.length} ${visiblePreviewCards.length === 1 ? "resultaat" : "resultaten"} in ${cityLabel}`}
          >
            {visiblePreviewCards.length ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {visiblePreviewCards.map((card) => (
                  <ExploreCardItem key={card.id} card={card} variant="flow" isSelected={false} onSelect={() => undefined} />
                ))}
              </div>
            ) : (
              <div className="mt-8 max-w-2xl border-y border-[#DCE1DC] py-8 sm:py-10">
                <p className="text-lg font-semibold tracking-[-0.025em] text-[#29342F]">We vonden nog geen perfecte match</p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#65736C] sm:text-base">Pas je keuzes aan of bekijk alle activiteiten in {cityLabel}.</p>
              </div>
            )}
          </FullscreenChoiceResults>
        ) : step.type === "question" ? (
          <FullscreenChoiceQuestion
            title={step.title.replace("{city}", cityLabel)}
            description={isIntroductionStep ? step.description : `Je hebt gekozen voor ${cityLabel}`}
            primaryAction={isIntroductionStep ? (
              <button
                type="button"
                onClick={onViewAllResults}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1D5A46] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
              >
                Bekijk alle uitjes in {cityLabel} <span className="ml-2" aria-hidden="true">→</span>
              </button>
            ) : undefined}
            transitionLabel={isIntroductionStep ? "Of krijg persoonlijkere suggesties" : undefined}
          >
            <FullscreenChoiceGrid
              title={step.title}
              selectedValue={selections[step.id]}
              disabled={isTransitioning}
              onChoose={chooseOption}
              compactMobile={isIntroductionStep}
              options={step.options.map((option) => {
                const Icon = option.icon;
                return { ...option, icon: <Icon className="h-5 w-5" /> };
              })}
            />
          </FullscreenChoiceQuestion>
        ) : null
      }
    </FullscreenChoiceFlow>
  );
}

function SoloIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 11a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 12 11Zm-5.5 7.5c0-3.03 2.46-5.5 5.5-5.5s5.5 2.47 5.5 5.5c0 .55-.45 1-1 1h-9c-.55 0-1-.45-1-1Z" /></svg>;
}
function HeartIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 20.1 4.76 12.9a4.9 4.9 0 0 1 6.92-6.93L12 6.3l.32-.33a4.9 4.9 0 1 1 6.92 6.93L12 20.1Z" /></svg>;
}
function FamilyIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M7.5 10.25a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 7.5 10.25Zm9 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM4.5 18.5c0-2.1 1.7-3.8 3.8-3.8h.08A3.95 3.95 0 0 1 12 16.83a3.95 3.95 0 0 1 3.62-2.13h.08c2.1 0 3.8 1.7 3.8 3.8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1Z" /></svg>;
}
function FriendsIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M7.25 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9.5 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Zm-6.25 9c0-1.97 1.6-3.56 3.56-3.56h.27c.93 0 1.78.35 2.42.93a4.34 4.34 0 0 1 2.42-.93h.27c1.97 0 3.56 1.59 3.56 3.56a1 1 0 0 1-1 1H6.75a1 1 0 0 1-1-1Zm-3 0c0-1.73 1.4-3.13 3.13-3.13h.38c.37 0 .73.06 1.06.18a4.83 4.83 0 0 0-.57 2.26.9.9 0 0 1-.01.19H3.75a1 1 0 0 1-1-1Zm17.5 0c0-1.73-1.4-3.13-3.13-3.13h-.38c-.37 0-.73.06-1.06.18.38.65.57 1.44.57 2.26v.19h3a1 1 0 0 0 1-1Z" /></svg>;
}
function LightningIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13.05 2.75 6.7 13.25h4.2L9.95 21.25l7.35-11.5H13.1l-.05-7Z" /></svg>; }
function MoonIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M14.7 3.05a8.8 8.8 0 1 0 6.2 15.05 7.7 7.7 0 0 1-6.25-12.4 7.6 7.6 0 0 1 .05-2.65Z" /></svg>; }
function SunIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2.75v2.5M12 18.75v2.5m-7.82-16.32 1.77 1.77m10.7 10.7 1.77 1.77M2.75 12h2.5m13.75 0h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" /></svg>; }
function CalendarIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M7 3.75v3m10-3v3" /><rect x="4" y="6.75" width="16" height="13" rx="2.5" /><path d="M4 10.75h16" /></svg>; }
function SparkIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="m12 3 1.65 4.35L18 9l-4.35 1.65L12 15l-1.65-4.35L6 9l4.35-1.65L12 3Z" /><path d="M18.5 15.5 19.4 18l2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.5Z" /></svg>; }
function RouteIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h2.2a5.8 5.8 0 0 0 5.8-5.8V11M16 6H13.8A5.8 5.8 0 0 0 8 11.8V13" /></svg>; }
function ForkKnifeIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M7.5 3.75v7.5m3-7.5v7.5m-3-3.25h3M9 11.25v9M15.5 3.75v16.5M15.5 3.75c2 0 3.5 1.75 3.5 4v2h-3.5" /></svg>; }
function LeafIcon({ className }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M19.5 4.75c-7.5 0-12 3.68-12 9.36 0 2.47 1.88 4.64 4.45 4.64 5.55 0 8.55-6.2 7.55-14Z" /><path d="M8.75 18.25c0-4.1 2.25-6.75 6.5-8.75" /></svg>; }
