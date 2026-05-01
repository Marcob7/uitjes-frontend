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
    "border border-white/14 bg-white/10 text-white shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-xl",
  elevated:
    "border border-white/18 bg-white/12 text-white shadow-[0_28px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl",
  soft:
    "border border-white/12 bg-white/8 text-white shadow-[0_16px_34px_rgba(0,0,0,0.14)] backdrop-blur-xl",
  glass:
    "border border-white/16 bg-white/10 text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl",
  interactive:
    "border border-white/14 bg-white/10 text-white shadow-[0_18px_42px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/14 hover:shadow-[0_24px_54px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]",
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
