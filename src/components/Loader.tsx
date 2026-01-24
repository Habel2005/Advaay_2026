"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, animate } from "framer-motion";

type AssetType = "instant" | "fast" | "normal" | "heavy";

interface Asset {
  url: string;
  weight: AssetType;
  targetRange: [number, number];
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

export default function Loader({ onFinished = () => { } }) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const controls = useAnimation();
  const progressRef = useRef(0);

  useEffect(() => {
    const processQueue = async () => {
      for (let i = 0; i < ASSET_MANIFEST.length; i++) {
        setCurrentAssetIndex(i);
        const asset = ASSET_MANIFEST[i];
        const [start, end] = asset.targetRange;

        const runStep = async (to: number, duration: number, ease: any = "linear") => {
          animate(progressRef.current, to, {
            duration,
            ease,
            onUpdate: (latest) => {
              progressRef.current = latest;
              setDisplayPercent(Math.floor(latest));
            },
          });

          await controls.start({
            width: `${to}%`,
            transition: { duration, ease },
          });
        };

        if (asset.weight === "instant") {
          const mid = start + (end - start) * 0.57;
          await runStep(mid, 0);
          await runStep(end, 0);
        } else if (asset.weight === "fast") {
          await runStep(end, 0.3, "circOut");
        } else if (asset.weight === "normal") {
          await runStep(end, 0.8, "easeInOut");
        } else if (asset.weight === "heavy") {
          const stall = start + (end - start) * 0.7;
          await runStep(stall, 0.4, "easeOut");
          await runStep(end - 2, 2.5, "linear");
          await runStep(end, 0.2, "circOut");
        }
      }
      setTimeout(onFinished, 800);
    };

    processQueue();
  }, [controls, onFinished]);

  const currentAsset = ASSET_MANIFEST[currentAssetIndex];

  return (
    <div className="fixed inset-0 z-[9999] bg-white text-black font-mono select-none overflow-hidden cursor-wait flex items-center justify-center">

      {/* CENTER BLOCK */}
      <div className="relative w-full max-w-[92vw] sm:max-w-[70vw] lg:max-w-[50vw] px-4 sm:px-0">

        {/* MOBILE: LOADING TEXT ABOVE BAR */}
        <div className="flex justify-center items-baseline gap-2 mb-3 sm:hidden leading-none">
          <span
            className="
    text-[12px]
    animate-pulse
    inline-block
    align-middle
    translate-y-[-1px]
  "
          >
            ▶▶
          </span>


          <span className="text-[12px] uppercase tracking-tight tabular-nums">
            LOADING — {displayPercent}%
          </span>
        </div>


        {/* LOADING BAR */}
        <div className="relative w-full h-[1.5px] sm:h-[1px] bg-black/10">
          <motion.div
            initial={{ width: "0%" }}
            animate={controls}
            className="absolute top-0 left-0 h-full bg-black"
          />
        </div>

        {/* DESKTOP INFO ROW (UNDER BAR) */}
        <div className="hidden sm:flex justify-between items-start mt-3 text-[10px] uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <span
              className="
    text-[8px]
    animate-pulse
    inline-block
    align-middle
    translate-y-[-1px]
  "
            >
              ▶▶
            </span>

            <span className="tabular-nums">
              LOADING — {displayPercent}%
            </span>
          </div>

          <div className="flex-1 text-right truncate pl-6 opacity-50">
            {currentAsset?.url}
          </div>
        </div>

        {/* DESKTOP FOOTER */}
        <div className="hidden sm:flex mt-12 justify-center opacity-20">
          <span className="text-[9px] tracking-[0.4em] uppercase">
            {displayPercent >= 100 ? "[ SYNC COMPLETE ]" : "[ INITIALIZING ]"}
          </span>
        </div>
      </div>

      {/* META */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-[9px] text-black/40 tracking-[0.2em] uppercase">
        Advay.2026
      </div>

      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-[9px] text-black/40 tracking-[0.2em] uppercase">
        v2.5.1_STABLE
      </div>
    </div>
  );
}
