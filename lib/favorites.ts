import { apiFetchAuth, apiGetAuth } from "@/lib/api";

export type FavoriteItem = {
  id: number;
  event_id: number;
  title: string | null;
  slug: string | null;
  city: string | null;
  kind: string | null;
  category: string | null;
  summary: string | null;
  image_url: string | null;
  is_publicly_available?: boolean;
  availability_reason?: string | null;
  created_at: string;
};

export async function getFavorites(): Promise<FavoriteItem[] | null> {
  const data = await apiGetAuth("/api/favorites/");
  return Array.isArray(data) ? data : null;
}

export async function addFavorite(eventId: number) {
  return apiFetchAuth("/api/favorites/", {
    method: "POST",
    body: JSON.stringify({ event_id: eventId }),
  });
}

export async function removeFavorite(eventId: number) {
  return apiFetchAuth(`/api/favorites/${eventId}/`, {
    method: "DELETE",
  });
}

export async function isFavorite(eventId: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites?.some((favorite) => favorite.event_id === eventId) ?? false;
}
