"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type AppInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
};

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      id,
      label,
      error,
      hint,
      className,
      wrapperClassName,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? props.name;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className={cn("grid gap-2", wrapperClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[#27231f]"
          >
            {label}
            {required ? <span className="text-[#9b3c2e]"> *</span> : null}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? helperId : undefined}
          className={cn(
            "min-h-12 w-full rounded-2xl border border-[#ded5cb] bg-white/86 px-4 text-base text-[#211d19] shadow-[0_10px_24px_rgba(52,38,25,0.04)] outline-none transition placeholder:text-[#9b9288] focus:border-[#9cc84e] focus:bg-white focus:ring-4 focus:ring-[#d9f1a6]/45 disabled:bg-[#f1ede8] disabled:text-[#8c8379] sm:text-sm",
            error && "border-[#d98a7d] focus:border-[#c34f3f] focus:ring-[#f5c7bf]/50",
            className
          )}
          {...props}
        />

        {hint && !error ? (
          <p id={helperId} className="text-xs leading-5 text-[#71675d]">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium leading-5 text-[#9b3c2e]"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";
