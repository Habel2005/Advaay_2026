'use client';
import CipherText from './CipherText';

// This is the fixed part of the footer that is revealed on scroll.
export default function FooterReveal() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[70vh] md:h-[50vh] z-0 flex flex-col justify-end bg-[#050000] overflow-hidden">
      
      {/* 1. GIANT BACKGROUND TEXT */}
      <div className="absolute inset-0 flex justify-center items-end pointer-events-none select-none z-0 pb-20 md:pb-0">
        <h1 className="text-[20vw] md:text-[23vw] leading-[0.75] font-black tracking-tighter text-[#3a0505] whitespace-nowrap">
          ADVAY'26
        </h1>
      </div>

      {/* 2. BOTTOM LEGAL STRIP */}
      <div className="relative z-10 w-full flex flex-wrap justify-center md:justify-between px-8 py-8 text-[10px] uppercase tracking-widest text-red-900/70 border-t border-red-900/20 bg-transparent">
          <div className="flex gap-4 md:gap-8">
              <a href="#" className="hover:text-red-500 transition-colors"><CipherText text="Privacy Policy"></CipherText></a>
              <a href="#" className="hover:text-red-500 transition-colors"><CipherText text="Terms of Service"></CipherText></a>
          </div>
          <div className="flex gap-2 text-red-900/50 mt-4 md:mt-0">
                <span>© 2026 ADVAAY</span>
          </div>
      </div>

    </div>
  );
}