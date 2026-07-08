"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AgendaSectionProps = {
  imageSrc?: string;
  title?: string;
  buttonText?: string;
  className?: string;
};

const existingAgendaImage =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&fm=webp&w=1600&q=60";

export default function AgendaSection({
  imageSrc = existingAgendaImage,
  title = "Evenementen Kalender",
  buttonText = "Bekijk agenda",
  className = "",
}: AgendaSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [contentTravel, setContentTravel] = useState(136);

  useEffect(() => {
    const updateContentTravel = () => {
      if (window.innerWidth < 640) {
        setContentTravel(0);
        return;
      }

      const maxTravel = 238;
      setContentTravel(
        Math.min(Math.max(window.innerHeight * 0.27, 80), maxTravel),
      );
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollDistance = Math.max(rect.height - window.innerHeight, 1);
      const currentProgress = Math.min(
        Math.max(-rect.top / scrollDistance, 0),
        1,
      );

      setProgress(currentProgress);
    };

    updateContentTravel();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateContentTravel);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateContentTravel);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const contentY = lerp(-contentTravel, contentTravel, progress);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-x-clip bg-white px-3 py-5 sm:h-[155vh] sm:px-0 sm:py-0 ${className}`}
      data-testid="animated-agenda-card"
    >
      <div className="flex min-h-[calc(100vh-6rem)] min-h-[calc(100dvh-6rem)] w-full items-center justify-center overflow-hidden sm:sticky sm:top-0 sm:h-screen sm:min-h-0 sm:px-6 lg:px-8">
        <div className="mx-auto w-full sm:w-[88vw] lg:w-[84vw] xl:w-[80vw] 2xl:w-[74vw] sm:max-w-[1500px]">
          <article className="relative min-h-[calc(100vh-6rem)] min-h-[calc(100dvh-6rem)] w-full overflow-hidden rounded-[2rem] shadow-[0_26px_90px_rgba(0,0,0,0.18)] sm:h-[70vh] sm:min-h-0 sm:rounded-[34px] lg:h-[68vh] xl:h-[66vh]">
            <img
              src={imageSrc}
              alt={title}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover sm:static"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70 sm:bg-black/25" />

            <div
              className="absolute inset-0 flex w-full flex-col items-center justify-center px-6 text-center will-change-transform"
              style={{
                transform: `translate3d(0, ${contentY}px, 0)`,
              }}
            >
              <h2
                aria-label={title}
                className="mx-auto max-w-[min(100%,22rem)] text-center text-[clamp(2.65rem,13vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[0] text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.35)] sm:max-w-none sm:whitespace-nowrap sm:text-[22px] md:text-[31px] lg:text-[40px]"
              >
                <span className="sm:hidden">Evenementen Kalender</span>
                <span className="hidden sm:inline">Evenementen&nbsp;Kalender</span>
              </h2>

              <Link
                href="/jaarkalender"
                className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(37,99,235,0.38)] transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:px-8 md:py-4"
              >
                {buttonText}
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}
