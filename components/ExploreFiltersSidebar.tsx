"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type DateFilter = "all" | "today" | "weekend" | "nextWeek";

export type ExperienceFilter =
  | "museum"
  | "restaurants"
  | "clubs"
  | "nachtleven"
  | "bars"
  | "cafes"
  | "evenementen"
  | "theater"
  | "muziek"
  | "markt"
  | "familie"
  | "outdoor";

export type ExploreFilters = {
  date: DateFilter;
  freeOnly: boolean;
  distanceKm: number;
  experienceTypes: ExperienceFilter[];
};

type ExploreFiltersSidebarProps = {
  selectedCity: string;
  availableCities: { label: string; slug: string; count?: number }[];
  filters: ExploreFilters;
  onChange: (next: ExploreFilters) => void;
};

export default function ExploreFiltersSidebar({
  selectedCity,
  availableCities,
  filters,
  onChange,
}: ExploreFiltersSidebarProps) {
  const [cityQuery, setCityQuery] = useState("");
  const [email, setEmail] = useState("");

  const dateOptions: { key: DateFilter; label: string }[] = [
    { key: "all", label: "Alles" },
    { key: "today", label: "Vandaag" },
    { key: "weekend", label: "Dit weekend" },
    { key: "nextWeek", label: "Volgende week" },
  ];

  const experienceOptions: { key: ExperienceFilter; label: string }[] = [
    { key: "museum", label: "Museum" },
    { key: "restaurants", label: "Restaurants" },
    { key: "clubs", label: "Clubs" },
    { key: "nachtleven", label: "Nachtleven" },
    { key: "bars", label: "Bars" },
    { key: "cafes", label: "Cafés" },
    { key: "evenementen", label: "Evenementen" },
    { key: "theater", label: "Theater" },
    { key: "muziek", label: "Muziek" },
    { key: "markt", label: "Markt" },
    { key: "familie", label: "Familie" },
    { key: "outdoor", label: "Outdoor" },
  ];

  const filteredCities = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();

    if (!q) return availableCities;

    return availableCities.filter((city) =>
      city.label.toLowerCase().includes(q)
    );
  }, [availableCities, cityQuery]);

  function toggleExperienceType(type: ExperienceFilter) {
    const exists = filters.experienceTypes.includes(type);

    if (exists) {
      onChange({
        ...filters,
        experienceTypes: filters.experienceTypes.filter((item) => item !== type),
      });
      return;
    }

    onChange({
      ...filters,
      experienceTypes: [...filters.experienceTypes, type],
    });
  }

  function resetFilters() {
    onChange({
      date: "all",
      freeOnly: false,
      distanceKm: 25,
      experienceTypes: [],
    });
    setCityQuery("");
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">Filters</h2>

        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Wanneer
        </p>

        <div className="mt-4 space-y-3">
          {dateOptions.map((option) => {
            const checked = filters.date === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ ...filters, date: option.key })}
                className="flex w-full items-center gap-3 text-left"
              >
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full border transition",
                    checked
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-[#d6d3ce] bg-white text-transparent",
                  ].join(" ")}
                >
                  ✓
                </span>
                <span className="text-base font-medium text-slate-800">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] bg-[#f5efe7] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Type ervaring
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {experienceOptions.map((option) => {
            const active = filters.experienceTypes.includes(option.key);

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleExperienceType(option.key)}
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#c8e996] text-[#2e4b1f]"
                    : "bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Stad
        </p>

        <div className="mt-4">
          <div className="flex items-center gap-3 border-b border-[#d7d2ca] pb-3">
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder="Zoek stad..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <span className="text-slate-400">📍</span>
          </div>

          <div className="mt-4 space-y-1">
            {filteredCities.map((city) => {
              const active = city.slug === selectedCity;

              return (
                <Link
                  key={city.slug}
                  href={`/ontdek?city=${city.slug}`}
                  className={[
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-[#c8e996] font-semibold text-[#2e4b1f]"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span>{city.label}</span>
                  <span className="text-slate-400">
                    {active ? "✓" : city.count ?? ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] bg-[#ebeaf7] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Afstand (km)
          </p>
          <span className="text-sm font-medium text-slate-700">
            {filters.distanceKm} km
          </span>
        </div>

        <div className="mt-5">
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={filters.distanceKm}
            onChange={(e) =>
              onChange({
                ...filters,
                distanceKm: Number(e.target.value),
              })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300"
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
            <span>0 km</span>
            <span>50 km</span>
          </div> 
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] bg-[#f5efe7] p-5">
        <h3 className="text-xl font-semibold text-slate-900">Blijf op de hoogte</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ontvang updates over nieuwe uitjes en evenementen in deze stad.
        </p>

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Nieuwsbrief email:", email);
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mailadres"
            className="w-full rounded-full bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </form>
      </div>
    </aside>
  );
}