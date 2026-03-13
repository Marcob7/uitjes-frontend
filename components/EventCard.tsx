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
  const priceLabel = event.is_free ? "Gratis" : `EUR ${event.price_min ?? "?"}`;

  return (
    <li className="grid gap-2 rounded-xl border border-[#e5d1b3] bg-[#fffaf3] p-4 text-[#3f2d1d] shadow-[0_10px_30px_rgba(118,78,41,0.08)]">
      <div className="text-base font-semibold leading-snug text-[#2f2218]">{event.title}</div>

      <div className="text-sm text-[#6d5844]">
        {venueLabel} <span className="text-[#b4906a]">&middot;</span> {startLabel}
      </div>

      <div className="text-sm font-medium text-[#6b4a2d]">{priceLabel}</div>

      {showDetailLink || showFavoriteButton ? (
        <div className="mt-2 flex items-center gap-3">
          {showDetailLink ? (
            <a
              href={`/events?id=${event.id}`}
              className="text-sm font-semibold underline underline-offset-4 text-[#7c522d] transition hover:text-[#a56432]"
            >
              Bekijk detail
            </a>
          ) : null}

          {showFavoriteButton ? <FavoriteButton eventId={event.id} /> : null}
        </div>
      ) : null}
    </li>
  );
}
