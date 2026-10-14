"use client";

import type { ReactElement } from "react";

import {
  FullscreenChoiceGrid,
  FullscreenChoiceQuestion,
} from "@/components/city-explore/FullscreenChoiceFlow";

type InspirationChoiceStepProps = {
  contextLabel?: string;
  title: string;
  description: string;
  selectedValue?: string;
  onChoose: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    helper: string;
    icon: ReactElement;
  }>;
};

/** Presentation for the companion, moment, and vibe steps. */
export default function InspirationChoiceStep({
  contextLabel,
  title,
  description,
  selectedValue,
  onChoose,
  options,
}: InspirationChoiceStepProps) {
  return (
    <FullscreenChoiceQuestion
      contextLabel={contextLabel}
      title={title}
      description={description}
    >
      <FullscreenChoiceGrid
        title={title}
        selectedValue={selectedValue}
        onChoose={onChoose}
        options={options.map(({ value, label, helper, icon }) => ({
          value,
          label,
          description: helper,
          icon,
        }))}
      />
    </FullscreenChoiceQuestion>
  );
}
