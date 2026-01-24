"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoReveal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const onEnd = () => onComplete();
    video.addEventListener("ended", onEnd);

    return () => video.removeEventListener("ended", onEnd);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-white"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          {/* DESKTOP FIRST */}
          <source
            src="/reveal/lap.mp4"
            media="(min-width: 768px)"
            type="video/mp4"
          />

          {/* MOBILE FALLBACK */}
          <source
            src="/reveal/mob.mp4"
            media="(max-width: 767px)"
            type="video/mp4"
          />
        </video>
      </motion.div>
    </AnimatePresence>
  );
}
