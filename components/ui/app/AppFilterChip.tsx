"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AppFilterChipVariant = "default" | "active" | "subtle";

export type AppFilterChipProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  variant?: AppFilterChipVariant;
  style?: React.CSSProperties;
};

const variantClasses: Record<AppFilterChipVariant, string> = {
  default: "border-[#ddd5c8] bg-[#fbf8f2] text-[#55483d] hover:bg-white",
  active: "border-[#b8df71] bg-[#eef8d8] text-[#344125]",
  subtle: "border-transparent bg-[#f4f0eb] text-[#5b5047] hover:bg-[#eee7df]",
};

export function AppFilterChip({
  children,
  active = false,
  onClick,
  disabled = false,
  removable = false,
  onRemove,
  className,
  variant = "default",
  style,
}: AppFilterChipProps) {
  const resolvedVariant = active ? "active" : variant;
  const interactive = Boolean(onClick);

  const content = (
    <>
      <span className="min-w-0 truncate">{children}</span>
      {removable ? (
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Verwijder filter"
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onRemove?.();
            }
          }}
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/6 text-xs hover:bg-black/10"
        >
          x
        </span>
      ) : null}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={style}
        className={cn(
          "inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] disabled:cursor-not-allowed disabled:opacity-55",
          variantClasses[resolvedVariant],
          className
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      style={style}
      className={cn(
        "inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
        variantClasses[resolvedVariant],
        disabled && "opacity-55",
        className
      )}
    >
      {content}
    </span>
  );
}
