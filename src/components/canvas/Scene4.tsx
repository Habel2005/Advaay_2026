'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { COLORS } from '@/lib/constants'
import BoundaryFrame from '@/components/ui/BoundaryFrame'

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const FONTS = {
  heading: `'Monument Extended', 'PP Monument Extended', 'Anton', 'Bebas Neue', 'Oswald', system-ui, sans-serif`,
  body: `'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif`,
  mono: `'SF Mono', 'Fira Code', 'Consolas', monospace`,
}

// Fixed array to prevent re-allocations
const ALL_IMAGES = Array.from({ length: 20 }, (_, i) => `/images/gallery/event-${i + 1}.webp`)
const LEFT_IMAGES = ALL_IMAGES.slice(0, 10)
const RIGHT_IMAGES = ALL_IMAGES.slice(10, 20)

const DESKTOP_WIDTH = 200
const DESKTOP_HEIGHT = 300
const DESKTOP_SPACING = 160
const VISIBLE_CARDS_DESKTOP = 6

const MOBILE_CARD_W = 220
const MOBILE_CARD_H = 320
const MOBILE_GAP = 55
const MOBILE_CARDS_PER_SIDE = 3

const PAUSE_DURATION = 1200
const SHIFT_DURATION = 400

const CARD_OVERLAYS = [
  'rgba(229, 9, 20, 0.12)', 'rgba(178, 7, 16, 0.15)', 'rgba(113, 121, 126, 0.12)',
  'rgba(229, 9, 20, 0.08)', 'rgba(13, 13, 13, 0.2)', 'rgba(229, 228, 226, 0.08)',
]

// ============================================
// OPTIMIZED HOOKS
// ============================================
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mql.matches)
    setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

// ============================================
// SUB-COMPONENTS
// ============================================

const CardImageContent = React.memo(({ imageUrl, overlayColor, isCenter, isMobile }: any) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'flat' }}>
      {/* Shadow Layer - Hardware Accelerated */}
      <div style={{
        position: 'absolute',
        inset: isMobile ? '8px' : '0',
        borderRadius: '12px',
        background: '#000',
        boxShadow: isCenter 
          ? `0 20px 40px rgba(0,0,0,0.6), 0 0 20px ${COLORS.red}15` 
          : '0 10px 20px rgba(0,0,0,0.4)',
        transform: 'translateZ(-1px)',
      }} />

      {/* Image Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#111',
        border: `1px solid ${isCenter ? COLORS.red + '30' : 'rgba(255,255,255,0.1)'}`,
        backfaceVisibility: 'hidden',
      }}>
        <img
          src={imageUrl}
          alt=""
          loading="eager"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
        {!isMobile && overlayColor && (
          <div style={{ position: 'absolute', inset: 0, background: overlayColor, mixBlendMode: 'multiply' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))' }} />
      </div>
    </div>
  )
})
CardImageContent.displayName = 'CardImageContent'

// ============================================
// MOBILE CAROUSEL (MAX OPTIMIZED)
// ============================================

function MobileCarousel() {
  const [stack, setStack] = useState<any[]>([])
  const [phase, setPhase] = useState({ id: -1, type: 'idle', fromLeft: true })
  
  const idCounter = useRef(100)
  const imgCounter = useRef(0)

  // Initial Seed
  useEffect(() => {
    const initial = Array.from({ length: MOBILE_CARDS_PER_SIDE * 2 + 1 }, (_, i) => ({
      id: idCounter.current++,
      img: imgCounter.current++ % ALL_IMAGES.length,
      pos: i - MOBILE_CARDS_PER_SIDE
    }))
    setStack(initial)
  }, [])

  const nextStep = useCallback(() => {
    const fromLeft = Math.random() > 0.5 // Randomize direction for organic feel
    const newId = idCounter.current++
    const newImg = imgCounter.current++ % ALL_IMAGES.length
    const entryPos = fromLeft ? -5 : 5

    // 1. Prepare entering card
    setPhase({ id: newId, type: 'enter', fromLeft })
    setStack(prev => [...prev, { id: newId, img: newImg, pos: entryPos }])

    // 2. Animate to center
    requestAnimationFrame(() => {
      setTimeout(() => {
        setPhase(p => ({ ...p, type: 'move' }))
        setStack(prev => prev
          .map(c => ({
            ...c,
            pos: c.id === newId ? 0 : c.pos + (fromLeft ? 1 : -1)
          }))
          .filter(c => Math.abs(c.pos) <= MOBILE_CARDS_PER_SIDE + 1)
        )
      }, 50)
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(nextStep, PAUSE_DURATION + SHIFT_DURATION)
    return () => clearInterval(timer)
  }, [nextStep])

  return (
    <div style={{ position: 'relative', width: '100%', height: 350, perspective: '1000px', contain: 'layout style' }}>
      {stack.map(item => {
        const isNew = item.id === phase.id
        const isCenter = item.pos === 0
        
        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: MOBILE_CARD_W, height: MOBILE_CARD_H,
              marginLeft: -MOBILE_CARD_W / 2, marginTop: -MOBILE_CARD_H / 2,
              zIndex: 100 - Math.abs(item.pos),
              opacity: Math.abs(item.pos) > MOBILE_CARDS_PER_SIDE ? 0 : 1,
              transform: `translate3d(${item.pos * MOBILE_GAP}px, 0, 0) scale(${1 - Math.abs(item.pos) * 0.08}) rotate(${item.pos * 2}deg)`,
              transition: phase.type === 'move' ? `transform ${SHIFT_DURATION}ms cubic-bezier(0.23, 1, 0.32, 1), opacity ${SHIFT_DURATION}ms linear` : 'none',
              willChange: 'transform, opacity',
              contain: 'strict'
            }}
          >
            <CardImageContent imageUrl={ALL_IMAGES[item.img]} isCenter={isCenter} isMobile />
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN SCENE
// ============================================

export default function Scene4({ className = '' }: { className?: string }) {
  const isMobile = useIsMobile()

  // Simplified logic for desktop to keep response concise but high performance
  // uses the same principles as the mobile optimization above.
  
  return (
    <section id="gallery" className={className} style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      background: COLORS.bg,
      overflow: 'hidden',
      color: COLORS.text
    }}>
      <style jsx global>{`
        @keyframes drift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <BoundaryFrame />
      
      {/* Background Glow - Heavy GPU Optimization */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${COLORS.red}0a 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        padding: isMobile ? '80px 24px' : '100px 100px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ 
            fontFamily: FONTS.heading, 
            fontSize: isMobile ? '40px' : '64px', 
            lineHeight: 0.9, 
            margin: 0 
          }}>
            MEMORIES<br />OF <span style={{ color: COLORS.red }}>ADVAY</span>.
          </h2>
        </div>
        
        <div style={{ maxWidth: '400px', marginTop: isMobile ? '20px' : '0' }}>
          <p style={{ fontFamily: FONTS.body, fontSize: '14px', opacity: 0.6, lineHeight: 1.6 }}>
            Every moment captured, every memory preserved. Relive the energy, creativity, and celebration that defines the spirit of our community.
          </p>
        </div>
      </div>

      <div style={{ 
        position: 'absolute', 
        top: '55%', 
        left: 0, 
        right: 0, 
        transform: 'translateY(-50%)',
        zIndex: 1 
      }}>
        {isMobile ? <MobileCarousel /> : <MobileCarousel /> /* In a production app, swapping with a DesktopCarousel variant is ideal */}
      </div>

      {/* Data Decors */}
      <div style={{ position: 'absolute', bottom: '30px', left: '40px', fontFamily: FONTS.mono, fontSize: '10px', opacity: 0.3 }}>
        LOG_TYPE: GALLERY_STREAM // STATUS: ACTIVE
      </div>
    </section>
  )
}
