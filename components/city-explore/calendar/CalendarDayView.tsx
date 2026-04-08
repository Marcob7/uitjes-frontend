import { MONTH_NAMES } from "../data";
import type { CalendarEvent } from "../types";
import { formatDateKey, getColorClasses } from "../utils";

type CalendarDayViewProps = {
  currentDate: Date;
  events: CalendarEvent[];
};

export default function CalendarDayView({
  currentDate,
  events,
}: CalendarDayViewProps) {
  const dateKey = formatDateKey(currentDate);
  const dayEvents = events.filter((event) => event.date === dateKey);

  return (
    <div className="rounded-[2rem] border border-[#ECE6DD] bg-white p-6">
      <div className="mb-6">
        <div className="text-[12px] uppercase tracking-[0.14em] text-[#918B83]">
          Dagoverzicht
        </div>
        <div className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#171717]">
          {currentDate.getDate()} {MONTH_NAMES[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </div>
      </div>

      <div className="space-y-4">
        {dayEvents.length === 0 ? (
          <div className="rounded-[1.5rem] bg-[#F7F4F0] p-5 text-[15px] text-[#7B756E]">
            Geen events op deze dag.
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-[1.5rem] border border-[#ECE6DD] bg-[#FCFBF9] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A847C]">
                    {event.category}
                  </div>
                  <h3 className="mt-2 text-[22px] font-semibold text-[#171717]">
                    {event.title}
                  </h3>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-[12px] font-medium ${getColorClasses(
                    event.color
                  )}`}
                >
                  {event.time ?? "Hele dag"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}