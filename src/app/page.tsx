'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// UI Components
import { BoundaryFrame, Navbar, HeroContent } from '@/components/ui'
import { Events } from '@/components/ui'
import TestScene4Page from './test-scene4/page'
import FooterContent from '@/components/ui/FooterContent'
import Scene2 from '@/components/canvas/Scene2' // REMOVED SmoothScrollProvider import

// Dynamic import for Scene
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function HomePage() {
  const [sceneReady, setSceneReady] = useState(false)
  const [canPlayAnimations, setCanPlayAnimations] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
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
      <main id='home' className='relative w-full h-screen overflow-hidden'>
        {sceneReady && (
          <div className='absolute w-full h-full z-50'>
            <BoundaryFrame />
            <Navbar />
            <HeroContent />
          </div>
        )}
      </main>

      {/* Other Scrollable Sections */}
      <div id='about'>
        {/* REMOVED SmoothScrollProvider wrapper */}
        <Scene2 />
      </div>
      
      <div id='events'>
        <Events />
      </div>
      
      <div id='gallery'>
        <TestScene4Page />
      </div>
      
      <div id='contact'>
        <FooterContent />
      </div>
    </>
  )
}