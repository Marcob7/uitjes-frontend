import type { CalendarView } from "../types";

type CalendarViewButtonProps = {
  active: boolean;
  label: CalendarView;
  onClick: () => void;
};

export default function CalendarViewButton({
  active,
  label,
  onClick,
}: CalendarViewButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#B9DE84] text-[#223018]"
          : "text-[#5E5953] hover:bg-white/60"
      }`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </button>
  );
}