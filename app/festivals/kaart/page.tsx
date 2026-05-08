"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalViewToggle from "@/components/FestivalViewToggle";
import { optimizeCssBackground } from "@/lib/remoteImage";
import type { BackendEvent } from "@/components/city-explore/types";
import { festivalDetails, getFestivalDetailHref } from "../data";

const ExploreMap = dynamic(() => import("@/components/city-explore/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-[2.8rem] bg-[#f2e6d6] text-sm font-semibold text-[#5d5148] shadow-[0_36px_70px_rgba(52,37,22,0.12)] sm:h-[380px] lg:h-[420px]">
      Kaart laden
    </div>
  ),
});

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 4 12.667 8l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FestivalsMapPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const mapEvents = useMemo<BackendEvent[]>(
    () =>
      festivalDetails.map((festival, index) => ({
        id: index + 1,
        title: festival.name,
        city: "Nederland",
        venue: festival.locationLabel,
        start_at: null,
        end_at: null,
        date_text: festival.dateLabel,
        is_ongoing: false,
        is_free: false,
        price_min: null,
        source_url: getFestivalDetailHref(festival.slug),
        latitude: festival.latitude,
        longitude: festival.longitude,
        summary: festival.vibe,
        image: festival.heroImage,
        status: `${festival.matchScore}% match`,
        category_label: festival.genres.join(", "),
      })),
    []
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Kaart" },
          ]}
          className="mb-6"
        />

        <section className="uitjes-liquid-section mb-6 rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[42rem]">
              <div className="inline-flex rounded-full border border-white/24 bg-white/14 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
                Festivalkaart
              </div>
              <h1 className="mt-6 max-w-[11ch] text-[clamp(3.2rem,8vw,5.7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                Vind festivals op de kaart
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/88 sm:text-lg">
                Scan Nederland op datum, locatie en match. De kaart gebruikt nu
                echte coordinaten, zodat de festivalpunten logisch bij elkaar staan.
              </p>
            </div>

            <FestivalViewToggle currentView="map" />
          </div>
        </section>

        <section
          aria-labelledby="festival-map-title"
          className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start"
        >
          <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b6f64]">
                  Nederland
                </p>
                <h2
                  id="festival-map-title"
                  className="mt-1 text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[#171511] sm:text-[2.5rem]"
                >
                  Festivals op locatie
                </h2>
              </div>
              <p className="max-w-[26rem] text-sm leading-6 text-[#665c51]">
                Tik een marker aan voor context of open een festival vanuit de
                lijst eronder.
              </p>
            </div>

            <div aria-label="Kaart met festival locaties in Nederland">
              <ExploreMap
                cityLabel="Nederland"
                events={mapEvents}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>
          </div>

          <div className="space-y-3 lg:pt-[5.65rem]">
            {festivalDetails.map((festival, index) => {
              const eventId = index + 1;
              const isSelected = selectedId === eventId;
              const href = getFestivalDetailHref(festival.slug);

              return (
                <Link
                  key={festival.slug}
                  href={href}
                  onMouseEnter={() => setSelectedId(eventId)}
                  onFocus={() => setSelectedId(eventId)}
                  aria-label={`Bekijk ${festival.name}`}
                  className={`group block overflow-hidden rounded-[1.5rem] border bg-white shadow-[0_18px_36px_rgba(45,37,28,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(45,37,28,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5c7d2c] ${
                    isSelected ? "border-[#5c7d2c]" : "border-[#eadfd3]"
                  }`}
                >
                  <div className="flex gap-4 p-3">
                    <div
                      className="h-24 w-24 shrink-0 rounded-[1.1rem] bg-[#171511] bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.08), rgba(8,8,8,0.36)), ${optimizeCssBackground(
                          festival.heroImage,
                          {
                            width: 320,
                            quality: 56,
                          }
                        )}`,
                      }}
                    />
                    <div className="min-w-0 flex-1 py-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b6f64]">
                          {festival.dateLabel}
                        </p>
                        <span className="shrink-0 rounded-full bg-[#eef4df] px-2.5 py-1 text-[11px] font-semibold text-[#3d5d1d]">
                          {festival.matchScore}%
                        </span>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511]">
                        {festival.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#665c51]">
                        {festival.locationLabel}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#171511] group-hover:text-[#4f7628]">
                        Bekijk festival
                        <ArrowRightIcon />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
