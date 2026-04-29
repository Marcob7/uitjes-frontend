"use client";

import { AppFilterChip } from "@/components/ui/app";
import { cn } from "@/lib/utils";

import type { ChoiceFlowAnswers, ChoiceFlowStepConfig } from "./types";

type ChoiceFlowSummaryProps = {
  selectedAnswers: ChoiceFlowAnswers;
  steps: ChoiceFlowStepConfig[];
  onEditStep?: (stepId: string) => void;
  className?: string;
};

function getAnswerLabel(step: ChoiceFlowStepConfig, value: string) {
  return step.options.find((option) => option.value === value)?.title ?? value;
}

export function ChoiceFlowSummary({
  selectedAnswers,
  steps,
  onEditStep,
  className,
}: ChoiceFlowSummaryProps) {
  const answeredSteps = steps.filter((step) => selectedAnswers[step.id]);

  if (answeredSteps.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {answeredSteps.map((step) => {
        const answer = selectedAnswers[step.id];

        return (
          <AppFilterChip
            key={step.id}
            active
            onClick={onEditStep ? () => onEditStep(step.id) : undefined}
            className="max-w-full border-[#d7e7b6] bg-[#d9f0a8] text-[#44602a]"
          >
            {step.eyebrow ? `${step.eyebrow}: ` : ""}
            {getAnswerLabel(step, answer)}
          </AppFilterChip>
        );
      })}
    </div>
  );
}
