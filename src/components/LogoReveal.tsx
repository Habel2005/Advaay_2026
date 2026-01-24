"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

    const handleEnd = () => onComplete();
    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/reveal/lap.mp4"
          media="(min-width: 768px)"
          type="video/mp4"
        />
        <source
          src="/reveal/mob.mp4"
          media="(max-width: 767px)"
          type="video/mp4"
        />
      </video>
    </motion.div>
  );
}
