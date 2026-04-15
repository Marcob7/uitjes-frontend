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

      // 1) Check of je ingelogd bent
      const me = await apiGetAuth("/api/auth/user/");
      if (cancelled) return;

      if (!me) {
        setEvents([]);
        setNeedsLogin(true);
        setLoading(false);
        return;
      }

      // 2) Haal favorieten op (lijst met event_id’s)
      const favs = await apiGetAuth("/api/favorites/");
      if (cancelled) return;

      const ids = Array.isArray(favs) ? favs.map((f) => f.event_id) : [];

      if (ids.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // 3) Haal per id de event details op (MVP)
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
    <main style={{ padding: 24 }}>
      <AuthBlock />

      <h1>Bewaard</h1>

      {savedPlaces.length > 0 ? (
        <section style={{ marginTop: 24, marginBottom: 32 }}>
          <h2>Lokaal opgeslagen plekken</h2>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {savedPlaces.map((place) => (
              <Link
                key={place.id}
                href={place.href}
                style={{
                  display: "block",
                  padding: 16,
                  borderRadius: 16,
                  border: "1px solid #e6e0d8",
                  background: "#fffdf9",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ fontWeight: 700 }}>{place.title}</div>
                {place.meta ? (
                  <div style={{ marginTop: 6, fontSize: 14, opacity: 0.75 }}>
                    {place.meta}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <h2>Accountfavorieten</h2>

      {loading ? (
        <p>Laden…</p>
      ) : needsLogin ? (
        <p>
          Log in om je favorieten te zien. Ga terug naar <a href="/ontdek">Ontdek</a>.
        </p>
      ) : events.length === 0 ? (
        <p>
          Je hebt nog niks bewaard. Ga naar <a href="/ontdek">Ontdek</a>.
        </p>
      ) : (
        <EventList events={events} />
      )}
    </main>
  );
}
