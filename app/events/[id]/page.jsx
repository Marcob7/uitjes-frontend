// app/events/[id]/page.jsx
export const runtime = "edge";

import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
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
      <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
              { label: "Niet gevonden" },
            ]}
            className="mb-6"
          />

          <div className="rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)]">
            <p>Geen event gevonden.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
          className="mb-6"
        />

        <div className="rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
            {event.title}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#62594e]">
            {event.city}
            {event.venue ? ` - ${event.venue}` : ""}
          </p>

          <div className="mt-6 space-y-3 text-sm leading-7 text-[#171717]">
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
              {event.is_free ? "Gratis" : event.price_min ? `Vanaf EUR ${event.price_min}` : "Onbekend"}
            </p>
          </div>

          {event.source_url ? (
            <p className="mt-5">
              <a
                className="underline underline-offset-4"
                href={event.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Bekijk bron(nen)
              </a>
            </p>
          ) : null}

          <p className="mt-3">
            <Link className="underline underline-offset-4" href="/events">
              Terug naar events
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
