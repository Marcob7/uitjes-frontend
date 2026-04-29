import { cn } from "@/lib/utils";

type AppLoadingStateSize = "sm" | "md" | "lg";

export type AppLoadingStateProps = {
  title?: string;
  description?: string;
  size?: AppLoadingStateSize;
  className?: string;
};

const sizeClasses: Record<AppLoadingStateSize, string> = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function AppLoadingState({
  title = "Laden...",
  description,
  size = "md",
  className,
}: AppLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-[1.6rem] border border-[#e7dfd6] bg-white/80 text-[#50483f] shadow-[0_12px_30px_rgba(52,38,25,0.05)]",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#b8df71] shadow-[0_0_0_6px_rgba(184,223,113,0.22)]"
        />
        <div>
          <p className="text-sm font-semibold text-[#211d19]">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-[#71675d]">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
