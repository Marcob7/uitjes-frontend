"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AppChoiceButtonSize = "compact" | "default" | "large";

export type AppChoiceButtonProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: AppChoiceButtonSize;
  className?: string;
  style?: React.CSSProperties;
};

const sizeClasses: Record<AppChoiceButtonSize, string> = {
  compact: "min-h-[72px] rounded-[1.2rem] p-3 text-left sm:min-h-[88px] sm:p-4",
  default: "min-h-[96px] rounded-[1.4rem] p-4 text-left sm:min-h-[132px] sm:rounded-[1.7rem] sm:p-5",
  large: "min-h-[118px] rounded-[1.5rem] p-4 text-left sm:min-h-[180px] sm:rounded-[2rem] sm:p-6 sm:text-center",
};

export function AppChoiceButton({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  size = "default",
  className,
  style,
}: AppChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cn(
        "group flex w-full gap-3 border text-[#1f2119] shadow-[0_12px_26px_rgba(52,38,25,0.05)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] disabled:cursor-not-allowed disabled:opacity-55 sm:flex-col",
        selected
          ? "border-[#b8df71] bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(217,240,168,0.72))] shadow-[0_18px_38px_rgba(109,144,51,0.14)]"
          : "border-[#e3d9ce] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(247,243,239,0.86))] hover:-translate-y-0.5 hover:bg-white",
        sizeClasses[size],
        className
      )}
    >
      {icon ? (
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/78 text-[#4d6630] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.62)] sm:h-14 sm:w-14",
            size === "large" && "sm:mx-auto sm:h-[4.5rem] sm:w-[4.5rem]"
          )}
        >
          {icon}
        </span>
      ) : null}

      <span className="min-w-0">
        <span className="block text-base font-semibold leading-tight tracking-[-0.03em] sm:text-lg">
          {title}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-5 text-[#6b6259] sm:mt-2">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
