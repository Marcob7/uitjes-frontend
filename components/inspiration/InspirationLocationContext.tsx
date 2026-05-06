"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppButton, AppInput } from "@/components/ui/app";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
import {
  getInspirationCityLabel,
  resolveNearestInspirationCityFromCoordinates,
} from "@/lib/dummy/inspirationResults";
import { cn } from "@/lib/utils";

type InspirationLocationContextProps = {
  compact?: boolean;
  className?: string;
};

const locationOptions = [
  {
    value: "nearby",
    label: "In de buurt van mij",
  },
  {
    value: "city",
    label: "Kies een stad",
  },
  {
    value: "surprise",
    label: "Maakt niet uit",
  },
];

function findCity(input: string) {
  const normalized = normalizeCitySlug(input);

  return cityOptions.find(
    (city) =>
      city.value === normalized ||
      normalizeCitySlug(city.label) === normalized
  );
}

function getInitialCity(location: string | null) {
  if (!location || location === "nearby" || location === "surprise") {
    return "";
  }

  return cityOptions.find((city) => city.value === location)?.label ?? location;
}

export function InspirationLocationContext({
  compact = false,
  className,
}: InspirationLocationContextProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const nearbyCity = searchParams.get("nearbyCity") ?? undefined;
  const [isPickingCity, setIsPickingCity] = React.useState(false);
  const [cityInput, setCityInput] = React.useState(getInitialCity(location));
  const [isResolvingLocation, setIsResolvingLocation] = React.useState(false);
  const [locationStatus, setLocationStatus] = React.useState<string | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const nearbyRequestId = React.useRef(0);
  const selectedMode =
    isPickingCity
      ? "city"
      : location === "nearby" || location === "surprise"
        ? location
        : location
        ? "city"
        : undefined;

  React.useEffect(() => {
    setCityInput(getInitialCity(location));
  }, [location]);

  function updateLocation(nextLocation?: string, nextNearbyCity?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextLocation !== "nearby") {
      nearbyRequestId.current += 1;
      setIsResolvingLocation(false);
    }

    if (nextLocation) {
      params.set("location", nextLocation);
    } else {
      params.delete("location");
    }

    if (nextLocation === "nearby" && nextNearbyCity) {
      params.set("nearbyCity", nextNearbyCity);
    } else {
      params.delete("nearbyCity");
    }

    setIsPickingCity(false);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function startPickingCity() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("location");
    params.delete("nearbyCity");

    nearbyRequestId.current += 1;
    setIsResolvingLocation(false);
    setLocationStatus(null);
    setLocationError(null);
    setIsPickingCity(true);
    setCityInput(getInitialCity(location));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function confirmCity() {
    const trimmed = cityInput.trim();

    if (trimmed.length < 2) return;

    setLocationStatus(null);
    setLocationError(null);
    updateLocation(findCity(trimmed)?.value ?? normalizeCitySlug(trimmed));
  }

  function requestNearbyLocation() {
    setIsPickingCity(false);
    setLocationStatus(null);
    setLocationError(null);

    if (!("geolocation" in navigator)) {
      setLocationError(
        "Je browser ondersteunt locatie ophalen niet. Kies een stad of gebruik 'Maakt niet uit'."
      );
      return;
    }

    setIsResolvingLocation(true);
    nearbyRequestId.current += 1;
    const requestId = nearbyRequestId.current;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== nearbyRequestId.current) return;

        const nearbyCitySlug = resolveNearestInspirationCityFromCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const cityLabel = getInspirationCityLabel(nearbyCitySlug);

        updateLocation("nearby", nearbyCitySlug);
        setLocationStatus(
          `We tonen resultaten op basis van je locatie, voorlopig gemapt naar ${cityLabel}.`
        );
        setIsResolvingLocation(false);
      },
      () => {
        if (requestId !== nearbyRequestId.current) return;

        setLocationError(
          "Locatie ophalen is niet gelukt. Kies een stad of gebruik 'Maakt niet uit' om verder te gaan."
        );
        setIsResolvingLocation(false);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 10000,
      }
    );
  }

  React.useEffect(() => {
    if (location === "nearby" && nearbyCity && !locationStatus) {
      const cityLabel = getInspirationCityLabel(nearbyCity);
      setLocationStatus(
        `We tonen resultaten op basis van je locatie, voorlopig gemapt naar ${cityLabel}.`
      );
    }
  }, [location, nearbyCity, locationStatus]);

  return (
    <div
      className={cn(
        "rounded-[1.4rem] border border-white/14 bg-white/10 p-4 text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] backdrop-blur-xl",
        compact ? "max-w-none" : "max-w-[46rem]",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/64">
            Waar wil je inspiratie voor?
          </p>
          <p className="mt-1 text-sm leading-6 text-white/76">
            Kies alleen context; je inspiratiecategorie blijft leidend.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {locationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={selectedMode === option.value}
              disabled={option.value === "nearby" && isResolvingLocation}
              onClick={() => {
                if (option.value === "city") {
                  startPickingCity();
                  return;
                }

                if (option.value === "nearby") {
                  requestNearbyLocation();
                  return;
                }

                setLocationStatus(null);
                setLocationError(null);
                updateLocation(option.value);
              }}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]",
                selectedMode === option.value
                  ? "border-[#e8f2d0]/70 bg-[#e8f2d0] text-[#162016]"
                  : "border-white/16 bg-white/10 text-white/82 hover:bg-white/14",
                option.value === "nearby" && isResolvingLocation
                  ? "cursor-wait opacity-75"
                  : ""
              )}
            >
              {option.value === "nearby" && isResolvingLocation
                ? "Locatie ophalen..."
                : option.label}
            </button>
          ))}
        </div>
      </div>

      {isResolvingLocation ? (
        <p className="mt-3 text-sm font-medium text-white/78" role="status">
          We vragen je browser om locatie-toestemming.
        </p>
      ) : null}

      {locationStatus ? (
        <p className="mt-3 text-sm font-medium text-[#e8f2d0]" role="status">
          {locationStatus}
        </p>
      ) : null}

      {locationError ? (
        <p
          className="mt-3 rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-sm font-medium text-white"
          role="alert"
        >
          {locationError}
        </p>
      ) : null}

      {selectedMode === "city" || (!location && cityInput) ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <AppInput
            label="Stad"
            name="inspiration-location-city"
            list="inspiration-location-city-options"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                confirmCity();
              }
            }}
            placeholder="Bijvoorbeeld Den Haag"
            wrapperClassName="text-[#171511]"
            className="min-h-11"
          />
          <datalist id="inspiration-location-city-options">
            {cityOptions.map((city) => (
              <option key={city.value} value={city.label} />
            ))}
          </datalist>
          <AppButton onClick={confirmCity} disabled={cityInput.trim().length < 2}>
            Gebruik stad
          </AppButton>
        </div>
      ) : null}

      {selectedMode === undefined ? (
        <button
          type="button"
          onClick={startPickingCity}
          className="mt-3 text-sm font-semibold text-[#e8f2d0] underline decoration-white/24 underline-offset-4"
        >
          Of kies een stad
        </button>
      ) : null}
    </div>
  );
}
