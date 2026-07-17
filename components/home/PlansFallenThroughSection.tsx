"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type PlansFallenThroughSectionProps = {
  href?: string;
};

export default function PlansFallenThroughSection({
  href = "/inspiratie",
}: PlansFallenThroughSectionProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section className="relative isolate z-40 overflow-visible bg-[#edf5ee] px-5 py-[clamp(4.5rem,10vw,8.5rem)] text-[#183328] sm:px-8 lg:px-12">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-[#d9ead9]/75 blur-3xl" />
        <div className="absolute -right-24 bottom-[-9rem] h-[32rem] w-[32rem] rounded-full bg-[#f5dfbb]/45 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(24rem,0.8fr)] lg:gap-20">
        <div className="relative z-10 max-w-xl">
       

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
            className="mt-6 font-serif text-[clamp(2.7rem,5.7vw,5.15rem)] font-medium leading-[0.95] tracking-[-0.055em] text-[#183328]"
          >
            Zijn je plannen in duigen gevallen?
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.16 }}
            className="mt-7 max-w-lg text-[1.05rem] leading-8 text-[#466153] sm:text-[1.125rem]"
          >
            Geen zorgen. Vertel ons waar je zin in hebt en ontdek binnen een paar tellen een passend uitje bij jou in de buurt.
          </motion.p>

          <div className="relative mt-9 inline-block w-full sm:w-auto">
            <Image
              src="/animations/flyer-bird.gif?v=5"
              width={832}
              height={1104}
              priority
              unoptimized
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-64 right-[-1rem] z-10 block w-80 max-w-none select-none sm:left-[calc(100%-4rem)] sm:right-auto sm:w-[32rem]"
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...transition, delay: reduceMotion ? 0 : 0.24 }}
            >
              <Link
                href={href}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#224b34] px-7 py-3 text-[0.85rem] font-semibold tracking-[0.01em] text-[#f9fbf6] shadow-[0_16px_30px_rgba(28,69,45,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#183d2a] hover:shadow-[0_20px_36px_rgba(28,69,45,0.27)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#224b34] focus-visible:ring-offset-4 focus-visible:ring-offset-[#edf5ee] active:translate-y-0 active:scale-[0.98] sm:w-auto"
              >
                Red mijn moment
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}
          className="relative mx-auto aspect-square w-full max-w-[30rem]"
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, 4, 0, -3, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[6%] rounded-[44%_56%_58%_42%/42%_44%_56%_58%] bg-[#c6dfc4]/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.48),0_28px_70px_rgba(55,101,67,0.16)]"
          />
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, -7, 0, 5, 0], y: [0, -5, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[15%] rounded-[58%_42%_40%_60%/50%_60%_40%_50%] border border-white/65 bg-[#edf4df]/75 shadow-[inset_0_0_36px_rgba(255,255,255,0.7),0_16px_34px_rgba(81,124,79,0.12)] backdrop-blur-sm"
          />
          <div className="absolute inset-[31%] rounded-[48%_52%_60%_40%/56%_42%_58%_44%] bg-[#fdf7e9] shadow-[inset_0_0_22px_rgba(255,255,255,0.9),0_0_42px_rgba(253,240,199,0.8)]" />
          <div className="absolute left-[12%] top-[19%] h-5 w-5 rounded-full bg-white/65 blur-[2px]" />
          <div className="absolute bottom-[18%] right-[14%] h-3 w-3 rounded-full bg-[#fff9e8]/90 blur-[1px]" />
          <div className="absolute right-[19%] top-[12%] h-2.5 w-2.5 rounded-full bg-white/80" />
        </motion.div>
      </div>
    </section>
  );
}
