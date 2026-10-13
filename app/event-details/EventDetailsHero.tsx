import Image from "next/image";

import { useLocale } from "@/components/i18n/LocaleProvider";

import { ArrowIcon } from "./EventDetailsIcons";

type EventDetailsHeroProps = {
  guideDateLabel: string;
  guideIsThisWeekend: boolean;
};

export function EventDetailsHero({
  guideDateLabel,
  guideIsThisWeekend,
}: EventDetailsHeroProps) {
  const { t } = useLocale();

  return (
    <section
      className="relative isolate overflow-hidden border-b border-[#d9ddd2] bg-[#dce8d7]"
      data-navbar-contrast="on-light"
      aria-labelledby="hero-title"
    >
      <div aria-hidden="true" className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#f1c68f]/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 right-[-5rem] h-[28rem] w-[28rem] rounded-full bg-[#b7d2cc]/55 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-center lg:gap-16 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="max-w-[38rem]">
          <div className="flex flex-wrap items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#536255]">
            <span className="rounded-full border border-[#91a78f] bg-[#edf4e9] px-3 py-1.5">{t("events.guide")}</span>
            <span>{guideDateLabel}</span>
          </div>
          <h1 id="hero-title" className="mt-7 max-w-[9ch] text-[clamp(4.1rem,9vw,8.6rem)] font-medium leading-[0.82] tracking-[-0.078em] text-[#203327]">
            {t("events.heroTitle")}
          </h1>
          <p className="mt-7 max-w-[30rem] text-[clamp(1.08rem,1.7vw,1.35rem)] leading-[1.42] tracking-[-0.025em] text-[#4d5c4f]">
            {guideIsThisWeekend ? t("events.heroWeekendIntro") : t("events.heroIntro")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#weekend" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#223629] px-5 py-3 text-sm font-semibold text-[#f8f7ef] shadow-[0_12px_28px_rgba(34,54,41,0.18)] transition hover:-translate-y-0.5 hover:bg-[#304938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a05c3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#dce8d7]">
              {t("events.viewEvents")} <ArrowIcon />
            </a>
            <span className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[#5c6a5b]"><span className="h-2 w-2 rounded-full bg-[#b05f3a]" /> {t("events.editorialTips")}</span>
          </div>
        </div>

        <div className="relative min-h-[29rem] overflow-hidden rounded-[2rem] bg-[#becdb9] shadow-[0_28px_65px_rgba(55,76,57,0.2)] sm:min-h-[36rem] lg:min-h-[42rem]">
          <Image src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=90" alt={t("events.heroImageAlt")} fill unoptimized priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,25,17,0.04)_30%,rgba(13,25,17,0.75)_100%)]" />
          <div className="absolute left-5 top-5 rounded-full bg-[#f6f3ec]/90 px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.17em] text-[#2b3c2d] backdrop-blur sm:left-7 sm:top-7">{guideDateLabel} · Utrecht</div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-[#fcfbf4] sm:bottom-7 sm:left-7 sm:right-7">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.19em] text-white/75">{t("events.mainHighlight")}</p>
              <p className="mt-2 max-w-[10ch] text-[clamp(2.25rem,4.8vw,4.7rem)] font-medium leading-[0.86] tracking-[-0.065em]">Festival STRAND</p>
            </div>
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f6f3ec] text-[#24372a]"><ArrowIcon /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
