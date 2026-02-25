// frontend/components/EventCard.tsx

import FavoriteButton from "@/components/FavouriteButton";

// Dit type matcht met wat je Django API teruggeeft.
// Houd het centraal zodat je niet overal losse types hebt.
export type EventItem = {
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

// EventCard is een herbruikbare kaart voor:
// - Ontdek lijst
// - Bewaard lijst
// - (later) Home trending lijst
//
// Je kunt optioneel extra knoppen tonen via flags.
export default function EventCard({
  event,
  showDetailLink = true,
  showFavoriteButton = true,
}: {
  event: EventItem;
  showDetailLink?: boolean;
  showFavoriteButton?: boolean;
}) {
  const startLabel = new Date(event.start_at).toLocaleString("nl-NL");
  const venueLabel = event.venue ?? "Onbekende locatie";
  const priceLabel = event.is_free ? "Gratis" : `€${event.price_min ?? "?"}`; 

  return (
    <li
      className="
        grid gap-2 rounded-xl border p-4 shadow-sm
        border-neutral-200 bg-white text-neutral-900
        dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100
      "
    >
      {/* Titel */}
      <div className="text-base font-semibold leading-snug">
        {event.title}
      </div>

      {/* Meta info: locatie + tijd */}
      <div className="text-sm text-neutral-700 dark:text-neutral-300">
        {venueLabel}{" "}
        <span className="text-neutral-400 dark:text-neutral-600">•</span>{" "}
        {startLabel}
      </div>

      {/* Prijs */}
      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {priceLabel}
      </div>

      {/* Acties */}
      {showDetailLink || showFavoriteButton ? (
        <div className="mt-2 flex items-center gap-3">
          {/* Link naar detailpagina binnen je app */}
          {showDetailLink ? (
            <a
              href={`/events/${event.id}`}
              className="
                text-sm font-semibold underline underline-offset-4
                text-neutral-900 hover:text-neutral-700
                dark:text-neutral-100 dark:hover:text-neutral-300
              "
            >
              Bekijk detail
            </a>
          ) : null}

          {/* Favorieten knop (localStorage) */}
          {showFavoriteButton ? <FavoriteButton eventId={event.id} /> : null}
        </div>
      ) : null}
    </li>
  );
}