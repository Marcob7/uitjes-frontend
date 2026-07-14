import Link from "next/link";

import { CalendarNewsletterSignupSection } from "./CalendarNewsletterSignupSection";
import { JaarkalenderInteractiveCalendar } from "./JaarkalenderFilterControls";
import { JaarkalenderScrollButton } from "./JaarkalenderScrollButton";

export const metadata = {
  title: "Jaarkalender van Nederland | Uitjes NL",
  description:
    "Ontdek culturele hoogtepunten, festivals en evenementen in de jaarkalender van Nederland.",
  alternates: {
    canonical: "/jaarkalender",
  },
};

export default function JaarkalenderPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5f3] text-[#171511]">
      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="px-1 pb-2 pt-6 sm:px-2 sm:pt-10 lg:pt-12">
          <div className="max-w-[56rem]">
          
            <h1 className="mt-4 text-[clamp(2.7rem,5.3vw,5rem)] font-semibold leading-[0.93] tracking-[-0.065em] text-[#121c27]">
              De Jaarkalender van
              <span className="block text-[#008247]">Nederland</span>
            </h1>
            <p className="mt-5 max-w-[37rem] text-sm leading-6 text-[#44515b] sm:text-base sm:leading-7">
              Ontdek een verfijnde selectie van de meest bijzondere evenementen.
              Van intieme stadsrondes door historische stegen tot grootschalige
              festivals die het land laten bruisen.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <JaarkalenderScrollButton
                targetId="jaarkalender-kalender"
                label="Bekijk Vandaag"
              />
              <Link
                href="/saved"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#cbd8d4] bg-white px-7 text-sm font-semibold text-[#00733d] transition hover:border-[#8ebba4] hover:bg-[#f6fbf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008247]"
              >
                Favorieten
              </Link>
            </div>
          </div>
        </section>

        <section id="jaarkalender-kalender" className="mt-8 scroll-mt-6 sm:mt-12 sm:scroll-mt-8">
          <JaarkalenderInteractiveCalendar />
        </section>

        <CalendarNewsletterSignupSection />
      </div>
    </main>
  );
}
