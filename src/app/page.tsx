'use client';
import Image from "next/image";
import dynamic from 'next/dynamic';
import HeroSection from "@/components/ui/HeroSection";

// 1. Setup the dynamic import for the 3D Scene
const Scene3D = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-white">Loading Advay Experience...</div>,
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black ">
      <HeroSection />


      


    </main>
  );
}