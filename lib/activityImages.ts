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

/**
 * Category-specific, crop-safe photography. Keep all fallback choices here so
 * cards, search results, inspiration and detail pages always agree.
 */
export const ACTIVITY_FALLBACK_IMAGE_SETS = {
  generic: ["/images/fallback-walking.webp", "/images/fallback-walking-02.webp"],
  liveMusic: ["/images/fallback-live-music.webp", "/images/fallback-live-music-02.webp"],
  festival: ["/images/fallback-live-music-02.webp", "/images/fallback-live-music.webp"],
  walking: ["/images/fallback-walking.webp", "/images/fallback-walking-02.webp"],
  restaurant: ["/images/fallback-restaurant.webp", "/images/fallback-restaurant-02.webp"],
  museum: ["/images/fallback-museum.webp", "/images/fallback-museum-02.webp"],
  market: ["/images/fallback-market.webp", "/images/fallback-market-02.webp"],
  cinema: ["/images/fallback-cinema.webp", "/images/fallback-cinema-02.webp"],
  themePark: ["/images/fallback-theme-park.webp", "/images/fallback-theme-park-02.webp"],
  theater: ["/images/fallback-theater-01.webp", "/images/fallback-theater-02.webp"],
  sport: ["/images/fallback-sport-01.webp", "/images/fallback-walking-02.webp"],
} as const;

type FallbackCategory = keyof typeof ACTIVITY_FALLBACK_IMAGE_SETS;

type ActivityImageInput = {
  image?: string | null;
  id?: string | number | null;
  slug?: string | null;
  category?: string | null;
  kind?: string | null;
  title?: string | null;
  tags?: string[] | null;
};

const LEGACY_PLACEHOLDERS = new Set(["/images/apeldoorn_img.jpg", "/images/julianatoren.jpg"]);
const EMPTY_IMAGE_VALUES = new Set(["null", "undefined", "none", "n/a", "na", "url()"]);

function normalise(value: string | null | undefined) {
  return (value ?? "").toLocaleLowerCase("nl-NL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function fallbackCategoryForText(text: string): FallbackCategory {
  if (/(festival)/.test(text)) return "festival";
  if (/(pretpark|attractie|julianatoren|familie|gezin|kind|speel)/.test(text)) return "themePark";
  if (/(theater|theatre|toneel|cabaret|dansvoorstelling)/.test(text)) return "theater";
  if (/(muziek|concert|jazz|podium|optreden|live[- ]?set)/.test(text)) return "liveMusic";
  if (/(film|bioscoop|cinema)/.test(text)) return "cinema";
  if (/(museum|cultuur|kunst|expositie|galerie|histor)/.test(text)) return "museum";
  if (/(markt|market|makers)/.test(text)) return "market";
  if (/(eten|drinken|restaurant|bistro|brasserie|cafe|café|lunch|diner|food|culinair|koffie|coffee|tearoom|bar)/.test(text)) return "restaurant";
  if (/(sport|sportief|hardlopen|rennen|fitness|schaatsen|klimmen)/.test(text)) return "sport";
  if (/(wandeling|wandel|natuur|park|bos|heide|route|buiten|fiets)/.test(text)) return "walking";
  return "generic";
}

/** FNV-1a: deterministic in browsers and during server rendering. */
function stableHash(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 0x01000193);
  }

  return hash >>> 0;
}

function fallbackForCategory(category: FallbackCategory, seed: string) {
  const images = ACTIVITY_FALLBACK_IMAGE_SETS[category];
  return images[stableHash(seed) % images.length];
}

/**
 * API data may contain textual null values, especially on older records.
 * They are not real images and must follow the same fallback path as an
 * omitted image rather than reaching a card as a broken source.
 */
function usableImage(image: string | null | undefined) {
  const candidate = image?.trim();
  if (
    !candidate ||
    EMPTY_IMAGE_VALUES.has(candidate.toLocaleLowerCase("nl-NL")) ||
    /^url\(\s*(['"]?)\s*\1\s*\)$/i.test(candidate)
  ) return null;
  return LEGACY_PLACEHOLDERS.has(candidate) ? null : candidate;
}

/** A supplied image wins, except the retired low-quality placeholder files. */
export function resolveActivityImage({ image, id, slug, category, kind, title, tags }: ActivityImageInput) {
  const candidate = usableImage(image);
  if (candidate) return candidate;

  const primaryContent = normalise([category, kind].filter(Boolean).join(" "));
  const content = normalise([category, kind, title, ...(tags ?? [])].filter(Boolean).join(" "));
  const stableSeed = normalise([id, slug, title, category, kind, ...(tags ?? [])].filter(Boolean).join(" ")) || content;
  const primaryCategory = fallbackCategoryForText(primaryContent);

  // Category and kind describe the activity itself; title and tags often add
  // incidental context (for example, coffee during a city walk).
  return fallbackForCategory(
    primaryCategory === "generic" ? fallbackCategoryForText(content) : primaryCategory,
    stableSeed
  );
}

export function toCssImageUrl(image: string) {
  return image.startsWith("url(") ? image : `url('${image}')`;
}
