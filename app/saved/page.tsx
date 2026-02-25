// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet, apiGetAuth } from "@/lib/api";

export default function SavedPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

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