import * as React from "react";

import { cn } from "@/lib/utils";

export type FilterButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value"
> & {
  label: React.ReactNode;
  value?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  count?: number;
  children?: React.ReactNode;
};

/** A labelled filter trigger; feature code keeps the filter state and modal behaviour. */
export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    { label, value, leadingIcon, trailingIcon, count, className, children, type = "button", ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      {...props}
    >
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block">{label}</span>
        {value ? <span className="mt-1 block truncate">{value}</span> : null}
        {children}
      </span>
      {count && count > 0 ? <span aria-hidden="true">{count}</span> : null}
      {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
    </button>
  )
);

FilterButton.displayName = "FilterButton";
