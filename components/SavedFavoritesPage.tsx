"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavouritesProvider";
import { AppFilterChip } from "@/components/ui/app/AppFilterChip";
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

function isFavoriteAvailable(favorite: FavoriteItem) {
  return favorite.is_publicly_available !== false;
}

type StatusFilter = "all" | "available" | "unavailable";

function getFavoriteType(favorite: FavoriteItem) {
  return cleanText(favorite.category) || cleanText(favorite.kind);
}

function matchesSearch(favorite: FavoriteItem, query: string) {
  if (!query) return true;

  return [
    favorite.title,
    favorite.city,
    favorite.category,
    favorite.kind,
    favorite.summary,
  ]
    .map((value) => cleanText(value)?.toLowerCase() ?? "")
    .some((value) => value.includes(query));
}

export default function SavedFavoritesPage() {
  const { isAuthenticated, status } = useAuth();
  const { favorites, loading, remove } = useFavorites();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const availableCount = favorites.filter(isFavoriteAvailable).length;
  const unavailableCount = favorites.length - availableCount;

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();

    favorites.forEach((favorite) => {
      const type = getFavoriteType(favorite);
      if (!type) return;
      counts.set(type, (counts.get(type) ?? 0) + 1);
    });

    return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) =>
      a.label.localeCompare(b.label, "nl")
    );
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((favorite) => {
      const available = isFavoriteAvailable(favorite);
      const type = getFavoriteType(favorite);

      if (statusFilter === "available" && !available) return false;
      if (statusFilter === "unavailable" && available) return false;
      if (typeFilter !== "all" && type !== typeFilter) return false;

      return matchesSearch(favorite, normalizedSearchQuery);
    });
  }, [favorites, normalizedSearchQuery, statusFilter, typeFilter]);

  const hasActiveFilters =
    statusFilter !== "all" || typeFilter !== "all" || normalizedSearchQuery.length > 0;

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
          <div className="rounded-[1.7rem] border border-white/70 bg-white/65 p-5 text-[#3f3429] shadow-[0_18px_42px_rgba(66,49,31,0.08)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a6d60]">
              Uitgelogd
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Log in om uitjes te bewaren</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6458]">
              Je lijst is gekoppeld aan je account, zodat je bewaarde uitjes later weer rustig terugvindt.
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
          <div className="rounded-[1.7rem] border border-white/70 bg-white/65 p-5 text-[#3f3429] shadow-[0_18px_42px_rgba(66,49,31,0.08)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a6d60]">
              Lege lijst
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Nog niets bewaard</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6458]">
              Open een detailpagina en kies Bewaar. Je eerste plan verschijnt hier, klaar voor later.
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

            <section
              aria-label="Filter bewaarde uitjes"
              className="rounded-[1.5rem] border border-white/70 bg-white/60 p-3 shadow-[0_14px_34px_rgba(52,38,25,0.06)] backdrop-blur-xl sm:p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  <AppFilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                    Alles {favorites.length}
                  </AppFilterChip>
                  <AppFilterChip active={statusFilter === "available"} onClick={() => setStatusFilter("available")}>
                    Beschikbaar {availableCount}
                  </AppFilterChip>
                  <AppFilterChip
                    active={statusFilter === "unavailable"}
                    onClick={() => setStatusFilter("unavailable")}
                    disabled={unavailableCount === 0}
                  >
                    Niet meer beschikbaar {unavailableCount}
                  </AppFilterChip>
                </div>

                <form role="search" className="relative w-full lg:max-w-xs">
                  <label htmlFor="saved-favorites-search" className="sr-only">
                    Zoek binnen bewaarde uitjes
                  </label>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6d60]" aria-hidden="true">
                    &#8981;
                  </span>
                  <input
                    id="saved-favorites-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Zoek in bewaard"
                    className="min-h-11 w-full rounded-full border border-[#ddd5c8] bg-[#fffdf9]/85 pl-11 pr-4 text-sm font-medium text-[#2f2218] outline-none transition placeholder:text-[#978c80] focus:border-[#b8df71] focus:ring-2 focus:ring-[#b8df71]/35"
                  />
                </form>
              </div>

              {typeOptions.length > 1 ? (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-[#e9e0d6]/80 pt-3">
                  <AppFilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")} variant="subtle">
                    Alle types
                  </AppFilterChip>
                  {typeOptions.map((option) => (
                    <AppFilterChip
                      key={option.label}
                      active={typeFilter === option.label}
                      onClick={() => setTypeFilter(option.label)}
                      variant="subtle"
                    >
                      {option.label} {option.count}
                    </AppFilterChip>
                  ))}
                </div>
              ) : null}
            </section>

            <div className="flex flex-col gap-1 text-sm text-[#6d6458] sm:flex-row sm:items-center sm:justify-between">
              <p>
                {filteredFavorites.length === 1
                  ? "1 bewaard uitje"
                  : `${filteredFavorites.length} bewaarde uitjes`}
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSearchQuery("");
                  }}
                  className="self-start text-sm font-semibold text-[#5f3d22] underline underline-offset-4 transition hover:text-[#2f2218] sm:self-auto"
                >
                  Wis filters
                </button>
              ) : null}
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="rounded-[1.7rem] border border-white/70 bg-white/65 p-5 text-[#3f3429] shadow-[0_18px_42px_rgba(66,49,31,0.08)] backdrop-blur-xl sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a6d60]">
                  Geen match
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Geen bewaarde uitjes gevonden</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6458]">
                  Pas je filter of zoekterm aan om weer meer van je lijst te zien.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
                >
                  Toon alles
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFavorites.map((favorite) => {
                  const available = isFavoriteAvailable(favorite);

                  return (
                    <article
                      key={favorite.id}
                      className={`grid gap-4 rounded-[1.5rem] border p-4 text-[#3f3429] shadow-[0_10px_24px_rgba(57,43,27,0.04)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5 ${
                        available
                          ? "border-[#e6e0d8] bg-[#fffdf9] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(57,43,27,0.08)]"
                          : "border-[#e3dbd0] bg-[#f3eee7] opacity-90"
                      }`}
                    >
                      {available ? (
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
                      ) : (
                        <div className="min-w-0 rounded-xl">
                          <div className="text-lg font-semibold tracking-[-0.02em] text-[#5b5147]">
                            {cleanText(favorite.title) || "Bewaard uitje"}
                          </div>
                          <FavoriteMeta favorite={favorite} />
                          <div className="mt-3 inline-flex rounded-full border border-[#d6c9b8] bg-[#fffaf3] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7a6d60]">
                            Niet meer beschikbaar
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#6d6458]">
                            Dit uitje is verwijderd of niet meer beschikbaar.
                          </p>
                        </div>
                      )}

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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
