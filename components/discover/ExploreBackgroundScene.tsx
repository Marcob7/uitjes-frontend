"use client";

import { motion, useReducedMotion } from "motion/react";

export function ExploreBackgroundScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="explore-scene" aria-hidden="true">
      <div className="explore-scene-sky" />
      <motion.div className="explore-scene-sun-glow" animate={reducedMotion ? undefined : { opacity: [0.25, 0.42, 0.25], scale: [1, 1.06, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <div className="explore-scene-sun" />
      <motion.div className="explore-scene-cloud explore-scene-cloud--one" animate={reducedMotion ? undefined : { x: [0, 22, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="explore-scene-cloud explore-scene-cloud--two" animate={reducedMotion ? undefined : { x: [0, -16, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="explore-scene-birds" animate={reducedMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}>
        <svg viewBox="0 0 84 22" focusable="false"><path d="M2 16c10-11 20-11 30 0 10-11 20-11 30 0 7-8 13-9 20-1" /></svg>
      </motion.div>
      <svg className="explore-scene-land" viewBox="0 0 1600 1900" preserveAspectRatio="none" focusable="false">
        <path className="explore-scene-horizon explore-scene-horizon--far" d="M0 390c180-100 309-57 471 8 169 68 313-75 486-85 227-12 334 104 643 51v641H0Z" />
        <path className="explore-scene-horizon explore-scene-horizon--mid" d="M0 705c156-81 302-77 426 6 138 92 285 56 424-30 151-94 277-58 392 24 102 73 209 71 358 1v756H0Z" />
        <path className="explore-scene-route" d="M-38 1450c221-176 313-289 222-415-74-101 38-210 271-287 269-89 374-167 286-306-52-83 11-170 185-260" />
        <path className="explore-scene-horizon explore-scene-horizon--front-left" d="M0 1520c180-117 330-85 450-9 126 80 258 85 392 23v366H0Z" />
        <path className="explore-scene-horizon explore-scene-horizon--front-right" d="M818 1618c192-104 324-94 446-16 107 69 217 77 336 26v272H818Z" />
        <g className="explore-scene-reeds"><path d="M80 1618c-25-97-13-170 24-219m18 219c-5-116 24-192 68-238m-25 238c13-86 49-140 100-176M1470 1740c-18-92-5-158 32-209m-1 209c5-85 38-143 83-185m-35 185c10-65 40-109 78-138" /></g>
        <g className="explore-scene-dots"><circle cx="241" cy="634" r="7" /><circle cx="1285" cy="515" r="6" /><circle cx="1414" cy="1288" r="8" /></g>
      </svg>
    </div>
  );
}
