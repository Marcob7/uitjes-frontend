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

export const exploreDetailData: Record<string, ExploreDetailItem> = {
  "food-market-grote-markt": {
    slug: "food-market-grote-markt",
    title: "Food Market Grote Markt",
    city: "Haarlem",
    category: "CURATOR TIP",
    status: "VANDAAG OPEN",
    subtitle: "Culinair • Centrum Haarlem • Gratis • 4.8",
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
      openingHours: "Vandaag • 12:00 - 18:00",
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
        subtitle: "Creatief & lokaal • 4.7",
        image: "/images/julianatoren.jpg",
        badge: "HAARLEM CENTRUM",
      },
      {
        title: "Spaarne Bistro",
        subtitle: "Bistro • €€ • 4.6",
        image: "/images/apeldoorn_img.jpg",
        badge: "AAN HET WATER",
      },
      {
        title: "De Oude Stadskeuken",
        subtitle: "Modern lokaal • €€€ • 4.8",
        image: "/images/julianatoren.jpg",
        badge: "BINNENSTAD",
      },
    ],
  },

  "avond-in-coda-museum": {
    slug: "avond-in-coda-museum",
    title: "Avond in CODA Museum",
    city: "Apeldoorn",
    category: "CURATOR TIP",
    status: "VANDAAG OPEN",
    subtitle: "Cultuur • Centrum Apeldoorn • €14,50 • 4.7",
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
      openingHours: "Vandaag • 19:00 - 21:30",
      cuisine: "Museum, cultuur, design",
      pricing: "Vanaf €14,50",
    },
    actions: {
      reserveLabel: "Bekijk tickets",
      routeLabel: "Bekijk route",
      saveLabel: "Sla op",
    },
    similarPlaces: [
      {
        title: "Live muziek in Gigant",
        subtitle: "Muziek • €18 • 4.6",
        image: "/images/julianatoren.jpg",
        badge: "APELDOORN",
      },
      {
        title: "Voorjaarsmarkt in het centrum",
        subtitle: "Lokaal • Gratis • 4.5",
        image: "/images/apeldoorn_img.jpg",
        badge: "CENTRUM",
      },
      {
        title: "Wandeling door Park Berg & Bos",
        subtitle: "Buiten • €7,50 • 4.8",
        image: "/images/julianatoren.jpg",
        badge: "NATUUR",
      },
    ],
  },

  "live-muziek-in-gigant": {
    slug: "live-muziek-in-gigant",
    title: "Live muziek in Gigant",
    city: "Apeldoorn",
    category: "CURATOR TIP",
    status: "VANAVOND",
    subtitle: "Live muziek • Apeldoorn • €18 • 4.6",
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
      "Gigant is een bekende naam in Apeldoorn voor live muziek, cultuur en avondprogramma’s. Deze plek past goed bij bezoekers die een levendige avond zoeken, maar wel in een toegankelijke setting. Vooral geschikt als je in de stad bent en iets wilt doen dat direct sfeer geeft.",
    practical: {
      address: "Nieuwstraat 377, Apeldoorn",
      openingHours: "Vandaag • 20:00 - 23:00",
      cuisine: "Live muziek, podium, cultuur",
      pricing: "Vanaf €18",
    },
    actions: {
      reserveLabel: "Bekijk tickets",
      routeLabel: "Bekijk route",
      saveLabel: "Sla op",
    },
    similarPlaces: [
      {
        title: "Avond in CODA Museum",
        subtitle: "Cultuur • €14,50 • 4.7",
        image: "/images/apeldoorn_img.jpg",
        badge: "CENTRUM",
      },
      {
        title: "Filmavond in Vue Apeldoorn",
        subtitle: "Film • €11 • 4.5",
        image: "/images/julianatoren.jpg",
        badge: "AVOND",
      },
      {
        title: "Food & Drinks op het Marktplein",
        subtitle: "Food • Gratis • 4.6",
        image: "/images/apeldoorn_img.jpg",
        badge: "MARKTPLEIN",
      },
    ],
  },
};

export function getExploreDetailBySlug(slug: string) {
  return exploreDetailData[slug];
}