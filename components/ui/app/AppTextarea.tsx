"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type AppTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  showRequiredIndicator?: boolean;
};

/** A multiline field with an optional, correctly associated label and field message. */
export const AppTextarea = React.forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  (
    {
      id,
      name,
      label,
      hint,
      error,
      className,
      wrapperClassName,
      labelClassName,
      hintClassName,
      showRequiredIndicator = true,
      required,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? name;
    const hintId = textareaId ? `${textareaId}-helper` : undefined;
    const errorId = textareaId ? `${textareaId}-error` : undefined;

    return (
      <div className={cn("grid gap-2", wrapperClassName)}>
        {label ? (
          <label
            htmlFor={textareaId}
            className={cn("text-sm font-semibold text-[#27231f]", labelClassName)}
          >
            {label}
            {required && showRequiredIndicator ? <span className="text-[#9b3c2e]"> *</span> : null}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "min-h-32 w-full rounded-2xl border border-[#ded5cb] bg-white/86 px-4 py-3 text-base text-[#211d19] shadow-[0_10px_24px_rgba(52,38,25,0.04)] outline-none transition placeholder:text-[#9b9288] focus:border-[#9cc84e] focus:bg-white focus:ring-4 focus:ring-[#d9f1a6]/45 disabled:bg-[#f1ede8] disabled:text-[#8c8379] sm:text-sm",
            error && "border-[#d98a7d] focus:border-[#c34f3f] focus:ring-[#f5c7bf]/50",
            className
          )}
          {...props}
        />

        {hint && !error ? (
          <p id={hintId} className={cn("text-xs leading-5 text-[#71675d]", hintClassName)}>
            {hint}
          </p>
        ) : null}

        {error ? (
          <p id={errorId} role="alert" className="text-xs font-medium leading-5 text-[#9b3c2e]">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

AppTextarea.displayName = "AppTextarea";
