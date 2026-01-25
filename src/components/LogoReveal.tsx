'use client';

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function LogoReveal({
  onReady,
  onComplete,
  active,
}: {
  onReady: () => void;
  onComplete: () => void;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Report when the video is ready.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleReady = () => onReady();
    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener("canplay", handleReady, { once: true });
    }
    return () => {
      video.removeEventListener("canplay", handleReady);
    };
  }, [onReady]);

  // 2. Play the video when active.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;
    const handleEnd = () => onComplete();
    video.currentTime = 0;
    video.play().catch(() => {
      console.error("Video play was prevented by the browser.");
    });
    video.addEventListener("ended", handleEnd, { once: true });
    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, [active, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9500] bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        // 💡 FIX: Add autoPlay attribute for better mobile compatibility
        autoPlay
        preload="auto"
      >
        <source src="/reveal/lap.mp4" media="(min-width: 768px)" />
        <source src="/reveal/mob.mp4" media="(max-width: 767px)" />
      </video>
    </motion.div>
  );
}
