"use client";

import type { ReactElement, RefObject } from "react";

import {
  AppButton,
  AppChoiceButton,
  AppFilterChip,
} from "@/components/ui/app";

import type {
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";

type CityExploreFormSectionProps = {
  cityLabel: string;
  isDarkLiquid: boolean;
  plannerSelections: PlannerSelections;
  currentStep: number;
  completedStepCount: number;
  onCompanionSelect: (value: PlannerCompanion) => void;
  onMomentSelect: (value: PlannerMoment) => void;
  onVibeSelect: (value: PlannerVibe) => void;
  onPreviousStep: () => void;
  onGoToStep: (step: number) => void;
  onClearStep: (step: number) => void;
  onShowResults: () => void;
  sectionRef: RefObject<HTMLElement | null>;
};

type LiquidToneKey = "sand" | "violet" | "sage" | "amber" | "mist" | "rose";

type CompanionOption = {
  id: PlannerCompanion;
  label: string;
  subtitle: string;
  tone: LiquidToneKey;
  icon: (props: { className?: string }) => ReactElement;
};

type MomentOption = {
  id: PlannerMoment;
  label: string;
  subtitle: string;
  tone: LiquidToneKey;
  icon: (props: { className?: string }) => ReactElement;
};

type VibeOption = {
  id: PlannerVibe;
  label: string;
  subtitle: string;
  tone: LiquidToneKey;
  icon: (props: { className?: string }) => ReactElement;
};

type StepChip = {
  step: number;
  label: string;
  value: string;
  icon: (props: { className?: string }) => ReactElement;
};

const TOTAL_STEPS = 3;

function getTonePalette(tone: LiquidToneKey) {
  switch (tone) {
    case "rose":
      return {
        surface: "rgba(246, 217, 210, 0.72)",
        surfaceSelected: "rgba(244, 202, 193, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#2f201d",
        muted: "rgba(47, 32, 29, 0.88)",
        badgeBackground: "#f6d9d2",
        badgeText: "#4b241f",
        iconBackground: "rgba(255, 245, 242, 0.94)",
        iconText: "#6a2f27",
      };
    case "violet":
      return {
        surface: "rgba(231, 228, 246, 0.72)",
        surfaceSelected: "rgba(220, 214, 244, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#262033",
        muted: "rgba(38, 32, 51, 0.88)",
        badgeBackground: "#e7e4f6",
        badgeText: "#2f2943",
        iconBackground: "rgba(247, 245, 253, 0.94)",
        iconText: "#41346d",
      };
    case "sage":
      return {
        surface: "rgba(222, 237, 220, 0.72)",
        surfaceSelected: "rgba(208, 231, 204, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#1f3022",
        muted: "rgba(31, 48, 34, 0.88)",
        badgeBackground: "#deeddc",
        badgeText: "#243626",
        iconBackground: "rgba(243, 251, 241, 0.94)",
        iconText: "#355a3b",
      };
    case "amber":
      return {
        surface: "rgba(247, 231, 200, 0.72)",
        surfaceSelected: "rgba(244, 223, 178, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#332617",
        muted: "rgba(51, 38, 23, 0.88)",
        badgeBackground: "#f7e7c8",
        badgeText: "#4b3718",
        iconBackground: "rgba(255, 249, 236, 0.94)",
        iconText: "#6d4e14",
      };
    case "mist":
      return {
        surface: "rgba(228, 235, 245, 0.72)",
        surfaceSelected: "rgba(214, 226, 242, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#212b39",
        muted: "rgba(33, 43, 57, 0.88)",
        badgeBackground: "#e4ebf5",
        badgeText: "#273347",
        iconBackground: "rgba(245, 248, 252, 0.94)",
        iconText: "#365171",
      };
    default:
      return {
        surface: "rgba(239, 229, 216, 0.72)",
        surfaceSelected: "rgba(233, 219, 202, 0.88)",
        ring: "rgba(255, 255, 255, 0.42)",
        text: "#2f231c",
        muted: "rgba(47, 35, 28, 0.88)",
        badgeBackground: "#efe5d8",
        badgeText: "#453127",
        iconBackground: "rgba(251, 246, 239, 0.94)",
        iconText: "#6a4531",
      };
  }
}

function getLiquidOptionCardStyle(
  palette: ReturnType<typeof getTonePalette>,
  isSelected: boolean,
  isDarkLiquid: boolean
) {
  return {
    background: isSelected
      ? `linear-gradient(180deg, rgba(255,255,255,0.76) 0%, ${palette.surfaceSelected} 100%)`
      : `linear-gradient(180deg, rgba(255,255,255,0.62) 0%, ${palette.surface} 100%)`,
    color: palette.text,
    border: `1px solid ${palette.ring}`,
    backdropFilter: "blur(22px) saturate(1.18)",
    WebkitBackdropFilter: "blur(22px) saturate(1.18)",
    boxShadow: isSelected
      ? isDarkLiquid
        ? "0 26px 54px rgba(8,15,20,0.32), inset 0 1px 0 rgba(255,255,255,0.58)"
        : "0 24px 48px rgba(41,31,22,0.13)"
      : isDarkLiquid
        ? "0 18px 38px rgba(8,15,20,0.26), inset 0 1px 0 rgba(255,255,255,0.5)"
        : "0 16px 34px rgba(41,31,22,0.08)",
  };
}

const COMPANION_OPTIONS: CompanionOption[] = [
  {
    id: "solo",
    label: "Alleen op pad",
    subtitle: "Ontdek plekken en activiteiten die je makkelijk zelf kunt doen.",
    tone: "sand",
    icon: SoloIcon,
  },
  {
    id: "date",
    label: "Date",
    subtitle: "Vind iets dat leuk voelt om samen te doen in deze stad.",
    tone: "violet",
    icon: HeartIcon,
  },
  {
    id: "gezin",
    label: "Met gezin",
    subtitle: "Activiteiten die passen bij kinderen, gemak en samen op pad.",
    tone: "sage",
    icon: FamilyIcon,
  },
  {
    id: "vrienden",
    label: "Met vrienden",
    subtitle: "Ideeën voor een gezellige middag of avond samen.",
    tone: "amber",
    icon: FriendsIcon,
  },
];

const MOMENT_OPTIONS: MomentOption[] = [
  {
    id: "nu",
    label: "Nu",
    subtitle: "Suggesties die nu of op korte termijn interessant zijn.",
    tone: "amber",
    icon: LightningIcon,
  },
  {
    id: "vanavond",
    label: "Vanavond",
    subtitle: "Ideeën voor een spontane avond in deze stad.",
    tone: "violet",
    icon: MoonIcon,
  },
  {
    id: "morgen",
    label: "Later plannen",
    subtitle: "Bewaar inspiratie voor een later moment.",
    tone: "sage",
    icon: SunIcon,
  },
  {
    id: "weekend",
    label: "Dit weekend",
    subtitle: "Dingen om dit weekend te doen.",
    tone: "mist",
    icon: CalendarIcon,
  },
];

const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "cultureel",
    label: "Cultureel",
    subtitle: "Musea, theater, erfgoed en bijzondere plekken in deze stad.",
    tone: "sand",
    icon: SparkIcon,
  },
  {
    id: "actief",
    label: "Actief",
    subtitle: "Buiten, bewegen, ontdekken of iets doen met energie.",
    tone: "sage",
    icon: RouteIcon,
  },
  {
    id: "eten-drinken",
    label: "Eten & drinken",
    subtitle: "Terrassen, restaurants, proeverijen of foodspots.",
    tone: "amber",
    icon: ForkKnifeIcon,
  },
  {
    id: "relaxed",
    label: "Relaxed",
    subtitle: "Rustige plekken, wandelen, rondkijken of laagdrempelig genieten.",
    tone: "mist",
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

function StepBadge({
  currentStep,
  isDarkLiquid,
}: {
  currentStep: number;
  isDarkLiquid: boolean;
}) {
  return (
    <div
      className="inline-flex rounded-2xl px-5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.22em] shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:rounded-full"
      style={{
        backgroundColor: isDarkLiquid ? "rgba(255,255,255,0.16)" : "#d9f0a8",
        color: isDarkLiquid ? "#ffffff" : "#33481f",
        border: isDarkLiquid ? "1px solid rgba(255,255,255,0.16)" : "none",
      }}
    >
      Stap {currentStep} van {TOTAL_STEPS}
    </div>
  );
}

function ProgressMeter({
  currentStep,
  completedStepCount,
  isDarkLiquid,
}: {
  currentStep: number;
  completedStepCount: number;
  isDarkLiquid: boolean;
}) {
  return (
    <div className="mx-auto mt-6 max-w-[12rem] sm:mt-12 sm:max-w-[18rem]">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber <= completedStepCount;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="h-1.5 rounded-full transition sm:h-2.5"
              style={{
                backgroundColor:
                  isComplete || isActive
                    ? "#b7e56b"
                    : isDarkLiquid
                      ? "rgba(255,255,255,0.26)"
                      : "#e7e0d7",
              }}
            />
          );
        })}
      </div>
      <div
        className="sr-only mt-4 text-center text-[0.8rem] font-medium uppercase tracking-[0.22em] sm:not-sr-only"
        style={{ color: isDarkLiquid ? "rgba(255,255,255,0.66)" : "#93877b" }}
      >
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
    <div className="hidden flex-wrap justify-center gap-3 sm:flex">
      {chips.map((chip) => {
        const Icon = chip.icon;

        return (
          <AppFilterChip
            key={chip.step}
            active
            removable
            onClick={() => onGoToStep(chip.step)}
            onRemove={() => onClearStep(chip.step)}
            className="w-full justify-center border-[#d7e7b6] bg-[#d9f0a8] px-4 py-2.5 text-[#44602a] shadow-[0_14px_28px_rgba(109,144,51,0.12)] sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>
                {chip.label}: {chip.value}
              </span>
            </span>
          </AppFilterChip>
        );
      })}
    </div>
  );
}

function StepHeading({
  title,
  description,
  isDarkLiquid,
}: {
  title: string;
  description: string;
  isDarkLiquid: boolean;
}) {
  return (
    <div className="mx-auto max-w-[56rem] text-center">
      <h2
        className="mx-auto text-center text-[2rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[clamp(2.6rem,7vw,5rem)] sm:leading-[0.9] sm:tracking-[-0.08em]"
        style={{ color: isDarkLiquid ? "#ffffff" : "#141414" }}
      >
        {title}
      </h2>
      <p
        className="mx-auto mt-3 max-w-[34rem] text-center text-sm leading-6 sm:mt-5 sm:max-w-[42rem] sm:text-[1.18rem] sm:leading-8"
        style={{ color: isDarkLiquid ? "rgba(255,255,255,0.76)" : "#74685d" }}
      >
        {description}
      </p>
    </div>
  );
}

function CompanionGrid({
  selected,
  onSelect,
  isDarkLiquid,
}: {
  selected: PlannerCompanion;
  onSelect: (value: PlannerCompanion) => void;
  isDarkLiquid: boolean;
}) {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COMPANION_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;
        const palette = getTonePalette(option.tone);

        return (
          <AppChoiceButton
            key={option.id}
            title={option.label}
            description={option.subtitle}
            selected={isSelected}
            onClick={() => onSelect(option.id)}
            size="large"
            icon={<Icon className="h-6 w-6 sm:h-10 sm:w-10" />}
            className={`min-h-[68px] items-center rounded-[1.15rem] p-3 text-left sm:min-h-[230px] sm:items-stretch sm:rounded-[2rem] sm:p-6 sm:text-center [&>span:first-child]:h-9 [&>span:first-child]:w-9 [&>span:first-child]:border-white/80 [&>span:first-child]:bg-[var(--choice-icon-bg)] [&>span:first-child]:text-[var(--choice-icon-text)] [&>span:first-child]:sm:h-24 [&>span:first-child]:sm:w-24 [&>span:last-child>span:first-child]:text-[0.98rem] [&>span:last-child>span:first-child]:text-[var(--choice-text)] [&>span:last-child>span:last-child]:hidden [&>span:last-child>span:last-child]:font-medium [&>span:last-child>span:last-child]:text-[var(--choice-muted)] [&>span:last-child>span:last-child]:sm:block ${
              isSelected
                ? "translate-y-[-2px] shadow-[0_24px_48px_rgba(41,31,22,0.14)]"
                : "hover:translate-y-[-2px] hover:shadow-[0_16px_34px_rgba(41,31,22,0.09)]"
            }`}
            style={{
              ...getLiquidOptionCardStyle(palette, isSelected, isDarkLiquid),
              "--choice-icon-bg": palette.iconBackground,
              "--choice-icon-text": palette.iconText,
              "--choice-text": palette.text,
              "--choice-muted": palette.muted,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

function SimpleOptionGrid<T extends string>({
  options,
  selected,
  onSelect,
  isDarkLiquid,
}: {
  options: Array<{
    id: T;
    label: string;
    subtitle: string;
    tone: LiquidToneKey;
    icon: (props: { className?: string }) => ReactElement;
  }>;
  selected: T;
  onSelect: (value: T) => void;
  isDarkLiquid: boolean;
}) {
  return (
    <div className="mx-auto grid max-w-[1020px] gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;
        const palette = getTonePalette(option.tone);

        return (
          <AppChoiceButton
            key={option.id}
            title={option.label}
            description={option.subtitle}
            selected={isSelected}
            onClick={() => onSelect(option.id)}
            size="large"
            icon={<Icon className="h-6 w-6 sm:h-9 sm:w-9" />}
            className={`min-h-[64px] items-center rounded-[1.15rem] p-3 text-left sm:min-h-[214px] sm:items-stretch sm:rounded-[2rem] sm:p-6 sm:text-center [&>span:first-child]:h-9 [&>span:first-child]:w-9 [&>span:first-child]:border-white/80 [&>span:first-child]:bg-[var(--choice-icon-bg)] [&>span:first-child]:text-[var(--choice-icon-text)] [&>span:first-child]:sm:h-20 [&>span:first-child]:sm:w-20 [&>span:last-child>span:first-child]:text-[0.98rem] [&>span:last-child>span:first-child]:text-[var(--choice-text)] [&>span:last-child>span:last-child]:hidden [&>span:last-child>span:last-child]:font-medium [&>span:last-child>span:last-child]:text-[var(--choice-muted)] [&>span:last-child>span:last-child]:sm:block ${
              isSelected
                ? "translate-y-[-2px] shadow-[0_24px_48px_rgba(41,31,22,0.12)]"
                : "hover:translate-y-[-2px] hover:shadow-[0_16px_34px_rgba(41,31,22,0.08)]"
            }`}
            style={{
              ...getLiquidOptionCardStyle(palette, isSelected, isDarkLiquid),
              "--choice-icon-bg": palette.iconBackground,
              "--choice-icon-text": palette.iconText,
              "--choice-text": palette.text,
              "--choice-muted": palette.muted,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

export default function CityExploreFormSection({
  cityLabel,
  isDarkLiquid,
  plannerSelections,
  currentStep,
  completedStepCount,
  onCompanionSelect,
  onMomentSelect,
  onVibeSelect,
  onPreviousStep,
  onGoToStep,
  onClearStep,
  onShowResults,
  sectionRef,
}: CityExploreFormSectionProps) {
  const stepChips = buildStepChips(plannerSelections, completedStepCount);
  const borderColor = isDarkLiquid ? "rgba(255,255,255,0.18)" : "#ddd3c8";
  const secondaryTextColor = isDarkLiquid ? "rgba(255,255,255,0.85)" : "#3c392f";
  const secondaryButtonSurface = isDarkLiquid
    ? "rgba(255,255,255,0.12)"
    : "rgba(255,255,255,0.72)";

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
            isDarkLiquid={isDarkLiquid}
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
            isDarkLiquid={isDarkLiquid}
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
            isDarkLiquid={isDarkLiquid}
          />
        ),
      };
    }

    return null;
  })();

  if (!stepContent) {
    return null;
  }

  return (
    <section ref={sectionRef} className="scroll-mt-6 bg-transparent">
      <div className="mx-auto max-w-[1220px] px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
        <div className="">
          <div
            className="absolute -left-16 top-20 h-40 w-40 rounded-full blur-3xl"
            style={{
              backgroundColor: isDarkLiquid
                ? "rgba(255,255,255,0.08)"
                : "rgba(236,227,214,0.88)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl"
            style={{
              backgroundColor: isDarkLiquid
                ? "rgba(255,255,255,0.06)"
                : "rgba(244,234,214,0.92)",
            }}
          />
          <div
            className="absolute bottom-0 right-24 h-36 w-36 rounded-full blur-3xl"
            style={{
              backgroundColor: isDarkLiquid
                ? "rgba(183,229,107,0.12)"
                : "rgba(221,238,194,0.92)",
            }}
          />

          <div className="relative">
            <div className="flex justify-center">
              <StepChipRow
                chips={stepChips}
                onGoToStep={onGoToStep}
                onClearStep={onClearStep}
              />
            </div>

            <div className="mt-2 flex justify-center sm:mt-6">
              <StepBadge currentStep={currentStep} isDarkLiquid={isDarkLiquid} />
            </div>

            <div className="mt-4 sm:mt-8">
              <StepHeading
                title={stepContent.title}
                description={stepContent.description}
                isDarkLiquid={isDarkLiquid}
              />
            </div>

            <div className="mt-6 sm:mt-12">{stepContent.content}</div>

            <div className="mt-6 flex min-h-[44px] flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex w-full justify-start sm:min-w-[180px]">
                {currentStep > 1 ? (
                  <AppButton
                    onClick={onPreviousStep}
                    variant="ghost"
                    size="md"
                    iconLeft={<ArrowLeftIcon className="h-5 w-5" />}
                    className="min-h-12 px-4 text-[1.05rem] font-medium sm:px-0"
                    style={{
                      color: secondaryTextColor,
                      backgroundColor: isDarkLiquid
                        ? "rgba(255,255,255,0.06)"
                        : "transparent",
                    }}
                  >
                    Vorige stap
                  </AppButton>
                ) : null}
              </div>

              <div className="flex w-full justify-end sm:min-w-[180px]">
                {currentStep < TOTAL_STEPS ? (
                  <AppButton
                    onClick={onShowResults}
                    variant="secondary"
                    size="md"
                    fullWidth
                    iconRight={<ArrowRightIcon className="h-4 w-4" />}
                    className="min-h-12 shadow-[0_12px_30px_rgba(52,38,25,0.06)] hover:-translate-y-0.5 sm:w-auto"
                    style={{
                      border: `1px solid ${borderColor}`,
                      backgroundColor: secondaryButtonSurface,
                      color: isDarkLiquid ? "#ffffff" : "#2d2925",
                      boxShadow: isDarkLiquid
                        ? "0 12px 30px rgba(8, 15, 20, 0.18)"
                        : "0 12px 30px rgba(52,38,25,0.06)",
                    }}
                  >
                    Bekijk resultaten tot nu toe
                  </AppButton>
                ) : null}
              </div>
            </div>

            <ProgressMeter
              currentStep={currentStep}
              completedStepCount={completedStepCount}
              isDarkLiquid={isDarkLiquid}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
