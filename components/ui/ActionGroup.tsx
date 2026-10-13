import * as React from "react";

import { cn } from "@/lib/utils";

type ActionGroupAlign = "start" | "center" | "end" | "between";

export type ActionGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: ActionGroupAlign;
};

const alignmentClasses: Record<ActionGroupAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/** Groups related actions without assigning a product-specific visual treatment. */
export function ActionGroup({ className, align = "start", ...props }: ActionGroupProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", alignmentClasses[align], className)}
      {...props}
    />
  );
}
