import type { ReactNode } from "react";

export type PageEyebrowProps = {
  children: ReactNode;
};

/** A passive context label for pages that use the shared form-page treatment. */
export function PageEyebrow({ children }: PageEyebrowProps) {
  return (
    <div className="inline-flex rounded-2xl bg-[#eef5df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#50672f] sm:rounded-full">
      {children}
    </div>
  );
}
