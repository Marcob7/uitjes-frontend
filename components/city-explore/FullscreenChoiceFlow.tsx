"use client";

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

const useInitialFlowLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type FullscreenChoiceFlowStep = {
  id: string;
  type: "question" | "results" | "custom";
};

export type FullscreenChoiceOption = {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
};

type FullscreenChoiceFlowProps = {
  steps: readonly FullscreenChoiceFlowStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onEditChoices?: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Lets an introductory step opt out of wizard chrome without affecting other flows. */
  showProgress?: (context: { step: FullscreenChoiceFlowStep; stepNumber: number; totalSteps: number; isResultsStep: boolean }) => boolean;
  showFooter?: (context: { step: FullscreenChoiceFlowStep; stepNumber: number; totalSteps: number; isResultsStep: boolean }) => boolean;
  exitHref: string;
  exitLabel: string;
  decorativeLayer?: (context: {
    isResultsStep: boolean;
    stepNumber: number;
    totalSteps: number;
  }) => ReactNode;
  children: (context: {
    step: FullscreenChoiceFlowStep;
    stepNumber: number;
    totalSteps: number;
    isResultsStep: boolean;
  }) => ReactNode;
};

/**
 * Shared fullscreen shell for the guided choice flows on /ontdek and /inspiratie.
 * Each route keeps its own answers and matching logic; this component owns only
 * the modal mechanics and the visual rhythm shared by both experiences.
 */
export function FullscreenChoiceFlow({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onEditChoices,
  secondaryAction,
  showProgress,
  showFooter,
  exitHref,
  exitLabel,
  decorativeLayer,
  children,
}: FullscreenChoiceFlowProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headerActionRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const previousStepRef = useRef(currentStep);
  const isResultsStepRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const labelId = useId();
  const descriptionId = useId();
  const totalSteps = steps.length;
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const step = steps[safeStep - 1];
  const isResultsStep = step?.type === "results";
  const progress = useMemo(
    () => `${String(safeStep).padStart(2, "0")}/${String(totalSteps).padStart(2, "0")}`,
    [safeStep, totalSteps]
  );
  const flowContext = { step, stepNumber: safeStep, totalSteps, isResultsStep };
  const shouldShowProgress = showProgress?.(flowContext) ?? true;
  const shouldShowFooter = showFooter?.(flowContext) ?? true;

  isResultsStepRef.current = isResultsStep;
  onCompleteRef.current = onComplete;

  // This must happen before paint: the flow is already present in the initial
  // server markup, so the page beneath it never becomes briefly scrollable.
  useInitialFlowLayoutEffect(() => {
    const body = document.body;
    const documentElement = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousHtmlOverflow = documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    window.requestAnimationFrame(() => headerActionRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isResultsStepRef.current) {
          event.preventDefault();
          onCompleteRef.current();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    if (previousStepRef.current === safeStep) return;

    previousStepRef.current = safeStep;
    window.requestAnimationFrame(() => {
      dialogRef.current?.scrollTo({ top: 0, behavior: "auto" });
      dialogRef.current
        ?.querySelector<HTMLElement>("[data-flow-heading]")
        ?.focus();
    });
  }, [safeStep]);

  if (!step) return null;

  // Keep the dialog in the React tree instead of waiting for a client-only
  // portal. A fixed element covers the viewport from the server render onward,
  // which keeps the /ontdek results page from flashing before hydration.
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-[1000] h-dvh overflow-x-hidden overflow-y-auto overscroll-contain bg-[#F6F5F0] text-[#29342F]"
    >
      {decorativeLayer ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {decorativeLayer({ isResultsStep, stepNumber: safeStep, totalSteps })}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-28 top-[13%] h-72 w-72 rounded-full bg-[#DDEBE2] blur-3xl" />
          <div className="absolute right-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-[#EFE1BD]/75 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[42%] h-72 w-72 rounded-full bg-[#DCE8ED]/80 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-[82rem] flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(7rem,calc(env(safe-area-inset-top)+6rem))] sm:px-7 lg:px-10">
        <header className="flex min-h-12 items-center justify-between gap-4">
          {isResultsStep ? (
            <button
              ref={headerActionRef as React.RefObject<HTMLButtonElement>}
              type="button"
              onClick={onComplete}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DCE1DC] bg-white/80 px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              <CloseIcon className="h-4 w-4" />
              <span>Resultaten bekijken</span>
            </button>
          ) : (
            <Link
              ref={headerActionRef as React.RefObject<HTMLAnchorElement>}
              href={exitHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DCE1DC] bg-white/80 px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-[#29342F]">{exitLabel}</span>
            </Link>
          )}
          {shouldShowProgress ? (
            <p
              className="text-sm font-medium text-[#65736C]"
              aria-label={`Stap ${safeStep} van ${totalSteps}${isResultsStep ? ": resultaten" : ""}`}
            >
              <span aria-hidden="true">{progress}</span>
            </p>
          ) : <span aria-hidden="true" />}
        </header>

        <div className={isResultsStep ? "flex flex-1 py-8 sm:py-10 lg:py-12" : "flex flex-1 items-center py-9 sm:py-12 lg:py-16"}>
          <FlowHeadingIdsContext.Provider value={{ labelId, descriptionId }}>
            {children({ step, stepNumber: safeStep, totalSteps, isResultsStep })}
          </FlowHeadingIdsContext.Provider>
        </div>

        {shouldShowFooter ? <footer className="flex items-end justify-between gap-4 border-t border-[#DCE1DC] py-4 sm:py-5">
          <div className="min-w-32">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#65736C]">Voortgang</p>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {steps.map((flowStep, index) => (
                <span
                  key={flowStep.id}
                  className={`h-1.5 w-8 rounded-full sm:w-12 ${index < safeStep ? "bg-[#1D5A46]" : "bg-[#DCE1DC]"}`}
                />
              ))}
            </div>
          </div>
          {isResultsStep ? (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              {onEditChoices ? (
                <button
                  type="button"
                  onClick={onEditChoices}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DCE1DC] bg-white/80 px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
                >
                  Keuzes aanpassen
                </button>
              ) : null}
              <button
                type="button"
                onClick={onComplete}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1D5A46] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#174936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC]"
              >
                Bekijk alle resultaten
              </button>
            </div>
          ) : (
            <div className={`flex w-full flex-col gap-3 ${safeStep > 1 ? "sm:flex-row sm:items-center sm:justify-between" : "sm:items-end"}`}>
              {safeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => onStepChange(safeStep - 1)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#DCE1DC] bg-white/80 px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] sm:w-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Vorige
                </button>
              ) : null}
              {secondaryAction ? (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#DCE1DC] bg-white/80 px-4 py-2 text-sm font-semibold text-[#355E7A] transition hover:border-[#355E7A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005FCC] sm:w-auto"
                >
                  {secondaryAction.label}
                </button>
              ) : safeStep === 1 ? (
                <p className="hidden text-sm text-[#65736C] sm:block">Kies een kaart om verder te gaan.</p>
              ) : null}
            </div>
          )}
        </footer> : null}
      </div>
    </div>
  );
}

const FlowHeadingIdsContext = React.createContext<{ labelId: string; descriptionId: string } | null>(null);

export function FullscreenChoiceQuestion({
  contextLabel,
  title,
  description,
  primaryAction,
  transitionLabel,
  children,
}: {
  contextLabel?: string;
  title: string;
  description: string;
  primaryAction?: ReactNode;
  transitionLabel?: string;
  children: ReactNode;
}) {
  const ids = React.useContext(FlowHeadingIdsContext);

  return (
    <div className="w-full">
      <div className="grid gap-10 lg:grid-cols-[minmax(16rem,0.82fr)_minmax(0,1.45fr)] lg:items-end lg:gap-16">
        <div className="max-w-xl lg:pb-4">
          {contextLabel ? <p className="mt-5 text-sm font-medium text-[#65736C]">{contextLabel}</p> : null}
          <h1
            id={ids?.labelId}
            data-flow-heading
            tabIndex={-1}
            className={`${contextLabel ? "mt-3" : ""} max-w-[13ch] text-[clamp(2.7rem,6.4vw,5.75rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#29342F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC]`}
          >
            {title}
          </h1>
          <p id={ids?.descriptionId} className="mt-5 max-w-md text-base leading-7 text-[#65736C] sm:text-lg sm:leading-8">
            {description}
          </p>
          {primaryAction ? <div className="mt-6">{primaryAction}</div> : null}
          {transitionLabel ? <p className="mt-6 text-sm font-semibold text-[#65736C]">{transitionLabel}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}

export function FullscreenChoiceGrid({
  title,
  options,
  selectedValue,
  onChoose,
  disabled = false,
  compactMobile = false,
}: {
  title: string;
  options: readonly FullscreenChoiceOption[];
  selectedValue?: string;
  onChoose: (value: string) => void;
  disabled?: boolean;
  compactMobile?: boolean;
}) {
  return (
    <fieldset
      role="radiogroup"
      aria-label={title}
      className={`grid ${compactMobile ? "grid-cols-2 gap-2.5 sm:gap-4" : "gap-3 sm:grid-cols-2 sm:gap-4"} motion-safe:animate-[wizardIn_240ms_cubic-bezier(0.16,1,0.3,1)_both]`}
    >
      <legend className="sr-only">{title}</legend>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChoose(option.value)}
            className={`group relative min-h-40 overflow-hidden rounded-[1.4rem] border p-5 text-left transition ${compactMobile ? "min-h-[8.75rem] p-3.5 sm:min-h-48 sm:p-6" : "sm:min-h-48 sm:p-6"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC] ${
              isSelected
                ? "border-[#1D5A46] bg-[#DDEBE2] text-[#173F31] shadow-[0_16px_32px_rgba(29,90,70,0.12)]"
                : "border-[#DCE1DC] bg-white/78 text-[#29342F] hover:-translate-y-0.5 hover:border-[#9DBAAE] hover:bg-white hover:shadow-[0_14px_30px_rgba(41,52,47,0.08)]"
            } ${disabled ? "cursor-wait" : ""}`}
          >
            <span className={`flex items-center justify-center rounded-full transition ${compactMobile ? "h-9 w-9 sm:h-11 sm:w-11" : "h-11 w-11"} ${isSelected ? "bg-[#1D5A46] text-white" : "bg-[#F0F4ED] text-[#1D5A46] group-hover:bg-[#DDEBE2]"}`} aria-hidden="true">
              {option.icon}
            </span>
            <span className={`block font-semibold tracking-[-0.035em] ${compactMobile ? "mt-3 text-base leading-5 sm:mt-6 sm:text-2xl sm:leading-normal" : "mt-6 text-xl sm:text-2xl"}`}>{option.label}</span>
            <span className={`block max-w-[28rem] text-[#65736C] ${compactMobile ? "mt-1.5 text-xs leading-[1.15rem] sm:mt-2 sm:text-sm sm:leading-6" : "mt-2 text-sm leading-6"}`}>{option.description}</span>
            <span className={`absolute flex h-5 w-5 items-center justify-center rounded-full border transition ${compactMobile ? "right-3.5 top-3.5 sm:right-5 sm:top-5" : "right-5 top-5"} ${isSelected ? "border-[#1D5A46] bg-[#1D5A46] text-white" : "border-[#B8C5BE] bg-white text-transparent"}`} aria-hidden="true">
              <CheckIcon className="h-3 w-3" />
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}

export function FullscreenChoiceResults({
  title = "Dit past bij jouw keuzes",
  description,
  children,
}: {
  title?: string;
  description: string;
  children: ReactNode;
}) {
  const ids = React.useContext(FlowHeadingIdsContext);

  return (
    <section className="mx-auto w-full max-w-[72rem] motion-safe:animate-[wizardIn_240ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="max-w-2xl">
        <h1 id={ids?.labelId} data-flow-heading tabIndex={-1} className="max-w-[14ch] text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#29342F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005FCC]">
          {title}
        </h1>
        <p id={ids?.descriptionId} className="mt-4 text-base leading-7 text-[#65736C] sm:text-lg">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 5-7 7 7 7" /></svg>;
}

function CloseIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function CheckIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.2 4.2L19.5 6" /></svg>;
}
