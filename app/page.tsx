import HomeVideoSection from "@/components/home/homeVideoSection";
import CtaBannerSection from "@/components/home/CtaBannerSection";
import PlansFallenThroughSection from "@/components/home/PlansFallenThroughSection";
import AgendaSection from "@/components/home/AgendaSection";
import HomeCitiesShowcaseSection from "@/components/home/HomeCitiesShowcaseSection";
import type { Metadata } from "next";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";

export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const english = locale === "en";
  const title = english ? "Things to do and events in the Netherlands | Uitjes" : "Uitjes en evenementen in Nederland | Uitjes";
  const description = english
    ? "Find great days out, activities, festivals and events in Dutch cities. Choose a city and make plans that suit you."
    : "Vind leuke uitjes, activiteiten, festivals en evenementen in Nederlandse steden. Kies een stad en maak plannen die bij je passen.";

  return { title, description, alternates: getLocaleAlternates(pathname, locale), openGraph: { title, description, ...getLocaleOpenGraph(locale, pathname) } };
}

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#f8f5f3]">
      <HomeVideoSection />

      <CtaBannerSection />

      <PlansFallenThroughSection />

      <AgendaSection />

      <HomeCitiesShowcaseSection />
    </main>
  );
}
