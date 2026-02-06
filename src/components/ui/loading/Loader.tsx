'use client';

import React, { useEffect, useState } from "react";
import { motion, useAnimation, animate } from "framer-motion";

export default function Loader({ onFinished, canFinish }: { onFinished: () => void; canFinish: boolean; }) {
  const [percent, setPercent] = useState(0);
  const controls = {
    bar: useAnimation(),
    container: useAnimation(),
    text: useAnimation(),
  };

  useEffect(() => {
    // 1. Initial "Fake" Progress to 92%
    const controls92 = animate(0, 92, {
      duration: 3,
      ease: [0.16, 1, 0.3, 1], // Custom out-quart for a "natural" slowing effect
      onUpdate: (latest) => setPercent(Math.floor(latest)),
    });

    // Animate the bar width in sync
    controls.bar.start({ width: "92%", transition: { duration: 3, ease: [0.16, 1, 0.3, 1] } });

    return () => controls92.stop();
  }, []);

  useEffect(() => {
    // 2. The Final Push: Triggered when canFinish is true
    if (canFinish) {
      const finishSequence = async () => {
        // Zip to 100%
        animate(percent, 100, {
          duration: 0.4,
          onUpdate: (latest) => setPercent(Math.floor(latest)),
        });
        
        await controls.bar.start({ width: "100%", transition: { duration: 0.4, ease: "circOut" } });
        await new Promise(r => setTimeout(r, 200));

        // 3. Optimized Exit Sequence
        await Promise.all([
          controls.text.start({ opacity: 0, transition: { duration: 0.3 } }),
          controls.container.start({ 
            x: "105%", 
            opacity: 0, 
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
          })
        ]);

        onFinished();
      };

      finishSequence();
    }
  }, [canFinish]);

  const cornerLabel = "absolute text-[10px] sm:text-[12px] text-black/40 tracking-[0.2em] uppercase animate-in fade-in duration-500";

  return (
    <div className="fixed inset-0 z-[9999] bg-white text-black font-mono select-none cursor-wait flex items-center justify-center overflow-hidden">
      <motion.div 
        className="relative w-full max-w-[92vw] sm:max-w-[50vw]"
        animate={controls.text}
      >
        {/* Mobile Header */}
        <div className="flex justify-center gap-2 mb-3 sm:hidden text-[12px] uppercase tabular-nums">
          <span className="animate-pulse">▶▶</span> LOADING — {percent}%
        </div>

        {/* Progress Bar */}
        <motion.div
          className="relative w-full h-[1px] bg-black/10"
          animate={controls.container}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={controls.bar}
            className="absolute top-0 left-0 h-full bg-black"
          />
        </motion.div>

        {/* Desktop Footer Info */}
        <div className="hidden sm:flex justify-between items-start mt-3 text-[10px] uppercase tracking-tight tabular-nums">
          <div className="flex items-center gap-2">
            <span className="text-[8px] animate-pulse">▶▶</span> 
            <span>LOADING — {percent}%</span>
          </div>
          <div className="opacity-50">
            {percent < 100 ? "Initializing_Core_Assets..." : "System_Ready"}
          </div>
        </div>
      </motion.div>

      {/* Corner UI Elements */}
      <motion.div animate={controls.text}>
        <div className={`${cornerLabel} top-4 sm:top-8 left-4 sm:left-8`}>Advay.2026</div>
        <div className={`${cornerLabel} top-4 sm:top-8 right-4 sm:right-8`}>v2.5.1_STABLE</div>
        <div className={`${cornerLabel} bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2`}>A MuLearn TIST Production</div>
      </motion.div>
    </div>
  );
}
