"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/components/AuthProvider";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  type FavoriteItem,
} from "@/lib/favorites";

type FavoriteActionResult = {
  ok: boolean;
  reason?: "loading" | "not_logged_in" | "failed";
  status?: number;
  data?: unknown;
};

type FavoritesContextValue = {
  loading: boolean;
  favorites: FavoriteItem[];
  isFavorite: (eventId: number) => boolean;
  add: (eventId: number) => Promise<FavoriteActionResult>;
  remove: (eventId: number) => Promise<FavoriteActionResult>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  async function refresh() {
    if (auth.status === "checking") {
      setLoading(true);
      return;
    }

    if (!auth.user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const nextFavorites = await getFavorites();
    setFavorites(nextFavorites ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [auth.status, auth.user]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.event_id)),
    [favorites]
  );

  const value = useMemo<FavoritesContextValue>(() => {
    return {
      loading,
      favorites,
      isFavorite: (eventId: number) => favoriteIds.has(eventId),
      add: async (eventId: number) => {
        if (loading) return { ok: false, reason: "loading" };
        if (!auth.user) return { ok: false, reason: "not_logged_in" };

        const response = await addFavorite(eventId);

        if (!response.ok) {
          return {
            ok: false,
            reason: response.auth === false ? "not_logged_in" : "failed",
            status: response.status,
            data: response.data,
          };
        }

        await refresh();
        return { ok: true };
      },
      remove: async (eventId: number) => {
        if (loading) return { ok: false, reason: "loading" };
        if (!auth.user) return { ok: false, reason: "not_logged_in" };

        const response = await removeFavorite(eventId);

        if (!response.ok) {
          return {
            ok: false,
            reason: response.auth === false ? "not_logged_in" : "failed",
            status: response.status,
            data: response.data,
          };
        }

        setFavorites((current) =>
          current.filter((favorite) => favorite.event_id !== eventId)
        );
        return { ok: true };
      },
      refresh,
    };
  }, [auth.user, favoriteIds, favorites, loading]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return context;
}
