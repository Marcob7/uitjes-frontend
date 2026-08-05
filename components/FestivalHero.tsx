"use client";

import type { ReactNode } from "react";

import { WebGLLiquid } from "@/components/ui/webgl-liquid";

type FestivalHeroProps = {
  title: string;
  description: ReactNode;
  search: ReactNode;
  filters?: ReactNode;
  controls?: ReactNode;
};

export default function FestivalHero({
  title,
  description,
  search,
  filters,
  controls,
}: FestivalHeroProps) {
  return (
    <section className="mt-10 relative overflow-hidden rounded-[2.4rem] px-5 pb-40 pt-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:px-8 sm:pb-32 sm:pt-10 lg:px-11 lg:pb-36 lg:pt-12">
      <div className="absolute inset-0">
        <WebGLLiquid
          title=""
          subtitle=""
          description=""
          colorDeep="#170b14"
          colorMid="#7a1f3d"
          colorHighlight="#ffb84d"
          speed={0.58}
          flowStrength={0.78}
          grain={0.021}
          contrast={1.05}
          opacity={0.89}
          reveal={false}
          className="h-full w-full !min-h-0"
          style={{ minHeight: "100%", height: "100%", backgroundColor: "#170b14" }}
          overlayClassName="bg-gradient-to-br from-[#170b14]/94 via-[#2d0f1f]/82 to-[#5f1831]/72"
          glowClassName="bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(255,184,77,0.22),transparent_24%),linear-gradient(to_top,rgba(9,5,8,0.62),transparent_34%)]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] border border-white/14" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[42rem]">
        
          <h1 className="mt-6 max-w-[11ch] text-[clamp(3.2rem,8vw,5.7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-8 text-white/88 sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className="relative mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          {filters ? <div className="flex flex-wrap gap-3">{filters}</div> : null}
        </div>
        {controls ? (
          <div className="flex items-center gap-4 self-start text-white lg:self-end">
            {controls}
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-4 bottom-4 z-20 sm:inset-x-auto sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
        {search}
      </div>
    </section>
  );
}
