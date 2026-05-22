// @ts-nocheck
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetchAuth, apiGetAuth } from "@/lib/api";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  async function refresh() {
    if (auth.status === "checking") {
      setLoading(true);
      return;
    }

    if (!auth.user) {
      setMe(null);
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    setMe(auth.user);

    const favs = await apiGetAuth("/api/favorites/");
    const ids = Array.isArray(favs) ? favs.map((f) => f.event_id) : [];
    setFavoriteIds(new Set(ids));

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [auth.status, auth.user]);

  const value = useMemo(() => {
    return {
      loading,
      me,

      isFavorite: (eventId) => favoriteIds.has(eventId),

      add: async (eventId) => {
        if (loading) return { ok: false, reason: "loading" };
        if (!me) return { ok: false, reason: "not_logged_in" };

        const r = await apiFetchAuth("/api/favorites/add/", {
          method: "POST",
          body: JSON.stringify({ event_id: eventId }),
        });

        if (!r.ok) {
          return {
            ok: false,
            reason: r.auth === false ? "not_logged_in" : "failed",
            status: r.status,
            data: r.data,
          };
        }

        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(eventId);
          return next;
        });

        return { ok: true };
      },

      remove: async (eventId) => {
        if (loading) return { ok: false, reason: "loading" };
        if (!me) return { ok: false, reason: "not_logged_in" };

        const r = await apiFetchAuth(`/api/favorites/${eventId}/`, {
          method: "DELETE",
        });

        if (!r.ok) {
          return {
            ok: false,
            reason: r.auth === false ? "not_logged_in" : "failed",
            status: r.status,
            data: r.data,
          };
        }

        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });

        return { ok: true };
      },

      refresh,
    };
  }, [loading, me, favoriteIds]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
}
