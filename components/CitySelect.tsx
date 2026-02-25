// frontend/components/CitySelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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
  defaultCity = "apeldoorn",
}: {
  cities: CityOption[];
  defaultCity?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Huidige waarden uit de URL (of default)
  const currentCity = searchParams.get("city") ?? defaultCity;

  // We bewaren de overige filters zodat die niet wegvallen bij city change
  const currentFree = searchParams.get("free") ?? "0";
  const currentWhen = searchParams.get("when"); // kan null zijn

  // Voor performance/leesbaarheid maken we de "basis" URL één keer
  const baseUrl = useMemo(() => "/ontdek", []);

  function onChangeCity(nextCity: string) {
    // Bouw nieuwe query string met behoud van bestaande filters
    const params = new URLSearchParams();

    params.set("city", nextCity);

    if (currentFree === "1") params.set("free", "1");
    if (currentWhen) params.set("when", currentWhen);

    // Push naar de nieuwe URL → Next rendert server component opnieuw met nieuwe searchParams
    router.push(`${baseUrl}?${params.toString()}`);
  }

  return (
    <label style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <div style={{ fontWeight: 600 }}>Stad</div>

      <select
        value={currentCity}
        onChange={(e) => onChangeCity(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "white",
        }}
      >
        {cities.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
