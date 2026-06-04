"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import FestivalHero from "@/components/FestivalHero";
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
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Kaart" },
          ]}
          className="mb-6"
        />

        <FestivalHero
          eyebrow="Festivalkaart"
          title="Vind festivals op de kaart"
          currentView="map"
          description={
            <>
              Scan Nederland op datum, locatie en match. De festivalpunten staan
              op echte coordinaten, zodat locaties logisch bij elkaar vallen.
            </>
          }
          search={
            <div className="rounded-[1.6rem] border border-white/18 bg-white/12 px-5 py-5 text-white shadow-[0_24px_60px_rgba(3,10,14,0.18)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                Op de kaart
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[clamp(2.4rem,7vw,3.4rem)] font-semibold leading-none tracking-[-0.06em]">
                  {festivalDetails.length}
                </span>
                <span className="pb-1 text-sm font-medium text-white/78">
                  festivalpunten
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/76">
                Selecteer een marker of open direct een festival vanuit de lijst.
              </p>
            </div>
          }
        />

        <section
          aria-labelledby="festival-map-title"
          className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start"
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
                variant="festival"
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
                  className={`group block overflow-hidden rounded-[1.5rem] border bg-white/70 shadow-[0_18px_36px_rgba(45,37,28,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/82 hover:shadow-[0_24px_48px_rgba(45,37,28,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9cc84e] ${
                    isSelected ? "border-[#e8f2d0] ring-1 ring-[#e8f2d0]" : "border-white/70"
                  }`}
                >
                  <div className="flex gap-4 p-3">
                    <div
                      className="h-20 w-20 shrink-0 rounded-[1rem] bg-[#171511] bg-cover bg-center sm:h-24 sm:w-24 sm:rounded-[1.1rem]"
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
                      <h3 className="mt-2 text-lg font-semibold leading-[1.05] tracking-[-0.04em] text-[#171511] sm:text-xl">
                        {festival.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#665c51]">
                        {festival.locationLabel}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#171511] group-hover:text-[#7a1f3d]">
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
