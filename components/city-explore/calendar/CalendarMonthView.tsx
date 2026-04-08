"use client";

import { useMemo } from "react";
import { WEEKDAY_NAMES } from "../data";
import type { CalendarEvent } from "../types";
import {
  formatDateKey,
  getMonthGrid,
  isSameMonth,
} from "../utils";
import CalendarEventPill from "./CalendarEventPill";

type CalendarMonthViewProps = {
  currentDate: Date;
  events: CalendarEvent[];
};

export default function CalendarMonthView({
  currentDate,
  events,
}: CalendarMonthViewProps) {
  const cells = getMonthGrid(currentDate);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }

    return map;
  }, [events]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ECE6DD] bg-white">
      <div className="grid grid-cols-7 border-b border-[#F0EBE4]">
        {WEEKDAY_NAMES.map((day) => (
          <div
            key={day}
            className="px-4 py-4 text-center text-[11px] font-medium tracking-[0.12em] text-[#918B83]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((date, index) => {
          const dateKey = formatDateKey(date);
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const inCurrentMonth = isSameMonth(date, currentDate);

          return (
            <div
              key={`${dateKey}-${index}`}
              className={`min-h-[140px] border-r border-b border-[#F0EBE4] p-3 ${
                !inCurrentMonth ? "bg-[#F7F4F0] text-[#B2ACA4]" : "bg-white"
              }`}
            >
              <div className="text-[14px] font-medium">{date.getDate()}</div>

              <div className="mt-3 space-y-2">
                {dayEvents.slice(0, 2).map((event) => (
                  <CalendarEventPill key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}