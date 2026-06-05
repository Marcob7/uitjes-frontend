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
      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="uitjes-liquid-section rounded-[2.4rem]">
          <div className="grid gap-10 px-6 py-7 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-11 lg:py-12">
            <div className="max-w-[38rem]">
              <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl">
                Nieuwe route
              </div>
              <h1 className="mt-6 max-w-[10ch] text-[clamp(3.3rem,8vw,5.8rem)] leading-[0.9] tracking-[-0.07em] text-white">
                De Jaarkalender van Nederland
              </h1>
              <p className="mt-6 max-w-[32rem] text-base leading-8 text-white/76 sm:text-lg">
                Ontdek de rijkdom van de Nederlandse cultuur, van intieme
                stadsevenementen tot grootschalige festivals.
              </p>

              <div className="mt-8">
                <JaarkalenderScrollButton targetId="jaarkalender-kalender" />
              </div>

           
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[2.2rem] border border-white/18 bg-white/14 p-5 shadow-[0_30px_80px_rgba(18,16,13,0.16)] backdrop-blur-xl sm:p-7 lg:min-h-[390px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,_rgba(202,240,126,0.55),_transparent_28%),radial-gradient(circle_at_84%_20%,_rgba(15,18,23,0.1),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.68),_rgba(255,255,255,0))]" />
              <div className="relative flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
                <div className="max-w-[18rem] rounded-[1.7rem] border border-white/14 bg-white/14 p-5 shadow-[0_18px_40px_rgba(64,46,31,0.08)] backdrop-blur-sm sm:self-start sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/64">
                    Trending nu
                  </p>
                  <p className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                    ADE Amsterdam
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Elektronische muziek, talks en creatieve nachten in oktober.
                  </p>
                </div>

                <div className="relative ml-auto flex h-[240px] w-[205px] items-end justify-center rounded-[2rem] bg-[#111318] shadow-[0_34px_70px_rgba(15,17,24,0.34)] sm:h-[280px] sm:w-[245px]">
                  <div className="absolute inset-x-5 top-5 h-[120px] rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
                  <svg
                    className="absolute left-7 right-7 top-9 h-[88px] text-[#efe2cf]"
                    viewBox="0 0 180 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 68h136"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M35 66V36l18-7 18 7v30M89 66V26l16-6 15 6v40M58 66V20l12 6v40M125 66V31l13-5 13 5v35"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M41 41h5M59 41h5M95 36h5M128 41h4M141 41h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute -bottom-4 -left-6 w-[180px] rotate-[-4deg] rounded-[1.5rem] bg-white/14 px-5 py-4 text-white shadow-[0_24px_36px_rgba(39,27,16,0.18)] backdrop-blur-xl sm:-left-9 sm:w-[196px]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8f2d0]">
                      Trending
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">
                      ADE Amsterdam
                    </p>
                    <p className="text-sm text-white/68">2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="jaarkalender-kalender" className="mt-6 scroll-mt-6 sm:mt-10 sm:scroll-mt-8">
          <JaarkalenderInteractiveCalendar />
        </section>

        <CalendarNewsletterSignupSection />
      </div>
    </main>
  );
}
