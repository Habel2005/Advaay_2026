'use client';

import { useState, useCallback, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import LogoReveal from "@/components/LogoReveal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
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

  // 💡 FIX: Unlock video autoplay on the first user interaction for iOS.
  useEffect(() => {
    const unlockAutoplay = () => {
      const videos = Array.from(document.getElementsByTagName('video'));
      videos.forEach((video) => {
        video.play();
        video.pause();
      });
      // Remove the listener after it has run once.
      document.removeEventListener("touchstart", unlockAutoplay);
    };

    document.addEventListener('touchstart', unlockAutoplay);

    return () => {
      document.removeEventListener("touchstart", unlockAutoplay);
    };
  }, []);

  const canReveal = loaderDone && videoReady;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {!loaderDone && (
          <Loader
            canFinish={videoReady}
            onFinished={handleLoaderFinished}
          />
        )}

        {!revealDone && (
          <LogoReveal
            onReady={handleVideoReady}
            onComplete={handleRevealComplete}
            active={canReveal}
          />
        )}

        <main
          className={`transition-opacity duration-700 ease-out ${
            revealDone
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
