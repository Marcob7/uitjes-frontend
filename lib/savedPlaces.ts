export const SAVED_PLACES_STORAGE_KEY = "savedPlaceCards";

export type SavedPlace = {
  id: string;
  title: string;
  href: string;
  meta?: string;
  image?: string;
  savedAt?: string;
};

export function getSavedPlaces(): SavedPlace[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(SAVED_PLACES_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.href === "string"
      );
    });
  } catch {
    return [];
  }
}

export function isPlaceSaved(id: string) {
  return getSavedPlaces().some((place) => place.id === id);
}

export function toggleSavedPlace(place: SavedPlace) {
  const current = getSavedPlaces();
  const exists = current.some((item) => item.id === place.id);

  const next = exists
    ? current.filter((item) => item.id !== place.id)
    : [{ ...place, savedAt: new Date().toISOString() }, ...current];

  if (typeof window !== "undefined") {
    localStorage.setItem(SAVED_PLACES_STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}
