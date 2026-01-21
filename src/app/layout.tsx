"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import LogoReveal from "@/components/LogoReveal"; // <--- Add this import
import { AnimatePresence } from "framer-motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Change to a phase-based state
  const [phase, setPhase] = useState<'bar' | 'reveal' | 'content'>('bar');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        
        <AnimatePresence mode="wait">
          {/* PHASE 1: The Analog Loading Bar */}
          {phase === 'bar' && (
            <Loader key="loader" onFinished={() => setPhase('reveal')} />
          )}

          {/* PHASE 2: The Liquid Logo Transition */}
          {phase === 'reveal' && (
            <LogoReveal key="reveal" onComplete={() => setPhase('content')} />
          )}
        </AnimatePresence>

        {/* PHASE 3: The Main Site Content */}
        <main 
          className={`transition-opacity duration-1000 ease-in-out ${
            phase === 'content' ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {children}
        </main>

      </body>
    </html>
  );
}