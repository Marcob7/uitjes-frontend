import * as React from "react";

import { cn } from "@/lib/utils";

type AppCardVariant = "default" | "elevated" | "soft" | "glass" | "interactive";
type AppCardPadding = "sm" | "md" | "lg";

type AppCardProps<T extends React.ElementType = "div"> = {
  as?: T;
  variant?: AppCardVariant;
  padding?: AppCardPadding;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const variantClasses: Record<AppCardVariant, string> = {
  default:
    "border border-[#e7dfd6] bg-white text-[#171511] shadow-[0_14px_34px_rgba(52,38,25,0.05)]",
  elevated:
    "border border-white/70 bg-white text-[#171511] shadow-[0_24px_60px_rgba(52,38,25,0.09)]",
  soft:
    "border border-[#eee4da] bg-[#f7f3ef] text-[#171511] shadow-[0_12px_28px_rgba(52,38,25,0.04)]",
  glass:
    "border border-white/60 bg-white/72 text-[#171511] shadow-[0_18px_42px_rgba(52,38,25,0.07)] backdrop-blur-xl",
  interactive:
    "border border-[#e7dfd6] bg-[#fbf8f4] text-[#171511] shadow-[0_18px_42px_rgba(52,38,25,0.05)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_54px_rgba(52,38,25,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]",
};

const paddingClasses: Record<AppCardPadding, string> = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function AppCard<T extends React.ElementType = "div">({
  as,
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: AppCardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "rounded-[1.6rem] sm:rounded-[2rem]",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
