"use client";

import { cn } from "@/lib/utils";

import { ChoiceFlowOption } from "./ChoiceFlowOption";
import type { ChoiceFlowOptionConfig } from "./types";

type ChoiceFlowStepProps = {
  title: string;
  description?: string;
  options: ChoiceFlowOptionConfig[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  className?: string;
};

export function ChoiceFlowStep({
  title,
  description,
  options,
  selectedValue,
  onSelect,
  className,
}: ChoiceFlowStepProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      <div className="mx-auto max-w-[46rem] text-center">
        <h2 className="mx-auto max-w-[14ch] text-[clamp(2rem,5vw,3.7rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#171511]">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-[38rem] text-sm leading-7 text-[#665d54] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <ChoiceFlowOption
            key={option.value}
            {...option}
            selected={selectedValue === option.value}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
