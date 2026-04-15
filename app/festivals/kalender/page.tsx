import Link from "next/link";

import { optimizeCssBackground } from "@/lib/remoteImage";
import { getFestivalDetailHref } from "../data";

type CalendarTone = "lime" | "pink" | "blue" | "amber" | "violet";

type CalendarEvent = {
  label: string;
  tone: CalendarTone;
  href?: string;
};

type CalendarCell = {
  key: string;
  dayNumber: string;
  muted?: boolean;
  events?: CalendarEvent[];
};

type HighlightCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  tone: "lavender" | "butter";
};

const weekdayLabels = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"];

const calendarCells: CalendarCell[] = [
  { key: "prev-24", dayNumber: "24", muted: true },
  { key: "prev-25", dayNumber: "25", muted: true },
  { key: "prev-26", dayNumber: "26", muted: true },
  { key: "prev-27", dayNumber: "27", muted: true },
  { key: "prev-28", dayNumber: "28", muted: true },
  { key: "prev-29", dayNumber: "29", muted: true },
  { key: "prev-30", dayNumber: "30", muted: true },
  {
    key: "day-1",
    dayNumber: "1",
    events: [
      {
        label: "North Sea Jazz",
        tone: "lime",
        href: getFestivalDetailHref("north-sea-jazz"),
      },
    ],
  },
  { key: "day-2", dayNumber: "2" },
  {
    key: "day-3",
    dayNumber: "3",
    events: [{ label: "Vondelpark Openlucht", tone: "pink" }],
  },
  { key: "day-4", dayNumber: "4" },
  {
    key: "day-5",
    dayNumber: "5",
    events: [
      { label: "Down The Rabbit Hole", tone: "violet" },
      { label: "Gentle Giant Expo", tone: "blue" },
    ],
  },
  {
    key: "day-6",
    dayNumber: "6",
    events: [
      { label: "Awakenings Summer", tone: "pink" },
      { label: "Bospop Week", tone: "pink" },
      { label: "+4 more", tone: "lime" },
    ],
  },
  {
    key: "day-7",
    dayNumber: "7",
    events: [{ label: "Awakenings Final", tone: "pink" }],
  },
  { key: "day-8", dayNumber: "8" },
  {
    key: "day-9",
    dayNumber: "9",
    events: [{ label: "Gouden Carolus Food", tone: "amber" }],
  },
  { key: "day-10", dayNumber: "10" },
  { key: "day-11", dayNumber: "11" },
  {
    key: "day-12",
    dayNumber: "12",
    events: [
      {
        label: "Dekmantel Festival",
        tone: "pink",
        href: getFestivalDetailHref("dekmantel-festival"),
      },
    ],
  },
  {
    key: "day-13",
    dayNumber: "13",
    events: [
      { label: "Wildeburg Day 2", tone: "pink" },
      { label: "Theater aan Zee", tone: "violet" },
    ],
  },
  { key: "day-14", dayNumber: "14" },
  { key: "day-15", dayNumber: "15" },
  {
    key: "day-16",
    dayNumber: "16",
    events: [{ label: "Vierdaagsefeesten", tone: "lime" }],
  },
  {
    key: "day-17",
    dayNumber: "17",
    events: [{ label: "Vierdaagsefeesten", tone: "lime" }],
  },
  {
    key: "day-18",
    dayNumber: "18",
    events: [
      { label: "Zwarte Cross", tone: "pink" },
      { label: "Vierdaagsefeesten", tone: "lime" },
    ],
  },
  {
    key: "day-19",
    dayNumber: "19",
    events: [
      { label: "Zwarte Cross", tone: "pink" },
      { label: "Welcome to the Village", tone: "pink" },
    ],
  },
  {
    key: "day-20",
    dayNumber: "20",
    events: [
      { label: "Zwarte Cross Final", tone: "pink" },
      { label: "+2 more", tone: "lime" },
    ],
  },
  { key: "day-21", dayNumber: "21" },
];

const highlightCards: HighlightCard[] = [
  {
    title: "Jazz & Blues",
    description:
      "Rotterdam transforms into a global jazz hub this month. Check out the North Sea Jazz fringe events across the city.",
    cta: "Explore Category",
    href: getFestivalDetailHref("north-sea-jazz"),
    tone: "lavender",
  },
  {
    title: "Culinary Tours",
    description:
      "Don't miss the food truck rallies in Amsterdam and Utrecht. A gastronomic journey through local and global flavors.",
    cta: "View Schedule",
    href: "/festivals",
    tone: "butter",
  },
];

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m14.583 14.584 3.334 3.333M16.25 9.167a7.083 7.083 0 1 1-14.167 0 7.083 7.083 0 0 1 14.167 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.667 8H3.333M7.333 12 3.333 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 4 12.667 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterChevron() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4.667 6.667 3.333 3.333 3.333-3.333"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function toneClass(tone: CalendarTone) {
  if (tone === "lime") {
    return "bg-[#d8efb7] text-[#4c622e]";
  }

  if (tone === "pink") {
    return "bg-[#f7d8de] text-[#a43a59]";
  }

  if (tone === "blue") {
    return "bg-[#d9e6ff] text-[#4d6ab8]";
  }

  if (tone === "amber") {
    return "bg-[#ffe9b6] text-[#9b6b07]";
  }

  return "bg-[#e6ddff] text-[#6f44cd]";
}

function CalendarPill({ event }: { event: CalendarEvent }) {
  const classes = `block truncate rounded-full px-3 py-1 text-[11px] font-medium ${toneClass(
    event.tone
  )}`;

  if (event.href) {
    return (
      <Link href={event.href} className={classes}>
        {event.label}
      </Link>
    );
  }

  return <span className={classes}>{event.label}</span>;
}

function HighlightInfoCard({ card }: { card: HighlightCard }) {
  const toneClass =
    card.tone === "lavender" ? "bg-[#e8e7f7]" : "bg-[#f7e8be]";

  const buttonClass =
    card.tone === "lavender"
      ? "bg-[#171511] text-white hover:bg-[#2b261f]"
      : "border border-[#171511] bg-transparent text-[#171511] hover:bg-white/55";

  return (
    <article className={`rounded-[2rem] ${toneClass} p-6`}>
      <h3 className="max-w-none text-[2rem] leading-none tracking-[-0.05em] text-[#171511]">
        {card.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#5a5046]">{card.description}</p>
      <Link
        href={card.href}
        className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition ${buttonClass}`}
      >
        {card.cta}
      </Link>
    </article>
  );
}

export default function FestivalsCalendarPage() {
  return (
    <main className="min-h-screen bg-[#fcf8f2] text-[#171511]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[42rem]">
              <h1 className="max-w-none text-[clamp(3.4rem,8vw,6rem)] leading-[0.88] tracking-[-0.08em] text-[#171511]">
                Festival Kalender
                <span className="block text-[#51772a]">Nederland</span>
              </h1>
              <p className="mt-5 max-w-[34rem] text-base leading-8 text-[#5d5348] sm:text-[1.05rem]">
                Discover every cultural beat across the country. From underground
                techno in Amsterdam to jazz by the sea.
              </p>
            </div>

            <div className="w-full max-w-[28rem]">
              <div className="rounded-full bg-[#f7ede2] p-2">
                <label
                  htmlFor="calendar-search"
                  className="flex min-h-12 items-center gap-3 rounded-full px-4 text-[#7b7166]"
                >
                  <SearchIcon />
                  <input
                    id="calendar-search"
                    type="text"
                    placeholder="Search festivals..."
                    className="h-full flex-1 bg-transparent text-sm text-[#171511] outline-none placeholder:text-[#9a8f83]"
                  />
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="relative z-10 inline-flex rounded-full bg-[#f7ede2] p-1 shadow-[0_10px_22px_rgba(60,44,23,0.05)]">
                  <Link
                    href="/festivals"
                    className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-6 text-sm font-medium text-[#7a7065] transition hover:text-[#171511]"
                  >
                    Lijst
                  </Link>
                  <span
                    className="relative inline-flex min-h-11 items-center rounded-full bg-[#cfee8c] px-6 text-sm font-medium text-[#171511] shadow-[0_8px_18px_rgba(102,136,46,0.16)]"
                    aria-current="page"
                  >
                    Kalender
                  </span>
                  <Link
                    href="/festivals/kaart"
                    className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-6 text-sm font-medium text-[#7a7065] transition hover:text-[#171511]"
                  >
                    Kaart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#dff1d8] px-5 text-sm font-medium text-[#171511]"
              >
                Genre: All
                <FilterChevron />
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f8ebc9] px-5 text-sm font-medium text-[#171511]"
              >
                City: Netherlands
                <FilterChevron />
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e6e7f3] px-5 text-sm font-medium text-[#171511]"
              >
                Vibe Match
                <span className="text-xs">≋</span>
              </button>
            </div>

            <div className="flex items-center gap-4 self-end text-[#171511]">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8e8377] transition hover:bg-white"
                aria-label="Vorige maand"
              >
                <ArrowLeftIcon />
              </button>
              <span className="text-lg font-medium">Juli 2024</span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8e8377] transition hover:bg-white"
                aria-label="Volgende maand"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[2.4rem] border border-[#f0e6db] bg-white shadow-[0_20px_50px_rgba(60,44,23,0.04)]">
          <div className="grid grid-cols-7 bg-[#fbefe4]">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="border-r border-[#f2e6da] px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e8174] last:border-r-0"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7">
            {calendarCells.map((cell) => (
              <div
                key={cell.key}
                className={`min-h-[7.8rem] border-r border-t border-[#f3ece2] px-3 py-3 sm:min-h-[9rem] lg:min-h-[10rem] ${
                  cell.muted ? "bg-[#fffcf7] text-[#b0a397]" : "bg-white text-[#171511]"
                }`}
              >
                <div className={`text-lg font-medium ${cell.muted ? "text-[#a99d90]" : "text-[#171511]"}`}>
                  {cell.dayNumber}
                </div>
                <div className="mt-3 space-y-2">
                  {cell.events?.map((event) => (
                    <CalendarPill key={`${cell.key}-${event.label}`} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="max-w-none text-[clamp(2rem,4vw,3rem)] leading-[0.96] tracking-[-0.055em] text-[#171511]">
            Curator&apos;s Highlights
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
            <Link
              href={getFestivalDetailHref("dekmantel-festival")}
              className="group relative block overflow-hidden rounded-[2rem] bg-[#171511] text-white shadow-[0_20px_44px_rgba(31,22,13,0.18)]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(7,7,7,0.06), rgba(7,7,7,0.7)), ${optimizeCssBackground(
                  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
                  {
                    width: 1400,
                    quality: 58,
                  }
                )}`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex min-h-[18rem] flex-col justify-end p-6 sm:min-h-[22rem]">
                <div className="inline-flex w-fit rounded-full bg-[#ddefb1] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3d5d1d]">
                  Editor&apos;s Pick
                </div>
                <h3 className="mt-5 max-w-none text-[clamp(2rem,4vw,3.4rem)] leading-[0.94] tracking-[-0.06em] text-white">
                  Awakenings Summer Festival
                </h3>
                <p className="mt-3 max-w-[30rem] text-sm leading-7 text-white/82 sm:text-[15px]">
                  The world&apos;s biggest techno festival returns to Hilvarenbeek
                  for three days of immersive soundscapes.
                </p>
              </div>
            </Link>

            <div className="grid gap-5">
              {highlightCards.map((card) => (
                <HighlightInfoCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
