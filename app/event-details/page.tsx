"use client";

import { useMemo, useState } from "react";
import {
  buildMapsSearchHref,
  buildTicketSearchHref,
} from "@/lib/actionLinks";

type ProgramItem = {
  time: string;
  title: string;
  description: string;
  color: string;
};

type TicketItem = {
  label: string;
  description: string;
  price: string;
  highlight?: boolean;
};

type EventItem = {
  id: number;
  category: string;
  title: string;
  shortDescription: string;
  longDescription: string[];
  dateLabel: string;
  timeLabel: string;
  locationName: string;
  locationAddress: string;
  city: string;
  quote: string;
  quoteAuthor: string;
  image: string;
  tags: string[];
  program: ProgramItem[];
  tickets: TicketItem[];
};

const dummyEvents: EventItem[] = [
  {
    id: 1,
    category: "Kunst & Licht",
    title: "Echoes of the Neon Cathedral",
    shortDescription:
      "Een meeslepende audio-visuele ervaring die de grenzen tussen gotische architectuur en futuristische lichtkunst doet vervagen in het hart van Amsterdam.",
    longDescription: [
      "Stap binnen in de transformatie van de Oude Kerk. Voor een beperkte periode wordt dit historische monument omgevormd tot een moderne lichtbeleving met projecties, soundscapes en interactieve installaties.",
      "Bezoekers dwalen vrij door de ruimte terwijl lichtpatronen reageren op omgevingsgeluid en beweging van het publiek. Daardoor voelt ieder bezoek net anders aan.",
    ],
    dateLabel: "14 – 28 nov. 2026",
    timeLabel: "20:00 – 23:30",
    locationName: "De Oude Kerk",
    locationAddress: "Oudekerksplein 23, Amsterdam",
    city: "Amsterdam",
    quote: "Een visueel meesterwerk dat je niet mag missen.",
    quoteAuthor: "Vogue NL",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
    tags: ["Immersief", "Architectuur", "Digitale kunst", "Nightlife"],
    program: [
      {
        time: "20:00 – 20:45",
        title: "The Awakening",
        description: "Introductie met ambient klanklandschappen.",
        color: "bg-[#F3E9E1]",
      },
      {
        time: "21:00 – 22:30",
        title: "Neon Pulse",
        description: "Hoofdshow met dynamische lichtchoreografie.",
        color: "bg-[#DCEFD9]",
      },
      {
        time: "22:45 – 23:30",
        title: "Silent Echoes",
        description: "Meditatieve afsluiting en vrije rondgang.",
        color: "bg-[#E6E4F3]",
      },
    ],
    tickets: [
      {
        label: "Regulier ticket",
        description: "Toegang tot de volledige ervaring",
        price: "€24,50",
      },
      {
        label: "Premium experience",
        description: "Fast track + welkomstdrankje",
        price: "€38,00",
        highlight: true,
      },
      {
        label: "Student / CJP",
        description: "Geldig ID vereist bij entree",
        price: "€18,00",
      },
    ],
  },
  {
    id: 2,
    category: "Muziek",
    title: "Midnight Jazz Sessions",
    shortDescription:
      "Een sfeervolle avond vol live jazz, cocktails en kaarslicht in een verborgen locatie aan de gracht.",
    longDescription: [
      "Midnight Jazz Sessions brengt bekende en opkomende jazzmuzikanten samen voor een intieme avond in een karakteristieke locatie.",
      "De setting is rustig en stijlvol, waardoor het perfect is voor een avond uit met vrienden of een date night.",
    ],
    dateLabel: "5 dec. 2026",
    timeLabel: "19:30 – 23:00",
    locationName: "Canal House Hall",
    locationAddress: "Prinsengracht 101, Amsterdam",
    city: "Amsterdam",
    quote: "Stijlvol, warm en muzikaal verrassend.",
    quoteAuthor: "Uit in Amsterdam",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Live muziek", "Jazz", "Avond uit", "Cocktails"],
    program: [
      {
        time: "19:30 – 20:15",
        title: "Warm Welcome",
        description: "Ontvangst met live piano en drankje.",
        color: "bg-[#F3E9E1]",
      },
      {
        time: "20:30 – 21:45",
        title: "Main Session",
        description: "Live jazz set met gastmuzikanten.",
        color: "bg-[#DCEFD9]",
      },
      {
        time: "22:00 – 23:00",
        title: "Late Night Lounge",
        description: "Vrije inloop, borrel en afsluiting.",
        color: "bg-[#E6E4F3]",
      },
    ],
    tickets: [
      {
        label: "Standaard",
        description: "Entree inclusief zitplaats",
        price: "€19,50",
      },
      {
        label: "VIP",
        description: "Vooraan zitten + welkomstcocktail",
        price: "€32,50",
        highlight: true,
      },
    ],
  },
  {
    id: 3,
    category: "Food & Drinks",
    title: "Hidden Taste Market",
    shortDescription:
      "Ontdek streetfood, lokale makers en unieke smaken tijdens een overdekte food market ervaring.",
    longDescription: [
      "Hidden Taste Market is een mix van food stands, proeverijen en kleine live-optredens in een industriële setting.",
      "Ideaal voor bezoekers die iets nieuws willen proberen en meerdere smaken op één avond willen ontdekken.",
    ],
    dateLabel: "12 dec. 2026",
    timeLabel: "16:00 – 22:00",
    locationName: "West Dock",
    locationAddress: "Havenstraat 45, Amsterdam",
    city: "Amsterdam",
    quote: "Een leuke mix van proeven, ontdekken en sfeer.",
    quoteAuthor: "Food Lovers NL",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    tags: ["Food market", "Streetfood", "Overdekt", "Weekend"],
    program: [
      {
        time: "16:00 – 18:00",
        title: "Open Market",
        description: "Vrij rondlopen langs alle stands.",
        color: "bg-[#F3E9E1]",
      },
      {
        time: "18:30 – 19:15",
        title: "Chef Spotlight",
        description: "Korte demo en tasting moment.",
        color: "bg-[#DCEFD9]",
      },
      {
        time: "20:00 – 22:00",
        title: "Evening Bites",
        description: "Live muziek en food specials.",
        color: "bg-[#E6E4F3]",
      },
    ],
    tickets: [
      {
        label: "Entree",
        description: "Toegang tot de food market",
        price: "€9,50",
      },
      {
        label: "Entree + tasting",
        description: "Inclusief 5 tasting tokens",
        price: "€17,50",
        highlight: true,
      },
    ],
  },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[#ECE9E3] px-3 py-1 text-xs font-medium text-[#2D2A26]">
      {children}
    </span>
  );
}

function InfoPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 rounded-full bg-[#9CCB6D]" />
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#7E7A74]">
          {label}
        </p>
        <p className="text-sm font-medium text-[#171717]">{value}</p>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<number>(dummyEvents[0].id);

  const selectedEvent = useMemo(() => {
    return (
      dummyEvents.find((event) => event.id === selectedEventId) ?? dummyEvents[0]
    );
  }, [selectedEventId]);

  const mapsHref = buildMapsSearchHref(selectedEvent.locationAddress);
  const reservationHref = buildTicketSearchHref(
    selectedEvent.title,
    `${selectedEvent.locationName} ${selectedEvent.city}`
  );

  return (
    <main className="min-h-screen bg-[#F6F3EE] px-4 py-6 text-[#171717] md:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1440px] gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Linker kolom: lijst met uitjes */}
        <aside className="xl:sticky xl:top-6 xl:h-fit">
          <div className="rounded-[28px] border border-black/5 bg-white/70 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#171717]">Uitjes</p>
              <p className="mt-1 text-sm text-[#6F6B65]">
                Klik op een event om de details te bekijken.
              </p>
            </div>

            <div className="space-y-3">
              {dummyEvents.map((event) => {
                const isActive = event.id === selectedEvent.id;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEventId(event.id)}
                    className={`w-full rounded-[22px] border p-3 text-left transition ${
                      isActive
                        ? "border-[#B8DD8D] bg-[#EEF8E1] shadow-sm"
                        : "border-black/5 bg-white hover:border-[#D8D2C8] hover:bg-[#FBFAF7]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className="h-20 w-20 flex-shrink-0 rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      <div className="min-w-0">
                        <span className="inline-flex rounded-full bg-[#DDF0C6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#49632A]">
                          {event.category}
                        </span>

                        <h2 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[#171717]">
                          {event.title}
                        </h2>

                        <p className="mt-1 text-xs text-[#6F6B65]">
                          {event.dateLabel}
                        </p>
                        <p className="text-xs text-[#6F6B65]">{event.city}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Rechter kolom: detailpagina */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Hoofdcontent */}
          <div className="space-y-8">
            {/* Hero */}
            <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-end">
              <div className="pt-2">
                <span className="inline-flex rounded-full bg-[#DDF0C6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#49632A]">
                  {selectedEvent.category}
                </span>

                <h1 className="mt-5 max-w-[520px] text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#171717] md:text-5xl">
                  {selectedEvent.title}
                </h1>

                <p className="mt-5 max-w-[420px] text-[15px] leading-7 text-[#4D4A45]">
                  {selectedEvent.shortDescription}
                </p>

                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap">
                  <InfoPill label="Datum" value={selectedEvent.dateLabel} />
                  <InfoPill label="Tijd" value={selectedEvent.timeLabel} />
                </div>
              </div>

              <div className="relative">
                <div
                  className="min-h-[360px] rounded-[36px] bg-cover bg-center shadow-[0_30px_60px_rgba(0,0,0,0.12)] md:min-h-[520px]"
                  style={{ backgroundImage: `url(${selectedEvent.image})` }}
                />

                <div className="mt-4 rounded-[24px] bg-[#EBDAB7] px-5 py-4 shadow-lg md:absolute md:-bottom-5 md:left-6 md:mt-0 md:max-w-[220px]">
                  <p className="text-sm font-medium leading-5 text-[#171717]">
                    “{selectedEvent.quote}”
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#6D655B]">
                    {selectedEvent.quoteAuthor}
                  </p>
                </div>
              </div>
            </section>

            {/* Over dit evenement */}
            <section>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
                Over dit evenement
              </h2>

              <div className="mt-5 space-y-5">
                {selectedEvent.longDescription.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[760px] text-[15px] leading-8 text-[#34312D]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </section>

            {/* Programma */}
            <section>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
                Programma
              </h2>

              <div className="mt-5 space-y-4">
                {selectedEvent.program.map((item) => (
                  <div
                    key={item.title}
                    className={`flex flex-col gap-3 rounded-[26px] px-5 py-5 sm:flex-row sm:items-center sm:justify-between ${item.color}`}
                  >
                    <div>
                      <p className="text-xs text-[#6E6A65]">{item.time}</p>
                      <h3 className="mt-1 text-xl font-semibold text-[#171717]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#55514C]">
                        {item.description}
                      </p>
                    </div>

                    <div className="ml-4 text-2xl text-[#8A857F]">→</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Locatie */}
            <section>
              <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
                  Locatie
                </h2>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#171717] underline underline-offset-4 transition hover:text-black/70"
                >
                  Open in Maps
                </a>
              </div>

              <div className="relative overflow-hidden rounded-[34px] bg-[#ECEAF1]">
                <div className="grid min-h-[360px] md:grid-cols-[1fr_280px]">
                  <div className="bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.65),_rgba(222,220,230,0.85))]" />
                  <div className="relative bg-[#E7E5F0]">
                    <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B8C32] shadow-[0_0_0_6px_rgba(91,140,50,0.15)]" />
                    <div className="absolute bottom-6 left-1/2 w-[min(210px,calc(100%-2rem))] -translate-x-1/2 rounded-[22px] bg-white px-4 py-4 shadow-lg">
                      <p className="text-sm font-semibold text-[#171717]">
                        {selectedEvent.locationName}
                      </p>
                      <p className="mt-1 text-sm text-[#66615C]">
                        {selectedEvent.locationAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Rechter kaartkolom */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
              <div className="bg-[#151515] px-6 py-6 text-white">
                <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                  Tickets
                </h2>
                <p className="mt-2 text-sm text-white/75">
                  Prijzen per persoon inclusief servicekosten.
                </p>
              </div>

              <div className="space-y-4 px-6 py-6">
                {selectedEvent.tickets.map((ticket) => (
                  <div
                    key={ticket.label}
                    className={`rounded-[22px] border px-4 py-4 ${
                      ticket.highlight
                        ? "border-[#B8DD8D] bg-[#EEF8E1]"
                        : "border-[#ECE7DF] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#171717]">
                            {ticket.label}
                          </p>
                          {ticket.highlight ? (
                            <span className="rounded-full bg-[#171717] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                              Best seller
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-[#6E6A65]">
                          {ticket.description}
                        </p>
                      </div>

                      <p className="text-xl font-semibold text-[#171717]">
                        {ticket.price}
                      </p>
                    </div>
                  </div>
                ))}

                <a
                  href={reservationHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#B8E57D] px-6 py-4 text-sm font-semibold text-[#171717] transition hover:brightness-95"
                >
                  Reserveer plaatsen
                </a>

                <div className="space-y-3 border-t border-[#EEE7DE] pt-4 text-sm text-[#5D5953]">
                  <p>• Directe bevestiging via e-mail na reservering.</p>
                  <p>• Kosteloos annuleren tot 48 uur voor aanvang.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[28px] border border-[#E6E2D9] bg-[#EAF0E3] px-5 py-4">
              <div className="h-12 w-12 rounded-full bg-[#D6E7C2]" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#667159]">
                  Gecureerd door
                </p>
                <p className="text-sm font-semibold text-[#171717]">
                  Team Uitjesplatform
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
