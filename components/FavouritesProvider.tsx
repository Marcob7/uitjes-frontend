// @ts-nocheck
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiGetAuth, apiFetchAuth } from "@/lib/api";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Voorkomt dubbele refresh in dev (React StrictMode kan useEffect 2x triggeren)
  const didInit = useRef(false);

  async function refresh() {
    setLoading(true);

    // Haal huidige user op via backend session (Google login)
    // Verwacht: { is_authenticated: boolean, user: {...} | null }
    const meRes = await apiGetAuth("/api/me/");

    // Niet ingelogd → reset favorieten
    if (!meRes || meRes.is_authenticated === false || !meRes.user) {
      setMe(null);
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    setMe(meRes.user);

    // Favorieten ophalen
    const favs = await apiGetAuth("/api/favorites/");
    const ids = Array.isArray(favs) ? favs.map((f) => f.event_id) : [];
    setFavoriteIds(new Set(ids));

    setLoading(false);
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    refresh();
  }, []);

  const value = useMemo(() => {
    return {
      loading,
      me,

      // Check of een event in favorieten zit
      isFavorite: (eventId) => favoriteIds.has(eventId),

      // Voeg toe
      add: async (eventId) => {
        // Tijdens initial load is me nog null, maar user kan wel ingelogd zijn
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

        // Optimistic update in state
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(eventId);
          return next;
        });

        return { ok: true };
      },

      // Verwijder
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

        // Optimistic update in state
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });

        return { ok: true };
      },

      // Handig om na login/logout opnieuw te syncen
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