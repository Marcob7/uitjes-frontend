"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
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

const STAR_POSITIONS = [[8, 14], [16, 23], [27, 12], [39, 27], [51, 10], [60, 20], [71, 12], [83, 25], [92, 14], [13, 39], [31, 36], [47, 43], [67, 36], [79, 47], [89, 39]] as const;
const BIRDS = [{ left: "61%", top: "30%", scale: 0.75, delay: 0 }, { left: "68%", top: "24%", scale: 0.55, delay: 0.18 }, { left: "73%", top: "34%", scale: 0.65, delay: 0.36 }] as const;
const HOME_WORDS = ["HI AMSTERDAM", "HI APELDOORN", "HI HAARLEM", "HI DEN HAAG", "HI ZWOLLE"];
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function Bird({ className = "" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 42 18" className={className} fill="none"><path d="M2 13c5-6 10-7 18-1 8-6 13-5 20 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
}

function Cloud({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return <svg aria-hidden="true" viewBox="0 0 180 70" className={className} style={{ opacity }} fill="none"><path d="M28 54c-12 0-22-8-22-18s10-18 23-18c5-11 16-18 30-18 17 0 30 10 34 23 5-4 12-6 19-6 16 0 29 10 29 23 0 2 0 4-1 6 4-2 9-3 14-3 11 0 20 5 20 11H28Z" fill="currentColor" /></svg>;
}

type ScenePhaseControlProps = {
  phase: ScenePhase;
  titleId: string;
  prefersReducedMotion: boolean | null;
  onSelect: (phase: ScenePhase) => void;
};

function ScenePhaseControl({ phase, titleId, prefersReducedMotion, onSelect }: ScenePhaseControlProps) {
  return <div className="flex max-w-full items-center gap-1 rounded-full border border-white/25 bg-white/22 p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl" role="group" aria-label="Kies een moment van de dag">{PHASES.map((item, index) => { const selected = phase === index; return <button key={item.label} type="button" aria-pressed={selected} aria-label={item.ariaLabel} onClick={() => onSelect(index as ScenePhase)} className={cx("relative min-h-10 rounded-full px-4 text-sm font-semibold transition", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white", selected ? "text-white" : "text-[var(--sc-ink)] hover:bg-white/20")}>{selected && <motion.span layoutId={`active-scene-phase-${titleId}`} className="absolute inset-0 -z-10 rounded-full bg-[var(--sc-ink)]" transition={{ type: prefersReducedMotion ? "tween" : "spring", stiffness: 420, damping: 32 }} />}<span className="relative">{item.label}</span></button>; })}</div>;
}

export default function HomeSceneSection({
  description = "Van verborgen lokale plekken tot festivals, restaurants en spontane plannen. Ontdek activiteiten die passen bij jouw stemming, locatie en moment.", playKey, className,
}: HomeSceneSectionProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<ScenePhase>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(1);
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
  const currentTheme = PHASES[phase];
  const currentWord = HOME_WORDS[wordIndex] ?? "";
  const shownWord = currentWord.slice(0, visibleLetters);

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

  useEffect(() => { setSceneProgress(0); }, [playKey, setSceneProgress]);
  useEffect(() => { updateCelestialPosition(scrub.get()); }, [dimensions, scrub, updateCelestialPosition]);
  useEffect(() => {
    if (!currentWord) return;
    const timeout = setTimeout(() => {
      if (visibleLetters < currentWord.length) {
        setVisibleLetters((previous) => previous + 1);
      } else {
        setVisibleLetters(1);
        setWordIndex((previous) => (previous + 1) % HOME_WORDS.length);
      }
    }, visibleLetters < currentWord.length ? 85 : 950);
    return () => clearTimeout(timeout);
  }, [currentWord, visibleLetters]);

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
  const gradient = useMemo(() => `linear-gradient(180deg, ${currentTheme.skyFrom} 0%, ${currentTheme.skyVia} 52%, ${currentTheme.skyTo} 100%)`, [currentTheme]);

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
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") { event.currentTarget.setPointerCapture(event.pointerId); handlePointerScrub(event); } };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) handlePointerScrub(event); };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setSceneProgress(scrub.get() < 0.33 ? 0 : scrub.get() < 0.67 ? 1 : 2); };

  return <section ref={rootRef} className={cx("relative isolate min-h-screen min-h-[100svh] min-h-[100dvh] w-full overflow-hidden bg-[#f3cbb8] lg:h-screen lg:h-[100dvh]", className)} style={{ color: currentTheme.ink, "--sc-ink": currentTheme.ink, "--sc-muted-ink": currentTheme.mutedInk, "--sc-accent": currentTheme.accent } as CSSProperties} aria-labelledby={titleId}>
    <motion.div aria-hidden="true" className="absolute inset-0 -z-30 transition-colors duration-700" animate={{ background: gradient }} transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: "easeInOut" }} />
    <motion.div aria-hidden="true" className="absolute inset-0 -z-20" style={{ opacity: nightOpacity, background: "linear-gradient(180deg, rgba(8,17,35,0.78) 0%, rgba(18,31,54,0.52) 52%, rgba(9,16,27,0.3) 100%)" }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: starOpacity }}>{STAR_POSITIONS.map(([left, top], index) => <motion.span key={`${left}-${top}`} className="absolute h-1 w-1 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.85)]" style={{ left: `${left}%`, top: `${top}%` }} animate={prefersReducedMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.8, 1.25, 0.8] }} transition={{ duration: 2.2 + (index % 4) * 0.45, repeat: Infinity, delay: (index % 5) * 0.28, ease: "easeInOut" }} />)}</motion.div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62%]">
      <motion.div className="absolute left-[7%] top-[14%] text-white/45" animate={prefersReducedMotion ? undefined : { x: [0, 34, 0], y: [0, -5, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}><Cloud className="w-32 sm:w-40 lg:w-52" opacity={0.72} /></motion.div>
      <motion.div className="absolute right-[8%] top-[11%] text-white/35" animate={prefersReducedMotion ? undefined : { x: [0, -42, 0], y: [0, 6, 0] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}><Cloud className="w-28 sm:w-36 lg:w-48" opacity={0.64} /></motion.div>
      <motion.div className="absolute right-[29%] top-[38%] text-white/30" animate={prefersReducedMotion ? undefined : { x: [0, 24, 0], opacity: [0.4, 0.72, 0.4] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}><Cloud className="w-20 sm:w-28 lg:w-36" opacity={0.58} /></motion.div>
      <AnimatePresence>{phase !== 2 && BIRDS.map((bird) => <motion.div key={bird.left} className="absolute text-[var(--sc-ink)]/50" style={{ left: bird.left, top: bird.top, scale: bird.scale }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.5, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: bird.delay }}><Bird className="w-9 lg:w-11" /></motion.div>)}</AnimatePresence>
    </div>
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-56 sm:w-56 lg:h-72 lg:w-72" style={{ x: celestialX, y: celestialY, opacity: horizonGlowOpacity, background: currentTheme.glow }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2" style={{ x: celestialX, y: celestialY, opacity: sunOpacity }}><div className="h-20 w-20 rounded-full bg-[#ffe7a8] shadow-[0_0_50px_18px_rgba(255,224,144,0.48)] sm:h-28 sm:w-28 lg:h-36 lg:w-36" /></motion.div>
    <motion.div aria-hidden="true" className="pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2" style={{ x: celestialX, y: celestialY, opacity: moonOpacity }}><div className="relative h-16 w-16 rounded-full bg-[#f6f1df] shadow-[0_0_34px_12px_rgba(228,236,255,0.3)] sm:h-24 sm:w-24 lg:h-28 lg:w-28"><span className="absolute left-[24%] top-[24%] h-[14%] w-[14%] rounded-full bg-slate-300/30" /><span className="absolute bottom-[24%] right-[18%] h-[18%] w-[18%] rounded-full bg-slate-300/25" /><span className="absolute bottom-[15%] left-[30%] h-[10%] w-[10%] rounded-full bg-slate-300/30" /></div></motion.div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full bg-gradient-to-r from-white/34 via-white/10 to-transparent lg:w-[66%]" />
    <div className="relative z-20 mx-auto flex min-h-[100svh] min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 pt-20 sm:px-8 sm:pt-24 md:px-10 lg:h-full lg:min-h-0 lg:flex-row lg:items-center lg:px-14 lg:pb-36 lg:pt-16 xl:px-20"><div className="flex w-full max-w-[660px] flex-1 flex-col lg:w-[46%] lg:flex-none">

      <motion.h1 id={titleId} className="clubbi-animated-word mt-[clamp(3rem,10svh,4.5rem)] text-left lg:mt-0" style={{ color: currentTheme.ink }} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.05 }}>{shownWord}</motion.h1>
      <motion.p className="mt-7 max-w-[620px] text-[clamp(1rem,1.5vw,1.2rem)] leading-7 sm:leading-8" style={{ color: currentTheme.mutedInk }} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.12 }}>{description}</motion.p>
      <div className="mt-5 flex justify-start lg:hidden"><ScenePhaseControl phase={phase} titleId={titleId} prefersReducedMotion={prefersReducedMotion} onSelect={setSceneProgress} /></div>
      <motion.div className="mt-auto flex w-full max-w-none flex-col items-stretch gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5 lg:mt-8 lg:max-w-[400px] lg:items-start lg:pb-0 lg:pt-0" animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }} transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.18 }}>
        <DateSearchInput value={searchQuery} onChange={(value) => { setSearchQuery(value); setSearchError(null); }} onSearch={handleSearch} errorMessage={searchError} variant="ink" align="start" />
        <Link href="/inspiratie" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#18343A] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-y-0 lg:w-auto">Ik wil inspiratie</Link>
      </motion.div>
    </div></div>
    <div ref={visualRef} aria-hidden="true" className="absolute inset-y-0 right-0 z-10 hidden w-[56%] cursor-ew-resize touch-pan-y lg:block" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} />
    <div className="absolute inset-x-0 bottom-8 z-30 hidden justify-center px-4 lg:flex"><ScenePhaseControl phase={phase} titleId={titleId} prefersReducedMotion={prefersReducedMotion} onSelect={setSceneProgress} /></div>
  </section>;
}
