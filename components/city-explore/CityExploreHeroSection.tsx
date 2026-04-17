"use client";

import type { SafeCityTheme } from "./types";

type CityExploreHeroSectionProps = {
  cityLabel: string;
  intro: string;
  cityTheme: SafeCityTheme;
};

function buildCityBadge(cityLabel: string) {
  return `${cityLabel} selectie`;
}

export default function CityExploreHeroSection({
  cityLabel,
  intro,
  cityTheme,
}: CityExploreHeroSectionProps) {
  return (
    <section
      className="border-b border-black/[0.04]"
      style={{
        background:
          cityTheme.colors.softSurface ||
          cityTheme.colors.pageBackground ||
          "#ffffff",
      }}
    >
      <div className="mx-auto max-w-[1220px] px-6 pb-10 pt-14 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
        <div
          className="inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{
            backgroundColor: cityTheme.colors.accent,
            color: cityTheme.colors.accentText,
          }}
        >
          {buildCityBadge(cityLabel)}
        </div>

        <h1
          className="mt-6 max-w-[11ch] text-[clamp(3.1rem,7vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.075em]"
          style={{ color: cityTheme.colors.heading || "#141414" }}
        >
          Beste matches voor jullie avond in {cityLabel}
        </h1>

        <p
          className="mt-5 max-w-[40rem] text-base leading-8 sm:text-[1.06rem]"
          style={{ color: cityTheme.colors.text || "#5d5148" }}
        >
          {intro}
        </p>
      </div>
    </section>
  );
}
