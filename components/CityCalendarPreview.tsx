"use client";

type CityCalendarPreviewProps = {
  accentColor: string;
  accentTextColor: string;
  onDayClick: (day: number) => void;
};

const previewDays = [
  { day: 30, muted: true, label: "Mon" },
  { day: 1, label: "Tue" },
  { day: 2, label: "Wed" },
  { day: 3, label: "Thu" },
  { day: 4, label: "Fri" },
  { day: 5, label: "Sat" },
  { day: 6, label: "Sun" },
  { day: 7, label: "Mon" },
  { day: 8, label: "Tue" },
  { day: 9, label: "Wed", active: true },
  { day: 10, label: "Thu" },
  { day: 11, label: "Fri" },
  { day: 12, label: "Sat" },
  { day: 13, label: "Sun" },
];

function CalendarMiniCell({
  day,
  active = false,
  muted = false,
  accentColor,
  accentTextColor,
  onClick,
}: {
  day: number;
  active?: boolean;
  muted?: boolean;
  accentColor: string;
  accentTextColor: string;
  onClick?: () => void;
}) {
  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex aspect-square items-center justify-center"
      >
        <div
          className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl shadow-sm transition hover:scale-[1.03] sm:h-20 sm:w-20"
          style={{
            backgroundColor: accentColor,
            color: accentTextColor,
          }}
        >
          <span className="text-lg font-semibold">{day}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em]">
            Today
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={muted ? undefined : onClick}
      disabled={muted}
      className="flex aspect-square items-center justify-center"
    >
      <div
        className={[
          "flex h-16 w-16 items-center justify-center rounded-2xl text-base font-medium transition sm:h-20 sm:w-20",
          muted
            ? "cursor-default text-slate-300"
            : "text-slate-800 hover:scale-[1.03] hover:shadow-sm",
        ].join(" ")}
        style={{
          backgroundColor: muted ? "transparent" : "#f4e7df",
        }}
      >
        {day}
      </div>
    </button>
  );
}

export default function CityCalendarPreview({
  accentColor,
  accentTextColor,
  onDayClick,
}: CityCalendarPreviewProps) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
            October 2024
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kies een dag om de volledige agenda te openen
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Vorige"
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Volgende"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] bg-transparent">
        <div className="grid grid-cols-7 gap-y-4 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-3 sm:gap-5">
          {previewDays.map((item) => (
            <CalendarMiniCell
              key={`${item.label}-${item.day}`}
              day={item.day}
              active={item.active}
              muted={item.muted}
              accentColor={accentColor}
              accentTextColor={accentTextColor}
              onClick={() => onDayClick(item.day)}
            />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Klik op een specifieke dag
        </p>
      </div>
    </section>
  );
}