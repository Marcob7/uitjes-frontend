import type { TimelineCard, TimelineSlot } from "@/app/jaarkalender/data";

import ActivityCard from "./ActivityCard";

type ActivityItem = {
  slot: TimelineSlot;
  card: TimelineCard;
};

type ActivitiesSectionProps = {
  daySlug: string;
  dayLabel: string;
  activities: ActivityItem[];
};

export default function ActivitiesSection({
  daySlug,
  dayLabel,
  activities,
}: ActivitiesSectionProps) {
  return (
    <section aria-labelledby="activities-title">
      <div className="border-t border-[#e4ddd3] pt-10 sm:pt-12">
        <p className="flex items-center gap-2 text-[0.7rem] font-semibold text-[#6c844d]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
          Dit is er vandaag te doen
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="activities-title"
            style={{ fontFamily: "var(--font-body)" }}
            className="max-w-none text-[clamp(2.15rem,4vw,3.35rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-[#171511]"
          >
            Alle activiteiten.
          </h2>
          <p className="pb-1 text-[15px] leading-6 text-[#71675c]">
            {activities.length} activiteiten op {dayLabel}
          </p>
        </div>
      </div>

      {activities.length ? (
        <div className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
          {activities.map(({ slot, card }) => (
            <ActivityCard
              key={`${slot.time}-${card.title}`}
              daySlug={daySlug}
              slot={slot}
              card={card}
            />
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-[1.35rem] border border-dashed border-[#dcd4c9] bg-[#fffdf9]/72 px-6 py-9 text-center text-sm leading-6 text-[#71675c]">
          Geen activiteiten gevonden voor deze dag. Pas je filters aan of bekijk een andere dag.
        </div>
      )}
    </section>
  );
}
