export type FestivalIcon = "bars" | "fork" | "crown";

export type FestivalOverviewItem = {
  slug: string;
  name: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  genres: string[];
  vibe: string;
  matchScore: number;
  icon: FestivalIcon;
  daySlug: string;
};

export type FestivalAct = {
  name: string;
  genre: string;
};

export type FestivalLineupDay = {
  label: string;
  date: string;
  featured?: boolean;
  acts: FestivalAct[];
};

export type FestivalTicketTier = {
  name: string;
  priceLabel: string;
  badge?: string;
  bullets: string[];
  tone: "sand" | "mist" | "lime";
};

export type FestivalInfoCard = {
  title: string;
  description: string;
  cta: string;
  tone: "sand" | "mint" | "rose";
};

export type FestivalDetail = FestivalOverviewItem & {
  heroImage: string;
  sideImage: string;
  benchmarkPrefix: string;
  benchmarkHighlight: string;
  benchmarkSuffix: string;
  introParagraphs: string[];
  lineupDays: FestivalLineupDay[];
  ticketTiers: FestivalTicketTier[];
  infoCards: FestivalInfoCard[];
};

const festivalDateFormatter = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const festivalDayMonthFormatter = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function toFestivalDate(value: string) {
  return new Date(`${value}T12:00:00Z`);
}

export function formatFestivalDate(value: string) {
  return festivalDateFormatter.format(toFestivalDate(value));
}

export function formatFestivalDateRange(startDate: string, endDate: string) {
  const start = toFestivalDate(startDate);
  const end = toFestivalDate(endDate);

  if (startDate === endDate) return festivalDateFormatter.format(start);
  if (start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${festivalDateFormatter.format(end)}`;
  }
  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${festivalDayMonthFormatter.format(start)} t/m ${festivalDateFormatter.format(end)}`;
  }

  return `${festivalDateFormatter.format(start)} t/m ${festivalDateFormatter.format(end)}`;
}

export const festivalDetails: FestivalDetail[] = [
  {
    slug: "dekmantel-festival",
    name: "Dekmantel Festival",
    startDate: "2026-07-12",
    endDate: "2026-07-14",
    dateLabel: formatFestivalDateRange("2026-07-12", "2026-07-14"),
    locationLabel: "Amsterdamse Bos",
    latitude: 52.3276,
    longitude: 4.8259,
    genres: ["Techno", "Elektronisch"],
    vibe: "amsterdam techno electronic curated",
    matchScore: 95,
    icon: "bars",
    daySlug: "donderdag-10-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    sideImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    benchmarkPrefix: "Een toonaangevend festival voor",
    benchmarkHighlight: "elektronische",
    benchmarkSuffix: "muziek.",
    introParagraphs: [
      "Dekmantel geldt al jaren als een internationaal ijkpunt voor liefhebbers van elektronische muziek. In het groene Amsterdamse Bos presenteert het festival een zorgvuldig samengesteld programma van vernieuwende artiesten.",
      "Van de industriële kracht van peak-time techno tot de soulvolle nuances van classic house en experimentele ritmes: Dekmantel is een ontdekkingsreis door geluid.",
    ],
    lineupDays: [
      {
        label: "Vrijdag",
        date: "2026-07-12",
        acts: [
          { name: "Jeff Mills", genre: "Techno / Detroit" },
          { name: "Helena Hauff", genre: "Electro / wave" },
          { name: "Young Marco", genre: "Eclectische selectie" },
        ],
      },
      {
        label: "Zaterdag",
        date: "2026-07-13",
        featured: true,
        acts: [
          { name: "Floating Points", genre: "Live-set / hoofdpodium" },
          { name: "Ben UFO", genre: "Experimenteel / VK" },
          { name: "Shanti Celeste", genre: "House / selectie" },
        ],
      },
      {
        label: "Zondag",
        date: "2026-07-14",
        acts: [
          { name: "Marcel Dettmann", genre: "Berghain / Techno" },
          { name: "Joy Orbison", genre: "Garage / Techno" },
          { name: "Objekt", genre: "Experimenteel / VK" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Dagticket",
        priceLabel: "EUR79",
        bullets: [
          "Toegang voor één dag",
          "Toegang tot alle podia",
          "Exclusief camping",
        ],
        tone: "sand",
      },
      {
        name: "Weekendticket",
        priceLabel: "EUR195",
        badge: "Populair",
        bullets: [
          "Toegang voor alle drie de dagen",
          "Versnelde entree",
          "Digitale festivalgids",
        ],
        tone: "mist",
      },
      {
        name: "Pro-ticket",
        priceLabel: "EUR350",
        bullets: [
          "Toegang backstage",
          "Privélounge",
          "Meet-and-greet met artiesten",
        ],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Bereikbaarheid",
        description:
          "Vanaf station RAI rijdt elke 15 minuten een pendelbus. Op het terrein is een aparte ophaalplek beschikbaar.",
        cta: "Pendelbus",
        tone: "sand",
      },
      {
        title: "Faciliteiten",
        description:
          "Het terrein is goed toegankelijk, met watertappunten, kluisjes en zitplekken in de schaduw.",
        cta: "Terreininformatie",
        tone: "mint",
      },
      {
        title: "Kluisjes",
        description:
          "Op het terrein zijn kleine en grote kluisjes beschikbaar. Bij het inchecken ontvang je een digitale code.",
        cta: "Informatie over kluisjes",
        tone: "rose",
      },
    ],
  },
  {
    slug: "lowlands",
    name: "Lowlands",
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    dateLabel: formatFestivalDateRange("2026-08-15", "2026-08-18"),
    locationLabel: "Biddinghuizen",
    latitude: 52.4398,
    longitude: 5.7651,
    genres: ["Multi-genre", "Kunst"],
    vibe: "kunst multi-genre camping weekend",
    matchScore: 89,
    icon: "crown",
    daySlug: "dinsdag-15-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    sideImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    benchmarkPrefix: "Een speelse botsing van",
    benchmarkHighlight: "muziek",
    benchmarkSuffix: "en cultuur.",
    introParagraphs: [
      "Lowlands brengt grote live-acts, lezingen, theater en beeldende kunst samen in een festival dat meer voelt als een tijdelijke stad dan als een gewoon weekendje weg.",
      "De beste dagen ontstaan door steeds van tempo te wisselen: een grote show bij zonsondergang, een installatie na middernacht en een rustig ontbijt voordat je weer verdergaat.",
    ],
    lineupDays: [
      {
        label: "Vrijdag",
        date: "2026-08-16",
        acts: [
          { name: "The National", genre: "Indie / hoofdpodium" },
          { name: "Peggy Gou", genre: "House / nachtprogramma" },
          { name: "Jungle", genre: "Live / groove" },
        ],
      },
      {
        label: "Zaterdag",
        date: "2026-08-17",
        featured: true,
        acts: [
          { name: "Fred again..", genre: "Live / hoofdact" },
          { name: "Bicep", genre: "Elektronisch / visueel" },
          { name: "Sevdaliza", genre: "Avant-pop / tweede podium" },
        ],
      },
      {
        label: "Zondag",
        date: "2026-08-18",
        acts: [
          { name: "Bonobo", genre: "Liveband / zonsondergang" },
          { name: "Little Simz", genre: "Hip-hop / hoofdpodium" },
          { name: "Overmono", genre: "VK / afsluiting van de nacht" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Dagticket",
        priceLabel: "EUR89",
        bullets: ["Toegang voor één dag", "Hoofdterreinen en tenten", "Exclusief camping"],
        tone: "sand",
      },
      {
        name: "Weekendticket",
        priceLabel: "EUR235",
        badge: "Populair",
        bullets: ["Toegang voor het hele weekend", "Versnelde entree", "Festivalplattegrond inbegrepen"],
        tone: "mist",
      },
      {
        name: "Comfortticket",
        priceLabel: "EUR390",
        bullets: ["Versnelde entree", "Premium kampeerzone", "Toegang tot exclusieve lounge"],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Toegankelijkheid",
        description:
          "Over het hele terrein zijn toegankelijke kijkplatforms, vervoerondersteuning en routehulp beschikbaar.",
        cta: "Toegankelijkheidsinformatie",
        tone: "sand",
      },
      {
        title: "Faciliteiten",
        description:
          "Eetpleinen, watertappunten en overdekte rustplekken vind je op alle grote velden.",
        cta: "Terreinplattegrond",
        tone: "mint",
      },
      {
        title: "Camping",
        description:
          "Er zijn zowel comfort- als reguliere kampeerplekken, met aparte ingangen en informatiepunten.",
        cta: "Campinginformatie",
        tone: "rose",
      },
    ],
  },
  {
    slug: "north-sea-jazz",
    name: "North Sea Jazz",
    startDate: "2026-07-11",
    endDate: "2026-07-13",
    dateLabel: formatFestivalDateRange("2026-07-11", "2026-07-13"),
    locationLabel: "Rotterdam",
    latitude: 51.8827,
    longitude: 4.4886,
    genres: ["Jazz", "Soul"],
    vibe: "jazz soul rotterdam live",
    matchScore: 91,
    icon: "fork",
    daySlug: "donderdag-24-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    sideImage:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212",
    benchmarkPrefix: "Een instituut voor",
    benchmarkHighlight: "jazz",
    benchmarkSuffix: "en meer.",
    introParagraphs: [
      "North Sea Jazz is waar erfgoed, improvisatie en eigentijdse crossovers samenkomen. Het programma reikt van legendes en toekomstige iconen tot onverwachte samenwerkingen.",
      "Het draait minder om één grote hoofdact en meer om de hoge kwaliteit in elke zaal, elk tijdslot en iedere late-nightkeuze.",
    ],
    lineupDays: [
      {
        label: "Vrijdag",
        date: "2026-07-11",
        acts: [
          { name: "Herbie Hancock", genre: "Jazz / piano" },
          { name: "Kamasi Washington", genre: "Spirituele jazz" },
          { name: "Nubya Garcia", genre: "Moderne jazz" },
        ],
      },
      {
        label: "Zaterdag",
        date: "2026-07-12",
        featured: true,
        acts: [
          { name: "Anderson .Paak", genre: "Soul / hoofdact" },
          { name: "Robert Glasper", genre: "Crossover / toetsen" },
          { name: "Yussef Dayes", genre: "Ritme / fusion" },
        ],
      },
      {
        label: "Zondag",
        date: "2026-07-13",
        acts: [
          { name: "Esperanza Spalding", genre: "Bas / zang" },
          { name: "Thundercat", genre: "Jazz-funk" },
          { name: "Cecile McLorin Salvant", genre: "Vocale jazz" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Dagticket",
        priceLabel: "EUR109",
        bullets: ["Toegang voor één dag", "Toegang tot alle binnenpodia", "Exclusief gereserveerde zitplaatsen"],
        tone: "sand",
      },
      {
        name: "Weekendticket",
        priceLabel: "EUR279",
        badge: "Populair",
        bullets: ["Toegang voor drie dagen", "Versnelde entree", "Toegang tot het digitale programma"],
        tone: "mist",
      },
      {
        name: "Artist Circle",
        priceLabel: "EUR420",
        bullets: ["Gastvrije ontvangst", "Premium lounge", "Toegang tot voorste vak"],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Toegankelijkheid",
        description:
          "Bij elke entree is hulp beschikbaar met navigatie binnen en ondersteuning voor bezoekers die willen zitten.",
        cta: "Hulp in Ahoy",
        tone: "sand",
      },
      {
        title: "Faciliteiten",
        description:
          "Verspreid door Ahoy vind je meerdere eetpleinen, premium bars en rustige zitplekken.",
        cta: "Plattegrond van Ahoy",
        tone: "mint",
      },
      {
        title: "Kluisjes",
        description:
          "Bij elke hoofdingang zijn een bewaakte garderobe en kluisjes beschikbaar.",
        cta: "Opbergmogelijkheden",
        tone: "rose",
      },
    ],
  },
];

export const festivalOverviewItems: FestivalOverviewItem[] = festivalDetails.map(
  ({
    slug,
    name,
    dateLabel,
    startDate,
    endDate,
    locationLabel,
    latitude,
    longitude,
    genres,
    vibe,
    matchScore,
    icon,
    daySlug,
  }) => ({
    slug,
    name,
    dateLabel,
    startDate,
    endDate,
    locationLabel,
    latitude,
    longitude,
    genres,
    vibe,
    matchScore,
    icon,
    daySlug,
  })
);

export function getFestivalDetailHref(slug: string) {
  return `/festivals/${slug}`;
}

export function getFestivalBySlug(slug: string) {
  return festivalDetails.find((festival) => festival.slug === slug) ?? null;
}

export function generateFestivalStaticParams() {
  return festivalDetails.map((festival) => ({
    events: festival.slug,
  }));
}

export function getDiscoverMoreFestivals(currentSlug: string) {
  return festivalDetails.filter((festival) => festival.slug !== currentSlug).slice(0, 3);
}
