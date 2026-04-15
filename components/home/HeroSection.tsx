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
      <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: optimizeCssBackground(
              "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1600&q=80",
              {
                width: 1280,
                quality: 58,
              },
            ),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.86))] lg:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.76),rgba(15,23,42,0.62))]" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
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

          <div className="mt-5 hidden flex-wrap items-center justify-center gap-3 sm:flex">
            {featuredCities.map((city) => (
              <Link
                key={city!.value}
                href={`/ontdek?city=${city!.value}`}
                className="inline-flex min-h-[44px] items-center rounded-full bg-white/90 px-4 text-sm font-medium text-slate-800 transition hover:bg-white md:px-5"
              >
                {city!.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex w-full max-w-xl flex-col items-stretch gap-3 lg:mt-4 lg:max-w-none lg:flex-row lg:items-center lg:justify-center">
            <Link
              href="/inspiratie"
              className="inline-flex min-h-[56px] w-full items-center justify-between gap-3 rounded-full bg-lime-200 px-6 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 lg:min-h-[52px] lg:w-auto lg:justify-center"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lime-700 text-white">
                &#10022;
              </span>
              Help mij ontdekken wat ik kan doen
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/jaarkalender"
              className="inline-flex min-h-[56px] w-full items-center justify-between gap-3 rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 lg:min-h-[52px] lg:w-auto lg:justify-center lg:gap-2"
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
