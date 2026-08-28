import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import SavePlaceButton from "@/components/SavePlaceButton";
import { buildGoogleCalendarHref, buildMapsSearchHref, buildTicketSearchHref } from "@/lib/actionLinks";
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

type PageProps = { params: { daySlug: string; event: string } };
type FeatureIconName = "calendar" | "clock" | "pin" | "ticket" | "group" | "spark" | "route";
type EventViewModel = {
  label: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  description: string[];
  infoCards: Array<{ title: string; description: string; tone: "peach" | "mint" }>;
  practicalInfo: Array<{ label: string; value: string; icon: "ticket" | "group" | "pin" }>;
  routeLabel: string;
  routeAction: string;
  importLabel: string;
  nearbyIntro: string;
};

const fallbackEventImages = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
  "https://images.unsplash.com/photo-1503095396549-807759245b35",
];
const galleryFallbackImages = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
];
const DUTCH_MONTH_INDEX: Record<string, number> = { januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5, juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11 };

export const dynamicParams = false;
export function generateStaticParams() { return generateJaarkalenderEventStaticParams(); }
export function generateMetadata({ params }: PageProps): Metadata {
  const eventEntry = getJaarkalenderEventBySlug(params.daySlug, params.event);
  return eventEntry ? { title: `${eventEntry.card.title} | Uitjes NL`, description: eventEntry.card.description } : { title: "Evenement | Uitjes NL" };
}

function ArrowIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.333 8h9.334M8.667 3.333 13.333 8l-4.666 4.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function CalendarIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 2.5v3M11 2.5v3M2.75 6.25h10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function ClockIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.75v3.5l2.25 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function PinIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14s4-3.6 4-7.333A4 4 0 1 0 4 6.667C4 10.4 8 14 8 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8" cy="6.667" r="1.4" fill="currentColor" /></svg>; }
function TicketIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 5.25a1.75 1.75 0 0 0 1.75-1.75h7.5A1.75 1.75 0 0 0 13.5 5.25v1A1.75 1.75 0 0 0 11.75 8a1.75 1.75 0 0 0 1.75 1.75v1A1.75 1.75 0 0 0 11.75 12.5h-7.5A1.75 1.75 0 0 0 2.5 10.75v-1A1.75 1.75 0 0 0 4.25 8 1.75 1.75 0 0 0 2.5 6.25v-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 4.75v6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 1.5" /></svg>; }
function GroupIcon() { return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="5.25" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.3" /><circle cx="10.75" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.3" /><path d="M2.75 12c.4-1.567 1.567-2.5 3.25-2.5S8.85 10.433 9.25 12M8.5 12c.34-1.237 1.26-2 2.5-2 1.18 0 2.06.7 2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
function HeartIcon({ filled = false }: { filled?: boolean }) { return <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} aria-hidden="true"><path d="M10 17.2S3.25 13.24 3.25 7.86C3.25 5.79 4.84 4.2 6.82 4.2c1.26 0 2.37.63 3.18 1.66.81-1.03 1.92-1.66 3.18-1.66 1.98 0 3.57 1.59 3.57 3.66 0 5.38-6.75 9.34-6.75 9.34Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" /></svg>; }
function SparkIcon() { return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m10 2 1.48 5.1L16.5 8.5l-5.02 1.4L10 15l-1.48-5.1L3.5 8.5l5.02-1.4L10 2Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" /><path d="m16.35 13.1.53 1.82 1.77.5-1.77.5-.53 1.83-.54-1.83-1.76-.5 1.76-.5.54-1.82Z" fill="currentColor" /></svg>; }
function RouteIcon() { return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.25 15.9c2.1-5.4 4.4-7.58 7.02-7.58 2.03 0 2.77 1.42 4.15 1.42 1.12 0 1.82-.77 2.33-2.18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="3.25" cy="15.9" r="1.25" stroke="currentColor" strokeWidth="1.2" /><circle cx="16.75" cy="7.56" r="1.25" stroke="currentColor" strokeWidth="1.2" /></svg>; }
function FeatureIcon({ name }: { name: FeatureIconName }) { const icons = { calendar: <CalendarIcon />, clock: <ClockIcon />, pin: <PinIcon />, ticket: <TicketIcon />, group: <GroupIcon />, spark: <SparkIcon />, route: <RouteIcon /> }; return <>{icons[name]}</>; }

function getCategoryKey(card: TimelineCard): JaarkalenderCategoryKey {
  const text = `${card.category} ${card.title} ${card.description}`.toLowerCase();
  if (text.includes("music") || text.includes("concert") || text.includes("jazz")) return "muziek";
  if (text.includes("food") || text.includes("culin") || text.includes("proef")) return "culinair";
  if (text.includes("festival") || text.includes("parade")) return "festival";
  if (text.includes("sport") || text.includes("run") || text.includes("wandel")) return "natuur";
  return "cultuur";
}
function getEventImage(card: TimelineCard, seed: number) { return card.image ?? fallbackEventImages[seed % fallbackEventImages.length]; }
function getCityLabel(card: TimelineCard) {
  if (card.location.includes(", ") || card.location.includes(" - ")) return card.location;
  if (card.location.includes("by night")) return card.location.replace("by night", "centrum").trim();
  return `${card.location}, Nederland`;
}
function getTimeLabel(entry: JaarkalenderEventEntry) {
  if (entry.slot.display === "feature") return `${entry.slot.time} - 11:30`;
  if (entry.slot.display === "grid") return `${entry.slot.time} - 15:30`;
  if (entry.slot.display === "hero") return `${entry.slot.time} - 22:30`;
  return `${entry.slot.time} - 23:59`;
}
function buildJaarkalenderDate(entry: JaarkalenderEventEntry) {
  const [hours, minutes] = entry.slot.time.split(":").map(Number);
  const monthIndex = DUTCH_MONTH_INDEX[entry.day.monthDisplay.toLowerCase()] ?? 0;
  return new Date(entry.day.year, monthIndex, entry.day.dayNumber, hours, minutes, 0);
}
function buildEventViewModel(entry: JaarkalenderEventEntry): EventViewModel {
  const cityLabel = getCityLabel(entry.card);
  const categoryKey = getCategoryKey(entry.card);
  const categoryLabel = jaarkalenderCategoryMeta[categoryKey].label;
  const dateLabel = `${entry.day.weekdayDisplay} ${entry.day.dayNumber} ${entry.day.monthDisplay} ${entry.day.year}`;
  const timeLabel = getTimeLabel(entry);
  if (entry.card.title === "Night Glow Parade") return {
    label: "Hoogtepunt van het jaar", dateLabel, timeLabel, locationLabel: "Centrum, Eindhoven",
    description: ["De Night Glow Parade is het lichtspektakel van de maand in Eindhoven. Zodra de avond valt verandert de route in een stroom van kleur, projecties en langzaam bewegende sculpturen die door het centrum zweven.", "Verwacht een mix van kunstenaars, lichtinstallaties en een publiek dat van plein naar plein trekt. Het voelt tegelijk groots en intiem, met genoeg stops om onderweg iets te drinken of spontaan een extra uitje mee te pakken."],
    infoCards: [{ title: "Tickets & toegang", description: "De parade zelf is vrij toegankelijk. Voor de speciale viewing zones en extra lichtshows zijn er een beperkt aantal tickets beschikbaar.", tone: "peach" }, { title: "Bereikbaarheid", description: "Vanaf Eindhoven Centraal loop je in minder dan tien minuten naar de eerste lichtinstallaties. De route is goed te volgen via de verlichte wayfinding in de stad.", tone: "mint" }],
    practicalInfo: [{ label: "Kosten", value: "Gratis publieke route", icon: "ticket" }, { label: "Doelgroep", value: "Alle leeftijden welkom", icon: "group" }, { label: "Locatie details", value: "Start bij Strijp-S en eindigt richting stationsgebied", icon: "pin" }],
    routeLabel: "Interactieve route door licht, muziek en stadspleinen", routeAction: "Bekijk volledige route", importLabel: "Importeer in agenda", nearbyIntro: "Ontdek meer culturele plekken en slimme stops rondom de parade.",
  };
  return {
    label: `Aanrader: ${categoryLabel.toLowerCase()}`, dateLabel, timeLabel, locationLabel: cityLabel,
    description: [`${entry.card.title} brengt ${categoryLabel.toLowerCase()} en stadsenergie samen in een setting die perfect is voor een middag of avond uit. ${entry.card.description}`, `De locatie ${cityLabel} maakt het makkelijk om dit evenement te combineren met eten, wandelen of een tweede stop later op de dag.`],
    infoCards: [{ title: "Tickets & planning", description: "Controleer vooraf de beschikbaarheid en kom iets eerder zodat je rustig kunt landen, je route kunt bepalen en niets van de start mist.", tone: "peach" }, { title: "Slim combineren", description: "Deze stop werkt goed samen met andere uitjes uit dezelfde dagagenda. Plan erna een diner, museumbezoek of avondprogramma in dezelfde stad.", tone: "mint" }],
    practicalInfo: [{ label: "Kosten", value: categoryKey === "festival" ? "Vanaf EUR 12" : "Vanaf EUR 15", icon: "ticket" }, { label: "Doelgroep", value: categoryKey === "familie" ? "Gezinnen en jonge bezoekers" : "Volwassenen en nieuwsgierige ontdekkers", icon: "group" }, { label: "Locatie details", value: cityLabel, icon: "pin" }],
    routeLabel: "Centrale route met genoeg ruimte voor een extra stop in de buurt", routeAction: "Bekijk route in de buurt", importLabel: "Importeer in agenda", nearbyIntro: `Combineer ${entry.card.title.toLowerCase()} met nog een paar sterke adressen uit dezelfde dag.`,
  };
}

function ImageSurface({ image, className, priority = false, children }: { image: string; className: string; priority?: boolean; children?: ReactNode }) {
  return <div className={className} style={{ backgroundImage: `linear-gradient(180deg, rgba(29,40,31,0.02), rgba(29,40,31,0.22)), ${optimizeCssBackground(image, { width: priority ? 1600 : 960, quality: priority ? 70 : 60 })}`, backgroundPosition: "center", backgroundSize: "cover" }}>{children}</div>;
}
function SimilarEventCard({ entry }: { entry: JaarkalenderEventEntry }) {
  const category = jaarkalenderCategoryMeta[getCategoryKey(entry.card)];
  const image = getEventImage(entry.card, entry.eventIndex + 2);
  const href = getJaarkalenderEventHref(entry.day.slug, entry.eventSlug);
  const saveItem = { id: `jaarkalender:${entry.day.slug}/${entry.eventSlug}`, title: entry.card.title, href, meta: `${getCityLabel(entry.card)} · ${category.label}`, image };
  return <article className="group min-w-0"><Link href={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f5c43]"><ImageSurface image={image} className="relative aspect-[1.06] overflow-hidden rounded-[1.35rem] bg-[#e5e7df] transition duration-500 group-hover:scale-[0.985]"><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] ${category.badgeClass}`}>{category.label}</span></ImageSurface></Link><div className="mt-4 flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-medium text-[#74766e]">{getCityLabel(entry.card)}</p><Link href={href} className="mt-1 block text-[1.12rem] font-semibold leading-tight tracking-[-0.035em] text-[#203329] transition group-hover:text-[#1f5c43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]">{entry.card.title}</Link><p className="mt-2 text-sm font-semibold text-[#345846]">{getCategoryKey(entry.card) === "festival" ? "Vanaf € 12" : "Vanaf € 15"}</p></div><SavePlaceButton item={saveItem} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9dfd6] bg-white text-[#345846] transition hover:border-[#345846] hover:bg-[#edf4e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]" savedClassName="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#345846] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]" savedChildren={<><HeartIcon filled /><span className="sr-only">Verwijder uit bewaard</span></>}><HeartIcon /><span className="sr-only">Bewaar {entry.card.title}</span></SavePlaceButton></div></article>;
}
function VisitAccordion({ icon, title, rows }: { icon: FeatureIconName; title: string; rows: Array<[string, string]> }) {
  return <details open className="group overflow-hidden rounded-[1.05rem] border border-[#dce1d9] bg-[#fdfdf9] [&_summary::-webkit-details-marker]:hidden"><summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 sm:px-5"><span className="flex items-center gap-3.5 text-[1.02rem] font-semibold tracking-[-0.025em] text-[#25382e]"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f3ed] text-[#365846]"><FeatureIcon name={icon} /></span>{title}</span><svg className="h-4 w-4 text-[#59685d] transition duration-300 group-open:rotate-180" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 9.5 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary><dl className="border-t border-[#e2e5df]">{rows.map(([label, value]) => <div key={label} className="grid gap-1 border-b border-[#e2e5df] px-4 py-3.5 last:border-0 sm:grid-cols-[minmax(9rem,1fr)_minmax(0,1fr)] sm:gap-6 sm:px-5"><dt className="text-sm text-[#70776f]">{label}</dt><dd className="text-sm font-semibold leading-6 text-[#25382e]">{value}</dd></div>)}</dl></details>;
}

export default function JaarkalenderEventPage({ params }: PageProps) {
  const eventEntry = getJaarkalenderEventBySlug(params.daySlug, params.event);
  if (!eventEntry) notFound();
  const viewModel = buildEventViewModel(eventEntry);
  const categoryKey = getCategoryKey(eventEntry.card);
  const categoryMeta = jaarkalenderCategoryMeta[categoryKey];
  const heroImage = getEventImage(eventEntry.card, eventEntry.eventIndex);
  const nearbyEvents = getJaarkalenderEventEntriesForDay(eventEntry.day).filter((entry) => entry.eventSlug !== eventEntry.eventSlug).slice(0, 4);
  const calendarStart = buildJaarkalenderDate(eventEntry);
  const calendarHref = buildGoogleCalendarHref({ title: eventEntry.card.title, details: eventEntry.card.description, location: viewModel.locationLabel, start: calendarStart, end: new Date(calendarStart.getTime() + 3 * 60 * 60 * 1000) });
  const routeHref = buildMapsSearchHref(viewModel.locationLabel);
  const ticketHref = buildTicketSearchHref(eventEntry.card.title, viewModel.locationLabel);
  const saveItem = { id: `jaarkalender:${eventEntry.day.slug}/${eventEntry.eventSlug}`, title: eventEntry.card.title, href: getJaarkalenderEventHref(eventEntry.day.slug, eventEntry.eventSlug), meta: `${viewModel.locationLabel} · ${categoryMeta.label}`, image: heroImage };
  const fitFeatures: Array<{ icon: FeatureIconName; title: string; description: string }> = [
    { icon: "spark", title: `${categoryMeta.label} met karakter`, description: eventEntry.card.description },
    { icon: "calendar", title: "Een fijn moment", description: `${viewModel.dateLabel} · ${viewModel.timeLabel}` },
    { icon: "pin", title: "Midden in de stad", description: viewModel.locationLabel },
    { icon: "ticket", title: viewModel.infoCards[0].title, description: viewModel.infoCards[0].description },
    { icon: "route", title: viewModel.infoCards[1].title, description: viewModel.infoCards[1].description },
    { icon: "group", title: "Voor wie", description: viewModel.practicalInfo.find((item) => item.icon === "group")?.value ?? "Voor nieuwsgierige ontdekkers" },
  ];
  const expectationFeatures: Array<{ icon: FeatureIconName; title: string; description: string }> = [
    { icon: "spark", title: "De sfeer", description: `${categoryMeta.label} met ruimte om op je eigen tempo te ontdekken.` },
    { icon: "calendar", title: "Jouw moment", description: `Je kunt aanhaken op ${viewModel.dateLabel.toLowerCase()} tussen ${viewModel.timeLabel}.` },
    { icon: "pin", title: "De plek", description: viewModel.practicalInfo.find((item) => item.icon === "pin")?.value ?? viewModel.locationLabel },
    { icon: "group", title: "Samen of solo", description: viewModel.practicalInfo.find((item) => item.icon === "group")?.value ?? "Een fijne stop, alleen of samen." },
  ];
  const galleryImages = [heroImage, ...galleryFallbackImages];

  return <main className="min-h-screen bg-[#fbfaf6] text-[#203329]"><div className="mx-auto max-w-[1420px] px-4 pb-20 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pb-28">
    <Breadcrumbs className="mb-7 sm:mb-9" items={[{ label: "Home", href: "/" }, { label: "Jaarkalender", href: "/jaarkalender" }, { label: `${eventEntry.day.weekdayDisplay} ${eventEntry.day.dayNumber} ${eventEntry.day.monthDisplay}`, href: `/jaarkalender/${eventEntry.day.slug}` }, { label: eventEntry.card.title }]} />

    <section className="overflow-hidden rounded-[1.75rem] bg-[#eff0eb] shadow-[0_24px_70px_rgba(33,49,40,0.08)] lg:grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]" aria-labelledby="event-title"><div className="relative z-10 min-w-0 overflow-hidden px-6 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-14"><div className="absolute left-0 top-0 h-24 w-24 rounded-br-[5rem] border-b border-r border-[#dae4d7]" aria-hidden="true" /><div className="relative"><div className="flex flex-wrap items-center justify-between gap-3"><span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] ${categoryMeta.badgeClass}`}>{viewModel.label}</span><SavePlaceButton item={saveItem} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfd6] bg-[#fbfcf8] text-[#345846] transition hover:border-[#345846] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]" savedClassName="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#345846] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]" savedChildren={<><HeartIcon filled /><span className="sr-only">Verwijder uit bewaard</span></>}><HeartIcon /><span className="sr-only">Bewaar dit evenement</span></SavePlaceButton></div><h1 id="event-title" className="mt-8 max-w-full break-words text-[clamp(3.25rem,6.2vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.072em] text-[#15251d] [overflow-wrap:anywhere]">{eventEntry.card.title}</h1><p className="mt-6 max-w-xl text-[1rem] leading-7 text-[#5f6d63] sm:text-[1.08rem]">{eventEntry.card.description}</p><div className="mt-8 grid max-w-xl gap-3 border-y border-[#d8dfd5] py-5 text-sm text-[#365045] sm:grid-cols-2"><span className="inline-flex items-center gap-2.5"><CalendarIcon />{viewModel.dateLabel}</span><span className="inline-flex items-center gap-2.5"><ClockIcon />{viewModel.timeLabel}</span><span className="inline-flex items-center gap-2.5 sm:col-span-2"><PinIcon />{viewModel.locationLabel}</span></div><div className="mt-8 flex flex-wrap gap-3"><a href={ticketHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#203d2e] px-5 text-sm font-semibold text-white transition hover:bg-[#315b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><TicketIcon /> Bekijk tickets</a><a href={calendarHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c8d3c7] bg-[#fbfcf8] px-5 text-sm font-semibold text-[#294634] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><CalendarIcon /> {viewModel.importLabel}</a></div></div></div><ImageSurface image={heroImage} priority className="relative z-0 min-h-[23rem] overflow-hidden bg-[#cad5c9] sm:min-h-[31rem] lg:min-h-full"><div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(24,39,30,0.6))] p-5 sm:p-7"><div className="flex items-end justify-between gap-4 text-white"><p className="max-w-[18rem] text-sm font-medium leading-6 text-white/92">{viewModel.locationLabel}</p><a href={routeHref} target="_blank" rel="noreferrer" aria-label="Bekijk locatie op de kaart" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/92 text-[#294634] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><PinIcon /></a></div></div></ImageSurface></section>

    <section className="mt-20 sm:mt-28" aria-labelledby="why-title"><div className="mx-auto max-w-3xl text-center"><p className="inline-flex rounded-full bg-[#eef2e9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315c43]">Waarom dit bij je past</p><h2 id="why-title" className="mx-auto mt-5 text-[clamp(2.45rem,5vw,4.6rem)] font-semibold leading-[0.93] tracking-[-0.065em] text-[#17291f]">Een uitje dat meer doet dan je agenda vullen.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6a746c]">Alles wat er al over dit evenement bekend is, overzichtelijk bij elkaar om te bepalen of dit jouw volgende plan wordt.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fitFeatures.map((feature) => <article key={feature.title} className="rounded-[1.35rem] bg-[#f1f2ed] px-6 py-7 text-center transition duration-300 hover:-translate-y-1 hover:bg-[#e9eee5] sm:px-7"><span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fbfcf8] text-[#42684f]"><FeatureIcon name={feature.icon} /></span><h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.04em] text-[#203329]">{feature.title}</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#68736a]">{feature.description}</p></article>)}</div></section>

    <section className="mt-24 rounded-[1.75rem] bg-[#f1f3eb] px-6 py-9 sm:mt-32 sm:px-10 sm:py-12 lg:px-14 lg:py-16" aria-labelledby="expect-title"><div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16"><div className="max-w-xl"><h2 id="expect-title" className="mt-5 text-[clamp(2.3rem,4vw,3.9rem)] font-semibold leading-[0.93] tracking-[-0.06em] text-[#17291f]">Wat kun je verwachten?</h2><div className="mt-6 space-y-4 text-[1rem] leading-8 text-[#5e6d62]">{viewModel.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a href={ticketHref} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#203d2e] px-5 text-sm font-semibold text-white transition hover:bg-[#315b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]">Vind actuele informatie <ArrowIcon /></a></div><div className="grid gap-3 sm:grid-cols-2">{expectationFeatures.map((feature) => <article key={feature.title} className="rounded-[1.15rem] border border-[#dbe1d8] bg-[#fbfcf8] p-5 sm:p-6"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e5] text-[#416b50]"><FeatureIcon name={feature.icon} /></span><h3 className="mt-5 text-lg font-semibold tracking-[-0.04em] text-[#203329]">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-[#68736a]">{feature.description}</p></article>)}</div></div><div className="mt-10 border border-[#d6dfd1] bg-[#e5ecdf] px-6 py-8 text-center sm:mt-14 sm:px-10"><h3 className="mx-auto text-[clamp(1.55rem,3vw,2.45rem)] font-semibold tracking-[-0.05em] text-[#203329]">Maak er een mooie dag van.</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#607064]">Zet dit moment in je agenda en ontdek onderweg nog een leuke stop in dezelfde stad.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><a href={calendarHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#203d2e] px-5 text-sm font-semibold text-white transition hover:bg-[#315b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><CalendarIcon /> {viewModel.importLabel}</a><a href={routeHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#bfcdbd] bg-[#f9fbf7] px-5 text-sm font-semibold text-[#294634] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><PinIcon /> Bekijk route</a></div></div></section>

    <section className="mx-auto mt-24 max-w-[1040px] sm:mt-32" aria-labelledby="visit-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="visit-title" className="mt-3 text-[clamp(2.3rem,4vw,3.7rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#17291f]">Plan je bezoek</h2></div><p className="max-w-md text-sm leading-6 text-[#6a746c]">De belangrijkste gegevens voor een ontspannen bezoek, op één plek.</p></div><div className="mt-8 space-y-4"><VisitAccordion icon="calendar" title="Wanneer" rows={[["Datum", viewModel.dateLabel], ["Tijd", viewModel.timeLabel], ["Categorie", categoryMeta.label]]} /><VisitAccordion icon="pin" title="Locatie & route" rows={[["Locatie", viewModel.locationLabel], ["Route", viewModel.routeLabel], ["Tip", "Kom iets eerder zodat je rustig kunt starten."]]} /><VisitAccordion icon="ticket" title="Praktisch" rows={viewModel.practicalInfo.map((item) => [item.label, item.value])} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><a href={ticketHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#203d2e] px-5 text-sm font-semibold text-white transition hover:bg-[#315b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><TicketIcon /> Bekijk tickets</a><a href={routeHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9d3c7] bg-white px-5 text-sm font-semibold text-[#294634] transition hover:bg-[#f2f6ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><RouteIcon /> Plan route</a><a href={calendarHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9d3c7] bg-white px-5 text-sm font-semibold text-[#294634] transition hover:bg-[#f2f6ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"><CalendarIcon /> In agenda</a></div></section>

    {nearbyEvents.length ? <section className="mt-24 sm:mt-32" aria-labelledby="similar-title"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="similar-title" className="mt-3 text-[clamp(2.25rem,4vw,3.6rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#17291f]">Misschien ook leuk</h2><p className="mt-3 max-w-2xl text-base leading-7 text-[#6a746c]">{viewModel.nearbyIntro}</p></div><Link href={`/jaarkalender/${eventEntry.day.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#315c43] transition hover:text-[#173b28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f5c43]">Bekijk alles <ArrowIcon /></Link></div><div className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{nearbyEvents.map((entry) => <SimilarEventCard key={entry.eventSlug} entry={entry} />)}</div></section> : null}

    <section className="mt-24 sm:mt-32" aria-labelledby="gallery-title"><div className="max-w-2xl"><h2 id="gallery-title" className="mt-3 text-[clamp(2.25rem,4vw,3.6rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#17291f]">Een voorproefje van je volgende uitje.</h2><p className="mt-4 text-base leading-7 text-[#6a746c]">Een samengestelde, visuele impressie voor zolang er nog geen evenementfoto&apos;s vanuit de bron beschikbaar zijn.</p></div><div className="mt-9 grid gap-3 md:grid-cols-12 md:grid-rows-2"><ImageSurface image={galleryImages[0]} priority className="relative min-h-[17rem] overflow-hidden rounded-[1.45rem] bg-[#d9e2d7] md:col-span-5 md:row-span-2 md:min-h-[34.5rem]"><span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#294634]">Sfeerbeeld</span></ImageSurface><ImageSurface image={galleryImages[1]} className="min-h-[15rem] overflow-hidden rounded-[1.45rem] bg-[#e8e3d7] md:col-span-7 md:min-h-0" /><ImageSurface image={galleryImages[2]} className="min-h-[15rem] overflow-hidden rounded-[1.45rem] bg-[#dfe7df] md:col-span-3 md:min-h-0" /><ImageSurface image={galleryImages[3]} className="min-h-[15rem] overflow-hidden rounded-[1.45rem] bg-[#e8e3d7] md:col-span-4 md:min-h-0" /></div></section>
  </div></main>;
}
