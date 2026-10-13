import * as React from "react";

import { cn } from "@/lib/utils";

export type DialogShellProps = React.HTMLAttributes<HTMLDivElement> & {
  labelledBy: string;
  describedBy?: string;
};

/** Structural dialog semantics; focus and open state intentionally remain feature-owned. */
export const DialogShell = React.forwardRef<HTMLDivElement, DialogShellProps>(
  ({ labelledBy, describedBy, className, ...props }, ref) => (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={-1}
      className={cn(className)}
      {...props}
    />
  )
);

DialogShell.displayName = "DialogShell";
