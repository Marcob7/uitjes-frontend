// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet, apiGetAuth } from "@/lib/api";
import { getSavedPlaces } from "@/lib/savedPlaces";

export default function SavedPage() {
  const [events, setEvents] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    setSavedPlaces(getSavedPlaces());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNeedsLogin(false);

      const me = await apiGetAuth("/api/auth/me/");
      if (cancelled) return;

      if (!me?.is_authenticated) {
        setEvents([]);
        setNeedsLogin(true);
        setLoading(false);
        return;
      }

      const favs = await apiGetAuth("/api/favorites/");
      if (cancelled) return;

      const ids = Array.isArray(favs) ? favs.map((f) => f.event_id) : [];

      if (ids.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            return await apiGet(`/api/events/${id}/`);
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      setEvents(results.filter(Boolean));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <AuthBlock />

        <div className="mb-8 mt-4 max-w-2xl">
          <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95] tracking-[-0.06em]">
            Bewaard
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#62594e] sm:text-base">
            Alles wat je hebt opgeslagen, netjes bij elkaar voor mobiel gebruik.
          </p>
        </div>

        {savedPlaces.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#171717]">Lokaal opgeslagen plekken</h2>
            <div className="mt-4 grid gap-3">
              {savedPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={place.href}
                  className="block rounded-[1.5rem] border border-[#e6e0d8] bg-[#fffdf9] p-4 text-inherit shadow-[0_10px_24px_rgba(57,43,27,0.04)]"
                >
                  <div className="font-semibold">{place.title}</div>
                  {place.meta ? (
                    <div className="mt-2 text-sm text-[#6d6458]">{place.meta}</div>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <h2 className="text-xl font-semibold text-[#171717]">Accountfavorieten</h2>

        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-[#6d6458]">Laden...</p>
          ) : needsLogin ? (
            <p className="text-sm leading-7 text-[#6d6458]">
              Log in om je favorieten te zien. Ga terug naar{" "}
              <a className="underline" href="/ontdek">
                Ontdek
              </a>.
            </p>
          ) : events.length === 0 ? (
            <p className="text-sm leading-7 text-[#6d6458]">
              Je hebt nog niks bewaard. Ga naar{" "}
              <a className="underline" href="/ontdek">
                Ontdek
              </a>.
            </p>
          ) : (
            <EventList events={events} />
          )}
        </div>
      </div>
    </main>
  );
}
