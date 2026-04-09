import Image from "next/image";
import type { SafeCityTheme } from "./types";
import { formatCityTitle, formatIntro } from "./utils";
import { optimizeRemoteImageUrl } from "@/lib/remoteImage";

type HeroSectionProps = {
  cityLabel: string;
  cityTheme: SafeCityTheme;
};

export default function HeroSection({
  cityLabel,
  cityTheme,
}: HeroSectionProps) {
  return (
    <section
      className="rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      style={{
        backgroundColor: cityTheme.colors.softSurface || "#efe4dd",
      }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-xl">
          <h1
            className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: cityTheme.colors.heading || "#111111" }}
          >
            {formatCityTitle(cityLabel)}
          </h1>

          <p
            className="mt-5 text-base leading-7 sm:text-lg"
            style={{ color: cityTheme.colors.text || "#4b4b4b" }}
          >
            {formatIntro(cityLabel, cityTheme.description)}
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center rounded-full px-5 py-3 text-sm font-medium shadow-sm transition hover:opacity-95"
            style={{
              backgroundColor: cityTheme.colors.accent,
              color: cityTheme.colors.accentText,
            }}
          >
            Explore Events
          </button>
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-[1.5rem] shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:h-[380px]">
          <Image
            src={optimizeRemoteImageUrl(cityTheme.heroImage || cityTheme.fallbackImage, {
              width: 960,
            })}
            alt={cityLabel}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
      </div>
    </section>
  );
}
