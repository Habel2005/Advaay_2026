"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function LogoReveal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setReady(true);
      video.play().catch(() => {});
    };

    const handleEnd = () => onComplete();

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnd);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* BLACK SAFETY LAYER — ALWAYS PRESENT */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* VIDEO — ONLY SHOWN WHEN READY */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        preload="auto"
      >
        {/* DESKTOP */}
        <source
          src="/reveal/lap.mp4"
          media="(min-width: 768px)"
          type="video/mp4"
        />

        {/* MOBILE */}
        <source
          src="/reveal/mob.mp4"
          media="(max-width: 767px)"
          type="video/mp4"
        />
      </video>
    </motion.div>
  );
}
