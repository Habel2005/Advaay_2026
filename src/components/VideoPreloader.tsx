"use client";

import { useEffect } from "react";

export default function VideoPreloader({
  onReady,
}: {
  onReady: () => void;
}) {
  useEffect(() => {
    const video = document.createElement("video");

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    // Pick correct source based on viewport
    const source = document.createElement("source");
    source.src =
      window.innerWidth >= 768 ? "/reveal/lap.mp4" : "/reveal/mob.mp4";
    source.type = "video/mp4";

    video.appendChild(source);

    const handleReady = () => {
      onReady();
    };

    video.addEventListener("canplaythrough", handleReady, { once: true });

    // Safari fallback
    video.addEventListener("canplay", handleReady, { once: true });

    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleReady);
      video.removeEventListener("canplay", handleReady);
    };
  }, [onReady]);

  return null;
}
