'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Preload, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useDeviceDetect, useMouseParallax, useGyroscope } from '@/hooks/useDeviceDetect'

// ============================================
// ADVAY 2026 COLOR PALETTE
// ============================================
const COLORS = {
  background: '#000000',
  textPrimary: '#E5E4E2',
  accentPrimary: '#E50914',
  accentSecondary: '#B20710',
}

// ============================================
// IMAGE PATHS - Place these in public/images/
// ============================================
const DESKTOP_HANDS_IMAGE = '/images/hands-desktop.jpg'
const MOBILE_HANDS_IMAGE = '/images/hands-mobile.jpg'

// ============================================
// LOGO PLACEHOLDER
// ============================================
interface LogoPlaceholderProps {
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
  isMobile: boolean
}

function LogoPlaceholder({ mouseX, mouseY, gyroGamma, gyroBeta, isMobile }: LogoPlaceholderProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const target = useRef({ rotX: 0, rotY: 0, posX: 0, posY: 0 })
  
  const logoScale = isMobile ? 0.75 : 1.5
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const inputX = isMobile ? gyroGamma * 0.3 : mouseX * 0.4
    const inputY = isMobile ? gyroBeta * 0.2 : mouseY * 0.25
    
    target.current.rotX += (inputY * 0.15 - target.current.rotX) * 0.05
    target.current.rotY += (inputX * 0.15 - target.current.rotY) * 0.05
    target.current.posX += (inputX * 0.25 - target.current.posX) * 0.05
    target.current.posY += (-inputY * 0.15 - target.current.posY) * 0.05
    
    groupRef.current.rotation.x = target.current.rotX
    groupRef.current.rotation.y = target.current.rotY
    groupRef.current.position.x = target.current.posX
    groupRef.current.position.y = target.current.posY
    
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
        <mesh ref={meshRef} scale={logoScale}>
          <torusKnotGeometry args={[0.7, 0.2, 100, 16]} />
          <meshStandardMaterial
            color={COLORS.accentPrimary}
            emissive={COLORS.accentPrimary}
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  )
}

// ============================================
// LIGHTING
// ============================================
function SceneLighting() {
  return (
    <>
      <ambientLight color="#1a0005" intensity={0.4} />
      <pointLight position={[0, 3, 5]} color="#ff2233" intensity={30} distance={15} decay={2} />
      <pointLight position={[-3, -1, 4]} color="#ff4455" intensity={20} distance={12} decay={2} />
      <pointLight position={[3, -1, 4]} color="#ff4455" intensity={20} distance={12} decay={2} />
      <pointLight position={[0, -3, 3]} color="#ff1122" intensity={15} distance={10} decay={2} />
      <pointLight position={[0, 0, -3]} color="#ff0000" intensity={10} distance={8} decay={2} />
    </>
  )
}

// ============================================
// CAMERA CONTROLLER
// ============================================
interface CameraControllerProps {
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
  isMobile: boolean
}

function CameraController({ mouseX, mouseY, gyroGamma, gyroBeta, isMobile }: CameraControllerProps) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  
  useFrame(() => {
    const inputX = isMobile ? gyroGamma * 0.015 : mouseX * 0.03
    const inputY = isMobile ? gyroBeta * 0.01 : mouseY * 0.02
    
    target.current.x += (inputX - target.current.x) * 0.03
    target.current.y += (inputY - target.current.y) * 0.03
    
    camera.position.x = target.current.x
    camera.position.y = target.current.y
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// ============================================
// SCENE CONTENT - No background color!
// ============================================
interface SceneContentProps {
  isMobile: boolean
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
}

function SceneContent({ isMobile, mouseX, mouseY, gyroGamma, gyroBeta }: SceneContentProps) {
  return (
    <>
      {/* NO background color - canvas is transparent */}
      
      {/* Lighting */}
      <SceneLighting />
      
      {/* Camera */}
      <CameraController 
        mouseX={mouseX} 
        mouseY={mouseY} 
        gyroGamma={gyroGamma} 
        gyroBeta={gyroBeta} 
        isMobile={isMobile} 
      />
      
      {/* Logo - centered between hands */}
      <LogoPlaceholder 
        mouseX={mouseX} 
        mouseY={mouseY} 
        gyroGamma={gyroGamma} 
        gyroBeta={gyroBeta} 
        isMobile={isMobile} 
      />
    </>
  )
}

// ============================================
// MAIN SCENE COMPONENT
// ============================================
interface SceneProps {
  className?: string
}

export default function Scene({ className = '' }: SceneProps) {
  const { isMobile } = useDeviceDetect()
  const mouse = useMouseParallax(1)
  const gyro = useGyroscope()
  const [showGyroPrompt, setShowGyroPrompt] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Preload images
  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.src = isMobile ? MOBILE_HANDS_IMAGE : DESKTOP_HANDS_IMAGE
  }, [isMobile])
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobile) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const needsPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      if (isIOS && needsPermission && gyro.permission === 'pending') {
        setShowGyroPrompt(true)
      } else if (!isIOS && gyro.permission === 'pending') {
        gyro.requestPermission()
      }
    }
  }, [isMobile, gyro.permission, gyro.requestPermission])
  
  const handleGyroPermission = async () => {
    try {
      await gyro.requestPermission()
      setShowGyroPrompt(false)
    } catch {
      setShowGyroPrompt(false)
    }
  }
  
  // Select background image based on device
  const backgroundImage = isMobile ? MOBILE_HANDS_IMAGE : DESKTOP_HANDS_IMAGE
  
  return (
    <div
      className={className}
      style={{
        position: 'absolute', // Changed from 'fixed' to 'absolute'
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%', // Changed from 100vw
        height: '100%', // Changed from 100vh
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#000000',
      }}
    >
      {/* Background Layer - Hands Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
      
      {/* Gyro Permission Button */}
      {showGyroPrompt && (
        <button
          onClick={handleGyroPermission}
          style={{
            position: 'absolute',
            top: '200px',
            left: '44px',
            zIndex: 100,
            padding: '0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: COLORS.textPrimary,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: COLORS.accentPrimary }}>TAP</span> TO ENABLE MOTION
        </button>
      )}
      
      {/* 3D Canvas - Transparent background */}
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0) // Fully transparent
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            isMobile={isMobile}
            mouseX={mouse.normalizedX}
            mouseY={mouse.normalizedY}
            gyroGamma={gyro.gamma}
            gyroBeta={gyro.beta}
          />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  )
}