"use client";

import { cn } from "@/lib/utils";

import { AppButton } from "./AppButton";

export type AppErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function AppErrorState({
  title = "Er ging iets mis",
  description = "Probeer het opnieuw of kom later terug.",
  actionLabel,
  onAction,
  className,
}: AppErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[1.8rem] border border-[#e6b6ad] bg-[#fff7f5] p-5 text-[#47221c] shadow-[0_14px_34px_rgba(91,34,25,0.06)] sm:p-6",
        className
      )}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b3c2e]">
        Foutmelding
      </p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#2f1713]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-[36rem] text-sm leading-6 text-[#704039]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-5">
          <AppButton variant="outline" onClick={onAction}>
            {actionLabel}
          </AppButton>
        </div>
      ) : null}
    </div>
  );
}
