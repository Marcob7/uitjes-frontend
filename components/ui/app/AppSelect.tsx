"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type AppSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type AppSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  options: readonly AppSelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
};

/** A native select with an optional, correctly associated label and field message. */
export const AppSelect = React.forwardRef<HTMLSelectElement, AppSelectProps>(
  (
    {
      id,
      name,
      label,
      hint,
      error,
      options,
      placeholder,
      className,
      wrapperClassName,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? name;
    const hintId = selectId ? `${selectId}-hint` : undefined;
    const errorId = selectId ? `${selectId}-error` : undefined;

    return (
      <div className={cn("grid gap-2", wrapperClassName)}>
        {label ? (
          <label htmlFor={selectId} className="text-sm font-semibold text-[#27231f]">
            {label}
            {required ? <span className="text-[#9b3c2e]"> *</span> : null}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "min-h-12 w-full rounded-2xl border border-[#ded5cb] bg-white/86 px-4 text-base text-[#211d19] shadow-[0_10px_24px_rgba(52,38,25,0.04)] outline-none transition focus:border-[#9cc84e] focus:bg-white focus:ring-4 focus:ring-[#d9f1a6]/45 disabled:bg-[#f1ede8] disabled:text-[#8c8379] sm:text-sm",
            error && "border-[#d98a7d] focus:border-[#c34f3f] focus:ring-[#f5c7bf]/50",
            className
          )}
          {...props}
        >
          {placeholder ? <option value="" disabled>{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error ? <p id={hintId} className="text-xs leading-5 text-[#71675d]">{hint}</p> : null}
        {error ? <p id={errorId} role="alert" className="text-xs font-medium leading-5 text-[#9b3c2e]">{error}</p> : null}
      </div>
    );
  }
);

AppSelect.displayName = "AppSelect";
