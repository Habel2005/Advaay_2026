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
const ALL_IMAGES = [
  '/images/gallery/event-1.JPG',
  '/images/gallery/event-2.JPG',
  '/images/gallery/event-3.JPG',
  '/images/gallery/event-4.JPG',
  '/images/gallery/event-5.JPG',
  '/images/gallery/event-6.JPG',
  '/images/gallery/event-7.JPG',
  '/images/gallery/event-8.JPG',
  '/images/gallery/event-9.JPG',
  '/images/gallery/event-10.JPG',
  '/images/gallery/event-11.JPG',
  '/images/gallery/event-12.JPG',
  '/images/gallery/event-13.JPG',
  '/images/gallery/event-14.JPG',
  '/images/gallery/event-15.JPG',
  '/images/gallery/event-16.JPG',
  '/images/gallery/event-17.JPG',
  '/images/gallery/event-18.JPG',
  '/images/gallery/event-19.jpg',
  '/images/gallery/event-20.JPG',
]

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

// Mobile Settings - handled in MobileStackCard component

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
// MOBILE CAROUSEL - KPR Style Animation
// ============================================

// MODIFICATION: Increased size
const MOBILE_CARD_W = 220
const MOBILE_CARD_H = 320
const MOBILE_GAP = 55

function MobileCarousel() {
  const [stack, setStack] = useState<Array<{ id: number, img: number, pos: number }>>([])
  const [comingFromLeft, setComingFromLeft] = useState(true)
  const [newCardId, setNewCardId] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'enter' | 'move'>('idle')

  const idCounter = useRef(100)
  const imgCounter = useRef(0)
  const initialized = useRef(false)

  const CARDS_PER_SIDE = 3

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initial: Array<{ id: number, img: number, pos: number }> = []
    for (let p = -CARDS_PER_SIDE; p <= CARDS_PER_SIDE; p++) {
      initial.push({
        id: idCounter.current++,
        img: imgCounter.current++ % ALL_IMAGES.length,
        pos: p
      })
    }
    setStack(initial)
  }, [])

  const doAnimation = useCallback(() => {
    const cardId = idCounter.current++
    const cardImg = imgCounter.current++ % ALL_IMAGES.length
    const entryPos = comingFromLeft ? -CARDS_PER_SIDE - 2 : CARDS_PER_SIDE + 2

    const newCard = { id: cardId, img: cardImg, pos: entryPos }

    setNewCardId(cardId)
    setPhase('enter')
    setStack(prev => [...prev, newCard])

    setTimeout(() => {
      setPhase('move')
      const shift = comingFromLeft ? 1 : -1

      setStack(prev => prev.map(card => ({
        ...card,
        pos: card.id === cardId ? 0 : card.pos + shift
      })).filter(card => Math.abs(card.pos) <= CARDS_PER_SIDE + 2))
    }, 50)

    setTimeout(() => {
      setPhase('idle')
      setNewCardId(null)
      setStack(prev => prev.filter(card => Math.abs(card.pos) <= CARDS_PER_SIDE))
      setComingFromLeft(prev => !prev)
    }, 50 + SHIFT_DURATION)

  }, [comingFromLeft])

  useEffect(() => {
    if (stack.length === 0) return

    const timer = setInterval(doAnimation, PAUSE_DURATION + SHIFT_DURATION + 100)
    return () => clearInterval(timer)
  }, [doAnimation, stack.length])

  const getStyle = (card: { id: number, img: number, pos: number }) => {
    const isNew = card.id === newCardId
    const isMoving = phase === 'move'

    let x: number, rot: number, sc: number, z: number, op: number

    if (isNew && phase === 'enter') {
      x = comingFromLeft ? -280 : 280
      rot = comingFromLeft ? -25 : 25
      sc = 0.8
      z = 200
      op = 1
    } else {
      x = card.pos * MOBILE_GAP
      rot = card.pos === 0 ? 0 : card.pos * 3
      sc = 1 - Math.abs(card.pos) * 0.06
      z = 100 - Math.abs(card.pos) * 10
      op = Math.abs(card.pos) > CARDS_PER_SIDE ? 0 : 1

      if (isNew && isMoving) {
        z = 200
      }
    }

    const shouldAnimate = isMoving || (isNew && isMoving)

    return {
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      width: MOBILE_CARD_W,
      height: MOBILE_CARD_H,
      marginLeft: -MOBILE_CARD_W / 2,
      marginTop: -MOBILE_CARD_H / 2,
      transform: `translateX(${x}px) rotate(${rot}deg) scale(${sc})`,
      zIndex: z,
      opacity: op,
      transition: shouldAnimate
        ? `transform ${SHIFT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${SHIFT_DURATION}ms ease`
        : 'none',
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
      {stack.map(card => (
        <div key={card.id} style={getStyle(card)}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            // MODIFICATION: Removed red shadow
            boxShadow: card.pos === 0
              ? `0 25px 50px rgba(0,0,0,0.5)`
              : '0 15px 35px rgba(0,0,0,0.4)',
            // MODIFICATION: Removed red border
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <img
              src={ALL_IMAGES[card.img]}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              draggable={false}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)`,
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      ))}

      {/* MODIFICATION: REMOVED DOTS INDICATOR */}
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
      <div id="gallery" className={className} style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '700px', background: COLORS.bg, overflow: 'hidden' }}>
        <style jsx>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500&display=swap');`}</style>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${COLORS.red}08 0%, transparent 60%), ${COLORS.bg}`, pointerEvents: 'none' }} />
        <BoundaryFrame />

        {/* Header Section */}
        <div style={{ position: 'absolute', top: '90px', left: '24px', right: '24px', zIndex: 1 }}>
          <SectionCounter isMobile />
          <h2 style={{ fontFamily: FONTS.heading, fontSize: '32px', fontWeight: 900, lineHeight: 0.95, color: COLORS.text, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            MEMORIES<br />OF <span style={{ color: COLORS.red }}>ADVAY</span>.
          </h2>
        </div>

        {/* Carousel Section */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
          <MobileCarousel />
        </div>

        {/* Description Section */}
        <div style={{ position: 'absolute', bottom: '40px', left: '24px', right: '24px', zIndex: 1 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: '9px', letterSpacing: '0.15em', color: COLORS.textMuted, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
            <span style={{ color: COLORS.red, fontSize: '5px' }}>■</span> GALLERY COLLECTION
          </div>
          <p style={{ fontFamily: FONTS.body, fontSize: '12px', lineHeight: 1.6, color: COLORS.textMuted, margin: 0 }}>
            Every moment captured, every memory preserved. Relive the energy, creativity, and celebration that defines ADVAY.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id="gallery" className={className} style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '650px', maxHeight: '900px', background: COLORS.bg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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