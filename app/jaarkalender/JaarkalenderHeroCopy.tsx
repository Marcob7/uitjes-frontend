"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { JaarkalenderScrollButton } from "./JaarkalenderScrollButton";

/**
 * The page itself is server-rendered, but locale-prefixed URLs are rewritten
 * to one App Router segment. Reading the URL-backed locale here ensures the
 * visible hero copy updates during a client-side language switch as well.
 */
export function JaarkalenderHeroCopy() {
  const { t } = useLocale();

  return <>
    <div>
      <h1
        id="jaarkalender-hero-title"
        style={{ maxInlineSize: "none" }}
        className="mt-5 max-w-[11.5ch] text-[clamp(3.35rem,7.2vw,6.75rem)] font-medium leading-[0.9] tracking-[-0.064em] text-[#f5f5ef] [text-shadow:0_4px_28px_rgba(0,0,0,0.22)]"
      >
        {t("yearCalendar.heroTitle")}
      </h1>
    </div>

    <div className="max-w-[32rem] pb-1 lg:justify-self-end">
      <p className="text-[15px] leading-7 text-white/78 sm:text-base sm:leading-7">
        {t("yearCalendar.heroIntro")}
      </p>
      <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <JaarkalenderScrollButton targetId="jaarkalender-kalender" label={t("yearCalendar.thisMonth")} />
        <JaarkalenderScrollButton targetId="jaarkalender-overzicht" label={t("yearCalendar.wholeYear")} variant="secondary" />
      </div>
    </div>
  </>;
}
