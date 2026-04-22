"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { optimizeRemoteImageUrl } from "@/lib/remoteImage";

import type {
  ExploreCard,
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";

type CityExploreFormSectionProps = {
  cityLabel: string;
  plannerSelections: PlannerSelections;
  currentStep: number;
  completedStepCount: number;
  featuredCard: ExploreCard | null;
  onCompanionSelect: (value: PlannerCompanion) => void;
  onMomentSelect: (value: PlannerMoment) => void;
  onVibeSelect: (value: PlannerVibe) => void;
  onPreviousStep: () => void;
  onGoToStep: (step: number) => void;
  onClearStep: (step: number) => void;
  onShowResults: () => void;
};

type CompanionOption = {
  id: PlannerCompanion;
  label: string;
  subtitle: string;
  tone: string;
  icon: (props: { className?: string }) => ReactElement;
};

type MomentOption = {
  id: PlannerMoment;
  label: string;
  subtitle: string;
  icon: (props: { className?: string }) => ReactElement;
};

type VibeOption = {
  id: PlannerVibe;
  label: string;
  subtitle: string;
  tone: string;
  icon: (props: { className?: string }) => ReactElement;
};

type StepChip = {
  step: number;
  label: string;
  value: string;
  icon: (props: { className?: string }) => ReactElement;
};

const TOTAL_STEPS = 4;

const COMPANION_OPTIONS: CompanionOption[] = [
  {
    id: "solo",
    label: "Solo",
    subtitle: "Me-time & ontdekking",
    tone: "bg-[#f5e7db] text-[#2b221e] ring-[#ead8ca]",
    icon: SoloIcon,
  },
  {
    id: "date",
    label: "Date",
    subtitle: "Romantiek & verbinding",
    tone: "bg-[#e6e5f4] text-[#241f28] ring-[#d8d4ea]",
    icon: HeartIcon,
  },
  {
    id: "gezin",
    label: "Gezin",
    subtitle: "Plezier voor alle leeftijden",
    tone: "bg-[#dff2dc] text-[#203121] ring-[#cde5c9]",
    icon: FamilyIcon,
  },
  {
    id: "vrienden",
    label: "Vrienden",
    subtitle: "Gezelligheid & avontuur",
    tone: "bg-[#f8ecc8] text-[#332718] ring-[#eadcae]",
    icon: FriendsIcon,
  },
];

const MOMENT_OPTIONS: MomentOption[] = [
  {
    id: "nu",
    label: "Nu",
    subtitle: "Direct iets doen",
    icon: LightningIcon,
  },
  {
    id: "vanavond",
    label: "Vanavond",
    subtitle: "Later op de dag",
    icon: MoonIcon,
  },
  {
    id: "morgen",
    label: "Morgen",
    subtitle: "Iets om naar uit te kijken",
    icon: SunIcon,
  },
  {
    id: "weekend",
    label: "Dit weekend",
    subtitle: "Meer tijd om te plannen",
    icon: CalendarIcon,
  },
];

const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "cultureel",
    label: "Cultureel",
    subtitle: "Musea, muziek & verhalen",
    tone: "bg-[#efe7da] text-[#31261f] ring-[#e1d3bf]",
    icon: SparkIcon,
  },
  {
    id: "actief",
    label: "Actief",
    subtitle: "Wandelen, buiten & energie",
    tone: "bg-[#deefe7] text-[#1f3029] ring-[#cce1d7]",
    icon: RouteIcon,
  },
  {
    id: "eten-drinken",
    label: "Eten & drinken",
    subtitle: "Tafels, terrassen & smaak",
    tone: "bg-[#f7e6c4] text-[#322618] ring-[#ead7ab]",
    icon: ForkKnifeIcon,
  },
  {
    id: "relaxed",
    label: "Relaxed",
    subtitle: "Rustig, sfeervol & makkelijk",
    tone: "bg-[#e7ecf5] text-[#212633] ring-[#d5ddea]",
    icon: LeafIcon,
  },
];

function SoloIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 11a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 12 11Zm-5.5 7.5c0-3.03 2.46-5.5 5.5-5.5s5.5 2.47 5.5 5.5c0 .55-.45 1-1 1h-9c-.55 0-1-.45-1-1Z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 20.1 4.76 12.9a4.9 4.9 0 0 1 6.92-6.93L12 6.3l.32-.33a4.9 4.9 0 1 1 6.92 6.93L12 20.1Z" />
    </svg>
  );
}

function FamilyIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M7.5 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM4.5 18.5c0-2.1 1.7-3.8 3.8-3.8h.08A3.95 3.95 0 0 1 12 16.83a3.95 3.95 0 0 1 3.62-2.13h.08c2.1 0 3.8 1.7 3.8 3.8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

function FriendsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M7.25 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9.5 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM12 9.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Zm-6.25 9c0-1.97 1.6-3.56 3.56-3.56h.27c.93 0 1.78.35 2.42.93a4.34 4.34 0 0 1 2.42-.93h.27c1.97 0 3.56 1.59 3.56 3.56a1 1 0 0 1-1 1H6.75a1 1 0 0 1-1-1Zm-3 0c0-1.73 1.4-3.13 3.13-3.13h.38c.37 0 .73.06 1.06.18a4.83 4.83 0 0 0-.57 2.26.9.9 0 0 1-.01.19H3.75a1 1 0 0 1-1-1Zm17.5 0c0-1.73-1.4-3.13-3.13-3.13h-.38c-.37 0-.73.06-1.06.18.38.65.57 1.44.57 2.26v.19h3a1 1 0 0 0 1-1Z" />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M13.05 2.75 6.7 13.25h4.2L9.95 21.25l7.35-11.5H13.1l-.05-7Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M14.7 3.05a8.8 8.8 0 1 0 6.2 15.05 7.7 7.7 0 0 1-6.25-12.4 7.6 7.6 0 0 1 .05-2.65Z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="m4.93 4.93 1.77 1.77" />
      <path d="m17.3 17.3 1.77 1.77" />
      <path d="M2.75 12h2.5" />
      <path d="M18.75 12h2.5" />
      <path d="m4.93 19.07 1.77-1.77" />
      <path d="m17.3 6.7 1.77-1.77" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.75v3" />
      <path d="M17 3.75v3" />
      <rect x="4" y="6.75" width="16" height="13" rx="2.5" />
      <path d="M4 10.75h16" />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.65 4.35L18 9l-4.35 1.65L12 15l-1.65-4.35L6 9l4.35-1.65L12 3Z" />
      <path d="M18.5 15.5 19.4 18l2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.5Z" />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h2.2a5.8 5.8 0 0 0 5.8-5.8V11" />
      <path d="M16 6H13.8A5.8 5.8 0 0 0 8 11.8V13" />
    </svg>
  );
}

function ForkKnifeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 3.75v7.5" />
      <path d="M10.5 3.75v7.5" />
      <path d="M7.5 8h3" />
      <path d="M9 11.25v9" />
      <path d="M15.5 3.75v16.5" />
      <path d="M15.5 3.75c2 0 3.5 1.75 3.5 4v2h-3.5" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19.5 4.75c-7.5 0-12 3.68-12 9.36 0 2.47 1.88 4.64 4.45 4.64 5.55 0 8.55-6.2 7.55-14Z" />
      <path d="M8.75 18.25c0-4.1 2.25-6.75 6.5-8.75" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 5-7 7 7 7" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function getCompanionLabel(value: PlannerCompanion) {
  return (
    COMPANION_OPTIONS.find((option) => option.id === value)?.label || "Gezelschap"
  );
}

function getMomentLabel(value: PlannerMoment) {
  return MOMENT_OPTIONS.find((option) => option.id === value)?.label || "Moment";
}

function getVibeLabel(value: PlannerVibe) {
  return VIBE_OPTIONS.find((option) => option.id === value)?.label || "Vibe";
}

function buildStepChips(
  selections: PlannerSelections,
  completedStepCount: number
): StepChip[] {
  const chips: StepChip[] = [];

  if (completedStepCount >= 1) {
    chips.push({
      step: 1,
      label: "Gezelschap",
      value: getCompanionLabel(selections.companion),
      icon: HeartIcon,
    });
  }

  if (completedStepCount >= 2) {
    chips.push({
      step: 2,
      label: "Moment",
      value: getMomentLabel(selections.moment),
      icon: CalendarIcon,
    });
  }

  if (completedStepCount >= 3) {
    chips.push({
      step: 3,
      label: "Sfeer",
      value: getVibeLabel(selections.vibe),
      icon: SparkIcon,
    });
  }

  return chips;
}

function StepBadge({ currentStep }: { currentStep: number }) {
  return (
    <div className="inline-flex rounded-2xl bg-[#d9f0a8] px-5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#33481f] sm:rounded-full">
      Stap {currentStep} van {TOTAL_STEPS}
    </div>
  );
}

function ProgressMeter({
  currentStep,
  completedStepCount,
}: {
  currentStep: number;
  completedStepCount: number;
}) {
  return (
    <div className="mx-auto mt-12 max-w-[18rem]">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber <= completedStepCount;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-2.5 rounded-full transition ${
                isComplete || isActive ? "bg-[#b7e56b]" : "bg-[#e7e0d7]"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-4 text-center text-[0.8rem] font-medium uppercase tracking-[0.22em] text-[#93877b]">
        Voortgang
      </div>
    </div>
  );
}

function StepChipRow({
  chips,
  onGoToStep,
  onClearStep,
}: {
  chips: StepChip[];
  onGoToStep: (step: number) => void;
  onClearStep: (step: number) => void;
}) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {chips.map((chip) => {
        const Icon = chip.icon;

        return (
          <div
            key={chip.step}
            className="inline-flex w-full items-center overflow-hidden rounded-[1.35rem] border border-[#d7e7b6] bg-[#d9f0a8] text-[#44602a] shadow-[0_14px_28px_rgba(109,144,51,0.12)] sm:w-auto sm:rounded-full"
          >
            <button
              type="button"
              onClick={() => onGoToStep(chip.step)}
              className="inline-flex min-h-12 flex-1 items-center gap-2 px-4 py-3 text-sm font-medium sm:flex-none sm:py-2"
            >
              <Icon className="h-4 w-4" />
              <span>
                {chip.label}: {chip.value}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onClearStep(chip.step)}
              aria-label={`Verwijder ${chip.label.toLowerCase()}`}
              className="min-h-12 border-l border-[#c9dfa0] px-3 py-3 text-[#577238] transition hover:bg-[#cee894] sm:py-2"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[56rem] text-center">
      <h2 className="mx-auto text-center text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-[#141414]">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-[42rem] text-center text-[1.05rem] leading-8 text-[#74685d] sm:text-[1.18rem]">
        {description}
      </p>
    </div>
  );
}

function CompanionGrid({
  selected,
  onSelect,
}: {
  selected: PlannerCompanion;
  onSelect: (value: PlannerCompanion) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COMPANION_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(option.id)}
            className={`group min-h-[190px] rounded-[1.8rem] p-5 text-center ring-1 transition duration-300 sm:min-h-[230px] sm:rounded-[2.2rem] sm:p-6 ${
              option.tone
            } ${
              isSelected
                ? "translate-y-[-2px] shadow-[0_24px_48px_rgba(41,31,22,0.14)]"
                : "hover:translate-y-[-2px] hover:shadow-[0_16px_34px_rgba(41,31,22,0.09)]"
            }`}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/42 text-current ring-1 ring-white/55 sm:h-24 sm:w-24">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="mt-7 text-[1.7rem] font-semibold tracking-[-0.05em] sm:mt-10 sm:text-[2rem]">
              {option.label}
            </div>
            <div className="mt-3 text-sm text-current/72 sm:text-base">{option.subtitle}</div>
          </button>
        );
      })}
    </div>
  );
}

function SimpleOptionGrid<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: Array<{
    id: T;
    label: string;
    subtitle: string;
    icon: (props: { className?: string }) => ReactElement;
    tone?: string;
  }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="mx-auto grid max-w-[1020px] gap-4 md:grid-cols-2 xl:grid-cols-4">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(option.id)}
            className={`min-h-[188px] rounded-[1.8rem] px-5 py-5 text-center ring-1 transition duration-300 sm:min-h-[214px] sm:rounded-[2rem] sm:py-6 ${
              option.tone || "bg-white/58 text-[#1f1b18] ring-[#ece4d9]"
            } ${
              isSelected
                ? "translate-y-[-2px] shadow-[0_24px_48px_rgba(41,31,22,0.12)]"
                : "hover:translate-y-[-2px] hover:shadow-[0_16px_34px_rgba(41,31,22,0.08)]"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/68 text-[#486d21] ring-1 ring-black/5 sm:h-20 sm:w-20">
              <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <div className="mt-6 text-[1.6rem] font-semibold leading-[1] tracking-[-0.05em] text-[#171513] sm:mt-8 sm:text-[1.9rem]">
              {option.label}
            </div>
            <div className="mt-3 text-sm leading-6 text-[#74685d] sm:text-[0.98rem] sm:leading-7">
              {option.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ReviewStep({
  cityLabel,
  selections,
  featuredCard,
  onShowResults,
  onGoToStep,
}: {
  cityLabel: string;
  selections: PlannerSelections;
  featuredCard: ExploreCard | null;
  onShowResults: () => void;
  onGoToStep: (step: number) => void;
}) {
  const previewImage = featuredCard?.image || "/images/apeldoorn_img.jpg";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)] lg:items-stretch">
      <div className="rounded-[2.2rem] bg-white/74 p-6 shadow-[0_24px_52px_rgba(44,34,24,0.08)] ring-1 ring-white/70 sm:p-8">
        <div className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#7d7267]">
          Jullie selectie
        </div>
        <h3 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#151515]">
          Klaar om {cityLabel} op jullie manier te ontdekken
        </h3>
        <p className="mt-4 max-w-[36rem] text-base leading-8 text-[#665a4e]">
          Je keuzes staan klaar. Open de resultaten en bekijk welke plekken het
          best passen bij jullie moment.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="rounded-[1.6rem] bg-[#f4eadf] px-4 py-5 text-left transition hover:bg-[#efdfcf]"
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7d7166]">
              Gezelschap
            </div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#191715]">
              {getCompanionLabel(selections.companion)}
            </div>
          </button>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="rounded-[1.6rem] bg-[#e8f2dd] px-4 py-5 text-left transition hover:bg-[#ddebcd]"
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#5f7250]">
              Wanneer
            </div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#192014]">
              {getMomentLabel(selections.moment)}
            </div>
          </button>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="rounded-[1.6rem] bg-[#f7edd5] px-4 py-5 text-left transition hover:bg-[#f1e3c0]"
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7a6644]">
              Sfeer
            </div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#211a12]">
              {getVibeLabel(selections.vibe)}
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onShowResults}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#181615] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,22,21,0.18)] transition hover:-translate-y-0.5 sm:w-auto sm:rounded-full"
        >
          <span>Bekijk resultaten</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-[2.2rem] bg-[#efe3d6] shadow-[0_26px_56px_rgba(44,34,24,0.1)]">
        <div className="relative aspect-[1.08/1]">
          <Image
            src={optimizeRemoteImageUrl(previewImage, { width: 1200 })}
            alt={featuredCard?.title || `${cityLabel} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0806]/86 via-[#0e0806]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">
              Voorproefje
            </div>
            <div className="mt-3 text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em]">
              {featuredCard?.title || `Ontdek ${cityLabel}`}
            </div>
            <div className="mt-2 max-w-[22rem] text-sm leading-7 text-white/76">
              {featuredCard?.description ||
                "Een eerste match die aansluit op jullie gekozen moment en sfeer."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CityExploreFormSection({
  cityLabel,
  plannerSelections,
  currentStep,
  completedStepCount,
  featuredCard,
  onCompanionSelect,
  onMomentSelect,
  onVibeSelect,
  onPreviousStep,
  onGoToStep,
  onClearStep,
  onShowResults,
}: CityExploreFormSectionProps) {
  const stepChips = buildStepChips(plannerSelections, completedStepCount);

  const stepContent = (() => {
    if (currentStep === 1) {
      return {
        title: "Met wie ga je op pad?",
        description:
          "Kies je gezelschap en wij selecteren de meest inspirerende locaties die goed passen bij jullie ritme en energie.",
        content: (
          <CompanionGrid
            selected={plannerSelections.companion}
            onSelect={onCompanionSelect}
          />
        ),
      };
    }

    if (currentStep === 2) {
      return {
        title: "Wanneer wil je iets doen?",
        description:
          "Kies het moment dat past bij jullie plan, van spontaan nu tot een uitgekozen weekendmoment.",
        content: (
          <SimpleOptionGrid
            options={MOMENT_OPTIONS}
            selected={plannerSelections.moment}
            onSelect={onMomentSelect}
          />
        ),
      };
    }

    if (currentStep === 3) {
      return {
        title: "Waar heb je zin in?",
        description:
          "Bepaal de sfeer van jullie avond zodat de selectie strakker aansluit op het soort plekken waar je nu echt voor openstaat.",
        content: (
          <SimpleOptionGrid
            options={VIBE_OPTIONS}
            selected={plannerSelections.vibe}
            onSelect={onVibeSelect}
          />
        ),
      };
    }

    return {
      title: "Jullie avond staat klaar",
      description:
        "Controleer je keuzes en open daarna direct de best passende matches hieronder op dezelfde pagina.",
      content: (
        <ReviewStep
          cityLabel={cityLabel}
          selections={plannerSelections}
          featuredCard={featuredCard}
          onShowResults={onShowResults}
          onGoToStep={onGoToStep}
        />
      ),
    };
  })();

  return (
    <section className="bg-[#f6eee4]">
      <div className="mx-auto max-w-[1220px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="relative overflow-hidden px-2 py-4 sm:px-4 lg:px-6 lg:py-8">
          <div className="absolute -left-16 top-20 h-40 w-40 rounded-full bg-[#ece3d6] blur-3xl" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#f4ead6] blur-3xl" />
          <div className="absolute bottom-0 right-24 h-36 w-36 rounded-full bg-[#ddeec2] blur-3xl" />

          <div className="relative">
            <div className="flex justify-center">
              <StepChipRow
                chips={stepChips}
                onGoToStep={onGoToStep}
                onClearStep={onClearStep}
              />
            </div>

            <div className="mt-6 flex justify-center">
              <StepBadge currentStep={currentStep} />
            </div>

            <div className="mt-8">
              <StepHeading
                title={stepContent.title}
                description={stepContent.description}
              />
            </div>

            <div className="mt-12">{stepContent.content}</div>

            <div className="mt-10 flex min-h-[44px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex w-full justify-start sm:min-w-[180px]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={onPreviousStep}
                    className="inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 text-[1.05rem] font-medium text-[#3c392f] transition hover:bg-white/50 hover:text-[#171515] sm:rounded-full sm:px-0"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Vorige stap</span>
                  </button>
                ) : null}
              </div>

              <div className="flex w-full justify-end sm:min-w-[180px]">
                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={onShowResults}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#ddd3c8] bg-white/72 px-5 py-3 text-sm font-semibold text-[#2d2925] shadow-[0_12px_30px_rgba(52,38,25,0.06)] transition hover:-translate-y-0.5 hover:bg-white sm:w-auto sm:rounded-full"
                  >
                    <span>Bekijk resultaten tot nu toe</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <ProgressMeter
              currentStep={currentStep}
              completedStepCount={completedStepCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
