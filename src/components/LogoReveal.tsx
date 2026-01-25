'use client';

import { useEffect, useRef, useState } from "react";
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
  
  // OPTIONAL: Move source logic to JS to prevent iOS confusion with <source> tags
  // This ensures the video element has a stable 'src' attribute.
  const [videoSrc, setVideoSrc] = useState("");
  
  useEffect(() => {
    // Simple check to set source based on width (run only on mount)
    setVideoSrc(window.innerWidth >= 768 ? "/reveal/lap.mp4" : "/reveal/mob.mp4");
  }, []);

  // 1. Report Ready State
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    const handleReady = () => onReady();
    
    // Check if ready, otherwise listen
    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener("canplay", handleReady, { once: true });
    }
    return () => video.removeEventListener("canplay", handleReady);
  }, [onReady, videoSrc]);

  // 2. IOS AUTOPLAY FIX
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active || !videoSrc) return;

    // --- CRITICAL IOS FIXES ---
    // React props (muted={true}) sometimes don't apply fast enough for iOS.
    // We must force the DOM properties directly.
    video.muted = true;       
    video.defaultMuted = true; 
    video.playsInline = true;  
    video.controls = false;    // Explicitly hide the play button overlay

    const handleEnd = () => onComplete();
    
    // Reset time just in case
    video.currentTime = 0;

    // Use a robust play attempt
    const playVideo = async () => {
        try {
            await video.play();
        } catch (err) {
            console.warn("Autoplay blocked by browser policy:", err);
            // If this fails (e.g. Low Power Mode), you might need a fallback UI,
            // but ensuring 'muted' is true usually fixes standard cases.
        }
    };

    playVideo();

    video.addEventListener("ended", handleEnd, { once: true });
    return () => video.removeEventListener("ended", handleEnd);
  }, [active, onComplete, videoSrc]);

  return (
    <motion.div
      className="fixed inset-0 z-[9500] bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* On iOS, it is safer to use the 'src' prop directly on the video tag 
         rather than <source> children when handling dynamic rendering.
      */}
      {videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          muted
          playsInline
          autoPlay
          preload="auto"
          controls={false} // Explicitly disable native controls
        />
      )}
    </motion.div>
  );
}