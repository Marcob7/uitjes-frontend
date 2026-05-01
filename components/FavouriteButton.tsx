// @ts-nocheck
"use client";

import { useState } from "react";
import { useFavorites } from "@/components/FavouritesProvider";

export default function FavouriteButton({ eventId }) {
  const { loading, me, isFavorite, add, remove } = useFavorites();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const saved = isFavorite(eventId);

  async function toggle() {
    setMsg("");

    if (!me) {
      setMsg("Log in om favorieten te bewaren.");
      return;
    }

    if (busy) return;
    setBusy(true);

    try {
      const r = saved ? await remove(eventId) : await add(eventId);
      if (!r.ok) {
        setMsg(r.reason === "not_logged_in" ? "Je bent niet (meer) ingelogd." : "Actie mislukt.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button type="button" onClick={toggle} disabled={busy} aria-pressed={saved}>
        {saved ? "Bewaard" : "Bewaar"}
      </button>
      {msg ? (
        <span role="status" aria-live="polite" style={{ fontSize: 12 }}>
          {msg}
        </span>
      ) : null}
    </div>
  );
}
