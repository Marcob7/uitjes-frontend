import * as React from "react";

import { cn } from "@/lib/utils";

type AppPageHeaderAlign = "left" | "center";

export type AppPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: AppPageHeaderAlign;
  className?: string;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: AppPageHeaderProps) {
  const isCenter = align === "center";

  return (
    <header
      className={cn(
        "py-4",
        isCenter && "mx-auto max-w-4xl text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em] text-[#7b6f64]",
            isCenter && "mx-auto"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "mt-3 max-w-[13ch] text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#171511]",
          isCenter && "mx-auto"
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-[42rem] text-base leading-7 text-[#665d54] sm:text-lg sm:leading-8",
            isCenter && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
      {actions ? (
        <div
          className={cn(
            "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
            isCenter && "items-stretch justify-center sm:items-center"
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
