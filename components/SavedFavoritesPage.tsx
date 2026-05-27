"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavouritesProvider";
import type { FavoriteItem } from "@/lib/favorites";

function getFavoriteHref(favorite: FavoriteItem) {
  return favorite.slug ? `/ontdek/${favorite.slug}` : `/events/${favorite.event_id}`;
}

function cleanText(value?: string | null) {
  const cleaned = value?.trim();
  if (!cleaned || ["undefined", "null", "nan"].includes(cleaned.toLowerCase())) {
    return null;
  }
  return cleaned;
}

function FavoriteMeta({ favorite }: { favorite: FavoriteItem }) {
  const meta = [
    cleanText(favorite.city),
    cleanText(favorite.category) || cleanText(favorite.kind),
  ].filter(Boolean);

  if (meta.length === 0) return null;

  return <div className="mt-2 text-sm text-[#6d6458]">{meta.join(" | ")}</div>;
}

export default function SavedFavoritesPage() {
  const { isAuthenticated, status } = useAuth();
  const { favorites, loading, remove } = useFavorites();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleRemove(eventId: number) {
    if (removingId !== null) return;

    setRemovingId(eventId);
    setError("");

    try {
      const result = await remove(eventId);
      if (!result.ok) {
        setError(
          result.reason === "not_logged_in"
            ? "Je sessie is verlopen. Log opnieuw in om je bewaarde uitjes te beheren."
            : "Verwijderen lukt nu niet. Probeer het straks nog eens."
        );
      }
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a6d60]">
            Jouw lijst
          </p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#171511]">
            Bewaarde uitjes
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#62594e] sm:text-base">
            Verzamel plekken die je later wilt bekijken. Je kunt altijd doorklikken naar de detailpagina of een item weer uit je lijst halen.
          </p>
        </div>

        {status !== "checking" && !isAuthenticated ? (
          <div className="rounded-[1.7rem] border border-[#e6e0d8] bg-[#fffdf9] p-5 text-[#3f3429] shadow-[0_18px_42px_rgba(66,49,31,0.08)] sm:p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Log in om uitjes te bewaren</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6458]">
              Na het inloggen kun je favorieten opslaan en ze hier rustig terugvinden.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
            >
              Inloggen
            </Link>
          </div>
        ) : loading ? (
          <div className="rounded-[1.7rem] border border-[#e6e0d8] bg-[#fffdf9] p-5 text-sm text-[#6d6458]">
            Bewaarde uitjes laden...
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-[1.7rem] border border-[#e6e0d8] bg-[#fffdf9] p-5 text-[#3f3429] shadow-[0_18px_42px_rgba(66,49,31,0.08)] sm:p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Nog niets bewaard</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6458]">
              Open een detailpagina en kies Bewaar. Dan staat je eerste uitje meteen in deze lijst.
            </p>
            <Link
              href="/ontdek"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
            >
              Ontdek uitjes
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {error ? (
              <p role="alert" className="rounded-[1.2rem] border border-[#f0d1c5] bg-[#fff7f0] px-4 py-3 text-sm leading-7 text-[#8a3f2d]">
                {error}
              </p>
            ) : null}

            <div className="grid gap-4">
              {favorites.map((favorite) => (
                <article
                  key={favorite.id}
                  className="grid gap-4 rounded-[1.5rem] border border-[#e6e0d8] bg-[#fffdf9] p-4 text-[#3f3429] shadow-[0_10px_24px_rgba(57,43,27,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(57,43,27,0.08)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
                >
                  <Link
                    href={getFavoriteHref(favorite)}
                    className="group min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                  >
                    <div className="text-lg font-semibold tracking-[-0.02em] text-[#2f2218] transition group-hover:text-[#5f3d22]">
                      {cleanText(favorite.title) || "Bewaard uitje"}
                    </div>
                    <FavoriteMeta favorite={favorite} />
                    {cleanText(favorite.summary) ? (
                      <p className="mt-3 overflow-hidden text-sm leading-6 text-[#4d4339] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {cleanText(favorite.summary)}
                      </p>
                    ) : null}
                    <span className="mt-3 inline-flex text-sm font-semibold text-[#6b4a2d] underline underline-offset-4">
                      Bekijk detail
                    </span>
                  </Link>

                  <div className="flex sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemove(favorite.event_id)}
                      disabled={removingId === favorite.event_id}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#d9cec1] bg-[#fbf8f3] px-4 text-sm font-semibold text-[#5b4c3e] transition hover:bg-[#efe4d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {removingId === favorite.event_id ? "Bezig..." : "Verwijder"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
