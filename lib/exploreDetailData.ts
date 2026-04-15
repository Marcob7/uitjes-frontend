import {
  APELDOORN_DUMMY_EVENTS,
  HAARLEM_DUMMY_EVENTS,
  mockCardsByCategory,
} from "@/components/city-explore/data";
import { slugify } from "@/components/city-explore/utils";

export type ExploreDetailItem = {
  slug: string;
  title: string;
  city: string;
  category: string;
  status: string;
  subtitle: string;
  heroImage: string;
  gallery: string[];
  reasons: string[];
  aboutTitle: string;
  aboutText: string;
  practical: {
    address: string;
    openingHours: string;
    cuisine: string;
    pricing: string;
  };
  actions: {
    reserveLabel: string;
    routeLabel: string;
    saveLabel: string;
  };
  similarPlaces: Array<{
    title: string;
    subtitle: string;
    image: string;
    badge: string;
  }>;
};

function formatPrice(price: number | null, isFree?: boolean) {
  if (isFree || price === 0) {
    return "Gratis";
  }

  if (typeof price === "number") {
    return `EUR ${price.toFixed(2).replace(".", ",")}`;
  }

  return "Prijs op aanvraag";
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const exploreDetailData: Record<string, ExploreDetailItem> = {
  "food-market-grote-markt": {
    slug: "food-market-grote-markt",
    title: "Food Market Grote Markt",
    city: "Haarlem",
    category: "speciaal geselecteerd TIP",
    status: "VANDAAG OPEN",
    subtitle: "Culinair | Centrum Haarlem | Gratis | 4.8",
    heroImage: "/images/apeldoorn_img.jpg",
    gallery: [
      "/images/apeldoorn_img.jpg",
      "/images/julianatoren.jpg",
      "/images/apeldoorn_img.jpg",
      "/images/julianatoren.jpg",
    ],
    reasons: [
      "Levendige sfeer op een centrale plek",
      "Perfect voor een middag met vrienden",
      "Veel lokale smaken en kraampjes",
      "Vandaag toegankelijk en laagdrempelig",
    ],
    aboutTitle: "Over deze plek",
    aboutText:
      "Food Market Grote Markt is een toegankelijke plek waar lokale smaken, kleine makers en een levendige stadssfeer samenkomen. Je loopt hier gemakkelijk even binnen voor een drankje, een snack of juist een langere culinaire middag. Door de centrale ligging is dit een fijne plek om te starten of eindigen tijdens je dag in de stad.",
    practical: {
      address: "Grote Markt, Haarlem",
      openingHours: "Vandaag | 12:00 - 18:00",
      cuisine: "Street food, lokaal, shared bites",
      pricing: "Gratis toegang",
    },
    actions: {
      reserveLabel: "Bekijk event",
      routeLabel: "Bekijk route",
      saveLabel: "Sla op",
    },
    similarPlaces: [
      {
        title: "Lokale Makers Markt",
        subtitle: "Creatief en lokaal | 4.7",
        image: "/images/julianatoren.jpg",
        badge: "HAARLEM CENTRUM",
      },
      {
        title: "Spaarne Bistro",
        subtitle: "Bistro | EUR 18 - EUR 36 | 4.6",
        image: "/images/apeldoorn_img.jpg",
        badge: "AAN HET WATER",
      },
      {
        title: "De Oude Stadskeuken",
        subtitle: "Modern lokaal | EUR 22 - EUR 40 | 4.8",
        image: "/images/julianatoren.jpg",
        badge: "BINNENSTAD",
      },
    ],
  },
  "avond-in-coda-museum": {
    slug: "avond-in-coda-museum",
    title: "Avond in CODA Museum",
    city: "Apeldoorn",
    category: "speciaal geselecteerd TIP",
    status: "VANDAAG OPEN",
    subtitle: "Cultuur | Centrum Apeldoorn | EUR 14,50 | 4.7",
    heroImage: "/images/apeldoorn_img.jpg",
    gallery: [
      "/images/apeldoorn_img.jpg",
      "/images/julianatoren.jpg",
      "/images/apeldoorn_img.jpg",
      "/images/julianatoren.jpg",
    ],
    reasons: [
      "Sterke culturele avondactiviteit",
      "Mooie mix van kunst en architectuur",
      "Geschikt voor solo of samen",
      "Centrale ligging in Apeldoorn",
    ],
    aboutTitle: "Over deze plek",
    aboutText:
      "CODA Museum is een van de bekendere culturele plekken van Apeldoorn en leent zich goed voor een avondbezoek. De combinatie van tentoonstellingen, rustige sfeer en centrale ligging maakt dit een plek die zowel voor bewoners als bezoekers aantrekkelijk is. Ideaal wanneer je iets cultureels zoekt zonder dat het zwaar of ingewikkeld voelt.",
    practical: {
      address: "Vosselmanstraat 299, Apeldoorn",
      openingHours: "Vandaag | 19:00 - 21:30",
      cuisine: "Museum, cultuur, design",
      pricing: "Vanaf EUR 14,50",
    },
    actions: {
      reserveLabel: "Bekijk tickets",
      routeLabel: "Bekijk route",
      saveLabel: "Sla op",
    },
    similarPlaces: [
      {
        title: "Live muziek in Gigant",
        subtitle: "Muziek | EUR 18 | 4.6",
        image: "/images/julianatoren.jpg",
        badge: "APELDOORN",
      },
      {
        title: "Voorjaarsmarkt in het centrum",
        subtitle: "Lokaal | Gratis | 4.5",
        image: "/images/apeldoorn_img.jpg",
        badge: "CENTRUM",
      },
      {
        title: "Wandeling door Park Berg & Bos",
        subtitle: "Buiten | EUR 7,50 | 4.8",
        image: "/images/julianatoren.jpg",
        badge: "NATUUR",
      },
    ],
  },
  "live-muziek-in-gigant": {
    slug: "live-muziek-in-gigant",
    title: "Live muziek in Gigant",
    city: "Apeldoorn",
    category: "speciaal geselecteerd TIP",
    status: "VANAVOND",
    subtitle: "Live muziek | Apeldoorn | EUR 18 | 4.6",
    heroImage: "/images/julianatoren.jpg",
    gallery: [
      "/images/julianatoren.jpg",
      "/images/apeldoorn_img.jpg",
      "/images/julianatoren.jpg",
      "/images/apeldoorn_img.jpg",
    ],
    reasons: [
      "Sterke avondsfeer",
      "Goed voor een spontane avond uit",
      "Bekende plek in Apeldoorn",
      "Past goed bij muziek-liefhebbers",
    ],
    aboutTitle: "Over deze plek",
    aboutText:
      "Gigant is een bekende naam in Apeldoorn voor live muziek, cultuur en avondprogramma's. Deze plek past goed bij bezoekers die een levendige avond zoeken, maar wel in een toegankelijke setting. Vooral geschikt als je in de stad bent en iets wilt doen dat direct sfeer geeft.",
    practical: {
      address: "Nieuwstraat 377, Apeldoorn",
      openingHours: "Vandaag | 20:00 - 23:00",
      cuisine: "Live muziek, podium, cultuur",
      pricing: "Vanaf EUR 18",
    },
    actions: {
      reserveLabel: "Bekijk tickets",
      routeLabel: "Bekijk route",
      saveLabel: "Sla op",
    },
    similarPlaces: [
      {
        title: "Avond in CODA Museum",
        subtitle: "Cultuur | EUR 14,50 | 4.7",
        image: "/images/apeldoorn_img.jpg",
        badge: "CENTRUM",
      },
      {
        title: "Filmavond in Vue Apeldoorn",
        subtitle: "Film | EUR 11 | 4.5",
        image: "/images/julianatoren.jpg",
        badge: "AVOND",
      },
      {
        title: "Food & Drinks op het Marktplein",
        subtitle: "Food | Gratis | 4.6",
        image: "/images/apeldoorn_img.jpg",
        badge: "MARKTPLEIN",
      },
    ],
  },
};

const fallbackEventSources = [...HAARLEM_DUMMY_EVENTS, ...APELDOORN_DUMMY_EVENTS];
const fallbackCardSources = Object.values(mockCardsByCategory).flat();

function buildFallbackExploreDetail(slug: string): ExploreDetailItem | undefined {
  const eventMatch = fallbackEventSources.find((event) => slugify(event.title) === slug);

  if (eventMatch) {
    const city = eventMatch.city.charAt(0).toUpperCase() + eventMatch.city.slice(1);

    return {
      slug,
      title: eventMatch.title,
      city,
      category: (eventMatch.category_label || "speciaal geselecteerd TIP").toUpperCase(),
      status: (eventMatch.status || "PLAN DIT MOMENT").toUpperCase(),
      subtitle: [
        eventMatch.venue || city,
        formatPrice(eventMatch.price_min, eventMatch.is_free),
        typeof eventMatch.rating === "number" ? eventMatch.rating.toFixed(1) : null,
      ]
        .filter(Boolean)
        .join(" | "),
      heroImage: eventMatch.image || "/images/apeldoorn_img.jpg",
      gallery: [
        eventMatch.image || "/images/apeldoorn_img.jpg",
        "/images/apeldoorn_img.jpg",
        "/images/julianatoren.jpg",
        eventMatch.image || "/images/julianatoren.jpg",
      ],
      reasons: [
        "Past goed in een spontane route door de stad",
        "Sterke sfeer zonder ingewikkelde planning",
        "Goed te combineren met andere curated stops",
        "Dummy data die je later makkelijk kunt vervangen",
      ],
      aboutTitle: "Over deze plek",
      aboutText:
        eventMatch.summary ||
        `${eventMatch.title} is een plek die direct gevoel geeft bij de stad. Deze fallback detailpagina is opgebouwd uit je huidige dummy data, zodat de flow van explore naar detail al werkt terwijl je de echte content nog invult.`,
      practical: {
        address: eventMatch.venue || `${city} centrum`,
        openingHours:
          eventMatch.start_at && eventMatch.end_at
            ? `${new Date(eventMatch.start_at).toLocaleDateString("nl-NL")} | ${new Date(
                eventMatch.start_at
              ).toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(eventMatch.end_at).toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : eventMatch.date_text || "Planning volgt",
        cuisine: eventMatch.category_label || "Curated moment",
        pricing: formatPrice(eventMatch.price_min, eventMatch.is_free),
      },
      actions: {
        reserveLabel: eventMatch.is_free ? "Bekijk moment" : "Bekijk tickets",
        routeLabel: "Bekijk route",
        saveLabel: "Sla op",
      },
      similarPlaces: fallbackEventSources
        .filter((event) => slugify(event.title) !== slug)
        .slice(0, 3)
        .map((event) => ({
          title: event.title,
          subtitle: [
            event.category_label || "Moment",
            formatPrice(event.price_min, event.is_free),
            typeof event.rating === "number" ? event.rating.toFixed(1) : null,
          ]
            .filter(Boolean)
            .join(" | "),
          image: event.image || "/images/apeldoorn_img.jpg",
          badge: event.city.toUpperCase(),
        })),
    };
  }

  const cardMatch = fallbackCardSources.find((card) => card.href.endsWith(`/${slug}`));

  if (cardMatch) {
    return {
      slug,
      title: cardMatch.title,
      city: "Haarlem",
      category: cardMatch.label.toUpperCase(),
      status: (cardMatch.status || "CURATED PICK").toUpperCase(),
      subtitle: [cardMatch.location, cardMatch.price, cardMatch.rating?.toFixed(1)]
        .filter(Boolean)
        .join(" | "),
      heroImage: cardMatch.image,
      gallery: [
        cardMatch.image,
        "/images/apeldoorn_img.jpg",
        "/images/julianatoren.jpg",
        cardMatch.image,
      ],
      reasons: [
        "Handige fallback op basis van je huidige mock card",
        "Geschikt om design en navigatie al te testen",
        "Makkelijk later te vervangen door echte detailcontent",
        "Visueel consistent met de explore view",
      ],
      aboutTitle: "Over deze plek",
      aboutText:
        cardMatch.description ||
        `${cardMatch.title} is nu gevuld vanuit je mock data, zodat de ontdekflow compleet aanvoelt terwijl je nog met dummy content werkt.`,
      practical: {
        address: cardMatch.location,
        openingHours: cardMatch.time,
        cuisine: cardMatch.label,
        pricing: cardMatch.price || "Prijs volgt",
      },
      actions: {
        reserveLabel: "Bekijk moment",
        routeLabel: "Bekijk route",
        saveLabel: "Sla op",
      },
      similarPlaces: fallbackCardSources
        .filter((card) => card.href !== cardMatch.href)
        .slice(0, 3)
        .map((card) => ({
          title: card.title,
          subtitle: [card.label, card.price, card.rating?.toFixed(1)]
            .filter(Boolean)
            .join(" | "),
          image: card.image,
          badge: "CURATED",
        })),
    };
  }

  return undefined;
}

export function getExploreDetailBySlug(slug: string) {
  return exploreDetailData[slug] || buildFallbackExploreDetail(slug);
}

export function getAllExploreDetailSlugs() {
  const fallbackSlugs = [
    ...fallbackEventSources.map((event) => slugify(event.title)),
    ...fallbackCardSources.map((card) => card.href.split("/").pop() || slugify(card.title)),
  ];

  return Array.from(new Set([...Object.keys(exploreDetailData), ...fallbackSlugs])).filter(
    Boolean
  );
}

export function getFallbackExploreTitle(slug: string) {
  return titleFromSlug(slug);
}
