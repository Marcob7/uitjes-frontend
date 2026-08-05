const faqSections = [
  {
    label: "Algemeen",
    items: [
      {
        question: "Wat is UitjesNL?",
        answer:
          "UitjesNL is een webapp waarmee je leuke uitjes, activiteiten, evenementen, festivals en plekken om te eten of drinken in Nederland kunt ontdekken. De app helpt je sneller kiezen op basis van stad, moment, sfeer en interesse.",
      },
      {
        question: "Hoe werkt zoeken?",
        answer:
          "Je kunt zoeken op woorden zoals een activiteit, evenement, categorie of stad. Als je zoekopdracht goed bij een stad past, sturen we je waar mogelijk naar de ontdekpagina van die stad. Anders tonen we algemene zoekresultaten die passen bij je vraag.",
      },
      {
        question: "Hoe kies ik een stad?",
        answer:
          "Op ontdekpagina's kun je een stad kiezen via de stadselectie of via een zoekopdracht. Daarna zie je uitjes en plekken die bij die stad horen. Niet elke stad heeft evenveel informatie; dat hangt af van de beschikbare bronnen en wat al is toegevoegd.",
      },
      {
        question: "Wat is /ontdek?",
        answer:
          "/ontdek is de plek waar je per stad uitjes, evenementen, restaurants en andere locaties kunt bekijken. Je kunt filteren, zoeken en doorklikken naar details als die beschikbaar zijn.",
      },
      {
        question: "Wat is /inspiratie?",
        answer:
          "/inspiratie helpt je kiezen als je nog niet precies weet wat je wilt doen. Je beantwoordt een paar korte keuzes, waarna UitjesNL passende ideeen en routes naar relevante content toont.",
      },
      {
        question: "Wat is de jaarkalender?",
        answer:
          "De jaarkalender bundelt grotere momenten, festivals en culturele hoogtepunten door het jaar heen. Hij is bedoeld als rustige startplek voor plannen op datum, seizoen of periode.",
      },
    ],
  },
  {
    label: "Bewaren",
    items: [
      {
        question: "Hoe werken favorieten?",
        answer:
          "Bij veel uitjes kun je een item bewaren als favoriet. Zo bouw je een eigen lijst op met plekken en plannen die je later terug wilt vinden.",
      },
      {
        question: "Moet ik inloggen om iets te bewaren?",
        answer:
          "Voor tijdelijk bewaren kan de app favorieten lokaal onthouden. Wil je favorieten betrouwbaarder bewaren en later op een ander moment terugzien, dan kan inloggen nodig zijn zodra die functie beschikbaar is voor jouw gebruik.",
      },
    ],
  },
  {
    label: "Updates",
    items: [
      {
        question: "Hoe werkt de nieuwsbrief?",
        answer:
          "Via nieuwsbriefinschrijvingen kun je updates ontvangen over bijvoorbeeld festivals of nieuwe uitjes. Je kiest waar mogelijk zelf je voorkeuren. Nieuwsbrieven worden alleen verstuurd wanneer er relevante content en een geldige inschrijving beschikbaar zijn.",
      },
      {
        question: "Kan ik tickets kopen via UitjesNL?",
        answer:
          "UitjesNL is vooral bedoeld om te ontdekken en te plannen. Als er ticketinformatie of een bronlink beschikbaar is, verwijzen we je door naar de aanbieder of organisator. De aankoop en voorwaarden lopen dan via die externe partij.",
      },
    ],
  },
  {
    label: "Informatie",
    items: [
      {
        question: "Waar komen uitjes/evenementen vandaan?",
        answer:
          "Informatie kan afkomstig zijn uit beschikbare publieke bronnen, aangeleverde data, redactionele aanvullingen en gegevens van organisatoren of locaties. Welke bron gebruikt is, kan per uitje verschillen.",
      },
      {
        question: "Hoe actueel en betrouwbaar is de informatie?",
        answer:
          "We proberen informatie duidelijk en bruikbaar te tonen, maar data kan wijzigen en is afhankelijk van beschikbare bronnen. Controleer bij belangrijke plannen altijd ook de website van de organisator of locatie voor de laatste details.",
      },
      {
        question: "Wat als informatie niet klopt?",
        answer:
          "Zie je een fout, verlopen datum, verkeerde prijs of ontbrekende informatie? Laat het ons weten via de bestaande feedback- of contactmogelijkheden. Dan kunnen we de melding beoordelen en de informatie waar nodig aanpassen.",
      },
      {
        question: "Hoe kan ik contact of feedback geven?",
        answer:
          "Je kunt feedback geven via de feedbackpagina of contact opnemen via de contactpagina als die voor jouw route beschikbaar is. Een korte tip met de link of naam van het uitje is vaak al genoeg.",
      },
    ],
  },
];

export const metadata = {
  title: "Veelgestelde vragen | UitjesNL",
  description:
    "Lees hoe UitjesNL werkt, hoe je zoekt, steden kiest, favorieten bewaart en waar informatie over uitjes en evenementen vandaan komt.",
  alternates: {
    canonical: "/faq",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5f3] text-[#151515] mt-18">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative isolate overflow-hidden bg-[#faf9f7] px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute -left-12 bottom-2 hidden h-36 w-44 rotate-[-7deg] overflow-hidden rounded-[2rem] rounded-bl-none shadow-[0_22px_46px_rgba(38,29,22,0.16)] sm:block lg:h-48 lg:w-56">
          <img
            src="/images/homepage-festival-background.webp"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#c9f18a]/18" />
        </div>
        <div className="pointer-events-none absolute -right-10 top-4 hidden h-40 w-52 rotate-[10deg] overflow-hidden rounded-[2.2rem] rounded-tr-none shadow-[0_22px_46px_rgba(38,29,22,0.18)] sm:block lg:h-56 lg:w-72">
          <img
            src="/images/julianatoren.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#111]/10" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="mx-auto max-w-[12ch] text-[clamp(3rem,8vw,5.7rem)] font-bold leading-[0.94] tracking-[-0.055em] text-[#171717]">
            Hoe kunnen we je{" "}
            <span className="block font-semibold italic text-[#3f6f25]">
              helpen?
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#666058] sm:text-base">
            Vind snel antwoord over UitjesNL, zoeken, steden, favorieten,
            nieuwsbrieven en informatie die regelmatig kan wijzigen.
          </p>

          <form
            action="/zoeken"
            className="mt-8 flex w-full max-w-[42rem] items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-4 py-2 shadow-[0_14px_35px_rgba(31,27,23,0.07)] sm:px-5"
          >
            <label htmlFor="faq-search" className="sr-only">
              Zoek een onderwerp
            </label>
            <svg
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-[#27231f]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m21 21-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <input
              id="faq-search"
              name="query"
              type="search"
              placeholder="Zoek een onderwerp..."
              className="min-h-11 min-w-0 flex-1 bg-transparent px-1 text-base text-[#171717] outline-none placeholder:text-[#a7a19a]"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#c8f39a] px-6 text-sm font-bold text-[#315120] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] transition hover:bg-[#bdf083] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ea23f]/60 sm:px-8"
            >
              Zoek
            </button>
          </form>
        </div>
      </section>

      <nav
        aria-label="FAQ categorieen"
        className="border-y border-[#ece9e5] bg-[#f1eeee] px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 sm:gap-4">
          {faqSections.map((section, index) => (
            <a
              key={section.label}
              href={`#${section.label.toLowerCase()}`}
              className={`inline-flex min-h-12 items-center rounded-full px-7 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ea23f]/60 ${
                index === 0
                  ? "bg-[#c8f39a] text-[#46682d]"
                  : "bg-white text-[#171717] hover:bg-[#fbfaf7]"
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        id="faq-antwoorden"
        className="bg-[#f7f5f3] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-[54rem] gap-12">
          {faqSections.map((section) => (
            <section
              key={section.label}
              id={section.label.toLowerCase()}
              className="scroll-mt-28"
            >
              <h2 className="sr-only">{section.label}</h2>
              <div className="grid gap-4">
                {section.items.map((item, index) => (
                  <details
                    key={item.question}
                    className="group rounded-[1.6rem] bg-white px-5 shadow-[0_12px_34px_rgba(29,24,19,0.035)] ring-1 ring-[#eee9e3]/60 open:pb-5 sm:rounded-[1.8rem] sm:px-7"
                    open={section.label === "Algemeen" && index === 0}
                  >
                    <summary className="flex min-h-[4.75rem] cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-bold tracking-[-0.018em] text-[#171717] outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-[#6ea23f]/50 sm:text-lg [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-[#245d22] transition group-open:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="m7 10 5 5 5-5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                        />
                      </svg>
                    </summary>
                    <p className="max-w-3xl pb-1 text-sm leading-7 text-[#665f57] sm:text-base sm:leading-8">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f5f3] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#c8f39a] px-6 py-12 text-center text-[#46682d] sm:rounded-[2.5rem] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-[#aee47d]/55 sm:h-44 sm:w-44" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#b4e982]/65 sm:h-56 sm:w-56" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="mx-auto max-w-none text-[clamp(1.8rem,4vw,2.4rem)] font-bold leading-tight tracking-[-0.035em] text-[#46682d]">
              Niet gevonden wat je zocht?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#51713a] sm:text-base">
              Stuur ons een tip of melding. Dat helpt om informatie over
              uitjes, evenementen en steden duidelijker te maken.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#46682d] px-7 text-sm font-bold text-white shadow-[0_12px_22px_rgba(61,93,38,0.22)] transition hover:bg-[#385524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#46682d]/45"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                E-mail ons
              </a>
              <a
                href="/feedback"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#46682d]/14 bg-white px-7 text-sm font-bold text-[#46682d] shadow-[0_10px_20px_rgba(61,93,38,0.12)] transition hover:bg-[#fbfff5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#46682d]/45"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 6h14v10H8l-3 3V6Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Feedback
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
