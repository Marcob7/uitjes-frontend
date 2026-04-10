"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  jaarkalenderCategoryMeta,
  type JaarkalenderCategoryKey,
} from "./data";

const monthFilters = [
  "Locatie",
  "Datum",
  "Categorie",
  "Met wie",
  "Prijs",
  "Binnen/buiten",
  "Sfeer",
  "Gratis",
];

const periodOptions = [
  "Komende 30 dagen",
  "Dit weekend",
  "Deze maand",
  "Herfst 2024",
];

const companionOptions = [
  "Alles",
  "Met partner",
  "Met vrienden",
  "Met kinderen",
  "Solo",
];

const moodOptions = [
  "Bruisend",
  "Rustig",
  "Creatief",
  "Romantisch",
  "Avontuurlijk",
];

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

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.667 4h10.666M4.667 8h6.666M6.667 12h2.666"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="9"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M13.25 13.25L16.5 16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function ControlButton({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dfd7c9] bg-white/80 px-5 text-sm font-medium text-[#2c2925] transition hover:border-[#c9bea9] hover:bg-white"
    >
      {icon}
      {children}
    </button>
  );
}

export function JaarkalenderFilterControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState("Locatie");
  const [activeCategory, setActiveCategory] =
    useState<JaarkalenderCategoryKey>("muziek");
  const [activeMood, setActiveMood] = useState("Bruisend");

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

  const openModal = (triggerLabel: string) => {
    setActiveTrigger(triggerLabel);
    setIsOpen(true);
  };

  return (
    <>
      <div className="xl:max-w-[34rem]">
        <div className="flex flex-wrap gap-3">
          <ControlButton
            icon={<PinIcon />}
            onClick={() => openModal("Heel Nederland")}
          >
            Heel Nederland
          </ControlButton>
          <ControlButton
            icon={<FilterIcon />}
            onClick={() => openModal("Alle categorieen")}
          >
            Alle categorieen
          </ControlButton>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {monthFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => openModal(filter)}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition ${
                activeTrigger === filter && isOpen
                  ? "border-[#b8df71] bg-[#eef8d8] text-[#344125]"
                  : "border-[#ddd5c8] bg-[#fbf8f2] text-[#55483d] hover:border-[#c8baa6] hover:bg-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(34,26,20,0.28)] px-4 py-8 backdrop-blur-[6px]"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="jaarkalender-filter-title"
            className="relative w-full max-w-[52rem] overflow-hidden rounded-[2.6rem] border border-white/65 bg-[linear-gradient(180deg,#f9f5ee_0%,#f7f2ea_100%)] shadow-[0_28px_100px_rgba(52,38,25,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0e2d6] px-6 py-6 sm:px-10 sm:py-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8f7b68]">
                  Jaarkalender
                </p>
                <h3
                  id="jaarkalender-filter-title"
                  className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.06em] text-[#171511]"
                >
                  Filter je zoekopdracht
                </h3>
                <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[#68584c] sm:text-base">
                  Verfijn je overzicht op locatie, periode, categorie en sfeer.
                  Geopend via: <span className="font-semibold">{activeTrigger}</span>.
                </p>
              </div>

              <button
                type="button"
                aria-label="Sluit filter modal"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5e7db] text-[#171511] transition hover:bg-[#eddccd]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-6 py-6 sm:px-10 sm:py-8">
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-semibold text-[#171511]">
                    Locatie (stad)
                  </label>
                  <div className="mt-3 flex min-h-16 items-center gap-3 rounded-full bg-[#f5e8dc] px-6 text-[#897468] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Bijv. Amsterdam, Utrecht..."
                      className="w-full bg-transparent text-lg text-[#6f6157] outline-none placeholder:text-[#9e8f84]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#171511]">
                      Periode
                    </label>
                    <button
                      type="button"
                      className="mt-3 flex min-h-16 w-full items-center justify-between rounded-full bg-[#f5e8dc] px-6 text-left text-lg text-[#231d18] transition hover:bg-[#f1e0d1]"
                    >
                      <span>{periodOptions[0]}</span>
                      <ChevronDownIcon />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#171511]">
                      Categorie
                    </label>
                    <button
                      type="button"
                      className="mt-3 flex min-h-16 w-full items-center justify-between rounded-full bg-[#f5e8dc] px-6 text-left text-lg text-[#231d18] transition hover:bg-[#f1e0d1]"
                    >
                      <span>{jaarkalenderCategoryMeta[activeCategory].label}</span>
                      <ChevronDownIcon />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#171511]">
                      Met wie
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {companionOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            option === "Alles"
                              ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                              : "border-transparent bg-[#f5e8dc] text-[#4f4339] hover:bg-[#eedfd2]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#171511]">
                      Sfeer
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {moodOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setActiveMood(option)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            activeMood === option
                              ? "border-[#b8df71] bg-[#f3fadf] text-[#2c381d]"
                              : "border-transparent bg-[#f5e8dc] text-[#4f4339] hover:bg-[#eedfd2]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#171511]">
                    Interesses
                  </label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(Object.keys(jaarkalenderCategoryMeta) as JaarkalenderCategoryKey[]).map(
                      (category) => {
                        const meta = jaarkalenderCategoryMeta[category];
                        const isActive = activeCategory === category;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                              isActive
                                ? "border-[#b8df71] bg-[#f6fbeb] text-[#1f2916]"
                                : `${meta.badgeClass} border-transparent hover:opacity-90`
                            }`}
                          >
                            {meta.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="grid gap-4 pt-2 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex min-h-16 items-center justify-center rounded-full bg-[#171511] px-6 text-lg font-semibold text-white transition hover:bg-[#29231d]"
                  >
                    Wis filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex min-h-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d6f48b,#bdf178)] px-6 text-lg font-semibold text-[#171511] transition hover:brightness-[0.98]"
                  >
                    Toon resultaten
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#a09184] sm:px-10 sm:pb-8">
              Filters worden alleen visueel geopend in deze demo
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
