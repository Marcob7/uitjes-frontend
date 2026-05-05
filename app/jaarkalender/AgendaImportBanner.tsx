"use client";

import { useEffect, useState } from "react";

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
    <div className="border border-white/14 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-[#e6decd] bg-[#fbfaf6] p-4">
      <p className="text-sm font-semibold text-[#1f1b16]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#6a5d50]">{subtitle}</p>
      <div className="mt-4 inline-flex rounded-full bg-[#edf3df] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#56683a]">
        Binnenkort
      </div>
    </div>
  );
}

export function AgendaImportBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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
                Synchroniseer je favoriete uitjes direct met Google of Outlook.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4d6f1f] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(69,99,28,0.28)] transition hover:-translate-y-0.5 hover:bg-[#416018]"
          >
            Importeer nu
          </button>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17120d]/50 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-import-title"
            className="relative w-full max-w-[34rem] rounded-[2rem] border border-[#e7ddcf] bg-[#f7f2e9] p-6 shadow-[0_30px_80px_rgba(39,27,16,0.24)] sm:p-7"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Sluit import venster"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/10 backdrop-blur-xl text-[#4f453c] transition hover:border-[#c9baa7] hover:bg-[#faf7f1]"
            >
              <CloseIcon />
            </button>

            <div className="max-w-[28rem]">
              <div className="inline-flex rounded-full bg-[#e7f1d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6f42]">
                Agenda import
              </div>
              <h3
                id="agenda-import-title"
                className="mt-4 text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#171511]"
              >
                Zet je uitjes straks direct in je eigen agenda.
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#5c4f43] sm:text-base">
                De koppeling bouwen we later af. Voor nu staat de flow klaar,
                zodat we alvast de ervaring kunnen finetunen.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ProviderCard
                title="Google Calendar"
                subtitle="Voeg gekozen evenementen straks direct toe aan je Google agenda."
              />
              <ProviderCard
                title="Outlook Calendar"
                subtitle="Synchroniseer later eenvoudig met je werk- of priveagenda."
              />
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-dashed border-[#d9cebf] bg-white/72 p-4">
              <p className="text-sm font-semibold text-[#27231f]">
                Placeholder voor importfunctionaliteit
              </p>
              <p className="mt-1 text-sm leading-6 text-[#6b5f53]">
                Hier kunnen we later de echte accountkoppeling, machtigingen en
                bevestigingsflow in plaatsen.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-semibold text-[#574b40] transition hover:border-[#c2b29c] hover:bg-white/10 backdrop-blur-xl"
              >
                Sluiten
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4d6f1f] px-5 text-sm font-semibold text-white transition hover:bg-[#416018]"
              >
                Later koppelen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
