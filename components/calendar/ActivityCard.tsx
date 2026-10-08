import type { TimelineCard, TimelineSlot } from "@/app/jaarkalender/data";
import { getJaarkalenderEventHrefForCard } from "@/app/jaarkalender/data";
import ResultCard from "@/components/ui/ResultCard";
import { resolveActivityImage } from "@/lib/activityImages";

type ActivityCardProps = {
  daySlug: string;
  slot: TimelineSlot;
  card: TimelineCard;
};

export default function ActivityCard({ daySlug, slot, card }: ActivityCardProps) {
  const href = getJaarkalenderEventHrefForCard(daySlug, slot, card);
  const image = resolveActivityImage({
    image: card.image,
    category: card.category,
    title: card.title,
    tags: [card.description],
  });

  return (
    <ResultCard
      href={href}
      title={card.title}
      image={image}
      imageAlt={card.title}
      category={card.category}
      location={card.location}
      price={card.price}
      date={card.date}
      rating={card.rating}
      reviewCount={card.reviewCount}
      className="h-full"
    />
  );
}
