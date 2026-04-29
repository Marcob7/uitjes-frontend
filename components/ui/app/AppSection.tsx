import * as React from "react";

import { cn } from "@/lib/utils";

type AppSectionMaxWidth = "default" | "narrow" | "wide" | "full";
type AppSectionSpacing = "sm" | "md" | "lg";
type AppSectionBackground = "transparent" | "page" | "soft" | "white";

export type AppSectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  maxWidth?: AppSectionMaxWidth;
  spacing?: AppSectionSpacing;
  background?: AppSectionBackground;
  id?: string;
};

const maxWidthClasses: Record<AppSectionMaxWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-[1220px]",
  wide: "max-w-[1280px]",
  full: "max-w-none",
};

const spacingClasses: Record<AppSectionSpacing, string> = {
  sm: "py-6 sm:py-8",
  md: "py-8 sm:py-12",
  lg: "py-12 sm:py-16 lg:py-20",
};

const backgroundClasses: Record<AppSectionBackground, string> = {
  transparent: "bg-transparent",
  page: "bg-[#fbf8f3]",
  soft: "bg-[#f7f3ef]",
  white: "bg-white",
};

export function AppSection({
  children,
  className,
  innerClassName,
  maxWidth = "default",
  spacing = "md",
  background = "transparent",
  id,
}: AppSectionProps) {
  return (
    <section id={id} className={cn(backgroundClasses[background], className)}>
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          maxWidthClasses[maxWidth],
          spacingClasses[spacing],
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
