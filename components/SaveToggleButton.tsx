"use client";

import type { MouseEventHandler, ReactNode } from "react";

export type SaveToggleButtonProps = {
  saved: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className: string;
  savedClassName?: string;
  children: ReactNode;
  savedChildren?: ReactNode;
};

/**
 * Presentational save control. Adapters own all persistence, auth and feedback.
 */
export default function SaveToggleButton({
  saved,
  disabled = false,
  ariaLabel,
  onClick,
  className,
  savedClassName,
  children,
  savedChildren,
}: SaveToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={saved}
      aria-label={ariaLabel}
      className={saved ? savedClassName ?? className : className}
    >
      {saved ? savedChildren ?? children : children}
    </button>
  );
}
