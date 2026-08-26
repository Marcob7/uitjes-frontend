import { NewsLetterSection } from "@/components/NewsLetterSection";
import { JaarkalenderInteractiveCalendar } from "./JaarkalenderFilterControls";
import { JaarkalenderScrollButton } from "./JaarkalenderScrollButton";

const CALENDAR_HERO_VIDEO =
  "/videos/green-water-adventure-calendar-hero.mp4";
const CALENDAR_HERO_POSTER =
  "/videos/green-water-adventure-calendar-hero-poster.jpg";

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
    <main className="min-h-screen overflow-x-clip bg-[#f6f3ed] text-[#171511]">
      <section
        className="relative isolate flex min-h-[43rem] items-end overflow-hidden bg-[#10231c] text-white sm:min-h-[76svh] lg:min-h-[82svh]"
        data-navbar-contrast="on-dark"
        aria-labelledby="jaarkalender-hero-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${CALENDAR_HERO_POSTER})` }}
        />
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[52%_center] motion-reduce:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={CALENDAR_HERO_POSTER}
          aria-hidden="true"
        >
          <source src={CALENDAR_HERO_VIDEO} type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,16,13,0.28)_0%,rgba(7,16,13,0.22)_32%,rgba(7,16,13,0.79)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,17,13,0.56)_0%,rgba(6,17,13,0.22)_48%,rgba(6,17,13,0.12)_100%)]"
        />

        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-5 pb-16 pt-32 sm:px-7 sm:pb-20 lg:grid-cols-[minmax(0,1.32fr)_minmax(18rem,0.68fr)] lg:items-end lg:gap-16 lg:px-8 lg:pb-20">
          <div>
         
            <h1
              id="jaarkalender-hero-title"
              style={{ maxInlineSize: "none" }}
              className="mt-5 max-w-[11.5ch] text-[clamp(3.35rem,7.2vw,6.75rem)] font-medium leading-[0.9] tracking-[-0.064em] text-[#f5f5ef] [text-shadow:0_4px_28px_rgba(0,0,0,0.22)]"
            >
              Er is altijd iets om naar uit te kijken.
            </h1>
          </div>

          <div className="max-w-[32rem] pb-1 lg:justify-self-end">
            <p className="text-[15px] leading-7 text-white/78 sm:text-base sm:leading-7">
              Van festivals en stadsfeesten tot markten en bijzondere
              weekenden. Ontdek wat er deze maand in Nederland gebeurt.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <JaarkalenderScrollButton
                targetId="jaarkalender-kalender"
                label="Bekijk deze maand"
              />
              <JaarkalenderScrollButton
                targetId="jaarkalender-overzicht"
                label="Bekijk het hele jaar"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8 lg:pb-10">
        <section
          id="jaarkalender-kalender"
          className="-mt-6 scroll-mt-24 sm:-mt-8 sm:scroll-mt-28 lg:-mt-9"
        >
          <JaarkalenderInteractiveCalendar />
        </section>

        <NewsLetterSection
          source="jaarkalender"
          interests={["events"]}
          className="mt-12 ml-[calc(50%-50vw)] w-screen"
        />
      </div>
    </main>
  );
}
