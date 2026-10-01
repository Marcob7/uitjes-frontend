const YEAR = 2024;
const MONTH_INDEX = 9;
const MONTH_NAME = "oktober";
const MONTH_DISPLAY = "Oktober";

const dutchMonthNames = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

const weekdayNames = [
  "zondag",
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
];

export const jaarkalenderCategoryMeta = {
  cultuur: {
    label: "Cultuur",
    badgeClass: "bg-[#f4dfd1] text-[#7b4330]",
    dotClass: "bg-[#d97a54]",
    surfaceClass: "bg-[#f5e5da]",
  },
  muziek: {
    label: "Muziek",
    badgeClass: "bg-[#dfe4fb] text-[#4150a7]",
    dotClass: "bg-[#6880ea]",
    surfaceClass: "bg-[#e5e9fb]",
  },
  culinair: {
    label: "Culinair",
    badgeClass: "bg-[#fde4bf] text-[#8a4d15]",
    dotClass: "bg-[#ee9927]",
    surfaceClass: "bg-[#f8e6c9]",
  },
  festival: {
    label: "Festival",
    badgeClass: "bg-[#f7d8df] text-[#8e3552]",
    dotClass: "bg-[#d65a84]",
    surfaceClass: "bg-[#f3dfe4]",
  },
  natuur: {
    label: "Natuur",
    badgeClass: "bg-[#deefcf] text-[#365f29]",
    dotClass: "bg-[#6ca449]",
    surfaceClass: "bg-[#e3efd8]",
  },
  familie: {
    label: "Familie",
    badgeClass: "bg-[#d8f0eb] text-[#24655a]",
    dotClass: "bg-[#2fa48f]",
    surfaceClass: "bg-[#dff1ec]",
  },
} as const;

export type JaarkalenderCategoryKey = keyof typeof jaarkalenderCategoryMeta;

export type JaarkalenderCalendarItem = {
  title: string;
  locatie: string;
  datum: string;
  /** An ISO date/time in the calendar's local time, or an all-day ISO date. */
  startAt: string;
  endAt?: string;
  categorie: JaarkalenderCategoryKey;
  metWie: string;
  prijs: string;
  binnenBuiten: string;
  sfeer: string;
  gratis: boolean;
};

export type JaarkalenderCalendarSummary = {
  displayCount: number;
  text: string;
  categories: JaarkalenderCategoryKey[];
};

const calendarCategoryRotation: JaarkalenderCategoryKey[] = [
  "cultuur",
  "muziek",
  "culinair",
  "festival",
  "natuur",
  "familie",
];

const calendarLocations = [
  { venue: "Westergas", city: "Amsterdam" },
  { venue: "Markthal", city: "Rotterdam" },
  { venue: "TivoliVredenburg", city: "Utrecht" },
  { venue: "Strijp-S", city: "Eindhoven" },
  { venue: "Spoorzone", city: "Tilburg" },
  { venue: "Grote Markt", city: "Groningen" },
  { venue: "Museumkwartier", city: "Den Haag" },
  { venue: "Waalkade", city: "Nijmegen" },
];

const calendarCompanions = [
  "Met partner",
  "Met vrienden",
  "Met kinderen",
  "Solo",
  "Met collega's",
];

const calendarPrices = [
  "Tot €15",
  "€15 - €30",
  "€30 - €50",
  "Vanaf €50",
];

const calendarIndoorOutdoor = ["Binnen", "Buiten", "Binnen & buiten"];

const calendarVibes = [
  "Rustig",
  "Romantisch",
  "Bruisend",
  "Creatief",
  "Ontspannen",
  "Avontuurlijk",
];

const calendarTitles: Record<JaarkalenderCategoryKey, string[]> = {
  cultuur: [
    "Open atelier avond",
    "Fotografie route",
    "Museum late session",
    "Kunst in de stad",
  ],
  muziek: [
    "Live sessie in de stad",
    "Akoestische avond",
    "Kleine zaal concert",
    "DJ set aan het water",
  ],
  culinair: [
    "Proefmarkt in het centrum",
    "Shared dining route",
    "Streetfood avond",
    "Lokale makers lunch",
  ],
  festival: [
    "Stadsfestival met licht",
    "Weekend vol optredens",
    "Cultureel pleinprogramma",
    "Seizoensopening festival",
  ],
  natuur: [
    "Boswandeling met gids",
    "Zonsopkomst in het park",
    "Stilte route langs het water",
    "Natuuratelier buiten",
  ],
  familie: [
    "Familieprogramma in de stad",
    "Kinderroute met workshops",
    "Speelmiddag buiten",
    "Creatief uitje voor iedereen",
  ],
};

export type TimelineCardTone = "peach" | "mint" | "sand" | "dark" | "light";

export type TimelineCard = {
  category: string;
  label?: string;
  venue: string;
  title: string;
  description: string;
  location: string;
  tone: TimelineCardTone;
  image?: string;
  price?: string;
  date?: string;
  rating?: number;
  reviewCount?: number;
  primaryAction?: string;
  secondaryAction?: string;
  metaNote?: string;
};

export type TimelineSlot = {
  time: string;
  accent: "lime" | "amber" | "red";
  display: "feature" | "grid" | "hero" | "compact";
  cards: TimelineCard[];
};

export type JaarkalenderDay = {
  slug: string;
  isoDate: string;
  dayNumber: number;
  weekday: string;
  weekdayDisplay: string;
  monthDisplay: string;
  year: number;
  intro: string;
  filterCity: string;
  filterCategory: string;
  calendarItems: JaarkalenderCalendarItem[];
  calendarSummary: JaarkalenderCalendarSummary;
  timeline: TimelineSlot[];
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getWeekday(dayNumber: number) {
  const date = new Date(Date.UTC(YEAR, MONTH_INDEX, dayNumber));
  return weekdayNames[date.getUTCDay()];
}

function makeSlug(dayNumber: number) {
  return `${getWeekday(dayNumber)}-${dayNumber}-${MONTH_NAME}-${YEAR}`;
}

function makeSlugForDate(date: Date) {
  return `${weekdayNames[date.getDay()]}-${date.getDate()}-${dutchMonthNames[date.getMonth()]}-${date.getFullYear()}`;
}

function makeIsoDate(dayNumber: number) {
  return `${YEAR}-${String(MONTH_INDEX + 1).padStart(2, "0")}-${String(
    dayNumber
  ).padStart(2, "0")}`;
}

const calendarTimeSlots = [
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "16:30",
  "18:00",
  "20:30",
  "21:30",
  "22:15",
];

function getCalendarTime(itemIndex: number) {
  return calendarTimeSlots[itemIndex % calendarTimeSlots.length];
}

function getCalendarDateLabel(dayNumber: number, itemIndex: number) {
  return `${dayNumber} ${MONTH_NAME} ${YEAR} · ${getCalendarTime(itemIndex)}`;
}

function buildCalendarItems(dayNumber: number): JaarkalenderCalendarItem[] {
  const itemCount = 6 + (dayNumber % 4);

  return Array.from({ length: itemCount }, (_, index) => {
    const category =
      calendarCategoryRotation[
        (dayNumber + index) % calendarCategoryRotation.length
      ];
    const location =
      calendarLocations[(dayNumber * 2 + index) % calendarLocations.length];
    const gratis = (dayNumber + index) % 4 === 0;
    const titleOptions = calendarTitles[category];

    return {
      title: titleOptions[(dayNumber + index) % titleOptions.length],
      locatie: `${location.venue}, ${location.city}`,
      datum: getCalendarDateLabel(dayNumber, index),
      startAt: `${makeIsoDate(dayNumber)}T${getCalendarTime(index)}:00`,
      categorie: category,
      metWie:
        calendarCompanions[(dayNumber + index) % calendarCompanions.length],
      prijs: gratis
        ? "Gratis"
        : calendarPrices[(dayNumber + index) % calendarPrices.length],
      binnenBuiten:
        calendarIndoorOutdoor[
          (dayNumber + index) % calendarIndoorOutdoor.length
        ],
      sfeer: calendarVibes[(dayNumber * 3 + index) % calendarVibes.length],
      gratis,
    };
  });
}

function buildCalendarSummary(
  dayNumber: number,
  items: JaarkalenderCalendarItem[]
): JaarkalenderCalendarSummary {
  const categories = Array.from(new Set(items.map((item) => item.categorie)));
  const displayCount = items.length;
  const text =
    displayCount >= 8 || dayNumber % 5 === 0
      ? `${displayCount}+ uitjes om naar toe te gaan`
      : `${displayCount}+ dingen om te doen`;

  return {
    displayCount,
    text,
    categories,
  };
}

function buildCalendarData(dayNumber: number) {
  const calendarItems = buildCalendarItems(dayNumber);

  return {
    calendarItems,
    calendarSummary: buildCalendarSummary(dayNumber, calendarItems),
    timeline: buildCalendarTimeline(calendarItems),
  };
}

function buildCalendarTimeline(
  calendarItems: JaarkalenderCalendarItem[]
): TimelineSlot[] {
  const tones: TimelineCardTone[] = ["peach", "mint", "sand", "dark", "light"];

  return calendarItems.map((item, index) => ({
    time: item.startAt.match(/T(\d{2}:\d{2})/)?.[1] ?? "De hele dag",
    accent: item.categorie === "festival" ? "red" : "lime",
    display: "grid",
    cards: [
      {
        category: jaarkalenderCategoryMeta[item.categorie].label,
        venue: item.locatie,
        title: item.title,
        description: [item.binnenBuiten, item.sfeer, item.metWie]
          .filter(Boolean)
          .join(" · "),
        location: item.locatie,
        tone: tones[index % tones.length],
        price: item.prijs,
        date: item.datum,
      },
    ],
  }));
}

function buildDay(dayNumber: number): JaarkalenderDay {
  const weekday = getWeekday(dayNumber);

  return {
    slug: makeSlug(dayNumber),
    isoDate: makeIsoDate(dayNumber),
    dayNumber,
    weekday,
    weekdayDisplay: capitalize(weekday),
    monthDisplay: MONTH_DISPLAY,
    year: YEAR,
    intro:
      "Een overzicht van culturele hoogtepunten, festivals en lokale ontmoetingen in heel Nederland.",
    filterCity: "Alle steden",
    filterCategory: "Alle categorieen",
    ...buildCalendarData(dayNumber),
  };
}

function buildEmptyDay(date: Date): JaarkalenderDay {
  const weekday = weekdayNames[date.getDay()];

  return {
    slug: makeSlugForDate(date),
    isoDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`,
    dayNumber: date.getDate(),
    weekday,
    weekdayDisplay: capitalize(weekday),
    monthDisplay: capitalize(dutchMonthNames[date.getMonth()]),
    year: date.getFullYear(),
    intro: "Een overzicht van evenementen en uitjes op deze dag.",
    filterCity: "Alle steden",
    filterCategory: "Alle categorieen",
    calendarItems: [],
    calendarSummary: { displayCount: 0, text: "Geen uitjes", categories: [] },
    timeline: [],
  };
}

export const jaarkalenderDays: JaarkalenderDay[] = Array.from(
  { length: 31 },
  (_, index) => buildDay(index + 1)
);

const monthNumbers: Record<string, number> = {
  januari: 0,
  februari: 1,
  maart: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  augustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  december: 11,
};

/**
 * Parses the date portion of a Dutch day slug. The weekday is deliberately
 * ignored: it is present for readable URLs, not to determine the date.
 */
export function parseJaarkalenderDaySlug(slug: string) {
  const match = slug.toLowerCase().match(/^.+?-(\d{1,2})-([a-z]+)-(\d{4})$/);
  if (!match) return null;

  const [, dayValue, monthName, yearValue] = match;
  const month = monthNumbers[monthName];
  const day = Number(dayValue);
  const year = Number(yearValue);
  if (month === undefined || !Number.isInteger(day) || !Number.isInteger(year)) {
    return null;
  }

  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? date
    : null;
}

function getLocalCalendarDate(value: string) {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const localDateTime = value.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  const parts = dateOnly ?? localDateTime;

  if (parts && !/(?:Z|[+-]\d{2}:?\d{2})$/.test(value)) {
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const partsFromTimeZone = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsed);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    partsFromTimeZone.find((item) => item.type === type)?.value;
  return new Date(Number(part("year")), Number(part("month")) - 1, Number(part("day")));
}

function calendarDateKey(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

/** One shared local-day comparison for the calendar overview and day routes. */
export function eventOccursOnJaarkalenderDate(
  item: JaarkalenderCalendarItem,
  date: Date
) {
  const start = getLocalCalendarDate(item.startAt);
  const end = item.endAt ? getLocalCalendarDate(item.endAt) : start;
  if (!start || !end) return false;

  const targetKey = calendarDateKey(date);
  const startKey = calendarDateKey(start);
  const endKey = calendarDateKey(end);
  return targetKey >= startKey && targetKey <= endKey;
}

export function getJaarkalenderCalendarItemsForDate(date: Date) {
  return jaarkalenderDays.flatMap((day) =>
    day.calendarItems.filter((item) => eventOccursOnJaarkalenderDate(item, date))
  );
}

export function formatJaarkalenderDate(isoDate: string) {
  const date = getLocalCalendarDate(isoDate);
  if (!date) return null;

  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getJaarkalenderDayBySlug(slug: string) {
  const date = parseJaarkalenderDaySlug(slug);
  if (!date) return undefined;

  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return (
    jaarkalenderDays.find((day) => day.isoDate === isoDate) ??
    buildEmptyDay(date)
  );
}

export function getJaarkalenderHrefForDate(date: Date) {
  return `/jaarkalender/${makeSlugForDate(date)}`;
}

export function getJaarkalenderDayByNumber(dayNumber: number) {
  return jaarkalenderDays.find((day) => day.dayNumber === dayNumber);
}

export function getJaarkalenderHref(dayNumber: number) {
  const day = getJaarkalenderDayByNumber(dayNumber);
  return day ? `/jaarkalender/${day.slug}` : "/jaarkalender";
}

export function generateJaarkalenderStaticParams() {
  return jaarkalenderDays.map((day) => ({
    daySlug: day.slug,
  }));
}

export type JaarkalenderEventEntry = {
  day: JaarkalenderDay;
  slot: TimelineSlot;
  card: TimelineCard;
  slotIndex: number;
  cardIndex: number;
  eventIndex: number;
  eventSlug: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getJaarkalenderEventSlug(
  slot: TimelineSlot,
  card: TimelineCard
) {
  return `${slot.time.replace(":", "-")}-${slugify(card.title)}`;
}

export function getJaarkalenderEventHref(daySlug: string, eventSlug: string) {
  return `/jaarkalender/${daySlug}/${eventSlug}`;
}

export function getJaarkalenderEventHrefForCard(
  daySlug: string,
  slot: TimelineSlot,
  card: TimelineCard
) {
  return getJaarkalenderEventHref(daySlug, getJaarkalenderEventSlug(slot, card));
}

export function getJaarkalenderEventEntriesForDay(
  day: JaarkalenderDay
): JaarkalenderEventEntry[] {
  const date = getLocalCalendarDate(day.isoDate);
  const timeline = date
    ? buildCalendarTimeline(getJaarkalenderCalendarItemsForDate(date))
    : [];
  let eventIndex = 0;

  return timeline.flatMap((slot, slotIndex) =>
    slot.cards.map((card, cardIndex) => {
      const entry: JaarkalenderEventEntry = {
        day,
        slot,
        card,
        slotIndex,
        cardIndex,
        eventIndex,
        eventSlug: getJaarkalenderEventSlug(slot, card),
      };

      eventIndex += 1;
      return entry;
    })
  );
}

export function getJaarkalenderEventBySlug(
  daySlug: string,
  eventSlug: string
) {
  const day = getJaarkalenderDayBySlug(daySlug);

  if (!day) {
    return null;
  }

  return (
    getJaarkalenderEventEntriesForDay(day).find(
      (entry) => entry.eventSlug === eventSlug
    ) ?? null
  );
}

export function generateJaarkalenderEventStaticParams() {
  return jaarkalenderDays.flatMap((day) =>
    getJaarkalenderEventEntriesForDay(day).map((entry) => ({
      daySlug: day.slug,
      event: entry.eventSlug,
    }))
  );
}
