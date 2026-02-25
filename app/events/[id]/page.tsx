// frontend/app/events/[id]/page.tsx

type EventItem = {
  id: number;
  title: string;
  city: string;
  venue: string | null;
  start_at: string;
  end_at: string | null;
  is_free: boolean;
  price_min: string | null;
  source_url: string;
};

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Omdat events nu openbaar zijn, hoeft hier GEEN credentials: "include"
  const res = await fetch(`${apiBase}/api/events/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Event niet gevonden</h1>
        <a href="/ontdek">Terug naar ontdekken</a>
      </main>
    );
  }

  const e: EventItem = await res.json();

  const startLabel = new Date(e.start_at).toLocaleString("nl-NL");
  const venueLabel = e.venue ?? "Onbekend";
  const priceLabel = e.is_free ? "Gratis" : `€${e.price_min ?? "?"}`;

  return (
    <main style={{ padding: 24 }}>
      <a href="/ontdek">← Terug</a>

      <h1 style={{ marginTop: 12 }}>{e.title}</h1>

      <p>
        <b>Wanneer:</b> {startLabel}
      </p>
      <p>
        <b>Waar:</b> {venueLabel} ({e.city})
      </p>
      <p>
        <b>Prijs:</b> {priceLabel}
      </p>

      {e.source_url ? (
        <p style={{ marginTop: 16 }}>
          <a href={e.source_url} target="_blank" rel="noreferrer">
            Bekijk tickets (organisator)
          </a>
        </p>
      ) : null}
    </main>
  );
}