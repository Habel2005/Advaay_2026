'use client';
import Image from "next/image";
import dynamic from 'next/dynamic';
import HeroSection from "@/components/ui/HeroSection";
import EventsSection from "@/components/ui/EventsSection";
import AboutSection from "@/components/ui/AboutSection";

// 1. Setup the dynamic import for the 3D Scene
const Scene3D = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-white">Loading Advay Experience...</div>,
});

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black ">
      {/* <div className="absolute inset-0 z-30 border-x-2 border-t-2 lg:mx-8 mt-8 max-md:border-0 border-red-500">
        <div className="absolute inset-0 z-10 border-x-2 border-t-2 mx-8 mt-8 max-md:border-0 border-red-500"/>
      </div> */}
        <HeroSection />
        <EventsSection />
        {/* <AboutSection/> */}




      {/* </div> */}
    </main>
  );
}