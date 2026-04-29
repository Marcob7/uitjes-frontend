import { cn } from "@/lib/utils";

type ChoiceFlowProgressProps = {
  currentStepIndex: number;
  totalSteps: number;
  completedSteps: number;
  labels?: string[];
  className?: string;
};

export function ChoiceFlowProgress({
  currentStepIndex,
  totalSteps,
  completedSteps,
  labels,
  className,
}: ChoiceFlowProgressProps) {
  if (totalSteps <= 0) {
    return null;
  }

  return (
    <div className={cn("mx-auto w-full max-w-[24rem]", className)}>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const isComplete = index < completedSteps;
          const isActive = index === currentStepIndex;

          return (
            <div
              key={labels?.[index] ?? index}
              className={cn(
                "h-2.5 rounded-full transition",
                isComplete || isActive ? "bg-[#b7e56b]" : "bg-[#e7e0d7]"
              )}
              aria-label={labels?.[index]}
            />
          );
        })}
      </div>
      <p className="mt-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8a8072]">
        Stap {Math.min(currentStepIndex + 1, totalSteps)} van {totalSteps}
      </p>
    </div>
  );
}
