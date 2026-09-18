"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { buildGoogleCalendarHref, buildOutlookCalendarHref, makeIcsCalendar, type CalendarEvent } from "@/lib/calendarIntegration";
import { jaarkalenderCategoryMeta } from "./data";
import type { JaarkalenderCalendarItem } from "./data";

export type AgendaImportEvent = { dayIsoDate: string; daySlug: string; item: JaarkalenderCalendarItem };
type ExportLimit = "all" | 5 | 10 | 25;
const limitOptions: { value: ExportLimit; label: string }[] = [{ value: "all", label: "Alle zichtbare evenementen" }, { value: 5, label: "Eerste 5" }, { value: 10, label: "Eerste 10" }, { value: 25, label: "Eerste 25" }];

function CalendarIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.25" y="5.25" width="15.5" height="14.5" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 3.75V7M16 3.75V7M4.5 9.25H19.5M12 12v5M9.5 14.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function CloseIcon() { return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }

function normalizeEvent(event: AgendaImportEvent, index: number): CalendarEvent {
  const time = event.item.datum.match(/(\d{1,2}):(\d{2})/);
  const [year, month, day] = event.dayIsoDate.split("-").map(Number);
  const start = new Date(year, month - 1, day, time ? Number(time[1]) : 0, time ? Number(time[2]) : 0);
  const detailPath = `/jaarkalender/${event.daySlug}`;
  const detailUrl = typeof window === "undefined" ? detailPath : new URL(detailPath, window.location.origin).toString();
  return { title: event.item.title, start, end: time ? new Date(start.getTime() + 2 * 60 * 60 * 1000) : undefined, isAllDay: !time, location: event.item.locatie || undefined, description: [`Categorie: ${jaarkalenderCategoryMeta[event.item.categorie].label}`, `Voor: ${event.item.metWie}`, `Prijs: ${event.item.prijs}`, `Sfeer: ${event.item.sfeer}`].filter(Boolean).join("\n"), url: detailUrl, uid: `jaarkalender-${event.daySlug}-${index}@uitjes-nl.local` };
}

function downloadIcs(events: CalendarEvent[]) {
  const url = URL.createObjectURL(new Blob([makeIcsCalendar(events)], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "jaarkalender-events.ics"; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function AgendaImportBanner({ events }: { events: AgendaImportEvent[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<"google" | "outlook" | null>(null);
  const [limit, setLimit] = useState<ExportLimit>("all");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarEvents = useMemo(() => (limit === "all" ? events : events.slice(0, limit)).map(normalizeEvent), [events, limit]);
  const close = () => { setProvider(null); setIsOpen(false); };

  useEffect(() => {
    if (!isOpen) return;
    const focusable = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { close(); return; } if (event.key !== "Tab") return; const items = focusable(); const first = items[0]; const last = items.at(-1); if (!first || !last) return; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
    const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; window.addEventListener("keydown", onKeyDown); window.setTimeout(() => focusable()[0]?.focus(), 0);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKeyDown); triggerRef.current?.focus(); };
  }, [isOpen]);

  const providerLabel = provider === "google" ? "Google Calendar" : "Outlook";
  return <>
    <section className="rounded-[1.4rem] border border-[#ddd9d0] bg-[#fbfaf7] p-4 shadow-[0_16px_42px_rgba(47,43,34,0.05)] sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch"><div className="flex items-center gap-3.5"><span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e6efe8] text-[#176343]"><CalendarIcon /></span><div><h3 className="text-lg font-semibold tracking-[-0.03em] text-[#20231f]">Zet ze in je agenda</h3><p className="mt-1 text-sm leading-6 text-[#686b65]">Kies de agenda die jij gebruikt.</p></div></div><button type="button" ref={triggerRef} onClick={() => setIsOpen(true)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#bad0c2] px-5 text-sm font-semibold text-[#176343] transition hover:-translate-y-0.5 hover:border-[#7da88e] hover:bg-[#eaf1ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00784a]">Zet in agenda</button></div></section>
    {isOpen ? <div className="fixed inset-0 z-[1200] flex items-end justify-center overflow-y-auto bg-[#17120d]/50 px-3 py-3 sm:items-center sm:px-4 sm:py-8" onClick={close}><div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="agenda-import-title" tabIndex={-1} className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.4rem] border border-[#e7ddcf] bg-[#f7f2e9] shadow-[0_30px_80px_rgba(39,27,16,0.24)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2rem]" onClick={(event) => event.stopPropagation()}><header className="flex items-start justify-between gap-4 border-b border-[#eadfce] px-5 py-5 sm:px-7 sm:py-6"><div><h3 id="agenda-import-title" className="mt-3 text-[clamp(1.55rem,7vw,2.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-[#171511]">{provider ? `Open in ${providerLabel}` : "Zet in agenda"}</h3></div><button type="button" onClick={close} aria-label="Sluit agenda-keuze" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[#4f453c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"><CloseIcon /></button></header><div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{provider ? <><p className="text-sm leading-6 text-[#5c4f43]">Kies een evenement om het direct in {providerLabel} te openen.</p><div className="mt-5 grid gap-2">{calendarEvents.map((event) => <a key={event.uid} href={provider === "google" ? buildGoogleCalendarHref(event) : buildOutlookCalendarHref(event)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"><span>{event.title}</span><span aria-hidden="true">↗</span></a>)}</div><button type="button" onClick={() => setProvider(null)} className="mt-5 text-sm font-semibold text-[#315c43] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]">Terug naar agenda&apos;s</button></> : <><p className="text-sm leading-7 text-[#5c4f43] sm:text-base">Kies waar je de zichtbare uitjes wilt toevoegen. Apple Agenda en andere agenda-apps openen een compatibel agenda-bestand.</p><section className="mt-6"><h4 className="text-sm font-semibold text-[#27231f]">Aantal evenementen</h4><div className="mt-3 grid gap-2 sm:grid-cols-2">{limitOptions.map((option) => <button key={String(option.value)} type="button" aria-pressed={limit === option.value} onClick={() => setLimit(option.value)} className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${limit === option.value ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]" : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"}`}>{option.label}</button>)}</div></section><div className="mt-6 grid gap-3"><button type="button" disabled={!calendarEvents.length} onClick={() => downloadIcs(calendarEvents)} className="min-h-14 rounded-xl bg-[#4d6f1f] px-5 text-left text-sm font-semibold text-white transition hover:bg-[#416018] disabled:cursor-not-allowed disabled:bg-[#a9a091]">Apple Calendar / iPhone <span className="block pt-1 text-xs font-medium text-white/80">Open in Apple Agenda</span></button><button type="button" disabled={!calendarEvents.length} onClick={() => setProvider("google")} className="min-h-14 rounded-xl bg-white/80 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df] disabled:cursor-not-allowed">Google Calendar <span className="block pt-1 text-xs font-medium text-[#6b5f53]">Open elk gekozen evenement in Google</span></button><button type="button" disabled={!calendarEvents.length} onClick={() => setProvider("outlook")} className="min-h-14 rounded-xl bg-white/80 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df] disabled:cursor-not-allowed">Outlook <span className="block pt-1 text-xs font-medium text-[#6b5f53]">Open elk gekozen evenement in Outlook</span></button><button type="button" disabled={!calendarEvents.length} onClick={() => downloadIcs(calendarEvents)} className="min-h-14 rounded-xl border border-[#d9cebf] bg-white/55 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-white disabled:cursor-not-allowed">Andere agenda <span className="block pt-1 text-xs font-medium text-[#6b5f53]">Download een .ics-bestand</span></button></div>{!calendarEvents.length ? <p className="mt-4 text-sm font-medium text-[#9a3d25]">Er zijn geen zichtbare evenementen. Pas je filters aan en probeer opnieuw.</p> : null}</>}</div></div></div> : null}
  </>;
}
