'use client'

import dynamic from 'next/dynamic'
import Scene2 from "@/components/canvas/Scene2";
import { SmoothScrollProvider } from "@/components/canvas/Scene2";
// UI Components
import { BoundaryFrame, Navbar, HeroContent } from '@/components/ui'

import EventsSection from '@/components/ui/EventsSection'
import TestScene4Page from './test-scene4/page'
import FooterContent from '@/components/ui/FooterContent' // Correctly import the new component

// Dynamic import for Scene (no SSR for Three.js)
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

// ============================================
// MAIN PAGE CONTENT
// ============================================
export default function HomePage() {
  return (
    <>
      {/* Main Hero Area */}
      <main id='main-screen' className='relative w-full h-screen bg-black overflow-hidden z-20'>
        <Scene />
        <BoundaryFrame />
        <Navbar />
        <HeroContent />
        {/* Bottom gradient fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />
      </main>

      {/* Other Scrollable Sections */}
      <SmoothScrollProvider>
        <Scene2 />
      </SmoothScrollProvider>
      <EventsSection />
      <TestScene4Page />

      {/* The scrolling part of the footer */}
      <FooterContent />
    </>
  )
}
