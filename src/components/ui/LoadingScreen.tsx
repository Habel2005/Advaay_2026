'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { COLORS } from '@/lib/constants'
import BoundaryFrame from './BoundaryFrame'

// ============================================
// IMAGES TO PRELOAD
// ============================================
const IMAGES_TO_PRELOAD = [
  '/images/hands-desktop.jpg',
  '/images/hands-mobile.jpg',
  // Add any other images here
]

// ============================================
// LOADING SCREEN COMPONENT
// ============================================
interface LoadingScreenProps {
  progress: number // External progress (fonts, scripts, etc.)
  onComplete: () => void
}

export default function LoadingScreen({ progress: externalProgress, onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const urlRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  
  // Image preloading state
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [imageProgress, setImageProgress] = useState(0)
  
  // Preload all images
  useEffect(() => {
    let loadedCount = 0
    const totalImages = IMAGES_TO_PRELOAD.length
    
    if (totalImages === 0) {
      setImagesLoaded(true)
      setImageProgress(100)
      return
    }
    
    const preloadPromises = IMAGES_TO_PRELOAD.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setImageProgress(Math.round((loadedCount / totalImages) * 100))
          resolve()
        }
        img.onerror = () => {
          // Resolve anyway to not block loading
          loadedCount++
          setImageProgress(Math.round((loadedCount / totalImages) * 100))
          resolve()
        }
        img.src = src
      })
    })
    
    Promise.all(preloadPromises).then(() => {
      setImagesLoaded(true)
    })
  }, [])
  
  // Combined progress: 70% external (scripts/fonts), 30% images
  const combinedProgress = Math.min(
    100,
    Math.round(externalProgress * 0.7 + imageProgress * 0.3)
  )
  
  // Only complete when BOTH external progress AND images are done
  const isFullyLoaded = externalProgress >= 100 && imagesLoaded
  
  // GSAP entrance animations
  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(urlRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(progressRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(promptRef.current,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.4 },
      '-=0.2'
    )
  }, { scope: containerRef })
  
  // Exit animation when FULLY loaded (external + images)
  useEffect(() => {
    if (isFullyLoaded) {
      gsap.to(promptRef.current, { opacity: 1, duration: 0.3 })
      
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete,
        })
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [isFullyLoaded, onComplete])
  
  // URL scramble effect
  const [scrambledUrl, setScrambledUrl] = useState('')
  const targetUrl = 'HTTPS://ADVAY.LIVE/2026/FEST/INIT'
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.'
    let iteration = 0
    
    const interval = setInterval(() => {
      setScrambledUrl(
        targetUrl.split('').map((char, i) => {
          if (i < iteration / 2) return targetUrl[i]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      
      iteration++
      if (iteration >= targetUrl.length * 2) {
        clearInterval(interval)
        setScrambledUrl(targetUrl)
      }
    }, 40)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.bg,
      }}
    >
      {/* Terminal URL - FIXED CENTERING */}
      <div
        ref={urlRef}
        style={{
          position: 'absolute',
          top: '24px',
          left: 0,
          right: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: COLORS.textMuted,
          letterSpacing: '0.12em',
        }}
      >
        {scrambledUrl}
      </div>
      
      {/* Progress */}
      <div ref={progressRef} style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.25em',
          color: COLORS.textMuted,
          marginBottom: '20px',
        }}>
          LOADING → <span style={{ color: COLORS.red }}>{combinedProgress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '180px',
          height: '1px',
          background: `${COLORS.textMuted}30`,
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${combinedProgress}%`,
            height: '100%',
            background: COLORS.red,
            boxShadow: `0 0 8px ${COLORS.red}`,
            transition: 'width 0.15s ease-out',
          }} />
        </div>
      </div>
      
      {/* Bottom Prompt */}
      <div
        ref={promptRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: COLORS.textMuted,
        }}
      >
        {isFullyLoaded ? (
          <><span style={{ color: COLORS.red }}>TAP</span> TO ENABLE SOUND</>
        ) : (
          'PREPARING EXPERIENCE'
        )}
      </div>
      
      {/* Boundary Frame on Loading Screen too */}
      <BoundaryFrame />
    </div>
  )
}