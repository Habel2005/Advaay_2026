'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// UI Components
import { BoundaryFrame, Navbar, HeroContent } from '@/components/ui'
import { Events } from '@/components/ui'
import FooterContent from '@/components/ui/FooterContent'
import Scene2 from '@/components/canvas/Scene2' 

// Dynamic imports for Scenes
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

const Scene4 = dynamic(() => import('@/components/canvas/Scene4'), {
  ssr: false,
  loading: () => <div className="h-[100vh] bg-[#0D0D0D]" />,
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
        <Scene2 />
      </div>
      
      <div id='events'>
        <Events />
      </div>
      
      <div id='gallery'>
        <Scene4 />
      </div>
      
      <div id='contact'>
        <FooterContent />
      </div>
    </>
  )
}