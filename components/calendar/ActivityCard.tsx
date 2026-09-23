import type { TimelineCard, TimelineSlot } from "@/app/jaarkalender/data";
import { getJaarkalenderEventHrefForCard } from "@/app/jaarkalender/data";
import ResultCard from "@/components/ui/ResultCard";

type ActivityCardProps = {
  daySlug: string;
  slot: TimelineSlot;
  card: TimelineCard;
};

export default function ActivityCard({ daySlug, slot, card }: ActivityCardProps) {
  const href = getJaarkalenderEventHrefForCard(daySlug, slot, card);

  return (
    <ResultCard
      href={href}
      title={card.title}
      image={card.image}
      imageAlt={card.title}
      category={card.category}
      location={card.location}
      className="h-full"
    />
  );
}
