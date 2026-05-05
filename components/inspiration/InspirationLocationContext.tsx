"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppButton, AppInput } from "@/components/ui/app";
import { cityOptions, normalizeCitySlug } from "@/lib/cityConfig";
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
  const [isPickingCity, setIsPickingCity] = React.useState(false);
  const [cityInput, setCityInput] = React.useState(getInitialCity(location));
  const selectedMode =
    location === "nearby" || location === "surprise"
      ? location
      : location
        ? "city"
        : isPickingCity
          ? "city"
          : undefined;

  React.useEffect(() => {
    setCityInput(getInitialCity(location));
  }, [location]);

  function updateLocation(nextLocation?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextLocation) {
      params.set("location", nextLocation);
    } else {
      params.delete("location");
    }

    setIsPickingCity(false);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function confirmCity() {
    const trimmed = cityInput.trim();

    if (trimmed.length < 2) return;

    updateLocation(findCity(trimmed)?.value ?? normalizeCitySlug(trimmed));
  }

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
              onClick={() => {
                if (option.value === "city") {
                  setIsPickingCity(true);
                  return;
                }

                updateLocation(option.value);
              }}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8f2d0]",
                selectedMode === option.value
                  ? "border-[#e8f2d0]/70 bg-[#e8f2d0] text-[#162016]"
                  : "border-white/16 bg-white/10 text-white/82 hover:bg-white/14"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
          onClick={() => setIsPickingCity(true)}
          className="mt-3 text-sm font-semibold text-[#e8f2d0] underline decoration-white/24 underline-offset-4"
        >
          Of kies een stad
        </button>
      ) : null}
    </div>
  );
}
