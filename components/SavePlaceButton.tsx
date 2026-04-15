"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  isPlaceSaved,
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPlaceSaved(item.id));
  }, [item.id]);

  function handleClick() {
    const next = toggleSavedPlace(item);
    setSaved(next.some((place) => place.id === item.id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      className={saved ? savedClassName ?? className : className}
    >
      {saved ? savedChildren ?? children : children}
    </button>
  );
}
