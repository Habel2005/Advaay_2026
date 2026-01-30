// src/components/canvas/Scene.tsx
'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Hands } from './models/Hands'; // Import your model
import { ResponsiveFog } from './props/Responsivefog'; // Optional: move fog too!

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 30 }} shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
      <ResponsiveFog />
      <Suspense fallback={null}>
        <Environment preset="lobby" />
        <Hands/>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> 
      </Suspense>
    </Canvas>
  );
}