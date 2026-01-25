'use client';

import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import LogoReveal from "@/components/LogoReveal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [videoReady, setVideoReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);
  const handleLoaderFinished = useCallback(() => setLoaderDone(true), []);
  const handleRevealComplete = useCallback(() => setRevealDone(true), []);

  // iOS autoplay unlock
  useEffect(() => {
    const unlock = () => {
      document.querySelectorAll("video").forEach((video) => {
        video.play().catch(() => {});
        video.pause();
      });
      document.removeEventListener("touchstart", unlock);
    };

    document.addEventListener("touchstart", unlock);
    return () => document.removeEventListener("touchstart", unlock);
  }, []);

  const canReveal = loaderDone && videoReady;

  return (
    <>
      {!loaderDone && (
        <Loader
          canFinish={videoReady}
          onFinished={handleLoaderFinished}
        />
      )}

      {!revealDone && (
        <LogoReveal
          active={canReveal}
          onReady={handleVideoReady}
          onComplete={handleRevealComplete}
        />
      )}

      <main
        className={`transition-opacity duration-700 ${
          revealDone
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </main>
    </>
  );
}
