"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CSSProperties,
  memo,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getSearchRoute, normalizeSearchQuery } from "@/lib/searchIntent";
import DateSearchInput from "./DateSearchInput";

type HomeSceneSectionProps = {
  description?: string;
  playKey?: string | number;
  className?: string;
};

type ScenePhase = 0 | 1 | 2;

export type HomeScene = "morning" | "afternoon" | "evening";

export function getSceneForHour(hour: number): HomeScene {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}

function getScenePhaseForHour(hour: number): ScenePhase {
  const scene = getSceneForHour(hour);
  return scene === "morning" ? 0 : scene === "afternoon" ? 1 : 2;
}

export function getMillisecondsUntilNextSceneBoundary(now: Date): number {
  const nextBoundary = new Date(now);
  const hour = now.getHours();

  if (hour < 5) {
    nextBoundary.setHours(5, 0, 0, 0);
  } else if (hour < 12) {
    nextBoundary.setHours(12, 0, 0, 0);
  } else if (hour < 18) {
    nextBoundary.setHours(18, 0, 0, 0);
  } else {
    nextBoundary.setDate(now.getDate() + 1);
    nextBoundary.setHours(5, 0, 0, 0);
  }

  return nextBoundary.getTime() - now.getTime();
}

type SceneTheme = {
  label: string;
  ariaLabel: string;
  skyFrom: string;
  skyVia: string;
  skyTo: string;
  ink: string;
  mutedInk: string;
  glow: string;
  accent: string;
};

const PHASES: SceneTheme[] = [
  { label: "Ochtend", ariaLabel: "Toon de ochtendscène", skyFrom: "#f8d6ba", skyVia: "#f4c6b4", skyTo: "#9cc7cf", ink: "#18343a", mutedInk: "rgba(24, 52, 58, 0.76)", glow: "rgba(255, 237, 186, 0.68)", accent: "#f07b5d" },
  { label: "Overdag", ariaLabel: "Toon de dagscène", skyFrom: "#a9d6dc", skyVia: "#79bcc8", skyTo: "#4d8796", ink: "#102f36", mutedInk: "rgba(16, 47, 54, 0.76)", glow: "rgba(255, 244, 191, 0.56)", accent: "#1f6f78" },
  { label: "Avond", ariaLabel: "Toon de avondscène", skyFrom: "#152a46", skyVia: "#243454", skyTo: "#101827", ink: "#f6f3ea", mutedInk: "rgba(246, 243, 234, 0.74)", glow: "rgba(112, 137, 191, 0.32)", accent: "#f0b27a" },
];

const SCENE_CONTROL_ITEMS = [
  { label: "Ochtend", ariaLabel: "Toon ochtendscenery", emoji: "🌅" },
  { label: "Middag", ariaLabel: "Toon middagscenery", emoji: "☀️" },
  { label: "Avond", ariaLabel: "Toon avondscenery", emoji: "🌙" },
] as const;

const NEUTRAL_THEME: SceneTheme = {
  label: "",
  ariaLabel: "",
  skyFrom: "#d6d2c8",
  skyVia: "#b8c5c3",
  skyTo: "#71858a",
  ink: "#18343a",
  mutedInk: "rgba(24, 52, 58, 0.76)",
  glow: "transparent",
  accent: "#1f6f78",
};

const STAR_POSITIONS = [[8, 14], [16, 23], [27, 12], [39, 27], [51, 10], [60, 20], [71, 12], [83, 25], [92, 14], [13, 39], [31, 36], [47, 43], [67, 36], [79, 47], [89, 39]] as const;
const BIRDS = [{ left: "61%", top: "30%", scale: 0.75, delay: 0 }, { left: "68%", top: "24%", scale: 0.55, delay: 0.18 }, { left: "73%", top: "34%", scale: 0.65, delay: 0.36 }] as const;
const HOME_CITIES = ["Amsterdam", "Apeldoorn", "Haarlem", "Den Haag", "Zwolle"];
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function Bird({ className = "" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 42 18" className={className} fill="none"><path d="M2 13c5-6 10-7 18-1 8-6 13-5 20 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
}

function Cloud({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return <svg aria-hidden="true" viewBox="0 0 180 70" className={className} style={{ opacity }} fill="none"><path d="M28 54c-12 0-22-8-22-18s10-18 23-18c5-11 16-18 30-18 17 0 30 10 34 23 5-4 12-6 19-6 16 0 29 10 29 23 0 2 0 4-1 6 4-2 9-3 14-3 11 0 20 5 20 11H28Z" fill="currentColor" /></svg>;
}

type ScenePhaseControlProps = {
  phase: ScenePhase | null;
  onSelect: (phase: ScenePhase) => void;
};

function CompactScenePhaseControl({ phase, onSelect }: ScenePhaseControlProps) {
  return <div className="flex max-w-full items-center gap-0.5 rounded-full border border-white/35 bg-white/30 p-1 shadow-sm shadow-black/10" role="group" aria-label="Kies een moment van de dag">
    {SCENE_CONTROL_ITEMS.map((item, index) => {
      const selected = phase === index;
      return <button key={item.label} type="button" title={item.label} aria-pressed={selected} aria-label={item.ariaLabel} onClick={() => onSelect(index as ScenePhase)} className={cx("relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[transform,background-color,box-shadow,opacity] duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95", selected ? "bg-white/42 opacity-100 shadow-sm shadow-black/15" : "bg-transparent opacity-75 hover:bg-white/20 hover:opacity-100")}>
        <span aria-hidden="true" className="text-[17px] leading-none">{item.emoji}</span>
        {selected && <span aria-hidden="true" className="absolute bottom-1.5 h-1 w-1 rounded-full bg-current shadow-[0_0_0_1px_rgba(255,255,255,0.72)]" />}
      </button>;
    })}
  </div>;
}

const HomeWordmark = memo(function HomeWordmark({ titleId, prefersReducedMotion }: { titleId: string; prefersReducedMotion: boolean | null }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(1);
  const currentCity = HOME_CITIES[wordIndex] ?? "";
  const shownCity = currentCity.slice(0, visibleLetters);

  useEffect(() => {
    if (!currentCity) return;
    const timeout = setTimeout(() => {
      if (visibleLetters < currentCity.length) {
        setVisibleLetters((previous) => previous + 1);
      } else {
        setVisibleLetters(1);
        setWordIndex((previous) => (previous + 1) % HOME_CITIES.length);
      }
    }, visibleLetters < currentCity.length ? 50 : 800);
    return () => clearTimeout(timeout);
  }, [currentCity, visibleLetters]);

  return <motion.h1 id={titleId} aria-label={`Let's get this party in ${currentCity} started.`} className="clubbi-animated-word m-0 text-center" style={{ width: "100%", maxWidth: "none", color: "#185650", fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 6.4vw, 6.25rem)", fontWeight: 500, lineHeight: 0.94, letterSpacing: "-0.055em", textTransform: "none", whiteSpace: "normal", textShadow: "0 1px 0 rgba(255,255,255,0.24), 0 8px 24px rgba(255,255,255,0.16)" }} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.05 }}>
    <span className="block">Let's get this party in</span>
    <span className="block"><span>{shownCity}</span> started.</span>
  </motion.h1>;
});

export default function HomeSceneSection({
  description = "Van verborgen lokale plekken tot festivals, restaurants en spontane plannen. Ontdek activiteiten die passen bij jouw stemming, locatie en moment.", playKey, className,
}: HomeSceneSectionProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<ScenePhase | null>(null);
  const [hasManualSelection, setHasManualSelection] = useState(false);
  const hasManualSelectionRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const scrub = useMotionValue(0);
  const celestialX = useMotionValue(0);
  const celestialY = useMotionValue(0);
  const nightOpacity = useTransform(scrub, [0, 0.55, 1], [0, 0.15, 1]);
  const starOpacity = useTransform(scrub, [0.42, 0.78, 1], [0, 0.15, 1]);
  const moonOpacity = useTransform(scrub, [0.52, 0.78, 1], [0, 0.25, 1]);
  const sunOpacity = useTransform(scrub, [0, 0.62, 0.86], [1, 1, 0]);
  const horizonGlowOpacity = useTransform(scrub, [0, 0.5, 1], [0.72, 0.5, 0.12]);
  const currentTheme = phase === null ? NEUTRAL_THEME : PHASES[phase];
  const isSceneReady = phase !== null;

  const updateCelestialPosition = useCallback((progress: number, width = dimensionsRef.current.width, height = dimensionsRef.current.height) => {
    if (!width || !height) return;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const centerX = isMobile ? width * 0.5 : isTablet ? width * 0.61 : width * 0.72;
    const centerY = isMobile ? height * 0.57 : isTablet ? height * 0.61 : height * 0.68;
    const radiusX = isMobile ? Math.min(width * 0.35, 150) : isTablet ? Math.min(width * 0.28, 260) : Math.min(width * 0.24, 340);
    const radiusY = isMobile ? Math.min(height * 0.28, 190) : isTablet ? Math.min(height * 0.32, 260) : Math.min(height * 0.38, 330);
    const angle = Math.PI * (1 - progress);
    const y = centerY - Math.sin(angle) * radiusY;
    const maxCelestialY = height * 0.48;
    celestialX.set(centerX + Math.cos(angle) * radiusX);
    celestialY.set(Math.min(y, maxCelestialY));
  }, [celestialX, celestialY]);

  const setSceneProgress = useCallback((nextPhase: ScenePhase) => {
    const progress = nextPhase / 2;
    setPhase(nextPhase);
    scrub.set(progress);
    updateCelestialPosition(progress);
  }, [scrub, updateCelestialPosition]);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      dimensionsRef.current = { width, height };
      setDimensions({ width, height });
      updateCelestialPosition(scrub.get(), width, height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrub, updateCelestialPosition]);

  // A layout effect updates the server-rendered morning fallback before the
  // browser paints, preventing a visible incorrect scene without changing the
  // markup used for hydration.
  useLayoutEffect(() => {
    if (hasManualSelection) return;
    setSceneProgress(getScenePhaseForHour(new Date().getHours()));
  }, [hasManualSelection, playKey, setSceneProgress]);

  useEffect(() => {
    if (hasManualSelection) return;

    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNextSceneUpdate = () => {
      timeout = setTimeout(() => {
        if (hasManualSelectionRef.current) return;
        setSceneProgress(getScenePhaseForHour(new Date().getHours()));
        scheduleNextSceneUpdate();
      }, getMillisecondsUntilNextSceneBoundary(new Date()));
    };

    scheduleNextSceneUpdate();
    return () => clearTimeout(timeout);
  }, [hasManualSelection, setSceneProgress]);
  useEffect(() => { updateCelestialPosition(scrub.get()); }, [dimensions, scrub, updateCelestialPosition]);
  const handleSearch = () => {
    const normalizedQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedQuery) {
      setSearchError("Vul eerst een stad, activiteit of festival in.");
      return;
    }
    const route = getSearchRoute(normalizedQuery);
    if (!route) {
      setSearchError(`We konden geen resultaten vinden voor "${normalizedQuery}". Controleer de spelling of probeer een andere stad, activiteit of festival.`);
      return;
    }
    setSearchError(null);
    setSearchQuery(normalizedQuery);
    router.push(route);
  };
  const gradient = `linear-gradient(180deg, ${currentTheme.skyFrom} 0%, ${currentTheme.skyVia} 52%, ${currentTheme.skyTo} 100%)`;

  const handlePointerScrub = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = visualRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const progress = rect.width > 0 ? Math.min(Math.max(event.clientX - rect.left, 0), rect.width) / rect.width : 0;
    scrub.set(progress);
    updateCelestialPosition(progress);
    const nextPhase: ScenePhase = progress < 0.33 ? 0 : progress < 0.67 ? 1 : 2;
    if (nextPhase !== phase) setPhase(nextPhase);
  };
  const handleManualSceneSelection = useCallback((nextPhase: ScenePhase) => {
    hasManualSelectionRef.current = true;
    setHasManualSelection(true);
    setSceneProgress(nextPhase);
  }, [setSceneProgress]);
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") { hasManualSelectionRef.current = true; setHasManualSelection(true); event.currentTarget.setPointerCapture(event.pointerId); handlePointerScrub(event); } };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) handlePointerScrub(event); };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setSceneProgress(scrub.get() < 0.33 ? 0 : scrub.get() < 0.67 ? 1 : 2); };

  return <section ref={rootRef} className={cx("relative isolate min-h-screen min-h-[100svh] min-h-[100dvh] w-full overflow-hidden bg-[#b8c5c3] lg:h-screen lg:h-[100dvh]", className)} style={{ color: currentTheme.ink, "--sc-ink": currentTheme.ink, "--sc-muted-ink": currentTheme.mutedInk, "--sc-accent": currentTheme.accent } as CSSProperties} aria-labelledby={titleId}>
    <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[#b8c5c3]" />
    {isSceneReady && <>
    <div aria-hidden="true" className="absolute inset-0 -z-30" style={{ background: gradient, contain: "strict" }} />
    {!prefersReducedMotion && <motion.div key={`scene-veil-${phase}`} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-28 -z-20" style={{ backgroundColor: phase === 2 ? "rgba(9,16,27,0.18)" : "rgba(255,255,255,0.14)", willChange: "opacity" }} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }} />}
    <motion.div aria-hidden="true" className="absolute inset-0 -z-20" style={{ opacity: nightOpacity, background: "linear-gradient(180deg, rgba(8,17,35,0.78) 0%, rgba(18,31,54,0.52) 52%, rgba(9,16,27,0.3) 100%)" }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: starOpacity }}>{STAR_POSITIONS.map(([left, top]) => <span key={`${left}-${top}`} className="absolute h-1 w-1 rounded-full bg-white/85" style={{ left: `${left}%`, top: `${top}%` }} />)}</motion.div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62%]">
      <div className="absolute left-[7%] top-[14%] text-white/45"><Cloud className="w-32 sm:w-40 lg:w-52" opacity={0.72} /></div>
      <div className="absolute right-[8%] top-[11%] text-white/35"><Cloud className="w-28 sm:w-36 lg:w-48" opacity={0.64} /></div>
      <div className="absolute right-[29%] top-[38%] text-white/30"><Cloud className="w-20 sm:w-28 lg:w-36" opacity={0.58} /></div>
      {phase !== 2 && BIRDS.map((bird) => <div key={bird.left} className="absolute text-[var(--sc-ink)]/50" style={{ left: bird.left, top: bird.top, scale: bird.scale }}><Bird className="w-9 lg:w-11" /></div>)}
    </div>
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl sm:h-56 sm:w-56 lg:h-72 lg:w-72" style={{ x: celestialX, y: celestialY, opacity: horizonGlowOpacity, background: currentTheme.glow }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2" style={{ x: celestialX, y: celestialY, opacity: sunOpacity }}><div className="h-20 w-20 rounded-full bg-[#ffe7a8] shadow-[0_0_36px_12px_rgba(255,224,144,0.42)] sm:h-28 sm:w-28 lg:h-36 lg:w-36" /></motion.div>
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2" style={{ x: celestialX, y: celestialY, opacity: moonOpacity }}><div className="relative h-16 w-16 rounded-full bg-[#f6f1df] shadow-[0_0_24px_8px_rgba(228,236,255,0.26)] sm:h-24 sm:w-24 lg:h-28 lg:w-28"><span className="absolute left-[24%] top-[24%] h-[14%] w-[14%] rounded-full bg-slate-300/30" /><span className="absolute bottom-[24%] right-[18%] h-[18%] w-[18%] rounded-full bg-slate-300/25" /><span className="absolute bottom-[15%] left-[30%] h-[10%] w-[10%] rounded-full bg-slate-300/30" /></div></motion.div>
    </>}
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full bg-gradient-to-r from-white/34 via-white/10 to-transparent lg:w-[66%]" />
    <div className="relative z-20 mx-auto flex min-h-[100svh] min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 pt-20 sm:px-8 sm:pt-24 md:px-10 lg:h-full lg:min-h-0 lg:flex-row lg:items-center lg:px-14 lg:pb-36 lg:pt-16 xl:px-20"><div className="flex w-full max-w-[660px] flex-1 flex-col lg:w-[46%] lg:flex-none">

      <div className="relative mt-[clamp(3rem,10svh,4.5rem)] flex min-h-[clamp(6.5rem,13vw,12rem)] w-full justify-center text-center lg:static lg:mt-0">
        <div className="w-full lg:absolute lg:left-1/2 lg:top-[30%] lg:w-[min(70rem,calc(100vw-6rem))] lg:-translate-x-1/2 lg:-translate-y-1/2"><HomeWordmark titleId={titleId} prefersReducedMotion={prefersReducedMotion} /></div>
      </div>
      <motion.p className="relative z-30 mt-7 max-w-[620px] text-[clamp(1rem,1.5vw,1.2rem)] leading-7 sm:leading-8 lg:absolute lg:left-1/2 lg:top-[calc(30%+8.5rem)] lg:w-[min(34rem,calc(100vw-3rem))] lg:max-w-none lg:-translate-x-1/2 lg:overflow-visible lg:text-center" style={{ color: currentTheme.mutedInk }} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.12 }}>{description}</motion.p>
      <div className="mt-5 flex justify-start lg:hidden"><CompactScenePhaseControl phase={phase} onSelect={handleManualSceneSelection} /></div>
      <motion.div className="mt-auto flex w-full max-w-none flex-col items-stretch gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5 lg:absolute lg:left-1/2 lg:top-[calc(30%+17rem)] lg:w-[400px] lg:-translate-x-1/2 lg:items-center lg:pb-0 lg:pt-0" animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }} transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.18 }}>
        <DateSearchInput value={searchQuery} onChange={(value) => { setSearchQuery(value); setSearchError(null); }} onSearch={handleSearch} errorMessage={searchError} variant="ink" align="center" />
        <Link href="/inspiratie" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#18343A] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-y-0 lg:w-auto">Ik wil inspiratie</Link>
      </motion.div>
    </div></div>
    <div ref={visualRef} aria-hidden="true" className="absolute inset-y-0 right-0 z-10 hidden w-[56%] cursor-ew-resize touch-pan-y lg:block" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} />
    <div className="absolute inset-x-0 bottom-8 z-30 hidden justify-center px-4 lg:flex"><CompactScenePhaseControl phase={phase} onSelect={handleManualSceneSelection} /></div>
  </section>;
}
