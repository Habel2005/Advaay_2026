"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// CONFIGURATION
const COLUMNS = 18; // Per side (Total = 36)
const NOISE_DURATION = 2.5; // How long the noise plays before snapping
const REVEAL_DURATION = 1.2; // How long the text sits before finishing

type Phase = "initial" | "noise" | "merge" | "complete";

export default function KprLoader({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>("initial");

  useEffect(() => {
    // 1. Start Noise
    const t1 = setTimeout(() => setPhase("noise"), 100);
    
    // 2. Snap to Text (Merge Phase)
    const t2 = setTimeout(() => setPhase("merge"), 100 + NOISE_DURATION * 1000);
    
    // 3. Complete
    const t3 = setTimeout(() => {
      setPhase("complete");
      if (onComplete) onComplete();
    }, 100 + NOISE_DURATION * 1000 + REVEAL_DURATION * 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* SVG FILTER FOR THE "GOO" LIQUID EFFECT */}
          <svg className="hidden">
            <defs>
              <filter id="goo-heavy">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          {/* -------------------------------------------------------
              LAYER 1: THE ANIMATING BARCODE (CONTENT)
              This is always black bars on white.
           ------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-1 opacity-90"
            style={{ filter: "url(#goo-heavy)" }}
          >
            {/* LEFT SIDE */}
            <div className="flex gap-[1vw] items-center h-full">
              {Array.from({ length: COLUMNS }).map((_, i) => (
                <BarcodeLine key={`l-${i}`} index={i} phase={phase} />
              ))}
            </div>
            
            {/* RIGHT SIDE (Mirrored) */}
            <div className="flex gap-[1vw] items-center h-full" style={{ transform: "scaleX(-1)" }}>
              {Array.from({ length: COLUMNS }).map((_, i) => (
                <BarcodeLine key={`r-${i}`} index={i} phase={phase} />
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------
              LAYER 2: THE REVEALER (THE TRICK)
              Background: White
              Text: Black
              Mix-Blend-Mode: Screen
              
              LOGIC:
              - White BG + Black Bars (Layer 1) = White (Hides bars)
              - Black Text + Black Bars (Layer 1) = Black (Shows bars)
           ------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "merge" ? 1 : 0 }}
            transition={{ duration: 0.1, ease: "linear" }} // Instant snap like video
            className="absolute inset-0 bg-white flex items-center justify-center mix-blend-screen pointer-events-none"
          >
            <h1 className="text-[15vw] font-black text-black leading-none tracking-tighter scale-y-110">
              ADVAY
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------------------------
// INDIVIDUAL LINE COMPONENT
// ----------------------------------------------------------------------

function BarcodeLine({ index, phase }: { index: number; phase: Phase }) {
  // Randomize noise pattern for each bar so they don't look uniform
  const isOdd = index % 2 !== 0;
  const duration = isOdd ? 0.6 : 0.8;
  const delay = index * 0.05;

  return (
    <motion.div
      className="bg-black rounded-full w-[1.5vw]"
      initial={{ height: 0 }}
      animate={
        phase === "merge"
          ? { 
              // FILL PHASE: Bars expand to fill the text shape completely
              height: "100vh", 
              width: "3vw", // Widen to close gaps
              filter: "blur(0px)"
            }
          : {
              // NOISE PHASE: Random height oscillation
              height: isOdd ? ["10%", "60%", "20%"] : ["20%", "80%", "10%"],
            }
      }
      transition={
        phase === "merge"
          ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Smooth fill
          : {
              duration: duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: delay,
            }
      }
    />
  );
}