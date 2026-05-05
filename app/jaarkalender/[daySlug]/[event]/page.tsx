import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import {
  buildGoogleCalendarHref,
  buildMapsSearchHref,
} from "@/lib/actionLinks";
import { optimizeCssBackground } from "@/lib/remoteImage";
import {
  generateJaarkalenderEventStaticParams,
  getJaarkalenderEventBySlug,
  getJaarkalenderEventEntriesForDay,
  getJaarkalenderEventHref,
  jaarkalenderCategoryMeta,
  type JaarkalenderCategoryKey,
  type JaarkalenderEventEntry,
  type TimelineCard,
} from "../../data";

type PageProps = {
  params: {
    daySlug: string;
    event: string;
  };
};

type EventViewModel = {
  label: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  description: string[];
  infoCards: Array<{
    title: string;
    description: string;
    tone: "peach" | "mint";
  }>;
  practicalInfo: Array<{
    label: string;
    value: string;
    icon: "ticket" | "group" | "pin";
  }>;
  routeLabel: string;
  routeAction: string;
  importLabel: string;
  nearbyIntro: string;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
];

const DUTCH_MONTH_INDEX: Record<string, number> = {
  januari: 0,
  februari: 1,
  maart: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  augustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  december: 11,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return generateJaarkalenderEventStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const eventEntry = getJaarkalenderEventBySlug(params.daySlug, params.event);

  if (!eventEntry) {
    return {
      title: "Evenement | Uitjes NL",
    };
  }

  return {
    title: `${eventEntry.card.title} | Uitjes NL`,
    description: eventEntry.card.description,
  };
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 4.75v3.5l2.25 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 14s4-3.6 4-7.333A4 4 0 1 0 4 6.667C4 10.4 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.667" r="1.4" fill="currentColor" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 5.25a1.75 1.75 0 0 0 1.75-1.75h7.5A1.75 1.75 0 0 0 13.5 5.25v1A1.75 1.75 0 0 0 11.75 8a1.75 1.75 0 0 0 1.75 1.75v1A1.75 1.75 0 0 0 11.75 12.5h-7.5A1.75 1.75 0 0 0 2.5 10.75v-1A1.75 1.75 0 0 0 4.25 8 1.75 1.75 0 0 0 2.5 6.25v-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M8 4.75v6.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="5.25" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10.75" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.75 12c.4-1.567 1.567-2.5 3.25-2.5S8.85 10.433 9.25 12M8.5 12c.34-1.237 1.26-2 2.5-2 1.18 0 2.06.7 2.5 2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getCategoryKey(card: TimelineCard): JaarkalenderCategoryKey {
  const label = `${card.category} ${card.title} ${card.description}`.toLowerCase();

  if (label.includes("music") || label.includes("concert") || label.includes("jazz")) {
    return "muziek";
  }

  if (label.includes("food") || label.includes("culin") || label.includes("proef")) {
    return "culinair";
  }

  if (label.includes("festival") || label.includes("parade")) {
    return "festival";
  }

  if (label.includes("sport") || label.includes("run") || label.includes("wandel")) {
    return "natuur";
  }

  return "cultuur";
}

function getEventImage(card: TimelineCard, seed: number) {
  return card.image ?? fallbackImages[seed % fallbackImages.length];
}

function getCityLabel(card: TimelineCard) {
  if (card.location.includes(", ")) {
    return card.location;
  }

  if (card.location.includes(" - ")) {
    return card.location;
  }

  if (card.location.includes("by night")) {
    return card.location.replace("by night", "centrum").trim();
  }

  return `${card.location}, Nederland`;
}

function getTimeLabel(entry: JaarkalenderEventEntry) {
  if (entry.slot.display === "feature") {
    return `${entry.slot.time} - 11:30`;
  }

  if (entry.slot.display === "grid") {
    return `${entry.slot.time} - 15:30`;
  }

  if (entry.slot.display === "hero") {
    return `${entry.slot.time} - 22:30`;
  }

  return `${entry.slot.time} - 23:59`;
}

function buildJaarkalenderDate(entry: JaarkalenderEventEntry) {
  const [hours, minutes] = entry.slot.time.split(":").map(Number);
  const monthIndex =
    DUTCH_MONTH_INDEX[entry.day.monthDisplay.toLowerCase()] ?? 0;

  return new Date(
    entry.day.year,
    monthIndex,
    entry.day.dayNumber,
    hours,
    minutes,
    0
  );
}

function buildEventViewModel(entry: JaarkalenderEventEntry): EventViewModel {
  const cityLabel = getCityLabel(entry.card);
  const categoryKey = getCategoryKey(entry.card);
  const categoryLabel = jaarkalenderCategoryMeta[categoryKey].label;
  const dateLabel = `${entry.day.weekdayDisplay} ${entry.day.dayNumber} ${entry.day.monthDisplay} ${entry.day.year}`;
  const timeLabel = getTimeLabel(entry);

  if (entry.card.title === "Night Glow Parade") {
    return {
      label: "Hoogtepunt van het jaar",
      dateLabel,
      timeLabel,
      locationLabel: "Centrum, Eindhoven",
      description: [
        "De Night Glow Parade is het lichtspektakel van de maand in Eindhoven. Zodra de avond valt verandert de route in een stroom van kleur, projecties en langzaam bewegende sculpturen die door het centrum zweven.",
        "Verwacht een mix van kunstenaars, lichtinstallaties en een publiek dat van plein naar plein trekt. Het voelt tegelijk groots en intiem, met genoeg stops om onderweg iets te drinken of spontaan een extra uitje mee te pakken.",
      ],
      infoCards: [
        {
          title: "Tickets & toegang",
          description:
            "De parade zelf is vrij toegankelijk. Voor de speciale viewing zones en extra lichtshows zijn er een beperkt aantal tickets beschikbaar.",
          tone: "peach",
        },
        {
          title: "Bereikbaarheid",
          description:
            "Vanaf Eindhoven Centraal loop je in minder dan tien minuten naar de eerste lichtinstallaties. De route is goed te volgen via de verlichte wayfinding in de stad.",
          tone: "mint",
        },
      ],
      practicalInfo: [
        {
          label: "Kosten",
          value: "Gratis publieke route",
          icon: "ticket",
        },
        {
          label: "Doelgroep",
          value: "Alle leeftijden welkom",
          icon: "group",
        },
        {
          label: "Locatie details",
          value: "Start bij Strijp-S en eindigt richting stationsgebied",
          icon: "pin",
        },
      ],
      routeLabel: "Interactieve route door licht, muziek en stadspleinen",
      routeAction: "Bekijk volledige route",
      importLabel: "Importeer in agenda",
      nearbyIntro: "Ontdek meer culturele plekken en slimme stops rondom de parade.",
    };
  }

  return {
    label: `Aanrader: ${categoryLabel.toLowerCase()}`,
    dateLabel,
    timeLabel,
    locationLabel: cityLabel,
    description: [
      `${entry.card.title} brengt ${categoryLabel.toLowerCase()} en stadsenergie samen in een setting die perfect is voor een middag of avond uit. ${entry.card.description}`,
      `De locatie ${cityLabel} maakt het makkelijk om dit evenement te combineren met eten, wandelen of een tweede stop later op de dag.`,
    ],
    infoCards: [
      {
        title: "Tickets & planning",
        description:
          "Controleer vooraf de beschikbaarheid en kom iets eerder zodat je rustig kunt landen, je route kunt bepalen en niets van de start mist.",
        tone: "peach",
      },
      {
        title: "Slim combineren",
        description:
          "Deze stop werkt goed samen met andere uitjes uit dezelfde dagagenda. Plan erna een diner, museumbezoek of avondprogramma in dezelfde stad.",
        tone: "mint",
      },
    ],
    practicalInfo: [
      {
        label: "Kosten",
        value: categoryKey === "festival" ? "Vanaf EUR 12" : "Vanaf EUR 15",
        icon: "ticket",
      },
      {
        label: "Doelgroep",
        value:
          categoryKey === "familie"
            ? "Gezinnen en jonge bezoekers"
            : "Volwassenen en nieuwsgierige ontdekkers",
        icon: "group",
      },
      {
        label: "Locatie details",
        value: cityLabel,
        icon: "pin",
      },
    ],
    routeLabel: "Centrale route met genoeg ruimte voor een extra stop in de buurt",
    routeAction: "Bekijk route in de buurt",
    importLabel: "Importeer in agenda",
    nearbyIntro: `Combineer ${entry.card.title.toLowerCase()} met nog een paar sterke adressen uit dezelfde dag.`,
  };
}

function renderPracticalIcon(icon: EventViewModel["practicalInfo"][number]["icon"]) {
  if (icon === "ticket") {
    return <TicketIcon />;
  }

  if (icon === "group") {
    return <GroupIcon />;
  }

  return <PinIcon />;
}

function MapPlaceholder() {
  return (
    <div className="relative h-44 overflow-hidden rounded-[1.8rem] bg-[#434341]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
      <svg
        className="absolute inset-0 h-full w-full text-white/28"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 160C80 120 120 110 180 116C250 123 300 96 378 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 82C70 76 120 48 194 54C278 60 322 44 382 14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M48 10L20 194M122 4L92 196M204 8L178 190M278 6L254 190M356 10L330 194"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="6 8"
        />
        <path
          d="M12 46H388M16 104H384M22 152H378"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="7 9"
        />
      </svg>
    </div>
  );
}

function NearbyCard({
  href,
  title,
  description,
  category,
  image,
}: {
  href: string;
  title: string;
  description: string;
  category: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[1.9rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9cc84e]"
    >
      <div
        className="relative h-[16rem] overflow-hidden rounded-[1.9rem] bg-[#141310] shadow-[0_18px_45px_rgba(34,25,18,0.12)]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.02), rgba(8,8,8,0.38)), ${optimizeCssBackground(
            image,
            {
              width: 800,
              quality: 56,
            }
          )}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-4 top-4 rounded-full bg-white/16 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
          {category}
        </div>
      </div>
      <h3 className="mt-5 text-[1.85rem] leading-[0.98] tracking-[-0.05em] text-[#171511]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-[#6a5a4c]">{description}</p>
    </Link>
  );
}

export default function JaarkalenderEventPage({ params }: PageProps) {
  const eventEntry = getJaarkalenderEventBySlug(params.daySlug, params.event);

  if (!eventEntry) {
    notFound();
  }

  const viewModel = buildEventViewModel(eventEntry);
  const categoryKey = getCategoryKey(eventEntry.card);
  const categoryMeta = jaarkalenderCategoryMeta[categoryKey];
  const heroImage = getEventImage(eventEntry.card, eventEntry.eventIndex);
  const nearbyEvents = getJaarkalenderEventEntriesForDay(eventEntry.day)
    .filter((entry) => entry.eventSlug !== eventEntry.eventSlug)
    .slice(0, 3);
  const calendarStart = buildJaarkalenderDate(eventEntry);
  const calendarHref = buildGoogleCalendarHref({
    title: eventEntry.card.title,
    details: eventEntry.card.description,
    location: viewModel.locationLabel,
    start: calendarStart,
    end: new Date(calendarStart.getTime() + 3 * 60 * 60 * 1000),
  });
  const routeHref = buildMapsSearchHref(viewModel.locationLabel);

  return (
    <main className="min-h-screen bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Jaarkalender", href: "/jaarkalender" },
              {
                label: `${eventEntry.day.weekdayDisplay} ${eventEntry.day.dayNumber} ${eventEntry.day.monthDisplay}`,
                href: `/jaarkalender/${eventEntry.day.slug}`,
              },
              { label: eventEntry.card.title },
            ]}
          />
        </div>

        <section
          className="relative overflow-hidden border border-white/14 bg-white/10 backdrop-blur-xl rounded-[2.5rem] bg-[#111218] px-6 pb-7 pt-[19rem] text-white shadow-[0_30px_90px_rgba(15,15,18,0.22)] sm:px-8 sm:pt-[24rem] lg:px-10 lg:pt-[32rem]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(6,8,12,0.1), rgba(6,8,12,0.72)), ${optimizeCssBackground(
              heroImage,
              {
                width: 1600,
                quality: 58,
              }
            )}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(120,246,217,0.18),transparent_28%),linear-gradient(180deg,rgba(5,7,12,0.08),rgba(5,7,12,0.76))]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[48rem]">
              <div className="inline-flex rounded-full bg-[#e8f2d0] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#162016]">
                {viewModel.label}
              </div>
              <h1 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.07em] text-white">
                {eventEntry.card.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/88">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon />
                  {viewModel.dateLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ClockIcon />
                  {viewModel.timeLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <PinIcon />
                  {viewModel.locationLabel}
                </span>
              </div>
            </div>

            <a
              href={calendarHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e8f2d0] px-7 text-sm font-semibold text-[#162016] transition hover:bg-[#c9ee77] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]"
            >
              <CalendarIcon />
              {viewModel.importLabel}
            </a>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="rounded-[2.2rem] border border-[#e7dfd6] bg-white/72 p-1 shadow-[0_24px_60px_rgba(35,23,16,0.06)]">
              <div className="rounded-[2rem] border border-[#eee6dc] bg-white/88 p-6 sm:p-8">
                <div className={`inline-flex rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${categoryMeta.badgeClass}`}>
                  {categoryMeta.label}
                </div>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] leading-[0.96] tracking-[-0.05em] text-[#171511]">
                  Over dit evenement
                </h2>
                <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-[#56483d]">
                  {viewModel.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {viewModel.infoCards.map((card) => (
                    <article
                      key={card.title}
                      className={`rounded-[1.8rem] border p-6 ${
                        card.tone === "mint"
                          ? "border-[#d5e7cc] bg-[#eef8e7]"
                          : "border-[#edd8ca] bg-[#f8e7dc]"
                      }`}
                    >
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/76 text-[#4d6630]">
                        {card.tone === "mint" ? <CalendarIcon /> : <TicketIcon />}
                      </div>
                      <h3 className="mt-5 text-[1.5rem] leading-[1.02] tracking-[-0.04em] text-[#171511]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#5f5145]">
                        {card.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2.2rem] border border-[#e7dfd6] bg-white/88 p-6 shadow-[0_18px_40px_rgba(35,23,16,0.05)] sm:p-8">
            <h2 className="text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#171511]">
              Praktische informatie
            </h2>

            <div className="mt-6 space-y-5">
              {viewModel.practicalInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3ede5] text-[#5a4f45]">
                    {renderPracticalIcon(item.icon)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3f382f]">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#66584d]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <MapPlaceholder />
              <p className="mt-4 text-sm leading-7 text-[#65574c]">
                {viewModel.routeLabel}
              </p>
              <a
                href={routeHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#171511] px-5 text-sm font-semibold text-[#171511] transition hover:bg-[#171511] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                {viewModel.routeAction}
              </a>
            </div>
          </aside>
        </section>

        <section className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[34rem]">
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.06em] text-[#171511]">
                In de buurt
              </h2>
              <p className="mt-3 text-base leading-8 text-[#66584d]">
                {viewModel.nearbyIntro}
              </p>
            </div>
            <Link
              href={`/jaarkalender/${eventEntry.day.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d6630] underline decoration-[#9cc84e] decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
            >
              Bekijk alles
              <ArrowIcon />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {nearbyEvents.map((entry) => (
              <NearbyCard
                key={entry.eventSlug}
                href={getJaarkalenderEventHref(entry.day.slug, entry.eventSlug)}
                title={entry.card.title}
                description={entry.card.description}
                category={jaarkalenderCategoryMeta[getCategoryKey(entry.card)].label}
                image={getEventImage(entry.card, entry.eventIndex + 2)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
