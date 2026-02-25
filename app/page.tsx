"use client";

import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet } from "@/lib/api";

export default function Home() {
  const city = "apeldoorn";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/api/events/?city=${city}`)
      .then((data) => setEvents(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <AuthBlock />

      <h1 className="text-2xl font-semibold">Events Planner</h1>

      <p style={{ marginTop: 8, marginBottom: 16 }}>
        Vind snel iets leuks om te doen. Begin bij <a href="/ontdek">Ontdek</a>.
      </p>

      <div style={{ marginBottom: 16 }}>
        <a href={`/ontdek?city=${city}`}>Ontdek {city}</a>
      </div>

      <h2 style={{ marginTop: 24, marginBottom: 12 }}>
        Preview: events in {city}
      </h2>

      {loading ? (
        <p>Laden…</p>
      ) : events.length === 0 ? (
        <p>Geen events gevonden.</p>
      ) : (
        <EventList events={events} />
      )}
    </main>
  );
}