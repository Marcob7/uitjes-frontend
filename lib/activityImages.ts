/** Stable, crop-safe fallback imagery for activities without a usable image. */
export const ACTIVITY_FALLBACK_IMAGES = {
  generic: "/images/fallback-walking.webp",
  liveMusic: "/images/fallback-live-music.webp",
  walking: "/images/fallback-walking.webp",
  restaurant: "/images/fallback-restaurant.webp",
  museum: "/images/fallback-museum.webp",
  market: "/images/fallback-market.webp",
  cinema: "/images/fallback-cinema.webp",
  themePark: "/images/fallback-theme-park.webp",
} as const;

type ActivityImageInput = {
  image?: string | null;
  category?: string | null;
  kind?: string | null;
  title?: string | null;
  tags?: string[] | null;
};

const LEGACY_PLACEHOLDERS = new Set(["/images/apeldoorn_img.jpg", "/images/julianatoren.jpg"]);

function normalise(value: string | null | undefined) {
  return (value ?? "").toLocaleLowerCase("nl-NL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function fallbackForText(text: string) {
  if (/(pretpark|attractie|julianatoren|familie|gezin|kind|speel)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.themePark;
  if (/(muziek|concert|jazz|podium|optreden|live[- ]?set)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.liveMusic;
  if (/(film|bioscoop|cinema)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.cinema;
  if (/(museum|cultuur|kunst|expositie|galerie|histor)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.museum;
  if (/(markt|market|makers)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.market;
  if (/(eten|drinken|restaurant|bistro|cafe|café|lunch|diner|food|culinair|koffie|bar)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.restaurant;
  if (/(wandeling|wandel|natuur|park|bos|heide|route|buiten|fiets)/.test(text)) return ACTIVITY_FALLBACK_IMAGES.walking;
  return ACTIVITY_FALLBACK_IMAGES.generic;
}

/** A supplied image wins, except the retired low-quality placeholder files. */
export function resolveActivityImage({ image, category, kind, title, tags }: ActivityImageInput) {
  const candidate = image?.trim();
  if (candidate && !LEGACY_PLACEHOLDERS.has(candidate)) return candidate;
  return fallbackForText(normalise([category, kind, title, ...(tags ?? [])].filter(Boolean).join(" ")));
}

export function toCssImageUrl(image: string) {
  return image.startsWith("url(") ? image : `url('${image}')`;
}
