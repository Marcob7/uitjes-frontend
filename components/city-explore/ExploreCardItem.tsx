"use client";

import FavouriteButton from "@/components/FavouriteButton";
import SavePlaceButton from "@/components/SavePlaceButton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ResultCard from "@/components/ui/ResultCard";

import type { ExploreCard } from "./types";

type ExploreCardItemProps = {
  card: ExploreCard;
  isSelected: boolean;
  onSelect: () => void;
  variant?: "default" | "flow";
};

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${filled ? "fill-current" : "fill-none"}`}>
      <path
        d="M12 20.2c-.3 0-.6-.1-.8-.3C5.6 15 3 12.3 3 8.9 3 6.1 5.1 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4 18.9 4 21 6.1 21 8.9c0 3.4-2.6 6.1-8.2 11-.2.2-.5.3-.8.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const saveButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#D5DED6] bg-white px-3 text-xs font-semibold text-[#31483A] transition hover:border-[#8FAA94] hover:bg-[#F7FAF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005FCC] disabled:cursor-not-allowed disabled:opacity-70";

const savedButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#B9D7B7] bg-[#EEF6EA] px-3 text-xs font-semibold text-[#285239] transition hover:bg-[#E5F0E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005FCC] disabled:cursor-not-allowed disabled:opacity-70";

/** The /ontdek adapter for the shared, scan-first result-card family. */
export default function ExploreCardItem({ card, isSelected, onSelect }: ExploreCardItemProps) {
  const { t } = useLocale();
  const eventId = typeof card.eventId === "number" && card.eventId > 0 ? card.eventId : null;
  const fallbackSaveItem = {
    id: `ontdek:${card.id}`,
    title: card.title,
    href: card.href,
    meta: [card.label, card.location].filter(Boolean).join(" · "),
    image: card.image ?? undefined,
  };
  const favoriteAction = eventId ? (
    <FavouriteButton
      eventId={eventId}
      variant="compact"
      className={saveButtonClassName}
      savedClassName={savedButtonClassName}
    />
  ) : (
    <SavePlaceButton
      item={fallbackSaveItem}
      className={saveButtonClassName}
      savedClassName={savedButtonClassName}
      savedChildren={<><HeartIcon filled /><span>{t("discover.saved")}</span></>}
    >
      <HeartIcon />
      <span>{t("discover.save")}</span>
    </SavePlaceButton>
  );

  return (
    <ResultCard
      href={card.href}
      title={card.title}
      image={card.image}
      imageAlt={card.imageAlt ?? card.title}
      category={card.label}
      location={card.location}
      date={card.time && card.time !== "Tijd volgt" ? card.time : null}
      price={card.price}
      rating={card.ratingValue}
      reviewCount={card.reviewCount}
      reviewsHref={card.reviewsHref}
      reviewsAriaLabel={t("discover.viewReviews", {
        reviews: t("discover.reviews", { count: card.reviewCount ?? 0 }),
        title: card.title,
      })}
      favoriteAction={favoriteAction}
      onSelect={onSelect}
      onMouseEnter={onSelect}
      isSelected={isSelected}
      variant="compact"
      viewLabel={t("discover.view")}
      viewAriaLabel={t("discover.viewItem", { title: card.title })}
    />
  );
}
