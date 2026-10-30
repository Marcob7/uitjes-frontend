import type { ReactNode } from "react";

type CompactResultCardFrameProps = {
  children: ReactNode;
  action?: ReactNode;
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
  className = "",
  onMouseEnter,
}: CompactResultCardFrameProps) {
  return (
    <article
      onMouseEnter={onMouseEnter}
      className={`group relative overflow-hidden rounded-[1.35rem] border border-[#DCE1DC] bg-[#fffefb] shadow-[0_10px_26px_rgba(41,52,47,0.045)] ${className}`}
    >
      <div className="transition px-4 py-4 hover:bg-[#fbfcf8] sm:px-5 sm:py-5">
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
