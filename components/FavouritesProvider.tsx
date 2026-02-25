// @ts-nocheck
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGetAuth, apiFetchAuth } from "@/lib/api";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  async function refresh() {
    setLoading(true);

    const user = await apiGetAuth("/api/auth/user/");
    setMe(user);

    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    const favs = await apiGetAuth("/api/favorites/");
    const ids = Array.isArray(favs) ? favs.map((f) => f.event_id) : [];
    setFavoriteIds(new Set(ids));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(() => {
    return {
      loading,
      me,
      isFavorite: (eventId) => favoriteIds.has(eventId),

      // Voeg toe
      add: async (eventId) => {
        if (!me) return { ok: false, reason: "not_logged_in" };

        const r = await apiFetchAuth("/api/favorites/add/", {
          method: "POST",
          body: JSON.stringify({ event_id: eventId }),
        });

        if (!r.ok) return { ok: false, reason: r.auth === false ? "not_logged_in" : "failed" };

        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(eventId);
          return next;
        });

        return { ok: true };
      },

      // Verwijder
      remove: async (eventId) => {
        if (!me) return { ok: false, reason: "not_logged_in" };

        const r = await apiFetchAuth(`/api/favorites/${eventId}/`, {
          method: "DELETE",
        });

        if (!r.ok) return { ok: false, reason: r.auth === false ? "not_logged_in" : "failed" };

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