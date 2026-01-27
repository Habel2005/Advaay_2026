'use client'

import dynamic from 'next/dynamic'

// UI Components
import { BoundaryFrame, Navbar, HeroContent } from '@/components/ui'
import HeroAboutSponsors from '@/components/ui/HeroSection'
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
      <main id='main-screen' className='relative w-full h-screen bg-black overflow-hidden'>
        <Scene />
        <BoundaryFrame />
        <Navbar />
        <HeroContent />
      </main>

      {/* Other Scrollable Sections */}
      <HeroAboutSponsors />
      <EventsSection />
      <TestScene4Page />
      
      {/* The scrolling part of the footer */}
      <FooterContent />
    </>
  )
}
