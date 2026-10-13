import * as React from "react";

import { cn } from "@/lib/utils";

type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  "aria-label": string;
  children: React.ReactNode;
  size?: IconButtonSize;
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

/** A labelled, keyboard-accessible control for one icon-only action. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ "aria-label": ariaLabel, className, size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

IconButton.displayName = "IconButton";
