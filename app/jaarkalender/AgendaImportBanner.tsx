"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { jaarkalenderCategoryMeta } from "./data";
import type { JaarkalenderCalendarItem } from "./data";

export type AgendaImportEvent = {
  dayIsoDate: string;
  daySlug: string;
  item: JaarkalenderCalendarItem;
};

type ExportLimit = "all" | 5 | 10 | 25;

const EXPORT_LIMIT_OPTIONS: { value: ExportLimit; label: string }[] = [
  { value: "all", label: "Alle zichtbare evenementen" },
  { value: 5, label: "Eerste 5" },
  { value: 10, label: "Eerste 10" },
  { value: 25, label: "Eerste 25" },
];

function ImportCalendarIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="4.25"
        y="5.25"
        width="15.5"
        height="14.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 3.75V7M16 3.75V7M4.5 9.25H19.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 12v5M9.5 14.5H14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProviderCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[#e6decd] bg-[#fbfaf6] p-4">
      <p className="text-sm font-semibold text-[#1f1b16]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#6a5d50]">{subtitle}</p>
      <div className="mt-4 inline-flex rounded-full bg-[#edf3df] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#56683a]">
        Via .ics
      </div>
    </div>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toUtcStamp(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
    date.getUTCSeconds()
  )}Z`;
}

function toFloatingIcsDate(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let remaining = line;

  while (remaining.length > 72) {
    chunks.push(remaining.slice(0, 72));
    remaining = ` ${remaining.slice(72)}`;
  }

  chunks.push(remaining);
  return chunks.join("\r\n");
}

function getEventStart(event: AgendaImportEvent) {
  const timeMatch = event.item.datum.match(/(\d{1,2}):(\d{2})/);
  const [year, month, day] = event.dayIsoDate.split("-").map(Number);
  const hours = timeMatch ? Number(timeMatch[1]) : 9;
  const minutes = timeMatch ? Number(timeMatch[2]) : 0;

  return new Date(year, month - 1, day, hours, minutes, 0);
}

function makeIcsCalendar(events: AgendaImportEvent[]) {
  const stamp = toUtcStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Uitjes NL//Jaarkalender//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Jaarkalender Uitjes NL",
  ];

  events.forEach((event, index) => {
    const start = getEventStart(event);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const categoryLabel = jaarkalenderCategoryMeta[event.item.categorie].label;
    const description = [
      `Categorie: ${categoryLabel}`,
      `Datum: ${event.item.datum}`,
      `Voor: ${event.item.metWie}`,
      `Prijs: ${event.item.prijs}`,
      `Sfeer: ${event.item.sfeer}`,
    ].join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:jaarkalender-${event.daySlug}-${index}@uitjes-nl.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toFloatingIcsDate(start)}`,
      `DTEND:${toFloatingIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(event.item.title)}`,
      `LOCATION:${escapeIcsText(event.item.locatie)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `CATEGORIES:${escapeIcsText(categoryLabel)}`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

function getLimitedEvents(events: AgendaImportEvent[], limit: ExportLimit) {
  return limit === "all" ? events : events.slice(0, limit);
}

function getExportCountText(
  visibleCount: number,
  selectedCount: number,
  limit: ExportLimit
) {
  if (visibleCount === 0) {
    return "Geen zichtbare evenementen om toe te voegen.";
  }

  if (limit === "all") {
    return `Alle ${visibleCount} zichtbare evenementen worden toegevoegd.`;
  }

  return `${selectedCount} evenementen worden toegevoegd aan je agenda.`;
}

export function AgendaImportBanner({
  events,
}: {
  events: AgendaImportEvent[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [exportLimit, setExportLimit] = useState<ExportLimit>("all");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const exportEvents = useMemo(
    () => getLimitedEvents(events, exportLimit),
    [events, exportLimit]
  );
  const exportCountText = getExportCountText(
    events.length,
    exportEvents.length,
    exportLimit
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const downloadIcs = () => {
    if (exportEvents.length === 0) {
      setDownloadError(
        "Er zijn geen zichtbare evenementen om te importeren. Pas je filters aan en probeer opnieuw."
      );
      return;
    }

    const calendar = makeIcsCalendar(exportEvents);
    const blob = new Blob([calendar], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "jaarkalender-events.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setDownloadError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const getFocusableElements = () => {
      const modal = modalRef.current;
      if (!modal) return [];

      return Array.from(
        modal.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => {
      getFocusableElements()[0]?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <section className="border border-white/14 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-[#dbe8c8] bg-[linear-gradient(135deg,#dcefd2,#d1e8cb_48%,#cae3c9)] p-4 shadow-[0_18px_48px_rgba(89,111,54,0.08)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-[#547037] shadow-[0_12px_24px_rgba(73,96,40,0.12)]">
              <ImportCalendarIcon />
            </div>
            <div>
              <h3 className="text-[clamp(1.2rem,2vw,1.55rem)] font-semibold tracking-[-0.04em] text-[#1d2019]">
                Importeer evenementen in mijn agenda
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#546049] sm:text-base">
                Download de zichtbare uitjes als agenda-bestand.
              </p>
            </div>
          </div>

          <button
            type="button"
            ref={triggerRef}
            onClick={() => {
              setDownloadError(null);
              setIsOpen(true);
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4d6f1f] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(69,99,28,0.28)] transition hover:-translate-y-0.5 hover:bg-[#416018] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
          >
            Importeer nu
          </button>
        </div>
      </section>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[#17120d]/50 px-3 py-3 sm:items-center sm:px-4 sm:py-8"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-import-title"
            tabIndex={-1}
            className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.4rem] border border-[#e7ddcf] bg-[#f7f2e9] shadow-[0_30px_80px_rgba(39,27,16,0.24)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#eadfce] px-5 py-5 sm:px-7 sm:py-6">
              <div className="min-w-0">
                <div className="inline-flex rounded-full bg-[#e7f1d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6f42]">
                  Agenda import
                </div>
                <h3
                  id="agenda-import-title"
                  className="mt-3 text-[clamp(1.55rem,7vw,2.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-[#171511]"
                >
                  Download je zichtbare uitjes als agenda-bestand.
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Sluit importvenster"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[#4f453c] transition hover:border-[#c9baa7] hover:bg-[#faf7f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <p className="mt-4 text-sm leading-7 text-[#5c4f43] sm:text-base">
                Maak een .ics-bestand van de evenementen die nu in de
                jaarkalender zichtbaar zijn. Dat bestand kun je openen met
                Apple Agenda, Google Calendar, Outlook of een andere
                kalender-app.
              </p>

              <section className="mt-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#27231f]">
                    Aantal evenementen
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-[#6b5f53]">
                    Kies hoeveel evenementen je wilt meenemen in je
                    agenda-export.
                  </p>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {EXPORT_LIMIT_OPTIONS.map((option) => {
                    const isSelected = exportLimit === option.value;

                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setExportLimit(option.value);
                          setDownloadError(null);
                        }}
                        className={`min-h-12 rounded-full border px-5 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] ${
                          isSelected
                            ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                            : "border-transparent bg-white/78 text-[#4f4339] hover:bg-[#eedfd2]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ProviderCard
                  title="Google Calendar"
                  subtitle="Importeer het gedownloade bestand in je Google agenda."
                />
                <ProviderCard
                  title="Outlook Calendar"
                  subtitle="Open het .ics-bestand of importeer het in Outlook."
                />
              </div>

              <div className="mt-6 rounded-[1.2rem] border border-dashed border-[#d9cebf] bg-white/72 p-4">
                <p className="text-sm font-semibold text-[#27231f]">
                  {exportCountText}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#6b5f53]">
                  De download gebruikt titel, datum, locatie en categorie uit de
                  bestaande dummy data. Elke activiteit krijgt standaard twee
                  uur in je agenda.
                </p>
                {downloadError ? (
                  <p className="mt-3 text-sm font-medium text-[#9a3d25]">
                    {downloadError}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eadfce] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8caba] px-5 text-sm font-semibold text-[#574b40] transition hover:border-[#c2b29c] hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e]"
              >
                Sluiten
              </button>
              <button
                type="button"
                onClick={downloadIcs}
                disabled={exportEvents.length === 0}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4d6f1f] px-5 text-sm font-semibold text-white transition hover:bg-[#416018] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc84e] disabled:cursor-not-allowed disabled:bg-[#a9a091] disabled:text-white/82"
              >
                Download .ics
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
