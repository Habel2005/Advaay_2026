'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { COLORS } from '@/lib/constants'
import BoundaryFrame from '@/components/ui/BoundaryFrame'

// ============================================
// ADVAY 2026 - SCENE 4: GALLERY / MEMORIES
// Desktop: Two-sided outward flow
// Mobile: KPR-style ping-pong alternating flow
// ============================================

const FONTS = {
  heading: `'Monument Extended', 'PP Monument Extended', 'Anton', 'Bebas Neue', 'Oswald', system-ui, sans-serif`,
  body: `'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif`,
  mono: `'SF Mono', 'Fira Code', 'Consolas', monospace`,
}

// 20 images total
const ALL_IMAGES = Array.from({ length: 20 }, (_, i) => 
  `https://picsum.photos/seed/advay${i + 1}/400/560`
)

const LEFT_IMAGES = ALL_IMAGES.slice(0, 10)
const RIGHT_IMAGES = ALL_IMAGES.slice(10, 20)

// ============================================
// CONFIGURATION
// ============================================

// Desktop Settings
const DESKTOP_WIDTH = 200
const DESKTOP_HEIGHT = 300
const DESKTOP_SPACING = 160
const VISIBLE_CARDS_DESKTOP = 6

// Mobile Settings
const MOBILE_WIDTH = 160
const MOBILE_HEIGHT = 240
const MOBILE_SIDE_OFFSET = 120 // How far side cards are from center

// Animation timing
const PAUSE_DURATION = 1200    
const SHIFT_DURATION = 400     

const CARD_OVERLAYS = [
  'rgba(229, 9, 20, 0.12)',
  'rgba(178, 7, 16, 0.15)',
  'rgba(113, 121, 126, 0.12)',
  'rgba(229, 9, 20, 0.08)',
  'rgba(13, 13, 13, 0.2)',
  'rgba(229, 228, 226, 0.08)',
]

interface CardState {
  id: number
  imageIndex: number
  position: number
}

interface MobileCardState {
  id: number
  imageIndex: number
  position: 'left' | 'center' | 'right' | 'exiting-left' | 'exiting-right' | 'hidden'
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return isMobile
}

// ============================================
// DESKTOP GALLERY CARD
// ============================================
function DesktopGalleryCard({ 
  imageUrl,
  imageIndex,
  position, 
  side, 
  maxPosition,
  isShifting,
}: {
  imageUrl: string
  imageIndex: number
  position: number 
  side: 'left' | 'right'
  maxPosition: number
  isShifting: boolean
}) {
  const direction = side === 'left' ? -1 : 1
  
  const centerCardOffset = (DESKTOP_WIDTH / 2) + 10
  
  let moveOffset: number
  if (position === 0) {
    moveOffset = direction * centerCardOffset
  } else {
    moveOffset = direction * (centerCardOffset + (position * DESKTOP_SPACING))
  }
  
  const normalizedPos = Math.max(0, Math.min(position / maxPosition, 1))
  const scale = 1.1 - (normalizedPos * 0.25)
  const zIndex = position === 0 ? 120 : Math.round(100 - position * 10)
  const translateZ = 50 - normalizedPos * 100
  const isCenter = position < 1.5
  const overlayColor = CARD_OVERLAYS[imageIndex % CARD_OVERLAYS.length]

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${DESKTOP_WIDTH}px`,
        height: `${DESKTOP_HEIGHT}px`,
        marginLeft: `${-DESKTOP_WIDTH / 2}px`,
        marginTop: `${-DESKTOP_HEIGHT / 2}px`,
        transform: `translate3d(${moveOffset}px, 0px, ${translateZ}px) scale(${scale})`,
        zIndex,
        transformStyle: 'preserve-3d',
        transition: isShifting 
          ? `transform ${SHIFT_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
          : 'none',
        willChange: 'transform',
      }}
    >
      <CardContent imageUrl={imageUrl} overlayColor={overlayColor} isCenter={isCenter} />
    </div>
  )
}

// ============================================
// MOBILE GALLERY CARD - With Tilt
// ============================================
function MobileGalleryCard({ 
  imageUrl,
  imageIndex,
  cardPosition, // 'left' | 'center' | 'right' | 'exiting-left' | 'exiting-right'
  isShifting,
  zIndex,
}: {
  imageUrl: string
  imageIndex: number
  cardPosition: 'left' | 'center' | 'right' | 'exiting-left' | 'exiting-right' | 'hidden'
  isShifting: boolean
  zIndex: number
}) {
  // Calculate transform based on position
  let translateX = 0
  let rotation = 0
  let scale = 1
  let opacity = 1
  
  switch (cardPosition) {
    case 'left':
      translateX = -MOBILE_SIDE_OFFSET
      rotation = -12 // Tilted left
      scale = 0.85
      break
    case 'right':
      translateX = MOBILE_SIDE_OFFSET
      rotation = 12 // Tilted right
      scale = 0.85
      break
    case 'center':
      translateX = 0
      rotation = 0 // Straight
      scale = 1
      break
    case 'exiting-left':
      translateX = -MOBILE_SIDE_OFFSET * 1.8
      rotation = -20
      scale = 0.7
      opacity = 0
      break
    case 'exiting-right':
      translateX = MOBILE_SIDE_OFFSET * 1.8
      rotation = 20
      scale = 0.7
      opacity = 0
      break
    case 'hidden':
      opacity = 0
      scale = 0.5
      break
  }
  
  const overlayColor = CARD_OVERLAYS[imageIndex % CARD_OVERLAYS.length]
  const isCenter = cardPosition === 'center'

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${MOBILE_WIDTH}px`,
        height: `${MOBILE_HEIGHT}px`,
        marginLeft: `${-MOBILE_WIDTH / 2}px`,
        marginTop: `${-MOBILE_HEIGHT / 2}px`,
        transform: `translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        zIndex,
        transition: isShifting 
          ? `transform ${SHIFT_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${SHIFT_DURATION}ms ease-out`
          : 'none',
        willChange: 'transform, opacity',
      }}
    >
      <CardContent imageUrl={imageUrl} overlayColor={overlayColor} isCenter={isCenter} />
    </div>
  )
}

// ============================================
// SHARED CARD CONTENT
// ============================================
function CardContent({ 
  imageUrl, 
  overlayColor, 
  isCenter 
}: { 
  imageUrl: string
  overlayColor: string
  isCenter: boolean 
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isCenter 
          ? `0 25px 50px rgba(0,0,0,0.5), 0 0 40px ${COLORS.red}20`
          : '0 15px 35px rgba(0,0,0,0.4)',
        border: isCenter ? `1px solid ${COLORS.red}25` : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <img
        src={imageUrl}
        alt="Advay Memory"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
      <div style={{ position: 'absolute', inset: 0, background: overlayColor, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </div>
  )
}

// ============================================
// DESKTOP CAROUSEL (unchanged logic)
// ============================================
function DesktopCarousel() {
  const [leftCards, setLeftCards] = useState<CardState[]>([])
  const [rightCards, setRightCards] = useState<CardState[]>([])
  const [isShifting, setIsShifting] = useState(false)
  
  const leftImageCounterRef = useRef(0)
  const rightImageCounterRef = useRef(0)
  const cardIdCounterRef = useRef(0)
  
  const addNewCards = useCallback(() => {
    setIsShifting(true)
    
    const newLeft: CardState = {
      id: cardIdCounterRef.current++,
      imageIndex: leftImageCounterRef.current++ % LEFT_IMAGES.length,
      position: 0,
    }
    const newRight: CardState = {
      id: cardIdCounterRef.current++,
      imageIndex: rightImageCounterRef.current++ % RIGHT_IMAGES.length,
      position: 0,
    }
    
    setLeftCards(prev => [newLeft, ...prev.map(c => ({ ...c, position: c.position + 1 })).filter(c => c.position <= VISIBLE_CARDS_DESKTOP)])
    setRightCards(prev => [newRight, ...prev.map(c => ({ ...c, position: c.position + 1 })).filter(c => c.position <= VISIBLE_CARDS_DESKTOP)])
    
    setTimeout(() => setIsShifting(false), SHIFT_DURATION)
  }, [])
  
  useEffect(() => {
    addNewCards()
    const interval = setInterval(addNewCards, PAUSE_DURATION + SHIFT_DURATION)
    return () => clearInterval(interval)
  }, [addNewCards])
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', perspective: '1200px', perspectiveOrigin: '50% 50%', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {leftCards.map(card => (
          <DesktopGalleryCard 
            key={card.id} 
            imageUrl={LEFT_IMAGES[card.imageIndex]} 
            imageIndex={card.imageIndex} 
            position={card.position} 
            side="left" 
            maxPosition={VISIBLE_CARDS_DESKTOP} 
            isShifting={isShifting} 
          />
        ))}
        {rightCards.map(card => (
          <DesktopGalleryCard 
            key={card.id} 
            imageUrl={RIGHT_IMAGES[card.imageIndex]} 
            imageIndex={card.imageIndex} 
            position={card.position} 
            side="right" 
            maxPosition={VISIBLE_CARDS_DESKTOP} 
            isShifting={isShifting} 
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '4px', height: '100%', background: `linear-gradient(180deg, transparent 5%, ${COLORS.red}40 20%, ${COLORS.red}60 50%, ${COLORS.red}40 80%, transparent 95%)`, boxShadow: `0 0 20px ${COLORS.red}30`, zIndex: 50 }} />
      <div style={{ position: 'absolute', left: '50%', top: '15px', transform: 'translateX(-50%)', color: COLORS.textMuted, fontSize: '12px', opacity: 0.5, animation: 'bounceUp 1.5s ease-in-out infinite' }}>▲</div>
      <div style={{ position: 'absolute', left: '50%', bottom: '15px', transform: 'translateX(-50%)', color: COLORS.textMuted, fontSize: '12px', opacity: 0.5, animation: 'bounceDown 1.5s ease-in-out infinite' }}>▼</div>
    </div>
  )
}

// ============================================
// MOBILE CAROUSEL - KPR Ping-Pong Style
// Alternating: Left→Center→Right, then Right→Center→Left
// ============================================
function MobileCarousel() {
  // Track 3 visible cards: incoming, center, outgoing
  const [cards, setCards] = useState<MobileCardState[]>([])
  const [isShifting, setIsShifting] = useState(false)
  
  // Alternating direction: true = coming from left, false = coming from right
  const [comingFromLeft, setComingFromLeft] = useState(true)
  
  const imageCounterRef = useRef(0)
  const cardIdCounterRef = useRef(0)
  
  // Initialize with first center card
  useEffect(() => {
    const initialCard: MobileCardState = {
      id: cardIdCounterRef.current++,
      imageIndex: imageCounterRef.current++ % ALL_IMAGES.length,
      position: 'center',
    }
    setCards([initialCard])
  }, [])
  
  const animateStep = useCallback(() => {
    setIsShifting(true)
    
    // Create new incoming card
    const newCard: MobileCardState = {
      id: cardIdCounterRef.current++,
      imageIndex: imageCounterRef.current++ % ALL_IMAGES.length,
      position: comingFromLeft ? 'left' : 'right', // Start position
    }
    
    setCards(prev => {
      // Find current center card
      const currentCenter = prev.find(c => c.position === 'center')
      
      // Update positions with explicit type casting
      const updated = prev
        .filter(c => c.position !== 'exiting-left' && c.position !== 'exiting-right' && c.position !== 'hidden')
        .map(c => {
          if (c.position === 'center') {
            // Center exits to opposite of where new card is coming from
            const exitPos: 'exiting-right' | 'exiting-left' = comingFromLeft ? 'exiting-right' : 'exiting-left'
            return { ...c, position: exitPos }
          }
          if (c.position === 'left' || c.position === 'right') {
            // Any side card becomes hidden (exit completely)
            const hiddenPos: 'hidden' = 'hidden'
            return { ...c, position: hiddenPos }
          }
          return c
        })
      
      return [newCard, ...updated]
    })
    
    // After a brief moment, move incoming card to center
    setTimeout(() => {
      setCards(prev => prev.map(c => {
        if (c.position === 'left' || c.position === 'right') {
          const centerPos: 'center' = 'center'
          return { ...c, position: centerPos }
        }
        return c
      }))
    }, 50)
    
    // Clean up exited cards and end shifting
    setTimeout(() => {
      setIsShifting(false)
      setCards(prev => prev.filter(c => 
        c.position !== 'exiting-left' && 
        c.position !== 'exiting-right' && 
        c.position !== 'hidden'
      ))
    }, SHIFT_DURATION + 100)
    
    // Toggle direction for next iteration
    setComingFromLeft(prev => !prev)
  }, [comingFromLeft])
  
  // Animation loop
  useEffect(() => {
    // Start after initial delay
    const initialTimeout = setTimeout(() => {
      animateStep()
    }, PAUSE_DURATION)
    
    const interval = setInterval(() => {
      animateStep()
    }, PAUSE_DURATION + SHIFT_DURATION + 100)
    
    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [animateStep])
  
  // Calculate z-index: incoming card is always on top
  const getZIndex = (position: string): number => {
    switch (position) {
      case 'left':
      case 'right':
        return 110 // Incoming is highest
      case 'center':
        return 100
      case 'exiting-left':
      case 'exiting-right':
        return 90
      default:
        return 80
    }
  }
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
      {cards.map(card => (
        <MobileGalleryCard
          key={card.id}
          imageUrl={ALL_IMAGES[card.imageIndex]}
          imageIndex={card.imageIndex}
          cardPosition={card.position}
          isShifting={isShifting}
          zIndex={getZIndex(card.position)}
        />
      ))}
      
      {/* Subtle center indicator */}
      <div style={{ 
        position: 'absolute', 
        left: '50%', 
        bottom: '20px', 
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 50,
      }}>
        <div style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: comingFromLeft ? COLORS.red : `${COLORS.textMuted}40`,
          transition: 'background 0.3s',
        }} />
        <div style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: `${COLORS.textMuted}60`,
        }} />
        <div style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: !comingFromLeft ? COLORS.red : `${COLORS.textMuted}40`,
          transition: 'background 0.3s',
        }} />
      </div>
    </div>
  )
}

// ============================================
// SHARED COMPONENTS
// ============================================
function Crosshair() {
  return (
    <div style={{ position: 'absolute', left: '44px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: '1px', height: '24px', background: COLORS.textMuted, opacity: 0.6 }} />
      <div style={{ position: 'absolute', width: '24px', height: '1px', background: COLORS.textMuted, opacity: 0.6 }} />
    </div>
  )
}

function SectionCounter({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.textMuted, letterSpacing: '0.05em', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', ...(isMobile ? { marginBottom: '12px' } : { position: 'absolute', top: '100px', left: '120px' }) }}>
      <span style={{ color: COLORS.red, fontSize: '8px' }}>●</span>
      <span>004</span>
    </div>
  )
}

// ============================================
// MAIN SCENE 4 COMPONENT
// ============================================
export default function Scene4({ className = '' }: { className?: string }) {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return (
      <div className={className} style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '600px', background: COLORS.bg, overflow: 'hidden' }}>
        <style jsx>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500&display=swap');`}</style>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${COLORS.red}08 0%, transparent 60%), ${COLORS.bg}`, pointerEvents: 'none' }} />
        <BoundaryFrame />
        <div style={{ position: 'absolute', top: '60px', left: '24px', right: '24px', zIndex: 1 }}>
          <SectionCounter isMobile />
          <h2 style={{ fontFamily: FONTS.heading, fontSize: '26px', fontWeight: 900, lineHeight: 0.95, color: COLORS.text, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            MEMORIES<br />OF <span style={{ color: COLORS.red }}>ADVAY</span>.
          </h2>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
          <MobileCarousel />
        </div>
        <div style={{ position: 'absolute', bottom: '50px', left: '24px', right: '70px', zIndex: 1 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: '8px', letterSpacing: '0.15em', color: COLORS.textMuted, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
            <span style={{ color: COLORS.red, fontSize: '5px' }}>■</span> GALLERY COLLECTION
          </div>
          <p style={{ fontFamily: FONTS.body, fontSize: '11px', lineHeight: 1.55, color: COLORS.textMuted, margin: 0 }}>
            Moments that define ADVAY, flowing endlessly.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '650px', maxHeight: '900px', background: COLORS.bg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500&display=swap');
        @keyframes bounceUp { 0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; } 50% { transform: translateX(-50%) translateY(-6px); opacity: 0.8; } }
        @keyframes bounceDown { 0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; } 50% { transform: translateX(-50%) translateY(6px); opacity: 0.8; } }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${COLORS.red}08 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${COLORS.redDark}05 0%, transparent 50%), ${COLORS.bg}`, pointerEvents: 'none' }} />
      <BoundaryFrame />
      <Crosshair />
      <SectionCounter isMobile={false} />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '90px 120px 20px', flex: '0 0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ paddingTop: '30px' }}>
          <h2 style={{ fontFamily: FONTS.heading, fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 900, lineHeight: 0.92, color: COLORS.text, letterSpacing: '-0.03em', margin: 0, textTransform: 'uppercase' }}>
            MEMORIES<br />OF <span style={{ color: COLORS.red }}>ADVAY</span>.
          </h2>
        </div>
        <div style={{ paddingTop: '30px', maxWidth: '400px' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.18em', color: COLORS.textMuted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase' }}>
            <span style={{ color: COLORS.red, fontSize: '6px' }}>■</span> GALLERY COLLECTION
          </div>
          <p style={{ fontFamily: FONTS.body, fontSize: '14px', lineHeight: 1.7, color: COLORS.textMuted, margin: 0 }}>
            Every moment captured, every memory preserved. Relive the energy, creativity, and celebration that defines ADVAY. Cards emerge from the center, carrying memories to the edges of time.
          </p>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
        <DesktopCarousel />
      </div>
      <div style={{ position: 'absolute', bottom: '24px', left: '44px', fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.textMuted, opacity: 0.4, letterSpacing: '0.15em' }}>////</div>
      <div style={{ position: 'absolute', bottom: '24px', right: '44px', fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.textMuted, opacity: 0.7 }}>
        <span style={{ color: COLORS.red }}>20</span><span style={{ opacity: 0.4 }}> MEMORIES</span>
      </div>
    </div>
  )
}