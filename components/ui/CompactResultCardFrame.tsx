import type { ReactNode } from "react";

type CompactResultCardFrameProps = {
  children: ReactNode;
  action?: ReactNode;
  variant?: "default" | "flow";
  isSelected?: boolean;
  className?: string;
  onMouseEnter?: () => void;
};

/**
 * Shared structural shell for the compact cards used in discovery and search.
 * Content remains feature-owned, while spacing, borders and the action column
 * stay consistent wherever this card family appears.
 */
export default function CompactResultCardFrame({
  children,
  action,
  variant = "flow",
  isSelected = false,
  className = "",
  onMouseEnter,
}: CompactResultCardFrameProps) {
  const isFlowVariant = variant === "flow";

  return (
    <article
      onMouseEnter={onMouseEnter}
      className={`group relative ${
        isFlowVariant
          ? "overflow-hidden rounded-[1.35rem] border border-[#DCE1DC] bg-[#fffefb] shadow-[0_10px_26px_rgba(41,52,47,0.045)]"
          : `border-b border-[#DCE1DC] last:border-b-0 ${isSelected ? "bg-white/72" : "bg-transparent"}`
      } ${className}`}
    >
      <div
        className={`transition ${
          isFlowVariant
            ? "px-4 py-4 hover:bg-[#fbfcf8] sm:px-5 sm:py-5"
            : "py-4 sm:px-3 sm:hover:bg-white/70"
        }`}
      >
        <div className="min-w-0">{children}</div>
        {action ? (
          <div className="mt-4 flex min-h-10 items-center justify-between gap-3 border-t border-[#E7EAE5] pt-3">
            {action}
          </div>
        ) : null}
      </div>
    </article>
  );
}
