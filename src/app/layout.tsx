"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import LogoReveal from "@/components/LogoReveal";
import VideoPreloader from "@/components/VideoPreloader";
import { AnimatePresence, motion } from "framer-motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"bar" | "reveal" | "content">("bar");
  const [videoReady, setVideoReady] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* VIDEO PRELOAD HAPPENS DURING LOADER */}
        {phase === "bar" && <VideoPreloader onReady={() => setVideoReady(true)} />}

        <AnimatePresence>
          {/* LOADER */}
          {phase === "bar" && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Loader
                canFinish={videoReady}
                onFinished={() => setPhase("reveal")}
              />
            </motion.div>
          )}

          {/* LOGO REVEAL */}
          {phase === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LogoReveal onComplete={() => setPhase("content")} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <main
          className={`transition-opacity duration-700 ease-out ${
            phase === "content"
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
