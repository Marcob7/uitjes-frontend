export type FestivalIcon = "bars" | "fork" | "crown";

export type FestivalOverviewItem = {
  slug: string;
  name: string;
  dateLabel: string;
  locationLabel: string;
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
  dateLabel: string;
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

export const festivalDetails: FestivalDetail[] = [
  {
    slug: "dekmantel-festival",
    name: "Dekmantel Festival",
    dateLabel: "12 - 14 juli",
    locationLabel: "Amsterdamse Bos",
    genres: ["Techno", "Electronic"],
    vibe: "amsterdam techno electronic curated",
    matchScore: 95,
    icon: "bars",
    daySlug: "donderdag-10-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    sideImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    benchmarkPrefix: "A benchmark for",
    benchmarkHighlight: "electronic",
    benchmarkSuffix: "music.",
    introParagraphs: [
      "Dekmantel has long established itself as the global epicenter for electronic music connoisseurs. Located in the verdant embrace of the Amsterdamse Bos, it serves as a carefully curated showcase of the sonic vanguard.",
      "From the industrial weight of peak-time techno to the soulful nuances of classic house and the avant-garde textures of experimental rhythms, Dekmantel is an editorial exploration of sound.",
    ],
    lineupDays: [
      {
        label: "Friday",
        dateLabel: "July 12",
        acts: [
          { name: "Jeff Mills", genre: "Techno / Detroit" },
          { name: "Helena Hauff", genre: "Electro / Wave" },
          { name: "Young Marco", genre: "Eclectic Selector" },
        ],
      },
      {
        label: "Saturday",
        dateLabel: "July 13",
        featured: true,
        acts: [
          { name: "Floating Points", genre: "Live set / Main stage" },
          { name: "Ben UFO", genre: "Left-field / UK" },
          { name: "Shanti Celeste", genre: "House / Selector" },
        ],
      },
      {
        label: "Sunday",
        dateLabel: "July 14",
        acts: [
          { name: "Marcel Dettmann", genre: "Berghain / Techno" },
          { name: "Joy Orbison", genre: "Garage / Techno" },
          { name: "Objekt", genre: "Experimental / UK" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Day Ticket",
        priceLabel: "EUR79",
        bullets: [
          "Single day access",
          "All stage access",
          "Camping excluded",
        ],
        tone: "sand",
      },
      {
        name: "Weekend Pass",
        priceLabel: "EUR195",
        badge: "Popular",
        bullets: [
          "Full 3-day festival access",
          "Priority entry lane",
          "Digital festival guide",
        ],
        tone: "mist",
      },
      {
        name: "Pro Pass",
        priceLabel: "EUR350",
        bullets: [
          "Backstage access",
          "Private lounge bar",
          "Artist meet and greet",
        ],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Accessibility",
        description:
          "Shuttle buses run every 15 minutes from RAI station. Dedicated ride pickup is available on-site.",
        cta: "Event shuttle",
        tone: "sand",
      },
      {
        title: "Facilities",
        description:
          "The terrain is fully accessible with water refill points, lockers and shaded seating areas.",
        cta: "Terrain details",
        tone: "mint",
      },
      {
        title: "Lockers",
        description:
          "On-site lockers are available in small and large sizes. Digital codes are provided at check-in.",
        cta: "Locker info",
        tone: "rose",
      },
    ],
  },
  {
    slug: "lowlands",
    name: "Lowlands",
    dateLabel: "15 - 18 augustus",
    locationLabel: "Biddinghuizen",
    genres: ["Multi-genre", "Kunst"],
    vibe: "kunst multi-genre camping weekend",
    matchScore: 89,
    icon: "crown",
    daySlug: "dinsdag-15-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    sideImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    benchmarkPrefix: "A playful collision of",
    benchmarkHighlight: "music",
    benchmarkSuffix: "and culture.",
    introParagraphs: [
      "Lowlands blends major live acts with talks, theatre and visual culture, creating a festival that feels more like a temporary city than a standard weekender.",
      "The best days here come from switching pace: a huge set at dusk, an installation after midnight, and a slow breakfast before doing it again.",
    ],
    lineupDays: [
      {
        label: "Friday",
        dateLabel: "August 16",
        acts: [
          { name: "The National", genre: "Indie / Main stage" },
          { name: "Peggy Gou", genre: "House / Night program" },
          { name: "Jungle", genre: "Live / Groove" },
        ],
      },
      {
        label: "Saturday",
        dateLabel: "August 17",
        featured: true,
        acts: [
          { name: "Fred again..", genre: "Live / Headline" },
          { name: "Bicep", genre: "Electronic / Visual" },
          { name: "Sevdaliza", genre: "Avant-pop / Stage two" },
        ],
      },
      {
        label: "Sunday",
        dateLabel: "August 18",
        acts: [
          { name: "Bonobo", genre: "Live band / Sunset" },
          { name: "Little Simz", genre: "Hip-hop / Main stage" },
          { name: "Overmono", genre: "UK / Night close" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Day Ticket",
        priceLabel: "EUR89",
        bullets: ["Single day access", "Main fields and tents", "Camping excluded"],
        tone: "sand",
      },
      {
        name: "Weekend Pass",
        priceLabel: "EUR235",
        badge: "Popular",
        bullets: ["Full weekend access", "Priority entrance", "Festival map included"],
        tone: "mist",
      },
      {
        name: "Comfort Pass",
        priceLabel: "EUR390",
        bullets: ["Fast lane entry", "Premium camping zone", "Exclusive lounge access"],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Accessibility",
        description:
          "Accessible viewing decks, transport support and route assistance are available across the site.",
        cta: "Accessibility guide",
        tone: "sand",
      },
      {
        title: "Facilities",
        description:
          "Food courts, water stations and covered rest zones are distributed across every major field.",
        cta: "Site map",
        tone: "mint",
      },
      {
        title: "Camping",
        description:
          "Comfort and regular camping are both available, with separate entrances and dedicated info points.",
        cta: "Camping details",
        tone: "rose",
      },
    ],
  },
  {
    slug: "north-sea-jazz",
    name: "North Sea Jazz",
    dateLabel: "11 - 13 juli",
    locationLabel: "Rotterdam",
    genres: ["Jazz", "Soul"],
    vibe: "jazz soul rotterdam live",
    matchScore: 91,
    icon: "fork",
    daySlug: "donderdag-24-oktober-2024",
    heroImage:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    sideImage:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212",
    benchmarkPrefix: "An institution for",
    benchmarkHighlight: "jazz",
    benchmarkSuffix: "and beyond.",
    introParagraphs: [
      "North Sea Jazz is where heritage, improvisation and contemporary crossover meet. The programming stretches across legends, future icons and unexpected collaborations.",
      "It is less about a single headline and more about the density of quality across every room, every slot and every late-night decision.",
    ],
    lineupDays: [
      {
        label: "Friday",
        dateLabel: "July 11",
        acts: [
          { name: "Herbie Hancock", genre: "Jazz / Piano" },
          { name: "Kamasi Washington", genre: "Spiritual jazz" },
          { name: "Nubya Garcia", genre: "Modern jazz" },
        ],
      },
      {
        label: "Saturday",
        dateLabel: "July 12",
        featured: true,
        acts: [
          { name: "Anderson .Paak", genre: "Soul / Headline" },
          { name: "Robert Glasper", genre: "Crossover / Keys" },
          { name: "Yussef Dayes", genre: "Rhythm / Fusion" },
        ],
      },
      {
        label: "Sunday",
        dateLabel: "July 13",
        acts: [
          { name: "Esperanza Spalding", genre: "Bass / Vocal" },
          { name: "Thundercat", genre: "Jazz-funk" },
          { name: "Cecile McLorin Salvant", genre: "Vocal jazz" },
        ],
      },
    ],
    ticketTiers: [
      {
        name: "Day Ticket",
        priceLabel: "EUR109",
        bullets: ["Single day access", "All indoor stages", "Reserved seating excluded"],
        tone: "sand",
      },
      {
        name: "Weekend Pass",
        priceLabel: "EUR279",
        badge: "Popular",
        bullets: ["Three day access", "Priority entry", "Digital schedule access"],
        tone: "mist",
      },
      {
        name: "Artist Circle",
        priceLabel: "EUR420",
        bullets: ["Hospitality entry", "Premium lounge", "Front section access"],
        tone: "lime",
      },
    ],
    infoCards: [
      {
        title: "Accessibility",
        description:
          "Indoor navigation support and seated assistance are available at every entrance zone.",
        cta: "Venue support",
        tone: "sand",
      },
      {
        title: "Facilities",
        description:
          "Multiple food courts, premium bars and quiet seating pockets are integrated throughout Ahoy.",
        cta: "Venue map",
        tone: "mint",
      },
      {
        title: "Lockers",
        description:
          "Secure cloakroom and lockers are available near each main concourse entrance.",
        cta: "Storage options",
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
    locationLabel,
    genres,
    vibe,
    matchScore,
    icon,
    daySlug,
  }) => ({
    slug,
    name,
    dateLabel,
    locationLabel,
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
