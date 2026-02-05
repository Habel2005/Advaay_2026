'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { COLORS } from '@/lib/constants'
import BoundaryFrame from '@/components/ui/BoundaryFrame'

// ============================================
// CONFIG & PRELOADING
// ============================================

const ALL_IMAGES = Array.from({ length: 20 }, (_, i) => `/images/gallery/event-${i + 1}.webp`)
const LEFT_IMAGES = ALL_IMAGES.slice(0, 10)
const RIGHT_IMAGES = ALL_IMAGES.slice(10, 20)

// Preload component to be rendered once
const ImagePreloader = React.memo(() => (
  <div style={{ display: 'none' }} aria-hidden="true">
    {ALL_IMAGES.map(src => <link key={src} rel="preload" href={src} as="image" />)}
  </div>
))

const FONTS = {
  heading: `'Monument Extended', system-ui, sans-serif`,
  body: `'Inter', system-ui, sans-serif`,
  mono: `'SF Mono', monospace`,
}

// Shared Constants
const SHIFT_DURATION = 400
const PAUSE_DURATION = 1200
const VISIBLE_CARDS = 6

// ============================================
// ATOMIC COMPONENTS
// ============================================

const CardContent = React.memo(({ src, isCenter, isMobile }: any) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#1a1a1a',
    boxShadow: isCenter ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${COLORS.red}15` : '0 10px 20px rgba(0,0,0,0.3)',
    border: `1px solid ${isCenter ? COLORS.red + '30' : 'rgba(255,255,255,0.1)'}`,
    isolation: 'isolate' // Creates new stacking context for GPU
  }}>
    <img
      src={src}
      alt=""
      loading="eager"
      decoding="async"
      style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
    />
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))',
      pointerEvents: 'none' 
    }} />
  </div>
))

// ============================================
// MOBILE & DESKTOP LOGIC (UNIFIED)
// ============================================

export default function Scene4() {
  const [isMobile, setIsMobile] = useState(false)
  const [leftStack, setLeftStack] = useState<any[]>([])
  const [rightStack, setRightStack] = useState<any[]>([])
  const [isShifting, setIsShifting] = useState(false)
  
  const idCounter = useRef(0)
  const imgIdx = useRef({ left: 0, right: 0 })

  // Handle Resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const nextStep = useCallback(() => {
    setIsShifting(true)
    const nidL = idCounter.current++
    const nidR = idCounter.current++
    
    const newL = { id: nidL, img: LEFT_IMAGES[imgIdx.current.left++ % LEFT_IMAGES.length], pos: 0 }
    const newR = { id: nidR, img: RIGHT_IMAGES[imgIdx.current.right++ % RIGHT_IMAGES.length], pos: 0 }

    setLeftStack(prev => [newL, ...prev.map(c => ({ ...c, pos: c.pos + 1 })).slice(0, VISIBLE_CARDS)])
    setRightStack(prev => [newR, ...prev.map(c => ({ ...c, pos: c.pos + 1 })).slice(0, VISIBLE_CARDS)])
    
    setTimeout(() => setIsShifting(false), SHIFT_DURATION)
  }, [])

  useEffect(() => {
    nextStep()
    const timer = setInterval(nextStep, PAUSE_DURATION + SHIFT_DURATION)
    return () => clearInterval(timer)
  }, [nextStep])

  return (
    <div id="gallery" style={{ 
      position: 'relative', width: '100%', height: '100vh', 
      background: COLORS.bg, overflow: 'hidden', display: 'flex', flexDirection: 'column' 
    }}>
      <ImagePreloader />
      <BoundaryFrame />
      
      {/* Header Section */}
      <div style={{ padding: isMobile ? '90px 24px' : '90px 120px', zIndex: 10 }}>
        <h2 style={{ 
          fontFamily: FONTS.heading, 
          fontSize: isMobile ? '32px' : 'clamp(40px, 5vw, 64px)', 
          lineHeight: 0.9, color: COLORS.text, margin: 0 
        }}>
          MEMORIES<br />OF <span style={{ color: COLORS.red }}>ADVAY</span>.
        </h2>
      </div>

      {/* Carousel Container */}
      <div style={{ 
        position: 'relative', flex: 1, perspective: '1200px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        {leftStack.concat(rightStack).map((card, i) => {
          const isLeft = i < leftStack.length
          const dir = isLeft ? -1 : 1
          const spacing = isMobile ? 60 : 160
          const x = dir * (110 + card.pos * spacing)
          const scale = 1 - (card.pos * 0.1)
          const opacity = 1 - (card.pos * 0.2)

          return (
            <div key={card.id} style={{
              position: 'absolute',
              width: isMobile ? 200 : 220,
              height: isMobile ? 280 : 320,
              transform: `translate3d(${x}px, 0, ${-card.pos * 50}px) scale(${scale})`,
              opacity: opacity > 0 ? opacity : 0,
              zIndex: 100 - card.pos,
              transition: isShifting ? `transform ${SHIFT_DURATION}ms cubic-bezier(0.2, 0, 0.2, 1), opacity ${SHIFT_DURATION}ms` : 'none',
              willChange: 'transform, opacity'
            }}>
              <CardContent src={card.img} isCenter={card.pos === 0} isMobile={isMobile} />
            </div>
          )
        })}
        
        {/* Center Accent Line */}
        <div style={{ 
          width: '2px', height: '40%', 
          background: `linear-gradient(to bottom, transparent, ${COLORS.red}, transparent)`, 
          opacity: 0.3 
        }} />
      </div>

      {/* Footer Info */}
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ maxWidth: '300px', opacity: 0.6, fontSize: '12px', fontFamily: FONTS.body }}>
          <p>Every moment captured. Every memory preserved.</p>
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.red }}>
          SCENE_004 // 20_MEMORIES
        </div>
      </div>
    </div>
  )
}
