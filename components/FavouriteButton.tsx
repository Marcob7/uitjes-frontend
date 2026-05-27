"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavouritesProvider";

type FavouriteButtonProps = {
  eventId: number;
  variant?: "default" | "compact";
  className?: string;
  savedClassName?: string;
};

const defaultClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#b9aa98]/70 bg-[#f7f1e8] px-4 text-sm font-semibold text-[#211a14] transition hover:bg-[#efe4d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3e635]/70 disabled:cursor-not-allowed disabled:opacity-70";

const defaultSavedClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#c8dc9a] bg-[#e8f2d0] px-4 text-sm font-semibold text-[#162016] transition hover:bg-[#f1f7df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3e635]/70 disabled:cursor-not-allowed disabled:opacity-70";

const compactClassName =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/18 bg-[#f7f1e8]/94 px-3 text-xs font-semibold text-[#211a14] shadow-[0_10px_26px_rgba(0,0,0,0.16)] backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8f2d0]/80 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-10 sm:px-3.5";

const compactSavedClassName =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#c8dc9a]/90 bg-[#e8f2d0] px-3 text-xs font-semibold text-[#162016] shadow-[0_10px_26px_rgba(0,0,0,0.16)] backdrop-blur-md transition hover:bg-[#f1f7df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8f2d0]/80 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-10 sm:px-3.5";

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 ${filled ? "fill-current" : "fill-none"}`}
    >
      <path
        d="M12 20.2c-.3 0-.6-.1-.8-.3C5.6 15 3 12.3 3 8.9 3 6.1 5.1 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4 18.9 4 21 6.1 21 8.9c0 3.4-2.6 6.1-8.2 11-.2.2-.5.3-.8.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FavouriteButton({
  eventId,
  variant = "default",
  className,
  savedClassName,
}: FavouriteButtonProps) {
  const { isAuthenticated, status } = useAuth();
  const { loading, isFavorite, add, remove } = useFavorites();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const saved = isFavorite(eventId);
  const isCompact = variant === "compact";
  const buttonClassName =
    className ?? (isCompact ? compactClassName : defaultClassName);
  const savedButtonClassName =
    savedClassName ?? (isCompact ? compactSavedClassName : defaultSavedClassName);

  function stopCardNavigation(event: MouseEvent<HTMLElement>) {
    if (!isCompact) return;

    event.stopPropagation();
  }

  async function toggleFavorite(event: MouseEvent<HTMLButtonElement>) {
    stopCardNavigation(event);
    setMessage("");
    if (busy || loading) return;

    setBusy(true);
    try {
      const result = saved ? await remove(eventId) : await add(eventId);
      if (!result.ok) {
        setMessage(
          result.reason === "not_logged_in"
            ? "Je sessie is verlopen. Log opnieuw in om te bewaren."
            : "Bewaren lukt nu niet. Probeer het straks nog eens."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  if (status === "checking" || loading) {
    return (
      <button type="button" className={buttonClassName} disabled>
        {isCompact ? (
          <>
            <HeartIcon />
            <span>...</span>
          </>
        ) : (
          "Bezig..."
        )}
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className={buttonClassName} onClick={stopCardNavigation}>
        {isCompact ? (
          <>
            <HeartIcon />
            <span>Bewaar</span>
          </>
        ) : (
          "Log in om te bewaren"
        )}
      </Link>
    );
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={busy}
        aria-pressed={saved}
        aria-label={saved ? "Verwijder uit bewaarde uitjes" : "Bewaar dit uitje"}
        className={saved ? savedButtonClassName : buttonClassName}
      >
        {isCompact ? (
          <>
            <HeartIcon filled={saved} />
            <span>{busy ? "..." : saved ? "Bewaard" : "Bewaar"}</span>
          </>
        ) : busy ? (
          "Bezig..."
        ) : saved ? (
          "Bewaard"
        ) : (
          "Bewaar"
        )}
      </button>
      {message ? (
        <p role="status" aria-live="polite" className="rounded-2xl bg-[#fff7f0] px-3 py-2 text-xs leading-5 text-[#8a3f2d]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
