const YEAR = 2024;
const MONTH_INDEX = 9;
const MONTH_NAME = "oktober";
const MONTH_DISPLAY = "Oktober";

const weekdayNames = [
  "zondag",
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
];

const cities = [
  "Amsterdam",
  "Rotterdam",
  "Utrecht",
  "Eindhoven",
  "Zwolle",
  "Den Haag",
  "Groningen",
  "Nijmegen",
];

const museumVenues = [
  "Rijksmuseum",
  "Kunsthal",
  "Spoorwegmuseum",
  "Designhuis",
  "Museum Arnhem",
  "Fotomuseum",
  "TextielMuseum",
  "Grote Kerk",
];

const dayRunTitles = [
  "Stadsrun langs het water",
  "Lunchconcert in de binnentuin",
  "Streetfood Sessions",
  "Makersmarkt op het plein",
  "Design tour door de stad",
  "Open atelier route",
  "Middag aan de kade",
  "Botanische tuinwandeling",
];

const eveningTitles = [
  "Amsterdam Live Sessions",
  "Glow by Night",
  "Noorderlicht Concert",
  "Late Museum Hour",
  "City Jazz Collective",
  "Canal Nights",
  "Neon Film Club",
  "After Dark Stories",
];

const lateNightTitles = [
  "Night Glow Parade",
  "Late Night Expo",
  "Silent Disco aan de Maas",
  "Midnight Food Hall",
  "After Hours Cinema",
  "Lichtparade Centrum",
  "Night Market Special",
  "Jazz Encore",
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

function makeIsoDate(dayNumber: number) {
  return `${YEAR}-${String(MONTH_INDEX + 1).padStart(2, "0")}-${String(
    dayNumber
  ).padStart(2, "0")}`;
}

function getImage(seed: number) {
  const images = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    "https://images.unsplash.com/photo-1503095396549-807759245b35",
  ];

  return images[seed % images.length];
}

function getCalendarDateLabel(dayNumber: number, itemIndex: number) {
  const timeSlots = [
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

  return `${dayNumber} ${MONTH_NAME} ${YEAR} · ${
    timeSlots[itemIndex % timeSlots.length]
  }`;
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
  };
}

function buildGenericTimeline(dayNumber: number): TimelineSlot[] {
  const city = cities[dayNumber % cities.length];
  const museum = museumVenues[dayNumber % museumVenues.length];
  const runTitle = dayRunTitles[dayNumber % dayRunTitles.length];
  const foodCity = cities[(dayNumber + 2) % cities.length];
  const eveningTitle = eveningTitles[dayNumber % eveningTitles.length];
  const lateNightTitle = lateNightTitles[dayNumber % lateNightTitles.length];

  return [
    {
      time: "09:00",
      accent: "lime",
      display: "feature",
      cards: [
        {
          category: "culture",
          label: `${museum}, ${city}`,
          venue: museum,
          title: `Ochtendprogramma in ${museum}`,
          description:
            "Een rustig begin van de dag met speciaal geselecteerd tours, lichte muziek en vroege toegang voor liefhebbers van cultuur.",
          location: `${museum}, ${city}`,
          tone: "peach",
          primaryAction: "Add to Calendar",
        },
      ],
    },
    {
      time: "12:00",
      accent: "lime",
      display: "grid",
      cards: [
        {
          category: "sport",
          venue: city,
          title: runTitle,
          description:
            "Een energieke middagstop met ruimte om aan te haken, te lunchen en andere mensen uit de stad te ontmoeten.",
          location: `Centrum ${city}`,
          tone: "mint",
        },
        {
          category: "food",
          venue: foodCity,
          title: "Lokale proefmarkt",
          description:
            "Van kleine makers tot verrassende keukens. Ideaal voor een langzame lunch of spontane culinaire ontdekking.",
          location: `Markthal, ${foodCity}`,
          tone: "sand",
        },
      ],
    },
    {
      time: "18:00",
      accent: "lime",
      display: "hero",
      cards: [
        {
          category: "music",
          venue: city,
          title: eveningTitle,
          description:
            "De zon zakt weg en de stad schakelt door naar livemuziek, warme lampen en een avond vol sfeer.",
          location: `${city} by night`,
          tone: "dark",
          image: getImage(dayNumber),
          primaryAction: "Get Tickets",
          secondaryAction: "Add to Calendar",
        },
      ],
    },
    {
      time: "22:00",
      accent: "red",
      display: "compact",
      cards: [
        {
          category: "festival",
          venue: city,
          title: lateNightTitle,
          description: "Een late afsluiter voor wie nog even door wil.",
          location: `${city} - Late program`,
          tone: "light",
          metaNote: `${city} - after hours`,
        },
      ],
    },
  ];
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
    timeline: buildGenericTimeline(dayNumber),
  };
}

const tenthDayCalendarData = buildCalendarData(10);

const tenthDayOverride: JaarkalenderDay = {
  slug: makeSlug(10),
  isoDate: makeIsoDate(10),
  dayNumber: 10,
  weekday: "donderdag",
  weekdayDisplay: "Donderdag",
  monthDisplay: MONTH_DISPLAY,
  year: YEAR,
  intro:
    "Een overzicht van culturele hoogtepunten, festivals en lokale ontmoetingen in heel Nederland.",
  filterCity: "Alle steden",
  filterCategory: "Alle categorieen",
  ...tenthDayCalendarData,
  timeline: [
    {
      time: "09:00",
      accent: "lime",
      display: "feature",
      cards: [
        {
          category: "culture",
          label: "Rijksmuseum, Amsterdam",
          venue: "Rijksmuseum",
          title: "Morgenlicht in het Rijks",
          description:
            "Een exclusieve vroege opening voor speciaal geselecteerden en kunstliefhebbers. Ontdek de galerijen voordat de grote drukte begint.",
          location: "Rijksmuseum, Amsterdam",
          tone: "peach",
          primaryAction: "Add to Calendar",
        },
      ],
    },
    {
      time: "12:00",
      accent: "lime",
      display: "grid",
      cards: [
        {
          category: "sport",
          venue: "Utrecht",
          title: "Stadsrun Utrecht",
          description:
            "Een energieke middagrun langs de Oudegracht voor alle niveaus.",
          location: "Domplein",
          tone: "mint",
        },
        {
          category: "food",
          venue: "Rotterdam",
          title: "Streetfood Market",
          description:
            "Lokale smaken en internationale delicatessen in het hart van de stad.",
          location: "Markthal, Rotterdam",
          tone: "sand",
        },
      ],
    },
    {
      time: "18:00",
      accent: "lime",
      display: "hero",
      cards: [
        {
          category: "music",
          venue: "Amsterdam",
          title: "Amsterdam Live Sessions",
          description:
            "De zon gaat onder, de muziek gaat aan. Een intieme avond met de beste indie-artiesten van dit moment.",
          location: "Amsterdam by night",
          tone: "dark",
          image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
          primaryAction: "Get Tickets",
          secondaryAction: "Add to Calendar",
        },
      ],
    },
    {
      time: "22:00",
      accent: "red",
      display: "compact",
      cards: [
        {
          category: "festival",
          venue: "Eindhoven",
          title: "Night Glow Parade",
          description: "Laatavond programma in Strijp-S.",
          location: "Eindhoven - Strijp-S",
          tone: "light",
          metaNote: "Festival",
        },
      ],
    },
  ],
};

export const jaarkalenderDays: JaarkalenderDay[] = Array.from(
  { length: 31 },
  (_, index) => {
    const dayNumber = index + 1;

    if (dayNumber === 10) {
      return tenthDayOverride;
    }

    return buildDay(dayNumber);
  }
);

export function getJaarkalenderDayBySlug(slug: string) {
  return jaarkalenderDays.find((day) => day.slug === slug);
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
  let eventIndex = 0;

  return day.timeline.flatMap((slot, slotIndex) =>
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
