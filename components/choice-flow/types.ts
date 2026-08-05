import type { ReactNode } from "react";

export type ChoiceFlowValue = string;

export type ChoiceFlowAnswers = Record<string, ChoiceFlowValue>;

export type ChoiceFlowOptionConfig = {
  value: ChoiceFlowValue;
  title: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ChoiceFlowStepConfig = {
  id: string;
  title: string;
  description?: string;
  options: ChoiceFlowOptionConfig[];
};

export type ChoiceFlowRenderResultArgs = {
  answers: ChoiceFlowAnswers;
  steps: ChoiceFlowStepConfig[];
  reset: () => void;
  editStep: (stepId: string) => void;
};

export type ChoiceFlowProps = {
  steps: ChoiceFlowStepConfig[];
  initialStepId?: string;
  onComplete?: (answers: ChoiceFlowAnswers) => void;
  onChange?: (answers: ChoiceFlowAnswers) => void;
  renderResult?: (args: ChoiceFlowRenderResultArgs) => ReactNode;
  className?: string;
  allowBack?: boolean;
  resetLabel?: string;
  backLabel?: string;
};
