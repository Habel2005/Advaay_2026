'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from "@/components/ui/loading/Loader";
import LogoReveal from "@/components/ui/loading/LogoReveal";
import FooterReveal from '@/components/ui/FooterReveal';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/canvas/Scene'), { 
  ssr: false 
});

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // Ref to track if the Hero section is visible
  const heroTrackerRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const [videoReady, setVideoReady] = useState(!isHome);
  const [loaderDone, setLoaderDone] = useState(!isHome);
  const [revealDone, setRevealDone] = useState(!isHome);

  // Observer Logic
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 } 
    );
    if (heroTrackerRef.current) observer.observe(heroTrackerRef.current);
    return () => observer.disconnect();
  }, [isHome]);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);
  const handleLoaderFinished = useCallback(() => setLoaderDone(true), []);
  const handleRevealComplete = useCallback(() => setRevealDone(true), []);

  const canReveal = loaderDone && videoReady;

  return (
    <>
      {isHome && !revealDone && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className={`absolute inset-0 z-20 transition-opacity duration-700 ${loaderDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Loader canFinish={videoReady} onFinished={handleLoaderFinished} />
          </div>
          <div className="absolute inset-0 z-10">
            <LogoReveal active={canReveal} onReady={handleVideoReady} onComplete={handleRevealComplete} />
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-700 ${revealDone ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* The sensor: when this leaves the screen, the 3D pauses */}
        <div ref={heroTrackerRef} className="absolute top-0 left-0 w-full h-screen pointer-events-none" />

        <div 
          className='fixed w-full h-full z-10 bg-black'
          style={{ visibility: isHeroVisible ? 'visible' : 'hidden' }}
        >
          {/* Pass the paused state to the Scene */}
          <Scene canPlayAnimations={revealDone} isPaused={!isHeroVisible} />
        </div>

        <div className="relative z-30 mb-[10vh] md:mb-[46vh] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {children}
        </div>

        <FooterReveal />
      </div>
    </>
  );
}