"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet } from "@/lib/api";
import EventsClient from "@/app/events/EventsClient";

import HeroSection from "@/components/HeroSection";
import InspirationCardsSection from "@/components/InspirationCardsSection";
import TrustedSection from "@/components/TrustedSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeatureCardsSection from "@/components/FeatureCardsSection";
import TestimonialSection from "@/components/TestimonialSection";
import FinalCtaSection from "@/components/FinalCtaSection";

type EventItem = {
  id: number;
  title?: string;
};

export default function Home() {
  const city = "apeldoorn";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const spotlightTags = ["Live muziek", "Food spots", "Weekendtips"];
  const curatedMoments = [
    "Kies sneller tussen cultureel, spontaan en gezinsvriendelijk.",
    "Gebruik de preview om direct door te klikken naar actuele plannen.",
    "Houd de homepage redactioneel, niet alleen functioneel.",
  ];

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/api/events/?city=${city}`)
      .then((data) => setEvents(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, [city]);

  const previewLabel = loading
    ? "Preview wordt geladen"
    : events.length === 0
      ? "Nog geen events in de preview"
      : `${events.length} events klaar om te bekijken`;

  return (
    <>
    
      <HeroSection />
      <InspirationCardsSection />
      <TrustedSection />
      <ShowcaseSection />
      <FeatureCardsSection />
      <TestimonialSection />

      <main className="relative overflow-hidden bg-[#f5f1e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(214,173,91,0.22),_transparent_58%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/88 p-6 shadow-[0_28px_90px_rgba(60,43,24,0.08)] backdrop-blur sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[2rem] bg-[#1f1d1a] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                  Home, verfijnd
                </span>

                <h1 className="font-heading mt-5 max-w-3xl text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  Start sneller met een homepage die aanvoelt als een curated city edit.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                  Gebruik Reuring als een rustige, moderne startpagina voor {cityName}: meteen richting,
                  meteen vertrouwen en meteen een logische volgende stap voor bezoekers die iets willen doen.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/ontdek?city=${city}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f6c86b] px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-[#f3be54]"
                  >
                    Ontdek {cityName}
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
                  >
                    Bekijk alle events
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {spotlightTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/82"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <aside className="grid gap-4">
                <div className="rounded-[1.75rem] border border-stone-200 bg-[#f7f2e9] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Account
                      </p>
                      <h2 className="font-heading mt-2 text-2xl text-stone-900">
                        Persoonlijke start
                      </h2>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
                      Preview
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.4rem] bg-white p-4 shadow-[0_16px_40px_rgba(97,73,38,0.08)]">
                    <AuthBlock />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_16px_50px_rgba(70,52,24,0.08)] sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Vandaag in {cityName}
                      </p>
                      <h2 className="font-heading mt-2 text-2xl text-stone-900">
                        {previewLabel}
                      </h2>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
                  </div>

                  <div className="mt-4 rounded-[1.4rem] border border-stone-200 bg-[#fcfbf8] p-4">
                    <Suspense fallback={<p className="text-sm text-stone-600">Laden...</p>}>
                      <EventsClient />
                    </Suspense>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-6">
              <section className="rounded-[2rem] border border-stone-200 bg-[#fcfbf8] p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                  <div className="max-w-2xl">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Home preview
                    </span>
                    <h2 className="font-heading mt-3 text-3xl text-stone-900 sm:text-4xl">
                      Preview: events in {cityName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                      Houd de homepage bruikbaar: laat bezoekers direct zien wat er nu speelt,
                      zonder eerst door meerdere pagina&apos;s te navigeren.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                    <Link
                      href="/ontdek"
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
                    >
                      Ga naar Ontdek
                    </Link>
                    <Link
                      href="/events"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                      Open eventoverzicht
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {curatedMoments.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-white p-4 shadow-[0_18px_50px_rgba(92,70,35,0.06)] sm:p-5">
                  {loading ? (
                    <p className="text-neutral-700">Laden...</p>
                  ) : events.length === 0 ? (
                    <p className="text-neutral-700">Geen events gevonden.</p>
                  ) : (
                    <EventList events={events} />
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FinalCtaSection />
    </>
  );
}