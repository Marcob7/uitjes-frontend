// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";

export default function EventDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setLoading(false);
        setErrorMsg("Geen event-id meegegeven.");
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        const data = await apiGet(`/api/events/${id}/`);
        if (!cancelled) setEvent(data);
      } catch (e) {
        if (!cancelled) {
          setEvent(null);
          setErrorMsg("Kon event niet laden.");
          console.error(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <main style={{ padding: 24 }}><p>Laden…</p></main>;
  if (errorMsg) return <main style={{ padding: 24 }}><p>{errorMsg}</p></main>;
  if (!event) return <main style={{ padding: 24 }}><p>Geen event gevonden.</p></main>;

  return (
    <main style={{ padding: 24, maxWidth: 820 }}>
      <h1 className="text-2xl font-semibold">{event.title}</h1>

      <p className="opacity-70" style={{ marginTop: 8 }}>
        {event.city}
        {event.venue ? ` • ${event.venue}` : ""}
      </p>

      <div style={{ marginTop: 16 }}>
        <p>
          <b>Start:</b> {event.start_at ? new Date(event.start_at).toLocaleString() : "Doorlopend"}
        </p>
        {event.end_at ? (
          <p>
            <b>Einde:</b> {new Date(event.end_at).toLocaleString()}
          </p>
        ) : null}
        <p>
          <b>Prijs:</b> {event.is_free ? "Gratis" : event.price_min ? `Vanaf €${event.price_min}` : "Onbekend"}
        </p>

        {event.source_url ? (
          <p style={{ marginTop: 12 }}>
            <a className="underline" href={event.source_url} target="_blank" rel="noreferrer">
              Bekijk bron
            </a>
          </p>
        ) : null}
      </div>
    </main>
  );
}