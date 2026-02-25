// frontend/lib/favorites.ts

// We slaan favorieten op in localStorage zodat de gebruiker geen account nodig heeft.
// Dit is perfect voor een MVP: snel, simpel en werkt na refresh.

const STORAGE_KEY = "savedEventIds";

export function getSavedIds(): number[] {
  if (typeof window === "undefined") return []; // Server-side heeft geen localStorage

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // We verwachten een array van nummers, anders fallback naar leeg.
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "number");
  } catch {
    return [];
  }
}

export function isSaved(id: number): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: number): number[] {
  const current = getSavedIds();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
