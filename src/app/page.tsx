'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// UI Components
import { BoundaryFrame, Navbar, HeroContent } from '@/components/ui'
import { Events } from '@/components/ui'
import TestScene4Page from './test-scene4/page'
import FooterContent from '@/components/ui/FooterContent'
import Scene2, { SmoothScrollProvider } from '@/components/canvas/Scene2'

// Dynamic import for Scene (no SSR for Three.js)
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

// ============================================
// MAIN PAGE CONTENT
// ============================================
export default function HomePage() {
  const [sceneReady, setSceneReady] = useState(false)
  const [canPlayAnimations, setCanPlayAnimations] = useState(false)

  useEffect(() => {
    // Wait for Scene to initialize before rendering overlay elements
    const timer = setTimeout(() => setSceneReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Check if loading sequence is complete
    // This assumes the AppWrapper sets opacity to 100 when done
    const checkLoadingComplete = () => {
      const mainContent = document.querySelector('[data-main-content]')
      if (mainContent) {
        const opacity = window.getComputedStyle(mainContent).opacity
        if (opacity === '1') {
          setCanPlayAnimations(true)
        }
      }
    }

    const interval = setInterval(checkLoadingComplete, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Main Hero Area - Scene renders first */}
      <main id='home' className='relative w-full h-screen overflow-hidden'>
        {/* Scene background layer */}
        {/* <div className='absolute w-full h-full z-0'>
          <Scene canPlayAnimations={canPlayAnimations} />
        </div> */}

        {/* UI overlay - renders after Scene is ready */}
        {sceneReady && (
          <div className='absolute w-full h-full z-50'>
            <BoundaryFrame />
            <Navbar />
            <HeroContent />
          </div>
        )}
      </main>

      {/* Other Scrollable Sections */}
      <div id = 'about'>
      <SmoothScrollProvider>
        <Scene2 />
      </SmoothScrollProvider>
      </div>
      <div id = 'events'>
      <Events />
      </div>
      <div id = 'gallery'>
      <TestScene4Page />
      </div>
      {/* The scrolling part of the footer */}
      <div id = 'contact'>
      <FooterContent />
      </div>
    </>
  )
}
