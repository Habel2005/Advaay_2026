'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Menu } from 'lucide-react';

/**
 * CIPHER TEXT COMPONENT
 * Handles the "Matrix/Glitch" scrambling effect on hover.
 */
const CipherText = ({ text, className = "", as: Component = "span" }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; 
    }, 30);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <Component 
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
    >
      {displayText}
    </Component>
  );
};

export default function Footer() {
  return (
    <div className="relative font-mono bg-black min-h-screen selection:bg-red-500 selection:text-white">
      
      {/* 1. THE SCROLLABLE CONTENT LAYER (THE "CURTAIN")
        - This contains your main website AND the 4-column grid.
        - `z-10`: Sits ON TOP of the fixed footer.
        - `bg-black`: Opaque so it hides the KPR logo until scrolled.
        - `mb-[80vh]`: This margin creates the scroll space to reveal the footer. 
      */}
      <div className="relative z-10 shadow-[0_50px_100px_-20px_rgba(255,0,0,0.2)] border-b border-red-900/50">
        
        {/* Header */}
        {/* <nav className="flex justify-between items-center px-6 py-6 md:px-12 border-b border-red-900/30 bg-black">
           <div className="text-xl font-bold tracking-widest text-white">ADVAY // SYSTEM</div>
           <Menu className="w-6 h-6 text-red-500" />
        </nav> */}

        {/* Hero Section */}
        {/* <div className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12 border-b border-red-900/30 bg-black">
          <p className="text-xs text-red-500 mb-4 font-bold tracking-widest">SCROLL DOWN TO REVEAL</p>
          <h1 className="text-6xl md:text-9xl font-medium tracking-tight leading-none text-white mb-6">
            DIGITAL <br/> <span className="text-red-700">COLLECTIBLES</span>
          </h1>
        </div> */}

        {/* --- THE 4-COLUMN CONTENT GRID --- */}
        <div className="w-full bg-black">
          {/* Top Divider for Grid */}
          <div className="w-full h-px bg-red-900/50" />

          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-red-900/30">
            
            {/* COLUMN 1: DISCOVER */}
            <div className="p-8 flex flex-col justify-between group h-[60vh] md:h-[70vh] hover:bg-red-900/10 transition-colors border-red-900/30">
               <div className="flex items-start gap-3 text-xs text-red-500 font-bold tracking-widest">
                  <div className="w-2 h-2 bg-red-600 "></div>
                  <CipherText text="DISCOVER MORE" />
               </div>
               <div className="mt-auto">
                 <p className="text-neutral-400 text-sm max-w-[150px] group-hover:text-red-400 transition-colors">
                   Explore the ecosystem of digital assets and community driven lore.
                 </p>
               </div>
            </div>

            {/* COLUMN 2: LINKS */}
            <div className="p-8 flex flex-col justify-between hover:bg-red-900/10 transition-colors border-red-900/30">
              <div className="flex items-start gap-3 text-xs text-red-500 font-bold tracking-widest ">
                  <div className="w-2 h-2 bg-red-600 mt-[2px]"></div>
                  <CipherText text="SITEMAP" />
               </div>
              
              <nav className="flex flex-col gap-4 text-4xl font-black uppercase tracking-tighter leading-none">
                {['Story', 'Journal', 'Media', 'Gallery', 'About'].map((item) => (
                   <a key={item} href="#" className="text-white hover:text-red-500 transition-colors w-max">
                      <CipherText text={item} />
                   </a>
                ))}
              </nav>
            </div>

            {/* COLUMN 3: SOCIALS (UPDATED STRUCTURE) */}
            <div className="p-8 flex flex-col justify-between hover:bg-red-900/10 transition-colors border-red-900/30">
               {/* Added Header to match other columns */}
               <div className="flex items-start gap-3 text-xs text-red-500 font-bold tracking-widest mb-12">
                  <div className="w-2 h-2 bg-red-600 mt-[2px]"></div>
                  <CipherText text="SOCIALS" />
               </div>

               <div className="flex flex-col gap-4 text-4xl font-black uppercase tracking-tighter leading-none">
                  <a href="#" className="text-white hover:text-red-500 transition-colors w-max">
                      <CipherText text="TWITTER" />
                  </a>
                  <a href="#" className="text-white hover:text-red-500 transition-colors w-max">
                      <CipherText text="DISCORD" />
                  </a>
                  <a href="#" className="text-white hover:text-red-500 transition-colors w-max">
                      <CipherText text="INSTAGRAM" />
                  </a>
               </div>
            </div>

            {/* COLUMN 4: CTA */}
            <div className="p-8 flex flex-col justify-between hover:bg-red-900/10 transition-colors border-red-900/30">
               <div className="flex items-start gap-3 text-xs text-red-500 font-bold tracking-widest">
                  <div className="w-2 h-2 bg-red-600 mt-[2px]"></div>
                  <CipherText text="DETAILS" />
               </div>

               <div className="mt-12 md:mt-auto space-y-8">
                  <p className="text-xs text-neutral-400 uppercase tracking-widest leading-relaxed">
                    Have questions? <br/>
                    <span className="text-red-500 font-bold hover:text-white transition-colors cursor-pointer">HELLO@ADVAY.COM</span>
                  </p>
                  
                  {/* Updated Button for Red+Black Theme */}
                  <button className="w-full border border-red-600/50 py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-red-500 hover:bg-red-600 hover:text-black hover:border-red-600 transition-all duration-300 flex items-center justify-between group">
                    <span className="group-hover:translate-x-1 transition-transform">Brand Book</span>
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. THE FIXED FOOTER LAYER (THE "SUB LAYER")
        - `fixed bottom-0 z-0`: Locks it to the screen background.
        - Contains ONLY the Giant Text and the Legal Links.
        - This is revealed when the main content (above) scrolls up.
      */}
      <div className=" bottom-0 left-0 w-full h-[50vh] -z-10 flex flex-col justify-end bg-[#050000] overflow-hidden">
        
        {/* Giant Background Text (Dark Red) */}
        <div className="absolute inset-0 flex justify-center items-end pointer-events-none select-none pb-20 md:pb-0">
          <h1 className="text-[28vw] leading-[0.75] font-black tracking-tighter text-[#3a0505] whitespace-nowrap opacity-100">
            ADVAY'26
          </h1>
        </div>

        {/* Bottom Legal Strip */}
        <div className="relative z-10 w-full flex flex-wrap justify-center md:justify-between px-8 py-8 text-[10px] uppercase tracking-widest text-red-900/70 border-t border-red-900/20 bg-transparent">
            <div className="flex gap-8">
                <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-red-500 transition-colors">Legal License</a>
            </div>
            <div className="flex gap-2 text-red-900/50">
                 <span>© 2026 ADVAY SYSTEM</span>
            </div>
        </div>

      </div>

    </div>
  );
}