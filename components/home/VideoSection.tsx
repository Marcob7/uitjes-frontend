"use client";

import { type SyntheticEvent, useCallback } from "react";
import { AppButton } from "@/components/ui/app";
import SearchBar from "./SearchBar";

const LOOP_AT_SECONDS = 11.5;

export default function VideoSection() {
  const handleVideoTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;

      if (video.currentTime >= LOOP_AT_SECONDS) {
        video.currentTime = 0;
        void video.play();
      }
    },
    [],
  );

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-[#e2e3df] text-[#10231f] sm:min-h-[700px] lg:min-h-[760px]">
      <video
        className="absolute bottom-[-1.5rem] right-[-48vw] z-0 h-auto w-[136vw] max-w-none object-contain mix-blend-darken brightness-[1.14] contrast-[1.06] saturate-[1.08] sm:bottom-[-2.5rem] sm:right-[-22vw] sm:w-[98vw] md:right-[-14vw] md:w-[84vw] lg:bottom-[-4rem] lg:right-[calc((100vw-min(100vw,80rem))/2+1.25rem)] lg:w-[66vw] lg:max-w-[900px] xl:w-[60vw]"
        src="/videos/header_background_video.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        aria-hidden="true"
        onTimeUpdate={handleVideoTimeUpdate}
      />

      <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-7xl items-start px-5 pb-24 pt-24 sm:min-h-[700px] sm:px-8 sm:pt-28 lg:min-h-[760px] lg:px-5 lg:pt-32">
        <div className="w-full max-w-[46rem] lg:ml-[19.5rem] xl:ml-[19.5rem]">
          <h1 className="max-w-[11ch] text-[clamp(3.25rem,8vw,7.25rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#10231f] drop-shadow-[0_12px_28px_rgba(255,255,255,0.38)]">
            Vind je volgende
            <br />
            geluksmoment.
          </h1>

          <div className="mt-9 w-full max-w-[42rem]">
            <SearchBar
              buttonLabel="Zoeken"
              rootClassName="mx-0 max-w-none"
              formClassName="border border-[#10231f]/12 bg-[#f7f4eb]/95 shadow-[0_26px_70px_rgba(42,55,50,0.2)] backdrop-blur"
              inputWrapperClassName="bg-white/54"
              iconClassName="text-[#33433d]/60"
              inputClassName="text-[#15231f] placeholder:text-[#58655f]"
              suggestionsPanelClassName="border-[#10231f]/10 bg-[#f7f4eb]/98 shadow-[0_26px_70px_rgba(42,55,50,0.2)] backdrop-blur-xl"
              suggestionItemClassName="text-[#17241f] hover:bg-[#e6eadb]"
              submitButtonClassName="border-[#10231f] bg-[#10231f] text-[#f7f4eb] shadow-[0_18px_38px_rgba(16,35,31,0.24)] hover:bg-[#22342d] focus-visible:outline-[#10231f]"
            />
          </div>

          <AppButton
            href="/inspiratie"
            variant="secondary"
            size="lg"
            className="mt-4 min-h-[54px] rounded-2xl border-[#10231f]/16 bg-[#f7f4eb]/74 px-6 text-[#10231f] shadow-[0_18px_42px_rgba(42,55,50,0.16)] backdrop-blur hover:bg-[#f7f4eb]/92 sm:rounded-full"
          >
            Ik wil eerst inspiratie
          </AppButton>
        </div>
      </div>
    </section>
  );
}
