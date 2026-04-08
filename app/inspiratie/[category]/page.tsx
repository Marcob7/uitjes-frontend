import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    category: string;
  };
};

type QuickChoiceCard = {
  title: string;
  href: string;
  image: string;
  size?: "large" | "small";
  badge?: string;
};

type SuggestionCard = {
  title: string;
  meta: string;
  description: string;
  href: string;
  image: string;
  detail: string;
  badge?: string;
};

type CategoryPageData = {
  label: string;
  headline: string;
  description: string;
  quickChoices: QuickChoiceCard[];
  filters: string[];
  suggestions: SuggestionCard[];
};

const categoryPageContent: Record<string, CategoryPageData> = {
  vandaag: {
    label: "Vandaag iets doen",
    headline: "Wat wil je vandaag doen?",
    description:
      "Ontdek wat er vandaag mogelijk is in jouw stad of omgeving. Van verborgen parels tot de meest bruisende hotspots.",
    quickChoices: [
      {
        title: "Uit eten",
        href: "/ontdek?category=eten-drinken",
        image:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "CULINAIR",
      },
      {
        title: "Iets actiefs",
        href: "/ontdek?category=actief",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Evenementen",
        href: "/ontdek?category=events",
        image:
          "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Iets gratis",
        href: "/ontdek?category=gratis",
        image:
          "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Binnen",
        href: "/ontdek?category=binnen",
        image:
          "url('https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Buiten",
        href: "/ontdek?category=buiten",
        image:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Met kinderen",
        href: "/ontdek?category=met-kinderen",
        image:
          "url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Romantisch",
        href: "/ontdek?category=romantisch",
        image:
          "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Nu open", "Dichtbij", "Gratis", "Centrum", "Populair"],
    suggestions: [
      {
        title: "Foodhall in centrum",
        meta: "CENTRUM • FOOD & DRINKS",
        description:
          "Een verzameling van de beste lokale keukens onder één historisch dak. Perfect voor een informele lunch.",
        href: "/ontdek/foodhall-in-centrum",
        image:
          "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80')",
        detail: "4.8 (214 reviews)",
        badge: "EDITOR'S PICK",
      },
      {
        title: "Stadswandeling",
        meta: "BUITEN • ACTIEF",
        description:
          "Ontdek de verborgen hofjes en historische verhalen van de oude stad tijdens deze begeleide route.",
        href: "/ontdek/stadswandeling",
        image:
          "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80')",
        detail: "2,5 uur • Gratis",
      },
      {
        title: "Expositie: Modern Light",
        meta: "BINNEN • CULTUUR",
        description:
          "Een interactieve reis door de geschiedenis van neonkunst en moderne verlichtingstechnieken.",
        href: "/ontdek/expositie-modern-light",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=80')",
        detail: "Tickets vanaf €12,50",
        badge: "NEW",
      },
      {
        title: "Terras aan het water",
        meta: "BUITEN • RELAX",
        description:
          "Geniet van het nazonnetje aan het water bij het best beoordeelde terras van de stad met uitzicht op de Amstel.",
        href: "/ontdek/terras-aan-het-water",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
        detail: "Open tot 23:00",
      },
      {
        title: "Live muziek vanavond",
        meta: "AVOND • LIVE MUZIEK",
        description:
          "Lokale jazz-talenten treden op in de intieme setting van The Blue Note. Geen reservering nodig.",
        href: "/ontdek/live-muziek-vanavond",
        image:
          "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80')",
        detail: "Begint om 20:30",
      },
      {
        title: "Gratis markt",
        meta: "GRATIS • LOKAAL",
        description:
          "Struin langs de leukste kraampjes met vintage, handgemaakte sieraden en lokale lekkernijen.",
        href: "/ontdek/gratis-markt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80')",
        detail: "Tot 17:00 vandaag",
      },
    ],
  },

  weekend: {
    label: "Dit weekend",
    headline: "Wat wil je dit weekend doen?",
    description:
      "Van ontspannen brunches tot drukbezochte evenementen. Hier vind je de leukste ideeën voor jouw weekend.",
    quickChoices: [
      {
        title: "Brunchen",
        href: "/ontdek?category=brunch",
        image:
          "url('https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "WEEKEND",
      },
      {
        title: "Festival",
        href: "/ontdek?category=festival",
        image:
          "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Dagje weg",
        href: "/ontdek?category=dagje-weg",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Museum",
        href: "/ontdek?category=museum",
        image:
          "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Met vrienden",
        href: "/ontdek?category=vrienden",
        image:
          "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Buiten",
        href: "/ontdek?category=buiten",
        image:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Romantisch",
        href: "/ontdek?category=romantisch",
        image:
          "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Gezin",
        href: "/ontdek?category=gezin",
        image:
          "url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Weekendproof", "Populair", "Binnen", "Buiten", "Reserveren"],
    suggestions: [
      {
        title: "Zondagsmarkt",
        meta: "WEEKEND • LOKAAL",
        description:
          "Een sfeervolle markt vol streekproducten, vintage vondsten en muziek in het centrum.",
        href: "/ontdek/zondagsmarkt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80')",
        detail: "Zondag 10:00–17:00",
      },
      {
        title: "Cocktailbar met skyline",
        meta: "AVOND • UIT ETEN",
        description:
          "Een stijlvolle plek voor een cocktailavond met uitzicht over de stad.",
        href: "/ontdek/cocktailbar-met-skyline",
        image:
          "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80')",
        detail: "Reserveren aanbevolen",
      },
      {
        title: "Kunsthal weekendexpo",
        meta: "BINNEN • CULTUUR",
        description:
          "Nieuwe wisselende tentoonstelling met moderne makers en installaties.",
        href: "/ontdek/kunsthal-weekendexpo",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf €14,00",
      },
      {
        title: "Boottocht door de grachten",
        meta: "BUITEN • ONTSPANNEN",
        description:
          "Een rustige tocht door de binnenstad met verhalen over de verborgen plekken langs het water.",
        href: "/ontdek/boottocht-door-de-grachten",
        image:
          "url('https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1200&q=80')",
        detail: "1 uur 15 min",
      },
      {
        title: "Openluchtfilm",
        meta: "AVOND • FILM",
        description:
          "Pak een kleedje en kijk samen een klassieker in het park.",
        href: "/ontdek/openluchtfilm",
        image:
          "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80')",
        detail: "Start om 21:30",
      },
      {
        title: "Speurtocht voor families",
        meta: "GEZIN • ACTIEF",
        description:
          "Interactieve stadsroute voor kinderen met opdrachten en kleine verrassingen.",
        href: "/ontdek/speurtocht-voor-families",
        image:
          "url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf 6 jaar",
      },
    ],
  },

  "eten-drinken": {
    label: "Eten & Drinken",
    headline: "Waar heb je trek in?",
    description:
      "Van brunch en koffie tot shared dining en cocktails. Ontdek plekken die passen bij jouw moment.",
    quickChoices: [
      {
        title: "Brunch",
        href: "/ontdek?category=brunch",
        image:
          "url('https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "FOOD",
      },
      {
        title: "Koffie",
        href: "/ontdek?category=koffie",
        image:
          "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Diner",
        href: "/ontdek?category=diner",
        image:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Cocktails",
        href: "/ontdek?category=cocktails",
        image:
          "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Terras",
        href: "/ontdek?category=terras",
        image:
          "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Fine dining",
        href: "/ontdek?category=fine-dining",
        image:
          "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Lokaal",
        href: "/ontdek?category=lokaal-eten",
        image:
          "url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Snel & lekker",
        href: "/ontdek?category=snel-lekker",
        image:
          "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Nu open", "Reserveren", "Terras", "Vegetarisch", "Populair"],
    suggestions: [
      {
        title: "Brunch House",
        meta: "BRUNCH • POPULAIR",
        description:
          "Bekend om de pancakes, specialty coffee en lichte serre met ochtendzon.",
        href: "/ontdek/brunch-house",
        image:
          "url('https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80')",
        detail: "Open tot 15:00",
      },
      {
        title: "Bar Botanique",
        meta: "COCKTAILS • AVOND",
        description:
          "Groene, levendige setting voor cocktails en shared dining in het centrum.",
        href: "/ontdek/bar-botanique",
        image:
          "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80')",
        detail: "4.7 (187 reviews)",
      },
      {
        title: "Aan het water",
        meta: "TERRAS • BUITEN",
        description:
          "Een zonnig terras met uitzicht over het water en een kleine lunchkaart.",
        href: "/ontdek/aan-het-water",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vandaag 11:00–22:00",
      },
      {
        title: "Streekkeuken",
        meta: "LOKAAL • DINER",
        description:
          "Seizoensgerechten met producten uit de regio in een warme, rustige sfeer.",
        href: "/ontdek/streekkeuken",
        image:
          "url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80')",
        detail: "Chef's menu beschikbaar",
      },
      {
        title: "Pizza & natuurwijn",
        meta: "INFORMEEL • DINER",
        description:
          "Toegankelijke hotspot voor een snelle maar goede avond uit met vrienden.",
        href: "/ontdek/pizza-en-natuurwijn",
        image:
          "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80')",
        detail: "Geen reservering nodig",
      },
      {
        title: "Koffiebar aan de gracht",
        meta: "KOFFIE • OVERDAG",
        description:
          "Een rustige plek om bij te praten of even te werken met goede espresso en vers gebak.",
        href: "/ontdek/koffiebar-aan-de-gracht",
        image:
          "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80')",
        detail: "Specialty coffee",
      },
    ],
  },

  "met-kinderen": {
    label: "Met kinderen",
    headline: "Wat is leuk om met kinderen te doen?",
    description:
      "Leuke, toegankelijke en overzichtelijke ideeën voor gezinnen. Binnen, buiten en voor verschillende leeftijden.",
    quickChoices: [
      {
        title: "Speeltuin",
        href: "/ontdek?category=speeltuin",
        image:
          "url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "GEZIN",
      },
      {
        title: "Dieren",
        href: "/ontdek?category=dieren",
        image:
          "url('https://images.unsplash.com/photo-1501706362039-c6e8092a74d5?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Binnen spelen",
        href: "/ontdek?category=binnen-spelen",
        image:
          "url('https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Educatief",
        href: "/ontdek?category=educatief",
        image:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Buiten",
        href: "/ontdek?category=buiten",
        image:
          "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Kinderproof eten",
        href: "/ontdek?category=kinderproof-eten",
        image:
          "url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Creatief",
        href: "/ontdek?category=creatief",
        image:
          "url('https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Weekend uitje",
        href: "/ontdek?category=weekend-uitje",
        image:
          "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Familieproof", "Binnen", "Buiten", "Goedkoop", "Vandaag open"],
    suggestions: [
      {
        title: "Interactief kindermuseum",
        meta: "BINNEN • EDUCATIEF",
        description:
          "Spelenderwijs leren met proefjes, bouwen en interactieve installaties.",
        href: "/ontdek/interactief-kindermuseum",
        image:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf 4 jaar",
      },
      {
        title: "Natuurspeeltuin",
        meta: "BUITEN • ACTIEF",
        description:
          "Klimmen, klauteren en ontdekken in een groene speelomgeving.",
        href: "/ontdek/natuurspeeltuin",
        image:
          "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80')",
        detail: "Gratis toegang",
      },
      {
        title: "Kinderboerderij",
        meta: "DIEREN • BUITEN",
        description:
          "Altijd goed voor een korte, leuke middag met kleine kinderen.",
        href: "/ontdek/kinderboerderij",
        image:
          "url('https://images.unsplash.com/photo-1501706362039-c6e8092a74d5?auto=format&fit=crop&w=1200&q=80')",
        detail: "Dagelijks open",
      },
      {
        title: "Pannenkoekenhuis",
        meta: "ETEN • GEZIN",
        description:
          "Een makkelijke favoriet met speelhoek en menu voor kinderen.",
        href: "/ontdek/pannenkoekenhuis",
        image:
          "url('https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80')",
        detail: "Kindermenu beschikbaar",
      },
      {
        title: "Voorleesmiddag",
        meta: "RUSTIG • BINNEN",
        description:
          "Een laagdrempelig cultureel moment in de bibliotheek voor jonge kinderen.",
        href: "/ontdek/voorleesmiddag",
        image:
          "url('https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80')",
        detail: "Start om 14:00",
      },
      {
        title: "Mini speurroute",
        meta: "CENTRUM • GEZIN",
        description:
          "Een korte route door de stad met opdrachten en verhaaltjes.",
        href: "/ontdek/mini-speurroute",
        image:
          "url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80')",
        detail: "45 minuten",
      },
    ],
  },

  gratis: {
    label: "Gratis",
    headline: "Wat kun je gratis doen?",
    description:
      "Leuke dingen hoeven niet duur te zijn. Ontdek gratis routes, markten, exposities en lokale tips.",
    quickChoices: [
      {
        title: "Markten",
        href: "/ontdek?category=markt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "GRATIS",
      },
      {
        title: "Wandeling",
        href: "/ontdek?category=wandeling",
        image:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Openbare kunst",
        href: "/ontdek?category=kunst",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Park",
        href: "/ontdek?category=park",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Bibliotheek",
        href: "/ontdek?category=bibliotheek",
        image:
          "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Uitzichtpunt",
        href: "/ontdek?category=uitzichtpunt",
        image:
          "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Stadsplein",
        href: "/ontdek?category=stadsplein",
        image:
          "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Evenementen",
        href: "/ontdek?category=gratis-events",
        image:
          "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Gratis", "Vandaag", "Dichtbij", "Buiten", "Populair"],
    suggestions: [
      {
        title: "Kunstroute door de stad",
        meta: "GRATIS • CULTUUR",
        description:
          "Zelfstandige route langs muurschilderingen, beelden en verborgen kunst in de openbare ruimte.",
        href: "/ontdek/kunstroute-door-de-stad",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vrij toegankelijk",
      },
      {
        title: "Parkpicknick",
        meta: "BUITEN • RELAX",
        description:
          "Neem zelf iets mee en geniet van de middag in een van de mooiste stadsparken.",
        href: "/ontdek/parkpicknick",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
        detail: "Hele dag mogelijk",
      },
      {
        title: "Gratis galerieavond",
        meta: "BINNEN • CULTUUR",
        description:
          "Diverse galeries openen gratis hun deuren voor een gezamenlijke kunstavond.",
        href: "/ontdek/gratis-galerieavond",
        image:
          "url('https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80')",
        detail: "Van 18:00 tot 21:00",
      },
      {
        title: "Lokale markt",
        meta: "CENTRUM • LOKAAL",
        description:
          "Sfeervol rondkijken, proeven en mensen kijken op de bekendste markt van de stad.",
        href: "/ontdek/lokale-markt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80')",
        detail: "Tot 17:00",
      },
      {
        title: "Bibliotheektips",
        meta: "RUSTIG • BINNEN",
        description:
          "Leuke gratis activiteiten zoals lezingen, kleine exposities en workshops.",
        href: "/ontdek/bibliotheektips",
        image:
          "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80')",
        detail: "Wisselend programma",
      },
      {
        title: "Zonsondergangpunt",
        meta: "BUITEN • UITZICHT",
        description:
          "Een rustige plek om gratis te genieten van het mooiste uitzicht van de avond.",
        href: "/ontdek/zonsondergangpunt",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
        detail: "Beste tijd: 20:45",
      },
    ],
  },

  binnen: {
    label: "Binnen",
    headline: "Wat kun je binnen doen?",
    description:
      "Perfect voor regenachtige dagen of rustige momenten. Van musea tot knusse plekken om lang te blijven hangen.",
    quickChoices: [
      {
        title: "Museum",
        href: "/ontdek?category=museum",
        image:
          "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "BINNEN",
      },
      {
        title: "Koffiebar",
        href: "/ontdek?category=koffie",
        image:
          "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Bibliotheek",
        href: "/ontdek?category=bibliotheek",
        image:
          "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Expositie",
        href: "/ontdek?category=expositie",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Wellness",
        href: "/ontdek?category=wellness",
        image:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Filmhuis",
        href: "/ontdek?category=filmhuis",
        image:
          "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Werken",
        href: "/ontdek?category=werken",
        image:
          "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Live binnen",
        href: "/ontdek?category=indoor-live",
        image:
          "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Binnen", "Rustig", "Nu open", "Met wifi", "Populair"],
    suggestions: [
      {
        title: "Stadsmuseum collectie",
        meta: "MUSEUM • CULTUUR",
        description:
          "Ontdek lokale geschiedenis en design in een prachtig gerestaureerd gebouw.",
        href: "/ontdek/stadsmuseum-collectie",
        image:
          "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80')",
        detail: "Open tot 17:00",
      },
      {
        title: "Stille leeszaal",
        meta: "BIBLIOTHEEK • RUSTIG",
        description:
          "Een fijne plek om te lezen, werken of even uit de drukte te stappen.",
        href: "/ontdek/stille-leeszaal",
        image:
          "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80')",
        detail: "Gratis toegang",
      },
      {
        title: "Kunstkamer",
        meta: "EXPOSITIE • BINNEN",
        description:
          "Kleine, intieme expositieruimte met wisselend werk van hedendaagse makers.",
        href: "/ontdek/kunstkamer",
        image:
          "url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=80')",
        detail: "Nieuw deze week",
      },
      {
        title: "Koffie & werken",
        meta: "KOFFIE • WERKPLEK",
        description:
          "Goede koffie, veel daglicht en genoeg stopcontacten voor een productieve middag.",
        href: "/ontdek/koffie-en-werken",
        image:
          "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80')",
        detail: "Wifi beschikbaar",
      },
      {
        title: "Filmavond in het filmhuis",
        meta: "FILM • AVOND",
        description:
          "Een arthouse-selectie in een sfeervolle zaal met comfortabele stoelen.",
        href: "/ontdek/filmavond-in-het-filmhuis",
        image:
          "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80')",
        detail: "Start 20:00",
      },
      {
        title: "Wellnessmoment",
        meta: "RUST • WELLNESS",
        description:
          "Ontspan met sauna, stoombad en rustige loungeplekken midden in de stad.",
        href: "/ontdek/wellnessmoment",
        image:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf €19,50",
      },
    ],
  },

  buiten: {
    label: "Buiten",
    headline: "Waar wil je buiten naartoe?",
    description:
      "Voor frisse lucht, beweging en mooie plekken. Kies iets actiefs of juist iets ontspannen in de open lucht.",
    quickChoices: [
      {
        title: "Park",
        href: "/ontdek?category=park",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "BUITEN",
      },
      {
        title: "Wandeling",
        href: "/ontdek?category=wandeling",
        image:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Terras",
        href: "/ontdek?category=terras",
        image:
          "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Boottocht",
        href: "/ontdek?category=boottocht",
        image:
          "url('https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Zonsondergang",
        href: "/ontdek?category=zonsondergang",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Actief",
        href: "/ontdek?category=actief",
        image:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Picknick",
        href: "/ontdek?category=picknick",
        image:
          "url('https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Markt",
        href: "/ontdek?category=markt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Buiten", "Dichtbij", "Nu open", "Actief", "Zonnig"],
    suggestions: [
      {
        title: "Stadspark wandeling",
        meta: "BUITEN • WANDELING",
        description:
          "Een groene route met rustige paden, water en fijne plekken om even te zitten.",
        href: "/ontdek/stadspark-wandeling",
        image:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80')",
        detail: "35 minuten",
      },
      {
        title: "Terras aan de kade",
        meta: "TERRAS • RELAX",
        description:
          "Perfecte plek voor een drankje in de zon met uitzicht op voorbijvarende boten.",
        href: "/ontdek/terras-aan-de-kade",
        image:
          "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80')",
        detail: "Nu open",
      },
      {
        title: "Picknickplek in het park",
        meta: "PARK • RUSTIG",
        description:
          "Een rustige groene plek voor een ontspannen middag met vrienden of familie.",
        href: "/ontdek/picknickplek-in-het-park",
        image:
          "url('https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=1200&q=80')",
        detail: "Gratis",
      },
      {
        title: "Boottocht langs de oude stad",
        meta: "WATER • STAD",
        description:
          "Een mooie tocht langs historische gevels en kleine bruggen.",
        href: "/ontdek/boottocht-langs-de-oude-stad",
        image:
          "url('https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf €11,00",
      },
      {
        title: "Avondroute met uitzicht",
        meta: "ZONSONDERGANG • BUITEN",
        description:
          "Eindig de dag op een plek waar je de stad langzaam ziet oplichten.",
        href: "/ontdek/avondroute-met-uitzicht",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
        detail: "Beste rond 20:30",
      },
      {
        title: "Lokale bloemenmarkt",
        meta: "MARKT • LOKAAL",
        description:
          "Kleine, kleurrijke markt met bloemen, lokale producten en fijne sfeer.",
        href: "/ontdek/lokale-bloemenmarkt",
        image:
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80')",
        detail: "Tot 16:00",
      },
    ],
  },

  romantisch: {
    label: "Romantisch",
    headline: "Wat is leuk om samen te doen?",
    description:
      "Voor date night, een rustige middag samen of een bijzondere avond. Kies iets sfeervols en memorabels.",
    quickChoices: [
      {
        title: "Date diner",
        href: "/ontdek?category=date-diner",
        image:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')",
        size: "large",
        badge: "DATE NIGHT",
      },
      {
        title: "Wijnbar",
        href: "/ontdek?category=wijnbar",
        image:
          "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Zonsondergang",
        href: "/ontdek?category=zonsondergang",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Wandeling",
        href: "/ontdek?category=romantische-wandeling",
        image:
          "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Cocktails",
        href: "/ontdek?category=cocktails",
        image:
          "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Klein concert",
        href: "/ontdek?category=concert",
        image:
          "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Spa",
        href: "/ontdek?category=spa",
        image:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80')",
      },
      {
        title: "Boutique hotel",
        href: "/ontdek?category=boutique-hotel",
        image:
          "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80')",
      },
    ],
    filters: ["Romantisch", "Avond", "Bijzonder", "Binnen", "Buiten"],
    suggestions: [
      {
        title: "Diner bij kaarslicht",
        meta: "DINER • ROMANTISCH",
        description:
          "Kleine tafels, warme verlichting en een menu voor een lange avond samen.",
        href: "/ontdek/diner-bij-kaarslicht",
        image:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')",
        detail: "Reserveren aanbevolen",
      },
      {
        title: "Wijnbar met kleine bites",
        meta: "WIJN • AVOND",
        description:
          "Een intieme plek met zachte muziek en een mooie selectie natuurwijnen.",
        href: "/ontdek/wijnbar-met-kleine-bites",
        image:
          "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf €8 per glas",
      },
      {
        title: "Avondwandeling langs het water",
        meta: "BUITEN • RUSTIG",
        description:
          "Een kalme route voor een gesprek zonder drukte, met mooie lichtjes langs de kade.",
        href: "/ontdek/avondwandeling-langs-het-water",
        image:
          "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80')",
        detail: "45 minuten",
      },
      {
        title: "Sunset viewpoint",
        meta: "UITZICHT • BUITEN",
        description:
          "Een bijzondere plek om samen de zon achter de stad te zien verdwijnen.",
        href: "/ontdek/sunset-viewpoint",
        image:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
        detail: "Beste rond 20:40",
      },
      {
        title: "Intiem jazzconcert",
        meta: "MUZIEK • AVOND",
        description:
          "Kleine zaal, live muziek en een sfeer die meteen goed voelt voor een date.",
        href: "/ontdek/intiem-jazzconcert",
        image:
          "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80')",
        detail: "Begint om 21:00",
      },
      {
        title: "Boutique stay",
        meta: "OVERNACHTEN • BIJZONDER",
        description:
          "Voor wie van de avond iets echt speciaals wil maken met een overnachting.",
        href: "/ontdek/boutique-stay",
        image:
          "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80')",
        detail: "Vanaf €149 per nacht",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(categoryPageContent).map((category) => ({
    category,
  }));
}

export default function InspirationCategoryPage({ params }: PageProps) {
  const content = categoryPageContent[params.category];

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#111111]">
      <header className="border-b border-black/5 bg-[#f6f4ef]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 md:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] text-black"
          >
            Radiant Curator
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/inspiratie"
              className="border-b border-black pb-1 text-xs font-medium text-black"
            >
              Discover
            </Link>
            <Link
              href="/culturele-momenten"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Cultural Moments
            </Link>
            <Link
              href="/lokale-gidsen"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Local Guides
            </Link>
            <Link
              href="/verhalen"
              className="text-xs text-black/55 transition hover:text-black"
            >
              Stories
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Zoeken"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-black/5"
            >
              <SearchIcon />
            </button>

            <Link
              href="/club"
              className="hidden rounded-full bg-[#bde28d] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#aed97a] md:inline-flex"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[620px]">
            <p className="mb-3 text-sm font-medium text-black/45">
              {content.label}
            </p>

            <h1 className="max-w-[560px] text-[2.6rem] font-black leading-[0.92] tracking-[-0.05em] text-black md:text-[4.25rem]">
              {content.headline}
            </h1>

            <p className="mt-5 max-w-[540px] text-sm leading-6 text-black/55 md:text-base">
              {content.description}
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-[1.6rem] font-bold tracking-[-0.04em] text-black">
              Snelle keuzes
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
              {content.quickChoices.map((item, index) => {
                const isLarge = item.size === "large";

                return (
                  <Link
                    key={`${item.title}-${index}`}
                    href={item.href}
                    className={`group relative overflow-hidden rounded-[28px] ${
                      isLarge
                        ? "col-span-2 min-h-[320px] lg:col-span-1 lg:row-span-2 lg:min-h-[520px]"
                        : "min-h-[180px] md:min-h-[210px]"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.10)), ${item.image}`,
                      }}
                    />

                    <div className="absolute inset-0 p-4 md:p-5">
                      <div className="flex h-full flex-col justify-end">
                        {item.badge ? (
                          <span className="mb-3 inline-flex w-fit rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                            {item.badge}
                          </span>
                        ) : null}

                        <span className="text-lg font-bold tracking-[-0.03em] text-white md:text-xl">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-8 md:pb-14">
        <div className="mx-auto max-w-[1280px] rounded-[36px] bg-[#efe5dc] px-5 py-8 md:px-8 md:py-10">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.04em] text-black">
            Verfijn je keuze
          </h2>
          <p className="mt-2 text-sm text-black/45">
            Selecteer wat voor jou belangrijk is.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {content.filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                  index === 0
                    ? "bg-[#bde28d] text-black"
                    : "bg-white text-black/75 hover:bg-black/5"
                }`}
              >
                <FilterDotIcon />
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-black">
                Suggesties
              </h2>
              <p className="mt-1 text-sm text-black/45">
                Aanraders voor vandaag geselecteerd door onze curators.
              </p>
            </div>

            <Link
              href="/ontdek"
              className="text-xs font-semibold text-black underline decoration-[#bde28d] decoration-2 underline-offset-4"
            >
              Bekijk alles
            </Link>
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {content.suggestions.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-[26px]">
                  <div
                    className="aspect-[0.9/1] w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: item.image,
                    }}
                  />

                  {item.badge ? (
                    <span className="absolute left-4 top-4 inline-flex rounded-full bg-[#c4e78f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <div className="pt-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/45">
                    {item.meta}
                  </p>

                  <h3 className="mt-2 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/55">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-black">
                    <PinIcon />
                    <span>{item.detail}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#111111] px-4 py-10 text-white md:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-[-0.03em] text-white"
            >
              Radiant Curator
            </Link>

            <p className="mt-5 max-w-[240px] text-xs leading-6 text-white/60">
              © 2024 Radiant Curator. Formed as essential cultural moments. De
              gids voor jouw stad.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7f0ae]">
              Verken
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link href="/manifest" className="transition hover:text-white">
                The Manifesto
              </Link>
              <Link href="/editorial-policy" className="transition hover:text-white">
                Editorial Policy
              </Link>
              <Link href="/curator-access" className="transition hover:text-white">
                Curator Access
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7f0ae]">
              Informatie
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy & Terms
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
              <Link href="/over-ons" className="transition hover:text-white">
                Over ons
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7f0ae]">
              Stay radiant
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                aria-label="Instagram"
              >
                <AtIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                aria-label="Delen"
              >
                <ShareIcon />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function FilterDotIcon() {
  return (
    <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M16 12v-2a4 4 0 1 0-4 4c1 0 1.9-.4 2.6-1.1" />
      <path d="M16 8v6c0 1 .7 1.8 1.7 1.8 1 0 1.8-.8 1.8-1.8V12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.7 11 15.3 6.8" />
      <path d="M8.7 13 15.3 17.2" />
    </svg>
  );
}