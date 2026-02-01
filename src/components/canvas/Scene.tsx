// src/components/canvas/Scene.tsx
'use client';
import { Suspense, use, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Hands } from './models/Hands';
import { ResponsiveFog } from './props/Responsivefog';

interface SceneProps {
  canPlayAnimations?: boolean; // New prop to control animations
}

export default function Scene({ canPlayAnimations = false }: SceneProps) {
  const [canPlayAnimationsState, setCanPlayAnimationsState] = useState(canPlayAnimations); // Placeholder for future state management if needed
  return (
    <>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 30 }} shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
        <ResponsiveFog />

        <Suspense fallback={null}>
          <Environment preset="lobby" />
          <Hands canPlay={canPlayAnimations} />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Suspense>
      </Canvas>
    </>
  );
}