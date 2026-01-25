'use client';

import { useState, useCallback } from "react";
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

  const canReveal = loaderDone && videoReady;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* 💡 FIX: The Loader is now completely removed when it is done. */}
        {!loaderDone && (
          <Loader
            canFinish={videoReady}
            onFinished={handleLoaderFinished}
          />
        )}

        {/* The LogoReveal component handles its own lifecycle. */}
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
