'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function CosmicMist() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Very subtle floating movement
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Large, soft blue particles */}
      <Sparkles 
        count={50} 
        scale={10} 
        size={6} 
        speed={0.2} 
        color="#0022cc" 
        opacity={0.5} 
      />
      {/* Smaller, brighter highlights */}
      <Sparkles 
        count={50} 
        scale={8} 
        size={5} 
        speed={0.5} 
        color="#00aaff" 
      />
    </group>
  );
}