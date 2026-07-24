import { WebGLLiquid } from "@/components/ui/webgl-liquid";

import type { SafeCityTheme } from "./types";

type CityExploreHeroSectionProps = {
  cityLabel: string;
  intro: string;
  resultCount: number;
  isGenericLanding?: boolean;
  cityTheme: SafeCityTheme;
  isDarkLiquid: boolean;
};

function buildCityBadge(cityLabel: string) {
  return `${cityLabel} selectie`;
}

export default function CityExploreHeroSection({
  cityLabel,
  intro,
  resultCount,
  isGenericLanding = false,
  cityTheme,
  isDarkLiquid,
}: CityExploreHeroSectionProps) {
  const title = isGenericLanding
    ? "Ontdek uitjes in Nederland"
    : `Ontdek ${cityLabel}`;
  const description = isGenericLanding
    ? "Zoek en filter uitjes, evenementen, restaurants en plekken per stad."
    : intro ||
      `Vind uitjes, evenementen en plekken in ${cityLabel} die passen bij je plannen.`;
  const resultLabel =
    resultCount === 1 ? "1 plek gevonden" : `${resultCount} puike plannen gevonden`;

  return (
    <section className="relative overflow-hidden rounded-[2rem] px-5 py-7 shadow-[0_24px_72px_rgba(14,22,18,0.22)] sm:rounded-[2.4rem] sm:px-8 sm:py-10 lg:px-11 lg:py-12">
      <div className="absolute inset-0">
        <WebGLLiquid
          title=""
          subtitle=""
          description=""
          colorDeep={cityTheme.liquid.deep}
          colorMid={cityTheme.liquid.mid}
          colorHighlight={cityTheme.liquid.highlight}
          speed={0.68}
          flowStrength={0.82}
          grain={0.026}
          contrast={1.05}
          opacity={0.88}
          reveal={false}
          className="h-full w-full !min-h-0"
          style={{
            minHeight: "100%",
            height: "100%",
            backgroundColor: "#09151b",
          }}
          overlayClassName={
            isDarkLiquid
              ? "bg-gradient-to-br from-[#09151b]/88 via-[#09151b]/68 to-[#0d2027]/58"
              : "bg-gradient-to-br from-[#09151b]/80 via-[#09151b]/58 to-[#0d2027]/48"
          }
          glowClassName={
            isDarkLiquid
              ? "bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(198,223,154,0.18),transparent_24%)]"
              : "bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(198,223,154,0.2),transparent_24%)]"
          }
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/14 sm:rounded-[2.4rem]" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="max-w-[43rem]">
      

          <h1 className="mt-5 max-w-[11ch] text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-white sm:mt-6">
            {title}
          </h1>

          <p
            className="mt-5 max-w-[34rem] text-sm leading-7 text-white/88 sm:text-base md:text-lg md:leading-8"
            style={{
              color: isDarkLiquid
                ? "rgba(255,255,255,0.88)"
                : "rgba(255,255,255,0.9)",
            }}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:max-w-[22rem] lg:justify-end">
          <div
            className="inline-flex min-h-[44px] items-center rounded-2xl border px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md md:rounded-full md:px-5"
            style={{
              borderColor: "rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            {isGenericLanding ? "Zoeken per stad" : resultLabel}
          </div>
          <div
            className="inline-flex min-h-[44px] items-center rounded-2xl border px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md md:rounded-full md:px-5"
            style={{
              borderColor: cityTheme.colors.accent || "rgba(232,242,208,0.5)",
              backgroundColor: "rgba(232,242,208,0.16)",
            }}
          >
            Uitjes, events en plekken
          </div>
        </div>
      </div>
    </section>
  );
}
