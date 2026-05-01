"use client";

import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type AppButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "dark"
  | "subtle"
  | "outline";

type AppButtonSize = "sm" | "md" | "lg";

export type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
};

const variantClasses: Record<AppButtonVariant, string> = {
  primary:
    "border border-[#e8f2d0]/65 bg-[#e8f2d0] text-[#162016] shadow-[0_18px_36px_rgba(12,20,12,0.18)] hover:bg-[#f1f7df]",
  secondary:
    "border border-white/18 bg-white/10 text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/14",
  ghost:
    "border border-white/18 bg-white/10 text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/14",
  dark:
    "border border-white/12 bg-[#07131a]/78 text-white shadow-[0_20px_44px_rgba(0,0,0,0.22)] backdrop-blur-md hover:bg-[#0f4950]/70",
  subtle:
    "border border-white/14 bg-white/8 text-white/88 backdrop-blur-md hover:bg-white/12",
  outline:
    "border border-white/20 bg-transparent text-white hover:bg-white/10",
};

const sizeClasses: Record<AppButtonSize, string> = {
  sm: "min-h-10 rounded-xl px-4 py-2 text-sm sm:rounded-full",
  md: "min-h-11 rounded-2xl px-5 py-2.5 text-sm sm:rounded-full",
  lg: "min-h-12 rounded-2xl px-6 py-3 text-sm sm:min-h-14 sm:rounded-full",
};

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      fullWidth = false,
      children,
      type = "button",
      disabled,
      href,
      onClick,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2.5 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] disabled:cursor-not-allowed disabled:opacity-55",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      disabled && "pointer-events-none opacity-55",
      className
    );

    const content = (
      <>
        {iconLeft ? <span className="inline-flex shrink-0">{iconLeft}</span> : null}
        <span className="min-w-0">{children}</span>
        {iconRight ? <span className="inline-flex shrink-0">{iconRight}</span> : null}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          className={classes}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
