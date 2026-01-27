'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// UI Components
import { BoundaryFrame, LoadingScreen, Navbar, HeroContent } from '@/components/ui'
import HeroAboutSponsors from '@/components/ui/HeroSection'
import { Events } from '@/components/ui'
import TestScene4Page from './test-scene4/page'

// Dynamic import for Scene (no SSR for Three.js)
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

// ============================================
// MAIN PAGE
// ============================================
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Eased progress
        const remaining = 100 - prev
        return prev + Math.max(1, remaining * 0.08)
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <main id='main-screen' className='relative bg-black' style={{
        // position: 'fixed', 
        inset: 0,

      }}>
        {/* 3D Background */}
        <Scene />

        {/* Loading Screen */}
        {isLoading && (
          <LoadingScreen
            progress={Math.round(progress)}
            onComplete={() => setIsLoading(false)}
          />
        )}

        {/* Main Content (after loading) */}
        {!isLoading && (
          <>
            {/* KPR Verse Style Boundary Frame */}
            <BoundaryFrame />

            {/* Navigation Bar */}
            <Navbar />

            {/* Hero Content */}
            <HeroContent />
          </>
        )}

      </main>
      <HeroAboutSponsors />
      <Events />
      <TestScene4Page />
    </div>
  )
}