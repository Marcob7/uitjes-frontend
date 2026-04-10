import Link from "next/link";
import SearchBar from "./SearchBar";
import { cityOptions } from "@/lib/cityConfig";
import { optimizeCssBackground } from "@/lib/remoteImage";

const featuredCitySlugs = [
  "amsterdam",
  "rotterdam",
  "utrecht",
  "apeldoorn",
  "deventer",
  "zwolle",
];

const featuredCities = featuredCitySlugs
  .map((slug) => cityOptions.find((city) => city.value === slug))
  .filter(Boolean);

export default function HeroSection() {
  return (
    <section className="px-4 pt-4 md:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.34), rgba(0,0,0,0.18)),
            ${optimizeCssBackground("https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1600&q=80", {
              width: 1280,
              quality: 58,
            })}
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="mx-auto max-w-[12ch] text-center text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
            Vind je volgende
            <br />
            geluksmoment.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
            Zoek direct op stad en bekijk meteen wat daar te doen is.
          </p>

          <div className="mt-8 w-full">
            <SearchBar />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {featuredCities.map((city) => (
              <Link
                key={city!.value}
                href={`/ontdek?city=${city!.value}`}
                className="inline-flex min-h-[44px] items-center rounded-full bg-white/90 px-4 text-sm font-medium text-slate-800 transition hover:bg-white"
              >
                {city!.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/inspiratie"
              className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-lime-200 px-6 text-sm font-semibold text-slate-900 transition hover:bg-lime-300"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lime-700 text-white">
                ✦
              </span>
              Help mij ontdekken wat ik kan doen
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/jaarkalender"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
            >
              Bekijk de jaarkalender van Nederland
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
