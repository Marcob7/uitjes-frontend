"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

import { useSaveAuthentication } from "@/components/useSaveAuthentication";
import { useSaveFeedback } from "@/components/SaveFeedbackProvider";
import {
  isPlaceSaved,
  SAVED_PLACES_CHANGE_EVENT,
  toggleSavedPlace,
  type SavedPlace,
} from "@/lib/savedPlaces";

type SavePlaceButtonProps = {
  item: SavedPlace;
  className: string;
  savedClassName?: string;
  children: ReactNode;
  savedChildren?: ReactNode;
};

export default function SavePlaceButton({
  item,
  className,
  savedClassName,
  children,
  savedChildren,
}: SavePlaceButtonProps) {
  const {
    isAuthenticated,
    isChecking,
    redirectToLogin,
    stopCardNavigation,
  } = useSaveAuthentication();
  const { showSaveFeedback } = useSaveFeedback();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function syncSavedState() {
      setSaved(isAuthenticated ? isPlaceSaved(item.id) : false);
    }

    syncSavedState();
    window.addEventListener(SAVED_PLACES_CHANGE_EVENT, syncSavedState);

    return () => window.removeEventListener(SAVED_PLACES_CHANGE_EVENT, syncSavedState);
  }, [isAuthenticated, item.id]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!isAuthenticated) {
      redirectToLogin(event);
      return;
    }

    stopCardNavigation(event);
    const wasSaved = saved;
    const next = toggleSavedPlace(item);
    setSaved(next.some((place) => place.id === item.id));
    showSaveFeedback(wasSaved ? "removed" : "added");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isChecking}
      aria-pressed={isAuthenticated && saved}
      className={isAuthenticated && saved ? savedClassName ?? className : className}
    >
      {isAuthenticated && saved ? savedChildren ?? children : children}
    </button>
  );
}
