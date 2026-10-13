// frontend/components/CitySelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AppSelect } from "@/components/ui";

// CitySelect laat de gebruiker een stad kiezen.
// Bij kiezen updaten we de URL query params, en behouden we:
// - free (0/1)
// - when (tonight/weekend)
// Zo blijft de rest van de filters staan.

export type CityOption = {
  label: string; // Wat je toont in de dropdown
  value: string; // Wat je in de URL stopt (slug)
};

export default function CitySelect({
  cities,
  defaultCity,
  baseUrl = "/ontdek",
  label = "Stad",
  placeholder = "Kies een stad",
}: {
  cities: CityOption[];
  defaultCity?: string;
  baseUrl?: string;
  label?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is authoritative. A caller can supply a selected city for a
  // legacy view, but no city should ever be inferred by this control.
  const currentCity = searchParams.get("city") ?? defaultCity ?? "";

  // We bewaren de overige filters zodat die niet wegvallen bij city change
  const currentFree = searchParams.get("free") ?? "0";
  const currentWhen = searchParams.get("when"); // kan null zijn

  // Voor performance/leesbaarheid maken we de "basis" URL één keer
  const discoverBaseUrl = useMemo(() => baseUrl, [baseUrl]);

  function onChangeCity(nextCity: string) {
    // Bouw nieuwe query string met behoud van bestaande filters
    const params = new URLSearchParams();

    params.set("city", nextCity);

    if (currentFree === "1") params.set("free", "1");
    if (currentWhen) params.set("when", currentWhen);

    // Push naar de nieuwe URL → Next rendert server component opnieuw met nieuwe searchParams
    router.push(`${discoverBaseUrl}?${params.toString()}`);
  }

  return (
    <AppSelect
      id="city-select"
      label={label}
      value={currentCity}
      onChange={(event) => onChangeCity(event.target.value)}
      placeholder={!currentCity ? placeholder : undefined}
      options={cities}
      wrapperClassName="w-full sm:max-w-[320px]"
      className="border-stone-200 bg-white text-stone-900 shadow-none focus:border-stone-400 focus:ring-0"
    />
  );
}
