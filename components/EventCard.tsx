// frontend/components/EventCard.tsx

import FavoriteButton from "@/components/FavouriteButton";
import ResultCard from "@/components/ui/ResultCard";

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
  rating?: number | null;
  rating_value?: number | null;
  reviewCount?: number | null;
  review_count?: number | null;
  reviewsHref?: string | null;
  reviews_href?: string | null;
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

  return <li>
    <ResultCard
      href={showDetailLink ? `/events/${event.id}` : event.source_url}
      title={event.title}
      category="Evenement"
      location={`${venueLabel} · ${startLabel}`}
      price={priceLabel}
      rating={event.rating ?? event.rating_value}
      reviewCount={event.reviewCount ?? event.review_count}
      reviewsHref={event.reviewsHref ?? event.reviews_href}
      favoriteAction={showFavoriteButton ? <FavoriteButton eventId={event.id} variant="compact" /> : null}
    />
  </li>;
}
