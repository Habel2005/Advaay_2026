"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdvayInkReveal() {
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  React.useEffect(() => {
    const timer = setTimeout(() => setPhase("reveal"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <LoadingPhase key="loading" />
        ) : (
          <RevealPhase key="reveal" />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================== LOADING PHASE ===================================== */
function LoadingPhase() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 1920 1080" className="w-full h-full" fill="none">
        <GridPattern />
      </svg>
    </motion.div>
  );
}

/* ===================================== REVEAL PHASE ===================================== */
function RevealPhase() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 1920 1080" className="w-full h-full" fill="none">
        {/* Background pattern that morphs */}
        <GridPatternMorph />
        
        {/* Main ADVAY text formed by lines */}
        <AdvayTextLines />
      </svg>
    </motion.div>
  );
}

/* ===================================== LOADING GRID ===================================== */
function GridPattern() {
  const rows = 40;
  const cols = 70;
  const centerX = 960;
  const centerY = 540;

  return (
    <g stroke="white" strokeWidth="1" opacity="0.4">
      {Array.from({ length: rows }).map((_, i) => {
        const y = (i * 1080) / rows;
        return (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="1920"
            y2={y}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 1.5,
              delay: Math.abs(i - rows / 2) * 0.02,
              ease: "easeOut",
            }}
          />
        );
      })}
      {Array.from({ length: cols }).map((_, i) => {
        const x = (i * 1920) / cols;
        return (
          <motion.line
            key={`v-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1080"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 1.5,
              delay: Math.abs(i - cols / 2) * 0.02,
              ease: "easeOut",
            }}
          />
        );
      })}
      
      {/* Radial accent lines */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 24;
        const len = 400 + (i % 3) * 100;
        return (
          <motion.line
            key={`r-${i}`}
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(angle) * len}
            y2={centerY + Math.sin(angle) * len}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{
              duration: 1.2,
              delay: 0.5 + i * 0.03,
              ease: "easeOut",
            }}
          />
        );
      })}
    </g>
  );
}

/* ===================================== MORPHING GRID ===================================== */
function GridPatternMorph() {
  const rows = 40;
  const cols = 70;

  return (
    <g stroke="white" strokeWidth="0.5" opacity="0.15">
      {Array.from({ length: rows }).map((_, i) => {
        const y = (i * 1080) / rows;
        return (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="1920"
            y2={y}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        );
      })}
      {Array.from({ length: cols }).map((_, i) => {
        const x = (i * 1920) / cols;
        return (
          <motion.line
            key={`v-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1080"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        );
      })}
    </g>
  );
}

/* ===================================== ADVAY TEXT LINES ===================================== */
function AdvayTextLines() {
  // Letter positions (centered, large scale)
  const letterSpacing = 200;
  const startX = 960 - (4 * letterSpacing) / 2 - 100;
  const baseY = 540;
  const height = 280;

  return (
    <g stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* A - Letter 1 */}
      <LetterA x={startX} y={baseY} h={height} delay={0.5} />
      
      {/* D - Letter 2 */}
      <LetterD x={startX + letterSpacing} y={baseY} h={height} delay={0.8} />
      
      {/* V - Letter 3 */}
      <LetterV x={startX + letterSpacing * 2} y={baseY} h={height} delay={1.1} />
      
      {/* A - Letter 4 */}
      <LetterA x={startX + letterSpacing * 3} y={baseY} h={height} delay={1.4} />
      
      {/* Y - Letter 5 */}
      <LetterY x={startX + letterSpacing * 4} y={baseY} h={height} delay={1.7} />
      
      {/* Decorative accent lines around letters */}
      <AccentLines delay={2.2} />
    </g>
  );
}

/* ===================================== LETTER COMPONENTS ===================================== */
function LetterA({ x, y, h, delay }: any) {
  const w = 120;
  return (
    <g>
      <DrawPath d={`M${x - w / 2} ${y + h / 2} L${x} ${y - h / 2} L${x + w / 2} ${y + h / 2}`} delay={delay} />
      <DrawPath d={`M${x - w / 3.5} ${y + h / 8} L${x + w / 3.5} ${y + h / 8}`} delay={delay + 0.15} />
    </g>
  );
}

function LetterD({ x, y, h, delay }: any) {
  return (
    <g>
      <DrawPath d={`M${x - 40} ${y - h / 2} L${x - 40} ${y + h / 2}`} delay={delay} />
      <DrawPath 
        d={`M${x - 40} ${y - h / 2} Q${x + 80} ${y} ${x - 40} ${y + h / 2}`} 
        delay={delay + 0.15} 
      />
    </g>
  );
}

function LetterV({ x, y, h, delay }: any) {
  const w = 120;
  return (
    <DrawPath d={`M${x - w / 2} ${y - h / 2} L${x} ${y + h / 2} L${x + w / 2} ${y - h / 2}`} delay={delay} />
  );
}

function LetterY({ x, y, h, delay }: any) {
  const w = 120;
  return (
    <g>
      <DrawPath d={`M${x - w / 2} ${y - h / 2} L${x} ${y}`} delay={delay} />
      <DrawPath d={`M${x + w / 2} ${y - h / 2} L${x} ${y}`} delay={delay + 0.1} />
      <DrawPath d={`M${x} ${y} L${x} ${y + h / 2}`} delay={delay + 0.2} />
    </g>
  );
}

/* ===================================== ACCENT DECORATION ===================================== */
function AccentLines({ delay }: any) {
  return (
    <g strokeWidth="1" opacity="0.6">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        const innerR = 450;
        const outerR = 550;
        return (
          <DrawPath
            key={i}
            d={`M${960 + Math.cos(angle) * innerR} ${540 + Math.sin(angle) * innerR} L${
              960 + Math.cos(angle) * outerR
            } ${540 + Math.sin(angle) * outerR}`}
            delay={delay + i * 0.05}
          />
        );
      })}
    </g>
  );
}

/* ===================================== PATH DRAW UTILITY ===================================== */
function DrawPath({ d, delay, duration = 1 }: any) {
  return (
    <motion.path
      d={d}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration, ease: "easeInOut", delay },
        opacity: { duration: 0.3, delay },
      }}
    />
  );
}