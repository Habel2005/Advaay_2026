"use client";

import { useState } from "react";
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
  // 🔑 REQUIRED STATE (you were missing these)
  const [videoReady, setVideoReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  // 🔑 ONLY allow reveal when BOTH are true
  const canReveal = loaderDone && videoReady;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* BOOT LAYER */}
        {!revealDone && (
          <>
            <Loader
              canFinish={videoReady}
              onFinished={() => setLoaderDone(true)}
              dimmed={canReveal}
            />

            <LogoReveal
              onReady={() => setVideoReady(true)}
              onComplete={() => setRevealDone(true)}
              active={canReveal}
            />
          </>
        )}

        {/* MAIN CONTENT */}
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
