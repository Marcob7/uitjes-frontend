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
      <div className="mx-auto max-w-[1220px] px-6 pb-8 pt-[clamp(10rem,18vw,14rem)] sm:px-8 lg:px-10 lg:pb-10 lg:pt-[clamp(11rem,16vw,15rem)]">
        <div
          className="inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          style={{
            backgroundColor: cityTheme.colors.accent,
            color: cityTheme.colors.accentText,
          }}
        >
          {buildCityBadge(cityLabel)}
        </div>

        <p
          className="mt-6 max-w-[42rem] text-base leading-8 sm:text-[1.08rem]"
          style={{
            color: isDarkLiquid
              ? "rgba(255,255,255,0.88)"
              : cityTheme.colors.text || "#5d5148",
          }}
        >
          {intro || `Ontdek wat er vanavond speelt in ${cityLabel}.`}
        </p>
      </div>
    </section>
  );
}
