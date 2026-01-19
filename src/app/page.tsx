'use client';
import Image from "next/image";
import dynamic from 'next/dynamic';

// 1. Setup the dynamic import for the 3D Scene
const Scene3D = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false, 
  loading: () => <div className="flex h-full items-center justify-center text-white">Loading Advay Experience...</div>,
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      
      {/* BACKGROUND LAYER: The 3D Scene */}
      {/* We add pointer-events-none here to ensure the container itself doesn't block anything, 
          though usually the z-index handles this. */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* FOREGROUND LAYER: Your Logo and UI */}
      {/* CRITICAL CHANGE: 'pointer-events-none' makes this whole section click-through */}
      <section className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none">
        
        {/* Logo Container */}
        {/* We add 'pointer-events-auto' back so you can still click the logo if needed */}
        <div className="relative w-full h-[40vh] md:h-[60vh] max-w-4xl transition-all pointer-events-auto">
          <Image
            src="/images/mulearn-tist-logo.png"
            alt="Advay 2026 Fest Hero"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>

        {/* Text Container */}
        <div className="text-center mt-8 pointer-events-auto">
          <h1 className="text-white text-4xl font-bold tracking-widest uppercase">Advay 2026</h1>
          <p className="text-gray-400 mt-2">The Future is Here</p>
        </div>

      </section>
    </main>
  );
}