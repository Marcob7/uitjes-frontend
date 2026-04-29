"use client";

import * as React from "react";

import { AppButton, AppCard } from "@/components/ui/app";
import { cn } from "@/lib/utils";

import { ChoiceFlowProgress } from "./ChoiceFlowProgress";
import { ChoiceFlowStep } from "./ChoiceFlowStep";
import { ChoiceFlowSummary } from "./ChoiceFlowSummary";
import type { ChoiceFlowAnswers, ChoiceFlowProps } from "./types";

function getInitialStepIndex(steps: ChoiceFlowProps["steps"], initialStepId?: string) {
  if (!initialStepId) {
    return 0;
  }

  const index = steps.findIndex((step) => step.id === initialStepId);
  return index >= 0 ? index : 0;
}

export function ChoiceFlow({
  steps,
  initialStepId,
  onComplete,
  onChange,
  renderResult,
  className,
  allowBack = true,
  resetLabel = "Opnieuw beginnen",
  backLabel = "Vorige stap",
}: ChoiceFlowProps) {
  const initialIndex = getInitialStepIndex(steps, initialStepId);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(initialIndex);
  const [answers, setAnswers] = React.useState<ChoiceFlowAnswers>({});
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    setCurrentStepIndex(getInitialStepIndex(steps, initialStepId));
    setAnswers({});
    setIsComplete(false);
  }, [initialStepId, steps]);

  if (steps.length === 0) {
    return null;
  }

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const completedSteps = steps.filter((step) => answers[step.id]).length;

  function reset() {
    const nextAnswers: ChoiceFlowAnswers = {};
    setAnswers(nextAnswers);
    setCurrentStepIndex(initialIndex);
    setIsComplete(false);
    onChange?.(nextAnswers);
  }

  function editStep(stepId: string) {
    const index = steps.findIndex((step) => step.id === stepId);

    if (index < 0) {
      return;
    }

    setCurrentStepIndex(index);
    setIsComplete(false);
  }

  function handleBack() {
    setIsComplete(false);
    setCurrentStepIndex((current) => Math.max(0, current - 1));
  }

  function handleSelect(value: string) {
    const step = steps[currentStepIndex];
    const nextAnswers = {
      ...answers,
      [step.id]: value,
    };
    const nextIndex = currentStepIndex + 1;

    setAnswers(nextAnswers);
    onChange?.(nextAnswers);

    if (nextIndex >= steps.length) {
      setIsComplete(true);
      onComplete?.(nextAnswers);
      return;
    }

    setCurrentStepIndex(nextIndex);
  }

  const showResult = isComplete && renderResult;

  return (
    <AppCard
      variant="glass"
      padding="lg"
      className={cn("overflow-hidden rounded-[2rem]", className)}
    >
      <div className="grid gap-7">
        <ChoiceFlowProgress
          currentStepIndex={isComplete ? steps.length - 1 : currentStepIndex}
          totalSteps={steps.length}
          completedSteps={completedSteps}
          labels={steps.map((step) => step.eyebrow ?? step.title)}
        />

        <ChoiceFlowSummary
          selectedAnswers={answers}
          steps={steps}
          onEditStep={allowBack ? editStep : undefined}
        />

        {showResult ? (
          <div>
            {renderResult({
              answers,
              steps,
              reset,
              editStep,
            })}
          </div>
        ) : (
          <ChoiceFlowStep
            eyebrow={currentStep.eyebrow}
            title={currentStep.title}
            description={currentStep.description}
            options={currentStep.options}
            selectedValue={answers[currentStep.id]}
            onSelect={handleSelect}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {allowBack && (currentStepIndex > 0 || isComplete) ? (
              <AppButton variant="ghost" size="sm" onClick={handleBack}>
                {backLabel}
              </AppButton>
            ) : null}
          </div>

          <AppButton variant="subtle" size="sm" onClick={reset}>
            {resetLabel}
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
