export const newsCategoryDefinitions = [
  { label: "Nieuws", queryValue: "nieuws" },
  { label: "Inspiratie", queryValue: "inspiratie" },
  { label: "Festivals", queryValue: "festivals" },
  { label: "Steden", queryValue: "steden" },
  { label: "Seizoenstips", queryValue: "seizoenstips" },
  { label: "Platformupdates", queryValue: "platformupdates" },
  { label: "Praktische gidsen", queryValue: "praktische-gidsen" },
] as const;

export type NewsCategory = (typeof newsCategoryDefinitions)[number]["label"];

export type ArticleSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "callout"; title?: string; text: string };

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  author?: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  content: ArticleSection[];
};

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&fm=webp&w=1800&q=82`;

export const newsArticles: NewsArticle[] = [
  {
    slug: "de-magie-van-de-vroege-ochtend",
    title: "De Magie van de Vroege Ochtend: Wandelen in de Mist",
    excerpt:
      "Er is iets magisch aan de natuur wanneer de rest van de wereld nog slaapt. Een rustige wandeling in de ochtend geeft ruimte aan je hoofd én aan wat je onderweg ziet.",
    category: "Inspiratie",
    publishedAt: "2026-07-17",
    readingTime: 6,
    author: "Eva de Berg",
    image: unsplash("photo-1441974231531-c6227db76b6e"),
    imageAlt: "Zonlicht tussen bomen in een bosrijke ochtend",
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "De ochtend heeft een eigen ritme. Nog voor de eerste drukte op gang komt, zijn paden stiller, geuren scherper en lijken bekende plekken net iets meer geheim te dragen.",
      },
      {
        type: "paragraph",
        text: "Je hoeft er geen verre tocht voor te plannen. Een park aan de rand van de stad, een dijk langs het water of een bospad dat je al kent, kan genoeg zijn om de dag anders te beginnen.",
      },
      { type: "heading", level: 2, text: "De stilte voor de storm" },
      {
        type: "paragraph",
        text: "Vroeg wandelen gaat niet om kilometers maken. Het is een kleine afspraak met jezelf: telefoon op stil, een warme laag aan en tempo omlaag. Juist wanneer er nog weinig gebeurt, merk je hoeveel er wel beweegt.",
      },
      {
        type: "image",
        src: unsplash("photo-1500534314209-a25ddb2bd429"),
        alt: "Wandelpad door een groen landschap in zacht ochtendlicht",
        caption: "Kies een bekende route en kijk er eens op een ander moment naar.",
      },
      {
        type: "quote",
        text: "In de stilte van de ochtend vind je de antwoorden die overdag verder lijken te liggen.",
      },
      { type: "heading", level: 2, text: "Klein voorbereiden, groot verschil" },
      {
        type: "list",
        items: [
          "Kies een route van maximaal een uur; dan blijft de drempel laag.",
          "Leg je jas, schoenen en een fles water de avond ervoor klaar.",
          "Neem één moment om stil te staan, zonder foto of volgende bestemming.",
        ],
      },
      {
        type: "callout",
        title: "Wist je dit?",
        text: "In de zomer is het licht vaak al voor zes uur zacht genoeg voor een veilige, rustige wandeling. Check bij natuurgebieden wel altijd de toegangsregels.",
      },
      {
        type: "paragraph",
        text: "Wanneer je uiteindelijk terugkeert naar huis, ben je niet alleen fysiek wakker. De rest van de dag kan nog alle kanten op, maar je hebt al iets meegemaakt dat alleen aan die stille uren toebehoort.",
      },
    ],
  },
  {
    slug: "nieuwe-functie-plan-je-uitjes-in-de-agenda",
    title: "Nieuwe functie: plan je uitjes in de agenda",
    excerpt:
      "Van vandaag kun je je favoriete activiteiten toevoegen aan je persoonlijke agenda, zonder losse notities of screenshots.",
    category: "Nieuws",
    publishedAt: "2026-07-14",
    readingTime: 3,
    author: "Team Uitjes",
    content: [
      {
        type: "paragraph",
        text: "Een goed idee is pas echt handig wanneer je het makkelijk terugvindt. Daarom kun je interessante uitjes nu vanuit de kalender rechtstreeks aan je planning toevoegen.",
      },
      { type: "heading", level: 2, text: "Zo werkt het" },
      {
        type: "list",
        items: [
          "Open een evenement of uitje dat je wilt onthouden.",
          "Kies de actie om het moment aan je agenda toe te voegen.",
          "Controleer datum en tijd, en plan daarna zonder omweg verder.",
        ],
      },
      {
        type: "callout",
        title: "Goed om te weten",
        text: "Een agenda-item verandert niets aan een reservering of ticket. Controleer praktische informatie altijd bij de organisator.",
      },
      {
        type: "paragraph",
        text: "We blijven de kalender stap voor stap uitbreiden. Zo wordt het steeds eenvoudiger om een leuk idee om te zetten in een plan dat ook echt doorgaat.",
      },
    ],
  },
  {
    slug: "verborgen-parels-in-haarlem",
    title: "Verborgen parels in Haarlem: binnen de singels",
    excerpt:
      "Haarlem is meer dan de Grote Markt. Ontdek kleine hofjes, stille stegen en plekken waar je net wat langer wilt blijven.",
    category: "Steden",
    publishedAt: "2026-07-09",
    readingTime: 5,
    author: "Mila van Dijk",
    image: unsplash("photo-1512453979798-5ea266f8880c"),
    imageAlt: "Gezellig terras aan een stadsgracht",
    content: [
      {
        type: "paragraph",
        text: "Wie Haarlem te voet verkent, hoeft niet ver van de bekende straten af te wijken om een andere kant van de stad te zien. De mooiste omwegen liggen vaak maar één zijstraat verder.",
      },
      { type: "heading", level: 2, text: "Begin zonder route" },
      {
        type: "paragraph",
        text: "Start bij de Grote Markt, maar laat je daarna leiden door openstaande poorten, kleine bruggen en het geluid van een rustige binnenplaats. Dat is precies het soort stad waar verdwalen een goed plan is.",
      },
      {
        type: "quote",
        text: "De fijnste stadsdag heeft niet altijd een lijstje nodig, wel genoeg tijd om af te slaan.",
        attribution: "Mila van Dijk",
      },
      { type: "heading", level: 2, text: "Drie kleine omwegen" },
      {
        type: "list",
        items: [
          "Loop via een hofje en houd rekening met de rust van bewoners.",
          "Plan een koffiestop buiten de drukste winkelstraten.",
          "Bewaar ruimte voor het Teylers Museum of een onverwachte galerie.",
        ],
      },
    ],
  },
  {
    slug: "duurzaamheid-centraal-in-nieuwe-maatjes",
    title: "Duurzaamheid centraal in onze nieuwe maatjes",
    excerpt:
      "Lees hoe we samen met onze partners werken aan een groener aanbod en helderdere, praktische informatie voor bezoekers.",
    category: "Platformupdates",
    publishedAt: "2026-07-03",
    readingTime: 4,
    author: "Team Uitjes",
    content: [
      {
        type: "paragraph",
        text: "Duurzame keuzes hoeven een dagje weg niet ingewikkeld te maken. Juist kleine aanwijzingen over bereikbaarheid, hergebruik en lokale makers helpen om plannen met meer aandacht te maken.",
      },
      { type: "heading", level: 2, text: "Wat er verandert" },
      {
        type: "list",
        items: [
          "Partners kunnen praktische bereikbaarheidsinformatie aanvullen.",
          "We maken ruimte voor initiatieven met een lokale of circulaire aanpak.",
          "Bij nieuwe pagina's letten we beter op heldere, bruikbare bezoekersinformatie.",
        ],
      },
      {
        type: "callout",
        title: "Een stap tegelijk",
        text: "Dit is geen keurmerk. Het is een manier om keuzes en informatie zichtbaarder te maken, zodat bezoekers zelf kunnen bepalen wat bij hun dag past.",
      },
      {
        type: "paragraph",
        text: "We horen graag welke informatie jou helpt bij het plannen. Zo blijft de ontwikkeling van het platform praktisch en dicht bij echte dagen uit.",
      },
    ],
  },
  {
    slug: "festivalzomer-zonder-haast",
    title: "Festivalzomer zonder haast: zo houd je ruimte voor het onverwachte",
    excerpt:
      "Een goed festivalplan laat ook plek voor een onverwacht podium, een rustig eetmoment en de weg terug naar huis.",
    category: "Festivals",
    publishedAt: "2026-06-26",
    readingTime: 5,
    author: "Ravi Smit",
    image: unsplash("photo-1501386761578-eac5c94b800a"),
    imageAlt: "Publiek met armen in de lucht bij een openluchtfestival",
    content: [
      {
        type: "paragraph",
        text: "Het beste festivalprogramma is zelden het programma dat je minuut voor minuut volgt. Maak een paar ankerpunten en laat de rest ontstaan tussen twee podia, vrienden en een goed gesprek.",
      },
      { type: "heading", level: 2, text: "Kies je ankerpunten" },
      {
        type: "list",
        items: [
          "Noteer maximaal drie acts die je echt niet wilt missen.",
          "Spreek één duidelijke ontmoetingsplek af voor je groep.",
          "Check vooraf de laatste trein, bus of fietsroute naar huis.",
        ],
      },
      {
        type: "paragraph",
        text: "Met een ontspannen basis krijg je precies waar je voor komt: genoeg muziek, maar ook een dag die niet voelt als een race tegen de klok.",
      },
    ],
  },
  {
    slug: "zomerse-avondwandeling-aan-het-water",
    title: "Zomerse avondwandeling aan het water",
    excerpt:
      "Wanneer de warmte zakt, verandert een bekend rondje langs de kade in een klein vakantiegevoel dichtbij huis.",
    category: "Seizoenstips",
    publishedAt: "2026-06-18",
    readingTime: 4,
    author: "Eva de Berg",
    image: unsplash("photo-1507525428034-b723cf961d3e"),
    imageAlt: "Kustlijn in warm avondlicht",
    content: [
      {
        type: "paragraph",
        text: "Op een warme dag hoeft een uitje niet groot te zijn. Wacht tot de zon lager staat, neem iets te drinken mee en kies een route waar water de richting aangeeft.",
      },
      { type: "heading", level: 2, text: "Het juiste moment" },
      {
        type: "paragraph",
        text: "Vertrek ongeveer een uur voor zonsondergang. Het licht wordt zachter, terrasjes komen tot leven en je hoeft niet te kiezen tussen een wandeling en een rustige avond.",
      },
      {
        type: "callout",
        title: "Neem mee",
        text: "Water, een extra laag voor later en iets om afval weer mee naar huis te nemen. Meer heb je meestal niet nodig.",
      },
    ],
  },
  {
    slug: "een-dag-buiten-plannen-met-wisselvallig-weer",
    title: "Een dag buiten plannen met wisselvallig weer",
    excerpt:
      "Met een flexibel beginpunt, een goed binnenadres en een plan B blijft een buitendag leuk, ook als de lucht omslaat.",
    category: "Praktische gidsen",
    publishedAt: "2026-06-11",
    readingTime: 7,
    author: "Noor Jansen",
    image: unsplash("photo-1500530855697-b586d89ba3ee"),
    imageAlt: "Groen berglandschap onder een bewolkte lucht",
    content: [
      {
        type: "paragraph",
        text: "Wisselvallig weer vraagt niet om een afgelaste dag, maar om een plan met ademruimte. Kies geen route die alleen op één perfect uur werkt en je houdt veel meer plezier over.",
      },
      { type: "heading", level: 2, text: "Bouw een plan in drie delen" },
      {
        type: "list",
        items: [
          "Begin buiten op een plek waar je gemakkelijk kunt inkorten.",
          "Kies vooraf één fijn binnenadres voor lunch, koffie of cultuur.",
          "Bewaar een tweede buitenmoment voor als de bui voorbijtrekt.",
        ],
      },
      {
        type: "paragraph",
        text: "Zo voelt regen niet als een mislukking, maar als een reden om op een andere plek langer te blijven. En precies daar ontstaan vaak de beste herinneringen.",
      },
    ],
  },
];

function sortByPublishedAt(articles: NewsArticle[]) {
  return [...articles].sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  );
}

export function getNewsArticles(category?: NewsCategory) {
  const articles = category
    ? newsArticles.filter((article) => article.category === category)
    : newsArticles;

  return sortByPublishedAt(articles);
}

export function getNewsArticleBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug) ?? null;
}

export function getNewsCategories() {
  const availableCategories = new Set(newsArticles.map((article) => article.category));

  return newsCategoryDefinitions.filter(({ label }) => availableCategories.has(label));
}

export function getNewsCategoryByQueryValue(value?: string | null) {
  if (!value) return null;

  return (
    newsCategoryDefinitions.find(({ queryValue }) => queryValue === value.toLowerCase())
      ?.label ?? null
  );
}

export function getFeaturedNewsArticle(category?: NewsCategory) {
  const articles = getNewsArticles(category);

  return articles.find((article) => article.featured) ?? articles[0] ?? null;
}

export function getRelatedNewsArticles(article: NewsArticle, limit = 3) {
  const otherArticles = getNewsArticles().filter((item) => item.slug !== article.slug);
  const sameCategory = otherArticles.filter((item) => item.category === article.category);
  const related = [...sameCategory, ...otherArticles.filter((item) => item.category !== article.category)];

  return related.slice(0, limit);
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
