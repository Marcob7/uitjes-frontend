import Link from "next/link";
import SearchBar from "./SearchBar";
import { WebGLLiquid } from "@/components/ui/webgl-liquid";
import { cityOptions } from "@/lib/cityConfig";

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
      <div className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
        <div className="absolute inset-0">
          <WebGLLiquid
            title=""
            subtitle=""
            description=""
            colorDeep="#07131a"
            colorMid="#0f4950"
            colorHighlight="#c6df9a"
            speed={0.72}
            flowStrength={0.92}
            grain={0.025}
            contrast={1.08}
            opacity={0.94}
            reveal={false}
            className="h-full w-full !min-h-0"
            style={{ minHeight: "100%", height: "100%", backgroundColor: "#09151b" }}
            overlayClassName="bg-gradient-to-br from-[#09151b]/88 via-[#09151b]/72 to-[#0d2027]/64"
            glowClassName="bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(198,223,154,0.2),transparent_24%)]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,26,0.12),rgba(7,19,26,0.42))]" />
        <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-[rgba(198,223,154,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 h-48 w-48 rounded-full bg-[rgba(122,213,217,0.14)] blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex min-h-[44px] items-center rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-md">
            Ontdek Nederland op gevoel
          </div>

          <h1 className="mx-auto mt-6 max-w-[12ch] text-center text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-white md:text-5xl lg:text-6xl">
            Vind je volgende
            <br />
            geluksmoment.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/88 md:text-base">
            Zoek direct op stad en bekijk meteen wat daar te doen is.
          </p>

          <div className="mt-8 w-full">
            <SearchBar
              rootClassName="max-w-[46rem]"
              formClassName="border border-white/20 bg-white/12 shadow-[0_24px_60px_rgba(3,10,14,0.24)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/10"
              inputWrapperClassName="rounded-[20px] sm:rounded-full"
              iconClassName="text-white/68"
              inputClassName="text-white placeholder:text-white/62"
              suggestionsPanelClassName="border-white/12 bg-[#0d1920]/96 shadow-[0_24px_60px_rgba(2,8,11,0.34)] backdrop-blur-xl"
              suggestionItemClassName="text-white/88 hover:bg-white/8"
              submitButtonClassName="border border-[#e8f2d0]/65 bg-[#e8f2d0] text-[#162016] shadow-[0_18px_36px_rgba(12,20,12,0.18)] hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7fbeb]"
            />
          </div>

          <div className="mt-5 hidden flex-wrap items-center justify-center gap-3 sm:flex">
            {featuredCities.map((city) => (
              <Link
                key={city!.value}
                href={`/ontdek?city=${city!.value}`}
                className="inline-flex min-h-[44px] items-center rounded-2xl border border-white/16 bg-white/10 px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-white/14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:rounded-full md:px-5"
              >
                {city!.label}
              </Link>
            ))}
          </div>

          <div className="relative z-0 mt-6 flex w-full max-w-xl flex-col items-stretch gap-3 lg:mt-4 lg:max-w-none lg:flex-row lg:items-center lg:justify-center">
            <Link
              href="/inspiratie"
              className="inline-flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border border-[#e8f2d0]/65 bg-[#e8f2d0] px-6 text-sm font-semibold text-[#162016] shadow-[0_18px_36px_rgba(12,20,12,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f1f7df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7fbeb] lg:min-h-[52px] lg:w-auto lg:justify-center lg:rounded-full"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3224] text-[#f7fbeb]">
                &#10022;
              </span>
              Help mij ontdekken wat ik kan doen
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/jaarkalender"
              className="inline-flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border border-white/18 bg-white/10 px-6 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:min-h-[52px] lg:w-auto lg:justify-center lg:gap-2 lg:rounded-full"
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
