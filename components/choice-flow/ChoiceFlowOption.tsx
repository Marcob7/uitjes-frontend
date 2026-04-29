"use client";

import { AppChoiceButton } from "@/components/ui/app";

import type { ChoiceFlowOptionConfig } from "./types";

type ChoiceFlowOptionProps = ChoiceFlowOptionConfig & {
  selected?: boolean;
  onClick: (value: string) => void;
};

export function ChoiceFlowOption({
  value,
  title,
  description,
  icon,
  disabled = false,
  selected = false,
  onClick,
}: ChoiceFlowOptionProps) {
  return (
    <AppChoiceButton
      title={title}
      description={description}
      icon={icon}
      selected={selected}
      disabled={disabled}
      onClick={() => onClick(value)}
      size="default"
      className="min-h-[86px] sm:min-h-[132px]"
    />
  );
}
