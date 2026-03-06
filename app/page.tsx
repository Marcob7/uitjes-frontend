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

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/api/events/?city=${city}`)
      .then((data) => setEvents(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <>
      <HeroSection />
      <InspirationCardsSection />
      <TrustedSection />
      <ShowcaseSection />
      <FeatureCardsSection />
      <TestimonialSection />

      {/* Home content / preview */}
      <main className="bg-[#f5f3ef] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <AuthBlock />

            <div className="mt-6">
              <Suspense fallback={<p>Laden…</p>}>
                <EventsClient />
              </Suspense>
            </div>

            <div className="mt-10">
              <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                Events Planner
              </h1>

              <p className="mt-2 text-neutral-700">
                Vind snel iets leuks om te doen. Begin bij{" "}
                <Link
                  href="/ontdek"
                  className="font-medium text-neutral-900 underline underline-offset-4"
                >
                  Ontdek
                </Link>
                .
              </p>

              <div className="mt-4">
                <Link
                  href={`/ontdek?city=${city}`}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  Ontdek {city}
                </Link>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                Preview: events in {city}
              </h2>

              {loading ? (
                <p className="text-neutral-700">Laden…</p>
              ) : events.length === 0 ? (
                <p className="text-neutral-700">Geen events gevonden.</p>
              ) : (
                <EventList events={events} />
              )}
            </section>
          </div>
        </div>
      </main>

      <FinalCtaSection />
    </>
  );
}