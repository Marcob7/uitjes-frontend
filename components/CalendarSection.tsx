"use client";

import { useMemo, useState } from "react";

type CalendarView = "dag" | "week" | "maand" | "jaar";

type CalendarEvent = {
  id: number;
  title: string;
  category: string;
  city: string;
  date: string; // yyyy-mm-dd
  time?: string;
  color: "green" | "purple" | "sand";
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"];

const dummyEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Vermeer at Mauritshuis",
    category: "Kunst",
    city: "Den Haag",
    date: "2024-10-03",
    time: "14:00",
    color: "green",
  },
  {
    id: 2,
    title: "Jazz Nights at Paard",
    category: "Muziek",
    city: "Den Haag",
    date: "2024-10-11",
    time: "20:30",
    color: "purple",
  },
  {
    id: 3,
    title: "Symphony at the Sea",
    category: "Muziek",
    city: "Den Haag",
    date: "2024-10-23",
    time: "19:30",
    color: "green",
  },
  {
    id: 4,
    title: "Culinary Night Market",
    category: "Culinair",
    city: "Den Haag",
    date: "2024-10-17",
    time: "18:00",
    color: "sand",
  },
  {
    id: 5,
    title: "Theater aan Zee",
    category: "Theater",
    city: "Den Haag",
    date: "2024-10-26",
    time: "20:00",
    color: "purple",
  },
];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameMonth(date: Date, currentDate: Date) {
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
}

function getMonthGrid(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();

  const cells: Date[] = [];

  for (let i = startDay; i > 0; i--) {
    cells.push(new Date(year, month, 1 - i));
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - (startDay + totalDays) + 1;
    cells.push(new Date(year, month + 1, nextDay));
  }

  return cells;
}

function getWeekDates(currentDate: Date) {
  const dayIndex = (currentDate.getDay() + 6) % 7;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - dayIndex);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function getColorClasses(color: CalendarEvent["color"]) {
  switch (color) {
    case "green":
      return "bg-[#CFE8BF] text-[#1F2A17]";
    case "purple":
      return "bg-[#DEDCEF] text-[#1E1E25]";
    case "sand":
      return "bg-[#EEDFCF] text-[#2D241C]";
    default:
      return "bg-[#CFE8BF] text-[#1F2A17]";
  }
}

function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={`rounded-[20px] px-3 py-2 text-[11px] leading-[1.15] ${getColorClasses(
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

function MonthView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: CalendarEvent[];
}) {
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
    <div className="overflow-hidden rounded-[32px] border border-[#ECE6DD] bg-white">
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
              className={`min-h-[160px] border-r border-b border-[#F0EBE4] p-3 ${
                !inCurrentMonth ? "bg-[#F6F3EF] text-[#B2ACA4]" : "bg-white"
              }`}
            >
              <div className="text-[14px] font-medium">{date.getDate()}</div>

              <div className="mt-3 space-y-2">
                {dayEvents.slice(0, 2).map((event) => (
                  <EventPill key={event.id} event={event} />
                ))}

                {dayEvents.length > 2 ? (
                  <div className="text-[11px] text-[#7B756E]">
                    +{dayEvents.length - 2} meer
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: CalendarEvent[];
}) {
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#ECE6DD] bg-white">
      <div className="grid grid-cols-7">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          const dayEvents = events.filter((event) => event.date === dateKey);

          return (
            <div
              key={dateKey}
              className="min-h-[240px] border-r border-[#F0EBE4] p-4 last:border-r-0"
            >
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#918B83]">
                {WEEKDAY_NAMES[(date.getDay() + 6) % 7]}
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[#171717]">
                {date.getDate()}
              </div>

              <div className="mt-4 space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="text-[13px] text-[#AAA39A]">
                    Geen events
                  </div>
                ) : (
                  dayEvents.map((event) => <EventPill key={event.id} event={event} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: CalendarEvent[];
}) {
  const dateKey = formatDateKey(currentDate);
  const dayEvents = events.filter((event) => event.date === dateKey);

  return (
    <div className="rounded-[32px] border border-[#ECE6DD] bg-white p-6">
      <div className="mb-6">
        <div className="text-[12px] uppercase tracking-[0.14em] text-[#918B83]">
          Dagoverzicht
        </div>
        <div className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#171717]">
          {currentDate.getDate()} {MONTH_NAMES[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </div>
      </div>

      <div className="space-y-4">
        {dayEvents.length === 0 ? (
          <div className="rounded-[24px] bg-[#F7F4F0] p-5 text-[15px] text-[#7B756E]">
            Geen events op deze dag.
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-[24px] border border-[#ECE6DD] bg-[#FCFBF9] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A847C]">
                    {event.category}
                  </div>
                  <h3 className="mt-2 text-[24px] font-semibold text-[#171717]">
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

function YearView({
  currentDate,
  events,
  onSelectMonth,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectMonth: (monthIndex: number) => void;
}) {
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
            className={`rounded-[28px] border p-5 text-left transition ${
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

export default function CalendarSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [view, setView] = useState<CalendarView>("maand");
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1));

  const title = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  function goPrevious() {
    const next = new Date(currentDate);

    if (view === "dag") next.setDate(next.getDate() - 1);
    if (view === "week") next.setDate(next.getDate() - 7);
    if (view === "maand") next.setMonth(next.getMonth() - 1);
    if (view === "jaar") next.setFullYear(next.getFullYear() - 1);

    setCurrentDate(next);
  }

  function goNext() {
    const next = new Date(currentDate);

    if (view === "dag") next.setDate(next.getDate() + 1);
    if (view === "week") next.setDate(next.getDate() + 7);
    if (view === "maand") next.setMonth(next.getMonth() + 1);
    if (view === "jaar") next.setFullYear(next.getFullYear() + 1);

    setCurrentDate(next);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[48px] font-semibold tracking-[-0.06em] text-[#171717] md:text-[64px]">
            Den Haag <span className="text-[#B8B5B0]">Agenda</span>
          </h2>
          <p className="mt-3 max-w-[560px] text-[20px] leading-8 text-[#5E5953]">
            Ontdek de meest curator-waardige culturele momenten in de stad aan de zee voor de maand Oktober.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-[#F1E5DA] p-1">
            {(["dag", "week", "maand", "jaar"] as CalendarView[]).map((item) => {
              const active = view === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  className={`rounded-full px-6 py-3 text-[14px] font-medium transition ${
                    active
                      ? "bg-[#B9DE84] text-[#223018]"
                      : "text-[#5E5953] hover:bg-white/50"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-[14px] font-medium text-[#171717] transition hover:bg-[#F7F3EE]"
          >
            {isExpanded ? "Kalender inklappen" : "Kalender uitklappen"}
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-[#DDEED1] px-5 py-3 text-[14px] font-medium text-[#1F2A17]">
            Den Haag
          </button>
          <button className="rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-[14px] text-[#171717]">
            Alle categorieën
          </button>
          <button className="rounded-full bg-[#171717] px-5 py-3 text-[14px] text-white">
            Kunst
          </button>
          <button className="rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-[14px] text-[#171717]">
            Muziek
          </button>
          <button className="rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-[14px] text-[#171717]">
            Theater
          </button>
          <button className="rounded-full border border-[#DDD5CC] bg-white px-5 py-3 text-[14px] text-[#171717]">
            Culinair
          </button>
        </div>

        <button className="self-start text-[14px] font-medium text-[#171717] underline underline-offset-4">
          Filters
        </button>
      </div>

      {isExpanded ? (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-[38px] font-semibold tracking-[-0.05em] text-[#171717]">
                {view === "jaar" ? currentDate.getFullYear() : title}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevious}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD5CC] bg-white text-[18px] text-[#171717] transition hover:bg-[#F7F3EE]"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD5CC] bg-white text-[18px] text-[#171717] transition hover:bg-[#F7F3EE]"
                >
                  ›
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={goToToday}
              className="text-[14px] font-medium text-[#5E5953] underline underline-offset-4"
            >
              Ga naar vandaag
            </button>
          </div>

          {view === "dag" && (
            <DayView currentDate={currentDate} events={dummyEvents} />
          )}

          {view === "week" && (
            <WeekView currentDate={currentDate} events={dummyEvents} />
          )}

          {view === "maand" && (
            <MonthView currentDate={currentDate} events={dummyEvents} />
          )}

          {view === "jaar" && (
            <YearView
              currentDate={currentDate}
              events={dummyEvents}
              onSelectMonth={(monthIndex) => {
                const next = new Date(currentDate);
                next.setMonth(monthIndex);
                setCurrentDate(next);
                setView("maand");
              }}
            />
          )}
        </>
      ) : (
        <div className="rounded-[32px] border border-[#ECE6DD] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#918B83]">
                Kalender ingeklapt
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[#171717]">
                {view === "jaar" ? currentDate.getFullYear() : title}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="rounded-full bg-[#B9DE84] px-5 py-3 text-[14px] font-medium text-[#223018]"
            >
              Open kalender
            </button>
          </div>
        </div>
      )}
    </section>
  );
}