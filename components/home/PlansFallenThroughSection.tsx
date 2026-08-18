"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type PlansFallenThroughSectionProps = {
  href?: string;
};

const MOSAIC_TILE_IDS = ["tan", "slate", "blush", "blueGrey", "orange", "red"] as const;

type MosaicTileId = (typeof MOSAIC_TILE_IDS)[number];

type MosaicTile = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
};

type MosaicPhase = {
  hold: number;
  transition: number;
  tiles: Record<MosaicTileId, MosaicTile>;
};

const MOSAIC_COLORS: Record<MosaicTileId, string> = {
  tan: "#E2AF77",
  slate: "#4E586B",
  blush: "#ECCABA",
  blueGrey: "#AEBBC7",
  orange: "#E89968",
  red: "#D42D40",
};

const tile = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 0,
  opacity = 1,
): MosaicTile => ({ x, y, width, height, radius, opacity });

const hiddenTile = (): MosaicTile => tile(70, 50, 0, 0, 0, 0);

const roundedFourTiles = (): MosaicPhase["tiles"] => ({
  tan: tile(33, 14, 35, 35, 7),
  slate: tile(71, 14, 35, 35, 7),
  blush: tile(33, 52, 35, 35, 7),
  blueGrey: tile(71, 52, 35, 35, 7),
  orange: hiddenTile(),
  red: hiddenTile(),
});

const sharpFourTiles = (): MosaicPhase["tiles"] => ({
  // Adjacent tiles intentionally overlap by one viewBox unit. This prevents
  // anti-aliased hairlines from appearing between the sharp square blocks.
  tan: tile(27, 8, 44, 44),
  slate: tile(70, 8, 44, 44),
  blush: tile(27, 51, 44, 44),
  blueGrey: tile(70, 51, 44, 44),
  orange: hiddenTile(),
  red: hiddenTile(),
});

const singleTanTiles = (): MosaicPhase["tiles"] => ({
  tan: tile(28, 9, 84, 83, 8),
  slate: hiddenTile(),
  blush: hiddenTile(),
  blueGrey: hiddenTile(),
  orange: hiddenTile(),
  red: hiddenTile(),
});

const scatteredTiles = (radius: number): MosaicPhase["tiles"] => ({
  tan: tile(0, 28, 31, 31, radius),
  slate: tile(35, 0, 59, 59, radius),
  blush: tile(98, 8, 28, 27, radius),
  blueGrey: tile(24, 63, 37, 37, radius),
  orange: tile(65, 63, 29, 29, radius),
  red: tile(98, 40, 42, 41, radius),
});

const sharpSixTiles = (): MosaicPhase["tiles"] => ({
  tan: tile(4, 5, 45, 45),
  slate: tile(48, 5, 45, 45),
  blush: tile(92, 5, 45, 45),
  blueGrey: tile(4, 49, 45, 45),
  orange: tile(48, 49, 45, 45),
  red: tile(92, 49, 45, 45),
});

const roundedSixTiles = (): MosaicPhase["tiles"] => ({
  tan: tile(3, 6, 43, 42, 7),
  slate: tile(49, 6, 43, 42, 7),
  blush: tile(95, 6, 43, 42, 7),
  blueGrey: tile(3, 52, 43, 42, 7),
  orange: tile(49, 52, 43, 42, 7),
  red: tile(95, 52, 43, 42, 7),
});

const rowTiles = (radius: number): MosaicPhase["tiles"] => ({
  tan: tile(0, 38, 25, 25, radius),
  slate: tile(28, 38, 25, 25, radius),
  blush: tile(57, 38, 25, 25, radius),
  blueGrey: tile(86, 38, 25, 25, radius),
  orange: tile(115, 38, 25, 25, radius),
  red: hiddenTile(),
});

// This retains the reference video's choreography, but interpolates each
// tableau so the movement feels like one calm, continuous composition.
const MOSAIC_PHASES: readonly MosaicPhase[] = [
  { hold: 350, transition: 0.72, tiles: roundedFourTiles() },
  { hold: 1150, transition: 1.25, tiles: sharpFourTiles() },
  { hold: 750, transition: 1.55, tiles: singleTanTiles() },
  { hold: 1000, transition: 1.25, tiles: scatteredTiles(8) },
  { hold: 650, transition: 1.1, tiles: scatteredTiles(50) },
  { hold: 1000, transition: 1.1, tiles: sharpSixTiles() },
  { hold: 1000, transition: 1.1, tiles: roundedSixTiles() },
  { hold: 800, transition: 1.1, tiles: rowTiles(6) },
  { hold: 800, transition: 1.1, tiles: rowTiles(50) },
  { hold: 1000, transition: 1.1, tiles: roundedFourTiles() },
  { hold: 1200, transition: 1.25, tiles: sharpFourTiles() },
];

const MOSAIC_LOOP_START_INDEX = 2;
const STATIC_MOSAIC_PHASE_INDEX = 3;
// A subtle overall speed-up keeps the reference choreography calm while
// making each full cycle feel a little more responsive.
const MOSAIC_PLAYBACK_RATE = 1.12;

export default function PlansFallenThroughSection({
  href = "/inspiratie",
}: PlansFallenThroughSectionProps) {
  const reduceMotion = useReducedMotion();
  const mosaicRef = useRef<SVGSVGElement | null>(null);
  const isMosaicInView = useInView(mosaicRef, { amount: 0.25 });
  const [mosaicPhaseIndex, setMosaicPhaseIndex] = useState(0);
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };
  const activeMosaicPhase =
    MOSAIC_PHASES[reduceMotion ? STATIC_MOSAIC_PHASE_INDEX : mosaicPhaseIndex] ??
    MOSAIC_PHASES[0];
  const mosaicTransitionDuration = !reduceMotion && isMosaicInView
    ? activeMosaicPhase.transition / MOSAIC_PLAYBACK_RATE
    : 0;

  useEffect(() => {
    if (reduceMotion || !isMosaicInView) return;

    const timeout = window.setTimeout(() => {
      setMosaicPhaseIndex((currentPhaseIndex) =>
        currentPhaseIndex >= MOSAIC_PHASES.length - 1
          ? MOSAIC_LOOP_START_INDEX
          : currentPhaseIndex + 1,
      );
    }, (activeMosaicPhase.hold + activeMosaicPhase.transition * 1000) / MOSAIC_PLAYBACK_RATE);

    return () => window.clearTimeout(timeout);
  }, [
    activeMosaicPhase.hold,
    activeMosaicPhase.transition,
    isMosaicInView,
    mosaicPhaseIndex,
    reduceMotion,
  ]);

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f7f1] px-5 py-[clamp(5rem,10vw,9.5rem)] text-[#183328] sm:px-8 lg:px-12">
      <div className="relative mx-auto grid w-full max-w-[78rem] items-center gap-12 md:gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(23rem,0.78fr)] lg:gap-[clamp(4rem,8vw,8.5rem)]">
        <figure
          aria-hidden="true"
          className="relative mx-auto min-h-[19rem] w-full max-w-[42rem] sm:min-h-[27rem] md:min-h-[33rem] lg:min-h-[35rem] lg:max-w-none"
        >
          <motion.svg
            ref={mosaicRef}
            viewBox="0 0 140 100"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {MOSAIC_TILE_IDS.map((tileId) => {
              const tileState = activeMosaicPhase.tiles[tileId];

              return (
                <motion.rect
                  key={tileId}
                  fill={MOSAIC_COLORS[tileId]}
                  initial={false}
                  animate={{
                    x: tileState.x,
                    y: tileState.y,
                    width: tileState.width,
                    height: tileState.height,
                    rx: tileState.radius,
                    ry: tileState.radius,
                    opacity: tileState.opacity,
                  }}
                  transition={{
                    duration: mosaicTransitionDuration,
                    // Leave the outgoing tableau immediately, then settle softly
                    // into the next composition instead of lingering at the start.
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  shapeRendering="geometricPrecision"
                />
              );
            })}
          </motion.svg>

        </figure>

        <div className="relative z-20 max-w-[34rem] lg:justify-self-end">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
            className="m-0 max-w-[12ch] text-[clamp(2.8rem,4.7vw,4.85rem)] font-medium leading-[0.96] tracking-[-0.055em] text-[#183328]"
          >
            Zijn je plannen in duigen gevallen?
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.16 }}
            className="mt-6 max-w-[31rem] text-[1.02rem] leading-8 text-[#466153] sm:mt-7 sm:text-[1.125rem]"
          >
            Geen stress. We helpen je snel aan een nieuw idee dat wél past bij jouw moment.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.24 }}
            className="mt-9"
          >
            <Link
              href={href}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#224b34] px-7 py-3 text-[0.9rem] font-semibold tracking-[0.01em] text-[#f9fbf6] shadow-[0_14px_28px_rgba(28,69,45,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#183d2a] hover:shadow-[0_18px_34px_rgba(28,69,45,0.23)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#224b34] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f1] active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              Help mij
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
