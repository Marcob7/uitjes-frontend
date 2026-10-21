import type { ReactNode } from "react";

type SearchErrorStateProps = {
  headingId: string;
  title: string;
  description: string;
  action: ReactNode;
};

/** Shared presentation for the two search error surfaces; callers own recovery. */
export default function SearchErrorState({
  headingId,
  title,
  description,
  action,
}: SearchErrorStateProps) {
  return (
    <div className="search-empty-state max-w-2xl" role="alert" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.055em] text-[#22312a]"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746d] sm:text-base">
        {description}
      </p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
