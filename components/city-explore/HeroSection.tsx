import Image from "next/image";
import type { ReactNode } from "react";
import type { EditorialContent, SafeCityTheme } from "./types";
import { optimizeRemoteImageUrl } from "@/lib/remoteImage";

type HeroSectionProps = {
  cityLabel: string;
  cityTheme: SafeCityTheme;
  editorialContent: EditorialContent;
  onCtaClick: () => void;
  plannerSection?: ReactNode;
  showRecommendations?: boolean;
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function HeroSection({
  cityLabel,
  cityTheme,
  editorialContent,
  onCtaClick,
  plannerSection,
  showRecommendations = true,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(249,244,235,0.96) 100%)",
        }}
      />
      <div
        className="absolute -left-16 top-28 h-40 w-40 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(184, 234, 114, 0.22)" }}
      />
      <div
        className="absolute right-10 top-14 h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(231, 215, 194, 0.9)" }}
      />

      <div className="relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)] lg:items-center">
          <div className="max-w-[36rem]">
            <h1
              className="max-w-[10ch] text-[clamp(3rem,6vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.07em]"
              style={{ color: cityTheme.colors.heading || "#111111" }}
            >
              {editorialContent.titleIntro}{" "}
              <span style={{ color: "#5f8a32" }}>{editorialContent.titleAccent}</span>{" "}
              {editorialContent.titleOutro}
            </h1>

            <p
              className="mt-6 max-w-[33rem] text-base leading-8 sm:text-lg"
              style={{ color: cityTheme.colors.text || "#4f493f" }}
            >
              {editorialContent.intro}
            </p>

            <button
              type="button"
              onClick={onCtaClick}
              className="mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold shadow-[0_14px_30px_rgba(119,151,64,0.18)] transition hover:translate-y-[-1px]"
              style={{
                backgroundColor: cityTheme.colors.accent,
                color: cityTheme.colors.accentText,
              }}
            >
              <span>{editorialContent.ctaLabel}</span>
              <ArrowIcon />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div
              className="absolute -left-4 top-[-1rem] h-24 w-24 rounded-full"
              style={{ backgroundColor: "rgba(184, 234, 114, 0.55)" }}
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#f0e5d9] shadow-[0_30px_80px_rgba(89,68,38,0.16)]">
              <div className="relative aspect-[1.12/0.84]">
                <Image
                  src={optimizeRemoteImageUrl(
                    cityTheme.heroImage || cityTheme.fallbackImage,
                    {
                      width: 1200,
                    }
                  )}
                  alt={`${cityLabel} sfeerbeeld`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 540px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {plannerSection}

        {showRecommendations ? (
          <div className="mt-10">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f493f]">
              <span className="h-px w-8 bg-[#7c756c]" />
              Aanraders voor jou
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {editorialContent.recommendations.map((recommendation) => (
                <a
                  key={recommendation.id}
                  href={recommendation.href}
                  className="group rounded-[1.8rem] border border-black/6 bg-white/80 px-5 py-5 shadow-[0_12px_34px_rgba(35,27,18,0.05)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6c664f]">
                        {recommendation.tag}
                      </div>
                      <div className="mt-3 text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#111111]">
                        {recommendation.title}
                      </div>
                      <div className="mt-2 text-sm text-[#6a6258]">
                        {recommendation.subtitle}
                      </div>
                    </div>

                    <div className="rounded-full bg-[#f2f0ea] p-2 text-[#6f6a61] transition group-hover:bg-[#e6efda] group-hover:text-[#43602a]">
                      <ArrowIcon />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
