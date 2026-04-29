"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { AppButton } from "./AppButton";

export type AppSearchSuggestion = {
  label: string;
  value?: string;
};

export type AppSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  suggestions?: AppSearchSuggestion[];
  onSuggestionSelect?: (suggestion: AppSearchSuggestion) => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
};

export function AppSearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Zoek op stad, festival of activiteit",
  suggestions = [],
  onSuggestionSelect,
  showSubmitButton = true,
  submitLabel = "Zoek",
  className,
  inputClassName,
  autoFocus,
}: AppSearchInputProps) {
  const hasSuggestions = suggestions.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "relative rounded-[24px] border border-[#ded5cb] bg-white/90 p-2 shadow-[0_18px_42px_rgba(52,38,25,0.08)] backdrop-blur sm:rounded-full",
        className
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex min-h-12 flex-1 items-center rounded-2xl px-4 sm:rounded-full">
          <span className="mr-3 text-lg text-[#756b61]" aria-hidden="true">
            &#8981;
          </span>
          <label htmlFor="app-search-input" className="sr-only">
            Zoeken
          </label>
          <input
            id="app-search-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            autoFocus={autoFocus}
            type="search"
            className={cn(
              "w-full bg-transparent text-base text-[#211d19] outline-none placeholder:text-[#9b9288] sm:text-sm",
              inputClassName
            )}
          />
        </div>

        {showSubmitButton ? (
          <AppButton type="submit" variant="primary" size="md" className="md:min-w-[6.5rem]">
            {submitLabel}
          </AppButton>
        ) : null}
      </div>

      {hasSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-[22px] border border-[#ded5cb] bg-white p-2 shadow-[0_20px_48px_rgba(52,38,25,0.12)]">
          <ul className="grid gap-1">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.label}-${suggestion.value ?? ""}`}>
                <button
                  type="button"
                  onMouseDown={() => onSuggestionSelect?.(suggestion)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-[#3c362f] transition hover:bg-[#f7f3ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
                >
                  <span>{suggestion.label}</span>
                  <span aria-hidden="true" className="text-current/55">
                    &rarr;
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
