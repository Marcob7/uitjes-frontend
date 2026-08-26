"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getSearchRoute, normalizeSearchQuery } from "@/lib/searchIntent";

const VIDEO_SOURCE = "/videos/netherlands-forest-river-hero.web.mp4";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      className="h-[18px] w-[18px]"
    >
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export default function HomeVideoSection() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const route = getSearchRoute(normalizeSearchQuery(query));

    if (!route) {
      inputRef.current?.focus();
      return;
    }

    router.push(route);
  }

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#10282a] text-white"
      data-navbar-contrast="on-dark"
      aria-labelledby="home-video-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[#0c2022]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 26%, rgba(73, 128, 80, 0.72), transparent 37%), linear-gradient(126deg, #153b2a 0%, #0c2026 50%, #25573b 100%)",
        }}
      />
      <video
        className="absolute inset-0 -z-20 h-full w-full object-[35%_center] object-cover brightness-[0.8] saturate-[1.04] motion-reduce:hidden sm:object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={VIDEO_SOURCE} type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,10,15,0.30)_0%,rgba(4,15,24,0.42)_38%,rgba(3,13,18,0.53)_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[53rem] -translate-y-3 flex-col items-center px-5 pb-12 pt-28 text-center sm:px-8 sm:pt-32">
        <h1
          id="home-video-heading"
          style={{ maxInlineSize: "none" }}
          className="m-0 max-w-none !text-[clamp(3.15rem,5.2vw,4.125rem)] font-medium !leading-[0.985] tracking-[-0.058em] text-white [text-shadow:0_3px_24px_rgba(0,0,0,0.22)]"
        >
          <span className="block">Vind jouw volgende</span>
          <span className="block">avontuur in Nederland.</span>
        </h1>

        <p className="mt-5 max-w-[35rem] text-[15px] leading-[1.55] tracking-[-0.01em] text-white/78 sm:mt-[22px] sm:text-[15.5px]">
          Vind activiteiten, festivals en bijzondere plekken die passen bij jouw
          moment — dichtbij of net daarbuiten.
        </p>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="mt-7 flex h-[58px] w-full max-w-[36.125rem] items-center rounded-full bg-[#f0f1f3] p-2 pl-5 text-[#171b1c] shadow-[0_16px_42px_rgba(0,0,0,0.22)] sm:mt-[29px] sm:pl-6"
        >
          <SearchIcon />
          <label htmlFor="home-video-search" className="sr-only">
            Zoek een locatie, festival of activiteit
          </label>
          <input
            ref={inputRef}
            id="home-video-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek op stad, festival of activiteit"
            autoComplete="off"
            enterKeyHint="search"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-left text-[14px] font-medium tracking-[-0.015em] outline-none placeholder:text-[#4c5254]/72 sm:text-[15px]"
          />
          <button
            type="submit"
            className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-full bg-[#111516] px-[19px] text-[13px] font-semibold text-white outline-none transition duration-200 hover:bg-[#252c2d] focus-visible:ring-2 focus-visible:ring-[#111516] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0f1f3] active:scale-[0.98] sm:px-[21px]"
          >
            Zoek nu
          </button>
        </form>
      </div>
    </section>
  );
}
