// app/events/[id]/page.jsx
export const runtime = "edge";
import { apiGet } from "@/lib/api";

export default async function EventDetailPage({ params }) {
  const { id } = params;

  let event = null;
  try {
    event = await apiGet(`/api/events/${id}/`);
  } catch (e) {
    console.error(e);
  }

  if (!event) {
    return (
      <main style={{ padding: 24 }}>
        <p>Geen event gevonden.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 820 }}>
      <h1 className="text-2xl font-semibold">{event.title}</h1>

      <p className="opacity-70" style={{ marginTop: 8 }}>
        {event.city}
        {event.venue ? ` • ${event.venue}` : ""}
      </p>

      <div style={{ marginTop: 16 }}>
        <p>
          <b>Start:</b>{" "}
          {event.start_at ? new Date(event.start_at).toLocaleString() : "Doorlopend"}
        </p>
        {event.end_at ? (
          <p>
            <b>Einde:</b> {new Date(event.end_at).toLocaleString()}
          </p>
        ) : null}
        <p>
          <b>Prijs:</b>{" "}
          {event.is_free ? "Gratis" : event.price_min ? `Vanaf €${event.price_min}` : "Onbekend"}
        </p>

      {event.source_url ? (
  <p style={{ marginTop: 12 }}>
    <a className="underline" href={event.source_url} target="_blank" rel="noreferrer">
      Bekijk bron(nen)
    </a>
  </p>
) : null}

<p style={{ marginTop: 12 }}>
  <a className="underline" href="/events">
    Terug naar events
  </a>
</p>
      </div>
    </main>
  );
}