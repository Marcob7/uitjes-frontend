export type InspirationCategorySlug =
  | "vandaag"
  | "weekend"
  | "eten-drinken"
  | "met-kinderen"
  | "gratis"
  | "binnen"
  | "buiten"
  | "romantisch";

export type InspirationLocationMode = "nearby" | "surprise" | "city";

export type InspirationResult = {
  slug: string;
  title: string;
  city: string;
  citySlug: string;
  category: InspirationCategorySlug;
  categoryLabel: string;
  categories: InspirationCategorySlug[];
  description: string;
  practicalInfo: string;
  tags: string[];
  price: string;
  location: string;
  image: string;
  detail: string;
  badge?: string;
  rating: string;
  openingHours: string;
  type: string;
  reasons: string[];
  gallery: string[];
};

export type InspirationResultQuery = {
  location?: string;
  nearbyCity?: string;
  category?: string;
  limit?: number;
};

export type InspirationCoordinates = {
  latitude: number;
  longitude: number;
};

export const inspirationCategoryLabels: Record<InspirationCategorySlug, string> = {
  vandaag: "Vandaag iets doen",
  weekend: "Dit weekend",
  "eten-drinken": "Eten & drinken",
  "met-kinderen": "Met kinderen",
  gratis: "Gratis",
  binnen: "Binnen",
  buiten: "Buiten",
  romantisch: "Romantisch",
};

export const inspirationCategoryDescriptions: Record<InspirationCategorySlug, string> = {
  vandaag:
    "Resultaten die makkelijk vandaag te plannen zijn, met korte reistijd en duidelijke praktische info.",
  weekend:
    "Ideeen voor een vrije dag of langer dagdeel, van markten tot cultuur en natuur.",
  "eten-drinken":
    "Plekken voor lunch, borrel, diner of iets bijzonders om te proeven.",
  "met-kinderen":
    "Uitjes die laagdrempelig, praktisch en leuk zijn voor gezinnen.",
  gratis:
    "Toegankelijke tips die gratis zijn of bijna niets kosten.",
  binnen:
    "Binnenlocaties voor minder goed weer, cultuur, makersplekken en rustige middagen.",
  buiten:
    "Buitenideeen met lucht, groen, water of genoeg ruimte om te dwalen.",
  romantisch:
    "Sfeervolle plekken voor samen, van rustig tot net wat specialer.",
};

export const featuredInspirationCities = [
  { label: "Apeldoorn", value: "apeldoorn" },
  { label: "Deventer", value: "deventer" },
  { label: "Amersfoort", value: "amersfoort" },
];

export const nearbyFallbackCitySlug = "apeldoorn";

const dummyInspirationCityCoordinates: Record<string, InspirationCoordinates> = {
  apeldoorn: { latitude: 52.2112, longitude: 5.9699 },
  deventer: { latitude: 52.2661, longitude: 6.1552 },
  amersfoort: { latitude: 52.1561, longitude: 5.3878 },
};

const image = (id: string) =>
  `url('https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80')`;

export const inspirationResults: InspirationResult[] = [
  {
    slug: "ochtend-in-oranjepark",
    title: "Ochtend in het Oranjepark",
    city: "Apeldoorn",
    citySlug: "apeldoorn",
    category: "buiten",
    categoryLabel: inspirationCategoryLabels.buiten,
    categories: ["buiten", "vandaag", "gratis"],
    description:
      "Start rustig met koffie in de buurt en wandel daarna door het park. Fijn als je iets laagdrempeligs zoekt zonder strak programma.",
    practicalInfo: "Goed te doen in 1 tot 2 uur. Neem koffie mee of combineer met centrum.",
    tags: ["Park", "Rustig", "Gratis"],
    price: "Gratis",
    location: "Oranjepark, Apeldoorn",
    image: image("photo-1441974231531-c6227db76b6e"),
    detail: "Parkwandeling in Apeldoorn",
    badge: "Dichtbij",
    rating: "4.6",
    openingHours: "Altijd toegankelijk",
    type: "Buitenactiviteit",
    reasons: [
      "Laagdrempelig en snel te plannen",
      "Past bij een rustige ochtend of middag",
      "Goed te combineren met horeca in het centrum",
      "Geen reservering nodig",
    ],
    gallery: [
      image("photo-1500530855697-b586d89ba3ee"),
      image("photo-1473773508845-188df298d2d1"),
      image("photo-1506744038136-46273834b3fb"),
      image("photo-1490750967868-88aa4486c946"),
    ],
  },
  {
    slug: "makersmiddag-in-coda",
    title: "Makersmiddag bij CODA",
    city: "Apeldoorn",
    citySlug: "apeldoorn",
    category: "binnen",
    categoryLabel: inspirationCategoryLabels.binnen,
    categories: ["binnen", "met-kinderen", "vandaag"],
    description:
      "Een compacte cultuurstop met exposities, makershoek en genoeg afwisseling voor een regenachtige middag.",
    practicalInfo: "Check vooraf het actuele programma. Reken op 1,5 tot 3 uur.",
    tags: ["Cultuur", "Binnen", "Gezin"],
    price: "Vanaf EUR 0",
    location: "Vosselmanstraat, Apeldoorn",
    image: image("photo-1507914372368-b2b085b925a1"),
    detail: "Cultuur en makersruimte",
    badge: "Binnen",
    rating: "4.5",
    openingHours: "Di t/m zo: 10:00 - 17:30",
    type: "Museum en bibliotheek",
    reasons: [
      "Sterke fallback bij slecht weer",
      "Geschikt voor korte en langere bezoeken",
      "Combineert kijken en doen",
      "Centraal gelegen",
    ],
    gallery: [
      image("photo-1518998053901-5348d3961a04"),
      image("photo-1460661419201-fd4cecdf8a8b"),
      image("photo-1521587760476-6c12a4b040da"),
      image("photo-1519389950473-47ba0277781c"),
    ],
  },
  {
    slug: "veluwe-picknickroute",
    title: "Veluwe picknickroute",
    city: "Apeldoorn",
    citySlug: "apeldoorn",
    category: "romantisch",
    categoryLabel: inspirationCategoryLabels.romantisch,
    categories: ["romantisch", "buiten", "weekend"],
    description:
      "Een zachte route langs bosranden en open plekken, met ruimte om onderweg iets mee te nemen en samen te pauzeren.",
    practicalInfo: "Het mooist in de middag. Neem een kleed en drinken mee.",
    tags: ["Date", "Natuur", "Weekend"],
    price: "Gratis tot EUR 15",
    location: "Bosgebied ten westen van Apeldoorn",
    image: image("photo-1500534314209-a25ddb2bd429"),
    detail: "Rustige route aan de rand van de Veluwe",
    badge: "Date",
    rating: "4.8",
    openingHours: "Overdag aanbevolen",
    type: "Wandelroute",
    reasons: [
      "Sfeervol zonder veel geregel",
      "Veel ruimte en natuur",
      "Goed voor een rustig weekendmoment",
      "Betaalbaar en flexibel",
    ],
    gallery: [
      image("photo-1501785888041-af3ef285b470"),
      image("photo-1500530855697-b586d89ba3ee"),
      image("photo-1448375240586-882707db888b"),
      image("photo-1470770841072-f978cf4d019e"),
    ],
  },
  {
    slug: "boeken-en-broodjes-aan-de-brink",
    title: "Boeken en broodjes aan de Brink",
    city: "Deventer",
    citySlug: "deventer",
    category: "eten-drinken",
    categoryLabel: inspirationCategoryLabels["eten-drinken"],
    categories: ["eten-drinken", "binnen", "vandaag"],
    description:
      "Een ontspannen stadsrondje met boekwinkels, lunch en historische gevels rond de Brink.",
    practicalInfo: "Plan 2 tot 3 uur. Ideaal rond lunch of eind van de middag.",
    tags: ["Lunch", "Boeken", "Historisch"],
    price: "EUR 12 - EUR 25",
    location: "De Brink, Deventer",
    image: image("photo-1526243741027-444d633d7365"),
    detail: "Lunch en winkels in de binnenstad",
    badge: "Stadstip",
    rating: "4.7",
    openingHours: "Meeste adressen: 10:00 - 17:30",
    type: "Stadsroute",
    reasons: [
      "Duidelijk stadsgevoel",
      "Makkelijk te combineren met lunch",
      "Veel keuze op loopafstand",
      "Goed bij wisselvallig weer",
    ],
    gallery: [
      image("photo-1507842217343-583bb7270b66"),
      image("photo-1517248135467-4c7edcad34c4"),
      image("photo-1514933651103-005eec06c04b"),
      image("photo-1497215728101-856f4ea42174"),
    ],
  },
  {
    slug: "ijsselavond-met-live-muziek",
    title: "IJsselavond met live muziek",
    city: "Deventer",
    citySlug: "deventer",
    category: "weekend",
    categoryLabel: inspirationCategoryLabels.weekend,
    categories: ["weekend", "romantisch", "eten-drinken"],
    description:
      "Begin aan het water en eindig bij een klein podium of cafe met live muziek. Ongedwongen, maar wel met avondgevoel.",
    practicalInfo: "Check per avond het podiumprogramma. Reserveer horeca als je zeker wilt zijn.",
    tags: ["Live muziek", "Avond", "Aan het water"],
    price: "EUR 10 - EUR 35",
    location: "IJsselkade, Deventer",
    image: image("photo-1493225457124-a3eb161ffa5f"),
    detail: "Muziek en borrel aan de IJssel",
    badge: "Weekend",
    rating: "4.6",
    openingHours: "Vr en za avond",
    type: "Avondprogramma",
    reasons: [
      "Sterk weekendritme",
      "Goed voor samen of met vrienden",
      "Combineert uitzicht, horeca en muziek",
      "Voelt bijzonder zonder groot evenement",
    ],
    gallery: [
      image("photo-1501612780327-45045538702b"),
      image("photo-1470337458703-46ad1756a187"),
      image("photo-1514525253161-7a46d19cd819"),
      image("photo-1500530855697-b586d89ba3ee"),
    ],
  },
  {
    slug: "speuren-door-het-bergkwartier",
    title: "Speuren door het Bergkwartier",
    city: "Deventer",
    citySlug: "deventer",
    category: "met-kinderen",
    categoryLabel: inspirationCategoryLabels["met-kinderen"],
    categories: ["met-kinderen", "buiten", "gratis"],
    description:
      "Maak van de oude straatjes een kleine speurtocht met gevelstenen, steegjes en een pauze op het plein.",
    practicalInfo: "Zelf te lopen met kinderen vanaf ongeveer 5 jaar. Houd het kort en speels.",
    tags: ["Gezin", "Stadswandeling", "Gratis"],
    price: "Gratis",
    location: "Bergkwartier, Deventer",
    image: image("photo-1500530855697-b586d89ba3ee"),
    detail: "Korte speurroute door oude straatjes",
    badge: "Gezin",
    rating: "4.4",
    openingHours: "Overdag aanbevolen",
    type: "Gezinswandeling",
    reasons: [
      "Kinderen hebben onderweg iets te zoeken",
      "Gratis en flexibel",
      "Korte route mogelijk",
      "Leuk als spontaan stadsuitje",
    ],
    gallery: [
      image("photo-1516627145497-ae6968895b74"),
      image("photo-1500534314209-a25ddb2bd429"),
      image("photo-1519681393784-d120267933ba"),
      image("photo-1494526585095-c41746248156"),
    ],
  },
  {
    slug: "koppelpoort-en-koffie",
    title: "Koppelpoort en koffie",
    city: "Amersfoort",
    citySlug: "amersfoort",
    category: "vandaag",
    categoryLabel: inspirationCategoryLabels.vandaag,
    categories: ["vandaag", "buiten", "eten-drinken"],
    description:
      "Een compact rondje langs de Koppelpoort met koffie in de binnenstad. Perfect als je vandaag nog iets kleins wilt doen.",
    practicalInfo: "Goed te doen in 90 minuten. Start bij de poort en loop richting centrum.",
    tags: ["Koffie", "Historisch", "Vandaag"],
    price: "EUR 5 - EUR 15",
    location: "Koppelpoort, Amersfoort",
    image: image("photo-1576924542622-772281a13f0c"),
    detail: "Korte stadsroute in Amersfoort",
    badge: "Vandaag",
    rating: "4.7",
    openingHours: "Overdag aanbevolen",
    type: "Stadswandeling",
    reasons: [
      "Kort en overzichtelijk",
      "Herkenbaar startpunt",
      "Makkelijk te combineren met koffie",
      "Geen voorbereiding nodig",
    ],
    gallery: [
      image("photo-1518005020951-eccb494ad742"),
      image("photo-1517248135467-4c7edcad34c4"),
      image("photo-1500530855697-b586d89ba3ee"),
      image("photo-1500534314209-a25ddb2bd429"),
    ],
  },
  {
    slug: "werkplaats-voor-kleine-makers",
    title: "Werkplaats voor kleine makers",
    city: "Amersfoort",
    citySlug: "amersfoort",
    category: "met-kinderen",
    categoryLabel: inspirationCategoryLabels["met-kinderen"],
    categories: ["met-kinderen", "binnen", "weekend"],
    description:
      "Een creatieve middag waar kinderen kunnen bouwen, tekenen of experimenteren zonder dat het een hele dag hoeft te duren.",
    practicalInfo: "Kijk naar tijdsloten. Neem iets te drinken mee voor erna.",
    tags: ["Creatief", "Kinderen", "Binnen"],
    price: "EUR 7,50 - EUR 18",
    location: "Binnenstad, Amersfoort",
    image: image("photo-1519389950473-47ba0277781c"),
    detail: "Creatieve kinderactiviteit",
    badge: "Creatief",
    rating: "4.5",
    openingHours: "Wo, za en zo: 11:00 - 16:00",
    type: "Workshop",
    reasons: [
      "Actief zonder drukte",
      "Goed bij slecht weer",
      "Kinderen maken zelf iets",
      "Past in een halve middag",
    ],
    gallery: [
      image("photo-1516321318423-f06f85e504b3"),
      image("photo-1516627145497-ae6968895b74"),
      image("photo-1522202176988-66273c2fd55f"),
      image("photo-1503676260728-1c00da094a0b"),
    ],
  },
  {
    slug: "hofjesroute-met-stilteplek",
    title: "Hofjesroute met stilteplek",
    city: "Amersfoort",
    citySlug: "amersfoort",
    category: "gratis",
    categoryLabel: inspirationCategoryLabels.gratis,
    categories: ["gratis", "buiten", "romantisch"],
    description:
      "Een rustige route door hofjes, stegen en kleine pleinen. Mooi voor een traag uur in de stad.",
    practicalInfo: "Respecteer bewoners en houd het rustig in de hofjes.",
    tags: ["Gratis", "Rustig", "Stad"],
    price: "Gratis",
    location: "Historische binnenstad, Amersfoort",
    image: image("photo-1507525428034-b723cf961d3e"),
    detail: "Stille plekken in de binnenstad",
    badge: "Gratis",
    rating: "4.6",
    openingHours: "Overdag aanbevolen",
    type: "Wandelroute",
    reasons: [
      "Goed zonder reservering",
      "Rustiger dan de hoofdstraten",
      "Mooi voor samen of solo",
      "Gratis inspiratie met stadssfeer",
    ],
    gallery: [
      image("photo-1494526585095-c41746248156"),
      image("photo-1500534314209-a25ddb2bd429"),
      image("photo-1506744038136-46273834b3fb"),
      image("photo-1441974231531-c6227db76b6e"),
    ],
  },
];

export function isInspirationCategorySlug(
  category: string
): category is InspirationCategorySlug {
  return Object.keys(inspirationCategoryLabels).includes(category);
}

export function getInspirationLocationMode(
  location?: string
): InspirationLocationMode {
  if (!location || location === "surprise") return "surprise";
  if (location === "nearby") return "nearby";
  return "city";
}

export function getInspirationCityLabel(
  location?: string,
  nearbyCity?: string
): string | undefined {
  if (!location || location === "surprise") return undefined;
  if (location === "nearby") {
    const nearbyCityLabel = getInspirationCityLabel(
      getNearbyInspirationCitySlug(nearbyCity)
    );
    return nearbyCityLabel ? `in de buurt van ${nearbyCityLabel}` : "in de buurt";
  }

  return (
    featuredInspirationCities.find((city) => city.value === location)?.label ??
    location
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function resolveNearestInspirationCityFromCoordinates({
  latitude,
  longitude,
}: InspirationCoordinates) {
  return featuredInspirationCities.reduce(
    (closest, city) => {
      const coordinates = dummyInspirationCityCoordinates[city.value];
      if (!coordinates) return closest;

      const score =
        (coordinates.latitude - latitude) ** 2 +
        (coordinates.longitude - longitude) ** 2;

      return score < closest.score ? { citySlug: city.value, score } : closest;
    },
    { citySlug: nearbyFallbackCitySlug, score: Number.POSITIVE_INFINITY }
  ).citySlug;
}

export function getNearbyInspirationCitySlug(nearbyCity?: string) {
  return featuredInspirationCities.some((city) => city.value === nearbyCity)
    ? nearbyCity
    : nearbyFallbackCitySlug;
}

function scoreResultForLocation(
  result: InspirationResult,
  location?: string,
  nearbyCity?: string
) {
  const mode = getInspirationLocationMode(location);
  const nearbyCitySlug = getNearbyInspirationCitySlug(nearbyCity);

  if (mode === "city") return result.citySlug === location ? 0 : 10;
  if (mode === "nearby") return result.citySlug === nearbyCitySlug ? 0 : 5;

  const cityIndex = featuredInspirationCities.findIndex(
    (city) => city.value === result.citySlug
  );
  return cityIndex < 0 ? 9 : cityIndex;
}

export function getInspirationResults({
  location,
  nearbyCity,
  category,
  limit,
}: InspirationResultQuery = {}) {
  const categoryFiltered =
    category && isInspirationCategorySlug(category)
      ? inspirationResults.filter((result) => result.categories.includes(category))
      : inspirationResults;

  const locationMode = getInspirationLocationMode(location);
  const nearbyCitySlug = getNearbyInspirationCitySlug(nearbyCity);
  const locationFiltered =
    locationMode === "city"
      ? categoryFiltered.filter((result) => result.citySlug === location)
      : locationMode === "nearby"
        ? categoryFiltered.filter((result) => result.citySlug === nearbyCitySlug)
        : categoryFiltered;

  const baseResults = locationFiltered.length > 0 ? locationFiltered : categoryFiltered;
  const sorted = [...baseResults].sort((a, b) => {
    const locationDiff =
      scoreResultForLocation(a, location, nearbyCity) -
      scoreResultForLocation(b, location, nearbyCity);
    if (locationDiff !== 0) return locationDiff;
    return a.title.localeCompare(b.title, "nl");
  });

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getInspirationResultsByCity(citySlug: string) {
  return getInspirationResults({ location: citySlug });
}

export function getInspirationResultsByCategory(
  category: string,
  location?: string,
  nearbyCity?: string
) {
  return getInspirationResults({ category, location, nearbyCity });
}

export function getInspirationResultBySlug(category: string, slug: string) {
  if (!isInspirationCategorySlug(category)) return undefined;

  return inspirationResults.find(
    (result) => result.slug === slug && result.categories.includes(category)
  );
}

export function getSimilarInspirationResults(result: InspirationResult, limit = 3) {
  return inspirationResults
    .filter((item) => item.slug !== result.slug)
    .map((item) => ({
      item,
      score:
        (item.citySlug === result.citySlug ? 3 : 0) +
        item.categories.filter((category) => result.categories.includes(category)).length,
    }))
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "nl"))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getInspirationStaticParams() {
  return Object.keys(inspirationCategoryLabels).map((category) => ({ category }));
}

export function getInspirationDetailStaticParams() {
  return inspirationResults.flatMap((result) =>
    result.categories.map((category) => ({
      category,
      slug: result.slug,
    }))
  );
}
