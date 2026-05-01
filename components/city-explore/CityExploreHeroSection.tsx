import type { SafeCityTheme } from "./types";

type CityExploreHeroSectionProps = {
  cityLabel: string;
  intro: string;
  cityTheme: SafeCityTheme;
  isDarkLiquid: boolean;
};

function buildCityBadge(cityLabel: string) {
  return `${cityLabel} selectie`;
}

export default function CityExploreHeroSection({
  cityLabel,
  intro,
  cityTheme,
  isDarkLiquid,
}: CityExploreHeroSectionProps) {
  return (
    <section className="relative bg-transparent">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-8 pt-12 text-center sm:px-8 sm:pt-16 lg:px-10 lg:pb-10 lg:pt-20">
        <div
          className="inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-md"
          style={{
            borderColor: isDarkLiquid
              ? "rgba(255,255,255,0.18)"
              : "rgba(255,255,255,0.34)",
            backgroundColor: isDarkLiquid
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {buildCityBadge(cityLabel)}
        </div>

        <h1 className="mx-auto mt-6 max-w-[12ch] text-center text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-white md:text-5xl lg:text-6xl">
          Ontdek {cityLabel}
          <br />
          op gevoel.
        </h1>

        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/88 md:text-base"
          style={{
            color: isDarkLiquid ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.9)",
          }}
        >
          {intro || `Ontdek wat er vanavond speelt in ${cityLabel}.`}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <div
            className="inline-flex min-h-[44px] items-center rounded-2xl border px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md md:rounded-full md:px-5"
            style={{
              borderColor: "rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            Vandaag in {cityLabel}
          </div>
          <div
            className="inline-flex min-h-[44px] items-center rounded-2xl border px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md md:rounded-full md:px-5"
            style={{
              borderColor: cityTheme.colors.accent || "rgba(232,242,208,0.5)",
              backgroundColor: "rgba(232,242,208,0.16)",
            }}
          >
            Persoonlijk gefilterd
          </div>
        </div>
      </div>
    </section>
  );
}
