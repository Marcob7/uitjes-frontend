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
    "border border-[#d9f1a6] bg-[#e8f2d0] text-[#162016] shadow-[0_14px_30px_rgba(91,121,42,0.14)] hover:bg-[#f1f7df]",
  secondary:
    "border border-[#ddd3c8] bg-white/78 text-[#2d2925] shadow-[0_12px_28px_rgba(52,38,25,0.06)] hover:bg-white",
  ghost:
    "border border-transparent bg-transparent text-[#3c392f] hover:bg-[#f4f0eb]",
  dark:
    "border border-[#181615] bg-[#181615] text-white shadow-[0_16px_34px_rgba(24,22,21,0.16)] hover:bg-[#2a2622]",
  subtle:
    "border border-[#ece5db] bg-[#f7f3ef] text-[#50443b] hover:bg-[#fbfaf7]",
  outline:
    "border border-[#d8cfc4] bg-transparent text-[#2d2925] hover:bg-white/70",
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
