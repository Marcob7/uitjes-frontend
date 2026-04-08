import { MONTH_NAMES } from "../data";
import type { CalendarEvent } from "../types";

type CalendarYearViewProps = {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectMonth: (monthIndex: number) => void;
};

export default function CalendarYearView({
  currentDate,
  events,
  onSelectMonth,
}: CalendarYearViewProps) {
  const year = currentDate.getFullYear();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {MONTH_NAMES.map((month, monthIndex) => {
        const count = events.filter((event) => {
          const date = new Date(event.date);
          return date.getFullYear() === year && date.getMonth() === monthIndex;
        }).length;

        const isActive = monthIndex === currentDate.getMonth();

        return (
          <button
            key={month}
            type="button"
            onClick={() => onSelectMonth(monthIndex)}
            className={`rounded-[1.5rem] border p-5 text-left transition ${
              isActive
                ? "border-[#B8DD8D] bg-[#EEF6E3]"
                : "border-[#ECE6DD] bg-white hover:bg-[#FBF9F6]"
            }`}
          >
            <div className="text-[22px] font-semibold tracking-[-0.02em] text-[#171717]">
              {month}
            </div>
            <div className="mt-2 text-[14px] text-[#7B756E]">
              {count} {count === 1 ? "event" : "events"}
            </div>
          </button>
        );
      })}
    </div>
  );
}