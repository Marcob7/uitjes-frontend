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
      const maxTravel = window.innerWidth < 640 ? 104 : 238;
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
      className={`relative h-[155vh] bg-white ${className}`}
      data-testid="animated-agenda-card"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5">
        <article
          className="relative aspect-[1.48/1] w-full max-w-[1000px] overflow-hidden rounded-[34px] shadow-[0_26px_90px_rgba(0,0,0,0.18)]"
        >
          <img
            src={imageSrc}
            alt={title}
            draggable={false}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div
            className="absolute inset-0 flex w-full flex-col items-center justify-center px-6 text-center will-change-transform"
            style={{
              transform: `translate3d(0, ${contentY}px, 0)`,
            }}
          >
            <h2
              aria-label={title}
              className="mx-auto max-w-[calc(100%-2rem)] whitespace-nowrap text-center text-[16px] font-black uppercase leading-[0.95] tracking-[0] text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.35)] sm:text-[22px] md:text-[31px] lg:text-[40px]"
              style={{
                transform: "translate3d(clamp(-42px, -3.5vw, -18px), 0, 0)",
              }}
            >
              Evenementen&nbsp;Kalender
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
    </section>
  );
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}
