"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DialogShell, IconButton } from "@/components/ui";
import {
  buildGoogleCalendarHref,
  buildOutlookCalendarHref,
  downloadCalendarFile,
  isCalendarExportable,
  toCalendarEvent,
  type CalendarEventInput,
} from "@/lib/calendarIntegration";

type Provider = "google" | "outlook";

function CalendarIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.25" y="4.75" width="13.5" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.35" /><path d="M6.5 3v3.5M13.5 3v3.5M3.25 8h13.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" /></svg>;
}

function CloseIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

/** Reusable provider picker for one concretely dated activity. */
export default function CalendarActions({
  event,
  className,
  label,
}: {
  event: CalendarEventInput;
  className?: string;
  label?: string;
}) {
  const { t } = useLocale();
  const canonicalUrl = event.url && typeof window !== "undefined"
    ? new URL(event.url, window.location.origin).toString()
    : event.url;
  const calendarEvent = useMemo(() => toCalendarEvent({
    ...event,
    // Timeline and result cards can supply a canonical path. Resolve it at the
    // client boundary so every provider receives the actual detail URL.
    url: canonicalUrl,
  }), [event, canonicalUrl]);
  const canAddToCalendar = isCalendarExportable(event) && calendarEvent !== null;
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalReady, setIsPortalReady] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const close = () => { setProvider(null); setIsOpen(false); };

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !isPortalReady) return;
    const focusable = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") return close();
      if (keyEvent.key !== "Tab") return;
      const items = focusable(); const first = items[0]; const last = items.at(-1);
      if (!first || !last) return;
      if (keyEvent.shiftKey && document.activeElement === first) { keyEvent.preventDefault(); last.focus(); }
      else if (!keyEvent.shiftKey && document.activeElement === last) { keyEvent.preventDefault(); first.focus(); }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => focusable()[0]?.focus(), 0);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKeyDown); triggerRef.current?.focus(); };
  }, [isOpen, isPortalReady]);

  if (!canAddToCalendar || !calendarEvent) return null;
  const downloadForCalendarApp = () => {
    // Start the browser action before closing the dialog: this retains the
    // click's user gesture, which is required by iPhone and Safari.
    downloadCalendarFile([calendarEvent]);
    close();
  };
  const providerLabel = provider === "google" ? t("calendar.google") : t("calendar.outlook");
  const providerHref = provider === "google" ? buildGoogleCalendarHref(calendarEvent) : buildOutlookCalendarHref(calendarEvent);

  return <>
    <button type="button" ref={triggerRef} onClick={() => setIsOpen(true)} className={className ?? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9d3c7] bg-white px-5 text-sm font-semibold text-[#294634] transition hover:bg-[#f2f6ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5c43]"}><CalendarIcon /> {label ?? t("calendar.add")}</button>
    {isOpen && isPortalReady ? createPortal(<div className="fixed inset-0 z-[1200] flex items-end justify-center overflow-y-auto bg-[#17120d]/50 px-3 py-3 sm:items-center sm:px-4 sm:py-8" onClick={close}>
      <DialogShell ref={modalRef} labelledBy="calendar-actions-title" className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.4rem] border border-[#e7ddcf] bg-[#f7f2e9] shadow-[0_30px_80px_rgba(39,27,16,0.24)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2rem]" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <header className="flex items-start justify-between gap-4 border-b border-[#eadfce] px-5 py-5 sm:px-7 sm:py-6"><h3 id="calendar-actions-title" className="mt-3 text-[clamp(1.55rem,7vw,2.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-[#171511]">{provider ? t("calendar.openIn", { provider: providerLabel }) : t("calendar.add")}</h3><IconButton onClick={close} aria-label={t("calendar.closeChooser")} className="rounded-full border border-white/70 bg-white/80 text-[#4f453c]"><CloseIcon /></IconButton></header>
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{provider ? <><p className="text-sm leading-6 text-[#5c4f43]">{t("calendar.openDirectly", { provider: providerLabel })}</p><a href={providerHref} target="_blank" rel="noreferrer" className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df]"><span>{calendarEvent.title}</span><span aria-hidden="true">↗</span></a><button type="button" onClick={() => setProvider(null)} className="mt-5 text-sm font-semibold text-[#315c43] underline underline-offset-4">{t("calendar.backToProviders")}</button></> : <><p className="text-sm leading-7 text-[#5c4f43] sm:text-base">{t("calendar.chooserIntro")}</p><div className="mt-6 grid gap-3"><button type="button" onClick={downloadForCalendarApp} aria-label={t("calendar.openApple")} className="min-h-14 rounded-xl bg-[#4d6f1f] px-5 text-left text-sm font-semibold text-white transition hover:bg-[#416018]">{t("calendar.apple")} <span className="block pt-1 text-xs font-medium text-white/80">{t("calendar.appleIntro")}</span></button><button type="button" onClick={() => setProvider("google")} className="min-h-14 rounded-xl bg-white/80 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df]">{t("calendar.google")} <span className="block pt-1 text-xs font-medium text-[#6b5f53]">{t("calendar.openGoogle")}</span></button><button type="button" onClick={() => setProvider("outlook")} className="min-h-14 rounded-xl bg-white/80 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-[#edf3df]">{t("calendar.outlook")} <span className="block pt-1 text-xs font-medium text-[#6b5f53]">{t("calendar.openOutlook")}</span></button><button type="button" onClick={downloadForCalendarApp} aria-label={t("calendar.downloadAria")} className="min-h-14 rounded-xl border border-[#d9cebf] bg-white/55 px-5 text-left text-sm font-semibold text-[#2c381d] transition hover:bg-white">{t("calendar.download")} <span className="block pt-1 text-xs font-medium text-[#6b5f53]">{t("calendar.downloadIntro")}</span></button></div></>}</div>
      </DialogShell>
    </div>, document.body) : null}
  </>;
}
