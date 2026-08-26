"use client";

import Link from "next/link";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { motion, useReducedMotion } from "motion/react";

type ShowcaseCity = {
  name: string;
  slug: string;
  logo: string;
  logoClassName: string;
  preserveSourceColors?: boolean;
};

const showcaseCities: ShowcaseCity[] = [
  {
    name: "Apeldoorn",
    slug: "apeldoorn",
    logo: "/municipalities/apeldoorn.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Deventer",
    slug: "deventer",
    logo: "/municipalities/deventer.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Amsterdam",
    slug: "amsterdam",
    logo: "/municipalities/amsterdam.svg",
    logoClassName: "h-[5.4rem] w-[4.7rem]",
    preserveSourceColors: true,
  },
  {
    name: "Leeuwarden",
    slug: "leeuwarden",
    logo: "/municipalities/leeuwarden.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Rotterdam",
    slug: "rotterdam",
    logo: "/municipalities/rotterdam.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Eindhoven",
    slug: "eindhoven",
    logo: "/municipalities/eindhoven.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Enschede",
    slug: "enschede",
    logo: "/municipalities/enschede.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Delft",
    slug: "delft",
    logo: "/municipalities/delft.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
  {
    name: "Breda",
    slug: "breda",
    logo: "/municipalities/breda.svg",
    logoClassName: "h-[5.4rem] w-[10.5rem]",
  },
];

const carouselTransition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

function MunicipalityLogo({ city }: { city: ShowcaseCity }) {
  if (city.preserveSourceColors) {
    return (
      <span
        aria-hidden="true"
        className={`block bg-contain bg-center bg-no-repeat transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] ${city.logoClassName}`}
        style={{ backgroundImage: `url(${city.logo})` }}
      />
    );
  }

  const maskStyle = {
    WebkitMaskImage: `url(${city.logo})`,
    maskImage: `url(${city.logo})`,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={`block bg-[#6a2a2a] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] ${city.logoClassName}`}
      style={maskStyle}
    />
  );
}

export default function HomeCitiesShowcaseSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scrollCarousel = useCallback(
    (direction: "previous" | "next") => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const firstCard = carousel.querySelector<HTMLElement>("[data-city-card]");
      const gap = Number.parseFloat(getComputedStyle(carousel).gap) || 0;
      const step = (firstCard?.offsetWidth || carousel.clientWidth * 0.8) + gap;
      const behavior = reduceMotion ? "auto" : "smooth";
      const nearStart = carousel.scrollLeft <= 2;
      const nearEnd = carousel.scrollLeft >= maxScroll - 2;

      if (direction === "previous" && nearStart) {
        carousel.scrollTo({ left: maxScroll, behavior });
        return;
      }

      if (direction === "next" && nearEnd) {
        carousel.scrollTo({ left: 0, behavior });
        return;
      }

      carousel.scrollBy({
        left: direction === "next" ? step : -step,
        behavior,
      });
    },
    [reduceMotion]
  );

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const stopHorizontalWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.shiftKey) {
        event.preventDefault();
        carousel.scrollLeft += event.deltaY;
      }
    };

    carousel.addEventListener("wheel", stopHorizontalWheel, { passive: false });
    return () => carousel.removeEventListener("wheel", stopHorizontalWheel);
  }, []);

  return (
    <section
      aria-labelledby="cities-showcase-title"
      className="overflow-hidden bg-[#fff] pb-[clamp(4rem,7vw,7.5rem)] pt-[clamp(2.5rem,4vw,4rem)] text-[#6a2a2a]"
      data-navbar-contrast="on-light"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={reduceMotion ? { duration: 0 } : carouselTransition}
        className="mx-auto w-full max-w-[1132px] px-4"
      >
        <div className="mb-14 lg:mb-16">
          <h2 id="cities-showcase-title" className="sr-only">
            Steden en gemeenten ontdekken
          </h2>
          <p className="text-[0.8rem] font-semibold tracking-[-0.018em] text-[#6a2a2a] sm:text-sm">
            Ontdek uitjes in samenwerking met gemeentes door heel Nederland
          </p>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <div className="relative ml-[max(1rem,calc((100vw-1100px)/2))]">
            <span
              aria-hidden="true"
              className="absolute -top-8 left-10 z-10 h-12 w-px bg-[#6a2a2a]/75"
            />

            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-[26px]"
              aria-label="Steden en gemeenten"
            >
              {showcaseCities.map((city, index) => (
                <motion.div
                  key={city.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    ...carouselTransition,
                    delay: reduceMotion ? 0 : Math.min(index * 0.055, 0.32),
                  }}
                  data-city-card
                  className="flex-none snap-start basis-[84vw] sm:basis-[65vw] lg:basis-[460px]"
                >
                  <Link
                    href={`/ontdek?city=${city.slug}`}
                    aria-label={`Ontdek uitjes in ${city.name}`}
                    className="group flex aspect-[3/2] w-full items-center justify-center rounded-[0.65rem] bg-[#F3F0E9] px-6 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#ebe8e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a2a2a] focus-visible:ring-offset-4 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.99]"
                  >
                    <MunicipalityLogo city={city} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-[1.1rem] sm:mt-8">
          <button
            type="button"
            onClick={() => scrollCarousel("previous")}
            className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.6rem] border border-[#ece8e5] bg-white text-[#5a4c47] transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#6a2a2a] hover:text-[#6a2a2a] hover:shadow-[0_8px_18px_rgba(100,48,43,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a2a2a] focus-visible:ring-offset-4 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.96]"
            aria-label="Toon vorige steden"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="m14.5 6.5-5.25 5.5 5.25 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.6rem] border border-[#ece8e5] bg-white text-[#5a4c47] transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#6a2a2a] hover:text-[#6a2a2a] hover:shadow-[0_8px_18px_rgba(100,48,43,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a2a2a] focus-visible:ring-offset-4 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.96]"
            aria-label="Toon volgende steden"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="m9.5 6.5 5.25 5.5-5.25 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
