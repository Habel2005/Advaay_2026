// src/components/canvas/Scene.tsx
'use client';
import { Suspense } from 'react'; 
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Hands } from './models/Hands';
import { Logo } from './models/Logo';
import { CosmicMist } from './Cosmicbg';

interface SceneProps {
  canPlayAnimations?: boolean;
  isPaused?: boolean; // New prop
}

export default function Scene({ canPlayAnimations = false, isPaused = false }: SceneProps) {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 30 }} 
      shadows 
      gl={{ antialias: true, powerPreference: "high-performance" }}
      // Optimization: "never" stops the render loop, "always" keeps it running
      frameloop={isPaused ? "never" : "always"}
    >
      <Suspense fallback={null}>
        <Environment preset="lobby" />
        <CosmicMist />
        <Logo canPlay={canPlayAnimations}/>
        <Hands canPlay={canPlayAnimations} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Suspense>
    </Canvas>
  );
}