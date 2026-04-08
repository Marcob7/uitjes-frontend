import type { CalendarEvent } from "../types";
import { getColorClasses } from "../utils";

type CalendarEventPillProps = {
  event: CalendarEvent;
};

export default function CalendarEventPill({
  event,
}: CalendarEventPillProps) {
  return (
    <div
      className={`rounded-[18px] px-3 py-2 text-[11px] leading-[1.15] ${getColorClasses(
        event.color
      )}`}
    >
      <div className="mb-1 text-[9px] uppercase tracking-[0.12em] opacity-70">
        {event.category}
      </div>
      <div className="font-medium">{event.title}</div>
    </div>
  );
}