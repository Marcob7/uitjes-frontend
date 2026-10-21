import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerSize = "narrow" | "standard";

export type PageContainerProps = {
  children: ReactNode;
  className?: string;
  size?: PageContainerSize;
};

const sizeClasses: Record<PageContainerSize, string> = {
  narrow: "max-w-3xl",
  standard: "max-w-5xl",
};

export function PageContainer({
  children,
  className,
  size = "standard",
}: PageContainerProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className={cn("mx-auto w-full", sizeClasses[size], className)}>
        {children}
      </div>
    </div>
  );
}
