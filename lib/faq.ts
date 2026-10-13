export type FaqCategorySlug =
  | "ontdekken"
  | "inspiratie"
  | "agenda-festivals"
  | "favorieten"
  | "account"
  | "over-uitjesnl";

export type FaqCategoryIcon =
  | "compass"
  | "sparkles"
  | "calendar"
  | "bookmark"
  | "user"
  | "info";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategorySlug;
};

export type FaqCategory = {
  slug: FaqCategorySlug;
  label: string;
  description: string;
  icon: FaqCategoryIcon;
};

export const faqCategories: FaqCategory[] = [
  {
    slug: "ontdekken",
    label: "Ontdekken",
    description: "Zo vind je een uitje dat bij je stad en moment past.",
    icon: "compass",
  },
  {
    slug: "inspiratie",
    label: "Inspiratie",
    description: "Hulp bij kiezen als je nog niet precies weet wat je wilt.",
    icon: "sparkles",
  },
  {
    slug: "agenda-festivals",
    label: "Agenda & festivals",
    description: "Alles over plannen, de kalender en ticketinformatie.",
    icon: "calendar",
  },
  {
    slug: "favorieten",
    label: "Favorieten",
    description: "Bewaar plekken en plannen om later terug te vinden.",
    icon: "bookmark",
  },
  {
    slug: "account",
    label: "Account",
    description: "Inloggen en je persoonlijke voorkeuren beheren.",
    icon: "user",
  },
  {
    slug: "over-uitjesnl",
    label: "Over UitjesNL",
    description: "Bronnen, actualiteit, betrouwbaarheid en contact.",
    icon: "info",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "wat-is-uitjesnl",
    category: "over-uitjesnl",
    question: "Wat is UitjesNL?",
    answer:
      "UitjesNL is een webapp waarmee je leuke uitjes, activiteiten, evenementen, festivals en plekken om te eten of drinken in Nederland kunt ontdekken. De app helpt je sneller kiezen op basis van stad, moment, sfeer en interesse.",
  },
  {
    id: "hoe-werkt-zoeken",
    category: "ontdekken",
    question: "Hoe werkt zoeken?",
    answer:
      "Je kunt zoeken op woorden zoals een activiteit, evenement, categorie of stad. Als je zoekopdracht goed bij een stad past, sturen we je waar mogelijk naar de ontdekpagina van die stad. Anders tonen we algemene zoekresultaten die passen bij je vraag.",
  },
  {
    id: "hoe-kies-ik-een-stad",
    category: "ontdekken",
    question: "Hoe kies ik een stad?",
    answer:
      "Op ontdekpagina's kun je een stad kiezen via de stadselectie of via een zoekopdracht. Daarna zie je uitjes en plekken die bij die stad horen. Niet elke stad heeft evenveel informatie; dat hangt af van de beschikbare bronnen en wat al is toegevoegd.",
  },
  {
    id: "wat-is-ontdek",
    category: "ontdekken",
    question: "Wat is /ontdek?",
    answer:
      "/ontdek is de plek waar je per stad uitjes, evenementen, restaurants en andere locaties kunt bekijken. Je kunt filteren, zoeken en doorklikken naar details als die beschikbaar zijn.",
  },
  {
    id: "wat-is-inspiratie",
    category: "inspiratie",
    question: "Wat is /inspiratie?",
    answer:
      "/inspiratie helpt je kiezen als je nog niet precies weet wat je wilt doen. Je beantwoordt een paar korte keuzes, waarna UitjesNL passende ideeen en routes naar relevante content toont.",
  },
  {
    id: "wat-is-de-jaarkalender",
    category: "agenda-festivals",
    question: "Wat is de jaarkalender?",
    answer:
      "De jaarkalender bundelt grotere momenten, festivals en culturele hoogtepunten door het jaar heen. Hij is bedoeld als rustige startplek voor plannen op datum, seizoen of periode.",
  },
  {
    id: "hoe-werken-favorieten",
    category: "favorieten",
    question: "Hoe werken favorieten?",
    answer:
      "Bij veel uitjes kun je een item bewaren als favoriet. Zo bouw je een eigen lijst op met plekken en plannen die je later terug wilt vinden.",
  },
  {
    id: "moet-ik-inloggen",
    category: "account",
    question: "Moet ik inloggen om iets te bewaren?",
    answer:
      "Voor tijdelijk bewaren kan de app favorieten lokaal onthouden. Wil je favorieten betrouwbaarder bewaren en later op een ander moment terugzien, dan kan inloggen nodig zijn zodra die functie beschikbaar is voor jouw gebruik.",
  },
  {
    id: "hoe-werkt-de-nieuwsbrief",
    category: "agenda-festivals",
    question: "Hoe werkt de nieuwsbrief?",
    answer:
      "Via nieuwsbriefinschrijvingen kun je updates ontvangen over bijvoorbeeld festivals of nieuwe uitjes. Je kiest waar mogelijk zelf je voorkeuren. Nieuwsbrieven worden alleen verstuurd wanneer er relevante content en een geldige inschrijving beschikbaar zijn.",
  },
  {
    id: "kan-ik-tickets-kopen",
    category: "agenda-festivals",
    question: "Kan ik tickets kopen via UitjesNL?",
    answer:
      "UitjesNL is vooral bedoeld om te ontdekken en te plannen. Als er ticketinformatie of een bronlink beschikbaar is, verwijzen we je door naar de aanbieder of organisator. De aankoop en voorwaarden lopen dan via die externe partij.",
  },
  {
    id: "waar-komen-uitjes-vandaan",
    category: "over-uitjesnl",
    question: "Waar komen uitjes/evenementen vandaan?",
    answer:
      "Informatie kan afkomstig zijn uit beschikbare publieke bronnen, aangeleverde data, redactionele aanvullingen en gegevens van organisatoren of locaties. Welke bron gebruikt is, kan per uitje verschillen.",
  },
  {
    id: "hoe-actueel-is-de-informatie",
    category: "over-uitjesnl",
    question: "Hoe actueel en betrouwbaar is de informatie?",
    answer:
      "We proberen informatie duidelijk en bruikbaar te tonen, maar data kan wijzigen en is afhankelijk van beschikbare bronnen. Controleer bij belangrijke plannen altijd ook de website van de organisator of locatie voor de laatste details.",
  },
  {
    id: "wat-als-informatie-niet-klopt",
    category: "over-uitjesnl",
    question: "Wat als informatie niet klopt?",
    answer:
      "Zie je een fout, verlopen datum, verkeerde prijs of ontbrekende informatie? Laat het ons weten via de bestaande feedback- of contactmogelijkheden. Dan kunnen we de melding beoordelen en de informatie waar nodig aanpassen.",
  },
  {
    id: "contact-of-feedback",
    category: "over-uitjesnl",
    question: "Hoe kan ik contact of feedback geven?",
    answer:
      "Je kunt feedback geven via de feedbackpagina of contact opnemen via de contactpagina als die voor jouw route beschikbaar is. Een korte tip met de link of naam van het uitje is vaak al genoeg.",
  },
];

const englishFaqCategories: FaqCategory[] = [
  { slug: "ontdekken", label: "Discover", description: "How to find an outing that suits your city and plans.", icon: "compass" },
  { slug: "inspiratie", label: "Inspiration", description: "Help choosing when you do not know exactly what you want yet.", icon: "sparkles" },
  { slug: "agenda-festivals", label: "Calendar & festivals", description: "Everything about planning, the calendar and ticket information.", icon: "calendar" },
  { slug: "favorieten", label: "Saved items", description: "Save places and plans to find again later.", icon: "bookmark" },
  { slug: "account", label: "Account", description: "Signing in and managing your personal preferences.", icon: "user" },
  { slug: "over-uitjesnl", label: "About UitjesNL", description: "Sources, accuracy, reliability and contact.", icon: "info" },
];

const englishFaqItems: FaqItem[] = [
  { id: "wat-is-uitjesnl", category: "over-uitjesnl", question: "What is UitjesNL?", answer: "UitjesNL is a web app for discovering fun outings, activities, events, festivals and places to eat or drink in the Netherlands. It helps you choose based on city, timing, atmosphere and interests." },
  { id: "hoe-werkt-zoeken", category: "ontdekken", question: "How does search work?", answer: "You can search for an activity, event, category or city. When your search matches a city, we direct you to that city’s discovery page where possible. Otherwise, we show general results that match your query." },
  { id: "hoe-kies-ik-een-stad", category: "ontdekken", question: "How do I choose a city?", answer: "On discovery pages, choose a city using the city selector or a search query. You will then see outings and places for that city. The amount of information can vary by city and available sources." },
  { id: "wat-is-ontdek", category: "ontdekken", question: "What is /ontdek?", answer: "/ontdek is where you can browse outings, events, restaurants and other locations by city. You can filter, search and open details when they are available." },
  { id: "wat-is-inspiratie", category: "inspiratie", question: "What is /inspiratie?", answer: "/inspiratie helps you choose when you are not sure what to do yet. Answer a few short questions and UitjesNL suggests fitting ideas and routes to relevant content." },
  { id: "wat-is-de-jaarkalender", category: "agenda-festivals", question: "What is the year calendar?", answer: "The year calendar brings together larger events, festivals and cultural highlights throughout the year. It is a calm starting point for planning by date, season or period." },
  { id: "hoe-werken-favorieten", category: "favorieten", question: "How do saved items work?", answer: "For many outings, you can save an item. This creates your own list of places and plans you would like to find again later." },
  { id: "moet-ik-inloggen", category: "account", question: "Do I need to sign in to save something?", answer: "The app can remember saved items locally for a while. Signing in may be needed when you want to keep them more reliably and view them at another time or on another device." },
  { id: "hoe-werkt-de-nieuwsbrief", category: "agenda-festivals", question: "How does the newsletter work?", answer: "Newsletter sign-ups can provide updates about festivals or new outings. Where possible, you choose your own preferences. Newsletters are sent only when relevant content and a valid subscription are available." },
  { id: "kan-ik-tickets-kopen", category: "agenda-festivals", question: "Can I buy tickets through UitjesNL?", answer: "UitjesNL is primarily for discovering and planning. When ticket information or a source link is available, we refer you to the provider or organiser. Purchases and terms are handled by that external party." },
  { id: "waar-komen-uitjes-vandaan", category: "over-uitjesnl", question: "Where do outings and events come from?", answer: "Information can come from public sources, supplied data, editorial additions and details from organisers or venues. The source can differ per outing." },
  { id: "hoe-actueel-is-de-informatie", category: "over-uitjesnl", question: "How current and reliable is the information?", answer: "We aim to present information clearly and usefully, but data can change and depends on available sources. For important plans, always check the organiser’s or venue’s website for the latest details." },
  { id: "wat-als-informatie-niet-klopt", category: "over-uitjesnl", question: "What if information is incorrect?", answer: "If you see an error, expired date, incorrect price or missing information, let us know through the available feedback or contact options. We can then review the report and update information where needed." },
  { id: "contact-of-feedback", category: "over-uitjesnl", question: "How can I contact you or give feedback?", answer: "You can give feedback via the feedback page or contact us through the contact page when it is available for your route. A short tip with a link or the name of the outing is often enough." },
];

const faqContentByLocale = {
  nl: { categories: faqCategories, items: faqItems },
  en: { categories: englishFaqCategories, items: englishFaqItems },
} as const;

export function getFaqContent(locale: "nl" | "en") {
  return faqContentByLocale[locale];
}
