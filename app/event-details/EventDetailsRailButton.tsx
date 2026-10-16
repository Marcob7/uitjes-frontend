import { ArrowIcon } from "./EventDetailsIcons";

export type EventDetailsRailDirection = "left" | "right";

type EventDetailsRailButtonProps = {
  label: string;
  direction: EventDetailsRailDirection;
  onClick: () => void;
};

export function EventDetailsRailButton({
  label,
  direction,
  onClick,
}: EventDetailsRailButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#bdc6b9] bg-[#f7f5ee] text-[#263329] transition hover:border-[#263329] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-2 active:scale-95"
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}
