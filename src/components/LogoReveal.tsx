"use client";

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
})  {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      onReady();            // tell Loader to fade
      video.play().catch(() => {});
    };

    const handleEnd = () => onComplete();

    video.addEventListener("canplay", handleReady, { once: true });
    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("ended", handleEnd);
    };
  }, [onReady, onComplete]);

  return (
<motion.div
  className="fixed inset-0 z-[9500] bg-white"
  initial={{ opacity: 0 }}
  animate={{ opacity: active ? 1 : 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src="/reveal/lap.mp4" media="(min-width: 768px)" />
        <source src="/reveal/mob.mp4" media="(max-width: 767px)" />
      </video>
    </motion.div>
  );
}
