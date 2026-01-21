"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, animate } from "framer-motion";

type AssetType = "instant" | "fast" | "normal" | "heavy";

interface Asset {
  url: string;
  weight: AssetType;
  targetRange: [number, number]; // [start%, end%]
}

const ASSET_MANIFEST: Asset[] = [
  { url: "HTTPS://ADVAY.IO/INIT/BOOT_SEQ/X/8821", weight: "fast", targetRange: [0, 12] },
  { url: "HTTPS://ADVAY.IO/CACHE/USER_PREFS/L/0021", weight: "instant", targetRange: [12, 28] }, 
  { url: "HTTPS://ADVAY.IO/CACHE/LOCAL_STORAGE/K/9912", weight: "instant", targetRange: [28, 42] }, 
  { url: "HTTPS://ADVAY.IO/SRC/MAIN_BUNDLE/J/JS_CORE", weight: "normal", targetRange: [42, 58] },
  { url: "HTTPS://ADVAY.IO/ASSETS/TEXTURES/HIGH_RES/PACK_01", weight: "heavy", targetRange: [58, 82] }, 
  { url: "HTTPS://ADVAY.IO/API/HANDSHAKE/SECURE_TOKEN", weight: "instant", targetRange: [82, 91] },
  { url: "HTTPS://ADVAY.IO/ASSETS/AUDIO/AMBIENCE/LOOP_WAV", weight: "normal", targetRange: [91, 96] },
  { url: "HTTPS://ADVAY.IN/COMPLETE/READY/Z/FN_999XX0", weight: "instant", targetRange: [96, 100] },
];

export default function Loader({ onFinished = () => {} }) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const controls = useAnimation();
  
  // Ref to track the actual numeric progress for the counter
  const progressRef = useRef(0);

  useEffect(() => {
    const processQueue = async () => {
      for (let i = 0; i < ASSET_MANIFEST.length; i++) {
        setCurrentAssetIndex(i);
        const asset = ASSET_MANIFEST[i];
        const [start, end] = asset.targetRange;

        // Function to animate both the bar and the number simultaneously
        const runStep = async (to: number, duration: number, ease: any = "linear") => {
          // Sync the numeric counter with the bar animation
          animate(progressRef.current, to, {
            duration: duration,
            ease: ease,
            onUpdate: (latest) => {
              progressRef.current = latest;
              setDisplayPercent(Math.floor(latest));
            },
          });

          // Animate the actual CSS width
          await controls.start({
            width: `${to}%`,
            transition: { duration: duration, ease: ease },
          });
        };

        if (asset.weight === "instant") {
          // Packet Burst: 0 -> 57% -> 100% of its assigned range
          const mid = start + (end - start) * 0.57;
          await new Promise((r) => setTimeout(r, 50));
          await runStep(mid, 0); // Jump instantly to mid
          await new Promise((r) => setTimeout(r, 70));
          await runStep(end, 0); // Jump instantly to end
        } 
        else if (asset.weight === "fast") {
          await runStep(end, 0.3, "circOut");
        } 
        else if (asset.weight === "normal") {
          await runStep(end, 0.8, "easeInOut");
        } 
        else if (asset.weight === "heavy") {
          // Bottleneck simulation
          const stallPoint = start + (end - start) * 0.7;
          await runStep(stallPoint, 0.4, "easeOut");
          await runStep(end - 2, 2.5, "linear"); // The slow crawl
          await new Promise((r) => setTimeout(r, 400));
          await runStep(end, 0.2, "circOut");
        }
      }

      setTimeout(onFinished, 800);
    };

    processQueue();
  }, [controls, onFinished]);

  const currentAsset = ASSET_MANIFEST[currentAssetIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white text-black font-mono select-none overflow-hidden cursor-wait">
      
      {/* 25% - 50% - 25% Layout */}
      <div className="relative w-full max-w-[50vw] flex flex-col">
        
        {/* THE LOADING BAR */}
        <div className="relative w-full h-[1px] bg-black/10">
          <motion.div 
            initial={{ width: "0%" }}
            animate={controls}
            className="absolute top-0 left-0 h-full bg-black z-10"
          />
        </div>

        {/* INFO ROW */}
        <div className="flex justify-between items-start mt-3 text-[10px] uppercase font-normal tracking-tight">
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="opacity-100 text-[8px] animate-pulse">▶▶</span>
            <span className="tabular-nums">
              LOADING — {displayPercent}%
            </span>
          </div>

          <div className="flex-1 text-right truncate pl-10 opacity-50">
             {currentAsset?.url}
          </div>
        </div>

        {/* FOOTER STATUS */}
        <div className="mt-12 flex justify-center opacity-20">
            <span className="text-[9px] tracking-[0.4em] font-normal uppercase">
               {displayPercent >= 100 ? '[ SYNC COMPLETE ]' : '[ INITIALIZING ]'}
            </span>
        </div>
      </div>

      {/* BRANDING & VERSION (TOP LEFT / BOTTOM RIGHT) */}
      <div className="absolute top-8 left-8 text-[9px] font-normal text-black/40 tracking-[0.2em] uppercase">
        Advay.2025
      </div>
      
      <div className="absolute bottom-8 right-8 text-[9px] font-normal text-black/40 tracking-[0.2em] uppercase">
        v2.0.1_STABLE
      </div>

    </div>
  );
}