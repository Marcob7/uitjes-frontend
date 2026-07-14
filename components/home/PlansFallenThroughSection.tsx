"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

type PlansFallenThroughSectionProps = {
  href?: string;
};

const reveal = [0.16, 1, 0.3, 1] as const;

export default function PlansFallenThroughSection({
  href = "/inspiratie",
}: PlansFallenThroughSectionProps) {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? { duration: 0 } : { duration: 0.78, ease: reveal };

  return (
    <section className="relative isolate overflow-hidden bg-[#e9f0e8] px-5 py-[clamp(5.5rem,11vw,9rem)] text-[#183328] sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f8f3e8]/75 to-transparent" />
        <div className="absolute -left-32 top-16 h-[29rem] w-[29rem] rounded-full bg-[#c7dfcd]/50 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-[38rem] w-[38rem] rounded-full bg-[#f0d9ad]/58 blur-3xl" />
        <svg viewBox="0 0 1440 500" className="absolute -bottom-24 left-0 h-auto w-full min-w-[900px] text-[#7ea484]/15" fill="none">
          <path d="M-16 364c170-148 301 53 479-69 173-119 267 79 458-22 173-91 274-13 535-146" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-10 403c166-137 301 58 469-60 176-124 280 71 470-32 191-104 303-1 526-157" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg viewBox="0 0 300 360" className="absolute -bottom-10 left-0 h-[22rem] w-auto text-[#789c7b]/20" fill="none">
          <path d="M32 384C46 213 98 136 173-4M94 318c-34-27-54-56-59-87 40 4 69 26 87 63M118 240c41-15 75-13 103 7-25 28-58 39-99 34M152 168c-17-36-19-70-5-103 30 25 41 57 32 95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(26rem,0.85fr)] lg:gap-20">
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={entrance}
            className="inline-flex rounded-full border border-[#759b7c]/30 bg-[#f8faf4]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.17em] text-[#355c40] shadow-[0_8px_24px_rgba(44,83,57,0.07)] backdrop-blur-md"
          >
            Plannen gewijzigd?
          </motion.p>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...entrance, delay: reduceMotion ? 0 : 0.08 }}
            className="mt-6 max-w-[10ch] font-serif text-[clamp(3.05rem,5.7vw,5.2rem)] font-medium leading-[0.93] tracking-[-0.06em] text-[#173226]"
          >
            Zijn je plannen in duigen gevallen?
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...entrance, delay: reduceMotion ? 0 : 0.16 }}
            className="mt-7 max-w-lg text-[1.05rem] leading-8 text-[#486454] sm:text-[1.125rem]"
          >
            Geen zorgen. Vertel ons waar je zin in hebt en ontdek binnen een paar tellen een passend uitje bij jou in de buurt.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...entrance, delay: reduceMotion ? 0 : 0.24 }}
            className="mt-9"
          >
            <Link
              href={href}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#204b35] px-7 py-3 text-[0.9rem] font-semibold tracking-[0.01em] text-[#fafbf5] shadow-[0_16px_30px_rgba(27,69,44,0.23)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#173d2a] hover:shadow-[0_22px_38px_rgba(27,69,44,0.27)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204b35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e9f0e8] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              Red mijn moment
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ ...entrance, delay: reduceMotion ? 0 : 0.12 }}
          className="relative mx-auto aspect-square w-full max-w-[31rem]"
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 2, 0, -1.5, 0], scale: [1, 1.035, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[4%]"
          >
            <svg viewBox="0 0 500 500" className="h-full w-full overflow-visible">
              <defs>
                <radialGradient id="petalOuter" cx="0" cy="0" r="1" gradientTransform="translate(250 165) rotate(90) scale(238 168)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f9f6e6" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#a7cba9" stopOpacity="0.48" />
                </radialGradient>
                <radialGradient id="petalInner" cx="0" cy="0" r="1" gradientTransform="translate(250 185) rotate(90) scale(182 126)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fffdf1" stopOpacity="0.98" />
                  <stop offset="1" stopColor="#d9e9c5" stopOpacity="0.65" />
                </radialGradient>
                <radialGradient id="flowerGlow" cx="0" cy="0" r="1" gradientTransform="translate(250 250) rotate(90) scale(116)">
                  <stop stopColor="#fffdf1" />
                  <stop offset="0.53" stopColor="#f7e3b9" stopOpacity="0.73" />
                  <stop offset="1" stopColor="#e6d5a8" stopOpacity="0" />
                </radialGradient>
                <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
                  <feOffset dy="15" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g filter="url(#softShadow)">
                <g fill="url(#petalOuter)" stroke="rgba(255,255,255,0.42)" strokeWidth="2">
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(45 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(90 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(135 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(180 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(225 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(270 250 250)" />
                  <path d="M250 250C171 179 175 74 250 34c75 40 79 145 0 216Z" transform="rotate(315 250 250)" />
                </g>
                <g fill="url(#petalInner)" stroke="rgba(255,255,255,0.65)" strokeWidth="2">
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" />
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" transform="rotate(60 250 250)" />
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" transform="rotate(120 250 250)" />
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" transform="rotate(180 250 250)" />
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" transform="rotate(240 250 250)" />
                  <path d="M250 250c-54-49-51-117 0-146 51 29 54 97 0 146Z" transform="rotate(300 250 250)" />
                </g>
              </g>
              <circle cx="250" cy="250" r="123" fill="url(#flowerGlow)" />
              <circle cx="250" cy="250" r="48" fill="#fff9e9" fillOpacity="0.82" />
              <circle cx="232" cy="232" r="13" fill="white" fillOpacity="0.58" />
              <path d="M196 182c25-20 55-29 86-26M321 278c-10 28-31 52-60 68" stroke="white" strokeOpacity="0.62" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.span animate={reduceMotion ? undefined : { opacity: [0.38, 1, 0.38], y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[11%] top-[26%] h-3.5 w-3.5 rounded-full bg-[#fff9e7] shadow-[0_0_16px_rgba(255,250,222,0.95)]" />
          <motion.span animate={reduceMotion ? undefined : { opacity: [0.25, 0.85, 0.25], y: [0, 6, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute right-[10%] top-[18%] h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
          <span className="absolute bottom-[14%] right-[9%] h-3 w-3 rounded-full border border-white/55 bg-[#e8c987]/30" />
        </motion.div>
      </div>
    </section>
  );
}
