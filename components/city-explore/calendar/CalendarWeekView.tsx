import type { CalendarEvent } from "../types";
import { WEEKDAY_NAMES } from "../data";
import { formatDateKey, getWeekDates } from "../utils";
import CalendarEventPill from "./CalendarEventPill";

type CalendarWeekViewProps = {
  currentDate: Date;
  events: CalendarEvent[];
};

export default function CalendarWeekView({
  currentDate,
  events,
}: CalendarWeekViewProps) {
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ECE6DD] bg-white">
      <div className="grid grid-cols-7">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          const dayEvents = events.filter((event) => event.date === dateKey);

          return (
            <div
              key={dateKey}
              className="min-h-[220px] border-r border-[#F0EBE4] p-4 last:border-r-0"
            >
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#918B83]">
                {WEEKDAY_NAMES[(date.getDay() + 6) % 7]}
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[#171717]">
                {date.getDate()}
              </div>

              <div className="mt-4 space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="text-[13px] text-[#AAA39A]">Geen events</div>
                ) : (
                  dayEvents.map((event) => (
                    <CalendarEventPill key={event.id} event={event} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}